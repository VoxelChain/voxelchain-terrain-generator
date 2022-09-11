import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import version from "rollup-plugin-version-injector";

export default {
  input: "src/index.ts",
  external: [],
  output: [
    {
      name: "VoxelchainTerrain",
      file: "dist/index.js",
      format: "cjs",
    },
    {
      name: "VoxelchainTerrain",
      file: "dist/index.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    clear({
      targets: ["dist"]
    }),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfig: "./tsconfig.json",
      module: "esnext",
    }),
    version(),
    resolve(),
    commonjs({
      sourceMap: false,
      include: "./node_modules/**"
    }),
  ]
};
