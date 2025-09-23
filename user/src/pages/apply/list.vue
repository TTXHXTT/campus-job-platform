<template>
  <view class="container">
    <!-- 添加分类标签 -->
    <view class="tab-bar">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === index }"
        v-for="(tab, index) in tabs" 
        :key="index"
        @click="switchTab(index)"
      >
        <text>{{tab}}</text>
      </view>
    </view>

    <view class="apply-list">
      <view 
        class="apply-item" 
        v-for="(apply, index) in filteredApplyList" 
        :key="index"
      >
        <view class="job-info">
          <text class="job-title">{{apply.jobTitle}}</text>
          <text class="apply-status" :class="getStatusClass(apply.status)">
            {{statusText[apply.status]}}
          </text>
        </view>
        <view class="apply-time">
          <uni-icons type="calendar" size="14" color="#999"></uni-icons>
          <text>报名时间：{{apply.createTime}}</text>
        </view>
        <view class="action-bar">
          <button class="btn-detail" @click="goJobDetail(apply.jobId)">查看详情</button>
          <!-- 学生显示取消报名按钮 -->
          <button 
            class="btn-cancel" 
            v-if="userInfo.type === 1 && apply.status === 0" 
            @click="handleCancel(apply)"
          >取消报名</button>
          <!-- 发布者显示审核按钮 -->
          <template v-if="userInfo.type === 2 && apply.status === 0">
            <button 
              class="btn-approve" 
              @click="handleApply(apply, 1)"
            >通过</button>
            <button 
              class="btn-reject" 
              @click="handleApply(apply, 2)"
            >拒绝</button>
          </template>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty" v-if="filteredApplyList.length === 0">
        <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
        <text>暂无{{tabs[currentTab]}}记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import request from '@/utils/request'

export default {
  setup() {
    const applyList = ref([])
    const userInfo = ref({})
    const statusText = ['待审核', '已通过', '已拒绝']
    const currentTab = ref(0)
    const tabs = ['全部', '审核中', '已通过', '已拒绝']
    
    // 获取用户信息
    const getUserInfo = () => {
      const user = uni.getStorageSync('user')
      if (user) {
        userInfo.value = user
      } else {
        uni.redirectTo({
          url: '/pages/login'
        })
      }
    }
    
    // 获取报名列表
    const getApplyList = () => {
      const params = {}
      if (userInfo.value.type === 1) {
        params.studentId = userInfo.value.id
      } else if (userInfo.value.type === 2) {
        params.publisherId = userInfo.value.id
      }
      
      request.get('/api/getAllApplyList', params).then(res => {
        if (res.code === 0) {
          console.log('报名列表数据：', res.data)
          applyList.value = res.data || []
          // 如果是从工作详情页跳转来的，默认显示审核中标签
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          if (currentPage.options && currentPage.options.status === 'pending') {
            currentTab.value = 1
          }
        }
      })
    }
    
    // 切换标签
    const switchTab = (index) => {
      currentTab.value = index
    }
    
    // 过滤后的列表
    const filteredApplyList = computed(() => {
      console.log('当前标签：', currentTab.value)
      console.log('报名列表：', applyList.value)
      if (currentTab.value === 0) {
        return applyList.value
      } else {
        const status = currentTab.value - 1
        return applyList.value.filter(item => item.status === status)
      }
    })
    
    // 获取状态样式类
    const getStatusClass = (status) => {
      const classes = ['status-pending', 'status-success', 'status-fail']
      return classes[status]
    }
    
    // 跳转到工作详情
    const goJobDetail = (jobId) => {
      uni.navigateTo({
        url: `/pages/job/detail?id=${jobId}`
      })
    }
    
    // 取消报名
    const handleCancel = (apply) => {
      uni.showModal({
        title: '提示',
        content: '确定要取消报名吗？',
        success: (res) => {
          if (res.confirm) {
            request.post(`/api/deleteApply?id=${apply.id}`).then(res => {
              if (res.code === 0) {
                uni.showToast({
                  title: '取消成功',
                  icon: 'success'
                })
                getApplyList()
              } else {
                uni.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    }
    
    // 处理报名
    const handleApply = (apply, status) => {
      uni.showModal({
        title: '提示',
        content: `确定要${status === 1 ? '通过' : '拒绝'}报名吗？`,
        success: (res) => {
          if (res.confirm) {
            request.post(`/api/updateApplyStatus?id=${apply.id}&status=${status}`).then(res => {
              if (res.code === 0) {
                uni.showToast({
                  title: `${status === 1 ? '通过' : '拒绝'}成功`,
                  icon: 'success'
                })
                getApplyList()
              } else {
                uni.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    }
    
    onMounted(() => {
      getUserInfo()
      getApplyList()
    })
    
    // 动态设置页面标题
    onShow(() => {
      getUserInfo() // 先获取用户信息
      getApplyList() // 刷新列表数据
      // 获取用户信息后设置标题
      const user = uni.getStorageSync('user')
      if (user) {
        uni.setNavigationBarTitle({
          title: user.type === 2 ? '报名管理' : '我的报名'
        })
      }
    })
    
    return {
      applyList,
      statusText,
      currentTab,
      tabs,
      filteredApplyList,
      getStatusClass,
      goJobDetail,
      handleCancel,
      switchTab,
      userInfo,
      handleApply
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.tab-bar {
  display: flex;
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
  padding: 10rpx 0;
}

.tab-item.active {
  color: #007AFF;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -10rpx;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #007AFF;
  border-radius: 2rpx;
}

.apply-list {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.apply-item {
  padding: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.apply-item:last-child {
  border-bottom: none;
}

.job-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.job-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.apply-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.status-pending {
  color: #ff9900;
  background: rgba(255, 153, 0, 0.1);
}

.status-success {
  color: #07c160;
  background: rgba(7, 193, 96, 0.1);
}

.status-fail {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.1);
}

.apply-time {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.btn-detail, .btn-cancel {
  font-size: 24rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
}

.btn-detail {
  color: #007AFF;
  background: rgba(0, 122, 255, 0.1);
}

.btn-cancel {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.1);
}

.btn-approve {
  color: #07c160;
  background: rgba(7, 193, 96, 0.1);
  font-size: 24rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
}

.btn-reject {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.1);
  font-size: 24rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
}

.empty {
  padding: 60rpx 0;
  text-align: center;
  background: #fff;
  border-radius: 12rpx;
  margin-top: 20rpx;
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 20rpx;
}

.empty text {
  font-size: 28rpx;
  color: #999;
  display: block;
}
</style> 