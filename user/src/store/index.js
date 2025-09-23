import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// Vuex分模块管理
const modules_files = import.meta.globEager('./modules/*.js')
const modules = {}
for (const key in modules_files) {
    modules[key.replace(/(\.\/modules\/|\.js)/g, '')] = modules_files[key].default
}

// modules内置函数
let mutations = {
    // 重置state
    $reset(state) {
        Object.assign(state, modules_store('state'))
    },
}

function modules_store(func) {
    let obj = {}
    for (let i in modules) {
        obj = {...obj, ...modules[i][func]}
    }
    if (func === 'mutations') {
        obj = {...obj, ...mutations}
    }
    return obj;
}

const store = createStore({
    state: modules_store('state'),
    mutations: modules_store('mutations'),
    actions: modules_store('actions'),
    getters: modules_store('getters'),
    plugins: [
        createPersistedState({
            storage: {
                getItem: key => uni.getStorageSync(key),
                setItem: (key, value) => uni.setStorageSync(key, value),
                removeItem: key => uni.removeStorageSync(key)
            },
        })
    ],
})


export default store
