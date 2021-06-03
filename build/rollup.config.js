import { resolve as pathResolve } from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";

module.exports = {
  input: pathResolve(__dirname, "../src/javascripts/gumball.js"),
  output: {
    file: pathResolve(__dirname, "../dist/javascripts/gumball.js"),
    format: "umd",
    name: "gumball-ui",
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: "node_modules/**",
      presets: [["@babel/preset-env"]],
    }),
  ],
};