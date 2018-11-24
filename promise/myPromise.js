medule.exports = function Promise (execute) {

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
      self.onFulfilledCallback.forEach(fn => fn())
    }
  }
  // 状态变失败
  function reject (reason) {

    if (self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected';
      self.onRejectedCallback.forEach(fn => fn())
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
  // 保证 resolve 和 reject 只能执行一个.
  let called = false;
  // 判断x是否是函数或者对象
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    // 这里加trycatch 可以把 return 的then 的错误给捕捉到这里来并且发送到 newPromise
    try {
      // duckType  鸭子类型 如果他有then 方法 那么他就是一个 thenable
      let then = x.then;
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
  // 根据 Aplus 规范,返回一个新的promise 
  let newPromise = new Promise((resolve, reject) => {

    if(self.status === 'resolved'){
      try {
        // 保证异步,统一处置
        setTimeout(() => {
          let x = onFulfilled(self.value);
          resolvePromise(newPromise, x, resolve, reject);
        }, 0)
      } catch (err) {
        reject(err);
      }
    }
    if(self.status === 'rejected'){
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
            let x = onFulfilled(self.reason);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (err) {
            reject(err)
          }
        }, 0);
      });

      self.onRejectedCallback.push(() => {
        setTimeout(()=>{
          try {
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
