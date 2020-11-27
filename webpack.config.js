const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const WorkerPlugin = require("worker-plugin");

module.exports = {
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".json", ".mjs", ".wasm"],
        modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
    devServer: {
        historyApiFallback: true,
        http2: true,
        host: "0.0.0.0",
        disableHostCheck: true,
    },
    plugins: [
        new HTMLPlugin({
            template: path.join(__dirname, "src/index.html"),
        }),
        new WorkerPlugin(),
    ],
};
