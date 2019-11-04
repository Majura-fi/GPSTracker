module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        force: true,
        esversion: 6,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          log: true,
          google: true,
          angular: true,
          isMobile: true,
          moment: true,
          chrome: true,
          console: true,
          browser: true,
          module: true
        }
      },
      gruntfile: ['Gruntfile.js'],
      frontend: [
        'frontend/src/**/*.js',
        'frontend/src/**/*.json',
        '!frontend/src/vendor/**/*.js'
      ]
    },
    concat: {
      css: {
        src: ['frontend/css/**/*.css'],
        dest: 'dist/main.css'
      },
      css_vendor: {
        src: [
          'node_modules/angular-material/angular-material.css',
          'node_modules/bootstrap/dist/css/bootstrap.css',
          'frontend/src/vendor/**/*.css'
        ],
        dest: 'dist/vendor.css'
      },
      frontend: {
        src: [
          'frontend/src/app.js',
          'frontend/src/**/*_service.js',
          'frontend/src/**/*_controller.js',
          'frontend/src/**/*.js'
        ],
        dest: 'tmp/main.js'
      },
      vendor: {
        src: [
          'node_modules/loglevel/dist/loglevel.min.js',
          'node_modules/moment/min/moment.min.js',
          'node_modules/moment/min/locales.min.js',
          'node_modules/angular/angular.min.js',
          'node_modules/angular-sanitize/angular-sanitize.js',
          'node_modules/angular-material/angular-material.min.js',
          'node_modules/ngmap/build/scripts/ng-map.min.js',
          'frontend/src/vendor/**/*.js'
        ],
        dest: 'dist/vendor.js'
      }
    },
    'string-replace': {
      dev: {
        files: [{
          expand: true,
          cwd: 'tmp/',
          src: '**/*',
          dest: 'dist/',
          dot: true
        }],
        options: {
          replacements: [
            {
              pattern: /\[DEV_REWRITE_URL\]/ig,
              replacement: '/GPSTracker/api/'
            },
            {
              pattern: /\[DEV_BASE_URL\]/ig,
              replacement: '/GPSTracker/api'
            }
          ]
        }
      },
      prod: {
        files: [{
          expand: true,
          cwd: 'tmp/',
          src: '**/*',
          dest: 'dist/',
          dot: true
        }],
        options: {
          replacements: [
            {
              pattern: /\[DEV_REWRITE_URL\]/ig,
              replacement: '/GPSTracker/api/'
            },
            {
              pattern: /\[DEV_BASE_URL\]/ig,
              replacement: '/GPSTracker/api'
            }
          ]
        }
      }
    },
    move: {
      tmp: {
        src: 'tmp/*',
        dest: 'dist/'
      }
    },
    copy: {
      frontend: {
        files: [{
          expand: true,
          src: ['**/*.html'],
          cwd: 'frontend/',
          dest: 'tmp/',
          filter: 'isFile'
        }]
      },
      images: {
        files: [{
          expand: true,
          src: ['img/*.*'],
          cwd: 'frontend/',
          dest: 'dist/',
          filter: 'isFile'
        }]
      },
      backend: {
        files: [{
          expand: true,
          src: ['**/*'],
          cwd: 'backend',
          dest: 'tmp/api/',
          filter: 'isFile',
          dot: true
        }]
      }
    },
    clean: {
      all: ['tmp/*', 'dist/*'],
      tmp: ['tmp/*'],
      dist: ['dist/*']
    },
    less: {
      css: {
        files: { 'dist/main.css': 'frontend/scss/**/*.scss' }
      }
    },
    watch: {
      options: {
        livereload: true,
        dot: true
      },
      tmp: {
        files: ['tmp/*'],
        tasks: ['string-replace:dev']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile']
      },
      frontend_source: {
        files: ['frontend/src/**/*.js', 'frontend/src/**/*.json'],
        tasks: ['jshint:frontend', 'concat:frontend', 'string-replace:dev']
      },
      frontend_css: {
        files: ['frontend/scss/**/*.scss'],
        tasks: ['less:css']
      },
      frontend_images: {
        files: ['frontend/img/**/*.*'],
        tasks: ['copy:images']
      },
      frontend_other: {
        files: ['frontend/**/*.html'],
        tasks: ['copy:frontend', 'string-replace:dev']
      },
      backend: {
        files: ['backend/**/*.php'],
        tasks: ['copy:backend', 'string-replace:dev']
      },
      vendor: {
        files: [
          'node_modules/loglevel/dist/loglevel.min.js',
          'node_modules/ngmap/build/scripts/ng-map.js',
          'node_modules/angular/angular.min.js'
        ],
        tasks: ['concat:vendor']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-move');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-string-replace');

  // Default task(s).
  grunt.registerTask('default', [
    'clean:all',
    'jshint:gruntfile',
    'jshint:frontend',
    'concat:frontend',
    'less:css',
    'concat:css_vendor',
    'copy:frontend',
    'copy:images',
    'copy:backend',
    'string-replace:dev',
    'concat:vendor',
    'clean:tmp',
    'watch'
  ]);

  // Default task(s).
  grunt.registerTask('publish', [
    'clean:all',
    'jshint:gruntfile',
    'jshint:frontend',
    'concat:frontend',
    'less:css',
    'concat:css_vendor',
    'copy:frontend',
    'copy:images',
    'copy:backend',
    'string-replace:prod',
    'concat:vendor',
    'clean:tmp'
  ]);

};
