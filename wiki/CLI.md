```bash
noba --help
noba [flags] <files>

The test framework for Bare

Arguments:
  <files>

Flags:
  --timeout|-t <timeout>          Set the test timeout in milliseconds (default: 10000)
  --version|-v                    Show the noba version
  --coverage|-c                   Enable the test coverage
  --coverage-dir <directory>      Set the coverage dir for the result (default: coverage)
  --coverage-format <text|html>   Set the coverage format for the result (default: text)
  --register|-r <runner>          Override the default runner. For example, --register tsx to run tests in typescript.
  --globalSetup <file>            Run a custom setup once before all test suites.
  --globalTeardown <file>         Run a custom teardown once after all test suites.
  --help|-h                       Show help

For example:
noba -t 3000 ./tests/*.test.js - GOOD
noba ./tests/*.test.js -t 3000 - BAD
```

Put flags before the files; flags placed after them are not applied.

# Binaries

| Command     | Runtime |
| ----------- | ------- |
| `noba`      | Node.js |
| `noba-node` | Node.js |
| `noba-bare` | Bare    |

Each test file runs in its own child process, one file at a time. The process exits with code `1` if any test fails or throws an uncaught exception, and `0` otherwise.

# Test

```bash
# Node
noba ./tests/*.test.js
# Node with coverage
noba --coverage ./tests/*.test.js

# Bare
noba-bare ./tests/*.test.js
# Bare with coverage
noba-bare --coverage ./tests/*.test.js
```

Noba does not expand globs or discover files. Your shell expands `./tests/*.test.js` into a file list; if no files are passed, nothing runs and the command exits with `0`.

## Timeout

`--timeout` applies to each `test` callback. Hooks (`beforeAll`, `beforeEach`, ...) have no timeout unless you pass one as their second argument. See [References](/sontuphan/noba/wiki/references).

```bash
noba -t 3000 ./tests/*.test.js
```

## Coverage

Coverage is collected with V8 (Node) or `bare-cov` (Bare) and reported by `c8`. To generate an HTML report in `./coverage`:

```bash
noba --coverage --coverage-format html ./tests/*.test.js
```

The value of `--coverage-format` is passed to `c8 report --reporter`, so other c8 reporters such as `lcov` also work.

## TypeScript

`--register` replaces the runtime with a binary from `./node_modules/.bin/`, so the runner must be installed locally in the project, not globally.

```bash
# Install the runner (register)
npm i -D tsx
# Typescript
noba --register tsx ./tests/*.test.ts
```

## Global setup and teardown

```bash
noba --globalSetup ./tests/globals/setup.js --globalTeardown ./tests/globals/teardown.js ./tests/*.test.js
```

See [Global Setup and Teardown](/sontuphan/noba/wiki/global-setup-and-teardown).

# Version

```bash
noba --version
```
