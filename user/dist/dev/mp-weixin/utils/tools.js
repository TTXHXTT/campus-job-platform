"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
const utils_go_page = require("./go_page.js");
const utils_white_list = require("./white_list.js");
function is_login() {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  if (page) {
    if (Object.keys(store_index.store.state.user_info).length == 0) {
      if (page.route != "/" && utils_white_list.white_list.page.indexOf(page.route) == -1) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          duration: 2e3
        });
        utils_go_page.re_launch("/pages/login");
      }
    } else {
      if (page.route == "/" || utils_white_list.white_list.page.indexOf(page.route) > -1) {
        utils_go_page.switch_tab("/pages/index");
      }
    }
  }
}
exports.is_login = is_login;
