let gulp = require('gulp');
let minifycss = require('gulp-minify-css');
let uglify = require('gulp-uglify');
let htmlmin = require('gulp-htmlmin');
let htmlclean = require('gulp-htmlclean');
let imagemin = require('gulp-imagemin');

//压缩css文件
gulp.task('minify-css',()=>{
    return gulp.src('./public/**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./public'));
});

//压缩html文件
gulp.task('minify-html',()=>{
    return gulp.src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
        removeComments:true,
        minifyJS:true,
        minifyCSS:true,
        minifyURLs:true,
    }))
    .pipe(gulp.dest('./public'))
});

//压缩js文件
gulp.task('minify-js',()=>{
    return gulp.src(['./public/**/*.js','!./public/js/**/*min.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./public'));
});

//压缩 public/image目录内图片
gulp.task('minify-images',()=>{
    gulp.src('./public/images/*.*')
    .pipe(imagemin({
        optimizationLevel: 5, //类型:Number 默认：3 取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: false, //类型：Boolean 默认：false 隔行扫描git进行渲染
        multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest('./public/images'));
});

//默认任务
gulp.task('default' ,[
    'minify-html','minify-css','minify-js','minify-images'
]);