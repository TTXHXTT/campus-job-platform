Vue.component('student-management', {
    template: 
        '<div>' +
            '<div class="d-flex align-items-center mb-4">' +
                '<h4 class="card-title">学生管理</h4>' +
            '</div>' +
            
            '<div class="table-responsive">' +
                '<table id="student-table" class="table table-striped table-bordered">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>ID</th>' +
                            '<th>用户名</th>' +
                            '<th>姓名</th>' +
                            '<th>手机号</th>' +
                            '<th>状态</th>' +
                            '<th>创建时间</th>' +
                            '<th>操作</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        '<tr v-for="student in studentList" :key="student.id">' +
                            '<td>{{student.id}}</td>' +
                            '<td>{{student.username}}</td>' +
                            '<td>{{student.name}}</td>' +
                            '<td>{{student.phone}}</td>' +
                            '<td>' +
                                '<span :class="getStatusClass(student.status)">' +
                                    '{{statusText[student.status]}}' +
                                '</span>' +
                            '</td>' +
                            '<td>{{student.createTime}}</td>' +
                            '<td>' +
                                '<button v-if="student.status === 1" ' +
                                    'class="btn btn-sm btn-warning"' +
                                    '@click="handleUpdateStatus(student.id, 2)">' +
                                    '禁用' +
                                '</button>' +
                                '<button v-if="student.status === 2" ' +
                                    'class="btn btn-sm btn-success"' +
                                    '@click="handleUpdateStatus(student.id, 1)">' +
                                    '启用' +
                                '</button>' +
                            '</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
            '</div>' +
        '</div>',
    data() {
        return {
            studentList: [],
            statusText: ['待审核', '正常', '已禁用']
        }
    },
    mounted() {
        this.getStudentList()
    },
    methods: {
        getStudentList() {
            axios.get('/api/getUserList', {
                params: {
                    type: 1 // 学生类型
                }
            }).then(res => {
                if (res.data.code === 0) {
                    this.studentList = res.data.data
                    this.$nextTick(() => {
                        this.initTable('student-table')
                    })
                }
            })
        },
        getStatusClass(status) {
            const classes = ['badge badge-warning', 'badge badge-success', 'badge badge-danger']
            return classes[status]
        },
        handleUpdateStatus(id, status) {
            const statusText = status === 1 ? '启用' : '禁用'
            const confirmText = '确定要' + statusText + '该学生吗？'
            
            if (confirm(confirmText)) {
                axios.post('/api/updateUserStatus', null, {
                    params: {
                        id: id,
                        status: status
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        toastr.success('操作成功')
                        this.getStudentList()
                    } else {
                        toastr.error(res.data.msg)
                    }
                })
            }
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