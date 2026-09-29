# describe

`describe` lets you organize hooks (i.e. `beforeAll`, `afterAll`, `beforeEach`, `afterEach`), test cases (i.e. `it`, `test`), and even sub-`describe` into logical sections.

Always use the `describe`, `test`, hooks and `each` passed to the callback, not the top-level imports. The callback arguments are bound to the current section; the imported ones register at the top level of the file.

The callback may be `async`, for example to `await` a mock before registering tests. Tests are registered while the callback runs and executed after it returns, in the order they were declared.

## API

```ts
describe('describe a logical section', ({
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  test,
  it,
  each,
  log,
}) => {
  // a logical section
})
```

## Example

```ts
import { describe } from 'noba'

describe('parent', ({ describe, test }) => {
  describe('child', ({ test }) => {
    test('child test', () => {
      // child test
    })
  })

  test('parent test', () => {
    // parent tests
  })
})
```

## describe.only

Run only this `describe` block (and its children), skipping all sibling `describe` and `test` blocks. If multiple `.only` are present, only the last sibling's `.only` takes effect.

`.only` is scoped to its siblings: a `.only` inside a nested `describe` does not skip tests in other sections, and a `.only` in one file does not affect other files.

### API

```ts
describe.only('describe only this section', ({
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  test,
  it,
  each,
  log,
}) => {
  // only this describe block (and its children) will run
})
```

### Example

```ts
import { describe } from 'noba'

describe('parent', ({ describe, test }) => {
  describe('skipped describe block', () => {
    // this describe will be skipped
  })

  describe.only('only child', ({ test }) => {
    test('only child test', () => {
      // only this test will run
    })
  })

  test('should skip this test', () => {
    // this test will be skipped
  })
})
```

## describe.skip

Skip this `describe`.

### API

```ts
describe.skip('skip this section', ({
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  test,
  it,
  each,
  log,
}) => {
  // this describe block (and its children) will be skipped
})
```

### Example

```ts
import { describe } from 'noba'

describe('parent', ({ describe, test }) => {
  describe.skip('skipped child', ({ test }) => {
    test('should not run this test', () => {
      // this test will be skipped
    })
  })

  test('should run this test', () => {
    // this test will run
  })
})
```

# test

> alias `it`

`test` specifies what behavior you `expect` (or `assert`) and verifies it.

The callback may be `async`. A test fails if it throws, rejects, or runs longer than the timeout set by `--timeout` (default: 10000ms). See [Expect](/sontuphan/noba/wiki/expect) and [Assert](/sontuphan/noba/wiki/assert) for the matchers.

## API

```ts
test('should be a test', ({ expect, assert, log }) => {
  // verify an expected behaviour
})
```

## Example

```ts
import { describe } from 'noba'

describe('organized test suite', ({ test }) => {
  test('should be a organized test within a describe', ({ expect }) => {
    expect('a organized test within a describe').to.be.defined()
  })
})
```

```ts
import { test } from 'noba'

test('should be a solo test without describe', ({ expect }) => {
  expect('a solo test without describe').to.be.defined()
})
```

## test.only

Run only this `test` block, skipping all sibling `describe` and `test` blocks. If multiple `.only` are present, only the last sibling's `.only` takes effect.

### API

```ts
test.only('should test this only', ({ expect, assert, log }) => {
  // only this test will run
})
```

### Example

```ts
import { describe } from 'noba'

describe('parent', ({ describe, test }) => {
  describe('skipped describe block', () => {
    // this describe will be skipped
  })

  test.only('should run this test only', () => {
    // this test will be run
  })

  test('should skip this test', () => {
    // this test will be skipped
  })
})
```

## test.skip

Skip this `test`.

### API

```ts
test.skip('should skip this test', ({ expect, assert, log }) => {
  // this test will be skipped
})
```

### Example

```ts
import { describe } from 'noba'

describe('suite', ({ test }) => {
  test.skip('should not run this test', ({ expect }) => {
    expect(false).to.be.true()
  })

  test('should run this test', ({ expect }) => {
    expect(true).to.be.true()
  })
})
```

