const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: { main: "./src/pages/index.js" },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true,
  },
  devtool: "inline-source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    port: 8080,
    open: true,
    liveReload: true,
    hot: false,
  },
  target: ["web", "es5"],
  module: {
    rules: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // or 'style-loader' during dev if you prefer HMR
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
      { test: /\.(png|jpe?g|jpg|gif|svg|webp|ico)$/i, type: "asset/resource" },
      { test: /\.(woff2?|eot|ttf|otf)$/i, type: "asset/resource" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      favicon: "./src/images/favicon.ico",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
};
