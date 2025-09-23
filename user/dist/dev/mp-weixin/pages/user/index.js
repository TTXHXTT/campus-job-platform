"use strict";
const common_vendor = require("../../common/vendor.js");
const CustomTabBar = () => "../../components/CustomTabBar.js";
const _sfc_main = {
  components: {
    CustomTabBar
  },
  setup() {
    const userInfo = common_vendor.ref({});
    const userTypes = ["学生", "发布者", "管理员"];
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
    const goToList = (type) => {
      if (type === "apply") {
        common_vendor.index.navigateTo({
          url: "/pages/apply/list"
        });
      } else if (type === "checkin") {
        common_vendor.index.navigateTo({
          url: "/pages/checkin/list"
        });
      } else if (type === "salary") {
        common_vendor.index.navigateTo({
          url: "/pages/salary/list"
        });
      }
    };
    const goToUserInfo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/info"
      });
    };
    const handleLogout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.clearStorageSync();
            common_vendor.index.reLaunch({
              url: "/pages/login"
            });
          }
        }
      });
    };
    common_vendor.onMounted(() => {
      getUserInfo();
    });
    return {
      userInfo,
      userTypes,
      goToList,
      goToUserInfo,
      handleLogout
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
  return common_vendor.e({
    a: $setup.userInfo.avatar || "/static/default-avatar.png",
    b: common_vendor.t($setup.userInfo.name),
    c: common_vendor.t($setup.userTypes[$setup.userInfo.type - 1]),
    d: $setup.userInfo.type === 1
  }, $setup.userInfo.type === 1 ? {
    e: common_vendor.p({
      type: "flag",
      size: "24",
      color: "#007AFF"
    }),
    f: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    }),
    g: common_vendor.o(($event) => $setup.goToList("apply")),
    h: common_vendor.p({
      type: "calendar",
      size: "24",
      color: "#007AFF"
    }),
    i: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    }),
    j: common_vendor.o(($event) => $setup.goToList("checkin")),
    k: common_vendor.p({
      type: "wallet",
      size: "24",
      color: "#007AFF"
    }),
    l: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    }),
    m: common_vendor.o(($event) => $setup.goToList("salary"))
  } : {}, {
    n: $setup.userInfo.type === 2
  }, $setup.userInfo.type === 2 ? {
    o: common_vendor.p({
      type: "personadd",
      size: "24",
      color: "#007AFF"
    }),
    p: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    }),
    q: common_vendor.o(($event) => $setup.goToList("apply")),
    r: common_vendor.p({
      type: "wallet",
      size: "24",
      color: "#007AFF"
    }),
    s: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    }),
    t: common_vendor.o(($event) => $setup.goToList("salary"))
  } : {}, {
    v: common_vendor.p({
      type: "person",
      size: "24",
      color: "#007AFF"
    }),
    w: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    }),
    x: common_vendor.o((...args) => $setup.goToUserInfo && $setup.goToUserInfo(...args)),
    y: common_vendor.p({
      type: "poweroff",
      size: "24",
      color: "#ff6b6b"
    }),
    z: common_vendor.p({
      type: "right",
      size: "16",
      color: "#999"
    }),
    A: common_vendor.o((...args) => $setup.handleLogout && $setup.handleLogout(...args)),
    B: common_vendor.p({
      current: 3
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/user/index.vue"]]);
wx.createPage(MiniProgramPage);
