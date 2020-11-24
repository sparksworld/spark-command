"use strict";

var inquirer = require('inquirer');

var download = require('download-git-repo');

var path = require('path');

var fs = require('fs');

var Spinner = require('../lib/spinner');

var progress = new Spinner();
var questions = [{
  name: 'initName',
  type: 'input',
  message: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u5B57",
  validate: function validate(val) {
    if (!val) {
      // 验证一下输入是否正确
      return '请输入文件名';
    }

    if (fs.existsSync(val)) {
      // 判断文件是否存在
      return '文件已存在';
    } else {
      return true;
    }
  }
}, {
  type: 'input',
  name: 'version',
  message: 'verson(1.0.0)：',
  "default": '1.0.0',
  validate: function validate(val) {
    return true;
  }
}, {
  type: 'input',
  name: 'repository',
  message: 'repository：',
  "default": 'sparksworld/ts-mpa-react-webpack'
}];

function editPackage(_ref) {
  var initName = _ref.initName,
      version = _ref.version,
      repository = _ref.repository;
  var data = fs.readFileSync("".concat(process.cwd(), "/").concat(initName, "/package.json"), 'utf-8');

  var _data = JSON.parse(data);

  _data.version = version;
  _data.name = initName;
  _data.repository = repository;
  fs.writeFileSync("".concat(process.cwd(), "/").concat(initName, "/package.json"), JSON.stringify(_data, null, 4), 'utf-8'); // spinner.succeed();
}

module.exports = function () {
  var targetPath = process.cwd();
  inquirer.prompt(questions).then(function (answers) {
    progress.start('模板正在下载，请稍等...');
    download('sparksworld/ts-mpa-react-webpack', path.join(targetPath, answers['initName']), function (err) {
      progress.succeed('模板下载完成');

      try {
        if (err) {
          progress.fail('网络错误');
        } else {
          progress.start('正在配置项目...');
          editPackage(answers);
          setTimeout(function () {
            progress.succeed('项目初始化完成');
            process.exit(0);
          }, 1000);
        }
      } catch (err) {
        progress.fail(err);
        process.exit(1);
      }
    });
  });
};