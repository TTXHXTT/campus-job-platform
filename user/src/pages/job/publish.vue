<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">标题</text>
        <input 
          type="text" 
          v-model="jobForm.title" 
          placeholder="请输入招聘标题" 
          class="input"
        />
      </view>
      
      <view class="form-item">
        <text class="label">工资</text>
        <input 
          type="digit" 
          v-model="jobForm.salary" 
          placeholder="请输入时薪（元/小时）" 
          class="input"
        />
      </view>
      
      <view class="form-item">
        <text class="label">地点</text>
        <input 
          type="text" 
          v-model="jobForm.address" 
          placeholder="请输入工作地点" 
          class="input"
        />
      </view>
      
      <view class="form-item">
        <text class="label">内容</text>
        <textarea 
          v-model="jobForm.content" 
          placeholder="请输入工作内容" 
          class="textarea"
        />
      </view>
      
      <view class="form-item">
        <text class="label">要求</text>
        <textarea 
          v-model="jobForm.requirement" 
          placeholder="请输入工作要求" 
          class="textarea"
        />
      </view>
      
      <button class="btn-publish" @click="handlePublish">发布招聘</button>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import request from '@/utils/request'

export default {
  setup() {
    const jobForm = ref({
      title: '',
      salary: '',
      address: '',
      content: '',
      requirement: ''
    })
    
    // 发布招聘
    const handlePublish = () => {
      // 表单验证
      if (!jobForm.value.title) {
        uni.showToast({
          title: '请输入标题',
          icon: 'none'
        })
        return
      }
      if (!jobForm.value.salary) {
        uni.showToast({
          title: '请输入工资',
          icon: 'none'
        })
        return
      }
      if (!jobForm.value.address) {
        uni.showToast({
          title: '请输入地点',
          icon: 'none'
        })
        return
      }
      if (!jobForm.value.content) {
        uni.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return
      }
      if (!jobForm.value.requirement) {
        uni.showToast({
          title: '请输入要求',
          icon: 'none'
        })
        return
      }
      
      // 获取发布者信息
      const userInfo = uni.getStorageSync('user')
      if (!userInfo) {
        uni.redirectTo({
          url: '/pages/login'
        })
        return
      }
      
      // 提交表单
      request.post('/api/publishJob', {
        ...jobForm.value,
        publisherId: userInfo.id,
        status: 1
      }).then(res => {
        if (res.code === 0) {
          uni.showToast({
            title: '发布成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      })
    }
    
    return {
      jobForm,
      handlePublish
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

.form {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.input {
  width: 100%;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.textarea {
  width: 100%;
  height: 200rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.btn-publish {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #007AFF;
  color: #fff;
  font-size: 32rpx;
  border-radius: 8rpx;
  margin-top: 40rpx;
}
</style> 