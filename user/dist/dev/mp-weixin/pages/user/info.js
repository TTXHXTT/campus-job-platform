"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const userInfo = common_vendor.ref({});
    const userTypes = ["学生", "发布者", "管理员"];
    const getUserInfo = () => {
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        userInfo.value = { ...user };
      } else {
        common_vendor.index.redirectTo({
          url: "/pages/login"
        });
      }
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          userInfo.value.avatar = res.tempFilePaths[0];
          utils_request.request.post("/api/updateUserInfo", userInfo.value).then((res2) => {
            if (res2.code === 0) {
              common_vendor.index.showToast({
                title: "更新成功",
                icon: "success"
              });
              common_vendor.index.setStorageSync("user", userInfo.value);
            }
          });
        }
      });
    };
    const handleSave = () => {
      if (!userInfo.value.name || !userInfo.value.phone) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      utils_request.request.post("/api/updateUserInfo", userInfo.value).then((res) => {
        if (res.code === 0) {
          common_vendor.index.setStorageSync("user", userInfo.value);
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      });
    };
    common_vendor.onMounted(() => {
      getUserInfo();
    });
    return {
      userInfo,
      userTypes,
      chooseImage,
      handleSave
    };
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $setup.userInfo.avatar || "/static/default-avatar.png",
    b: common_vendor.p({
      type: "camera",
      size: "20",
      color: "#fff"
    }),
    c: common_vendor.o((...args) => $setup.chooseImage && $setup.chooseImage(...args)),
    d: $setup.userInfo.username,
    e: common_vendor.o(($event) => $setup.userInfo.username = $event.detail.value),
    f: $setup.userInfo.name,
    g: common_vendor.o(($event) => $setup.userInfo.name = $event.detail.value),
    h: $setup.userInfo.phone,
    i: common_vendor.o(($event) => $setup.userInfo.phone = $event.detail.value),
    j: common_vendor.t($setup.userTypes[$setup.userInfo.type - 1]),
    k: common_vendor.o((...args) => $setup.handleSave && $setup.handleSave(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/user/info.vue"]]);
wx.createPage(MiniProgramPage);
