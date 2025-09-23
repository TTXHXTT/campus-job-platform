<!-- components/CustomTabBar.vue -->
<template>
    <view class="custom-tab-bar">
        <view 
            class="tab-item" 
            v-for="(item, index) in filteredTabList" 
            :key="index"
            @click="switchTab(item.pagePath)"
            :class="{ active: current === getTabIndex(index) }"
        >
            <uni-icons 
                :type="getIconType(getTabIndex(index))" 
                :color="current === getTabIndex(index) ? '#007AFF' : '#999'" 
                size="20"
            ></uni-icons>
            <text class="tab-text">{{item.text}}</text>
        </view>
    </view>
</template>

<script>
import { ref, computed } from 'vue'

export default {
    name: 'CustomTabBar',
    props: {
        current: {
            type: Number,
            default: 0
        }
    },
    setup() {
        const userInfo = ref({})
        
        // 获取用户信息
        const getUserInfo = () => {
            const user = uni.getStorageSync('user')
            if (user) {
                userInfo.value = user
            }
        }
        
        const allTabList = [
            {
                pagePath: '/pages/index/index',
                text: '首页'
            },
            {
                pagePath: '/pages/job/index',
                text: '招聘'
            },
            {
                pagePath: '/pages/checkin/index',
                text: '签到',
                showFor: [1] // 只对学生显示
            },
            {
                pagePath: '/pages/user/index',
                text: '我的'
            }
        ]
        
        // 根据用户类型过滤 tabbar 项目
        const filteredTabList = computed(() => {
            return allTabList.filter(tab => {
                if (!tab.showFor) return true // 如果没有指定 showFor，则所有用户都显示
                return tab.showFor.includes(userInfo.value.type)
            })
        })
        
        // 获取实际的 tab 索引
        const getTabIndex = (visibleIndex) => {
            let realIndex = 0
            let count = 0
            
            for (let i = 0; i < allTabList.length; i++) {
                if (!allTabList[i].showFor || allTabList[i].showFor.includes(userInfo.value.type)) {
                    if (count === visibleIndex) {
                        realIndex = i
                        break
                    }
                    count++
                }
            }
            
            return realIndex
        }

        const switchTab = (path) => {
            uni.switchTab({
                url: path
            })
        }

        const getIconType = (index) => {
            const types = ['home', 'bars', 'calendar', 'person']
            return types[index]
        }
        
        // 初始化时获取用户信息
        getUserInfo()

        return {
            filteredTabList,
            switchTab,
            getIconType,
            getTabIndex
        }
    }
}
</script>

<style scoped>
    .custom-tab-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100rpx;
        background: #fff;
        display: flex;
        padding-bottom: env(safe-area-inset-bottom);
        box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
        z-index: 999;
    }

    .tab-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        position: relative;
    }

    .tab-text {
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
    }

    .tab-item.active .tab-text {
        color: #007AFF;
    }

    .tab-item .uni-icons {
        display: block;
    }
</style>