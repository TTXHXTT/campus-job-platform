"use strict";
const common_vendor = require("../common/vendor.js");
const utils_white_list = require("./white_list.js");
const utils_base = require("./base.js");
require("../store/index.js");
const request = (options = {}) => {
  let token = common_vendor.index.getStorageSync("user");
  options.header = {
    "Content-Type": "application/json"
  };
  return new Promise((resolve, reject) => {
    let no_token_request = utils_white_list.white_list.api.indexOf(options.url) !== -1;
    if (token || no_token_request) {
      common_vendor.index.request({
        url: utils_base.URL() + options.url,
        method: options.method || "GET",
        data: options.data || {},
        header: options.header || {},
        success: (res) => {
          console.log("请求成功：", options.url, res);
          if (res.data.code === 0) {
            resolve(res.data);
          } else {
            common_vendor.index.showToast({
              title: res.data.msg || "请求失败",
              icon: "none",
              duration: 2e3
            });
            reject(res.data);
          }
        },
        fail: (err) => {
          console.log("请求失败：", options.url, err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none",
            duration: 2e3
          });
          reject(err);
        }
      });
    } else {
      common_vendor.index.reLaunch({
        url: "/pages/login"
      });
    }
  });
};
const get = (url, data, options = {}) => {
  options.method = "GET";
  options.data = data;
  options.url = url;
  return request(options);
};
const post = (url, data, options = {}) => {
  options.method = "POST";
  options.data = data;
  options.url = url;
  return request(options);
};
const request$1 = {
  get,
  post
};
exports.request = request$1;
