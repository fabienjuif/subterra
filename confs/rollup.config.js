import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.js',
  // TODO: should get this from package.json
  external: [
    'nanoid',
    'immer',
    'lodash',
    'node-fetch',
    '@myrtille/mutate',
    '@myrtille/core',
    'aws-sdk',
    '@fabienjuif/dynamo-client',
  ],
  plugins: [resolve(), commonjs()],
  output: {
    file: 'index.js',
    format: 'cjs',
    sourcemap: false,
  },
}
