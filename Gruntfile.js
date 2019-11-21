const path = require('path');

module.exports = grunt => {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  const gruntConfig = {
    buildFolder: 'dist',
    mode: 'development',
    isDebug: 'y',
    setupMode(mode = 'development') {
      /*
      @param mode {string} "development|production"
       */
      this.mode = mode;
      if (mode === 'production') {
        this.isDebug = '';
      }
    }
  };

  grunt.registerTask('build', () => {
    gruntConfig.setupMode('production');
    grunt.task.run([
      'clean:dist',
      'ect:express',
      'parallel:build'
    ]);
  });

  grunt.registerTask('default', () => {
    gruntConfig.setupMode('development');
    grunt.task.run([
      'clean:dist',
      'ect:express',
      'parallel:startDevelop'
    ]);
  });

  grunt.config.init({
    config: gruntConfig,
    clean: {
      dist: ['dist']
    },
    ect: {
      express: {
        options: {
          root: path.join('src'),
          variables: {isDebug: '<%= config.isDebug %>'}
        },
        expand: true,
        flatten: false,
        cwd: path.join('src', 'express'),
        src: path.join('**', '*.html'),
        dest: path.join('<%= config.buildFolder %>', 'express'),
        ext: '.html'
      }
    },
    watch: {
      expressTemplates: {
        files: [
          path.join('src', 'express', '**', '*.html')
        ],
        tasks: [
          'ect:express'
        ]
      }
    },
    parallel: {
      build: {
        tasks: [
          {
            // Run webpack.
            stream: true,
            cmd: 'node',
            args: (() => {
              const result = [
                path.join('node_modules', 'webpack', 'bin', 'webpack.js'),
                '--env.mode=production',
                '--env.buildFolder=<%= config.buildFolder %>'
              ];
              if (grunt.option('analyze')) {
                result.push('--env.analyzeBuild=true');
              }

              return result;
            })()
          }
        ]
      },
      startDevelop: {
        tasks: (() => {
          const result = [
            {
              grunt: true,
              stream: true,
              args: ['watch']
            },
            {
              // Run webpack dev server.
              stream: true,
              cmd: 'node',
              args: (() => {
                const result = [
                  path.join('node_modules', 'webpack-dev-server', 'bin', 'webpack-dev-server.js')
                ];
                if (grunt.option('nobackend')) {
                  result.push('--env.disablemockserver=true');
                }

                return result;
              })()
            }
          ];
          if (!grunt.option('nobackend')) {
            result.push({
              // Run nodemon web server.
              stream: true,
              cmd: 'node',
              args: [
                path.join('node_modules', 'nodemon', 'bin', 'nodemon.js'),
                path.join('backend', 'server.js'),
                '--watch',
                path.join('backend')
              ]
            });
          }

          return result;
        })()
      }
    }
  });
};
