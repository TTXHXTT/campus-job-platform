"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "CustomTabBar",
  props: {
    current: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const userInfo = common_vendor.ref({});
    const getUserInfo = () => {
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        userInfo.value = user;
      }
    };
    const allTabList = [
      {
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        pagePath: "/pages/job/index",
        text: "招聘"
      },
      {
        pagePath: "/pages/checkin/index",
        text: "签到",
        showFor: [1]
        // 只对学生显示
      },
      {
        pagePath: "/pages/user/index",
        text: "我的"
      }
    ];
    const filteredTabList = common_vendor.computed(() => {
      return allTabList.filter((tab) => {
        if (!tab.showFor)
          return true;
        return tab.showFor.includes(userInfo.value.type);
      });
    });
    const getTabIndex = (visibleIndex) => {
      let realIndex = 0;
      let count = 0;
      for (let i = 0; i < allTabList.length; i++) {
        if (!allTabList[i].showFor || allTabList[i].showFor.includes(userInfo.value.type)) {
          if (count === visibleIndex) {
            realIndex = i;
            break;
          }
          count++;
        }
      }
      return realIndex;
    };
    const switchTab = (path) => {
      common_vendor.index.switchTab({
        url: path
      });
    };
    const getIconType = (index) => {
      const types = ["home", "bars", "calendar", "person"];
      return types[index];
    };
    getUserInfo();
    return {
      filteredTabList,
      switchTab,
      getIconType,
      getTabIndex
    };
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($setup.filteredTabList, (item, index, i0) => {
      return {
        a: "55a48eff-0-" + i0,
        b: common_vendor.p({
          type: $setup.getIconType($setup.getTabIndex(index)),
          color: $props.current === $setup.getTabIndex(index) ? "#007AFF" : "#999",
          size: "20"
        }),
        c: common_vendor.t(item.text),
        d: index,
        e: common_vendor.o(($event) => $setup.switchTab(item.pagePath), index),
        f: $props.current === $setup.getTabIndex(index) ? 1 : ""
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-55a48eff"], ["__file", "/home/projects/2025022501/user/src/components/CustomTabBar.vue"]]);
wx.createComponent(Component);
