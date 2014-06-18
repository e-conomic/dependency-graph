module.exports = parse

var searchRegexp = new RegExp(
	// The calling function
	'^(?:define|require)\\('+
	'(?:'+
		// Finding array-dependencies
		'(?:'+
			// Optional module name
			'(?:[^\\[]+,[\n\r ]*)?'+
			// Array of dependencies
			'\\[((?:.|[\n\r])*?)\\]'+
		')'+
	'|'+
		// Finding sync deps
		'(?:[\'"]([^,\\[\\)]+)["\'])'+
	')'
	,'m'
)

var commentsRegex = /^(\/\/.*[\n\r])|(\/\*(?:.|[\r\n])*\*\/)/m

function parse(file) {
	var results = file.trim().replace(commentsRegex,'').match(searchRegexp)

	if(!results) return []

	var dependencies = (results || ['', ''])[1]

	if(dependencies) {
		dependencies = dependencies.split(/[\r\n]/g).map(function(line) {
			return line.replace(/\/\/.*$/, '')
		}).join('')
		.replace(/\/\*(?:.|[\n\r])*\*\//g, '')

		dependencies = [].concat.apply([], dependencies.split(',')
			.map(function(dep) {
				return dep.trim().slice(1, -1)
			})
		)
	} else {
		dependencies = [results[2]]
	}
	return [].concat.apply([], dependencies
		.filter(function(dep) {
			return !!dep
		})
		.map(function(dep) {
			var pluginSplit = dep.split('!')
			if(pluginSplit.length == 2) {
				pluginSplit[1] = pluginSplit.join('!')
			}
			return pluginSplit
		})
	)
}
