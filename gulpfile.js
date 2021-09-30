// Metoder
const { src, dest, parallel, series, watch } = require("gulp");
// slå ihop filer npm install gulp-concat --save-dev
const concat = require("gulp-concat");
// minimera js npm install gulp-terser --save-dev
const terser = require("gulp-terser");
// minimera bilder npm install gulp-imagemin --save-dev
const imagemin = require("gulp-imagemin");
// browsersync npm install browser-sync --save-dev
const browserSync = require("browser-sync").create();
// sourceMaps npm i gulp-sourcemaps --save-dev
const sourcemaps = require("gulp-sourcemaps");
//npm install sass gulp-sass --save-dev
const sass = require("gulp-sass")(require("sass"));
// npm install --save-dev gulp-babel @babel/core
const babel = require("gulp-babel");
// npm install typescript --save-dev
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

// objekt för att lagra sökvägar
const files = {
  htmlPath: "src/**/*.html",
  sassPath: "src/**/*.scss",
  tsPath: "src/typescript/*.ts",
  jsPath: "src/**/*.js",
  picPath: "src/pics/*",
  vidPath: "src/video/*",
};

// htmlTask
function htmlTask() {
  return (
    // Hämta filerna
    src(files.htmlPath)
      // skicka till pub
      .pipe(dest("pub"))
    // .pipe(browserSync.stream())
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

// jsTask
function jsTask() {
  return (
    src(files.jsPath, { sourcemaps: true })
      // // sourcemap
      // .pipe(sourcemaps.init())
      .pipe(babel({ presets: ["@babel/env"] }))
      // slå ihop
      .pipe(concat("main.js"))

      // minimera filer
      .pipe(terser())
      // sourcemaps
      // .pipe(sourcemaps.write("./maps"))
      // skicka till pub
      .pipe(dest("pub/js", { sourcemaps: " . " }))
  );
}
// typescript task
function typescriptTask() {
  return (
    src(files.tsPath, { sourcemaps: true })
      // sourcemap
      // .pipe(sourcemaps.init())
      .pipe(tsProject())
      // minimera filer
      .pipe(terser())
      // sourcemaps
      // .pipe(sourcemaps.write("./maps"))
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

// vidTask
function vidTask() {
  return (
    // Hämta filerna
    src(files.vidPath)
      // skicka till pub
      .pipe(dest("pub/video"))
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
      files.jsPath,
      files.tsPath,
      files.picPath,
      files.vidPath,
    ],
    parallel(htmlTask, sassTask, jsTask, typescriptTask, picTask, vidTask)
  ).on("change", browserSync.reload);
}

// Dags att exportera, först körs alla task parallelt,
//  sedan watchTask med browserSync.
exports.default = series(
  parallel(htmlTask, sassTask, jsTask, typescriptTask, picTask, vidTask),
  watchTask
);
