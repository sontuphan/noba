# Install

```bash
# With npm
npm i -D noba

# With yarn
yarn add -D noba

# With pnpm
pnpm add -D noba
```

# Write a test

Create a file `./tests/my-first.test.ts` to write your first test.

```ts
// ./tests/my-first.test.ts

import { describe } from 'noba'

describe('my first test', ({ test }) => {
  test('should be ok', ({ assert }) => {
    assert.isOk(true)
  })

  test('should be falsy', ({ expect }) => {
    expect(false).to.be.falsy()
  })
})
```

# Run the test

```bash
npx noba
```

> In another way, you can add `"test": "noba"` to `scripts` in `package.json` so that you can do `npm test`.
