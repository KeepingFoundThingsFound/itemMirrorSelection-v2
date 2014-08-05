module.exports = function (grunt) {


// Project configuration.
grunt.initConfig({
  connect: {
    server: {
      options: {
        port: 1337,
      }
    }
  }
});
grunt.loadNpmTasks('grunt-contrib-connect');
}