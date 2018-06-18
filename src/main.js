// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from "bootstrap-vue"
import App from './App'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import VueTabs from 'vue-nav-tabs'
import 'vue-nav-tabs/themes/vue-tabs.css'
import VueTouch from 'vue-touch';
import VSwipe from 'vswipe'
Vue.use(VSwipe)

Vue.use(VueTouch);
Vue.use(VueTabs)

import VueAwesomeSwiper from 'vue-awesome-swiper'
import Swiper from "swiper";
import Chart from 'chart.js';

// require styles
import 'swiper/dist/css/swiper.css'
import { Map } from 'core-js';

Vue.use(VueAwesomeSwiper, /* { default global options } */)

Vue.use(BootstrapVue)
Vue.config.productionTip = false

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
    chartData: {
      datasets: [
        {
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ]
        }
      ],
      labels: []
    },
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
      //console.log('​setKeyPositionMapping -> key, index', key, index);
      state.positionMapping.push(key);
      //console.log('​setKeyPositionMapping -> state.positionMapping', state.positionMapping);
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


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


