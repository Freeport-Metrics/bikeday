module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      add_banner: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          'dist/<%= pkg.name %>.css': ['src/**/*.css']
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    connect: {
      'static': {
        options: {
          hostname: 'localhost',
          port: 8001
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    includeSource: {
      options: {
        basePath: '',
        baseUrl: ''
      },
      myTarget: {
        files: {
          'index.html': 'index.html.tpl'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'src/**/*.*', '**/*.*.tpl'],
      tasks: ['jshint', 'cssmin', 'concat', 'includeSource']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-include-source');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('server', ['connect', 'watch']);
  grunt.registerTask('default', ['jshint', 'cssmin', 'concat', 'uglify', 'includeSource']);

};