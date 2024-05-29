import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import babel, { getBabelOutputPlugin} from "@rollup/plugin-babel"

export default {
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
  },
  plugins: [
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      allowAllFormats: true,
    }),
    commonjs(),
    resolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js'],
    }),
  ]
}