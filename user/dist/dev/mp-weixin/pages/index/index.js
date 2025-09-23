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
    const bannerList = common_vendor.ref([]);
    const noticeList = common_vendor.ref([]);
    const jobList = common_vendor.ref([]);
    const getNoticeList = () => {
      utils_request.request.get("/api/getNoticeList").then((res) => {
        if (res.code === 0) {
          bannerList.value = res.data.filter((item) => item.image).slice(0, 3);
          noticeList.value = res.data.slice(0, 3);
        }
      });
    };
    const getJobList = () => {
      utils_request.request.get("/api/getJobList").then((res) => {
        if (res.code === 0) {
          console.log("首页招聘列表数据：", res.data);
          jobList.value = res.data.slice(0, 3).map((job) => ({
            ...job,
            salary: parseFloat(job.salary).toFixed(2)
          }));
        }
      });
    };
    const goNoticeDetail = (notice) => {
      common_vendor.index.navigateTo({
        url: `/pages/notice/detail?id=${notice.id}&title=${encodeURIComponent(notice.title)}`
      });
    };
    const goNoticeList = () => {
      common_vendor.index.navigateTo({
        url: "/pages/notice/list"
      });
    };
    const goJobList = () => {
      common_vendor.index.switchTab({
        url: "/pages/job/index"
      });
    };
    const goJobDetail = (job) => {
      common_vendor.index.navigateTo({
        url: `/pages/job/detail?id=${job.id}&title=${encodeURIComponent(job.title)}`
      });
    };
    const onPullDownRefresh = () => {
      Promise.all([getNoticeList(), getJobList()]).then(() => {
        common_vendor.index.stopPullDownRefresh();
      });
    };
    common_vendor.onMounted(() => {
      getNoticeList();
      getJobList();
    });
    return {
      bannerList,
      noticeList,
      jobList,
      goNoticeDetail,
      goNoticeList,
      goJobList,
      goJobDetail,
      onPullDownRefresh
    };
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_CustomTabBar = common_vendor.resolveComponent("CustomTabBar");
  (_easycom_uni_icons2 + _component_CustomTabBar)();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($setup.bannerList, (notice, index, i0) => {
      return {
        a: notice.image || "/static/banner.png",
        b: common_vendor.t(notice.title),
        c: index,
        d: common_vendor.o(($event) => $setup.goNoticeDetail(notice), index)
      };
    }),
    b: common_vendor.o((...args) => $setup.goNoticeList && $setup.goNoticeList(...args)),
    c: common_vendor.f($setup.noticeList, (notice, index, i0) => {
      return {
        a: common_vendor.t(notice.title),
        b: common_vendor.t(notice.createTime),
        c: "3d858cfd-0-" + i0,
        d: index,
        e: common_vendor.o(($event) => $setup.goNoticeDetail(notice), index)
      };
    }),
    d: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    }),
    e: common_vendor.o((...args) => $setup.goJobList && $setup.goJobList(...args)),
    f: common_vendor.f($setup.jobList, (job, index, i0) => {
      return {
        a: common_vendor.t(job.title),
        b: common_vendor.t(job.salary),
        c: common_vendor.t(job.content),
        d: "3d858cfd-1-" + i0,
        e: common_vendor.t(job.address),
        f: "3d858cfd-2-" + i0,
        g: common_vendor.t(job.publisherName),
        h: common_vendor.t(job.createTime),
        i: index,
        j: common_vendor.o(($event) => $setup.goJobDetail(job), index)
      };
    }),
    g: common_vendor.p({
      type: "location",
      size: "14",
      color: "#666"
    }),
    h: common_vendor.p({
      type: "staff",
      size: "14",
      color: "#666"
    }),
    i: common_vendor.p({
      current: 0
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
