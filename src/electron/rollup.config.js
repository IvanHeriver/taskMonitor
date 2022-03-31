import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/electron/src/index.ts",
  output: {
    sourcemap: true,
    format: "cjs",
    file: "src/electron/build/index.js",
  },
  // watch: {
  //   include: "src/electron/**",
  //   exclude: "src/electron/build/**",
  // },
  plugins: [
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
  ],
};
