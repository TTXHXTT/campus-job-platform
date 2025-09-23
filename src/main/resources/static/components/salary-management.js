Vue.component('salary-management', {
    template: `
        <div>
            <div class="d-flex align-items-center mb-4">
                <h4 class="card-title">工资结算管理</h4>
            </div>
            
            <div class="table-responsive">
                <table id="salary-table" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>工作标题</th>
                            <th>学生姓名</th>
                            <th>金额(元)</th>
                            <th>状态</th>
                            <th>申请时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="salary in salaryList" :key="salary.id">
                            <td>{{salary.id}}</td>
                            <td>{{salary.jobTitle}}</td>
                            <td>{{salary.studentName}}</td>
                            <td>{{salary.amount}}</td>
                            <td>
                                <span :class="getStatusClass(salary.status)">
                                    {{statusText[salary.status]}}
                                </span>
                            </td>
                            <td>{{salary.createTime}}</td>
                            <td>
                                <template v-if="salary.status === 0">
                                    <button class="btn btn-sm btn-success mr-2" 
                                        @click="handleUpdateStatus(salary.id, 1)">
                                        通过
                                    </button>
                                    <button class="btn btn-sm btn-danger" 
                                        @click="handleUpdateStatus(salary.id, 2)">
                                        拒绝
                                    </button>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data() {
        return {
            salaryList: [],
            statusText: ['待审核', '已通过', '已拒绝']
        }
    },
    mounted() {
        this.getSalaryList()
    },
    methods: {
        getSalaryList() {
            axios.get('/api/getSalaryList').then(res => {
                if (res.data.code === 0) {
                    this.salaryList = res.data.data
                    this.$nextTick(() => {
                        this.initTable('salary-table')
                    })
                }
            })
        },
        handleUpdateStatus(id, status) {
            const statusText = status === 1 ? '通过' : '拒绝'
            if (confirm('确定要' + statusText + '该工资申请吗？')) {
                axios.post('/api/updateSalaryStatus', {
                    id: id,
                    status: status
                }).then(res => {
                    if (res.data.code === 0) {
                        toastr.success('操作成功')
                        this.getSalaryList()
                    } else {
                        toastr.error(res.data.msg)
                    }
                })
            }
        },
        getStatusClass(status) {
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