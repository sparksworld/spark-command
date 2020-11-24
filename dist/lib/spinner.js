"use strict";

var ora = require("ora");

var chalk = require("chalk");

module.exports = function () {
  this.spinner = ora({// spinner: {
    // interval: 80, // Optional
    // frames: ['-', '+', '-']
    // }
  });

  this.start = function (message, color) {
    this.spinner.start();
    this.spinner.text = color ? chalk[color](message) : message;
  };

  this.setText = function (message, color) {
    this.spinner.text = color ? chalk[color](message) : message;
  };

  this.stop = function () {
    this.spinner.stop();
  };

  this.warn = function (message) {
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "yellow";
    this.spinner.warn(chalk[color](message));
  };

  this.succeed = function (message) {
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "green";
    this.spinner.succeed(chalk[color](message));
  };

  this.fail = function (message) {
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "red";
    this.spinner.fail(chalk[color](message));
  };
};