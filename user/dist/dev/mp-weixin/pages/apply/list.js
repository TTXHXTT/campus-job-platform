"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const applyList = common_vendor.ref([]);
    const userInfo = common_vendor.ref({});
    const statusText = ["待审核", "已通过", "已拒绝"];
    const currentTab = common_vendor.ref(0);
    const tabs = ["全部", "审核中", "已通过", "已拒绝"];
    const getUserInfo = () => {
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        userInfo.value = user;
      } else {
        common_vendor.index.redirectTo({
          url: "/pages/login"
        });
      }
    };
    const getApplyList = () => {
      const params = {};
      if (userInfo.value.type === 1) {
        params.studentId = userInfo.value.id;
      } else if (userInfo.value.type === 2) {
        params.publisherId = userInfo.value.id;
      }
      utils_request.request.get("/api/getAllApplyList", params).then((res) => {
        if (res.code === 0) {
          console.log("报名列表数据：", res.data);
          applyList.value = res.data || [];
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          if (currentPage.options && currentPage.options.status === "pending") {
            currentTab.value = 1;
          }
        }
      });
    };
    const switchTab = (index) => {
      currentTab.value = index;
    };
    const filteredApplyList = common_vendor.computed(() => {
      console.log("当前标签：", currentTab.value);
      console.log("报名列表：", applyList.value);
      if (currentTab.value === 0) {
        return applyList.value;
      } else {
        const status = currentTab.value - 1;
        return applyList.value.filter((item) => item.status === status);
      }
    });
    const getStatusClass = (status) => {
      const classes = ["status-pending", "status-success", "status-fail"];
      return classes[status];
    };
    const goJobDetail = (jobId) => {
      common_vendor.index.navigateTo({
        url: `/pages/job/detail?id=${jobId}`
      });
    };
    const handleCancel = (apply) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消报名吗？",
        success: (res) => {
          if (res.confirm) {
            utils_request.request.post(`/api/deleteApply?id=${apply.id}`).then((res2) => {
              if (res2.code === 0) {
                common_vendor.index.showToast({
                  title: "取消成功",
                  icon: "success"
                });
                getApplyList();
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
    const handleApply = (apply, status) => {
      common_vendor.index.showModal({
        title: "提示",
        content: `确定要${status === 1 ? "通过" : "拒绝"}报名吗？`,
        success: (res) => {
          if (res.confirm) {
            utils_request.request.post(`/api/updateApplyStatus?id=${apply.id}&status=${status}`).then((res2) => {
              if (res2.code === 0) {
                common_vendor.index.showToast({
                  title: `${status === 1 ? "通过" : "拒绝"}成功`,
                  icon: "success"
                });
                getApplyList();
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
    common_vendor.onMounted(() => {
      getUserInfo();
      getApplyList();
    });
    common_vendor.onShow(() => {
      getUserInfo();
      getApplyList();
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        common_vendor.index.setNavigationBarTitle({
          title: user.type === 2 ? "报名管理" : "我的报名"
        });
      }
    });
    return {
      applyList,
      statusText,
      currentTab,
      tabs,
      filteredApplyList,
      getStatusClass,
      goJobDetail,
      handleCancel,
      switchTab,
      userInfo,
      handleApply
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
  return common_vendor.e({
    a: common_vendor.f($setup.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: $setup.currentTab === index ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $setup.switchTab(index), index)
      };
    }),
    b: common_vendor.f($setup.filteredApplyList, (apply, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(apply.jobTitle),
        b: common_vendor.t($setup.statusText[apply.status]),
        c: common_vendor.n($setup.getStatusClass(apply.status)),
        d: "939f9fb2-0-" + i0,
        e: common_vendor.t(apply.createTime),
        f: common_vendor.o(($event) => $setup.goJobDetail(apply.jobId), index),
        g: $setup.userInfo.type === 1 && apply.status === 0
      }, $setup.userInfo.type === 1 && apply.status === 0 ? {
        h: common_vendor.o(($event) => $setup.handleCancel(apply), index)
      } : {}, {
        i: $setup.userInfo.type === 2 && apply.status === 0
      }, $setup.userInfo.type === 2 && apply.status === 0 ? {
        j: common_vendor.o(($event) => $setup.handleApply(apply, 1), index),
        k: common_vendor.o(($event) => $setup.handleApply(apply, 2), index)
      } : {}, {
        l: index
      });
    }),
    c: common_vendor.p({
      type: "calendar",
      size: "14",
      color: "#999"
    }),
    d: $setup.filteredApplyList.length === 0
  }, $setup.filteredApplyList.length === 0 ? {
    e: common_vendor.t($setup.tabs[$setup.currentTab])
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/apply/list.vue"]]);
wx.createPage(MiniProgramPage);
