require('es6-shim')

var fs = require('fs')
var yargs = require('yargs')
var amdetective = require('amdetective')
var concat = require('concat-stream')

var neo = require('./src/neo4j')
var resolveAnonymousModule = require('./src/resolve-anonymous-module')
var cleanModules = require('./src/clean-modules')

var args = yargs
	.usage('Usage: $0 [<minified-js>]\n'+
		'If the minified file is not provided, it expects to get it piped in.')
	.example('curl <http-to-file> | $0', 'Pipe from curl')
	.example('$0 <local-file>', 'Read from local file')
	.option('entry', {
		alias: 'e',
		default: [ 'default', 'sledgehammer/setup', 'bank/transfer-journal' ],
		describe: 'The modules that should be marked as entry-points',
	})
	.option('help', {
		alias: 'h',
		describe: 'Prints help message',
	})
	.boolean('help')
	.option('m', {
		alias: 'main',
		default: 'default',
		describe: 'The name of the main bundle',
	})

var helpText = args.help()

args = args.argv

if(args.help) {
	console.log(helpText)
	return
}

var mainName = args.main
var entryPoints = [].concat(args.entry)

var startFile = args._[0]
if(startFile) {
	var contents = fs.readFileSync(startFile, 'utf8')
	parse(contents)
} else {
	process.stdin.pipe(concat(parse))
}

function parse(contents) {
	var modules = amdetective(contents)

	modules = resolveAnonymousModule(modules, mainName)
	modules = cleanModules(modules, entryPoints)

	neo(modules)
		.then(console.log.bind(console, 'done'))
		.catch(function(err) {
			console.error(err)
			console.error(err.stack)
	})
}
