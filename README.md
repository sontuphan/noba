# noba

The isometric test framework for javascript/typescript

## Get Started

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

## Develop

```bash
# Link
npm link

# Test
npm run pretest && noba-bare ./tmp/**/*.test.js

# If your machine had installed clearz
# npm run pretest && clearz && noba-bare ./tmp/**/*.test.js
```
