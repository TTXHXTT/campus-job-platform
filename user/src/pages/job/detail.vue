<template>
  <view class="container">
    <view class="job-detail">
      <view class="job-header">
        <text class="job-title">{{jobDetail.title}}</text>
        <text class="job-salary">￥{{jobDetail.salary}}/小时</text>
      </view>
      
      <view class="job-info">
        <view class="info-item">
          <text class="label">工作地点：</text>
          <text class="value">{{jobDetail.address}}</text>
        </view>
        <view class="info-item">
          <text class="label">发布者：</text>
          <text class="value">{{jobDetail.publisherName}}</text>
        </view>
        <view class="info-item">
          <text class="label">发布时间：</text>
          <text class="value">{{jobDetail.createTime}}</text>
        </view>
      </view>
      
      <view class="job-section">
        <text class="section-title">工作内容</text>
        <text class="section-content">{{jobDetail.content}}</text>
      </view>
      
      <view class="job-section">
        <text class="section-title">工作要求</text>
        <text class="section-content">{{jobDetail.requirement}}</text>
      </view>
    </view>
    
    <!-- 学生显示报名按钮 -->
    <view class="action-bar" v-if="userInfo.type === 1">
      <button class="btn-apply" @click="handleApply" :disabled="applied">
        {{applied ? '已报名' : '立即报名'}}
      </button>
    </view>
    
    <!-- 发布者显示删除按钮 -->
    <view class="action-bar" v-if="userInfo.type === 2 && userInfo.id === jobDetail.publisherId">
      <button class="btn-delete" @click="handleDelete">删除招聘</button>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

export default {
  setup() {
    const jobDetail = ref({})
    const userInfo = ref({})
    const applied = ref(false)
    const jobId = ref(null)
    
    // 获取用户信息
    const getUserInfo = () => {
      const user = uni.getStorageSync('user')
      if (user) {
        userInfo.value = user
      }
    }
    
    // 获取工作详情
    const getJobDetail = () => {
      if (!jobId.value) return
      
      request.get('/api/getJobDetail', { id: jobId.value }).then(res => {
        if (res.code === 0) {
          jobDetail.value = {
            ...res.data,
            salary: parseFloat(res.data.salary).toFixed(2)
          }
          checkApplyStatus()
        }
      })
    }
    
    // 检查报名状态
    const checkApplyStatus = () => {
      if (userInfo.value.type === 1) {
        request.get('/api/getApplyList', {
          jobId: jobDetail.value.id,
          studentId: userInfo.value.id
        }).then(res => {
          if (res.code === 0 && res.data && res.data.length > 0) {
            applied.value = true
          }
        })
      }
    }
    
    // 页面加载
    onLoad((options) => {
      jobId.value = options.id
      getUserInfo()
      getJobDetail()
    })
    
    // 报名
    const handleApply = () => {
      if (applied.value) return
      
      uni.showModal({
        title: '确认报名',
        content: '确定要报名这个工作吗？',
        success: (res) => {
          if (res.confirm) {
            request.post('/api/apply', {
              jobId: jobDetail.value.id,
              studentId: userInfo.value.id
            }).then(res => {
              if (res.code === 0) {
                uni.showToast({
                  title: '报名成功',
                  icon: 'success'
                })
                applied.value = true
                setTimeout(() => {
                  uni.navigateTo({
                    url: '/pages/apply/list'
                  })
                }, 1500)
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
    
    // 删除招聘
    const handleDelete = () => {
      uni.showModal({
        title: '提示',
        content: '确定要删除这条招聘信息吗？',
        success: (res) => {
          if (res.confirm) {
            request.post('/api/deleteJob', {
              id: jobDetail.value.id
            }).then(res => {
              if (res.code === 0) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                setTimeout(() => {
                  uni.navigateBack()
                }, 1500)
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
    
    return {
      jobDetail,
      userInfo,
      applied,
      handleApply,
      handleDelete
    }
  }
}
</script>

<style>
.container {
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.job-detail {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 0 20rpx rgba(0,0,0,0.1);
}

.job-header {
  margin-bottom: 30rpx;
}

.job-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.job-salary {
  font-size: 32rpx;
  color: #f00;
  font-weight: bold;
}

.job-info {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
  margin-bottom: 30rpx;
}

.info-item {
  display: flex;
  margin-bottom: 10rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 28rpx;
  color: #666;
  width: 160rpx;
}

.value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.job-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.1);
}

.btn-apply {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #007AFF;
  color: #fff;
  font-size: 32rpx;
  border-radius: 10rpx;
}

.btn-apply[disabled] {
  background: #ccc;
}

.btn-delete {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #f00;
  color: #fff;
  font-size: 32rpx;
  border-radius: 10rpx;
}
</style> 