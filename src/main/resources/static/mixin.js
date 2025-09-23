var mixin = {
    data: function () {
        return {
            path: window.location.pathname,
            user: this.isJson(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : false,
            admin: this.isJson(localStorage.getItem('admin')) ? JSON.parse(localStorage.getItem('admin')) : false,
            role_name: '',
            no_login: ['/']
        }
    },
    created: function () {

    },
    mounted: function () {
        if (this.no_login.indexOf(this.path) == -1) {
            // 检查是否是管理后台页面
            if (this.path.startsWith('/admin')) {
                if (!this.admin) {
                    this.jump('/');
                } else if (this.admin.id == undefined) {
                    this.jump('/');
                }
            } else {
                // 用户端页面检查
                if (!this.user) {
                    this.jump('/');
                } else if (this.user.id == undefined) {
                    this.jump('/');
                }
            }
        } else {
            if (this.path === '/' && this.admin) {
                this.jump('/admin/user');
            } else if (this.user) {
                this.logout();
            }
        }
        axios.defaults.headers["Content-Type"] = "application/json";
    },
    methods: {
        // 通用的方法
        logout: function () {
            if (this.path.startsWith('/admin')) {
                localStorage.removeItem('admin');
            } else {
                localStorage.removeItem('user');
            }
            window.location.href = '/';
        },
        jump: function (path) {
            window.location.href = path;
        },
        isJson: function (str) {
            if (typeof str == 'string') {
                try {
                    JSON.parse(str);
                    return true;
                } catch (e) {
                    return false;
                }
            } else {
                return false;
            }
        },
        initTable: function (id) {
            if ($.fn.DataTable.isDataTable('#' + id)) {
                $('#' + id).DataTable().destroy();
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
                });
            }, 300);
        },
    }
}