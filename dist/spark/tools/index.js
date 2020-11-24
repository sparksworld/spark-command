"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDate = formatDate;

/*
 * @Author: spark
 * @Date: 2020-11-23 15:20:05
 * @LastEditTime: 2020-11-23 15:21:10
 * @LastEditors: spark
 * @Description: 趣看天下前端开发
 * @email: spark.xiaoyu@qq.com
 */
function formatDate(date) {
  var fmt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "YYYY-MM-DD";

  if (!date) {
    return "";
  }

  if (typeof date === "string") {
    date = new Date(date.replace(/-/g, "/"));
  }

  if (typeof date === "number") {
    date = new Date(date);
  }

  var o = {
    "M+": date.getMonth() + 1,
    "D+": date.getDate(),
    "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  var week = {
    0: "\u65E5",
    1: "\u4E00",
    2: "\u4E8C",
    3: "\u4E09",
    4: "\u56DB",
    5: "\u4E94",
    6: "\u516D"
  };

  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "\u661F\u671F" : "\u5468" : "") + week[date.getDay() + ""]);
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }

  return fmt;
}