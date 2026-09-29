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

Create a file `./tests/my-first.test.js` to write your first test.

```js
// ./tests/my-first.test.js

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

Test files are ES modules, so your `package.json` needs `"type": "module"` (or name the files `*.test.mjs`).

# Run the test

Pass the test files to `noba`. Noba does not search for tests on its own: with no files it runs nothing and exits successfully.

```bash
# Node
npx noba ./tests/*.test.js

# Bare
npx noba-bare ./tests/*.test.js
```

The glob is expanded by your shell, not by Noba. To run nested folders such as `./tests/**/*.test.js`, use a shell that supports `**` (zsh, or bash with `shopt -s globstar`).

You can also add a script to `package.json` so that `npm test` works:

```json
{
  "scripts": {
    "test": "noba ./tests/*.test.js"
  }
}
```

# TypeScript

Install a TypeScript runner locally and pass it with `--register`:

```bash
npm i -D tsx
npx noba --register tsx ./tests/*.test.ts
```

See [CLI](/sontuphan/noba/wiki/cli) for all flags, and [References](/sontuphan/noba/wiki/references) for `describe`, `test`, hooks and `each`.
