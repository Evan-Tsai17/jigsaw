const merge = require('webpack-merge');
const config = require('./webpack.config');
const webpack = require('webpack');
module.exports = merge(config,{
  mode:'development',
  devtool:'inline-source-map',
  devServer:{
    contentBase:'./dist',
    hot:true,
    index:'app.html'
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ]
});
