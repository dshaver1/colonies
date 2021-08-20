const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: 'eval-source-map',
    devServer: {
        static: './dist',
        hot: true,
        port: 3000
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    }
};