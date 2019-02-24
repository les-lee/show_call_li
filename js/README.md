# js相关的call li

- 通过函数式编程的思想,限制fn的参数个数,防止多传.

```js
const ary = (fn, n) => (...args) => fn(...args.slice(0, n));
```

- 判断是否是表单元素

`isVal = {input:1, textarea:1}[this.tagName.toLowerCase()]`

此方法可以适用于其他场景,判断简洁.

- html 字符串转普通字符串的巧妙实现

```js
export function html2Text(val) {
  const div = document.createElement('div')
  // 利用浏览器的原生解析. 不用自己傻傻的写正则表达式.
  div.innerHTML = val
  return div.textContent || div.innerText
}
```

## 函数执行性能

- 函数防抖,某个函数执行之前一段时间内,不可以执行, 必须要等一段时间之后他才可以执行.

```js
debounce: function (func, wait, scope) {
    var timeout;
    return function () {
        var context = scope || this, args = arguments;
        var later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

- **防抖**改良版本,让函数的调用更接近节流,更紧凑,虽然看上去跟节流差不多.但是这个版本,不会出现节流中调用多次的情况.一般使用这个即可,较稳定.

```js
// immediate: 代表是否在时间边界执行函数(即立即执行一次), 默认为 true

// 这个其实可以说是节流了
function debounce (fn, wait, immediate = true) {
  let result, timeslot, timer = null, last, now, context, args;
  // 定义一个函数来处理时间差的问题
  function later () {
    now = +new Date();
    timeslot = now - last;
    // 小于限定时间, 重置定时器.
    if (timeslot < wait) {
      clearTimeout(timer)
      timer = setTimeout(later, wait - timeslot)
    } else {
      // 重置timer 让下一次可以后立即执行
      timer = null;
      // 在限定边界已经执行的话,这里的延迟执行就要省略,不然会出现调用多次的情况.
      if (!immediate) {
        result = fn.apply(context, args)
        if (!timer) context = args = null;
      }
    }
  }
  return function (args) {
    args = [].slice.apply(arguments)
    context = this;
    last = +new Date();
    // 判断是否是第一次和超过限定时间后的第一次.
    if (immediate && !timer) {
      result = fn.apply(this, args)
      context = args = null;
    }
    timer = setTimeout(later, wait)
    return result;
  }
}

// 使用


var a = {
  debounce: debounce(function () {
    console.log(this, 'hehe');
  }, 3000, true)
}
a.debounce()
a.debounce()
a.debounce()
a.debounce()
a.debounce()
// 只会执行一次因为同步很快,

setTimeout(() => a.debounce(), 4000)
setTimeout(() => a.debounce(), 5000)
setTimeout(() => a.debounce(), 6000)

// 只会执行2次 因为 4-5-6 间隔都不足3秒
```

- 函数节流, 一段时间内只会执行一次,时间要比函数防抖的紧凑.

节流 节流 意思就是 流是一定要流的, 只不过要减少次数而已

比如我在一个时间段的段尾执行了一次该函数,我可以再下一个时间头又执行一次.但是第三次就要在下一个时间段执行了. 如果执行的间隔本来就接近设定的时间间隔,会出现重复多次调用的情况,但是这种情况不影响概念,因为这样一来这个函数本来就具有了间隔执行的属性,不存在节流.

时间线是这样的: `--||--|--` (竖线代表执行,横线代表中空段,每3个位置代表一个时间间隔)

```js
function throttel (fn, throtteltime) {
  let tiemr, last, context;
  
  return function (...args) {
    context = this;
    let now = +new Date();
    if (now-last < throrreltime) {
      clearTimeout(timer);
      setTimeout(() => {
        last = now
        fn.apply(context, args)
      },throrreltime)
    } else {
      last = now;
      fn.apply(context, args)
    }

  }
}
```

- 字符串转对象,巧用 `JSON.parse`

```js
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}
```

## generator && promsie 的配合

```js
function run (func) {
  var arg = [].slice.call(arguments, 1)
  var it = func.apply(this, arg)
  return Promise.resolve().then(function handleNext (value) {
    var next = it.next(value)
    return (function handleResult (next) {
      if (next.done) {
        return next.value
      } else {
        return Promise.resolve(next.value).then(handleNext, function handleError(err) {
          return Promise.resolve(it.throw(err)).then(handleResult)
        })
      }
    })(next)
  })
}

function *test () {
  var obj = yield foo()
  console.log('obj', obj)
  var beijing = yield foo(1)
  console.log('beijing', beijing)
  var shanghai = yield foo(2)
  console.log('shanghai', shanghai)
}

run(test)

// then everything run
```