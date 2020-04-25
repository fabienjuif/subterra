import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

/**
 * Add here external dependencies that actually you use.
 */

export default {
  input: 'src/index.js',
  // TODO: should get this from package.json
  external: [
    'firebase-functions',
    'firebase-admin',
    'nanoid',
    'express',
    'body-parser',
    'immer',
    'lodash',
    'node-fetch',
    '@myrtille/mutate',
    '@myrtille/core',
  ],
  plugins: [resolve(), commonjs()],
  output: {
    file: 'index.js',
    format: 'cjs',
    sourcemap: false,
  },
}
