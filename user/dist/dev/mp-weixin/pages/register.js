"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
require("../utils/white_list.js");
require("../utils/base.js");
require("../store/index.js");
require("../store/modules/user_store.js");
const _sfc_main = {
  setup() {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const confirmPassword = common_vendor.ref("");
    const name = common_vendor.ref("");
    const phone = common_vendor.ref("");
    const typeIndex = common_vendor.ref(0);
    const types = ["学生", "发布者"];
    const avatar = common_vendor.ref("");
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.wx$1.getFileSystemManager().readFile({
            filePath: tempFilePath,
            encoding: "base64",
            success: (res2) => {
              avatar.value = "data:image/jpeg;base64," + res2.data;
            },
            fail: (err) => {
              console.error("读取文件失败：", err);
              common_vendor.index.showToast({
                title: "头像上传失败",
                icon: "none"
              });
            }
          });
        },
        fail: (err) => {
          console.error("选择图片失败：", err);
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    };
    const handleRegister = () => {
      if (!username.value || !password.value || !confirmPassword.value || !name.value || !phone.value) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      if (password.value !== confirmPassword.value) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      utils_request.request.post("/api/register", {
        username: username.value,
        password: password.value,
        name: name.value,
        phone: phone.value,
        type: parseInt(typeIndex.value) + 1,
        avatar: avatar.value
      }).then((res) => {
        if (res.code === 0) {
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.redirectTo({
              url: "/pages/login"
            });
          }, 1500);
        } else if (res.code === 2) {
          common_vendor.index.showToast({
            title: "用户名已存在",
            icon: "none"
          });
        } else {
          common_vendor.index.showToast({
            title: res.msg,
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.showToast({
          title: "注册失败",
          icon: "none"
        });
      });
    };
    const bindPickerChange = (e) => {
      typeIndex.value = e.detail.value;
    };
    const goLogin = () => {
      common_vendor.index.navigateBack();
    };
    return {
      username,
      password,
      confirmPassword,
      name,
      phone,
      typeIndex,
      types,
      avatar,
      handleRegister,
      bindPickerChange,
      goLogin,
      chooseImage
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
  return common_vendor.e({
    a: $setup.avatar
  }, $setup.avatar ? {
    b: $setup.avatar
  } : {
    c: common_vendor.p({
      type: "person-filled",
      size: "60",
      color: "#bbb"
    })
  }, {
    d: common_vendor.p({
      type: "camera-filled",
      size: "20",
      color: "#fff"
    }),
    e: common_vendor.o((...args) => $setup.chooseImage && $setup.chooseImage(...args)),
    f: $setup.username,
    g: common_vendor.o(($event) => $setup.username = $event.detail.value),
    h: common_vendor.p({
      type: "person",
      size: "24",
      color: "#999"
    }),
    i: $setup.password,
    j: common_vendor.o(($event) => $setup.password = $event.detail.value),
    k: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#999"
    }),
    l: $setup.confirmPassword,
    m: common_vendor.o(($event) => $setup.confirmPassword = $event.detail.value),
    n: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#999"
    }),
    o: $setup.name,
    p: common_vendor.o(($event) => $setup.name = $event.detail.value),
    q: common_vendor.p({
      type: "person-filled",
      size: "24",
      color: "#999"
    }),
    r: $setup.phone,
    s: common_vendor.o(($event) => $setup.phone = $event.detail.value),
    t: common_vendor.p({
      type: "phone",
      size: "24",
      color: "#999"
    }),
    v: common_vendor.t($setup.types[$setup.typeIndex]),
    w: common_vendor.p({
      type: "bottom",
      size: "24",
      color: "#999"
    }),
    x: common_vendor.o((...args) => $setup.bindPickerChange && $setup.bindPickerChange(...args)),
    y: $setup.typeIndex,
    z: $setup.types,
    A: common_vendor.p({
      type: "staff",
      size: "24",
      color: "#999"
    }),
    B: common_vendor.o((...args) => $setup.handleRegister && $setup.handleRegister(...args)),
    C: common_vendor.o((...args) => $setup.goLogin && $setup.goLogin(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/register.vue"]]);
wx.createPage(MiniProgramPage);
