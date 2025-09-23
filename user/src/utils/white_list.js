// 不需要token也可以请求的接口
const api = [
	// 登录
	'/api/login',
	// 注册
	'/api/register'
]

// 不允许高频请求列表
const not_high_frequency_api = []

// 允许外部链接访问的地址
const external_page = []

// 不需要token也可以访问的页面
const page = [
	'pages/login',
	'pages/register',
	'pages/forgot'
]

export default { api, page, not_high_frequency_api, external_page }
