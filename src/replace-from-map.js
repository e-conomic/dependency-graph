module.exports = function(map, dep) {
	var paths = dep.split('/')
	var firstPath = paths[0]
	var fromMap = map[firstPath]
	if(firstPath == dep) {
		return fromMap || dep
	}

	if(fromMap == 'empty:') {
		return dep
	}

	if(fromMap) {
		paths[0] = fromMap
	}
	return paths.join('/')
}
