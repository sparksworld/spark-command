"use strict";

module.exports = {
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
    development: {
      region: '',
      bucket: '',
      sourcePath: '',
      uploadPath: ''
    },
    production: {
      region: '',
      bucket: '',
      sourcePath: '',
      uploadPath: ''
    }
  }
};