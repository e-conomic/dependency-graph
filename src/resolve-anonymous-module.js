module.exports = function(modules, mainName) {
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

	return modules
}
