const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('mini-css-extract-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry:{
    app:'./src/app.js',
    another:'./src/sub-entry/another.js'
  },
  output:{
    filename:'js/[name].[hash].bundle.js',
    path:path.resolve(__dirname,'dist')
  },
  module:{
    rules:[
      {
        test: /\.(scss|less|css)$/,
        exclude: [path.resolve(__dirname, "node_modules"), path.resolve(__dirname, "/client/*/pages")],
        use: [
          {
            loader:ExtractTextPlugin.loader,
            options:{
              publicPath:'./dist/',
              fallback:'style-loader'
            }
          },
          'css-loader'
        ]
      },
      {
        test:/\.html$/,
        use:{
          loader:'html-loader',
          options:{
            minimize:true
          }
        }
      },
      {
        test:/\.js$/,
        exclude:/node-modules/,
        query:{
          presets:['env']
        },
        loader:'babel-loader'
      },
      {
        test:/\.(jpg|svg|png|jpeg|gif)$/i,
        use:[
          {
            loader:'file-loader'
          }
        ]
      },

    ]
  },
  plugins:[
    new CleanWebpackPlugin('dist'),
    new HtmlWebpackPlugin({
      template:'./src/app.html',
      filename:'index.html',
      meta:{
        viewport:'width=device-width, initial-scale=1'
      },
      showErrors:true,
      chunks:['app']
    }),
    new HtmlWebpackPlugin({
      template:'./src/html/another.html',
      meta:{
        viewport:'width=device-width, initial-scale=1'
      },
      filename:'html/another.html',
      // showErrors:true,
      // chunks:['another'],
      // inject:false,
      // template:require('html-webpack-template'),
      // appMountId:'another',
      // appMountHtmlSnippet:'<h2>Another Html Example!</h2>',
      // headHtmlSnippet:'<style>#another{color: blue}ul{margin:0;padding: 0}</style>',
      // bodyHtmlSnippet:'<ul><li>1</li><li>2</li></ul>',
      // baseHref:'https://www.programstorm.com/demo',
      // devServer:'http://localhost:8080',
      // googleAnalytics:{
      //   trackingId:'UA-ASAS-ASS',
      //   pageViewOnLoad:true
      // },
      // meta:[
      //   {
      //     name: 'description',
      //     content: 'A better default template for html-webpack-plugin.'
      //   }
      // ],
      // mobile:true,
      // lang:'zh-CN',
      // links:[
      //   'https://fonts.googleapis.com/css?family=Roboto',
      //   {
      //     href: './src/assets/leaf.jpg',
      //     rel: 'apple-touch-icon',
      //     sizes: '180x180'
      //   },
      //   {
      //     href: './src/assets/leaf.jpg',
      //     rel: 'icon',
      //     sizes: '32x32',
      //     type: 'image/jpg'
      //   }
      // ],
      // inlineManifestWebpackName:'webpackManifest',
      // scripts:[
      //   {
      //     src:'./src/sub-entry/another.js',
      //     type:'module'
      //   }
      // ],
      // title:'My Another!',
      // window:{
      //   variable:'This is a variable!',
      //   variableB:[1,2,3],
      //   variableC:new Date(),
      //   env:{
      //     apiHost:'https://www.programstorm.com/api'
      //   }
      // }
    }),
    new ExtractTextPlugin({
      filename:'style/[name].[contenthash].bundle.css',
    })
  ]
};