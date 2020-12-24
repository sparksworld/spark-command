"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var inquirer = require("inquirer");

var fs = require("fs");

var co = require("co");

var path = require("path");

var OSS = require("ali-oss");

var opera = require("../lib/operating");

var Spinner = require("../lib/spinner");

var _require = require("../spark/tools"),
    formatDate = _require.formatDate;

var progress = new Spinner();

function get_all_resource(root) {
  var files = [];

  function readDirSync(p) {
    var pa = fs.readdirSync(p);
    pa.forEach(function (e) {
      var cur_path = "".concat(p, "/").concat(e);
      var info = fs.statSync(cur_path);

      if (info.isDirectory()) {
        readDirSync(cur_path);
      } else {
        files.push(cur_path);
      }
    });
  }

  readDirSync(root);
  return files;
}

module.exports = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(cmd) {
    var targetPath, templatePath, _oss_config, list, isExistObject, backup, _oss_conf_dir, _oss_source, _oss_target, _oss_all_resource_var, _local_length, client, prompt, res, _oss_conf_arr, key;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            targetPath = path.join(process.cwd(), "./oss.config.js");
            templatePath = path.join(__dirname, "../spark/config/oss.config.js");

            if (!cmd.init) {
              _context7.next = 6;
              break;
            }

            if (fs.existsSync(targetPath)) {
              inquirer.prompt([{
                type: "confirm",
                name: "isCover",
                message: "已存在配置文件，是否将文件覆盖？",
                validate: function validate(val) {
                  if (val.lowerCase !== "y" && val.lowerCase !== "n") {
                    return "Please input y/n !";
                  } else {
                    return true;
                  }
                }
              }]).then(function (res) {
                if (res.isCover) {
                  opera.copyFile(templatePath, targetPath);
                }
              });
            } else {
              opera.copyFile(templatePath, targetPath);
            }

            _context7.next = 37;
            break;

          case 6:
            _oss_config = require(targetPath);

            if (!_oss_config.envConf[cmd.upload]) {
              _context7.next = 34;
              break;
            }

            list = /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(prefix) {
                var all_object, result, looping, _looping;

                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _looping = function _looping3() {
                          _looping = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(result, isTruncated) {
                            var _result;

                            return _regenerator["default"].wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    all_object = all_object.concat(result.objects);

                                    if (!isTruncated) {
                                      _context.next = 10;
                                      break;
                                    }

                                    _context.next = 4;
                                    return client.list({
                                      prefix: prefix + "/",
                                      marker: result.nextMarker
                                    });

                                  case 4:
                                    _result = _context.sent;
                                    _context.next = 7;
                                    return looping(_result, _result.isTruncated);

                                  case 7:
                                    return _context.abrupt("return", all_object);

                                  case 10:
                                    return _context.abrupt("return", result.objects);

                                  case 11:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));
                          return _looping.apply(this, arguments);
                        };

                        looping = function _looping2(_x3, _x4) {
                          return _looping.apply(this, arguments);
                        };

                        all_object = [];
                        _context2.prev = 3;
                        _context2.next = 6;
                        return client.list({
                          prefix: prefix + "/"
                        });

                      case 6:
                        result = _context2.sent;
                        _context2.next = 9;
                        return looping(result, result.isTruncated);

                      case 9:
                        return _context2.abrupt("return", all_object);

                      case 12:
                        _context2.prev = 12;
                        _context2.t0 = _context2["catch"](3);
                        return _context2.abrupt("return", all_object);

                      case 15:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[3, 12]]);
              }));

              return function list(_x2) {
                return _ref2.apply(this, arguments);
              };
            }();

            isExistObject = /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(name) {
                var options,
                    result,
                    _args3 = arguments;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
                        _context3.next = 3;
                        return client.list({
                          prefix: name,
                          delimiter: "/"
                        });

                      case 3:
                        result = _context3.sent;
                        return _context3.abrupt("return", result.objects && result.objects.length > 0);

                      case 5:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function isExistObject(_x5) {
                return _ref3.apply(this, arguments);
              };
            }();

            backup = /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
                var get_list, copy_time;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return isExistObject(_oss_target + "/");

                      case 2:
                        if (!_context5.sent) {
                          _context5.next = 12;
                          break;
                        }

                        _context5.next = 5;
                        return list(_oss_target);

                      case 5:
                        get_list = _context5.sent;
                        progress.warn("一共" + get_list.length + "个文件需要备份");
                        copy_time = formatDate(new Date().getTime(), "YYYYMMDDhhmmss");
                        _context5.next = 10;
                        return co( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                          var i;
                          return _regenerator["default"].wrap(function _callee4$(_context4) {
                            while (1) {
                              switch (_context4.prev = _context4.next) {
                                case 0:
                                  progress.start("开始备份");
                                  i = 0;

                                case 2:
                                  if (!(i < get_list.length)) {
                                    _context4.next = 9;
                                    break;
                                  }

                                  _context4.next = 5;
                                  return client.copy(get_list[i].name.replace(_oss_target, _oss_target + "__bak_" + copy_time), get_list[i].name);

                                case 5:
                                  progress.setText("已备份" + (i + 1) + "个文件");

                                case 6:
                                  i++;
                                  _context4.next = 2;
                                  break;

                                case 9:
                                  progress.succeed("备份完毕，备份目录--->(" + _oss_target + "__bak_" + copy_time + ")");
                                  return _context4.abrupt("return", true);

                                case 11:
                                case "end":
                                  return _context4.stop();
                              }
                            }
                          }, _callee4);
                        }));

                      case 10:
                        _context5.next = 13;
                        break;

                      case 12:
                        progress.fail("需备份的文件夹不存在！已跳过备份");

                      case 13:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function backup() {
                return _ref4.apply(this, arguments);
              };
            }();

            _oss_conf_dir = _oss_config.envConf[cmd.upload];
            _oss_source = path.join(process.cwd(), _oss_conf_dir.sourcePath);
            _oss_target = _oss_conf_dir.uploadPath.replace(/^(\.+?\/|\/)|(\/$)/g, "");
            _oss_all_resource_var = get_all_resource(_oss_source);
            _local_length = _oss_all_resource_var.length;
            client = new OSS({
              accessKeyId: _oss_config.ossConf.accessKeyId,
              accessKeySecret: _oss_config.ossConf.accessKeySecret,
              region: _oss_config.envConf[cmd.upload].region,
              //"oss-cn-beijing",
              bucket: _oss_config.envConf[cmd.upload].bucket //"dev2-qktx-html"

            });

            if (!cmd.backup) {
              _context7.next = 22;
              break;
            }

            _context7.next = 20;
            return backup();

          case 20:
            _context7.next = 28;
            break;

          case 22:
            _context7.next = 24;
            return inquirer.prompt([{
              type: "list",
              name: "isBackup",
              choices: [{
                name: "是，不备份",
                value: true
              }, {
                name: "不，我要备份",
                value: false
              }],
              message: "未备份文件，是否继续？"
            }]);

          case 24:
            prompt = _context7.sent;

            if (prompt.isBackup) {
              _context7.next = 28;
              break;
            }

            _context7.next = 28;
            return backup();

          case 28:
            _context7.next = 30;
            return co( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
              var _error_length, index, e;

              return _regenerator["default"].wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      progress.warn("一共" + _local_length + "个需上传"); //遍历文件

                      _error_length = _local_length;
                      progress.start("开始上传");
                      index = 0;

                    case 4:
                      if (!(index < _local_length)) {
                        _context6.next = 13;
                        break;
                      }

                      e = _oss_all_resource_var[index];
                      _error_length--;
                      _context6.next = 9;
                      return client.put(e.replace(_oss_source, _oss_target), e);

                    case 9:
                      //提交文件到oss，阿里云不需要创建新文件夹，只有有路径，没有文件夹会自动创建
                      progress.setText("一共" + _local_length + "个， 已经完成" + Number(index + 1) + "个");

                    case 10:
                      index += 1;
                      _context6.next = 4;
                      break;

                    case 13:
                      return _context6.abrupt("return", _error_length);

                    case 14:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, _callee6);
            }));

          case 30:
            res = _context7.sent;
            progress.succeed("上传完成, 共" + _local_length + "个文件,成功上传" + Number(_local_length - res) + "个");
            _context7.next = 37;
            break;

          case 34:
            _oss_conf_arr = [];

            for (key in _oss_config.envConf) {
              _oss_conf_arr.push(key);
            }

            progress.fail("Unable to find the environment '".concat(cmd.upload, "',\u60A8\u53EF\u80FD\u60F3\u8FD0\u884C\uFF1A\n") + _oss_conf_arr.map(function (item) {
              return "spark oss --upload ".concat(item);
            }).join("\n"));

          case 37:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();