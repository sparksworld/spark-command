`建议版本：node >= 8.9.2`

# spark-command 

**note:**  
- 快速生成mpa项目（[ts-mpa-react-webpack](https://github.com/sparksworld/ts-mpa-react-webpack)）
- 快速爬取网站
- 快速上传阿里云oss对象存储

> 各个功能，互不影响。选择你需要的功能使用 

Installation 
--- 
```
 npm install spark-command -g
``` 
> 控制台输入`spark -v` 或者 `spark` 版本号输出则正确安装

Requirements
---
- nodejs version >= 8.9.2  

Usage 
--- 
- ### 如何生成mpa项目？
    ```
    spark mpa
    ```

    然后就可以`npm i`安装依赖，一个多页面项目就可以拿去用了

----
- ### 如何爬取网站下载到本地？
    ``` 
    spark web --output downloadDir --address http://www.baidu.com --recursive
    ```
    支持简写：
    ```
    spark w -o downloadDir -a http://www.baidu.com -r
    ```

    > `--output`: 定义输出目录,简写`-o`

    > `--address`: 定义爬取网址,简写`-a`

    > `--recursive`: 是否开启递归爬取，简写`-r` 

    > #### 注意：爬取网站开启递归后，可能会出现持续下载的情况，关闭递归下载，可能对你会有帮助！
 
----
- ### 如何上传本地文件夹到oss对象存储？

    首先，生成配置文件`oss.config.js`
    ```
    spark oss --init
    ```

    填写阿里云配置和本地目录以及要上传到oss的目录
    ```js
    module.exports = {
        // 阿里云配置
        ossConf: {
            accessKeyId: '',
            accessKeySecret: ''
        },
        /** 
         * 区分环境，填写配置项
         * sourcePath 本地目录
         * uploadPath 要传到oss对应的对象存储地址
         **/
        envConf: {
            // 将本地项目中./dist目录上传至bucket为test的`development/test/directory`路径下
            development: {
                region: '',
                bucket: 'test',
                sourcePath: './dist/javascript', // 要上传本地的路径，此目录最好放在此配置文件同级或下级
                uploadPath: 'development/test/directory' //oss路径
            },
            production: {
                region: '',
                bucket: '',
                sourcePath: '',
                uploadPath: ''
            },
            // 可以自定义环境，上传输入: spark oss --upload test
            test: {
                region: '',
                bucket: '',
                sourcePath: '',
                uploadPath: ''
            }
        }
    }
    ```
    配置完成后，如果想上传到`development`对应的oss存储，运行
    ```
    spark oss --upload developemnt
    ```  
    添加`--backup`会先备份`uploadPath`目录，再进行上传
    ```
    spark oss --upload development --backup
    ```

Helper
---
 - `spark mpa -h`: 获取多页面模版帮助 
 - `spark oss -h`: 获取oss上传帮助
 - `spark web -h`: 获取抓取web页面帮助


    
