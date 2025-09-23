"use strict";
const common_vendor = require("../common/vendor.js");
const store_modules_user_store = require("./modules/user_store.js");
const modules_files = /* @__PURE__ */ Object.assign({ "./modules/user_store.js": store_modules_user_store.__vite_glob_0_0 });
const modules = {};
for (const key in modules_files) {
  modules[key.replace(/(\.\/modules\/|\.js)/g, "")] = modules_files[key].default;
}
let mutations = {
  // 重置state
  $reset(state) {
    Object.assign(state, modules_store("state"));
  }
};
function modules_store(func) {
  let obj = {};
  for (let i in modules) {
    obj = { ...obj, ...modules[i][func] };
  }
  if (func === "mutations") {
    obj = { ...obj, ...mutations };
  }
  return obj;
}
const store = common_vendor.createStore({
  state: modules_store("state"),
  mutations: modules_store("mutations"),
  actions: modules_store("actions"),
  getters: modules_store("getters"),
  plugins: [
    common_vendor.a({
      storage: {
        getItem: (key) => common_vendor.index.getStorageSync(key),
        setItem: (key, value) => common_vendor.index.setStorageSync(key, value),
        removeItem: (key) => common_vendor.index.removeStorageSync(key)
      }
    })
  ]
});
exports.store = store;
