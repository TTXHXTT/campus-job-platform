"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const CustomTabBar = () => "../../components/CustomTabBar.js";
const _sfc_main = {
  components: {
    CustomTabBar
  },
  setup() {
    const jobList = common_vendor.ref([]);
    const userInfo = common_vendor.ref({});
    const getUserInfo = () => {
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        userInfo.value = user;
        getJobList();
      }
    };
    const getJobList = () => {
      const params = {};
      if (userInfo.value.type === 2) {
        params.publisherId = userInfo.value.id;
      }
      utils_request.request.get("/api/getJobList", params).then((res) => {
        if (res.code === 0) {
          console.log("招聘列表数据：", res.data);
          jobList.value = res.data.map((job) => ({
            ...job,
            salary: parseFloat(job.salary).toFixed(2)
          }));
        }
      });
    };
    const goPublish = () => {
      common_vendor.index.navigateTo({
        url: "/pages/job/publish"
      });
    };
    const goDetail = (job) => {
      common_vendor.index.navigateTo({
        url: `/pages/job/detail?id=${job.id}&title=${encodeURIComponent(job.title)}`
      });
    };
    common_vendor.onMounted(() => {
      getUserInfo();
    });
    common_vendor.onShow(() => {
      getUserInfo();
    });
    return {
      jobList,
      userInfo,
      goPublish,
      goDetail
    };
  }
};
if (!Array) {
  const _component_CustomTabBar = common_vendor.resolveComponent("CustomTabBar");
  _component_CustomTabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $setup.userInfo.type === 2
  }, $setup.userInfo.type === 2 ? {
    b: common_vendor.o((...args) => $setup.goPublish && $setup.goPublish(...args))
  } : {}, {
    c: $setup.jobList.length > 0
  }, $setup.jobList.length > 0 ? {
    d: common_vendor.f($setup.jobList, (job, index, i0) => {
      return {
        a: common_vendor.t(job.title),
        b: common_vendor.t(job.salary),
        c: common_vendor.t(job.content),
        d: common_vendor.t(job.address),
        e: common_vendor.t(job.createTime),
        f: common_vendor.t(job.publisherName),
        g: index,
        h: common_vendor.o(($event) => $setup.goDetail(job), index)
      };
    })
  } : common_vendor.e({
    e: common_vendor.t($setup.userInfo.type === 2 ? "您还没有发布任何招聘" : "暂无招聘信息"),
    f: $setup.userInfo.type === 2
  }, $setup.userInfo.type === 2 ? {
    g: common_vendor.o((...args) => $setup.goPublish && $setup.goPublish(...args))
  } : {}), {
    h: common_vendor.p({
      current: 1
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/job/index.vue"]]);
wx.createPage(MiniProgramPage);
