var path = require('path')
module.exports = function(modules, entryPoints) {
	var excludedModules = []
	return modules
		// Find entry points
		.map(function(module) {
			// Find the relative url
			var base = path.dirname(module.name)

			// Resolve relative dependencies
			var ret = {
				name: module.name,
				dependencies: module.deps.map(function(dep) {
					if(dep[0] == '.') {
						dep = path.join(base, dep)
					}

					// Discover if the module exists, or has been excluded
					if(!~excludedModules.indexOf(dep) && !modules.find(function(module) {
						return module.name == dep
					})) {
						excludedModules.push(dep)
					}

					return dep
				}),
			}

			// Set entry if this in an entry point
			if(~entryPoints.indexOf(module.name)) {
				ret.entry = true
			}
			return ret
		})
		.concat(excludedModules.map(function(dep) {
			return { name: dep, dependencies: [] }
		}))
}
