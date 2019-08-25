const path = require('path');

const modes = {
  development: 'development',
  production: 'production'
}

const mode = process.argv.includes('--prod') 
  ? modes.production 
  : modes.development

if (mode === 'production') {
    process.env.NODE_ENV="'production'"
}

module.exports = {
    entry: path.join(__dirname, '/src/gui/main.tsx'),
    mode,
    output: {
        filename: 'dist/index.js',
        path: path.join(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
          '~': path.resolve(__dirname, 'src')
        }
    }
};