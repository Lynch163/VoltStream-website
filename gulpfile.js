const { src, dest, parallel, series, watch } = require("gulp");
const Concat = require("gulp-concat");

const imagemin = require("gulp-imagemin");

function scripts() {
  return src("app/js/*.js").pipe(Concat("script.js")).pipe(dest("app/"));
}

function styles() {
  return src([
    "app/css/stylesheet.css",
    "node_modules/bootstrap/dist/css/bootstrap-grid.css",
    "app/css/styles.css",
  ])
    .pipe(Concat("style.css"))
    .pipe(dest("app/css/"));
}

function fontsCopy() {
  return src(["app/css/fonts/**.woff", "app/css/fonts/**.woff2"]).pipe(
    dest("dist/css/fonts/")
  );
}

function images() {
  return src("app/images/src/**/*")
    .pipe(imagemin())
    .pipe(dest("app/images/dest/"));
}

function buildCopy() {
  return src(
    [
      "app/css/style.css",
      "app/index.html",
      "app/script.js",
      "app/images/dest/**/*",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

function startWatch() {
  watch(["app/**/*.js", "!app/script.js"], scripts);
  watch(["app/**/*.css", "!app/css/style.css"], styles);
}

exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.build = series(styles, scripts, images, fontsCopy, buildCopy);
exports.default = parallel(scripts, styles, startWatch);
