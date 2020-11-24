"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var scrape = require('website-scraper');

var path = require('path');

var fs = require('fs');

var Spinner = require('../lib/spinner');

var progress = new Spinner();

var MyPlugin = /*#__PURE__*/function () {
  function MyPlugin() {
    (0, _classCallCheck2["default"])(this, MyPlugin);
  }

  (0, _createClass2["default"])(MyPlugin, [{
    key: "apply",
    value: function apply(registerAction) {
      registerAction('beforeStart', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                progress.start('获取页面资源中');

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })));
      registerAction('afterFinish', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                progress.succeed('抓取完毕');

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })));
    }
  }]);
  return MyPlugin;
}();

module.exports = function (cmd) {
  if (fs.existsSync(path.join(process.cwd(), cmd.output))) {
    progress.fail('文件夹已存在！');
  } else {
    scrape({
      urls: [cmd.address],
      directory: path.join(process.cwd(), cmd.output),
      recursive: cmd.recursive,
      plugins: [new MyPlugin()],
      maxRecursiveDepth: 1,
      maxDepth: 1,
      defaultFilename: /.html?/gi.test(cmd.address) ? false : 'index.html'
    });
  }
};