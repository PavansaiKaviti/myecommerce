module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
  // Optimize for large modules
  compact: false,
  // Increase memory limit for large modules
  generatorOpts: {
    compact: false,
  },
};
