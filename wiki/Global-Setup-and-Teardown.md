Global setup and teardown run a script once around the whole test run: setup before the first test file, teardown after the last one.

Each script runs in its own process with the same runtime as the tests (including `--register`), so it cannot share in-memory state with test files. Use files, a database, or a server that outlives the process to pass state along. If the script exits with code `1`, Noba stops immediately.

# Global Setup

```js
// ./tests/globals/setup.js

const setup = async () => {
  console.log('Global Setup')
}

await setup()
```

```bash
noba --globalSetup ./tests/globals/setup.js ./tests/*.test.js
```

# Global Teardown

```js
// ./tests/globals/teardown.js

const teardown = async () => {
  console.log('Global Teardown')
}

await teardown()
```

```bash
noba --globalTeardown ./tests/globals/teardown.js ./tests/*.test.js
```

# With custom runner

For example, a TypeScript setup and teardown. The runner must be installed locally, since `--register` looks it up in `./node_modules/.bin/`.

```ts
// ./tests/globals/setup.ts

const setup = async (): Promise<void> => {
  console.log('Typescript Global Setup')
}

await setup()
```

```ts
// ./tests/globals/teardown.ts

const teardown = async (): Promise<void> => {
  console.log('Typescript Global Teardown')
}

await teardown()
```

```bash
npm i -D tsx
noba --register tsx --globalSetup ./tests/globals/setup.ts --globalTeardown ./tests/globals/teardown.ts ./tests/*.test.ts
```
