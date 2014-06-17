module.exports = parse

function parse(file) {
	var results = file.match(/(?:define|require)\(\[((?:.|[\n\r])+?)\]/m)
	var dependencies = (results || ['', ''])[1]
	dependencies = dependencies.split(/[\r\n]/g).map(function(line) {
		return line.replace(/\/\/.*$/, '')
	}).join('')
	return dependencies.split(',').map(function(dep) {
		return dep.trim().slice(1, -1)
	})
	.filter(function(dep) {
		return !!dep
	})
}
