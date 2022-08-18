import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'font-awesome/css/font-awesome.css'

import { postRequest } from '@/utils/api.js';
import { putRequest } from '@/utils/api.js';
import { getRequest } from '@/utils/api.js';
import { deleteRequest } from '@/utils/api.js';
import { downloadRequest } from '@/utils/download.js';
//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { initMenu } from './utils/menus';
Vue.use(ElementUI)

// Vue.use(ElementUI, { size: 'small' });

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem('tokenStr')) {
    //如果有token,就初始化菜单
    initMenu(router, store)
    if (!window.sessionStorage.getItem('user')) {
      return getRequest('/admin/info').then(res => {
        //判断用户信息是否存在
        if (res) {
          //存储用户信息
          window.sessionStorage.setItem('user', JSON.stringify(res));
          next()
        }
      })
    }
    next()
  } else {
    // 2.解决手动在地址栏输入路径时,出现空白页面的bug
    if (to.path === '/') {
      next()
    } else {
      next('/?redirect=' + to.path)
    }
  }
})


// const originalPush = router.prototype.push
// router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
