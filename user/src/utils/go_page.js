import qs from 'qs';

export function navigate_to(url, data = "") {
	let urlData = ''
	if (data) {
		if (Object.keys(data).length > 0) {
			urlData = '?' + qs.stringify(data)
		}
	}
	uni.navigateTo({
		url: url + urlData,
	})
}

export function redirect_to(url, data = "") {
	let urlData = ''
	if (data) {
		if (Object.keys(data).length > 0) {
			urlData = '?' + qs.stringify(data)
		}
	}
	uni.redirectTo({
		url: url + urlData,
	})
}

export function switch_tab(url) {
	uni.switchTab({
		url: url,
	})
}

export function re_launch(url, data = "") {
	let urlData = ''
	if (data) {
		if (Object.keys(data).length > 0) {
			urlData = '?' + qs.stringify(data)
		}
	}
	uni.reLaunch({
		url: url + urlData,
	})
}

export function navigate_back(delta) {
	uni.navigateBack({
		delta
	});
}
