const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    devtool: false,
    entry: {
        datepicker: {
            import: './src/index.tsx',
            library: {
                name: 'horizontal-datepicker',
                type: 'umd',
                umdNamedDefine: true,
            },
        },
        theme: './src/defaultTheme.css',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react',
                            [
                                '@babel/preset-env',
                                {
                                    shippedProposals: true,
                                    targets: '>0.5%, not ie 11, not op_mini all',
                                },
                            ],
                            '@babel/preset-typescript',
                        ],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CssMinimizerPlugin(),
        new CopyPlugin({
            patterns: [{ from: './src/datepicker.bundle.d.ts', to: 'datepicker.bundle.d.ts' }],
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'react',
        },
        classnames: {
            commonjs: 'classnames',
            commonjs2: 'classnames',
            amd: 'classnames',
            root: 'classnames',
        },
        '@use-gesture/react': {
            commonjs: '@use-gesture/react',
            commonjs2: '@use-gesture/react',
            amd: '@use-gesture/react',
            root: '@use-gesture/react',
        },
    },
};
