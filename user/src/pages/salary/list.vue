<template>
  <view class="container">
    <view class="salary-list">
      <!-- 页面标题 -->
      <view class="page-header">
        <text class="page-title">{{userInfo.type === 2 ? '工资管理' : '我的工资'}}</text>
      </view>

      <!-- 工资列表 -->
      <view class="salary-item" v-for="(salary, index) in salaryList" :key="index">
        <view class="job-info">
          <text class="job-title">{{salary.jobTitle}}</text>
          <text class="salary-amount">￥{{salary.amount}}</text>
        </view>
        
        <view class="salary-info">
          <!-- 发布者看学生名字，学生看发布者名字 -->
          <view class="info-item">
            <uni-icons type="staff" size="14" color="#999"></uni-icons>
            <text>{{userInfo.type === 2 ? salary.studentName : salary.publisherName}}</text>
          </view>
          <view class="info-item">
            <uni-icons type="calendar" size="14" color="#999"></uni-icons>
            <text>{{salary.createTime}}</text>
          </view>
        </view>
        
        <view class="status-bar">
          <text class="salary-status" :class="getStatusClass(salary.status)">
            {{statusText[salary.status]}}
          </text>
          <!-- 发布者显示审核按钮 -->
          <template v-if="userInfo.type === 2 && salary.status === 0">
            <button class="btn-approve" @click="handleApprove(salary, 1)">通过</button>
            <button class="btn-reject" @click="handleApprove(salary, 2)">拒绝</button>
          </template>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty" v-if="salaryList.length === 0">
        <image src="/static/empty.png" mode="aspectFit" class="empty-image"></image>
        <text>暂无{{userInfo.type === 2 ? '工资审核' : '工资'}}记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

export default {
  setup() {
    const salaryList = ref([])
    const userInfo = ref({})
    const statusText = ['待审核', '已通过', '已拒绝']
    
    // 获取用户信息
    const getUserInfo = () => {
      const user = uni.getStorageSync('user')
      if (user) {
        userInfo.value = user
      }
    }
    
    // 获取工资列表
    const getSalaryList = () => {
      const params = {}
      if (userInfo.value.type === 2) {
        // 发布者使用新接口直接获取所有工作的工资记录
        request.get('/api/getPublisherSalaryList', { publisherId: userInfo.value.id }).then(res => {
          if (res.code === 0) {
            salaryList.value = res.data
          }
        })
      } else {
        // 学生查看自己的工资记录
        params.studentId = userInfo.value.id
        request.get('/api/getSalaryList', params).then(res => {
          if (res.code === 0) {
            salaryList.value = res.data
          }
        })
      }
    }
    
    // 处理工资审核
    const handleApprove = (salary, status) => {
      const statusText = status === 1 ? '通过' : '拒绝'
      uni.showModal({
        title: '提示',
        content: `确定要${statusText}该工资申请吗？`,
        success: (res) => {
          if (res.confirm) {
            request.post('/api/updateSalaryStatus', {
              id: salary.id,
              status: status
            }).then(res => {
              if (res.code === 0) {
                uni.showToast({
                  title: '操作成功',
                  icon: 'success'
                })
                getSalaryList()
              }
            })
          }
        }
      })
    }
    
    // 获取状态样式类
    const getStatusClass = (status) => {
      const classes = ['status-pending', 'status-approved', 'status-rejected']
      return classes[status]
    }
    
    onMounted(() => {
      getUserInfo()
      getSalaryList()
      // 获取用户信息后设置标题
      const user = uni.getStorageSync('user')
      if (user) {
        uni.setNavigationBarTitle({
          title: user.type === 2 ? '工资管理' : '我的工资'
        })
      }
    })
    
    return {
      salaryList,
      userInfo,
      statusText,
      handleApprove,
      getStatusClass
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

.page-header {
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.page-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.salary-list {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.salary-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.salary-item:last-child {
  border-bottom: none;
}

.job-info {
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

.salary-amount {
  font-size: 32rpx;
  color: #f56c6c;
  font-weight: bold;
}

.salary-info {
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #666;
}

.info-item .uni-icons {
  margin-right: 10rpx;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.salary-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.status-pending {
  background: #e6a23c;
  color: #fff;
}

.status-approved {
  background: #67c23a;
  color: #fff;
}

.status-rejected {
  background: #f56c6c;
  color: #fff;
}

.btn-approve, .btn-reject {
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 30rpx;
  margin-left: 20rpx;
}

.btn-approve {
  background: #67c23a;
  color: #fff;
}

.btn-reject {
  background: #f56c6c;
  color: #fff;
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