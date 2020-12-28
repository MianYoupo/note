function readLinesSync(file) {
  return {
    [Symbol.iterator](){
      return {
        next() {
          return {done:false}
        },
        return() {
          file.close()
          return {done: true}
        }
      }
    }
  }
}