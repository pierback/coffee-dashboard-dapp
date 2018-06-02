import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Signup from '@/components/Signup'
import home from '@/components/home'

/* const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem('token'),
    user: ''
  },
  mutations: {
    [LOGIN] (state) {
      state.pending = true;
    },
    [LOGIN_SUCCESS] (state) {
      state.isLoggedIn = true;
      state.pending = false;
    },
    [LOGOUT](state) {
      state.isLoggedIn = false;
    }, 
    setUser(state, user){
      state.user = user;
    },
    getUser(state){
     return state.user;
    }
  }
});
 */
Vue.use(Router)
export default new Router({
  routes: [{
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      props: true
    }
  ]
})
