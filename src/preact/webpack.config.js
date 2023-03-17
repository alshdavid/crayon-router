const path = require("path")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

const modes = {
  development: "development",
  production: "production"
}

const mode = process.argv.includes("production")
  ? modes.production
  : modes.development

if (mode === "production") {
  process.env.NODE_ENV = "'production'"
}

const stats = process.argv.includes("--stats")
  ? [new BundleAnalyzerPlugin()]
  : []

module.exports = {
  entry: path.join(__dirname, "/src/index.ts"),
  mode,
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
    library: "crayon-preact",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.build.json',
        }
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
    crayon: 'crayon',
    vue: 'vue',
    svelte: 'svelte',
    preact: 'preact',
    'preact/hooks': 'preact/hooks',
    react: {
      commonjs: "react",
      commonjs2: "react",
      umd: "react",
      amd: "React",
      root: "React"
    },
    'react-dom': {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      umd: "react-dom",
      amd: "React-dom",
      root: "React-dom"
    }
  }
}
