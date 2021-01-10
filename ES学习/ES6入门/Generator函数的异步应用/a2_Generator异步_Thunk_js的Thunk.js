//正常版本的 readFile
fs.readFile(fileName, callback)

var Thunk = function(fileName) {
  return function(callback) {
    return fs.readFile(fileName, callback)
  }
}

var readFileThunk = Thunk(fileName)
readFileThunk(callback)