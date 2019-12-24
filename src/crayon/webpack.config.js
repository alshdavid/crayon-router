const path = require("path")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

const modes = {
  development: "development",
  production: "production"
}

const mode = process.argv.includes("--prod")
  ? modes.production
  : modes.development

if (mode === "production") {
  process.env.NODE_ENV = "'production'"
}

const stats = process.argv.includes("--stats")
  ? [new BundleAnalyzerPlugin()]
  : []

module.exports = {
  entry: path.join(__dirname, "/src/lib/index.ts"),
  mode,
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist/lib"),
    library: "",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    },
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [...stats],
  externals: {
    vue: {
      commonjs: "vue",
      commonjs2: "vue",
      umd: "vue",
      amd: "vue",
      root: "vue"
    },
    svelte: {
      commonjs: "svelte",
      commonjs2: "svelte",
      umd: "svelte",
      amd: "svelte",
      root: "svelte"
    },
    preact: {
      commonjs: "preact",
      commonjs2: "preact",
      umd: "preact",
      amd: "Preact",
      root: "Preact"
    },
    react: {
      commonjs: "react",
      commonjs2: "react",
      umd: "react",
      amd: "React",
      root: "React"
    }
  }
}
