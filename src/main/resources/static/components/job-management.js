Vue.component('job-management', {
    template: `
        <div>
            <div class="d-flex align-items-center mb-4">
                <h4 class="card-title">工作信息管理</h4>
            </div>
            
            <div class="table-responsive">
                <table id="job-table" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>标题</th>
                            <th>发布者</th>
                            <th>工资(元/小时)</th>
                            <th>工作地点</th>
                            <th>状态</th>
                            <th>发布时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="job in jobList" :key="job.id">
                            <td>{{job.id}}</td>
                            <td>{{job.title}}</td>
                            <td>{{job.publisherName}}</td>
                            <td>{{job.salary}}</td>
                            <td>{{job.address}}</td>
                            <td>
                                <span :class="{'badge badge-success': job.status === 1, 'badge badge-danger': job.status === 2}">
                                    {{job.status === 1 ? '招聘中' : '已结束'}}
                                </span>
                            </td>
                            <td>{{job.createTime}}</td>
                            <td>
                                <button class="btn btn-sm btn-info mr-2" @click="showApplyList(job.id)">
                                    查看申请
                                </button>
                                <button class="btn btn-sm btn-danger" @click="handleDelete(job.id)">
                                    删除
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 申请列表模态框 -->
            <div class="modal fade" id="applyModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">申请列表</h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>学生姓名</th>
                                        <th>状态</th>
                                        <th>申请时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="apply in applyList" :key="apply.id">
                                        <td>{{apply.id}}</td>
                                        <td>{{apply.studentName}}</td>
                                        <td>
                                            <span :class="getApplyStatusClass(apply.status)">
                                                {{applyStatusText[apply.status]}}
                                            </span>
                                        </td>
                                        <td>{{apply.createTime}}</td>
                                        <td>
                                            <template v-if="apply.status === 0">
                                                <button class="btn btn-sm btn-success mr-2" 
                                                    @click="handleApplyStatus(apply.id, 1)">
                                                    通过
                                                </button>
                                                <button class="btn btn-sm btn-danger" 
                                                    @click="handleApplyStatus(apply.id, 2)">
                                                    拒绝
                                                </button>
                                            </template>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            jobList: [],
            applyList: [],
            applyStatusText: ['待审核', '已通过', '已拒绝']
        }
    },
    mounted() {
        this.getJobList()
    },
    methods: {
        getJobList() {
            axios.get('/api/getJobList').then(res => {
                if (res.data.code === 0) {
                    this.jobList = res.data.data
                    this.$nextTick(() => {
                        this.initTable('job-table')
                    })
                }
            })
        },
        handleDelete(id) {
            if (confirm('确定要删除该工作信息吗？')) {
                axios.post('/api/deleteJob', null, {
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        toastr.success('删除成功')
                        this.getJobList()
                    } else {
                        toastr.error(res.data.msg)
                    }
                })
            }
        },
        showApplyList(jobId) {
            axios.get('/api/getApplyList', {
                params: {
                    jobId: jobId
                }
            }).then(res => {
                if (res.data.code === 0) {
                    this.applyList = res.data.data
                    $('#applyModal').modal('show')
                }
            })
        },
        handleApplyStatus(id, status) {
            const statusText = status === 1 ? '通过' : '拒绝'
            if (confirm('确定要' + statusText + '该申请吗？')) {
                axios.post('/api/updateApplyStatus', null, {
                    params: {
                        id: id,
                        status: status
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        toastr.success('操作成功')
                        // 刷新申请列表
                        this.showApplyList(this.applyList[0].jobId)
                    } else {
                        toastr.error(res.data.msg)
                    }
                })
            }
        },
        getApplyStatusClass(status) {
            const classes = ['badge badge-warning', 'badge badge-success', 'badge badge-danger']
            return classes[status]
        },
        initTable(id) {
            if ($.fn.DataTable.isDataTable('#' + id)) {
                $('#' + id).DataTable().destroy()
            }
            setTimeout(() => {
                $('#' + id).DataTable({
                    language: {
                        "search": "搜索：",
                        "lengthMenu": "显示 _MENU_ 条记录",
                        "info": "显示第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条",
                        "paginate": {
                            "first": "首页",
                            "last": "末页",
                            "next": "下一页",
                            "previous": "上一页"
                        }
                    },
                    retrieve: true
                })
            }, 300)
        }
    }
}) 