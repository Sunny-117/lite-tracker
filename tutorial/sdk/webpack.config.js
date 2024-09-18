const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    context: process.cwd(),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'monitor.js'
    },
    devServer: {
        // contentBase: path.resolve(__dirname, 'dist'),
        client: {
            overlay: false
        },
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            devServer.app.get('/success', (_, response) => {
                response.json({ message: 'setup-middlewares option GET success!' });
            });
            devServer.app.post('/error', (_, response) => {
                response.sendStatus(500);
            });
            return middlewares;
        }

    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'head'
        })
    ]
}