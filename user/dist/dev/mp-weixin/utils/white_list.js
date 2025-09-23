"use strict";
const api = [
  // 登录
  "/api/login",
  // 注册
  "/api/register"
];
const not_high_frequency_api = [];
const external_page = [];
const page = [
  "pages/login",
  "pages/register",
  "pages/forgot"
];
const white_list = { api, page, not_high_frequency_api, external_page };
exports.white_list = white_list;
