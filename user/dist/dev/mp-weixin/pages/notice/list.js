"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const noticeList = common_vendor.ref([]);
    const getNoticeList = () => {
      utils_request.request.get("/api/getNoticeList").then((res) => {
        if (res.code === 0) {
          noticeList.value = res.data;
        }
      });
    };
    const goDetail = (notice) => {
      common_vendor.index.navigateTo({
        url: `/pages/notice/detail?id=${notice.id}&title=${encodeURIComponent(notice.title)}`
      });
    };
    common_vendor.onMounted(() => {
      getNoticeList();
    });
    return {
      noticeList,
      goDetail
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
    a: common_vendor.f($setup.noticeList, (notice, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(notice.title),
        b: common_vendor.t(notice.content),
        c: notice.image
      }, notice.image ? {
        d: notice.image
      } : {}, {
        e: common_vendor.t(notice.createTime),
        f: "1d7485c6-0-" + i0,
        g: index,
        h: common_vendor.o(($event) => $setup.goDetail(notice), index)
      });
    }),
    b: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/notice/list.vue"]]);
wx.createPage(MiniProgramPage);