# each

`each` allows a test to iterate over a list of arguments and run the test multiple times. The current item is passed as `arg`.

## API

```ts
each(args, ({ arg, describe, test, it, log }) => {
  // define the test
})
```

## Example

```ts
import { each } from 'noba'

each([1, 2, 3], ({ describe, arg }) => {
  describe(`describe #${arg}`, ({ test }) => {
    test('should be defined', ({ expect }) => {
      expect(arg).to.be.defined()
    })
  })
})
```

```ts
import { describe } from 'noba'

describe('main', ({ each }) => {
  each([1, 2, 3], ({ test, arg }) => {
    test(`should be defined #${arg}`, ({ expect }) => {
      expect(arg).to.be.defined()
    })
  })
})
```

# Hooks

All four hooks take an optional timeout in milliseconds as the second argument. Without it, a hook has no time limit. A hook that throws is reported as an exception, and the run continues.

```ts
beforeAll(async () => {
  // setup code
}, 3000)
```

# beforeAll

`beforeAll` runs a setup function once before all tests in the current `describe` block.

## API

```ts
beforeAll(({ log }) => {
  // setup code
})
```

## Example

```ts
import { describe } from 'noba'

describe('main', ({ beforeAll, test }) => {
  let db

  beforeAll(async () => {
    db = await connectToDatabase()
  })

  test('db is connected', ({ expect }) => {
    expect(db.connection).to.be.defined()
  })
})
```

# afterAll

`afterAll` runs a teardown function once after all tests in the current `describe` block.

## API

```ts
afterAll(({ log }) => {
  // teardown code
})
```

## Example

```ts
import { describe } from 'noba'

describe('suite', ({ beforeAll, afterAll, test }) => {
  let db

  beforeAll(async () => {
    db = await connectToDatabase()
  })

  afterAll(async () => {
    await db.disconnect()
  })

  test('db is connected', ({ expect }) => {
    expect(db.connection).to.be.defined()
  })
})
```

# beforeEach

`beforeEach` runs a setup function before each `test` in the current `describe` block, including tests in nested `describe` blocks. Parent `beforeEach` hooks run before child ones.

## API

```ts
beforeEach(({ log }) => {
  // setup code before each test
})
```

## Example

```ts
import { describe } from 'noba'

describe('suite', ({ beforeEach, test }) => {
  let value

  beforeEach(() => {
    value = 1
  })

  test('should set the value', ({ expect }) => {
    expect(value).to.equal(1)
  })
})
```

# afterEach

`afterEach` runs a teardown function after each `test` in the current `describe` block, including tests in nested `describe` blocks. Parent `afterEach` hooks run before child ones.

## API

```ts
afterEach(({ log }) => {
  // teardown code after each test
})
```

## Example

```ts
import { describe } from 'noba'

describe('suite', ({ afterEach, test }) => {
  let value = 100

  afterEach(() => {
    value = null
  })

  test('should set the value', ({ expect }) => {
    expect(value).to.equal(100)
  })
})
```

# log

The `log` utility provides a way to output messages during test execution, which can help with debugging or providing additional context.

`log` takes the same arguments as `console.log`. Use it instead of `console.log` so the output stays inside the test's group in the report.

## API

```ts
log('message', ...args)
```

## Example

```ts
import { describe } from 'noba'

describe('logging example', ({ test, log }) => {
  test('should log a message', () => {
    log('This is a log message inside the test')
  })
})
```

# Utilities

`noba` also exports a few runtime-neutral helpers.

| Export            | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `delay(ms)`       | Returns a promise that resolves after `ms` milliseconds.            |
| `uuid(length?)`   | Returns a pseudo-random numeric id (default length: 12). Not secure. |
| `detectRuntime()` | Returns `'node'`, `'bare'`, `'bun'`, `'deno'`, or `''`.             |

```ts
import { delay, describe, detectRuntime } from 'noba'

describe('utils', ({ test }) => {
  test('should wait', async ({ expect }) => {
    await delay(100)
    expect(detectRuntime()).to.be.oneOf(['node', 'bare'])
  })
})
```
