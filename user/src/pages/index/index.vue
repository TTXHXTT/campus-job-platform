<template>
  <view class="container">
    <!-- 轮播图 -->
    <swiper class="banner" circular autoplay interval="3000" duration="500">
      <swiper-item v-for="(notice, index) in bannerList" :key="index" @click="goNoticeDetail(notice)">
        <image :src="notice.image || '/static/banner.png'" mode="aspectFill"></image>
        <view class="banner-title">{{notice.title}}</view>
      </swiper-item>
    </swiper>
    
    <!-- 公告列表 -->
    <view class="section notice-section">
      <view class="section-header">
        <text class="title">最新公告</text>
        <text class="more" @click="goNoticeList">查看更多</text>
      </view>
      <view class="notice-list">
        <view class="notice-item" v-for="(notice, index) in noticeList" :key="index" @click="goNoticeDetail(notice)">
          <view class="notice-info">
            <text class="notice-title">{{notice.title}}</text>
            <text class="notice-time">{{notice.createTime}}</text>
          </view>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
      </view>
    </view>
    
    <!-- 热门招聘 -->
    <view class="section job-section">
      <view class="section-header">
        <text class="title">热门招聘</text>
        <text class="more" @click="goJobList">查看更多</text>
      </view>
      <view class="job-list">
        <view class="job-item" v-for="(job, index) in jobList" :key="index" @click="goJobDetail(job)">
          <view class="job-header">
            <text class="job-title">{{job.title}}</text>
            <text class="job-salary">￥{{job.salary}}/小时</text>
          </view>
          <view class="job-content">
            <text class="job-desc">{{job.content}}</text>
          </view>
          <view class="job-footer">
            <view class="job-info">
              <view class="info-item">
                <uni-icons type="location" size="14" color="#666"></uni-icons>
                <text>{{job.address}}</text>
              </view>
              <view class="info-item">
                <uni-icons type="staff" size="14" color="#666"></uni-icons>
                <text>发布者：{{job.publisherName}}</text>
              </view>
            </view>
            <text class="job-time">{{job.createTime}}</text>
          </view>
        </view>
      </view>
    </view>
    
    <CustomTabBar :current="0"></CustomTabBar>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import CustomTabBar from '@/components/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  setup() {
    const bannerList = ref([])
    const noticeList = ref([])
    const jobList = ref([])
    
    // 获取公告列表
    const getNoticeList = () => {
      request.get('/api/getNoticeList').then(res => {
        if (res.code === 0) {
          bannerList.value = res.data.filter(item => item.image).slice(0, 3)
          noticeList.value = res.data.slice(0, 3)
        }
      })
    }
    
    // 获取招聘列表
    const getJobList = () => {
      request.get('/api/getJobList').then(res => {
        if (res.code === 0) {
          console.log('首页招聘列表数据：', res.data)
          jobList.value = res.data.slice(0, 3).map(job => ({
            ...job,
            salary: parseFloat(job.salary).toFixed(2)
          }))
        }
      })
    }
    
    // 跳转到公告详情
    const goNoticeDetail = (notice) => {
      uni.navigateTo({
        url: `/pages/notice/detail?id=${notice.id}&title=${encodeURIComponent(notice.title)}`
      })
    }
    
    // 跳转到公告列表
    const goNoticeList = () => {
      uni.navigateTo({
        url: '/pages/notice/list'
      })
    }
    
    // 跳转到招聘列表
    const goJobList = () => {
      uni.switchTab({
        url: '/pages/job/index'
      })
    }
    
    // 跳转到招聘详情
    const goJobDetail = (job) => {
      uni.navigateTo({
        url: `/pages/job/detail?id=${job.id}&title=${encodeURIComponent(job.title)}`
      })
    }
    
    // 下拉刷新
    const onPullDownRefresh = () => {
      Promise.all([getNoticeList(), getJobList()]).then(() => {
        uni.stopPullDownRefresh()
      })
    }
    
    onMounted(() => {
      getNoticeList()
      getJobList()
    })
    
    return {
      bannerList,
      noticeList,
      jobList,
      goNoticeDetail,
      goNoticeList,
      goJobList,
      goJobDetail,
      onPullDownRefresh
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.banner {
  width: 100%;
  height: 360rpx;
  background: #fff;
  position: relative;
}

.banner image {
  width: 100%;
  height: 100%;
}

.banner-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 30rpx 20rpx 20rpx;
  color: #fff;
  font-size: 28rpx;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section {
  margin: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.section-header .title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
}

.section-header .title::before {
  content: '';
  width: 6rpx;
  height: 32rpx;
  background: #007AFF;
  margin-right: 16rpx;
  border-radius: 3rpx;
}

.section-header .more {
  font-size: 24rpx;
  color: #666;
  display: flex;
  align-items: center;
}

.notice-list {
  padding: 0 30rpx;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-info {
  flex: 1;
  margin-right: 20rpx;
}

.notice-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice-time {
  font-size: 24rpx;
  color: #999;
}

.job-list {
  padding: 0 30rpx;
}

.job-item {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
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
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.job-salary {
  font-size: 32rpx;
  color: #ff5722;
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
  gap: 20rpx;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 24rpx;
  color: #666;
}
</style> 