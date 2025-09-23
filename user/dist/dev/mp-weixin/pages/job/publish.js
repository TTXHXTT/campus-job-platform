"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const jobForm = common_vendor.ref({
      title: "",
      salary: "",
      address: "",
      content: "",
      requirement: ""
    });
    const handlePublish = () => {
      if (!jobForm.value.title) {
        common_vendor.index.showToast({
          title: "请输入标题",
          icon: "none"
        });
        return;
      }
      if (!jobForm.value.salary) {
        common_vendor.index.showToast({
          title: "请输入工资",
          icon: "none"
        });
        return;
      }
      if (!jobForm.value.address) {
        common_vendor.index.showToast({
          title: "请输入地点",
          icon: "none"
        });
        return;
      }
      if (!jobForm.value.content) {
        common_vendor.index.showToast({
          title: "请输入内容",
          icon: "none"
        });
        return;
      }
      if (!jobForm.value.requirement) {
        common_vendor.index.showToast({
          title: "请输入要求",
          icon: "none"
        });
        return;
      }
      const userInfo = common_vendor.index.getStorageSync("user");
      if (!userInfo) {
        common_vendor.index.redirectTo({
          url: "/pages/login"
        });
        return;
      }
      utils_request.request.post("/api/publishJob", {
        ...jobForm.value,
        publisherId: userInfo.id,
        status: 1
      }).then((res) => {
        if (res.code === 0) {
          common_vendor.index.showToast({
            title: "发布成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      });
    };
    return {
      jobForm,
      handlePublish
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $setup.jobForm.title,
    b: common_vendor.o(($event) => $setup.jobForm.title = $event.detail.value),
    c: $setup.jobForm.salary,
    d: common_vendor.o(($event) => $setup.jobForm.salary = $event.detail.value),
    e: $setup.jobForm.address,
    f: common_vendor.o(($event) => $setup.jobForm.address = $event.detail.value),
    g: $setup.jobForm.content,
    h: common_vendor.o(($event) => $setup.jobForm.content = $event.detail.value),
    i: $setup.jobForm.requirement,
    j: common_vendor.o(($event) => $setup.jobForm.requirement = $event.detail.value),
    k: common_vendor.o((...args) => $setup.handlePublish && $setup.handlePublish(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/job/publish.vue"]]);
wx.createPage(MiniProgramPage);
