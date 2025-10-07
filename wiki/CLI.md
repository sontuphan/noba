# CLI

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
  --help|-h                       Show help

For example:
noba -t 3000 ./tests/*.test.js - GOOD
noba ./tests/*.test.js -t 3000 - BAD
```

# Version

```bash
noba --version
noba 1.4.1
```