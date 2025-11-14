export default {
    namespaced: true,
    state: {
      archivelList: [] // 草稿内容
    },
    mutations: {
        SET_ARCHIVE_INFO(state, data) {
        state.archivelList = data
      }
    },
    actions: {
      getArchivelList({ commit },archivelList) {
      commit('SET_ARCHIVE_INFO', archivelList)
      },
    }
  }
  