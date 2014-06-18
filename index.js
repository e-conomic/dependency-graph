require('es6-shim')

var fs = require('fs')
var yargs = require('yargs')
var amdetective = require('amdetective')

var neo = require('./src/neo4j')
var resolveAnonymousModule = require('./src/resolve-anonymous-module')
var cleanModules = require('./src/clean-modules')

var args = yargs
	.usage('Usage: $0 <minified-js>')
	.option('entry', {
		alias: 'e',
		default: [ 'default', 'sledgehammer/setup', 'bank/transfer-journal' ],
		describe: 'The modules that should be marked as entry-points',
	})
	.option('m', {
		alias: 'main',
		default: 'default',
		describe: 'The name of the main bundle',
	})
	.demand(1)
	.argv

var mainName = args.main
var entryPoints = [].concat(args.entry)

var startFile = args._[0]
var contents = fs.readFileSync(startFile, 'utf8')

var modules = amdetective(contents)

modules = resolveAnonymousModule(modules, mainName)
modules = cleanModules(modules, entryPoints)

neo(modules)
	.then(console.log.bind(console, 'done'))
	.catch(function(err) {
		console.error(err)
		console.error(err.stack)
	})
