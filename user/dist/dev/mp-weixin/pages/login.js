"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
require("../utils/white_list.js");
require("../utils/base.js");
require("../store/index.js");
require("../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const typeIndex = common_vendor.ref(0);
    const types = ["学生", "发布者"];
    const handleLogin = () => {
      if (!username.value || !password.value) {
        common_vendor.index.showToast({
          title: "请输入用户名和密码",
          icon: "none"
        });
        return;
      }
      utils_request.request.post("/api/login", {
        username: username.value,
        password: password.value,
        type: typeIndex.value + 1
      }).then((res) => {
        if (res.code === 0) {
          common_vendor.index.setStorageSync("user", res.data);
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        } else {
          common_vendor.index.showToast({
            title: res.msg,
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.showToast({
          title: "登录失败",
          icon: "none"
        });
      });
    };
    const bindPickerChange = (e) => {
      typeIndex.value = e.detail.value;
    };
    const goRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/register"
      });
    };
    return {
      username,
      password,
      typeIndex,
      types,
      handleLogin,
      bindPickerChange,
      goRegister
    };
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $setup.username,
    b: common_vendor.o(($event) => $setup.username = $event.detail.value),
    c: common_vendor.p({
      type: "person",
      size: "24",
      color: "#999"
    }),
    d: $setup.password,
    e: common_vendor.o(($event) => $setup.password = $event.detail.value),
    f: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#999"
    }),
    g: common_vendor.t($setup.types[$setup.typeIndex]),
    h: common_vendor.p({
      type: "bottom",
      size: "24",
      color: "#999"
    }),
    i: common_vendor.o((...args) => $setup.bindPickerChange && $setup.bindPickerChange(...args)),
    j: $setup.typeIndex,
    k: $setup.types,
    l: common_vendor.p({
      type: "staff",
      size: "24",
      color: "#999"
    }),
    m: common_vendor.o((...args) => $setup.handleLogin && $setup.handleLogin(...args)),
    n: common_vendor.o((...args) => $setup.goRegister && $setup.goRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/login.vue"]]);
wx.createPage(MiniProgramPage);
