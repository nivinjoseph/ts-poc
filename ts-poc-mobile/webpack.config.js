"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const autoprefixer = require("autoprefixer");
const htmlWebpackPlugin = require("html-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const n_config_1 = require("@nivinjoseph/n-config");
const env = n_config_1.ConfigurationManager.getConfig("env");
console.log("WEBPACK ENV", env);
const isDev = env === "dev";
const moduleRules = [
    {
        test: /\.(scss|sass)$/,
        use: [{
                loader: isDev ? "style-loader" : MiniCssExtractPlugin.loader
            }, {
                loader: "css-loader"
            }, {
                loader: "postcss-loader",
                options: {
                    plugins: () => [
                        require("postcss-flexbugs-fixes"),
                        autoprefixer({
                            browsers: [
                                ">1%",
                                "not ie < 9"
                            ],
                            flexbox: "no-2009"
                        })
                    ]
                }
            }, {
                loader: "sass-loader"
            }]
    },
    {
        test: /\.css$/,
        use: [{
                loader: isDev ? "style-loader" : MiniCssExtractPlugin.loader
            }, {
                loader: "css-loader"
            }]
    },
    {
        test: /\.svg$/,
        use: [
            isDev ? "file-loader" : {
                loader: "url-loader",
                options: {
                    limit: 9000,
                    fallback: "file-loader"
                }
            }
        ]
    },
    {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
            isDev ? "file-loader" : {
                loader: "url-loader",
                options: {
                    limit: 9000,
                    fallback: "file-loader"
                }
            },
            {
                loader: "image-webpack-loader",
                options: {
                    bypassOnDebug: true,
                }
            }
        ]
    },
    {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
            isDev ? "file-loader" : {
                loader: "url-loader",
                options: {
                    limit: 9000,
                    fallback: "file-loader"
                }
            }
        ]
    },
    {
        test: /\.(html)$/,
        use: {
            loader: "html-loader",
            options: {
                attrs: ["img:src", "use:xlink:href"]
            }
        }
    }
];
const plugins = [
    new cleanWebpackPlugin(["src/www"]),
    new htmlWebpackPlugin({
        template: "src/app.html",
        filename: "index.html",
        hash: true
    }),
    {
        apply: function (compiler) {
            compiler.hooks.compilation.tap("ConfigPlugin", (compilation) => {
                compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync("ConfigPlugin", (data, cb) => {
                    data.html = data.html.replace("<body>", `
                                <body>
                                <script>
                                    window.config = "${Buffer.from(JSON.stringify(n_config_1.ConfigurationManager.configObject), "utf8").toString("hex")}";
                                </script>
                            `);
                    cb(null, data);
                });
            });
        }
    }
];
if (!isDev) {
    moduleRules.push({
        test: /\.js$/,
        use: {
            loader: "babel-loader",
            options: {
                presets: [["@babel/preset-env", {
                            debug: false,
                            targets: {
                                chrome: "41"
                            },
                            useBuiltIns: "entry",
                            forceAllTransforms: true,
                            modules: "commonjs"
                        }]]
            }
        }
    });
    plugins.push(...[
        new MiniCssExtractPlugin({
            filename: "client.bundle.css"
        }),
        new CompressionPlugin({
            test: /\.(js|css|svg)$/
        })
    ]);
}
module.exports = {
    mode: isDev ? "development" : "production",
    target: "web",
    entry: ["./src/app.js"],
    output: {
        filename: "app.bundle.js",
        path: path.resolve(__dirname, "src/www"),
        publicPath: "/"
    },
    devtool: isDev ? "inline-source-map" : "source-map",
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                    safari10: true
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: moduleRules
    },
    plugins: plugins
};
//# sourceMappingURL=webpack.config.js.map