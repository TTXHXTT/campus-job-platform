"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const checkinList = common_vendor.ref([]);
    const userInfo = common_vendor.ref({});
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
    const getCheckinList = () => {
      const params = {};
      if (userInfo.value.type === 1) {
        params.studentId = userInfo.value.id;
      } else if (userInfo.value.type === 2) {
        params.publisherId = userInfo.value.id;
      }
      utils_request.request.get("/api/getCheckinList", params).then((res) => {
        if (res.code === 0) {
          checkinList.value = res.data || [];
        }
      });
    };
    const goJobDetail = (jobId) => {
      common_vendor.index.navigateTo({
        url: `/pages/job/detail?id=${jobId}`
      });
    };
    common_vendor.onMounted(() => {
      getUserInfo();
      getCheckinList();
    });
    return {
      checkinList,
      goJobDetail
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
    a: common_vendor.f($setup.checkinList, (checkin, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(checkin.jobTitle),
        b: common_vendor.t(checkin.checkoutTime ? "已签退" : "进行中"),
        c: checkin.checkoutTime ? 1 : "",
        d: "7caa2370-0-" + i0,
        e: common_vendor.t(checkin.checkinTime),
        f: checkin.checkoutTime
      }, checkin.checkoutTime ? {
        g: "7caa2370-1-" + i0,
        h: common_vendor.p({
          type: "auth-filled",
          size: "14",
          color: "#999"
        }),
        i: common_vendor.t(checkin.checkoutTime)
      } : {}, {
        j: common_vendor.o(($event) => $setup.goJobDetail(checkin.jobId), index),
        k: index
      });
    }),
    b: common_vendor.p({
      type: "auth",
      size: "14",
      color: "#999"
    }),
    c: $setup.checkinList.length === 0
  }, $setup.checkinList.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/checkin/list.vue"]]);
wx.createPage(MiniProgramPage);
