import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/spy.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    splitting: false,
    outDir: 'dist',
  },
  {
    entry: ['src/mock.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    splitting: false,
    outDir: 'dist',
  },
])
