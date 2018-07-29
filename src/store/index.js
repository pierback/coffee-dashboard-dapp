import Vue from 'vue'
import Vuex from 'vuex'

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    user: {
      name: '',
      coffeeConsumption: ''
    },
    overallConsumption: '',
    isLoggedIn: !!localStorage.getItem('token'),
    positionMapping: [],
  },
  mutations: {
    [LOGIN](state) {
      state.pending = true;
    },
    [LOGIN_SUCCESS](state) {
      state.isLoggedIn = true;
      state.pending = false;
    },
    [LOGOUT](state) {
      state.isLoggedIn = false;
    },
    setOverallConsumption(state, cnt) {
      state.overallConsumption = cnt;
    },
    setCurrentUser(state, user) {
      state.user = user;
    },
    setChartData(state, data) {
      state.chartData = data;
    },
    pushCurrentUser(state, user) {
      state.user.push(user);
    },
    pushChartData(state, data) {
      state.chartData.datasets[0].data.push(data);
    },
    updateChartData(state, id) {
      const newCnt = parseInt(state.chartData.datasets[0].data[id]) + 1;
      state.chartData.datasets[0].data[id] = newCnt;
    },
    pushLabel(state, label) {
      state.chartData.labels.push(label);
    },
    setPositionMapping(state, map) {
      state.positionMapping = map;
    },
    setKeyPositionMapping(state, key, index) {
      state.positionMapping.push(key);
    }
  },
  getters: {
    user: state => state.user,
    overallConsumption: state => state.overallConsumption,
    loggedin: state => state.isLoggedIn,
    chartData: state => state.chartData,
    positionMapping: state => state.positionMapping
  }
});

export default store;