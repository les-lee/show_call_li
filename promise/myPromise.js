// 这里是工具函数,为了移植方便写在同一个文件里面
function isThenable (value) {
  return (value && (typeof value === 'object' && typeof value.then === 'function'))
}



// promise 从这里开始

function Promise (execute) {

  let self = this;
  self.value = undefined; // promise的结果
  self.reason = undefined;  // 错误的信息
  self.status = 'pending' // 状态值 可使用 bitmark 做性能优化
  self.onFulfilledCallback = [];
  self.onRejectedCallback = [];

  // 状态由pending => resolved
  function resolve (value) {

    if (self.status === 'pending') {
      self.value = value;
      self.status = 'resolved';
      self.onFulfilledCallback.forEach(fn => fn(self.value))
    }
  }
  // 状态变失败
  function reject (reason) {

    if (self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected';
      self.onRejectedCallback.forEach(fn => fn(self.reason))
    }
  }
  // 捕捉错误
  try {
    execute(resolve, reject);
  } catch (err){
    reject(err)
  }
}


function resolvePromise (newPromise, x, resolve, reject) {
  if (newPromise === x) {
    return reject(new TypeError('can not return the same promise')); // 因为返回同一个promise不符合promiseAplus 规范
  }
  let called = false;
  // 判断x是否是函数或者对象
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    // 这里加trycatch 可以把 return 的then 的错误给捕捉到这里来并且发送到 newPromise
    try {
      // duckType  鸭子类型 如果他有then 方法 那么他就是一个 thenable
      var then = x.then;
      if (typeof then === 'function') {
        then.call(x, value => {
          if (called); return;
          called = true
          // value 有可能还是一个 promise
          resolvePromise(newPromise, value, resolve, reject)

        }, (err) => {
          if (called); return;
          called = true;
          reject(err)
        })
      } else {
        // 普通对象直接发送;
        resolve(x);
      }
    } catch (err) {
      if(called); return;
      called = true;
      reject(err);
    }

  } else {
    // 发送普通值
    resolve(x)
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  let self = this;
  let newPromise = new Promise((resolve, reject) => {

    if(self.status === 'resolved'){
      try {
        setTimeout(() => {
          let x = onFulfilled(self.value);
          resolvePromise(newPromise, x, resolve, reject);
        }, 0)
      } catch (err) {
        reject(err);
      }
    }
    if(self.status === 'rejected'){
      console.log('到这里了')
      try {
        setTimeout(() => {

          let x = onRejected(self.reason);
          resolvePromise(newPromise, x, resolve, reject);
        }, 0)
      } catch (err) {
        reject(err)
      }
    }

    if (self.status === 'pending') {

      self.onFulfilledCallback.push(() => {
        setTimeout(() => {
          try {
            let x = onFulfilled(self.value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (err) {
            reject(err)
          }
        }, 0);
      });

      self.onRejectedCallback.push(() => {
        setTimeout(()=>{
          try {
            // 这里存在一种情况就是 onrejected 漏传, 这里会报 not a function 的错误 如果在这里判空 那就捕捉不到这个错误了
            let x = onRejected(self.reason);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (err) {
            reject(err)
          }
        }, 0)
      });
    }

  });

  return newPromise;
}

Promise.resolve = function (value) {
  // 原生的这里会判断 value 是否是promise
  // 或者 thenable 或者普通值
  // 如果是Promise 直接返回他自己, 无论这个Promise的值是完成或者是拒绝状态 
  //这只能在本库中运行, 不能与其他Promise兼容 因为,判断不了其他库的原型
  if (value instanceof Promise) {
    return value;
  }

  if (isThenable(value)) {
    // 展开这个对象 直到他的值不是 thenable 
    // 这里的展开并不递归的展开所有, 因为这种情况可以出现多个then
    // 因为 resolve 或者 reject 一个Promise 只能执行一次,所以只会展开当前对象
    return new Promise (function (resolve, reject) {
      // 把thenable的值传递给当前的Promise
      value.then(resolve);
    });
  }
  // 如果是普通值, 那就把值传递给当前的Promise就好了
  return new Promise((resolve, reject) => resolve(value));
}

Promise.reject = function (value) {
  return new Promise((resolve, reject) => reject(value));
}

module.exports = Promise