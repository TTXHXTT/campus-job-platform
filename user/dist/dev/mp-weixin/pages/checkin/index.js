"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
require("../../utils/white_list.js");
require("../../utils/base.js");
require("../../store/index.js");
require("../../store/modules/user_store.js");
const CustomTabBar = () => "../../components/CustomTabBar.js";
const _sfc_main = {
  components: {
    CustomTabBar
  },
  setup() {
    const todayDate = common_vendor.ref("");
    const weekDay = common_vendor.ref("");
    const currentTime = common_vendor.ref("");
    const userInfo = common_vendor.ref({});
    const availableJobs = common_vendor.ref([]);
    const currentWork = common_vendor.ref(null);
    const records = common_vendor.ref([]);
    const timer = common_vendor.ref(null);
    const workDuration = common_vendor.computed(() => {
      if (!currentWork.value || !currentWork.value.checkinTime)
        return "0分钟";
      const start = new Date(currentWork.value.checkinTime).getTime();
      const now = new Date().getTime();
      const duration = Math.floor((now - start) / 1e3 / 60);
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;
    });
    const getUserInfo = () => {
      const user = common_vendor.index.getStorageSync("user");
      if (user) {
        userInfo.value = user;
      }
    };
    const updateTime = () => {
      const now = new Date();
      const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      todayDate.value = now.toLocaleDateString();
      weekDay.value = days[now.getDay()];
      currentTime.value = now.toLocaleTimeString();
    };
    const getAvailableJobs = () => {
      utils_request.request.get("/api/getCheckinList", {
        studentId: userInfo.value.id
      }).then((res) => {
        if (res.code === 0 && res.data) {
          const ongoing = res.data.find((record) => !record.checkoutTime);
          if (ongoing) {
            utils_request.request.get("/api/getJobDetail", { id: ongoing.jobId }).then((res2) => {
              if (res2.code === 0) {
                currentWork.value = {
                  ...res2.data,
                  checkinTime: ongoing.checkinTime
                };
              }
            });
            return;
          }
          utils_request.request.get("/api/getApplyList", {
            studentId: userInfo.value.id,
            status: 1
            // 只获取已通过的报名
          }).then((res2) => {
            if (res2.code === 0 && res2.data) {
              const promises = res2.data.map(
                (apply) => utils_request.request.get("/api/getJobDetail", { id: apply.jobId })
              );
              Promise.all(promises).then((results) => {
                availableJobs.value = results.filter((res3) => res3.code === 0).map((res3) => res3.data);
              });
            }
          });
        }
      });
    };
    const getCheckinRecords = () => {
      utils_request.request.get("/api/getCheckinList", {
        studentId: userInfo.value.id
      }).then((res) => {
        if (res.code === 0) {
          records.value = res.data;
        }
      });
    };
    const handleCheckin = (job) => {
      if (!userInfo.value || !userInfo.value.id) {
        common_vendor.index.showToast({
          title: "用户信息获取失败，请重新登录",
          icon: "none"
        });
        return;
      }
      if (!job || !job.id) {
        common_vendor.index.showToast({
          title: "工作信息不完整",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "确认签到",
        content: `确定要开始 ${job.title} 的工作吗？签到后将无法同时进行其他工作。`,
        success: (res) => {
          if (res.confirm) {
            console.log("签到请求参数：", {
              jobId: job.id,
              studentId: userInfo.value.id
            });
            utils_request.request.post("/api/checkin", {
              jobId: job.id,
              studentId: userInfo.value.id
            }).then((res2) => {
              console.log("签到响应：", res2);
              if (res2.code === 0) {
                common_vendor.index.showToast({
                  title: "签到成功",
                  icon: "success"
                });
                getAvailableJobs();
                getCheckinRecords();
              } else {
                common_vendor.index.showToast({
                  title: res2.msg || "签到失败",
                  icon: "none",
                  duration: 2e3
                });
              }
            }).catch((err) => {
              console.error("签到请求错误：", err);
              common_vendor.index.showToast({
                title: "签到请求失败，请重试",
                icon: "none",
                duration: 2e3
              });
            });
          }
        }
      });
    };
    const handleCheckout = () => {
      common_vendor.index.showModal({
        title: "确认签退",
        content: "确定要结束当前工作吗？系统将自动计算工作时长和工资。",
        success: (res) => {
          if (res.confirm) {
            utils_request.request.post("/api/checkout", {
              jobId: currentWork.value.id,
              studentId: userInfo.value.id
            }).then((res2) => {
              if (res2.code === 0) {
                common_vendor.index.showToast({
                  title: "签退成功",
                  icon: "success"
                });
                currentWork.value = null;
                getAvailableJobs();
                getCheckinRecords();
              } else {
                common_vendor.index.showToast({
                  title: res2.msg,
                  icon: "none"
                });
              }
            });
          }
        }
      });
    };
    common_vendor.onMounted(() => {
      getUserInfo();
      updateTime();
      timer.value = setInterval(updateTime, 1e3);
      getAvailableJobs();
      getCheckinRecords();
    });
    common_vendor.onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });
    return {
      todayDate,
      weekDay,
      currentTime,
      availableJobs,
      currentWork,
      records,
      workDuration,
      handleCheckin,
      handleCheckout
    };
  }
};
if (!Array) {
  const _component_CustomTabBar = common_vendor.resolveComponent("CustomTabBar");
  _component_CustomTabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($setup.todayDate),
    b: common_vendor.t($setup.weekDay),
    c: common_vendor.t($setup.currentTime),
    d: !$setup.currentWork
  }, !$setup.currentWork ? {
    e: common_vendor.f($setup.availableJobs, (job, index, i0) => {
      return {
        a: common_vendor.t(job.title),
        b: common_vendor.t(job.salary),
        c: common_vendor.t(job.address),
        d: index,
        e: common_vendor.o(($event) => $setup.handleCheckin(job), index)
      };
    })
  } : {
    f: common_vendor.t($setup.currentWork.title),
    g: common_vendor.t($setup.currentWork.salary),
    h: common_vendor.t($setup.currentWork.address),
    i: common_vendor.t($setup.currentWork.checkinTime),
    j: common_vendor.t($setup.workDuration),
    k: common_vendor.o((...args) => $setup.handleCheckout && $setup.handleCheckout(...args))
  }, {
    l: common_vendor.f($setup.records, (record, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(record.jobTitle),
        b: common_vendor.t(record.createTime),
        c: common_vendor.t(record.checkinTime),
        d: record.checkoutTime
      }, record.checkoutTime ? {
        e: common_vendor.t(record.checkoutTime)
      } : {}, {
        f: record.checkoutTime
      }, record.checkoutTime ? {
        g: common_vendor.t(record.salary || "待结算")
      } : {}, {
        h: index
      });
    }),
    m: common_vendor.p({
      current: 2
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/projects/2025022501/user/src/pages/checkin/index.vue"]]);
wx.createPage(MiniProgramPage);
