import { getDist } from '@/api/index'
export default {
  namespaced: true,
  state: {
    areaList: {},
    getArea: false
  },

  mutations: {
    SET_AREA_LIST(state, data) {
      state.areaList = data
      state.getArea = true
    }
  },

  actions: {
    // 全局获取行政区划
    getAreaList({ commit }, areaCode) {
      return new Promise((resolve, reject) => {
        getDist({ areaCode }).then(res => {
          if (+res.errCode === 1) {
            const areaList = [{
              value: '42000',
              label: '湖北省',
              children: [{
                value: '420300',
                label: '十堰市',
                children: []
              }]
            }]
            // 构造areaList
            if (res.outData && res.outData.data.length) {
              res.outData.data.forEach(item => {
                if (item.value === areaCode) {
                  areaList[0].children[0] = item
                }
              })
            }
            commit('SET_AREA_LIST', areaList)
            resolve(areaList)
          } else {
            reject(res)
          }
        })
      })
    }
  }
}
