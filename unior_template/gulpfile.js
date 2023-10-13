'use strict';

// Import plugins
import pkg 				from 'gulp'
const { gulp, src, dest, parallel, series, watch } = pkg
import browserSync   	from 'browser-sync'
import dartSass         from 'sass';
import gulpSass         from 'gulp-sass';
const  sass             = gulpSass(dartSass);
import sourcemaps       from 'gulp-sourcemaps'
import concat        	from 'gulp-concat'
import jsImport        	from 'gulp-js-import'
import newer      		from 'gulp-newer'
import plumber      	from 'gulp-plumber'
import touch      		from 'gulp-touch-cmd'
import fileinclude      from 'gulp-file-include'
import beautify      	from 'gulp-beautify'
import uglifyim      	from 'gulp-uglify-es'
const  uglify        	= uglifyim.default
import {deleteAsync} 	from 'del'
import imageminfn    	from 'gulp-imagemin'
import cache         	from 'gulp-cache'
import autoprefixer  	from 'gulp-autoprefixer'

// Paths
const path = {
    dist: {
        html: 'dist/',
        js: 'dist/assets/js/',
        css: 'dist/assets/css/',
        style: 'dist/assets/css/',
        img: 'dist/assets/img/',
        fonts: 'dist/assets/fonts/',
        media: 'dist/assets/media/'
    },
    dev: {
        html: 'dev/',
        js: 'dev/assets/js/',
        css: 'dev/assets/css/',
        style: 'dev/assets/css/',
        img: 'dev/assets/img/',
        fonts: 'dev/assets/fonts/',
        media: 'dev/assets/media/'
    },
    src: {
        html: ['src/**/*.html', '!src/partials/**/*.html'],
        partials: 'src/partials/',
        js: 'src/assets/js/',
        vendorjs: 'src/assets/js/vendor/*.*',
        themejs: 'src/assets/js/theme.js',
        style: 'src/assets/scss/style.scss',
        vendorcss: 'src/assets/css/vendor/*.*',
        img: 'src/assets/img/**/*.*',
        fonts: 'src/assets/fonts/**/*.*',
        media: 'src/assets/media/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        partials: 'src/partials/**/*.*',
        themejs: 'src/assets/js/theme.js',
        vendorjs: 'src/assets/js/vendor/*.*',
        css: 'src/assets/scss/**/*.scss',
        vendorcss: 'src/assets/css/vendor/*.*',
        img: 'src/assets/img/**/*.*',
        fonts: 'src/assets/fonts/**/*.*',
        media: 'src/assets/media/**/*.*'
    },
    clean: {
        dist: 'dist/*',
        dev: 'dev/*',
    }
};

// 
// Web server
// 

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'dev/',
		},
		ghostMode: false,
		notify: false,
	})
}

// 
// Compile HTML
// 

function htmlDev() {
    return src(path.src.html)
    .pipe(newer({ dest: path.dev.html, extra: path.watch.partials }))
    .pipe(plumber())
    .pipe(fileinclude({ prefix: '@@', basepath: path.src.partials }))
    .pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
    .pipe(dest(path.dev.html))
    .pipe(touch())
	.on('end', () => { browserSync.reload(); })
}

function htmlDist() {
    return src(path.src.html)
    .pipe(newer({ dest: path.dist.html, extra: path.watch.partials }))
    .pipe(plumber())
    .pipe(fileinclude({ prefix: '@@', basepath: path.src.partials }))
    .pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
    .pipe(dest(path.dist.html))
    .pipe(touch())
}

// 
// Compile vendors JS
// 

function vendorjsDev() {
    return src([
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        path.src.vendorjs
    ])
	.pipe(jsImport({ hideConsole: true }))
	.pipe(concat('plugins.js'))
	.pipe(dest(path.dev.js))
	.pipe(touch())
	.on('end', () => { browserSync.reload(); })
}

function vendorjsDist() {
    return src([
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        path.src.vendorjs
    ])
	.pipe(jsImport({ hideConsole: true }))
	.pipe(concat('plugins.js'))
	.pipe(uglify())
	.pipe(dest(path.dist.js))
	.pipe(touch())
}

// 
// Compile theme JS
// 

