"use strict";
const common_vendor = require("../common/vendor.js");
function switch_tab(url) {
  common_vendor.index.switchTab({
    url
  });
}
function re_launch(url, data = "") {
  let urlData = "";
  if (data) {
    if (Object.keys(data).length > 0) {
      urlData = "?" + common_vendor.lib.stringify(data);
    }
  }
  common_vendor.index.reLaunch({
    url: url + urlData
  });
}
exports.re_launch = re_launch;
exports.switch_tab = switch_tab;
