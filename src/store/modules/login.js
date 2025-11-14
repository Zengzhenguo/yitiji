export default {
  namespaced: true,
  state: {
    userInfo: null,
    flag: true // 是否允许开启弹窗拦截
  },
  mutations: {
    // 设置用户信息
    SET_USER_INFO(state, data) {
      state.userInfo = data
    },
    // 设置是否允许开启弹窗拦截
    SET_FLAG(state, data) {
      state.flag = data
    }
  },
  actions: {
  }
}
