# Noba = Jest + Brittle

Author: [@sontuphan](https://github.com/sontuphan) - Repo: [https://github.com/sontuphan/noba](https://github.com/sontuphan/noba)

#### Abstract

_To support tests in both the Node and Bare Javascript runtimes, we have duplicated test cases written in two runners: Jest and Brittle. This hampers the development process and increases the surface area of dev and maintenance, as well as the changes of mistakes or missed test cases. Investigate the feasibility of consolidating these test runners, and build a POC of an isometric test framework that allows one-time definition of test cases that are runnable on both `npm test:node` and `npm test:bare`. Create a summary of findings and potential next steps in a report._

By [@jonathunne](https://github.com/jonathunne)

## Introduction

**Noba** is a runtime-agnostic testing framework designed to work consistently across Node.js, Deno, Bun, and Bare, while preserving the developer experience and conventions of Jest and Vitest. Noba is all about **"Write once, test everywhere"**.

Traditional JavaScript testing frameworks like Jest, Mocha, and Vitest are powerful, feature-rich, and deeply integrated into the Node.js ecosystem — but that’s also their greatest limitation. They are built with strong assumptions about how the runtime behaves, which makes them incompatible with alternative runtimes like Deno, Bun, or Bare.

A **runtime abstraction layer** is the missing piece that Noba introduces. With the runtime abstraction layer, your tests are no logner tight coupling to the runtime standard library or dependent on runtime’s module loader and runtime internals.

## DX Enhancement

Today, maintaining compatibility of a project like WDK across different runtimes — for example, Node.js and Bare — comes with a heavy cost to developer experience (DX). Teams often have to duplicate the entire test suite into two separate frameworks:

- Jest for Node.js
- Brittle for Bare

Not only does this double the maintenance effort, but it also forces developers to constantly switch between two very different syntaxes, assertion styles, and execution models. This breaks the “write once, run everywhere” ideal and slows down iteration.

```js
// The test in Jest/Node
// ./tests/node/wallet-manager-evm.test.js

import { afterEach, beforeEach, describe, expect, test } from '@jest/globals'

import WalletManagerEvm, { WalletAccountEvm } from '../index.js'

const SEED_PHRASE = ''

describe('WalletManagerEvm', () => {
  let wallet

  beforeEach(async () => {
    wallet = new WalletManagerEvm(SEED_PHRASE, {
      provider: hre.network.provider,
    })
  })

  afterEach(() => {
    wallet.dispose()
  })

  describe('getAccount', () => {
    test('should return the account at index 0 by default', async () => {
      const account = await wallet.getAccount()

      expect(account).toBeInstanceOf(WalletAccountEvm)
      expect(account.path).toBe("m/44'/60'/0'/0/0")
    })
  })
})
```

```js
// The test in Brittle/Bare
// ./tests/bare/wallet-manager-evm.test.js

import test from 'brittle'

import WalletManagerEvm, { WalletAccountEvm } from '@wdk/wallet-evm'
import { JsonRpcProvider } from "ethers" with { imports: "bare-wdk-runtime/package" }

const PROVIDER = 'http://127.0.0.1:8545'
const SEED_PHRASE = ''

test('WalletManagerEvm', async (t) => {
  let provider, wallet

  async function beforeEach () {
    provider = new JsonRpcProvider(PROVIDER)
    wallet = new WalletManagerEvm(SEED_PHRASE, {
      provider: PROVIDER
    })
  }

  async function afterEach () {
    wallet.dispose()
    await provider.send('hardhat_reset', [])
    provider.destroy()
  }

  await t.test('getAccount', async (t) => {
    await t.test(
      'should return the account at index 0 by default',
      async (t) => {
        await beforeEach()
        t.teardown(afterEach)

        const account = await wallet.getAccount()

        t.ok(account instanceof WalletAccountEvm)
        t.is(account.path, "m/44'/60'/0'/0/0")
      }
    )
  })
})
```

Noba solves this by unifying the testing workflow.

```js
// The test in Noba/*
// ./tests/wallet-manager-evm.test.js

import { describe } from 'noba'

import WalletManagerEvm, { WalletAccountEvm } from '@wdk/wallet-evm'

const isBare = 'Bare' in global
const shims = isBare ? { imports: 'bare-wdk-runtime/package' } : {}

const { JsonRpcProvider } = await import('ethers', {
  with: shims,
})

const PROVIDER = 'http://127.0.0.1:8545'

const SEED_PHRASE = ''

describe('WalletManagerEvm', async ({ describe, beforeEach, afterEach }) => {
  let provider, wallet

  beforeEach(() => {
    provider = new JsonRpcProvider(PROVIDER)
    wallet = new WalletManagerEvm(SEED_PHRASE, {
      provider: PROVIDER,
    })
  })

  afterEach(async () => {
    wallet.dispose()
    await provider.send('hardhat_reset', [])
    provider.destroy()
  })

  describe('getAccount', async ({ test }) => {
    test('should return the account at index 0 by default', async ({
      assert,
    }) => {
      const account = await wallet.getAccount()

      assert.instanceOf(account, WalletAccountEvm)
      assert.strictEqual(account.path, "m/44'/60'/0'/0/0")
    })
  })
})
```

In the example above, developers no longer need to maintain separate test suites. Instead, they can simply run:

```bash
noba ./test/*.test.js       # Run tests in Node.js
noba-bare ./test/*.test.js  # Run the same tests in Bare
```

By adopting Noba, teams gain several key benefits:

- No more duplicated tests.
- Improved tooling compatibility – dynamic import attributes are now recognized by tools like StandardJS and Prettier, reducing linting friction.

## Feature Enhancement

Some test scripts written in Jest cannot be migrated to Brittle because of Brittle’s limited feature set. This restriction prevents teams from running comprehensive tests in Bare, forcing them to either rewrite tests with reduced coverage or skip certain scenarios altogether.

For example, mocking is an essential feature in Jest, heavily used in projects like wdk-wallet-spark and for hardware interaction testing. Mocking allows developers to isolate components, simulate dependencies, and verify behavior without relying on real implementations. However, this feature is not supported in Brittle, which means the team cannot execute the same test cases in Bare — leaving critical parts of the testing pipeline unverified.

```js
// ./tests/wallet-account-read-only-spark.test.js

import { jest } from '@jest/globals'

const addressSummaryV1AddressAddressGetMock = jest.fn()

const getTransactionDetailsByIdV1TxTxidGetMock = jest.fn()

jest.unstable_mockModule('@sparkscan/api-node-sdk-client', () => ({
  addressSummaryV1AddressAddressGet: addressSummaryV1AddressAddressGetMock,
  getTransactionDetailsByIdV1TxTxidGet:
    getTransactionDetailsByIdV1TxTxidGetMock,
}))
```

Noba solves this problem by providing a rich feature set compatible with modern testing patterns — including advanced assertions, mocking, async utilities, and snapshot testing — enabling teams to achieve the same depth and quality of testing in Bare as they do in Node.js.

| Feature / Capability               | **Jest / Vitest** | **Brittle**  | **Noba**      |
| ---------------------------------- | ----------------- | ------------ | ------------- |
| **Mock** support                   | ✅ Yes            | ❌ No        | ✅ Yes        |
| **Spy** utilities                  | ✅ Yes            | ❌ No        | ✅ Yes        |
| **Snapshot testing**               | ✅ Yes            | ❌ No        | 🔁 In-process |
| **Coverage reporters**             | ✅ Yes            | ⚠️ Limited   | ✅ Yes        |
| **Typesafe**                       | ✅ Yes            | ⚠️ Limited   | ✅ Yes        |
| Test syntax (describe/test/expect) | ✅ Familiar       | ❌ Different | ✅ Familiar   |
| Runtime abstraction layer          | ❌ No             | ❌ No        | ✅ Yes        |
| Cross-runtime test reusability     | ❌ No             | ❌ No        | ✅ Yes        |

## Disadvantages and Risks

### Early Stage Maturity

Noba is a relatively new framework that hasn’t yet achieved the battle-tested stability of Jest or Vitest. Although it imitates Jest/Vitest syntax, its self-implementation can be risky and prone to bugs.

For example, both `expect` and `assert` are available in Noba, but their implementations are incomplete and lack comprehensiveness.

### Learning Curve and Migration Costs

Noba’s syntax is similar to Jest/Vitest; however, there are slight differences that require learning and migration efforts.

Furthermore, for some advanced features like mocking, Noba introduces new patterns that may create additional training overhead, including the need for updated documentation and examples.

### Performance

Currently, Noba doesn't support parallel testing.

### Feature Parity Challenges

Maintaining feature parity across runtimes is complex and an ongoing effort. For example, coverage reporting mechanisms vary by runtime, which can lead to inconsistent metrics. As a result, Noba currently limits coverage reporting to `c8`, which is only available in the `V8` engine. In other words, if your tests run in JSC, Noba’s coverage support is limited.

### Maintenance Burden

Supporting multiple runtimes increases the framework's maintenance complexity.

## Future work

1. Unify the mocking API
2. Integrate a mature asserter (e.g. chai)
