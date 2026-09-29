```bash
# Install
npm i

# Build
npm run build

# Link, so the `noba` and `noba-bare` binaries used by the test scripts point to this checkout
npm link
npm link noba

# Test Node (builds the tests into ./dist/tests first)
npm test
# Test Bare
npm run test:bare
```

Rebuild with `npm run build` after changing `src/`; the tests import the built package from `./dist`.

# Coverage

☂️ [The Latest Version Coverage](https://sontuphan.github.io/noba/)

# Run a single file without the CLI

Useful for debugging a single test file. `NOBA_MAIN_ID` must be set, otherwise the file exits immediately; the CLI normally sets it. Output is wrapped in `<0:...>` tags that the CLI would parse.

```bash
# Install Bare
npm i -g bare

# Build the package and the tests
npm run build
npm run pretest

# Run one file
NOBA_MAIN_ID=0 bare ./dist/tests/expect/be.test.js
NOBA_MAIN_ID=0 node ./dist/tests/expect/be.test.js
```

# Release

Work happens on `develop`. To release, open a pull request from `develop` into `master`; CI runs the tests on the pull request, and merging it publishes a new version to npm through semantic-release. The version is derived from the commit messages ([Conventional Commits](https://www.conventionalcommits.org/)). There are no prerelease channels.

# Wiki

This wiki lives in [`wiki/`](/sontuphan/noba/tree/develop/wiki) and is published by the `Publish Wiki` workflow on every push to `develop` that touches it. Edit the files there, not on GitHub.
