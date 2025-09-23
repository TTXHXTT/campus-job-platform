"use strict";
const user_store = {
  state: {
    user_info: {}
  },
  mutations: {
    edit_user_info(state, data) {
      state.user_info = data;
    }
  },
  actions: {},
  getters: {}
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: user_store
}, Symbol.toStringTag, { value: "Module" }));
exports.__vite_glob_0_0 = __vite_glob_0_0;
