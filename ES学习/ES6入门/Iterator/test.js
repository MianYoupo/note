var obj = {
  data:['hello','world','heheh'],
  [Symbol.iterator](){
    var self = this
    var index = 0;
    return {
      next:function () {
        if (index == self.data.length) return { value:undefined, done: true }
        return { value: self.data[index++], done: false }
      }
    }
  }
}

for(var i of obj){
  console.log(i);
}

var objTest=  {
  [Symbol.iterator](){
    var index = 0;
    return{
      next:function(){
        if(index>100) return {value:undefined,done:true}
        return {value:index++, done:false}
      }
    }
  }
}

for(var i of objTest) {
  console.log(i)
}

function objTest(value) {
  this.value = value
  this.next = null
}

var one = new objTest(1)
var one = new objTest(2)
var three = new objTest(3)