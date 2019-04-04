let gulp = require('gulp');
let minifycss = require('gulp-minify-css');
let uglify = require('gulp-uglify');
let htmlmin = require('gulp-htmlmin');
let htmlclean = require('gulp-htmlclean');
let imagemin = require('gulp-imagemin');
let del = require('del');

var paths = {
  styles:{
    src:'./public/**/*.css',
    dest:'./public'
  },
  scripts:{
    src:['./public/**/*.js','!./public/js/**/*min.js'],
    dest:'./public'
  },
  htmls:{
    src:'./public/**/*.html',
    dest:'./public'
  },
  images:{
    src:'./public/images/*.*',
    dest:'./public/images'
  }
}
//压缩css文件
function styles(){
  return gulp.src(paths.styles.src)
  .pipe(minifycss())
  .pipe(gulp.dest(paths.styles.dest));
}

//压缩html文件
function htmls(){
  return gulp.src(paths.htmls.src)
  .pipe(htmlclean())
  .pipe(htmlmin({
      continueOnParseError:true,
      collapseWhitespace: true,
      removeComments: true,
      removeOptionalTags: true,
      removeEmptyElements: true,
      caseSensitive: true,
      minifyJS:true,
      minifyCSS:true,
      minifyURLs:true,
  }))
  .pipe(gulp.dest(paths.htmls.dest))
}

//压缩js文件
function scripts(){
  return gulp.src(paths.scripts.src)
  .pipe(uglify())
  .pipe(gulp.dest(paths.scripts.dest));
}

//压缩 public/image目录内图片
function images(){
  return  gulp.src(paths.images.src)
  .pipe(imagemin({
      optimizationLevel: 5, //类型:Number 默认：3 取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: false, //类型：Boolean 默认：false 隔行扫描git进行渲染
      multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
  }))
  .pipe(gulp.dest(paths.images.dest));
}

function clean(){
  return del(['asserts'])
}

function watch(){
  gulp.watch(paths.styles.src,styles);
  gulp.watch(paths.htmls.src,htmls);
  gulp.watch(paths.scripts.src,scripts);
  gulp.watch(paths.images.src,images);
}

//var build = gulp.series(clean,gulp.parallel(styles,htmls,scripts,images))
var build = gulp.series(clean,gulp.parallel(styles,htmls,scripts,images))


exports.clean = clean;
exports.watch = clean;
exports.styles = styles;
exports.htmls = htmls;
exports.scripts = scripts;
exports.images = images;
exports.build = build;

exports.default = build;
