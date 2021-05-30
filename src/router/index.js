import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login'

const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '',
        redirect: 'welcome',
      },
      {
        path: '/welcome',
        component: () => import('../components/users/welcome.vue')
      },
      {
        path: '/users',
        component: () => import('../components/users/Users.vue')
      },
      {
        path: '/rights',
        component: () => import('../components/users/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('../components/users/Roles.vue')
      },
      {
        path: '/categories',
        component: () => import('../components/goods/cate.vue')
      },
      {
        path: '/params',
        component: () => import('../components/goods/params.vue')
      },
      {
        path: '/goods',
        component: () => import('../components/goods/lists.vue')
      },
      {
        path: '/goods/add',
        component: () => import('../components/goods/Add.vue')
      }, {
        path: '/orders',
        component: () => import('../components/Order/order.vue')
      }
      
    ]
  }
]




const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//挂载路由导航守卫 ，如果是前往login页面，放行；如果token值与服务器返回的token值不一样强制前往login页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const strToken = window.sessionStorage.getItem('token')
  if (!strToken) return next('/login')
  next()
})


export default router
