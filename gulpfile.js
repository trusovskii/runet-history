const path = require('path');
const { src, dest, task, series, watch } = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const twig = require('gulp-twig');

task('app', function () {
  return src('src/Game.js')
    .pipe(
      webpackStream(
        {
          mode: process.env.NODE_ENV,
          resolve: {
            alias: {
              Phaser: 'phaser',
              '@': path.resolve(__dirname, 'src'),
              '@assets': path.resolve(__dirname, 'assets'),
              '@templates': path.resolve(__dirname, 'templates'),
              node_modules: path.resolve(__dirname, 'node_modules'),
            },
            extensions: ['.js'],
            // modules: [path.resolve(__dirname, 'src'), 'node_modules'],
          },
          output: {
            filename: 'game.js',
            publicPath: 'js/',
            chunkFilename: 'js/chunks/[id].chunk.[chunkhash].js',
          },
          module: {
            rules: [
              {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'usage',
                        corejs: 3,
                      },
                    ],
                  ],
                },
              },
              {
                test: /\.css$/,
                use: ['css-loader'],
              },
              {
                test: /\.svg$/,
                use: ['babel-loader'],
              },
            ],
          },
          plugins: [
            new webpack.ProvidePlugin({
              Phaser: 'phaser',
            }),
          ],
        },
        webpack
      )
    )
    .pipe(dest('dist/js/'));
});

task('assets', function () {
  return src('assets/**/*').pipe(dest('dist/assets/'));
});

task('pages', function () {
  return src('pages/**/*').pipe(dest('dist/'));
});

task('watch', function () {
  watch(['src/**/*'], series('app'));
  watch(['pages/**/*'], series('pages'));
  watch(['assets/**/*'], series('assets'));
});

task('default', series('app', 'pages', 'assets'));
