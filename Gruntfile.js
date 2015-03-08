module.exports = function(grunt) {
    var filesToWatch = [
        'js/app/gameVars.js',

        'js/app/enemies/enemy.js',
        'js/app/enemies/charger.js',
        'js/app/enemies/sidestepper.js',
        'js/app/enemies/backtracker.js',
        'js/app/enemies/slowpoke.js',
        'js/app/enemies/centipede.js',
        'js/app/enemies/centipede-sidestepper.js',

        'js/app/player/player.js',
        'js/app/player/attack.js',
        'js/app/player/hadouken.js',
        'js/app/player/tripleHadouken.js',
        'js/app/player/tomato.js',

        'js/app/items/item.js',
        'js/app/items/heart.js',
        'js/app/items/key.js',
        'js/app/items/gem.js',

        'js/app/tiles/mapTile.js',
        'js/app/tiles/grass.js',
        'js/app/tiles/stone.js',
        'js/app/tiles/water.js',
        'js/app/tiles/mapObject.js',
        'js/app/tiles/startPoint.js',
        'js/app/tiles/door.js',
        'js/app/tiles/rock.js'];
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            app: {
                banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                src: filesToWatch,
                dest: 'js/app/app.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: true
            },
            build: {
                src: 'js/app/app.js',
                dest: 'js/app/app.min.js'
            }
        },
        watch: {
            js: {
                files: filesToWatch,
                tasks: ['concat', 'uglify'],
                options: {
                    livereload: true
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};