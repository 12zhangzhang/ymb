import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/home/Login'
import Home from "../views/home/Home";
import Chat from "../views/chat/index";
import AdminInfo from "@/views/home/AdminInfo";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  }, {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/chat',
        name: '在线聊天',
        component: Chat,
      },
      {
        path: '/userInfo',
        name: '个人中心',
        component: AdminInfo,
      }
    ]
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})


export default router
