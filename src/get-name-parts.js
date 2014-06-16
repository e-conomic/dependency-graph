module.exports = function(dep) {
	var split = dep.split('!')
	if(split.length == 1) {
		return { plugin: '', name: dep }
	} else {
		return { plugin: split[0], name: split[1] }
	}
}
