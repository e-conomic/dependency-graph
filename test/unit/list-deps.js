describe('unit/list-deps.js', function() {
	var listDeps = require('../../src/list-deps')
	var result

	describe('When testing the content:\n', function() {
		var tests = [
			['define(function() { return 1 })', []],
			['define(["abc"], function(abc) { return abc })', ['abc']],
			['define(["abc", "def"], function() { return abc })', ['abc', 'def']],
			['define([\'abc\', "def"], function() { return abc })', ['abc', 'def']],
			['define([\'abc\', "def",], function() { return abc })', ['abc', 'def']],
			['define([\'abc\',\n"def"], function() { return abc })', ['abc', 'def']],
			['define([\n\'abc\', "def"], function() { return abc })', ['abc', 'def']],
			['define([\'abc\', "def"], function() { return abc })', ['abc', 'def']],
			['define([\'abc\', "def"\n], function() { return abc })', ['abc', 'def']],
			['define([//test\n"abc", "def"], function() { return abc })', ['abc', 'def']],
			['define(["abc",//test\n "def"], function() { return abc })', ['abc', 'def']],
			['define(["abc", "def"//test\n], function() { return abc })', ['abc', 'def']],
			['define("name", ["abc"], function(abc) { return abc })', ['abc']],
			['define(\'name\', ["abc"], function(abc) { return abc })', ['abc']],
		]
		tests.forEach(function(test) {
			describe(test[0], function() {
				beforeEach(function() {
					result = listDeps(test[0])
				})
				it('\nshould return the expected values', function() {
					expect(result).to.deep.equal(test[1])
				})
			})
		})
	})

	describe('When testing the content:\n', function() {
		var tests = [
			['require(function() { return 1 })', []],
			['require(["abc"], function(abc) { return abc })', ['abc']],
			['require(["abc", "def"], function() { return abc })', ['abc', 'def']],
			['require([\'abc\', "def"], function() { return abc })', ['abc', 'def']],
			['require([\'abc\', "def",], function() { return abc })', ['abc', 'def']],
			['require([\'abc\',\n"def"], function() { return abc })', ['abc', 'def']],
			['require([\n\'abc\', "def"], function() { return abc })', ['abc', 'def']],
			['require([\'abc\', "def"], function() { return abc })', ['abc', 'def']],
			['require([\'abc\', "def"\n], function() { return abc })', ['abc', 'def']],
		]
		tests.forEach(function(test) {
			describe(test[0], function() {
				beforeEach(function() {
					result = listDeps(test[0])
				})
				it('\nshould return the expected values', function() {
					expect(result).to.deep.equal(test[1])
				})
			})
		})
	})

	describe('When testing the content:\n', function() {
		var tests = [
			['define(function() { return 1 })', []],
			['define([/* test */"abc"], function(abc) { return abc })', ['abc']],
			['define(["abc"/*bum*/, "def"], function() { return abc })', ['abc', 'def']],
			['define([\'abc\', "def"/*bang*/], function() { return abc })', ['abc', 'def']],
		]
		tests.forEach(function(test) {
			describe(test[0], function() {
				beforeEach(function() {
					result = listDeps(test[0])
				})
				it('\nshould return the expected values', function() {
					expect(result).to.deep.equal(test[1])
				})
			})
		})
	})

	describe('When requesting plugins:\n', function() {
		var tests = [
			['define(["abc!def"], function(abc) { return abc })', ['abc', 'abc!def']],
		]
		tests.forEach(function(test) {
			describe(test[0], function() {
				beforeEach(function() {
					result = listDeps(test[0])
				})
				it('\nshould return the expected values', function() {
					expect(result).to.deep.equal(test[1])
				})
			})
		})
	})
})
