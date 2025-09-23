"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const noticeDetail = common_vendor.ref({});
    const noticeId = common_vendor.ref(null);
    const getNoticeDetail = () => {
      if (!noticeId.value)
        return;
      utils_request.request.get("/api/getNoticeDetail", { id: noticeId.value }).then((res) => {
        if (res.code === 0) {
          noticeDetail.value = res.data;
        }
      });
    };
    common_vendor.onLoad((options) => {
      noticeId.value = options.id;
      getNoticeDetail();
    });
    return {
      noticeDetail
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($setup.noticeDetail.title),
    b: common_vendor.t($setup.noticeDetail.createTime),
    c: $setup.noticeDetail.image
  }, $setup.noticeDetail.image ? {
    d: $setup.noticeDetail.image
  } : {}, {
    e: common_vendor.t($setup.noticeDetail.content)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/notice/detail.vue"]]);
wx.createPage(MiniProgramPage);
