# The problem with tree shaking

This is a minimal demonstration of why tree shaking is not effective enough yet and in many real life use cases you should prefer having small files with specific functionality where you explicitly import only the files that you need (aka manual tree shaking)

## Details of example

[main.js](main.js)
```js
import {a} from './a';
console.log(a);
```

[a.js](a.js)
```js
import {c} from './c';
export function b() {
  console.log('this is not going to be in bundle');
  c();
}
export function a () {
  console.log('this is going to be in bundle');
}
```

[c.js](c.js)
```js
export function c() {
  console.log('this is not supposed to be in bundle, yet it is there');
}
```

If you clone this example and run `npm install && npm test` you'll see that [bundle.js](bundle.js) contains the function `c` (look for "this is not supposed to be in bundle, yet it is there") even though it is not needed. This is because webpack will include any symbol that is explicitly imported, even if it is not used by any of the previously imported symbols.

## Wait, isn't this just dead code in your app you should delete?

Nope, because I might have a different entry point, widget.js which does call `b`. Also, `a.js` might just as well be an external library, where some apps using do call `b`.

## Solution?

1) Give up on tree shaking :( and move function `b` (along with the `import {c} from './c';`) to `b.js`, which will not be bundled since your entry point doesn't import it.
2) [pure-module](https://github.com/webpack/webpack/tree/feature/pure-module/examples/pure-module) is supposed to fix this for imports inside libraries, not sure if it will do the same only apps such as this.

