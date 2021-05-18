import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login'

const routes = [
  {
    path: '/',
    redirect:'/login'
},
{
  path: '/login',
    component: Login
  },
  {
    path: '/home',
    component:()=>import('../views/Home.vue')
}
]




const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
//挂载路由导航守卫 
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const strToken = window.sessionStorage.getItem('token')
  if (!strToken) return next('/login')
  next()
})


export default router
