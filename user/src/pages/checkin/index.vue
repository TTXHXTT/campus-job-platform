<template>
  <view class="container">
    <!-- 签到卡片 -->
    <view class="checkin-card">
      <view class="card-header">
        <text class="today-date">{{todayDate}}</text>
        <text class="week-day">{{weekDay}}</text>
      </view>
      <view class="card-body">
        <view class="time-display">
          <text class="time">{{currentTime}}</text>
        </view>
        
        <!-- 当前没有进行中的工作 -->
        <view v-if="!currentWork" class="job-select">
          <view class="section-title">选择要签到的工作</view>
          <view class="job-list">
            <view 
              class="job-item" 
              v-for="(job, index) in availableJobs" 
              :key="index"
              @click="handleCheckin(job)"
            >
              <view class="job-info">
                <text class="job-title">{{job.title}}</text>
                <text class="job-salary">￥{{job.salary}}/小时</text>
              </view>
              <text class="job-address">{{job.address}}</text>
            </view>
          </view>
        </view>
        
        <!-- 当前有进行中的工作 -->
        <view v-else class="current-work">
          <view class="section-title">当前工作</view>
          <view class="work-info">
            <text class="job-title">{{currentWork.title}}</text>
            <text class="job-salary">￥{{currentWork.salary}}/小时</text>
            <text class="job-address">{{currentWork.address}}</text>
            <text class="checkin-time">签到时间：{{currentWork.checkinTime}}</text>
            <text class="duration">已工作：{{workDuration}}</text>
          </view>
          <button class="btn-checkout" @click="handleCheckout">结束工作</button>
        </view>
      </view>
    </view>

    <!-- 签到记录 -->
    <view class="record-section">
      <view class="section-title">
        <text>签到记录</text>
      </view>
      <view class="record-list">
        <view class="record-item" v-for="(record, index) in records" :key="index">
          <view class="record-info">
            <text class="job-name">{{record.jobTitle}}</text>
            <text class="record-date">{{record.createTime}}</text>
          </view>
          <view class="record-time">
            <view class="time-item">
              <text class="label">签到：</text>
              <text class="value">{{record.checkinTime}}</text>
            </view>
            <view class="time-item" v-if="record.checkoutTime">
              <text class="label">签退：</text>
              <text class="value">{{record.checkoutTime}}</text>
            </view>
            <view class="time-item" v-if="record.checkoutTime">
              <text class="label">工资：</text>
              <text class="value salary">￥{{record.salary || '待结算'}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <CustomTabBar :current="2"></CustomTabBar>
  </view>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import request from '@/utils/request'
import CustomTabBar from '@/components/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  setup() {
    const todayDate = ref('')
    const weekDay = ref('')
    const currentTime = ref('')
    const userInfo = ref({})
    const availableJobs = ref([])
    const currentWork = ref(null)
    const records = ref([])
    const timer = ref(null)

    // 计算已工作时长
    const workDuration = computed(() => {
      if (!currentWork.value || !currentWork.value.checkinTime) return '0分钟'
      const start = new Date(currentWork.value.checkinTime).getTime()
      const now = new Date().getTime()
      const duration = Math.floor((now - start) / 1000 / 60) // 转换为分钟
      const hours = Math.floor(duration / 60)
      const minutes = duration % 60
      return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`
    })

    // 获取用户信息
    const getUserInfo = () => {
      const user = uni.getStorageSync('user')
      if (user) {
        userInfo.value = user
      }
    }

    // 更新时间
    const updateTime = () => {
      const now = new Date()
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      todayDate.value = now.toLocaleDateString()
      weekDay.value = days[now.getDay()]
      currentTime.value = now.toLocaleTimeString()
    }

    // 获取可签到的工作列表
    const getAvailableJobs = () => {
      // 先检查是否有进行中的工作
      request.get('/api/getCheckinList', {
        studentId: userInfo.value.id
      }).then(res => {
        if (res.code === 0 && res.data) {
          const ongoing = res.data.find(record => !record.checkoutTime)
          if (ongoing) {
            // 如果有进行中的工作，获取工作详情并显示
            request.get('/api/getJobDetail', { id: ongoing.jobId }).then(res => {
              if (res.code === 0) {
                currentWork.value = {
                  ...res.data,
                  checkinTime: ongoing.checkinTime
                }
              }
            })
            return
          }
          
          // 如果没有进行中的工作，获取可签到的工作列表
          request.get('/api/getApplyList', {
            studentId: userInfo.value.id,
            status: 1 // 只获取已通过的报名
          }).then(res => {
            if (res.code === 0 && res.data) {
              // 获取每个工作的详细信息
              const promises = res.data.map(apply => 
                request.get('/api/getJobDetail', { id: apply.jobId })
              )
              Promise.all(promises).then(results => {
                availableJobs.value = results
                  .filter(res => res.code === 0)
                  .map(res => res.data)
              })
            }
          })
        }
      })
    }

    // 获取签到记录
    const getCheckinRecords = () => {
      request.get('/api/getCheckinList', {
        studentId: userInfo.value.id
      }).then(res => {
        if (res.code === 0) {
          records.value = res.data
        }
      })
    }

    // 签到
    const handleCheckin = (job) => {
      // 检查用户信息是否存在
      if (!userInfo.value || !userInfo.value.id) {
        uni.showToast({
          title: '用户信息获取失败，请重新登录',
          icon: 'none'
        })
        return
      }

      // 检查工作信息是否完整
      if (!job || !job.id) {
        uni.showToast({
          title: '工作信息不完整',
          icon: 'none'
        })
        return
      }

      uni.showModal({
        title: '确认签到',
        content: `确定要开始 ${job.title} 的工作吗？签到后将无法同时进行其他工作。`,
        success: (res) => {
          if (res.confirm) {
            console.log('签到请求参数：', {
              jobId: job.id,
              studentId: userInfo.value.id
            })
            
            request.post('/api/checkin', {
              jobId: job.id,
              studentId: userInfo.value.id
            }).then(res => {
              console.log('签到响应：', res)
              if (res.code === 0) {
                uni.showToast({
                  title: '签到成功',
                  icon: 'success'
                })
                // 重新获取工作状态
                getAvailableJobs()
                getCheckinRecords()
              } else {
                uni.showToast({
                  title: res.msg || '签到失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }).catch(err => {
              console.error('签到请求错误：', err)
              uni.showToast({
                title: '签到请求失败，请重试',
                icon: 'none',
                duration: 2000
              })
            })
          }
        }
      })
    }

    // 签退
    const handleCheckout = () => {
      uni.showModal({
        title: '确认签退',
        content: '确定要结束当前工作吗？系统将自动计算工作时长和工资。',
        success: (res) => {
          if (res.confirm) {
            request.post('/api/checkout', {
              jobId: currentWork.value.id,
              studentId: userInfo.value.id
            }).then(res => {
              if (res.code === 0) {
                uni.showToast({
                  title: '签退成功',
                  icon: 'success'
                })
                currentWork.value = null
                getAvailableJobs()
                getCheckinRecords()
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

    onMounted(() => {
      getUserInfo()
      updateTime()
      timer.value = setInterval(updateTime, 1000)
      getAvailableJobs() // 这个方法现在会处理所有情况
      getCheckinRecords()
    })

    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value)
      }
    })

    return {
      todayDate,
      weekDay,
      currentTime,
      availableJobs,
      currentWork,
      records,
      workDuration,
      handleCheckin,
      handleCheckout
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.checkin-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  margin-bottom: 30rpx;
}

.today-date {
  font-size: 32rpx;
  color: #333;
  margin-right: 20rpx;
}

.week-day {
  font-size: 32rpx;
  color: #666;
}

.card-body {
  text-align: center;
}

.time-display {
  margin-bottom: 30rpx;
}

.time {
  font-size: 60rpx;
  font-weight: bold;
  color: #333;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  text-align: left;
}

.job-list {
  text-align: left;
}

.job-item {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.job-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.job-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.job-salary {
  font-size: 28rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.job-address {
  font-size: 24rpx;
  color: #666;
}

.current-work {
  text-align: left;
}

.work-info {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.checkin-time, .duration {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-top: 10rpx;
}

.btn-checkout {
  width: 100%;
  height: 90rpx;
  background: #ff6b6b;
  color: #fff;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.record-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.record-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.record-item:last-child {
  border-bottom: none;
}

.record-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.record-date {
  font-size: 24rpx;
  color: #999;
}

.record-time {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.time-item {
  display: flex;
  font-size: 24rpx;
}

.time-item .label {
  color: #666;
  width: 80rpx;
}

.time-item .value {
  color: #333;
}

.time-item .salary {
  color: #ff6b6b;
  font-weight: bold;
}
</style> 