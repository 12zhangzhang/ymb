import { getRequest } from "./api"

//定义初始化菜单,初始化之后是放到路由的配置里面,所有要有router参数
//因为整体是放到vuex中统一去管理的,所以要有store参数
export const initMenu = (router, store) => {
    //先做判断,初始化之前,state中的routes是空的才要初始化,如果有了,就不需要初始化了,直接返回就行
    if (store.state.routes.length > 0) {
        return;
    }
    //如果不是,就获取请求
    getRequest('/system/config/menu').then(data => {
        console.log(data);
        if (data) {
            //如果数据存在,就格式化这个route
            let fmtRoutes = formatRoutes(data);
            //添加到router
            router.addRoutes(fmtRoutes);
            console.log(router);
            //将数据存入vuex
            store.commit('initRoutes', fmtRoutes);
            // 连接webSocket
            store.dispatch("connect");
        }
    })
}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            iconCls,
            children,
        } = router;
        if (children && children instanceof Array) {
            //递归
            children = formatRoutes(children)
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve) {
                // console.log(resolve);
                if (component.startsWith('Home')) {
                    require(['../views/home/' + component + '.vue'], resolve);
                } else if (component.startsWith('Emp')) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith('Per')) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sal')) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sta')) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sys')) {
                    require(['../views/sys/' + component + '.vue'], resolve);

                }

            }
        }
        fmtRoutes.push(fmRouter)
    });
    return fmtRoutes;
}