function themejsDev() {
	return src(path.src.themejs)
	.pipe(dest(path.dev.js))
	.pipe(plumber())
	.pipe(dest(path.dev.js))
	.on('end', () => { browserSync.reload(); })
}

function themejsDist() {
	return src(path.src.themejs)
	.pipe(dest(path.dist.js))
	.pipe(plumber())
	.pipe(uglify())
	.pipe(dest(path.dist.js))
}

//
// Compile vendor CSS
//

function vendorcssDev() {
    return src(path.src.vendorcss)
	.pipe(concat('plugins.css'))
	.pipe(dest(path.dev.css))
	.pipe(touch())
	.on('end', () => { browserSync.reload(); })
}

function vendorcssDist() {
    return src(path.src.vendorcss)
	.pipe(concat('plugins.css'))
	.pipe(dest(path.dist.css))
	.pipe(touch())
}

// 
// Compile theme SCSS
// 

function themescssDev() {
	return src(path.src.style)
	.pipe(newer(path.dev.style))
	.pipe(plumber())
	.pipe(sass()
        .on('error', function (err) {
            sass.logError(err);
            this.emit('end');
        })
    )
	.pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
	.pipe(dest(path.dev.style))
	.pipe(touch())
	.on('end', () => { browserSync.reload(); })
}

function themescssDist() {
	return src(path.src.style)
	.pipe(newer(path.dist.style))
	.pipe(plumber())
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(autoprefixer())
	.pipe(dest(path.dist.style))
	.pipe(touch())
}

// 
// Images processing
// 

function imageminDev() {
	return src(path.src.img)
	.pipe(imageminfn())
	.pipe(dest(path.dev.img))
}

function imageminDist() {
	return src(path.src.img)
	.pipe(imageminfn())
	.pipe(dest(path.dist.img))
}

// 
// Move fonts
// 

function fontsDev() {
    return src(path.src.fonts)
	.pipe(newer(path.dev.fonts))
	.pipe(dest(path.dev.fonts));
}

function fontsDist() {
    return src(path.src.fonts)
	.pipe(newer(path.dist.fonts))
	.pipe(dest(path.dist.fonts));
}

// 
// Move media
// 

function mediaDev() {
    return src(path.src.media)
	.pipe(newer(path.dev.media))
	.pipe(dest(path.dev.media));
}

function mediaDist() {
    return src(path.src.media)
	.pipe(newer(path.dist.media))
	.pipe(dest(path.dist.media));
}

// Clear cache
async function removeDev() { await deleteAsync(path.clean.dev, { force: true }) }
async function removeDist() { await deleteAsync(path.clean.dist, { force: true }) }
async function clearcache() { cache.clearAll() }

// Run tasks when files changed
function watchers() {
    watch(path.watch.html, { usePolling: true }, series('htmlDev'))
    watch(path.watch.css, { usePolling: true }, series('themescssDev'))
    watch(path.watch.vendorcss, { usePolling: true }, series('vendorcssDev'))
    watch(path.watch.vendorjs, { usePolling: true }, series('vendorjsDev'))
    watch(path.watch.themejs, { usePolling: true }, series('themejsDev'))
    watch(path.watch.img, { usePolling: true }, series('imageminDev'))
    watch(path.watch.fonts, { usePolling: true }, series('fontsDev'))
    watch(path.watch.media, { usePolling: true }, series('mediaDev'))
}

export { 
    htmlDev, htmlDist, 
    vendorjsDev, vendorjsDist, 
    themejsDev, themejsDist, 
    vendorcssDev, vendorcssDist, 
    themescssDev, themescssDist, 
    imageminDev, imageminDist, 
    fontsDev, fontsDist, 
    mediaDev, mediaDist, 
    clearcache, removeDev, removeDist 
}

export const dev = series(removeDev, series(parallel(htmlDev, vendorjsDev, themejsDev, vendorcssDev, themescssDev, imageminDev, fontsDev, mediaDev), parallel(browsersync, watchers)))
export const dist = series(removeDist, parallel(htmlDist, vendorjsDist, themejsDist, vendorcssDist, themescssDist, imageminDist, fontsDist, mediaDist))

// Export a default task
export default dev;
