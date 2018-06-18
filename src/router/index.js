import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import Signup from '@/components/Signup'
import home from '@/components/home'

Vue.use(Router)
export default new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: login
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
