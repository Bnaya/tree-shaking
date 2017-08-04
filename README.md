# The problem with tree shaking

This is a minimal demonstration of why tree shaking is not effective enough yet and in most real life use cases you should prefer having small files with specific functionality where you explicitly import only the files that you need (aka Manual tree shaking® :D)

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

As you can see, [bundle.js](bundle.js) contains the function `c` (look for "this is not supposed to be in bundle, yet it is there") even though it is not needed. This is because webpack will include any symbol that is explicitly imported, even if it is not used by any of the previously imported symbols.

## I don't believe you, you are missing something

```sh
$ git clone git@github.com:shahata/tree-shaking.git
$ cd tree-shaking
$ npm install
$ npm test
$ grep "yet it is there" bundle.js
```
Found a mistake? [Tell me](https://github.com/shahata/tree-shaking/issues/new).

## Wait, isn't this just dead code in your app you should delete?

Nope, because I might have a different entry point, widget.js, which does call `b`. Also, `a.js` might just as well be an external library, where some apps do call `b`.

## Solution?

1) Give up on tree shaking :'( and move function `b` (along with the `import {c} from './c';`) to `b.js`, which will not be bundled since your entry point doesn't import it.
2) [pure-module](https://github.com/webpack/webpack/tree/feature/pure-module/examples/pure-module) is supposed to fix this for imports inside libraries, not sure if it will do the same for apps such as this, but I'm eagerly waiting for it to come out.

