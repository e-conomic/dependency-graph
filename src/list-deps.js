module.exports = parse

function parse(file) {
	var results = file.match(/(?:define|require)\(\[((?:.|[\n\r])+?)\]/m)
	return (results || ['', ''])[1].split(',').map(function(dep) {
		return dep.trim().slice(1, -1)
	})
	.filter(function(dep) {
		return !!dep
	})
}
