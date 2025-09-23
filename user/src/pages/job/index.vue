<template>
  <view class="container">
    <!-- 发布者显示发布按钮 -->
    <view class="publish-btn" v-if="userInfo.type === 2" @click="goPublish">
      <text>发布招聘</text>
    </view>
    
    <!-- 招聘列表 -->
    <view class="job-list" v-if="jobList.length > 0">
      <view class="job-item" v-for="(job, index) in jobList" :key="index" @click="goDetail(job)">
        <view class="job-header">
          <text class="job-title">{{job.title}}</text>
          <text class="job-salary">￥{{job.salary}}/小时</text>
        </view>
        <view class="job-content">
          <text class="job-desc">{{job.content}}</text>
        </view>
        <view class="job-footer">
          <view class="job-info">
            <text class="job-address">{{job.address}}</text>
            <text class="job-time">{{job.createTime}}</text>
          </view>
          <view class="job-publisher">
            <text>发布者：{{job.publisherName}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">{{userInfo.type === 2 ? '您还没有发布任何招聘' : '暂无招聘信息'}}</text>
      <button class="btn-publish" v-if="userInfo.type === 2" @click="goPublish">立即发布</button>
    </view>
    
    <CustomTabBar :current="1"></CustomTabBar>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import request from '@/utils/request'
import CustomTabBar from '@/components/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  setup() {
    const jobList = ref([])
    const userInfo = ref({})
    
    // 获取用户信息
    const getUserInfo = () => {
      const user = uni.getStorageSync('user')
      if (user) {
        userInfo.value = user
        // 获取用户信息后立即获取招聘列表
        getJobList()
      }
    }
    
    // 获取招聘列表
    const getJobList = () => {
      const params = {}
      if (userInfo.value.type === 2) {
        params.publisherId = userInfo.value.id
      }
      request.get('/api/getJobList', params).then(res => {
        if (res.code === 0) {
          console.log('招聘列表数据：', res.data)
          jobList.value = res.data.map(job => ({
            ...job,
            salary: parseFloat(job.salary).toFixed(2)
          }))
        }
      })
    }
    
    // 跳转到发布页面
    const goPublish = () => {
      uni.navigateTo({
        url: '/pages/job/publish'
      })
    }
    
    // 跳转到详情页面
    const goDetail = (job) => {
      uni.navigateTo({
        url: `/pages/job/detail?id=${job.id}&title=${encodeURIComponent(job.title)}`
      })
    }
    
    onMounted(() => {
      getUserInfo()
    })
    
    // 添加页面显示时的刷新逻辑
    onShow(() => {
      getUserInfo()
    })
    
    return {
      jobList,
      userInfo,
      goPublish,
      goDetail
    }
  }
}
</script>

<style>
.container {
  padding: 20rpx;
  padding-bottom: 100rpx;
  min-height: 100vh;
  box-sizing: border-box;
  background: #f5f5f5;
}

.publish-btn {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  width: 120rpx;
  height: 120rpx;
  background: #007AFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24rpx;
  box-shadow: 0 0 20rpx rgba(0,0,0,0.1);
  z-index: 100;
}

.job-list {
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 0 20rpx rgba(0,0,0,0.1);
}

.job-item {
  padding: 20rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.job-item:last-child {
  border-bottom: none;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.job-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.job-salary {
  font-size: 32rpx;
  color: #f00;
  font-weight: bold;
}

.job-content {
  margin-bottom: 20rpx;
}

.job-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-info {
  display: flex;
  flex-direction: column;
}

.job-address {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.job-time {
  font-size: 24rpx;
  color: #999;
}

.job-publisher {
  font-size: 24rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  background: #fff;
  border-radius: 20rpx;
  margin-top: 20rpx;
  box-shadow: 0 0 20rpx rgba(0,0,0,0.1);
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.btn-publish {
  width: 240rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #007AFF;
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
  box-shadow: 0 10rpx 20rpx rgba(0,122,255,0.2);
}
</style> 