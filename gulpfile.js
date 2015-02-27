var gulp = require('gulp'),
	sass = require('gulp-sass'),
	notify = require('gulp-notify'),
	scsslint = require('gulp-scss-lint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	cached = require('gulp-cached'),
	bower = require('gulp-bower');

var config = {
	paths: {
		sass: ['./Resources/Private/Scss/**/*.scss', './Resources/Private/Scss/*.scss', '!./Resources/Private/Scss/vendors/**/*.scss'],
		fonts: ['./Build/bower/fontawesome/fonts/*'],
		bootstrap: './Build/bower/bootstrap-sass-twbs/assets/',
		bootstrapoffcanvas: './Build/bower/jasny-bootstrap/dist/'
	},
	autoprefixer: {
		browsers: [
			'last 2 versions',
			'safari 6',
			'ie 9',
			'opera 12.1',
			'ios 6',
			'android 4'
		],
		cascade: true
	}
};

gulp.task('sass', function () {
	gulp.src(config.paths.sass)
		.pipe(sass({
			style: 'compressed',
			errLogToConsole: true,
			sourcemaps: true
		}))
		.on('error', notify.onError({
			title: 'Sass Error',
			message: '<%= error.message %>'
		}))
		.pipe(autoprefixer(
			config.autoprefixer
		))
		.pipe(gulp.dest('./Resources/Public/Css/'))
});

gulp.task('lint', function () {
	gulp.src(config.paths.sass)
		.pipe(cached('scsslint'))
		.pipe(scsslint({
			'reporterOutput': './/Build/ScssReport.xml',
			'config': 'Build/scss-lint.yml',
			'maxBuffer': 9999999
		}))
});

gulp.task('compile', function () {
	gulp.start('bower', 'copy-fonts', 'copy-bootstrap-js', 'copy-offcanvas', 'sass', 'uglify')
});

gulp.task('watch', function () {
	gulp.watch(config.paths.sass, ['lint', 'compile'])
});


gulp.task('uglify', ['bower', 'copy-bootstrap-js', 'copy-offcanvas'], function () {
	gulp.src('Resources/Private/JavaScript/*.js')
		.pipe(concat('production.js'))
		.pipe(uglify())
		.pipe(rename('production.min.js'))
		.pipe(gulp.dest('Resources/Public/JavaScript/'))
});

gulp.task('copy-bootstrap-js', function () {
	return gulp.src(config.paths.bootstrap + 'javascripts/bootstrap.js')
		.pipe(gulp.dest('Resources/Private/JavaScript/'));
});

gulp.task('copy-offcanvas', function() {
	return gulp.src(config.paths.bootstrapoffcanvas + 'js/jasny-bootstrap.js')
		.pipe(gulp.dest('Resources/Private/JavaScript/'));
});

gulp.task('bower', function () {
	return bower()
		.pipe(gulp.dest('Build/bower/'))
});


gulp.task('copy-fonts', function () {
	return gulp.src(config.paths.fonts)
		.pipe(gulp.dest('Resources/Public/Fonts/'));
});

gulp.task('default', function () {
	gulp.start('lint', 'compile', 'watch')
});