var gulp = require('gulp'),
	sass = require('gulp-sass'),
	notify = require('gulp-notify'),
	scsslint = require('gulp-scss-lint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	bower = require('gulp-bower');

var paths = {
	sass: ['./Resources/Private/Scss/**/*.scss', '!./Resources/Private/Scss/vendors/**/*.scss'],
	fonts: ['./Build/bower/fontawesome/fonts/*'],
	polymer: ['./Build/bower/polymer/*']
};

gulp.task('sass', function () {
	gulp.src(paths.sass)
		.pipe(sass({
			style: 'compressed',
			errLogToConsole: true
		}))
		.on('error', notify.onError({
			title: 'Sass Error',
			message: '<%= error.message %>'
		}))
		.pipe(gulp.dest('./Resources/Public/Css/'))
});

gulp.task('lint', function () {
	gulp.src(paths.sass)
		.pipe(scsslint({
			'config': 'Build/scss-lint.yml',
			'maxBuffer': 9999999
		}))
});

gulp.task('compile', function () {
	gulp.start('bower', 'copyfonts', 'copy-polymer', 'sass', 'uglify')
});

gulp.task('watch', function () {
	gulp.watch(paths.sass, ['lint', 'compile'])
});

gulp.task('bower', function () {
	return bower()
		.pipe(gulp.dest('Build/bower/'))
});

gulp.task('uglify', function () {
	gulp.src('Resources/Private/JavaScript/*.js')
		.pipe(concat('production.js'))
		.pipe(uglify())
		.pipe(rename('production.min.js'))
		.pipe(gulp.dest('Resources/Public/JavaScript/'))
});

gulp.task('copyfonts', function () {
	return gulp.src(paths.fonts)
		.pipe(gulp.dest('Resources/Public/Fonts/'));
});

gulp.task('copy-polymer', function () {
	return gulp.src(paths.polymer)
		.pipe(gulp.dest('Resources/Public/JavaScript/Polymer/'));
});


gulp.task('default', function () {
	gulp.start('lint', 'compile', 'watch')
});