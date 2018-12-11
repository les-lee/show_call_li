let MyPromise = require('./MyPromise.js');

new MyPromise(function (resolve, reject) {
  setTimeout(() => {
    // console.log(333);
    // resolve('resolve');
  }, 2000);
  name = 3;
}).then((value) => {
  console.log(value)
})

// var p1 = new Promise(function (resolve, reject) {

// })

var p1 = {
  then: function (resolve, reject) {
    resolve('333');
  }
}

// var p1 = {
//   then: function (resolve, reject) {
//     resolve('333');
//   }
// }

// console.log(p1 instanceof MyPromise);


// var p2 = MyPromise.resolve(p1)
MyPromise.resolve(p1).then((value) => {
  console.log(value)
  },
  function () {
    
  });
// Promise.resolve(p1).then((value) => {console.log(value)})

// console.log(p1===p2);

