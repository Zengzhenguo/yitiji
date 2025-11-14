import { saveDraft, getDraftDetail, deleteDraft } from '@/api'
import utils from '@/utils'
export default {
  namespaced: true,
  state: {
    draftInfo: {} // 草稿内容
  },
  mutations: {
    SET_DRAFT_INFO(state, data) {
      state.draftInfo = data
    }
  },
  actions: {
    // 保存草稿{name}
    saveDraft({ commit }, data) {
      console.log(data)
      const showTips = data.showTips
      delete data.showTips
      return new Promise((resolve, reject) => {
        const draftNumber = utils.getItem('draftNumber') || ''
        utils.showLoading({ text: '正在保存，请稍后' })
        if (data.nameApply === undefined) {
          data['nameApply'] = {
            companyName: '',
            bizName: ''
          }
        }
        saveDraft(draftNumber, data.nameApply.companyName, data.nameApply.bizName, data.businessType, JSON.stringify(data), data.nameApply.number).then(res => {
          utils.setItem('draftNumber', res.outData.draftNumber)
          utils.hideLoading()
          if (showTips) {
            utils.showSuccess('保存草稿成功！')
          }
          resolve(res.outData)
        }).catch(err => {
          utils.hideLoading()
          if (showTips) {
            utils.showError('保存草稿失败，请重试！')
          }
          reject(err)
        })
      })
    },
    // 获取草稿详情
    getDraftDetail({ commit }, draftNumber) {
      return new Promise((resolve, reject) => {
        utils.showLoading()
        getDraftDetail(draftNumber).then(res => {
          utils.hideLoading()
          commit('SET_DRAFT_INFO', res.outData.draftData)
          resolve(res.outData.draftData)
        }).catch(err => {
          utils.hideLoading()
          reject(err)
        })
      })
    },
    // 删除草稿
    deleteDraft({ commit }, draftNumber) {
      return new Promise((resolve, reject) => {
        utils.showLoading()
        deleteDraft(draftNumber).then(res => {
          utils.hideLoading()
          utils.removeItem('draftNumber')
          commit('SET_DRAFT_INFO', {})
          resolve(res)
        }).catch(err => {
          utils.hideLoading()
          reject(err)
        })
      })
    }
  }
}
