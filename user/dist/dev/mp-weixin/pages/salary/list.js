"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const salaryList = common_vendor.ref([]);
    const userInfo = common_vendor.ref({});
    const statusText = ["待审核", "已通过", "已拒绝"];
    const getUserInfo = () => {
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        userInfo.value = user;
      }
    };
    const getSalaryList = () => {
      const params = {};
      if (userInfo.value.type === 2) {
        utils_request.request.get("/api/getPublisherSalaryList", { publisherId: userInfo.value.id }).then((res) => {
          if (res.code === 0) {
            salaryList.value = res.data;
          }
        });
      } else {
        params.studentId = userInfo.value.id;
        utils_request.request.get("/api/getSalaryList", params).then((res) => {
          if (res.code === 0) {
            salaryList.value = res.data;
          }
        });
      }
    };
    const handleApprove = (salary, status) => {
      const statusText2 = status === 1 ? "通过" : "拒绝";
      common_vendor.index.showModal({
        title: "提示",
        content: `确定要${statusText2}该工资申请吗？`,
        success: (res) => {
          if (res.confirm) {
            utils_request.request.post("/api/updateSalaryStatus", {
              id: salary.id,
              status
            }).then((res2) => {
              if (res2.code === 0) {
                common_vendor.index.showToast({
                  title: "操作成功",
                  icon: "success"
                });
                getSalaryList();
              }
            });
          }
        }
      });
    };
    const getStatusClass = (status) => {
      const classes = ["status-pending", "status-approved", "status-rejected"];
      return classes[status];
    };
    common_vendor.onMounted(() => {
      getUserInfo();
      getSalaryList();
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        common_vendor.index.setNavigationBarTitle({
          title: user.type === 2 ? "工资管理" : "我的工资"
        });
      }
    });
    return {
      salaryList,
      userInfo,
      statusText,
      handleApprove,
      getStatusClass
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
    a: common_vendor.t($setup.userInfo.type === 2 ? "工资管理" : "我的工资"),
    b: common_vendor.f($setup.salaryList, (salary, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(salary.jobTitle),
        b: common_vendor.t(salary.amount),
        c: "75ebba6b-0-" + i0,
        d: common_vendor.t($setup.userInfo.type === 2 ? salary.studentName : salary.publisherName),
        e: "75ebba6b-1-" + i0,
        f: common_vendor.t(salary.createTime),
        g: common_vendor.t($setup.statusText[salary.status]),
        h: common_vendor.n($setup.getStatusClass(salary.status)),
        i: $setup.userInfo.type === 2 && salary.status === 0
      }, $setup.userInfo.type === 2 && salary.status === 0 ? {
        j: common_vendor.o(($event) => $setup.handleApprove(salary, 1), index),
        k: common_vendor.o(($event) => $setup.handleApprove(salary, 2), index)
      } : {}, {
        l: index
      });
    }),
    c: common_vendor.p({
      type: "staff",
      size: "14",
      color: "#999"
    }),
    d: common_vendor.p({
      type: "calendar",
      size: "14",
      color: "#999"
    }),
    e: $setup.salaryList.length === 0
  }, $setup.salaryList.length === 0 ? {
    f: common_vendor.t($setup.userInfo.type === 2 ? "工资审核" : "工资")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/salary/list.vue"]]);
wx.createPage(MiniProgramPage);
