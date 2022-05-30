const path = require("path");
const { src, dest, task, series, watch, parallel } = require("gulp");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));

const makeWebpackStream = () =>
  webpackStream(
    {
      mode: 'production',
      entry: {
        game: "./src/Game.js",
        win: "./src/win.js",
      },
      output: {
        filename: `[name].js`,
        publicPath: "js/",
        chunkFilename: `js/chunks/[name][id].chunk.[chunkhash].js`,
      },
      resolve: {
        alias: {
          Phaser: "phaser",
          "@": path.resolve(__dirname, "src"),
          node_modules: path.resolve(__dirname, "node_modules"),
        },
        extensions: [".js"],
        // modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: "babel-loader",
            query: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: 3,
                  },
                ],
              ],
            },
          },
          {
            test: /\.css$/,
            use: ["css-loader"],
          },
          {
            test: /\.svg$/,
            use: ["babel-loader"],
          },
        ],
      },
      plugins: [
        new webpack.ProvidePlugin({
          Phaser: "phaser",
        }),
      ],
    },
    webpack
  );

task("server", function () {
  browserSync({
    server: {
      baseDir: "./dist",
    },
  });
  watch("*.html").on("change", browserSync.reload);
});

task("js", function () {
  return src(["src/Game.js", "src/win.js"])
    .pipe(makeWebpackStream())
    .pipe(dest("dist/js/"));
});

task("assets", function () {
  return src("assets/**/*").pipe(dest("dist/assets/"));
});

task("pages", function () {
  return src("pages/**/*").pipe(dest("dist/"));
});

task("styles", function () {
  return src("src/sass/**/*.+(scss|sass)")
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest("dist/assets/css"));
});

task("default", series("js", "pages", "assets", "styles"));

task(
  "watch",
  parallel(
    "default",
    function () {
      watch(["src/**/*"], series("js"));
      watch(["pages/**/*"], series("pages"));
      watch(["assets/**/*"], series("assets"));
      watch(["src/sass/**/*.+(scss|sass)"], series("styles"));
    },
    "server"
  )
);
