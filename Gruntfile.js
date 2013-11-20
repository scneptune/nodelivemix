module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jslint: {
			server: {
				src: [ // some example files
					'*.js',
				],
				exclude: ['Gruntfile.js', 'audiotest.js'],
				directives: { // example directives
					node: true,
					predef: ['binaryjs', 'express'],
					nomen: true,
					devel: true,
					unparam: true,
					white: true,
					todo: true
				},
				options: {
					log: 'out/server-lint.log',
					errorsOnly: true, // only display errors
					failOnError: false, // defaults to true
					shebang: true,
				}
			}
		},
		compass: {
			dist: {
				options: {
					sassDir: 'public/sass',
					cssDir: 'public/css',
					trace: true
				}
			}
		},
		watch: {
			scripts: {
				files: ['server.js'],
				tasks: ['jslint']	
			},
			css: {
				files: ['public/sass/style.sass' ],
				tasks: ['compass']
			}
		}
	});

	// Load the plugin that provides the "jslint" task.
	grunt.loadNpmTasks('grunt-jslint');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['jslint']);

};
