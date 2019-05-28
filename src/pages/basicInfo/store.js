// import Vue from 'vue'
// import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 'companyCode': '',
    // 'employeeCode': '',
    //总部
    // 'companyCode': '2155',
    // 'employeeCode': '2155500478',
    //网点
    // 'companyCode': '311111',
    // 'employeeCode': '311111',
    isRequestSetAssign: false,
    isDoAssign: false,
  },
  mutations: {
    setCompanyCode(state, data) {
      state.companyCode = data
    },
    setEmployeeCode(state, data) {
      state.employeeCode = data
    },
    setIsRequest(state, data) {
      state.isRequestSetAssign = data
    },
    setIsAssigndo(state, data) {
      state.isDoAssign = data
    },
  },
  actions: {

  }
})
