const merger = require('webpack-merge');
const path = require('path');
const config = require('./webpack.config');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = merger(config,{
  mode:'production',
  optimization:{
    minimizer:[
      new UglifyJsPlugin({
        test:/\.js(\?.*)?$/i,
        exclude:[path.resolve(__dirname,'node_modules')],
        cache:true,
        parallel:true,
        sourceMap:true
      }),
      new OptimizeCssAssetsPlugin({
        filename:'[name].[hash].bundle.css',
        chunkFilename:'[id].css'
      })
    ]
  }
});