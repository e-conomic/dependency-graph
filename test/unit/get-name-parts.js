describe('unit/get-name-parts.js', function() {
	var getNameParts = require('../../src/get-name-parts')
	var result
	describe('When testing the content:\n', function() {
		var tests = [
			['abc', { plugin: '', name: 'abc' }],
			['abc/def', { plugin: '', name: 'abc/def' }],
			['abc!def', { plugin: 'abc', name: 'def' }],
		]
		tests.forEach(function(test) {
			describe(test[0], function() {
				beforeEach(function() {
					result = getNameParts(test[0])
				})
				it('\nshould return the expected values', function() {
					expect(result).to.deep.equal(test[1])
				})
			})
		})
	})
})
