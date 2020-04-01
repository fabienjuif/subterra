module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: { node: true },
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-modules-commonjs'],
}
