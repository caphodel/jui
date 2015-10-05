module.exports = function (grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		concat : {
			options : {
				separator : ';',
				process : function (src, filepath) {
					return '/****' + filepath + '****/\n' + src;
				}
			},
			dist : {
				src : [
					'js/core.js',
					'lang/day.js',
					'lang/month.js',
					'js/keycodes.js',
					'js/method.js',
					'js/attrChange.js',
					'js/base.js',
					'js/button.js',
					'js/textField.js',
					'js/numberField.js',
					'js/passwordField.js',
					'js/comboField.js',
					'js/dateField.js',
					'js/loader.js',
					'js/dataView.js',
					'js/table.js',
					'js/tablePivotLeft.js',
					'js/tablePivotTop.js',
					'js/tableForm.js',
					'js/tableInPlaceForm.js',
					'js/tableCustom.js',
					'js/tableWrap.js',
					//'js/table.old.js',
					'js/drop.js',
					'js/toolbar.js',
					'js/toolbarScroll.js',
					'js/scroll.js',
					'js/pagination.js',
					'js/layoutContent.js',
					'js/layoutResizer.js',
					'js/colorPicker.js',
					'js/textarea.js'
				],
				dest : 'dist/<%= pkg.name %>.ui.js'
			},
			lib : {
				src : ['lib/document-register-element.js', 'lib/moment.js', 'lib/outside.js', 'lib/handlebars.runtime-v3.0.3.js', 'lib/helper.js', 'lib/touch.js', 'lib/nodoubletapzoom.js'],
				dest : 'dist/<%= pkg.name %>.lib.js'
			}
		},
		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> Copyright <%= pkg.author %> */\n',
				sourceMap : function (path) {
					return path + ".map";
				}
			},
			dist : {
				files : {
					'dist/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>'],
					'dist/jui2.tmp.min.js' : 'dist/jui2.tmp.js',
					'dist/jui2.lib.min.js' : 'dist/jui2.lib.js'
				}
			}
		},
		jshint : {
			files : ['js/*.js'],
			options : {
				// options here to override JSHint defaults
				globals : {
					jQuery : true,
					console : true,
					module : true,
					document : true
				}
			}
		},
		handlebars : {
			compile : {
				options : {
					namespace : 'jui2.tmpl',
					processName : function (filePath) {
						return filePath.replace(/^template\//, '').replace(/\.hbt$/, '');
					}
				},
				files : {
					"dist/jui2.tmp.js" : ["template/*.hbt"]
				}
			}
		},
		less : {
			production : {
				options : {
					cleancss : true,
					banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> Copyright <%= pkg.author %> */\n'
				},
				files : {
					"dist/jui2.css" : "less/style.less"
				}
			}
		},
		cssmin : {
			minify: {
				options: {
					'report': 'min'
				},
				expand: true,
				cwd: 'dist/',
				src: ["jui2.css"],
				dest: 'dist/',
				ext: '.min.css'
			}
		},
		'ftp-deploy' : {
			gg_05 : {
				auth : {
					host : 'gggmpscdweb05',
					port : 21,
					authKey : 'key1'
				},
				src : 'dist',
				dest : '/rnd/dist'
			},
			gg_beta_05 : {
				auth : {
					host : 'gggmpscdweb05',
					port : 21,
					authKey : 'key1'
				},
				src : 'dist',
				dest : '/gg_beta/rnd/dist'
			},
			gg_03 : {
				auth : {
					host : 'gggmpscdweb03',
					port : 21,
					authKey : 'key1'
				},
				src : 'dist',
				dest : '/rnd/dist'
			},
			gg_beta_08 : {
				auth : {
					host : 'gggmpscdweb08',
					port : 21,
					authKey : 'key1'
				},
				src : 'dist',
				dest : '/gg_beta/rnd/dist'
			}
		},
		jsdoc : {
			dist : {
				src: ['js/*.js'],
				options: {
					destination: 'dist/doc'
				}
			}
		},
		copy: {
			main: {
				files: [
				  // includes files within path
				  {expand: true, src: 'out/*', dest: 'dist/'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-yui-compressor');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['concat', 'handlebars', 'uglify', 'less', 'cssmin', 'copy']);

};
