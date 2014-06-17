require('es6-shim')

var path = require('path')
var fs = require('fs')

var listDeps = require('./src/list-deps')
var splitPath = require('./src/split-path')
var getNameParts = require('./src/get-name-parts')
var replaceFromMap = require('./src/replace-from-map')

var args = process.argv.slice(2)

var startFile = args[0]
var requireConf = args[1]

var conf = requireConf ? require(path.join(process.cwd(), requireConf)) : {}

var baseUrl = path.dirname(startFile)

var resolvedDeps = { module: 'empty:', exports: 'empty:' }

var pathMap = conf.paths || {}

Object.keys(pathMap).forEach(function(key) {
	if(pathMap[key] == 'empty:') {
		resolvedDeps[key] = pathMap[key]
	}
})
;(conf.exclude || []).forEach(function(excluded) {
	resolvedDeps[excluded] = 'empty:'
})

replaceFromMap = replaceFromMap.bind(null, pathMap)

var depsToResolve = [ {
	file: startFile,
	name: path.relative(baseUrl, startFile).replace(path.extname(startFile), '')
} ]

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
	resolvedDeps[nextDep.name] = deps
	depsToResolve = depsToResolve.concat(deps)
} while(depsToResolve.length > 0)

console.log(resolvedDeps)

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
