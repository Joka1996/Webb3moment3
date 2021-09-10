// Metoder
const { src, dest, parallel, series, watch } = require("gulp");
// slå ihop filer --save-dev gulp-concat
const concat = require("gulp-concat");
// minimera js npm install gulp-terser --save-dev
const terser = require("gulp-terser");
// minimera css npm install gulp-cssnano --save-dev
const cssnano = require("gulp-cssnano");
// minimera bilder --save-dev gulp-imagemin
const imagemin = require("gulp-imagemin");
// browsersync npm install browser-sync gulp --save-dev
const browserSync = require("browser-sync").create();
// sourceMaps npm i gulp-sourcemaps
const sourcemaps = require("gulp-sourcemaps");
//npm install node-sass gulp-sass --save-dev
const sass = require("gulp-sass");
sass.compiler = require("node-sass");

// objekt för att lagra sökvägar
const files = {
  htmlPath: "src/**/*.html",
  cssPath: "src/**/*.css",
  jsPath: "src/**/*.js",
  picPath: "src/pics/*",
};

// htmlTask
function htmlTask() {
  return (
    // Hämta filerna
    src(files.htmlPath)
      // skicka till pub
      .pipe(dest("pub"))
  );
}
// cssTask inlkuderas ifall man behöver använda.
function cssTask() {
  return (
    // slå ihop filer
    src(files.cssPath)
      // sourcemaps
      .pipe(sourcemaps.init())
      .pipe(concat("main.css"))
      // minimera filer
      .pipe(cssnano())
      // sourcemaps
      .pipe(sourcemaps.write())
      // skicka till pub
      .pipe(dest("pub/css"))
  );
}
// sassTask
function sassTask() {
  return src(files.sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("pub/css"))
    .pipe(browserSync.stream());
}
// jsTask
function jsTask() {
  return (
    src(files.jsPath)
      // sourcemap
      .pipe(sourcemaps.init())
      // slå ihop
      .pipe(concat("main.js"))
      // minimera filer
      .pipe(terser())
      // sourcemaps
      .pipe(sourcemaps.write())
      // skicka till pub
      .pipe(dest("pub/js"))
  );
}

// picTask
function picTask() {
  return (
    src(files.picPath)
      // minimera bilder
      .pipe(imagemin())
      // skicka till pub
      .pipe(dest("pub/pics"))
  );
}

// en watchtask för att automatisera metoderna.
function watchTask() {
  // browsersync, ändra från app till pub
  browserSync.init({
    server: "./pub",
  });

  // metoden watch som tar en array och ett argument.
  // Ladda om webbläsaren vid förändring, browsersync
  watch(
    [files.htmlPath, files.cssPath, files.jsPath, files.picPath],
    parallel(htmlTask, cssTask, sassTask, jsTask, picTask)
  ).on("change", browserSync.reload);
}

// Dags att exportera, först körs alla task parallelt,
//  sedan watchTask med browserSync.
exports.default = series(
  parallel(htmlTask, cssTask, sassTask, jsTask, picTask),
  watchTask
);
