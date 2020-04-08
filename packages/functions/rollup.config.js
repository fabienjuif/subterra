import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

/**
 * Add here external dependencies that actually you use.
 */

export default {
  input: 'src/index.js',
  external: ['firebase-functions', 'firebase-admin', 'nanoid', 'express'],
  plugins: [resolve(), commonjs()],
  output: {
    file: 'index.js',
    format: 'cjs',
    sourcemap: false,
  },
}
