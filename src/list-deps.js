module.exports = parse

function parse(file) {
	var results = file.match(/(?:define|require)\(\[((?:.|[\n\r])+?)\]/m)
	var dependencies = (results || ['', ''])[1]
	dependencies = dependencies.split(/[\r\n]/g).map(function(line) {
		return line.replace(/\/\/.*$/, '')
	}).join('')
	.replace(/\/\*(?:.|[\n\r])*\*\//g, '')

	return [].concat.apply([], dependencies.split(',').map(function(dep) {
		return dep.trim().slice(1, -1)
	})
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
