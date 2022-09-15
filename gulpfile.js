const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
// import { deleteAsync } from "del";

function browsersync() {
  browserSync.init({
    server: { baseDir: "app/" },
    notify: false,
    online: true,
  });
}

function scripts() {
  return src([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/slick-carousel/slick/slick.min.js",
    "app/js/script.js",
  ])
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js/"))
    .pipe(browserSync.stream());
}

function styles() {
  return src([
    "app/css/stylesheet.css",
    "node_modules/bootstrap/dist/css/bootstrap-grid.css",
    "node_modules/slick-carousel/slick/slick.css",
    // "node_modules/slick-carousel/slick/slick-theme.css",
    "app/css/style.css",
  ])
    .pipe(concat("style.min.css"))
    .pipe(autoprefixer({ overrideBrowserlist: ["last 10 versions"] }))
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } },
        // format: "beautify", /*for unpack styles*/
      })
    )
    .pipe(dest("app/css/"))
    .pipe(browserSync.stream());
}

function images() {
  return src("app/images/src/**/*")
    .pipe(newer("app/images/dist/"))
    .pipe(imagemin())
    .pipe(dest("app/images/dist/"));
}

// async function cleanimg() {
//   await deleteAsync("app/images/dist/**/*", { force: true });
// }

function buildcopy() {
  return src(
    [
      "app/css/**/*.min.css",
      "app/css/fonts/**/*",
      "app/js/**/*.min.js",
      "app/images/dist/**/*",
      "app/**/*.html",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

function startwatch() {
  watch("app/**/*.html").on("change", browserSync.reload);
  watch(["app/**/*.css", "!app/**/*.min.css"], styles);
  watch(["app/**/*.js", "!app/**/*.min.js"], scripts);
  watch("app/images/src/**/*", images);
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
// exports.cleanimg = cleanimg;
exports.build = series(styles, scripts, images, buildcopy);
exports.default = parallel(styles, scripts, browsersync, startwatch);
