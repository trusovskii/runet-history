const { src, dest, task, series, watch, parallel } = require("gulp");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));

const makeWebpackStream = () =>
  webpackStream(
    {
      mode: "production",
      entry: {
        game: "./src/Game.js",
        win: "./src/win.js",
        hydra: "./src/hydra.js",
        maestro: "./src/maestro.js",
      },
      output: {
        filename: `[name].js`,
        publicPath: "js/",
        chunkFilename: `js/[name][id].chunk.[chunkhash].js`,
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
  return src(["src/Game.js", "src/win.js", "src/hydra.js", "src/maestro.js"])
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
