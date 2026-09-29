# noba

The isometric test framework for JavaScript and TypeScript. Write once, test everywhere.

Noba runs the same test files on Node.js and Bare, with a Jest-like API. No more duplicating a suite across Jest and Brittle to cover both runtimes.

## Why Noba

- **Runtime-agnostic.** Tests rely on minimal JavaScript primitives, not on a runtime's standard library or module loader.
- **Familiar.** `describe`, `test`, `it`, `each`, lifecycle hooks, and both `expect` and `assert` matchers.
- **TypeScript-first.** Typed APIs throughout, with type narrowing where it helps.
- **Batteries included.** Spies, module mocks, timeouts, global setup and teardown, and coverage reports on both runtimes.

## Quick start

```bash
npm i -D noba
```

```js
// ./tests/sum.test.js
import { describe } from 'noba'

describe('sum', ({ test }) => {
  test('should add 1 and 1', ({ expect }) => {
    expect(1 + 1).toBe(2)
  })
})
```

```bash
npx noba ./tests/*.test.js       # Node.js
npx noba-bare ./tests/*.test.js  # Bare
```

## Documentation

📖 [Wiki](https://github.com/sontuphan/noba/wiki): [Getting Started](https://github.com/sontuphan/noba/wiki/getting-started) · [CLI](https://github.com/sontuphan/noba/wiki/cli) · [References](https://github.com/sontuphan/noba/wiki/references) · [Expect](https://github.com/sontuphan/noba/wiki/expect) · [Assert](https://github.com/sontuphan/noba/wiki/assert) · [Spy](https://github.com/sontuphan/noba/wiki/spy) · [Mock](https://github.com/sontuphan/noba/wiki/mock)

## License

[MIT](./LICENSE)
