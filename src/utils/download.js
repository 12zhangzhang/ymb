// 本质也是通过axios去调后端的接口,导入axios,
import axios from 'axios';
// import fileDownload from 'js-file-download';  //因为使用了require,所以不用引入

//先定义axios为 service,因为想给axios默认带一个相应的类型
const service = axios.create({
    //默认响应类型, 流,肯定是数组
    responseType: 'arraybuffer'
})
// 这样就可以通过service去写拦截器,
service.interceptors.request.use(config => {
    config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    return config;
}, error => {
    console.log(error);
})

service.interceptors.response.use(res => {
    const headers = res.headers;
    //为什么定义正则表达式,虽然是以流的形式返回,但是也可能是json字符串,
    // 因为现在是前后端分离,后端大部分返回的是json字符串,只有像下载文件这种特殊的接口才会返回流的形式
    //所以要做相应的判断,判断headers中的content-type和正则表达式是否匹配,如果匹配,说明是一个普通的接口请求
    //那就可以写一个方法转成string类型
    let reg = RegExp(/application\/json/);
    if (headers['content-type'].match(reg)) {
        res.data = unitToString(res.data);
    } else {
        let fileDownload = require('js-file-download');
        let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
        let contentType=headers['content-type']
        fileName = decodeURIComponent(fileName);
        fileDownload(res.data, fileName, contentType);
    }
}, error => {
    console.log(error);
})

// 准备一个unitToString
function unitToString(unitArray) {
    // 编码
    let encodedString = String.fromCharCode.apply(null, new Uint8Array(unitArray))
    // 解码
    let decodedString = decodeURIComponent(escape(encodedString));
    return JSON.parse(decodedString)
}


//定义请求
let base = '';
export const downloadRequest = (url, params) => {
    return service({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

export default service;