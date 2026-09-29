# Welcome to Noba - The isometric testing framework.

Let's build your runtime-neutral tests. Write once, test everywhere.

🚀 [Getting Started](/sontuphan/noba/wiki/getting-started)

🤖 [CLI](/sontuphan/noba/wiki/cli) · [Global Setup and Teardown](/sontuphan/noba/wiki/global-setup-and-teardown)

📖 [References](/sontuphan/noba/wiki/references) · [Expect](/sontuphan/noba/wiki/expect) · [Assert](/sontuphan/noba/wiki/assert) · [Spy](/sontuphan/noba/wiki/spy) · [Mock](/sontuphan/noba/wiki/mock)

✅ [Examples](/sontuphan/noba/tree/master/tests)

```js
import { describe } from 'noba'

describe('sum', ({ test }) => {
  test('should add 1 and 1', ({ expect }) => {
    expect(1 + 1).toBe(2)
  })
})
```

```bash
noba ./tests/*.test.js       # Node.js
noba-bare ./tests/*.test.js  # Bare
```

# Introduction

To enhance the developer experience (DX) for `wdk-wallet-*` and `wdk-protocol-*`, and to foster seamless team collaboration, our current testing approach needs improvement. We face several challenges with both manual and automated testing:

- **Dual Test Runners.** Maintaining both Jest and Brittle for NodeJS and Bare targets leads to duplicated tests. This results in:

  - Slower development cycles
  - Increased risk of errors when porting tests back and forth

- **Brittle Limitations.** Brittle lacks essential features for comprehensive testing, such as mocking, spying, advanced matchers, type safety, and robust reporting.

- **Integration Repo Constraints.** The [wdk-experiments](https://github.com/claudiovb/wdk-experiments) repo was created to integrate tests for `wdk-wallet-*` and `wdk-protocol-*` across environments. However, it is not a true test runner and presents several issues:
  - High maintenance overhead
  - Incompatibility with CI/CD pipelines
  - Reliance on side channels for environment variables
  - Large and slow due to bundling all related packages

To address these issues, we introduced [Noba](https://github.com/sontuphan/noba), a testing framework designed to enable "write once, run anywhere" testing. Noba is built on three core principles:

1. **Runtime-Agnostic.** Noba abstracts away runtime-specific APIs, relying on minimal JavaScript primitives (e.g., class-based shared state, `queueMicrotask`). This allows tests to be portable across environments.
2. **TypeScript-First.** With TypeScript at its core, Noba ensures type safety, robust autocompletion, static analysis, and early error detection throughout all APIs and utilities.
3. **Jest-Like API.** Noba's API is intentionally familiar to Jest users, featuring similar function names (`describe`, `test`, `it`), matcher syntax (`expect`, `assert`), and lifecycle hooks (`beforeAll`, `afterAll`, `beforeEach`, `afterEach`). This eases migration and reduces the learning curve. The main difference: `test`, hooks and nested `describe` come from the callback arguments instead of globals, and so do `expect` and `assert` inside a test.

**Adopting Noba will:**

- Eliminate test duplication across runtimes
- Improve reliability and maintainability of tests
- Simplify CI/CD integration
- Boost developer productivity and confidence in code quality

# Features

| Feature / Capability           | Jest        | Brittle      | Noba        |
| ------------------------------ | ----------- | ------------ | ----------- |
| Test syntax (describe/test)    | ✅ Familiar | ❌ Different | ✅ Familiar |
| Hooks (before/after)           | ✅ Yes      | ⚠️ Limited   | ✅ Yes      |
| Mock                           | ✅ Yes      | ❌ No        | ✅ Yes      |
| Spy                            | ✅ Yes      | ❌ No        | ✅ Yes      |
| Snapshot                       | ✅ Yes      | ❌ No        | ❌ No       |
| Test reporters                 | ✅ Yes      | ⚠️ Limited   | ✅ Yes      |
| Coverage reporters             | ✅ Yes      | ⚠️ Limited   | ✅ Yes      |
| Matchers (expect, assert)      | ✅ Yes      | ⚠️ Limited   | ✅ Yes      |
| Typesafe                       | ✅ Yes      | ⚠️ Limited   | ✅ Yes      |
| Cross-runtime test reusability | ❌ No       | ❌ No        | ✅ Yes      |
