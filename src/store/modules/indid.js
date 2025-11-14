export default {
  namespaced: true,
  state: {
    industryid: null // 草稿内容
  },
  mutations: {
    SET_INDID_INFO(state, data) {
      state.industryid = data
    }
  },
  actions: {
    getIndustryId({ commit },industryid) {
    commit('SET_INDID_INFO', industryid)
    },
  }
}
