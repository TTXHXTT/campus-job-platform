Vue.component('user-management', {
    template: `
        <div>
            <div class="d-flex align-items-center mb-4">
                <h4 class="card-title">用户管理</h4>
            </div>
            
            <div class="table-responsive">
                <table id="user-table" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>用户名</th>
                            <th>姓名</th>
                            <th>手机号</th>
                            <th>用户类型</th>
                            <th>状态</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in userList" :key="user.id">
                            <td>{{user.id}}</td>
                            <td>{{user.username}}</td>
                            <td>{{user.name}}</td>
                            <td>{{user.phone}}</td>
                            <td>{{userTypes[user.type - 1]}}</td>
                            <td>
                                <span :class="getStatusClass(user.status)">
                                    {{statusText[user.status]}}
                                </span>
                            </td>
                            <td>{{user.createTime}}</td>
                            <td>
                                <template v-if="user.type === 2">
                                    <button v-if="user.status === 0" 
                                        class="btn btn-sm btn-primary mr-2"
                                        @click="handleUpdateStatus(user.id, 1)">
                                        通过审核
                                    </button>
                                    <button v-if="user.status === 0" 
                                        class="btn btn-sm btn-danger mr-2"
                                        @click="handleUpdateStatus(user.id, 2)">
                                        拒绝审核
                                    </button>
                                </template>
                                <button v-if="user.status === 1" 
                                    class="btn btn-sm btn-warning"
                                    @click="handleUpdateStatus(user.id, 2)">
                                    禁用
                                </button>
                                <button v-if="user.status === 2" 
                                    class="btn btn-sm btn-success"
                                    @click="handleUpdateStatus(user.id, 1)">
                                    启用
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data: function() {
        return {
            userList: [],
            userTypes: ['学生', '发布者', '管理员'],
            statusText: ['待审核', '正常', '已禁用']
        }
    },
    mounted: function() {
        this.getUserList()
    },
    methods: {
        getUserList: function() {
            axios.get('/api/getUserList', {
                params: {
                    type: null
                }
            }).then(res => {
                if (res.data.code === 0) {
                    this.userList = res.data.data
                    this.$nextTick(() => {
                        this.initTable('user-table')
                    })
                }
            })
        },
        getStatusClass: function(status) {
            const classes = ['badge badge-warning', 'badge badge-success', 'badge badge-danger']
            return classes[status]
        },
        handleUpdateStatus: function(id, status) {
            const statusText = status === 1 ? '启用' : '禁用'
            const confirmText = status === 1 ? '确定要通过该用户的审核吗？' : '确定要禁用该用户吗？'
            
            if (confirm(confirmText)) {
                axios.post('/api/updateUserStatus', null, {
                    params: {
                        id: id,
                        status: status
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        toastr.success('操作成功')
                        this.getUserList()
                    } else {
                        toastr.error(res.data.msg)
                    }
                })
            }
        }
    }
}) 