// Metoder
const { src, dest, parallel, series, watch } = require("gulp");
// slå ihop filer npm install gulp-concat --save-dev
const concat = require("gulp-concat");
// minimera js npm install gulp-terser --save-dev
const terser = require("gulp-terser");
// minimera css npm install gulp-cssnano --save-dev
const cssnano = require("gulp-cssnano");
// minimera bilder npm install gulp-imagemin --save-dev
const imagemin = require("gulp-imagemin");
// browsersync npm install browser-sync --save-dev
const browserSync = require("browser-sync").create();
// sourceMaps npm i gulp-sourcemaps --save-dev
const sourcemaps = require("gulp-sourcemaps");
//npm install sass gulp-sass --save-dev
const sass = require("gulp-sass")(require("sass"));

// objekt för att lagra sökvägar
const files = {
  htmlPath: "src/**/*.html",
  sassPath: "src/**/*.scss",
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

// sassTask
function sassTask() {
  return (
    src(files.sassPath)
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      // sourcemaps
      .pipe(sourcemaps.write("./maps"))
      .pipe(dest("pub/css"))
      .pipe(browserSync.stream())
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
      .pipe(sourcemaps.write("./maps"))
      // skicka till pub
      .pipe(dest("pub/css"))
  );
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
      .pipe(sourcemaps.write("./maps"))
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
    [
      files.htmlPath,
      files.sassPath,
      files.cssPath,
      files.jsPath,
      files.picPath,
    ],
    parallel(htmlTask, sassTask, cssTask, jsTask, picTask)
  ).on("change", browserSync.reload);
}

// Dags att exportera, först körs alla task parallelt,
//  sedan watchTask med browserSync.
exports.default = series(
  parallel(htmlTask, sassTask, cssTask, jsTask, picTask),
  watchTask
);
