import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import Signup from '@/components/Signup'
import home from '@/components/home'

//const determinePath = () => !!localStorage.getItem('token') ?  '/home' : '/login'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    //redirect: to => determinePath(),
    props: true
  }]
})

router.beforeEach((to, from, next) => {
  console.log('middleware call');
  if (to.path === from.path) next(false);
  const newPath = {
    '/': !!localStorage.getItem('token') ? '/home' : '/login',
    '/login': !!localStorage.getItem('token') ? '/home' : undefined,
    '/home': !!localStorage.getItem('token') ? undefined : '/login',
  }[to.path];

  console.log('!!localStorage', !!localStorage.getItem('token'), 'newPath', newPath);
  next(newPath);
})

export default router;