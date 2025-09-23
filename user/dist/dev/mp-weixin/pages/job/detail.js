"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const jobDetail = common_vendor.ref({});
    const userInfo = common_vendor.ref({});
    const applied = common_vendor.ref(false);
    const jobId = common_vendor.ref(null);
    const getUserInfo = () => {
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        userInfo.value = user;
      }
    };
    const getJobDetail = () => {
      if (!jobId.value)
        return;
      utils_request.request.get("/api/getJobDetail", { id: jobId.value }).then((res) => {
        if (res.code === 0) {
          jobDetail.value = {
            ...res.data,
            salary: parseFloat(res.data.salary).toFixed(2)
          };
          checkApplyStatus();
        }
      });
    };
    const checkApplyStatus = () => {
      if (userInfo.value.type === 1) {
        utils_request.request.get("/api/getApplyList", {
          jobId: jobDetail.value.id,
          studentId: userInfo.value.id
        }).then((res) => {
          if (res.code === 0 && res.data && res.data.length > 0) {
            applied.value = true;
          }
        });
      }
    };
    common_vendor.onLoad((options) => {
      jobId.value = options.id;
      getUserInfo();
      getJobDetail();
    });
    const handleApply = () => {
      if (applied.value)
        return;
      common_vendor.index.showModal({
        title: "确认报名",
        content: "确定要报名这个工作吗？",
        success: (res) => {
          if (res.confirm) {
            utils_request.request.post("/api/apply", {
              jobId: jobDetail.value.id,
              studentId: userInfo.value.id
            }).then((res2) => {
              if (res2.code === 0) {
                common_vendor.index.showToast({
                  title: "报名成功",
                  icon: "success"
                });
                applied.value = true;
                setTimeout(() => {
                  common_vendor.index.navigateTo({
                    url: "/pages/apply/list"
                  });
                }, 1500);
              } else {
                common_vendor.index.showToast({
                  title: res2.msg,
                  icon: "none"
                });
              }
            });
          }
        }
      });
    };
    const handleDelete = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条招聘信息吗？",
        success: (res) => {
          if (res.confirm) {
            utils_request.request.post("/api/deleteJob", {
              id: jobDetail.value.id
            }).then((res2) => {
              if (res2.code === 0) {
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                setTimeout(() => {
                  common_vendor.index.navigateBack();
                }, 1500);
              } else {
                common_vendor.index.showToast({
                  title: res2.msg,
                  icon: "none"
                });
              }
            });
          }
        }
      });
    };
    return {
      jobDetail,
      userInfo,
      applied,
      handleApply,
      handleDelete
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($setup.jobDetail.title),
    b: common_vendor.t($setup.jobDetail.salary),
    c: common_vendor.t($setup.jobDetail.address),
    d: common_vendor.t($setup.jobDetail.publisherName),
    e: common_vendor.t($setup.jobDetail.createTime),
    f: common_vendor.t($setup.jobDetail.content),
    g: common_vendor.t($setup.jobDetail.requirement),
    h: $setup.userInfo.type === 1
  }, $setup.userInfo.type === 1 ? {
    i: common_vendor.t($setup.applied ? "已报名" : "立即报名"),
    j: common_vendor.o((...args) => $setup.handleApply && $setup.handleApply(...args)),
    k: $setup.applied
  } : {}, {
    l: $setup.userInfo.type === 2 && $setup.userInfo.id === $setup.jobDetail.publisherId
  }, $setup.userInfo.type === 2 && $setup.userInfo.id === $setup.jobDetail.publisherId ? {
    m: common_vendor.o((...args) => $setup.handleDelete && $setup.handleDelete(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/job/detail.vue"]]);
wx.createPage(MiniProgramPage);
