module.exports = function (grunt) {

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
    simplemocha: {
      options: {
        globals: ['expect'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'min'
      },
      all: { src: ['test/*.js'] }
    },
    includeSource: {
      options: {
        basePath: '',
        baseUrl: ''
      },
      myTarget: {
        files: {
          'index.html': '_index.html',
          'mobile.html': '_mobile.html'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'src/**/*.*', '**/_*.html'],
      tasks: ['jshint', 'simplemocha', 'cssmin', 'concat', 'includeSource']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-include-source');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('test', ['jshint', 'simplemocha']);
  grunt.registerTask('server', ['jshint', 'simplemocha', 'connect', 'watch']);
  grunt.registerTask('default', ['jshint', 'simplemocha', 'cssmin', 'concat', 'uglify', 'includeSource']);

};