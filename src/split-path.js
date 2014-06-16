module.exports = splitPath

function splitPath(path) {
	return path.split('/').map(function(item, idx, arr) {
		return arr.slice(0, idx+1).join('/')
	})
}
