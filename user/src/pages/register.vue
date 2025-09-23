<template>
  <view class="container">
    <view class="header">
      <text class="title">用户注册</text>
      <text class="subtitle">加入我们，开启你的勤工之旅</text>
    </view>
    
    <view class="form">
      <view class="avatar-upload" @click="chooseImage">
        <template v-if="avatar">
          <image class="avatar" :src="avatar" mode="aspectFill"></image>
        </template>
        <template v-else>
          <view class="default-avatar">
            <uni-icons type="person-filled" size="60" color="#bbb"></uni-icons>
          </view>
        </template>
        <view class="avatar-mask">
          <uni-icons type="camera-filled" size="20" color="#fff"></uni-icons>
          <text>点击更换头像</text>
        </view>
      </view>

      <view class="input-group">
        <input type="text" v-model="username" placeholder="请输入用户名" />
        <uni-icons type="person" size="24" color="#999"></uni-icons>
      </view>
      <view class="input-group">
        <input type="password" v-model="password" placeholder="请输入密码" />
        <uni-icons type="locked" size="24" color="#999"></uni-icons>
      </view>
      <view class="input-group">
        <input type="password" v-model="confirmPassword" placeholder="请再次输入密码" />
        <uni-icons type="locked" size="24" color="#999"></uni-icons>
      </view>
      <view class="input-group">
        <input type="text" v-model="name" placeholder="请输入姓名" />
        <uni-icons type="person-filled" size="24" color="#999"></uni-icons>
      </view>
      <view class="input-group">
        <input type="text" v-model="phone" placeholder="请输入手机号" />
        <uni-icons type="phone" size="24" color="#999"></uni-icons>
      </view>
      <view class="input-group">
        <picker @change="bindPickerChange" :value="typeIndex" :range="types" class="picker-input">
          <text>{{types[typeIndex]}}</text>
          <uni-icons type="bottom" size="24" color="#999"></uni-icons>
        </picker>
        <uni-icons type="staff" size="24" color="#999"></uni-icons>
      </view>
      
      <button class="btn-register" @click="handleRegister">注 册</button>
      
      <view class="login-link">
        <text @click="goLogin">已有账号？立即登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import request from '@/utils/request'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const name = ref('')
    const phone = ref('')
    const typeIndex = ref(0)
    const types = ['学生', '发布者']
    const avatar = ref('')
    
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
            avatar.value = e.target.result
          }
          reader.readAsDataURL(file)
          // #endif
          
          // #ifdef MP-WEIXIN
          // 微信小程序环境下使用wx.getFileSystemManager读取文件
          const tempFilePath = res.tempFilePaths[0]
          wx.getFileSystemManager().readFile({
            filePath: tempFilePath,
            encoding: 'base64',
            success: (res) => {
              avatar.value = 'data:image/jpeg;base64,' + res.data
            },
            fail: (err) => {
              console.error('读取文件失败：', err)
              uni.showToast({
                title: '头像上传失败',
                icon: 'none'
              })
            }
          })
          // #endif
        },
        fail: (err) => {
          console.error('选择图片失败：', err)
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      })
    }
    
    const handleRegister = () => {
      if (!username.value || !password.value || !confirmPassword.value || !name.value || !phone.value) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }
      
      if (password.value !== confirmPassword.value) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        })
        return
      }
      
      request.post('/api/register', {
        username: username.value,
        password: password.value,
        name: name.value,
        phone: phone.value,
        type: parseInt(typeIndex.value) + 1,
        avatar: avatar.value
      }).then(res => {
        if (res.code === 0) {
          uni.showToast({
            title: '注册成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/login'
            })
          }, 1500)
        } else if (res.code === 2) {
          uni.showToast({
            title: '用户名已存在',
            icon: 'none'
          })
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }).catch(err => {
        uni.showToast({
          title: '注册失败',
          icon: 'none'
        })
      })
    }
    
    const bindPickerChange = (e) => {
      typeIndex.value = e.detail.value
    }
    
    const goLogin = () => {
      uni.navigateBack()
    }
    
    return {
      username,
      password,
      confirmPassword,
      name,
      phone,
      typeIndex,
      types,
      avatar,
      handleRegister,
      bindPickerChange,
      goLogin,
      chooseImage
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
  margin-bottom: 60rpx;
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

.btn-register {
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

.login-link {
  text-align: center;
  margin-top: 40rpx;
  font-size: 28rpx;
  color: #007AFF;
}

.avatar-upload {
  width: 180rpx;
  height: 180rpx;
  border-radius: 90rpx;
  margin: 0 auto 60rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  background: #f0f0f0;
  border: 4rpx solid #fff;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 70rpx;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(70rpx);
  transition: transform 0.3s ease;
}

.avatar-upload:hover .avatar-mask,
.avatar-upload:active .avatar-mask {
  transform: translateY(0);
}

.avatar-mask text {
  font-size: 22rpx;
  color: #fff;
  margin-top: 4rpx;
}

.default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #f0f0f0, #fafafa);
}

.default-avatar .uni-icons {
  opacity: 0.7;
}
</style> 