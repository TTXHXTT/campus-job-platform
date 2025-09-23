import { createApp } from 'vue'
import App from "./App.vue";
import store from '@/store'
import uviewPlus from 'uview-plus'


// 调用setConfig方法，方法内部会进行对象属性深度合并，可以放心嵌套配置
// 需要在app.use(uview-plus)之后执行
uni.$u.setConfig({
  // 修改$u.config对象的属性
  config: {
    // 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
    unit: 'rpx'
  },
})

export const app = createApp(App)

// 全局组件注册
app.use(uviewPlus)
app.use(store)

app.mount('#app')
