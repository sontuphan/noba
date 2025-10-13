# Global Setup

This option allows the use of a custom global setup module. The setup will be triggered once before all test suites. The setup runner will share the same runner as tests

```js
// ./test/globals/setup.js

const setup = () => {
  console.log('Global Setup')
}

setup()
```

```bash
noba --globalSetup ./test/globals/setup.js
```

```bash
npm i -g tsx
noba --register tsx --globalSetup ./test/globals/setup.ts
```

# Global Teardown

This option allows the use of a custom global teardown module. The teardown will be triggered once after all test suites. The teardown runner will share the same runner as tests

```js
// ./test/globals/teardown.js

const teardown = () => {
  console.log('Global Teardown')
}

teardown()
```

```bash
noba --globalTeardown ./test/globals/teardown.js
```

# With custom runner

For example, a typescript setup & teardown.

```ts
// ./test/globals/setup.ts

const setup = () => {
  console.log('Typescript Global Setup')
}

setup()
```

```ts
// ./test/globals/teardown.ts

const teardown = async () => {
  console.log('Typescript Global Teardown')
}

teardown()
```

```bash
npm i -g tsx
noba --register tsx --globalSetup ./test/globals/setup.ts --globalTeardown ./test/globals/teardown.ts
```
