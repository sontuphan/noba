import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    splitting: false,
    clean: true,
    outDir: 'dist',
  },
  {
    entry: ['src/mock.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    splitting: false,
    clean: true,
    outDir: 'dist',
  },
])
