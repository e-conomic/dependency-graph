require('es6-shim')

var path = require('path')
var fs = require('fs')
var yargs = require('yargs')

var listDeps = require('./src/list-deps')
var splitPath = require('./src/split-path')
var getNameParts = require('./src/get-name-parts')
var replaceFromMap = require('./src/replace-from-map')

var neo = require('./src/neo4j')

var args = yargs.argv

var startFiles = args._
var requireConf = args.requireConf
var baseUrl = args.baseurl

var conf = requireConf ? require(path.join(process.cwd(), requireConf)) : {}

if(!baseUrl) {
	// should find the common parent dir
	baseUrl = path.dirname(startFiles[0])
}

var resolvedDeps = {
	module: {
		name: 'module',
		file: 'empty:',
		external: true,
	},
	exports: {
		name: 'exports',
		file: 'empty:',
		external: true,
	},
}

var pathMap = conf.paths || {}

Object.keys(pathMap).forEach(function(key) {
	if(pathMap[key] == 'empty:') {
		resolvedDeps[key] = {
			external: true,
			file: pathMap[key],
			name: key,
		}
	}
})
;(conf.exclude || []).forEach(function(excluded) {
	resolvedDeps[excluded] = {
		name: excluded,
		file: 'empty:',
		excluded: true,
	}
})

replaceFromMap = replaceFromMap.bind(null, pathMap)

var depsToResolve = startFiles.map(function(startFile) {
	return {
		file: startFile,
		name: path.relative(baseUrl, startFile).replace(path.extname(startFile), ''),
		entry: true,
	}
})

do {
	var nextDep = depsToResolve.shift()
	if(resolvedDeps[nextDep.name]) {
		continue
	}

	var parts = getNameParts(nextDep.name)

	var contents = fs.readFileSync(nextDep.file, 'utf8')

	var currentDir = path.dirname(parts.name)
	var deps = listDeps(contents)
	// resolve relative paths and maps first
	.map(function(dep) {
		var retur = {
			name: dep
		}
		var parts = getNameParts(dep)
		if(parts.plugin) {
			parts.plugin += '!'
		}
		var name = parts.name

		if(name[0] == '.') {
			name = path.join(currentDir, name)
		} else {
			var afterReplace = replaceFromMap(name)

			if(afterReplace == 'empty:') {
				return { name: dep }
			}

			if(afterReplace) {
				retur.org = retur.name
				name = afterReplace
			}
		}
		retur.name = parts.plugin + name
		return retur
	})
	// resolve extension and filename
	.map(function(dep) {
		dep.file = getFilename(dep.name)
		return dep
	})

	nextDep.dependencies = deps.map(function(dep) {
		return dep.name
	})
	resolvedDeps[nextDep.name] = nextDep
	depsToResolve = depsToResolve.concat(deps)
} while(depsToResolve.length > 0)

neo(Object.keys(resolvedDeps).map(function(key) { return resolvedDeps[key] }))
	.then(console.log.bind(console, 'done'))
	.catch(function(err) {
		console.error(err)
		console.error(err.stack)
	})

function getFilename(name) {
	var parts = getNameParts(name)
	if(parts.plugin == 'text') {
	} else if(!parts.name.match(/\.jsx?$/)) {
		parts.name += '.js'
		if(parts.plugin == 'jsx') {
			parts.name += 'x'
		}
	}

	return path.join(baseUrl, parts.name)
}
