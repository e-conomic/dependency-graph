var neo4j = require('neo4j')

var graph = new neo4j.GraphDatabase('http://localhost:7474')

module.exports = function(modules) {
	return deleteAll()
		.then(function() {
			var nodes = []
			var relations = []
			modules.forEach(function(module) {
				var deps = module.dependencies
				var name = module.name
				var normalName = normalizeName(name)
				nodes.push('(' + normalName + (module.entry?':Entry':'')+
					':Module { name: "' + name + '"})')
				if(Array.isArray(deps)) {
					relations = relations.concat(deps.map(function(dep) {
						return '('+normalName+')-[:DEPENDS_ON]->('+normalizeName(dep)+')'
					}))
				}
				if(module.entry) {
					nodes.push('(entry'+normalName+':Entry)-[:RUNS]->('+normalName+')')
				}
			})

			return 'CREATE\n' + nodes.concat(relations).join(',\n')
		})
		.then(function(query) {
			return new Promise(function(resolve, reject) {
				graph.query(query, function(err) {
					if(err) return reject(err)
					resolve()
				})
			})
		})
}

function deleteAll() {
	return new Promise(function(resolve, reject) {
		graph.query('MATCH (n)-[r]-(), (n2) DELETE n, r, n2', function(err) {
			if(err) return reject(err)
			resolve()
		})
	})
}

function normalizeName(name) {
	return name.replace(/[!-\/.]/g, '_')
}
