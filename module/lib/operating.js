var fs = require('fs')

module.exports = {
    /**
     * deleteFolderRecursive
     *
     * @param {*} path
     */
    deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function(file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    },

    /**
     *  copyDir('./test', './new', function(err){
     *      if(err){
     *        console.log(err);
     *      }
     *  })
     * @param {*} src
     * @param {*} dist
     * @param {*} callback
     */
    copyDir(src, dist, callback) {
        fs.access(dist, function(err) {
            if (err) {
                // 目录不存在时创建目录
                fs.mkdirSync(dist);
            }
            _copy(null, src, dist);
        });

        function _copy(err, src, dist) {
            if (err) {
                typeof callback == 'function' && callback(err);
            } else {
                fs.readdir(src, function(err, paths) {
                    if (err) {
                        typeof callback == 'function' && callback(err);
                    } else {
                        paths.forEach(function(path) {
                            var _src = src + '/' + path;
                            var _dist = dist + '/' + path;
                            fs.stat(_src, function(err, stat) {
                                if (err) {
                                    typeof callback == 'function' && callback(err);
                                } else {
                                    // 判断是文件还是目录
                                    if (stat.isFile()) {
                                        fs.writeFileSync(_dist, fs.readFileSync(_src));
                                    } else if (stat.isDirectory()) {
                                        // 当是目录是，递归复制
                                        copyDir(_src, _dist, callback)
                                    }
                                }
                            })
                        })
                    }
                })
            }
        }
    },
    copyFile(src, dist) {
        fs.writeFileSync(dist, fs.readFileSync(src));
    },

    /**
     * Large file
     *
     * @param {*} src
     * @param {*} dist
     */
    _copyFile(src, dist) {
        fs.createReadStream(src).pipe(fs.createWriteStream(dist));
    }
}