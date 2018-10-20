const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const glob = require('glob');

const rootDir = path.resolve('.');
const srcDir = path.join(rootDir, '/src');

var entries = function () {
  var entryFiles = glob.sync(srcDir + '/views/**/*.js');
  var map = {};
  for (var i = 0; i < entryFiles.length; i++) {
    var filePath = entryFiles[i];
    var pathModule = filePath.substring(0, filePath.lastIndexOf('/'));
    // var module = pathModule.substring(pathModule.lastIndexOf('\/')+1);
    var module = pathModule.substring(pathModule.lastIndexOf('/views/') + 7);
    module = module.substring(0, module.lastIndexOf('/'));
    var lastModule = pathModule.substring(pathModule.lastIndexOf('/') + 1);
    var filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));

    if (filename !== lastModule) {
      continue;
    }
    if (module !== 'index') {
      filename = path.join('./', module, filename);
    }
    // console.log('filename:' + filename);
    map[filename] = filePath;
  }
  return map;
};

var htmlPlugins = function () {
  var r = [];
  var entriesFiles = glob.sync(srcDir + '/views/**/*.html');
  for (var i = 0; i < entriesFiles.length; i++) {
    var filePath = entriesFiles[i];

    var entryHtml = filePath;
    var pathModule = filePath.substring(0, filePath.lastIndexOf('/'));
    var module = pathModule.substring(pathModule.lastIndexOf('/views/') + 7);
    // var lastModule = pathModule.substring(pathModule.lastIndexOf('/') + 1)

    module = module.substring(0, module.lastIndexOf('/'));
    module = path.join('./', module);
    console.log('[html module]:' + module);
    // if (!module) {
    //   module = '.';
    // }

    var filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
    var chunk = path.join(module, filename);
    console.log('[filename]' + filename + '[chunk]' + chunk);
    filename = path.join(module, filename);
    var conf = {
      title: 'title',
      template: entryHtml,
      filename: filename + '.html',
      // favicon: path.resolve(srcDir, './favicon.ico'),
      inject: 'body',
      chunks: [chunk]

    };
    r.push(new HtmlWebpackPlugin(conf));
  }
  console.log(JSON.stringify(r));
  return r;
};

console.log(JSON.stringify(entries()));

module.exports = {
  entry: entries(),
  output: {
    filename: './[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    chunkFilename: '[name].js'
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // },

  optimization: {
    splitChunks: {
      // chunks: 'initial',
      cacheGroups: {
      // 提取 node_modules 中代码
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'async'
        }
        // commons: {
        // // async 设置提取异步代码中的公用代码
        //   chunks: 'async',
        //   name: 'commons-async',
        //   /**
        //  * minSize 默认为 30000
        //  * 想要使代码拆分真的按照我们的设置来
        //  * 需要减小 minSize
        //  */
        //   minSize: 0,
        //   // 至少为两个 chunks 的公用代码
        //   minChunks: 2
        // }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    // new HtmlWebpackPlugin({
    // title: 'title',
    // template: './src/views/learn1/learn1.html',
    // filename: 'learn1/learn1.html',
    // inject: 'body'
    // }),
    ...htmlPlugins(),
    new webpack.HotModuleReplacementPlugin()
  ],
  // devServer: {
  //   hot: true,
  //   contentBase: path.join(__dirname, 'dist'),
  //   port: 9000
  // },
  // devtool: 'source-map'// 'cheap-module-eval-source-map',
  devtool: 'cheap-module-eval-source-map',
  mode: 'development'
};
