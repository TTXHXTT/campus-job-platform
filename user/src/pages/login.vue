<template>
  <view class="container">
    <view class="header">
      <text class="title">校园兼职微信小程序</text>
      <text class="subtitle">让每一份努力都有收获</text>
    </view>
    
    <view class="form">
      <view class="input-group">
        <input type="text" v-model="username" placeholder="请输入用户名" />
        <uni-icons type="person" size="24" color="#999"></uni-icons>
      </view>
      <view class="input-group">
        <input type="password" v-model="password" placeholder="请输入密码" />
        <uni-icons type="locked" size="24" color="#999"></uni-icons>
      </view>
      <view class="input-group">
        <picker @change="bindPickerChange" :value="typeIndex" :range="types" class="picker-input">
          <text>{{types[typeIndex]}}</text>
          <uni-icons type="bottom" size="24" color="#999"></uni-icons>
        </picker>
        <uni-icons type="staff" size="24" color="#999"></uni-icons>
      </view>
      
      <button class="btn-login" @click="handleLogin">登 录</button>
      
      <view class="register-link">
        <text @click="goRegister">还没有账号？立即注册</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import request from '@/utils/request'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const typeIndex = ref(0)
    const types = ['学生', '发布者']
    
    const handleLogin = () => {
      if (!username.value || !password.value) {
        uni.showToast({
          title: '请输入用户名和密码',
          icon: 'none'
        })
        return
      }
      
      request.post('/api/login', {
        username: username.value,
        password: password.value,
        type: typeIndex.value + 1
      }).then(res => {
        if (res.code === 0) {
          uni.setStorageSync('user', res.data)
          uni.reLaunch({
            url: '/pages/index/index'
          })
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }).catch(err => {
        uni.showToast({
          title: '登录失败',
          icon: 'none'
        })
      })
    }
    
    const bindPickerChange = (e) => {
      typeIndex.value = e.detail.value
    }
    
    const goRegister = () => {
      uni.navigateTo({
        url: '/pages/register'
      })
    }
    
    return {
      username,
      password,
      typeIndex,
      types,
      handleLogin,
      bindPickerChange,
      goRegister
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #007AFF 0%, #1CB5E0 100%);
  padding: 60rpx 40rpx;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 100rpx;
  color: #fff;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
}

.subtitle {
  font-size: 28rpx;
  opacity: 0.8;
}

.form {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.input-group {
  position: relative;
  margin-bottom: 40rpx;
}

.input-group input {
  width: 100%;
  height: 90rpx;
  background: #f8f8f8;
  border-radius: 45rpx;
  padding: 0 100rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.input-group .uni-icons {
  position: absolute;
  left: 40rpx;
  top: 50%;
  transform: translateY(-50%);
}

.picker-input {
  width: 100%;
  height: 90rpx;
  background: #f8f8f8;
  border-radius: 45rpx;
  padding: 0 100rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-input .uni-icons {
  position: absolute;
  right: 40rpx;
  top: 50%;
  transform: translateY(-50%);
}

.btn-login {
  width: 100%;
  height: 90rpx;
  background: linear-gradient(90deg, #007AFF 0%, #1CB5E0 100%);
  border-radius: 45rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 60rpx;
  box-shadow: 0 10rpx 20rpx rgba(0, 122, 255, 0.2);
}

.register-link {
  text-align: center;
  margin-top: 40rpx;
  font-size: 28rpx;
  color: #007AFF;
}
</style> 