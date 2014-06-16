describe('unit/split-path', function() {
	var splitPath = require('../../src/split-path')
	var result
	describe('When testing the path:\n', function() {
		var tests = [
			['abc', ['abc']],
			['abc/def', ['abc', 'abc/def']],
			['abc/def/ghi', ['abc', 'abc/def', 'abc/def/ghi']],
			['abc/def/ghi/jkl', ['abc', 'abc/def', 'abc/def/ghi', 'abc/def/ghi/jkl']],
			['abc/def/ghi/jkl/mno', ['abc', 'abc/def', 'abc/def/ghi', 'abc/def/ghi/jkl', 'abc/def/ghi/jkl/mno']],
		]
		tests.forEach(function(test) {
			describe(test, function() {
				beforeEach(function() {
					result = splitPath(test[0])
				})
				it('\nshould resolve as expected', function() {
					expect(result).to.deep.equal(test[1])
				})
			})
		})
	})
})
