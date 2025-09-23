import white_list from "../utils/white_list";
import { URL } from "./base";
import store from '../store/index'
import { navigate_to } from "./go_page";

// 请求列表
let http_list = {}
const request = (options = {}) => {
	let token = uni.getStorageSync('user')
	
	options.header = {
		"Content-Type": "application/json",
	}

	return new Promise((resolve, reject) => {
		let no_token_request = white_list.api.indexOf(options.url) !== -1

		if (token || no_token_request) {
			uni.request({
				url: URL() + options.url,
				method: options.method || 'GET',
				data: options.data || {},
				header: options.header || {},
				success: (res) => {
					console.log('请求成功：', options.url, res)
					if (res.data.code === 0) {
						resolve(res.data)
					} else {
						uni.showToast({
							title: res.data.msg || '请求失败',
							icon: 'none',
							duration: 2000
						})
						reject(res.data)
					}
				},
				fail: (err) => {
					console.log('请求失败：', options.url, err)
					uni.showToast({
						title: '网络请求失败',
						icon: 'none',
						duration: 2000
					})
					reject(err)
				}
			})
		} else {
			uni.reLaunch({
				url: '/pages/login'
			})
		}
	})
}

const get = (url, data, options = {}) => {
	options.method = 'GET'
	options.data = data
	options.url = url
	return request(options)
}

const post = (url, data, options = {}) => {
	options.method = 'POST'
	options.data = data
	options.url = url
	return request(options)
}

export default {
	get,
	post
}
