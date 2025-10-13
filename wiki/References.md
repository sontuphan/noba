# describe

`describe` lets you organize hooks (i.e. `beforeAll`, `afterAll`, `beforeEach`, `afterEach`), test cases (i.e. `it`, `test`), and even sub-`describe` into logical sections.

## API

```ts
describe('describe a logical section', ({
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  test,
  it,
  log,
  each,
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

# test

`test` specifies what behavior you `expect` (or `assert`) and verifies it.

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

# each

`each` allows a test to iterate over a list of arguments and run the test multiple times.

## API

```ts
each(args, ({ describe, test, it, log }) => {
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
