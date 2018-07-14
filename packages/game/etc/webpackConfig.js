var webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  path = require("path");

function webpackConfig(watch) {
  var entryObj = {};

  entryObj["game"] = path.resolve(__dirname, "../javascript/main.js");

  var configObj = {
    devServer: {},
    devtool: 'cheap-module-source-map',
    entry: entryObj,
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader`'
          ]
        },
        {
          test: /\.hbs$/i,
          use: [
            'handlebars-loader'
          ]
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin()
    ],
    output: {
      libraryTarget: "this",
      filename: "JaDE.js"
    },
    stats: {
      // fallback value for stats options when an option is not defined (has precedence over local webpack defaults)
      all: undefined,

      // `webpack --no-colors` equivalent
      colors: false
    }
  };

  if(watch) {
    configObj.plugins.push(
      new webpack.HotModuleReplacementPlugin({})
    );

    configObj.devServer.hot = true;
  }

  return configObj;
}

module.exports = webpackConfig;
