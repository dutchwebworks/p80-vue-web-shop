/*
	Dutchwebworks Grunt boilerplate, october 2017
	https://github.com/dutchwebworks/grunt-boilerplate
*/

module.exports = function(grunt) {

	/**********************************************************************
	1. Load all Grunt dependency NPM packages listed in `package.json`
	**********************************************************************/

	require('load-grunt-tasks')(grunt, {
		config: './package.json',
		scope: 'devDependencies'
	});
	
	/**********************************************************************
	2. Configure Grunt tasks and their targets
	**********************************************************************/

	grunt.initConfig({
		pkg: grunt.file.readJSON('./package.json'),

		config: {
			projectRoot: './',
		},

		watch: {
			scss: {
				options: {
					spawn: false
				},
				files: '<%= config.projectRoot %>/scss/**/*.scss',
				tasks: ['sass:dev']
			}
		},

		sass: {
			dev: {
				options: {
					outputStyle: 'expanded',
					sourceMap: true,
				},
				files: [{
					expand: true,
					cwd: '<%= config.projectRoot %>/scss',
					src: ['*.scss'],
					dest: '<%= config.projectRoot %>/css',
					ext: '.css',
				}]
			},
			dist: {
				options: {
					outputStyle: 'expanded',
					sourceMap: false,
				},
				files: [{
					expand: true,
					cwd: '<%= config.projectRoot %>/scss',
					src: ['*.scss'],
					dest: '<%= config.projectRoot %>/scss',
					ext: '.css',
				}]
			}
		},

		browserSync: {
			dev: {
				options: {
					watchTask: true,
					debugInfo: true,
					excludedFileTypes: ["map"],
					ghostMode: {
						clicks: false,
						scroll: false,
						links: false,
						forms: false
					},
					server: {
						baseDir: '<%= config.projectRoot %>',
						middleware: function (req, res, next) {
							res.setHeader('Access-Control-Allow-Origin', '*');
							next();
						}
					}
				},	
				bsFiles: {
					src: [
						'<%= config.projectRoot %>/css/**/*.css',
						'<%= config.projectRoot %>/js/**/*.js',
						'<%= config.projectRoot %>/**/*.html',
					]	
				}				
			}
		}
	});

	/**********************************************************************
	3. Registered Grunt tasks
	**********************************************************************/

	grunt.registerTask('default', [
		'browserSync',
		 'watch'
	]);
};