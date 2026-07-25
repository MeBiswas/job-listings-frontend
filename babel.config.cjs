module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    // Jest runs under CommonJS and doesn't understand `import.meta.env`
    // (Vite-only syntax). This plugin rewrites it to `process.env` at
    // transform time so the same source files work under both Vite and Jest.
    'babel-plugin-transform-vite-meta-env',
  ],
};
