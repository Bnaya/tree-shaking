import {c} from './c';

export function b() {
  console.log('this is not going to be in bundle');
  c();
}

export function a () {
  console.log('this is going to be in bundle');
}
