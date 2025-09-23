import store from '../store/index'
import { re_launch, switch_tab } from './go_page'
import white_list from "../utils/white_list";

// 退出登录
export async function quit() {
	store.commit('$reset')
	uni.clearStorage();
	uni.redirectTo({
		url: '/pages/login'
	})
}

// 自动导入图片
export function images_map(base_url) {
	let url = '/static' + base_url;
	const modules_one = import.meta.globEager(`/static/*.{png,jpg,jpeg,gif,svg,webp,ico,icon}`)
	const modules_two = import.meta.globEager(`/static/*/*.{png,jpg,jpeg,gif,svg,webp,ico,icon}`)
	const modules_three = import.meta.globEager(`/static/*/*/*.{png,jpg,jpeg,gif,svg,webp,ico,icon}`)
	if (modules_one[url]) {
		return modules_one[url].default
	} else if (modules_two[url]) {
		return modules_two[url].default
	} else if (modules_three[url]) {
		return modules_three[url].default
	}
}

// 识别未登录
export function is_login() {
	const pages = getCurrentPages();
	//数组的最后一项为当前页面
	const page = pages[pages.length - 1];

	if (page) {
		if (Object.keys(store.state.user_info).length == 0) {
			// 没有登录状态
			if (page.route != '/' && white_list.page.indexOf(page.route) == -1) {
				uni.showToast({
					title: '请先登录',
					icon: 'none',
					duration: 2000
				})
				re_launch('/pages/login')
			}
		} else {
			// 有登录状态
			if (page.route == '/' || white_list.page.indexOf(page.route) > -1) {
				switch_tab('/pages/index')
			}
		}
	}
}
