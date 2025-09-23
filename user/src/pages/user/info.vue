<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">头像</text>
        <view class="avatar-wrapper" @click="chooseImage">
          <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
          <view class="avatar-mask">
            <uni-icons type="camera" size="20" color="#fff"></uni-icons>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="label">用户名</text>
        <input type="text" v-model="userInfo.username" disabled class="input" />
      </view>
      
      <view class="form-item">
        <text class="label">姓名</text>
        <input type="text" v-model="userInfo.name" placeholder="请输入姓名" class="input" />
      </view>
      
      <view class="form-item">
        <text class="label">手机号</text>
        <input type="text" v-model="userInfo.phone" placeholder="请输入手机号" class="input" />
      </view>
      
      <view class="form-item">
        <text class="label">用户类型</text>
        <text class="input">{{userTypes[userInfo.type - 1]}}</text>
      </view>
      
      <button class="btn-save" @click="handleSave">保存修改</button>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

export default {
  setup() {
    const userInfo = ref({})
    const userTypes = ['学生', '发布者', '管理员']
    
    // 获取用户信息
    const getUserInfo = () => {
      const user = uni.getStorageSync('user')
      if (user) {
        userInfo.value = { ...user }
      } else {
        uni.redirectTo({
          url: '/pages/login'
        })
      }
    }
    
    // 选择头像
    const chooseImage = () => {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          // #ifdef H5
          // H5环境下使用FileReader读取文件
          const file = res.tempFiles[0]
          const reader = new FileReader()
          reader.onload = (e) => {
            userInfo.value.avatar = e.target.result
          }
          reader.readAsDataURL(file)
          // #endif
          
          // #ifdef MP-WEIXIN
          // 小程序环境下直接使用临时文件路径
          userInfo.value.avatar = res.tempFilePaths[0]
          // #endif
          
          // 更新用户信息
          request.post('/api/updateUserInfo', userInfo.value).then(res => {
            if (res.code === 0) {
              uni.showToast({
                title: '更新成功',
                icon: 'success'
              })
              // 更新本地存储的用户信息
              uni.setStorageSync('user', userInfo.value)
            }
          })
        }
      })
    }
    
    // 保存修改
    const handleSave = () => {
      if (!userInfo.value.name || !userInfo.value.phone) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }
      
      request.post('/api/updateUserInfo', userInfo.value).then(res => {
        if (res.code === 0) {
          uni.setStorageSync('user', userInfo.value)
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
      })
    }
    
    onMounted(() => {
      getUserInfo()
    })
    
    return {
      userInfo,
      userTypes,
      chooseImage,
      handleSave
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
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  width: 140rpx;
  font-size: 28rpx;
  color: #333;
}

.input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.avatar-wrapper {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  overflow: hidden;
  position: relative;
}

.avatar {
  width: 100%;
  height: 100%;
}

.avatar-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-save {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #007AFF;
  color: #fff;
  font-size: 32rpx;
  border-radius: 10rpx;
  margin-top: 60rpx;
}
</style> 