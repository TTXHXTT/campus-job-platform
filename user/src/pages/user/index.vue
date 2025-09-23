<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-wrapper">
        <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
      </view>
      <view class="user-info">
        <text class="username">{{userInfo.name}}</text>
        <text class="user-type">{{userTypes[userInfo.type - 1]}}</text>
      </view>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-list">
      <!-- 学生菜单 -->
      <block v-if="userInfo.type === 1">
        <view class="menu-item" @click="goToList('apply')">
          <view class="menu-icon">
            <uni-icons type="flag" size="24" color="#007AFF"></uni-icons>
          </view>
          <text class="menu-text">我的报名</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
        <view class="menu-item" @click="goToList('checkin')">
          <view class="menu-icon">
            <uni-icons type="calendar" size="24" color="#007AFF"></uni-icons>
          </view>
          <text class="menu-text">我的签到</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
        <view class="menu-item" @click="goToList('salary')">
          <view class="menu-icon">
            <uni-icons type="wallet" size="24" color="#007AFF"></uni-icons>
          </view>
          <text class="menu-text">我的工资</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
      </block>
      
      <!-- 发布者菜单 -->
      <block v-if="userInfo.type === 2">
        <view class="menu-item" @click="goToList('apply')">
          <view class="menu-icon">
            <uni-icons type="personadd" size="24" color="#007AFF"></uni-icons>
          </view>
          <text class="menu-text">报名管理</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
        <view class="menu-item" @click="goToList('salary')">
          <view class="menu-icon">
            <uni-icons type="wallet" size="24" color="#007AFF"></uni-icons>
          </view>
          <text class="menu-text">工资管理</text>
          <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
      </block>
      
      <!-- 通用菜单 -->
      <view class="menu-item" @click="goToUserInfo">
        <view class="menu-icon">
          <uni-icons type="person" size="24" color="#007AFF"></uni-icons>
        </view>
        <text class="menu-text">个人资料</text>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
      <view class="menu-item" @click="handleLogout">
        <view class="menu-icon">
          <uni-icons type="poweroff" size="24" color="#ff6b6b"></uni-icons>
        </view>
        <text class="menu-text logout-text">退出登录</text>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
    </view>

    <CustomTabBar :current="3"></CustomTabBar>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  setup() {
    const userInfo = ref({})
    const userTypes = ['学生', '发布者', '管理员']
    
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
    
    // 跳转到列表页
    const goToList = (type) => {
      if (type === 'apply') {
        uni.navigateTo({
          url: '/pages/apply/list'
        })
      } else if (type === 'checkin') {
        uni.navigateTo({
          url: '/pages/checkin/list'
        })
      } else if (type === 'salary') {
        uni.navigateTo({
          url: '/pages/salary/list'
        })
      }
    }
    
    // 跳转到个人资料
    const goToUserInfo = () => {
      uni.navigateTo({
        url: '/pages/user/info'
      })
    }
    
    // 退出登录
    const handleLogout = () => {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.clearStorageSync()
            uni.reLaunch({
              url: '/pages/login'
            })
          }
        }
      })
    }
    
    onMounted(() => {
      getUserInfo()
    })
    
    return {
      userInfo,
      userTypes,
      goToList,
      goToUserInfo,
      handleLogout
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.user-card {
  background: linear-gradient(135deg, #007AFF 0%, #1CB5E0 100%);
  padding: 40rpx;
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  overflow: hidden;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.avatar {
  width: 100%;
  height: 100%;
}

.user-info {
  margin-left: 30rpx;
}

.username {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.user-type {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.menu-list {
  background: #fff;
  margin-top: 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.logout-text {
  color: #ff6b6b;
}
</style> 