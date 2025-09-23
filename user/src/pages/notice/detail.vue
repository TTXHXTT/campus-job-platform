<template>
  <view class="container">
    <view class="notice-detail">
      <view class="notice-header">
        <text class="notice-title">{{noticeDetail.title}}</text>
        <text class="notice-time">{{noticeDetail.createTime}}</text>
      </view>
      
      <image 
        v-if="noticeDetail.image" 
        :src="noticeDetail.image" 
        mode="widthFix" 
        class="notice-image"
      ></image>
      
      <view class="notice-content">
        <text>{{noticeDetail.content}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import request from '@/utils/request'

export default {
  setup() {
    const noticeDetail = ref({})
    const noticeId = ref(null)
    
    // 获取公告详情
    const getNoticeDetail = () => {
      if (!noticeId.value) return
      
      request.get('/api/getNoticeDetail', { id: noticeId.value }).then(res => {
        if (res.code === 0) {
          noticeDetail.value = res.data
        }
      })
    }
    
    // 页面加载
    onLoad((options) => {
      noticeId.value = options.id
      getNoticeDetail()
    })
    
    return {
      noticeDetail
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #fff;
  padding: 30rpx;
}

.notice-header {
  margin-bottom: 30rpx;
}

.notice-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
  line-height: 1.4;
}

.notice-time {
  font-size: 24rpx;
  color: #999;
}

.notice-image {
  width: 100%;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

.notice-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
}
</style> 