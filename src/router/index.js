import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: '/chat/:id',
        name: "conversation",
        component: () => import('../views/ConversationView.vue')
      },
      {
        path: "/new",
        name: "new",
        component: () => import('../views/NewConversationView.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RegisterView.vue')
  },
  {
    path: '/registerAccount',
    name: 'registerAccount',
    component: () => import(/* webpackChunkName: "about" */ '../views/RegisterAccountView.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "about" */ '../views/TestView.vue')
  },
  {
    path:'/conversations',
    name: 'conversations',
    component: () => import('../views/AllConversationsView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
