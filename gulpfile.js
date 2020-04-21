
var gulp = require('gulp');
var rename = require("gulp-rename");

/**
 * 获取 imagemin 模块（用于压缩图片）
 * 压缩图片：在命令行使用 gulp imgcompress 启动此任务
 */
var smushit = require('gulp-smushit');
gulp.task('imgcompress', function () {
  return gulp.src('src/images/*.{png,jpg}')
      .pipe(smushit({
          verbose: true
      }))
      .pipe(gulp.dest('dist/images'));
});

/**
 * 获取 cleancss 模块（用于压缩 CSS）
 * 压缩 css 文件：在命令行使用 gulp csscompress 启动此任务
 */
var cleanCSS = require('gulp-clean-css');
gulp.task('csscompress', function() {
  return  gulp.src('src/css/*.css')
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
});

/**
 * 获取 uglify 模块（用于压缩 JS）
 * 压缩 js 文件：在命令行使用 gulp script 启动此任务
 */
var uglify = require('gulp-uglify');
gulp.task('jscompress', function() {
   return gulp.src('src/js/*.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

/**
 * 在命令行使用 gulp auto 启动此任务
 * 监听文件修改，当文件被修改（新保存）则执行 script 任务
 */
gulp.task('watch', function () {
    gulp.watch('src/js/*.js', ['jscompress']);
    gulp.watch('src/css/*.css', ['csscompress']);
    gulp.watch('src/images/*.{png,jpg,gif,ico}', ['imgcompress']);
});


/**
 * 使用 gulp.task('default') 定义默认任务
 * 在命令行使用 gulp 启动 script 任务和 auto 任务
 */
// gulp.task('default', ['watch']);