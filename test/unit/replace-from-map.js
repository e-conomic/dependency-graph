describe('unit/replace-from-map.js', function() {
	var replaceFromMap = require('../../src/replace-from-map')
	var map = {
		'a': 'A',
		'b': 'B/C',
		'c': 'empty:',
	}
	var result

	describe('When testing the map against:\n', function() {
		[
			[ 'abc', 'abc' ],
			[ 'a', 'A' ],
			[ 'a/b', 'A/b' ],
			[ 'b', 'B/C' ],
			[ 'b/c', 'B/C/c' ],
			[ 'c', 'empty:' ],
			[ 'c/d', 'c/d' ],
		].forEach(function(test) {
			describe(test[0], function() {
				beforeEach(function() {
					result = replaceFromMap(map, test[0])
				})
				it('\nshould be as expected', function() {
					expect(result).to.equal(test[1])
				})
			})
		})
	})
})
