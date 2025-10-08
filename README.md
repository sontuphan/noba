# noba

The isometric test framework for javascript/typescript

## Getting Started

Install

```bash
npm i -D noba
```

In `tests`, create `unit.test.js`

```js
import { describe } from 'noba'

describe('sum', ({ test }) => {
  test('should add 1 and 1', ({ assert }) => {
    assert.equal(1 + 1, 2)
  })
})
```

```bash
npx noba ./tests/*.test.js
```

## Documentation

[📖 Wiki](https://github.com/sontuphan/noba/wiki)
