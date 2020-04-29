
var gulp = require('gulp');
var sequence = require('run-sequence');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer'); // css 加前缀
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var rev = require('gulp-rev'); // 生成hash
var babel = require("gulp-babel");

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
 * 获取 cleancss 模块（用于合并再压缩 CSS）
 * 合并压缩 css 文件：在命令行使用 gulp csscompress 启动此任务
 */
var cleanCSS = require('gulp-clean-css');
gulp.task('csscompress', function() {
  return  gulp.src('src/css/*.css')
        .pipe(autoprefixer())
        .pipe(concat('main.css'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(rev())    // 添加hash
        .pipe(gulp.dest('dist/css'))
/* 
        .pipe(rev.manifest())   //生成文件映射
        .pipe(gulp.dest('rev/css')); //将映射文件导出到rev/css
 */
});

/**
 * 获取 uglify 模块（用于压缩 JS）
 * 合并压缩 js 文件：在命令行使用 gulp script 启动此任务
 */
var uglify = require('gulp-uglify');
gulp.task('jscompress', function() {
   return gulp.src('src/js/*.js')
        .pipe(babel())
        .pipe(concat('main.js')) 
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(rev())    // 添加hash
        .pipe(gulp.dest('dist/js'))
/* 
        .pipe(rev.manifest())   //生成文件映射
        .pipe(gulp.dest('rev/js')); //将映射文件导出到rev/js
      */   
});


/**
 * 根据映射文件，替换HTML中的js、css路径
 */

// var revCollector = require('gulp-rev-collector');
// gulp.task('replace', function() {
//     return gulp.src(['rev/**/*.json', 'src/*.html'])
//         .pipe(revCollector({
//             replaceReved: true,  //允许替换, 已经被替换过的文件
//             dirReplacements: {
//                 'css': 'dist/css',
//                 'js': 'dist/js'
//             }
//         }))
//         .pipe(gulp.dest('dist'));
// });

/**
 * 清除之前的文件
 */

gulp.task('clean', function(){
    return gulp.src(['dist', 'rev'])
        .pipe(clean());
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
 * 使用 gulp.task('auto') 定义默认任务
 * 在命令行使用 gulp 启动 script 任务和 auto 任务
 */
gulp.task('auto', function(cb) {
    sequence(['clean'], ['imgcompress','csscompress', 'jscompress'], cb);
});

//启动手机调试
var sh = require('shelljs');
gulp.task('debug', function () {
    sh.exec('weinre -httpPort 8081 -boundHost -all-');
});