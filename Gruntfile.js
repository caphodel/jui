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
					'js/modal.js',
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
					'dist/<%= pkg.name %>.ui.min.js' : ['<%= concat.dist.dest %>'],
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
					"dist/css/jui2.css" : "less/style.less"
				}
			}
		},
		cssmin : {
			minify: {
				options: {
					'report': 'min'
				},
				expand: true,
				cwd: 'dist/css/',
				src: ["jui2.css"],
				dest: 'dist/css/',
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
					destination: 'out',
					template: "jsdoc/default",
					configure: "conf.json"
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
		},
		compress: {
		  main: {
		    options: {
		      archive: 'jui.zip' // What you want to call your file
		    },
		    files: [
		      {
		        src: ['dist/**'], // What should be included in the zip
		        dest: './'        // Where the zipfile should go
		      },
		      {
		        src: ['dist/out/**'], // What should be included in the zip
		        dest: './'        // Where the zipfile should go
		      },
		      {
		        src: ['dist/css/**'], // What should be included in the zip
		        dest: './'        // Where the zipfile should go
		      },
		      {
		        src: ['css/**'], // What should be included in the zip
		        dest: './dist'        // Where the zipfile should go
		      },
		      {
		        src: ['fonts/**'], // What should be included in the zip
		        dest: './dist'        // Where the zipfile should go
		      }
		    ]
		  }
		},
		'github-release': {
		  options: {
		    repository: 'caphodel/jui',
		    release: {
		      tag_name: grunt.file.readJSON('package.json').version,
		      name: grunt.file.readJSON('package.json').version,
		      body: grunt.file.readJSON('package.json').description
		    }
		  },
		  files: {
		    src: ['jui.zip']
		  }
		},
		prompt: {
			'default':{
		    options: {
					questions: [
	          {
	            config: 'task.runner',
	            type: 'list',
	            message: 'Which task would you like to use?',
	            default: 'compile',
	            choices: ['compile', 'development', 'production', 'release']
	          }
	        ],
					then: function(results, done) {
	          if(results['task.runner']=='compile'){
							grunt.task.run('compile')
						}
	          if(results['task.runner']=='development'){
							grunt.task.run('development')
						}
	          if(results['task.runner']=='production'){
							grunt.task.run('production')
						}
	          if(results['task.runner']=='release'){
							grunt.task.run('release')
						}
	        }
		    }
			},
			'release': {
				options: {
		      questions: [
		        {
		          config: 'github-release.options.auth.user', // set the user to whatever is typed for this question
		          type: 'input',
		          message: 'GitHub username:'
		        },
		        {
		          config: 'github-release.options.auth.password', // set the password to whatever is typed for this question
		          type: 'password',
		          message: 'GitHub password:'
		        }
		      ]
		    }
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
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-github-releaser');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('default', ['prompt:default']);
	grunt.registerTask('compile', ['concat', 'handlebars', 'uglify', 'less', 'cssmin', 'copy']);
	grunt.registerTask('development', ['concat', 'handlebars', 'uglify', 'less', 'cssmin', 'copy', 'ftp-deploy:gg_beta_05']);
	grunt.registerTask('production', ['concat', 'handlebars', 'uglify', 'less', 'cssmin', 'copy', 'ftp-deploy']);
	grunt.registerTask('release', ['prompt:release', 'concat', 'handlebars', 'uglify', 'less', 'cssmin', 'copy', 'compress'/*, 'github-release'*/]);

};
