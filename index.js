// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var PLUGIN_NAME, defaultOptions, fs, isCoffeeScript, path, through, _;

  PLUGIN_NAME = 'gulp-wrap-commonjs';

  fs = require('fs');

  path = require('path');

  _ = require('lodash');

  through = require('through2');

  defaultOptions = {
    autoRequire: false,
    moduleExports: false,
    relativePath: false,
    pathModifier: false,
    coffee: false
  };

  isCoffeeScript = function(filePath) {
    return filePath.slice(-7) === '.coffee';
  };

  module.exports = function(options) {
    var templateCoffee, templateJs;
    if (options == null) {
      options = {};
    }
    _.defaults(options, defaultOptions);
    templateJs = _.template(fs.readFileSync("" + __dirname + "/templates/js.tpl", {
      encoding: 'utf8'
    }));
    templateCoffee = _.template(fs.readFileSync("" + __dirname + "/templates/coffee.tpl", {
      encoding: 'utf8'
    }));
    return through.obj(function(file, enc, next) {
      var filePath, params, wrappedContent;
      if (file.isBuffer()) {
        filePath = file.path;
        if (typeof options.pathModifier === "function") {
          filePath = options.pathModifier(file.path);
        }
        if (typeof options.relativePath === "string") {
          filePath = path.relative(path.join(process.cwd(), options.relativePath), filePath);
        }
        params = {
          contents: file.contents.toString('utf8'),
          filePath: filePath,
          autoRequire: options.autoRequire,
          moduleExports: options.moduleExports
        };
        if (options.coffee || isCoffeeScript(file.path)) {
          wrappedContent = templateCoffee(params);
        } else {
          wrappedContent = templateJs(params);
        }
        file.contents = new Buffer(wrappedContent);
      }
      return next(null, file);
    });
  };

}).call(this);
