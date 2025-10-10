```bash
# Build
npm run build

# Link
npm link
npm link noba

# Test Node
npm run test:node
# Test Bare
npm run test:bare
```

# Coverage

☂️ [The Latest Version Coverage](https://sontuphan.github.io/noba/)

# Custom Test

```bash
# Install Bare
npm i -g bare

# Build
npm run build
npm run pretest

# Test
NOBA_MAIN_ID=0 bare ./dist/tests/*.test.js
```
