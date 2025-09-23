Vue.component('notice-management', {
    template: `
        <div>
            <div class="d-flex align-items-center mb-4">
                <h4 class="card-title">公告管理</h4>
                <button class="btn btn-primary ml-auto" @click="showAddModal">
                    <i class="fa fa-plus"></i> 发布公告
                </button>
            </div>
            
            <div class="table-responsive">
                <table id="notice-table" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>标题</th>
                            <th>内容</th>
                            <th>图片</th>
                            <th>发布时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="notice in noticeList" :key="notice.id">
                            <td>{{notice.id}}</td>
                            <td>{{notice.title}}</td>
                            <td>
                                <div class="notice-content">{{notice.content}}</div>
                            </td>
                            <td>
                                <img v-if="notice.image" :src="notice.image" class="notice-image" @click="previewImage(notice.image)">
                                <span v-else>无</span>
                            </td>
                            <td>{{notice.createTime}}</td>
                            <td>
                                <button class="btn btn-sm btn-danger" @click="handleDelete(notice.id)">
                                    删除
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 添加公告模态框 -->
            <div class="modal fade" id="addModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">发布公告</h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label>标题</label>
                                    <input type="text" class="form-control" v-model="form.title" placeholder="请输入标题">
                                </div>
                                <div class="form-group">
                                    <label>内容</label>
                                    <textarea class="form-control" v-model="form.content" rows="5" placeholder="请输入内容"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>图片</label>
                                    <input type="file" class="form-control" @change="handleImageUpload" accept="image/*">
                                </div>
                                <div v-if="form.image" class="preview-container">
                                    <img :src="form.image" class="preview-image">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-primary" @click="handleSubmit">确定</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 图片预览模态框 -->
            <div class="modal fade" id="imageModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">图片预览</h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body text-center">
                            <img :src="previewImageUrl" class="preview-modal-image">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            noticeList: [],
            form: {
                title: '',
                content: '',
                image: ''
            },
            previewImageUrl: ''
        }
    },
    mounted() {
        this.getNoticeList()
    },
    methods: {
        getNoticeList() {
            axios.get('/api/getNoticeList').then(res => {
                if (res.data.code === 0) {
                    this.noticeList = res.data.data
                    this.$nextTick(() => {
                        if ($.fn.DataTable.isDataTable('#notice-table')) {
                            $('#notice-table').DataTable().destroy()
                        }
                        this.initTable('notice-table')
                    })
                }
            })
        },
        showAddModal() {
            this.form = {
                title: '',
                content: '',
                image: ''
            }
            $('#addModal').modal('show')
        },
        handleImageUpload(e) {
            const file = e.target.files[0]
            if (!file) return
            
            // 检查文件类型
            if (!file.type.startsWith('image/')) {
                toastr.error('请选择图片文件')
                return
            }
            
            // 检查文件大小（限制为2MB）
            if (file.size > 2 * 1024 * 1024) {
                toastr.error('图片大小不能超过2MB')
                return
            }
            
            const reader = new FileReader()
            reader.onload = (e) => {
                this.form.image = e.target.result
            }
            reader.readAsDataURL(file)
        },
        handleSubmit() {
            if (!this.form.title || !this.form.content) {
                toastr.error('请填写完整信息')
                return
            }
            
            const notice = {
                title: this.form.title,
                content: this.form.content,
                image: this.form.image,
                createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
            
            axios.post('/api/notice/insert', notice).then(res => {
                if (res.data.code === 0) {
                    toastr.success('发布成功')
                    // 重置表单
                    this.form = {
                        title: '',
                        content: '',
                        image: ''
                    }
                    // 关闭模态框
                    $('#addModal').modal('hide')
                    // 重新获取列表数据
                    this.getNoticeList()
                } else {
                    toastr.error(res.data.msg)
                }
            })
        },
        handleDelete(id) {
            if (confirm('确定要删除该公告吗？')) {
                axios.post('/api/notice/delete', null, {
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        toastr.success('删除成功')
                        // 重新获取列表数据并刷新表格
                        axios.get('/api/getNoticeList').then(res => {
                            if (res.data.code === 0) {
                                this.noticeList = res.data.data
                                this.$nextTick(() => {
                                    this.initTable('notice-table')
                                })
                            }
                        })
                    } else {
                        toastr.error(res.data.msg)
                    }
                })
            }
        },
        previewImage(url) {
            this.previewImageUrl = url
            $('#imageModal').modal('show')
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