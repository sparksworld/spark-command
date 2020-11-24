var scrape = require('website-scraper');
var path = require('path')
var fs = require('fs')
var Spinner = require('../lib/spinner');
var progress = new Spinner();

class MyPlugin {
    apply(registerAction) {
        registerAction('beforeStart', async () => {
            progress.start('获取页面资源中')
        });
        registerAction('afterFinish', async () => {
            progress.succeed('抓取完毕')
        })
    }
}
module.exports = function(cmd) {
    if (fs.existsSync(path.join(process.cwd(), cmd.output))) {
        progress.fail('文件夹已存在！')
    } else {
        scrape({
            urls: [cmd.address],
            directory: path.join(process.cwd(), cmd.output),
            recursive: cmd.recursive,
            plugins: [new MyPlugin()],
            maxRecursiveDepth: 1,
            maxDepth: 1,
            defaultFilename: /.html?/gi.test(cmd.address) ? false: 'index.html'
        })
    }
}