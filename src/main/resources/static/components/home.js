Vue.component('home-component', {
    template: `
        <div>
            <!-- 统计卡片 -->
            <div class="row">
                <div class="col-xl-3 col-lg-6 col-sm-6">
                    <div class="widget-stat card">
                        <div class="card-body p-4">
                            <div class="media ai-icon">
                                <span class="mr-3 bgl-primary text-primary">
                                    <i class="flaticon-381-user"></i>
                                </span>
                                <div class="media-body">
                                    <h3 class="mb-0 text-black"><span class="counter ml-0">{{stats.studentCount}}</span></h3>
                                    <p class="mb-0">注册学生数量</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-6 col-sm-6">
                    <div class="widget-stat card">
                        <div class="card-body p-4">
                            <div class="media ai-icon">
                                <span class="mr-3 bgl-warning text-warning">
                                    <i class="flaticon-381-notepad"></i>
                                </span>
                                <div class="media-body">
                                    <h3 class="mb-0 text-black"><span class="counter ml-0">{{stats.publisherCount}}</span></h3>
                                    <p class="mb-0">注册发布者数量</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-6 col-sm-6">
                    <div class="widget-stat card">
                        <div class="card-body p-4">
                            <div class="media ai-icon">
                                <span class="mr-3 bgl-success text-success">
                                    <i class="flaticon-381-briefcase"></i>
                                </span>
                                <div class="media-body">
                                    <h3 class="mb-0 text-black"><span class="counter ml-0">{{stats.jobCount}}</span></h3>
                                    <p class="mb-0">招聘信息数量</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-6 col-sm-6">
                    <div class="widget-stat card">
                        <div class="card-body p-4">
                            <div class="media ai-icon">
                                <span class="mr-3 bgl-danger text-danger">
                                    <i class="flaticon-381-calendar"></i>
                                </span>
                                <div class="media-body">
                                    <h3 class="mb-0 text-black"><span class="counter ml-0">{{stats.todayCheckinCount}}</span></h3>
                                    <p class="mb-0">今日签到数量</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 最新招聘信息 -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">最新招聘信息</h4>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>标题</th>
                                            <th>发布者</th>
                                            <th>工资</th>
                                            <th>工作地点</th>
                                            <th>状态</th>
                                            <th>发布时间</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="job in latestJobs" :key="job.id">
                                            <td>{{job.title}}</td>
                                            <td>{{job.publisherName}}</td>
                                            <td>{{job.salary}}元/小时</td>
                                            <td>{{job.address}}</td>
                                            <td>
                                                <span :class="{'badge badge-success': job.status === 1, 'badge badge-danger': job.status === 2}">
                                                    {{job.status === 1 ? '招聘中' : '已结束'}}
                                                </span>
                                            </td>
                                            <td>{{job.createTime}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            stats: {
                studentCount: 0,
                publisherCount: 0,
                jobCount: 0,
                todayCheckinCount: 0
            },
            latestJobs: []
        }
    },
    mounted: function() {
        this.getStats()
        this.getLatestJobs()
    },
    methods: {
        getStats: function() {
            axios.get('/api/getStats').then(res => {
                if (res.data.code === 0) {
                    this.stats = res.data.data
                }
            })
        },
        getLatestJobs: function() {
            axios.get('/api/getLatestJobs').then(res => {
                if (res.data.code === 0) {
                    this.latestJobs = res.data.data
                }
            })
        }
    }
}) 