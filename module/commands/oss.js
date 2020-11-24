var inquirer = require("inquirer");
var fs = require("fs");
var co = require("co");
var path = require("path");
var OSS = require("ali-oss");
var opera = require("../lib/operating");
var Spinner = require("../lib/spinner");
var { formatDate } = require("../spark/tools");
var progress = new Spinner();

function get_all_resource(root) {
	var files = [];

	function readDirSync(p) {
		const pa = fs.readdirSync(p);
		pa.forEach((e) => {
			const cur_path = `${p}/${e}`;
			const info = fs.statSync(cur_path);
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

module.exports = async function (cmd) {
	var targetPath = path.join(process.cwd(), "./oss.config.js");
	var templatePath = path.join(__dirname, "../spark/config/oss.config.js");
	if (cmd.init) {
		if (fs.existsSync(targetPath)) {
			inquirer
				.prompt([
					{
						type: "confirm",
						name: "isCover",
						message: "已存在配置文件，是否将文件覆盖？",
						validate: function (val) {
							if (
								val.lowerCase !== "y" &&
								val.lowerCase !== "n"
							) {
								return "Please input y/n !";
							} else {
								return true;
							}
						}
					}
				])
				.then((res) => {
					if (res.isCover) {
						opera.copyFile(templatePath, targetPath);
					}
				});
		} else {
			opera.copyFile(templatePath, targetPath);
		}
	} else {
		var _oss_config = require(targetPath);
		if (_oss_config.envConf[cmd.upload]) {
			var _oss_conf_dir = _oss_config.envConf[cmd.upload];
			var _oss_source = path.join(
				process.cwd(),
				_oss_conf_dir.sourcePath
			);

			var _oss_target = _oss_conf_dir.uploadPath.replace(
				/^(\.+?\/|\/)|(\/$)/g,
				""
			);
			var _oss_all_resource_var = get_all_resource(_oss_source);
			var _local_length = _oss_all_resource_var.length;

			var client = new OSS({
				accessKeyId: _oss_config.ossConf.accessKeyId,
				accessKeySecret: _oss_config.ossConf.accessKeySecret,
				region: _oss_config.envConf[cmd.upload].region, //"oss-cn-beijing",
				bucket: _oss_config.envConf[cmd.upload].bucket //"dev2-qktx-html"
			});

			async function list(prefix) {
				var all_object = [];
				try {
					var result = await client.list({
						prefix: prefix + "/"
					});
					await looping(result, result.isTruncated);
					return all_object;
				} catch (e) {
					return all_object;
				}

				async function looping(result, isTruncated) {
					all_object = all_object.concat(result.objects);
					if (isTruncated) {
						var _result = await client.list({
							prefix: prefix + "/",
							marker: result.nextMarker
						});
						await looping(_result, _result.isTruncated);
						return all_object;
					} else {
						return result.objects;
					}
				}
			}
			async function isExistObject(name, options = {}) {
				try {
					await client.head(name, options);
					return 1;
				} catch (error) {
					if (error.code === "NoSuchKey") {
						console.log("文件不存在");
					}
					return 0;
				}
			}
			async function backup() {
				if ((await isExistObject(_oss_target + "/")) == 1) {
					var get_list = await list(_oss_target);

					progress.warn("一共" + get_list.length + "个文件需要备份");

					var copy_time = formatDate(
						new Date().getTime(),
						"YYYYMMDDhhmmss"
					);
					await co(function* () {
						progress.start("开始备份");
						for (var i = 0; i < get_list.length; i++) {
							yield client.copy(
								get_list[i].name.replace(
									_oss_target,
									_oss_target + "__bak_" + copy_time
								),
								get_list[i].name
							);
							progress.setText("已备份" + (i + 1) + "个文件");
						}
						progress.succeed(
							"备份完毕，备份目录--->(" +
								_oss_target +
								"__bak_" +
								copy_time +
								")"
						);
						return true;
					});
				} else {
					progress.fail("需备份的文件夹不存在！已跳过备份");
				}
			}

			if (cmd.backup) {
				await backup();
			} else {
				var prompt = await inquirer.prompt([
					{
						type: "list",
						name: "isBackup",
						choices: [
							{
								name: "是，不备份",
								value: true
							},
							{
								name: "不，我要备份",
								value: false
							}
						],
						message: "未备份文件，是否继续？"
					}
				]);
				if (!prompt.isBackup) {
					await backup();
				}
			}
			var res = await co(function* () {
				progress.warn("一共" + _local_length + "个需上传");
				//遍历文件
				var _error_length = _local_length;
				progress.start("开始上传");
				for (var index = 0; index < _local_length; index += 1) {
					var e = _oss_all_resource_var[index];
					_error_length--;
					yield client.put(e.replace(_oss_source, _oss_target), e);
					//提交文件到oss，阿里云不需要创建新文件夹，只有有路径，没有文件夹会自动创建
					progress.setText(
						"一共" +
							_local_length +
							"个， 已经完成" +
							Number(index + 1) +
							"个"
					);
				}
				return _error_length;
			});
			progress.succeed(
				"上传完成, 共" +
					_local_length +
					"个文件,成功上传" +
					Number(_local_length - res) +
					"个"
			);
		} else {
			let _oss_conf_arr = [];
			for (var key in _oss_config.envConf) {
				_oss_conf_arr.push(key);
			}
			progress.fail(
				`Unable to find the environment '${cmd.upload}',您可能想运行：\n` +
					_oss_conf_arr.map((item) => `spark oss --upload ${item}`).join("\n")
			);
		}
	}
};
