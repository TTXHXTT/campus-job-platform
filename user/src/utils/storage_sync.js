/**
 * 操作本地缓存
 */

// 设置缓存内容
const set_storage_sync = function () {
    let newVal = {}
    newVal[arguments[0]] = arguments[1]
    let oldVal = get_storage_sync('cache')
    if (Object.keys(oldVal).length) {
        newVal = {
            ...oldVal, ...newVal
        }
    }
    uni.setStorageSync('cache', JSON.stringify(newVal))
    return arguments[1]
}

// 获取缓存内容
const get_storage_sync = function () {
    let item = uni.getStorageSync('cache')
    if (!item) {
        return ''
    }
    let j_Obj = JSON.parse(item)
    if (arguments[0] == 'cache') {
        return j_Obj
    }
    if (j_Obj[arguments[0]]) {
        return j_Obj[arguments[0]]
    } else {
        let item = uni.getStorageSync(arguments[0])
        if (!item) {
            return ''
        }
        try {
            let d_item = JSON.parse(item)
            set_storage_sync(arguments[0], d_item)
            uni.removeStorageSync(arguments[0])
            return d_item
        } catch (err) {
            try {
                var o_item = JSON.parse(item)
                set_storage_sync(arguments[0], o_item)
                uni.removeStorageSync(arguments[0])
                return o_item
            } catch (err) {
                set_storage_sync(arguments[0], item)
                uni.removeStorageSync(arguments[0])
                return item
            }
        }

    }
}

// 删除缓存内容
const del_storage_sync = function () {
    let oldVal = get_storage_sync('cache')
    if (oldVal[arguments[0]]) {
        delete (oldVal[arguments[0]])
        uni.setStorageSync('cache', JSON.stringify(oldVal))
    }
}

export default {
    set_storage_sync, get_storage_sync, del_storage_sync,
}
