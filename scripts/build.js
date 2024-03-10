const { build } = require("esbuild");
const path = require('path');

const entryFile = path.resolve(__dirname, "../src/index.ts");
const shared = {
    bundle: true,
    entryPoints: [entryFile],
    logLevel: "info",
    minify: true,
    sourcemap: true,
    treeShaking: true,
};

build({
    ...shared,
    format: "cjs",
    outfile: path.resolve(__dirname, "../dist/index.cjs.js"),
    target: ["esnext"],
});