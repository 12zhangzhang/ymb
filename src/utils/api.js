import axios from 'axios'
import { Message } from 'element-ui';
import router from '../router'
//不需要写
// axios.defaults.baseURL = "http://43.134.190.143:8081"

//拦截器
// 请求拦截器
axios.interceptors.request.use(config => {
    if (sessionStorage.getItem('tokenStr')) {
        config.headers['Authorization'] = sessionStorage.getItem('tokenStr')
    }
    return config
}, error => {
    console.log(error);
})
// // 响应拦截器
axios.interceptors.response.use(success => {
    //返回的JSON对象里面包含三部分: code(响应码),message(响应信息),object(后端传过来的我们可能用到的数据)
    //判断是否调到接口  
    if (success.status && success.status == 200) {
        // 判断业务逻辑是否错误(500),未登录(401),权限禁止(403)
        if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
            //如果业务逻辑错误,就弹出
            Message.error({ message: success.data.message });
            return;
        }
        //理解为剩下的都是成功的
        if (success.data.message) {
            Message.success({ message: success.data.message })
        }
    }
    //要拿出对象
    return success.data;
}, error => {
    //如果接口没有调用成功
    if (error.response.code == 504 || error.response.code == 404) {
        Message.error({ message: '服务器被吃了' });
    } else if (error.response.code == 403) {
        //403 权限不足
        Message.error({ message: "权限不足,请联系管理员" })
    } else if (error.response.code == 401) {
        //401  未登录,一般提示完会跳到登录页面
        Message.error({ message: "尚未登录,请登录" });
        router.replace('/')
    } else {
        //如果有自己的返回信息
        if (error.response.data.message) {
            Message.error({ message: error.response.data.message });
        } else {
            //如果没有响应信息
            Message.error({ message: '未知错误' })
        }
    }
    //如果error错误,返回空
    return;
})

//前置路径
let base=''
// //post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        //如果需要前置路径 ,在前面加${base},以防之后需要前置路径但是没办法加
        url: `${base}${url}`,
        data: params
    })
}
// //传送json的get请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        //如果需要前置路径 ,在前面加${base},以防之后需要前置路径但是没办法加
        url: `${base}${url}`,
        data: params
    })
}
// //put请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        //如果需要前置路径 ,在前面加${base},以防之后需要前置路径但是没办法加
        url: `${base}${url}`,
        data: params
    })
}
// //delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        //如果需要前置路径 ,在前面加${base},以防之后需要前置路径但是没办法加
        url: `${base}${url}`,
        data: params
    })
}