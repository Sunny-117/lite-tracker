import { defineConfig } from "rolldown";

export default defineConfig({
  input: 'src/index.js',
  output: [
    {
      file: './dist/index.js',
      format: 'iife',
      name: 'monitor',
    },
    {
      file: './dist/index.esm.js',
      format: 'esm',
    },
    {
      file: './dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: './dist/index.umd.js',
      format: 'umd',
      name: 'monitorSDK',
    },
  ],
  watch: {
    exclude: 'node_modules/**',
  }
})