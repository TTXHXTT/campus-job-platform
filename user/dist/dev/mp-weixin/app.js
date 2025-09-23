"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_tools = require("./utils/tools.js");
const store_index = require("./store/index.js");
require("./utils/go_page.js");
require("./utils/white_list.js");
require("./store/modules/user_store.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/job/index.js";
  "./pages/job/detail.js";
  "./pages/job/publish.js";
  "./pages/checkin/index.js";
  "./pages/user/index.js";
  "./pages/user/info.js";
  "./pages/apply/list.js";
  "./pages/checkin/list.js";
  "./pages/salary/list.js";
  "./pages/login.js";
  "./pages/register.js";
  "./pages/notice/detail.js";
  "./pages/notice/list.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onShow(() => {
      utils_tools.is_login();
    });
    return () => {
    };
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/home/projects/2025022501/user/src/App.vue"]]);
common_vendor.index.$u.setConfig({
  // 修改$u.config对象的属性
  config: {
    // 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
    unit: "rpx"
  }
});
const app = common_vendor.createApp(App);
app.use(common_vendor.uviewPlus);
app.use(store_index.store);
app.mount("#app");
exports.app = app;
