let MyPromise = require('./MyPromise.js');

new MyPromise(function (resolve, reject) {
  setTimeout(() => {
    console.log(333);
    resolve('resolve');
  }, 2000);
}).then((value) => {
  console.log(value)
})
