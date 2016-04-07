/*function ToDo(str = 'World') {
  
  function hello() {
    console.log(`Hello ${str}`);
  }

  return {
    hello: hello
  }

}*/

/*
class ToDo {
  constructor(str = 'World') {
    this.str = str;
  }
  hello() {
    console.log(`Hello ${this.str}`);
  }
}
*/

/*
function ToDo(str) {
  str = str || 'World';
  this.str = str;
}

ToDo.prototype.hello = function () {
  console.log('Hello ' + this.str);
}
*/

export {ToDo};