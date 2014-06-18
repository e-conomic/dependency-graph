require('es6-shim')

var path = require('path')
var fs = require('fs')
var yargs = require('yargs')
var amdetective = require('amdetective')

var neo = require('./src/neo4j')

var args = yargs.argv

var startFile = args._[0]
var mainName = args.main || ''

var entryPoints = [].concat(args.entry || [])

var anonymousRequire = []

var contents = fs.readFileSync(startFile, 'utf8')

var modules = amdetective(contents)

var anonymous = modules.filter(function(module) {
	return typeof(module) == 'string'
})
if(anonymous.length > 0) {
	modules = modules
		.filter(function(module) {
			return typeof(module) != 'string' && module.name != mainName
		})
		.concat(anonymous.reduce(function(module, dep) {
			module.deps.push(dep)
			return module
		}, {
			name: mainName,
			deps: []
		}))
}

modules = modules
	// Find entry points
	.map(function(module) {
		var ret = {
			name: module.name,
			dependencies: module.deps,
		}
		if(~entryPoints.indexOf(module.name)) {
			ret.entry = true
		}
		return ret
	})


neo(modules)
	.then(console.log.bind(console, 'done'))
	.catch(function(err) {
		console.error(err)
		console.error(err.stack)
	})
