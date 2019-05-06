const path = require("path");
const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");

module.exports = {
  input: path.resolve(__dirname, "../src/javascripts/gumball.js"),
  output: {
    file: path.resolve(__dirname, "../dist/javascripts/gumball.js"),
    format: "umd",
    name: "gumball",
  },
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
};
