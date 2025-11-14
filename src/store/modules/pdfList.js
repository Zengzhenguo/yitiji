export default {
    namespaced: true,
    state: {
      pdfList: [] // 草稿内容
    },
    mutations: {
        SET_PDf_INFO(state, data) {
        state.pdfList = data
      }
    },
    actions: {
      gePDFLIST({ commit },pdfList) {
      commit('SET_PDf_INFO', pdfList)
      },
    }
  }
  