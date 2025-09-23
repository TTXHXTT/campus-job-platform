<template>
  <view class="container">
    <view class="checkin-list">
      <view class="checkin-item" v-for="(checkin, index) in checkinList" :key="index">
        <view class="job-info">
          <text class="job-title">{{checkin.jobTitle}}</text>
          <text class="checkin-status" :class="{'checked-out': checkin.checkoutTime}">
            {{checkin.checkoutTime ? '已签退' : '进行中'}}
          </text>
        </view>
        
        <view class="time-info">
          <view class="time-item">
            <uni-icons type="auth" size="14" color="#999"></uni-icons>
            <text>签到时间：{{checkin.checkinTime}}</text>
          </view>
          <view class="time-item" v-if="checkin.checkoutTime">
            <uni-icons type="auth-filled" size="14" color="#999"></uni-icons>
            <text>签退时间：{{checkin.checkoutTime}}</text>
          </view>
        </view>
        
        <view class="action-bar">
          <button class="btn-detail" @click="goJobDetail(checkin.jobId)">查看工作</button>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty" v-if="checkinList.length === 0">
        <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
        <text>暂无签到记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

export default {
  setup() {
    const checkinList = ref([])
    const userInfo = ref({})
    
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
    
    // 获取签到列表
    const getCheckinList = () => {
      const params = {}
      if (userInfo.value.type === 1) {
        params.studentId = userInfo.value.id
      } else if (userInfo.value.type === 2) {
        params.publisherId = userInfo.value.id
      }
      
      request.get('/api/getCheckinList', params).then(res => {
        if (res.code === 0) {
          checkinList.value = res.data || []
        }
      })
    }
    
    // 跳转到工作详情
    const goJobDetail = (jobId) => {
      uni.navigateTo({
        url: `/pages/job/detail?id=${jobId}`
      })
    }
    
    onMounted(() => {
      getUserInfo()
      getCheckinList()
    })
    
    return {
      checkinList,
      goJobDetail
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

.checkin-list {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.checkin-item {
  padding: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.checkin-item:last-child {
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

.checkin-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  color: #07c160;
  background: rgba(7, 193, 96, 0.1);
}

.checkin-status.checked-out {
  color: #999;
  background: rgba(153, 153, 153, 0.1);
}

.time-info {
  margin-bottom: 20rpx;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.time-item:last-child {
  margin-bottom: 0;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
}

.btn-detail {
  font-size: 24rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  color: #007AFF;
  background: rgba(0, 122, 255, 0.1);
}

.empty {
  padding: 60rpx;
  text-align: center;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty text {
  font-size: 28rpx;
  color: #999;
}
</style> 