# js相关的call li

1. 通过函数式编程的思想,限制fn的参数个数,防止多传.

```js
const ary = (fn, n) => (...args) => fn(...args.slice(0, n));
```