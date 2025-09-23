const user_store = {
	state: {
		user_info: {},
	},
	mutations: {
		edit_user_info(state, data) {
			state.user_info = data
		},
	},
	actions: {},
	getters: {},
}

export default user_store
