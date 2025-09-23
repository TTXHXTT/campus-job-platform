Vue.component('publisher-management', {
    template: 
        '<div>' +
            '<div class="d-flex align-items-center mb-4">' +
                '<h4 class="card-title">发布者管理</h4>' +
            '</div>' +
            
            '<div class="table-responsive">' +
                '<table id="publisher-table" class="table table-striped table-bordered">' +
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
                        '<tr v-for="publisher in publisherList" :key="publisher.id">' +
                            '<td>{{publisher.id}}</td>' +
                            '<td>{{publisher.username}}</td>' +
                            '<td>{{publisher.name}}</td>' +
                            '<td>{{publisher.phone}}</td>' +
                            '<td>' +
                                '<span :class="getStatusClass(publisher.status)">' +
                                    '{{statusText[publisher.status]}}' +
                                '</span>' +
                            '</td>' +
                            '<td>{{publisher.createTime}}</td>' +
                            '<td>' +
                                '<button v-if="publisher.status === 0" ' +
                                    'class="btn btn-sm btn-success me-2"' +
                                    '@click="handleUpdateStatus(publisher.id, 1)">' +
                                    '通过' +
                                '</button>' +
                                '<button v-if="publisher.status === 0" ' +
                                    'class="btn btn-sm btn-danger me-2"' +
                                    '@click="handleUpdateStatus(publisher.id, 3)">' +
                                    '拒绝' +
                                '</button>' +
                                '<button v-if="publisher.status === 1" ' +
                                    'class="btn btn-sm btn-warning"' +
                                    '@click="handleUpdateStatus(publisher.id, 2)">' +
                                    '禁用' +
                                '</button>' +
                                '<button v-if="publisher.status === 2" ' +
                                    'class="btn btn-sm btn-success"' +
                                    '@click="handleUpdateStatus(publisher.id, 1)">' +
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
            publisherList: [],
            statusText: ['待审核', '正常', '已禁用', '已拒绝']
        }
    },
    mounted() {
        this.getPublisherList()
    },
    methods: {
        getPublisherList() {
            axios.get('/api/getUserList', {
                params: {
                    type: 2 // 发布者类型
                }
            }).then(res => {
                if (res.data.code === 0) {
                    this.publisherList = res.data.data
                    this.$nextTick(() => {
                        this.initTable('publisher-table')
                    })
                }
            })
        },
        getStatusClass(status) {
            const classes = ['badge badge-warning', 'badge badge-success', 'badge badge-danger', 'badge badge-danger']
            return classes[status]
        },
        handleUpdateStatus(id, status) {
            let statusText = ''
            switch(status) {
                case 1:
                    statusText = this.statusText[0] === '待审核' ? '通过' : '启用'
                    break
                case 2:
                    statusText = '禁用'
                    break
                case 3:
                    statusText = '拒绝'
                    break
            }
            const confirmText = '确定要' + statusText + '该发布者吗？'
            
            if (confirm(confirmText)) {
                axios.post('/api/updateUserStatus', null, {
                    params: {
                        id: id,
                        status: status
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        toastr.success('操作成功')
                        this.getPublisherList()
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