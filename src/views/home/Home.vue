<template>
  <div>
    <el-container>
      <el-header  class="homeHeader">
        <h4>云E办</h4>
        <div>
          <el-button
            icon="el-icon-bell"
            type="text"
            size="normal"
            style="color: blue;"
            @click="gochat"
          ></el-button>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ user.name }}<i><img :src="user.userFace" alt="" /></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- @select  激活事件 -->
          <!-- <el-menu @select="menuClick"> -->
          <!--unique-opened  不会多选打开 -->
          <el-menu router unique-opened>
            <el-submenu
              :index="index + ''"
              v-for="(item, index) in routes"
              :key="index"
              v-show="!item.hidden"
            >
              <template slot="title"
                ><i
                  :class="item.iconCls"
                  style="color: #1accff; margin-right: 10px"
                ></i
                >{{ item.name }}</template
              >

              <el-menu-item
                :index="children.path"
                v-for="(children, indexj) in item.children"
                :key="indexj"
                >{{ children.name }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main>
          <el-breadcrumb v-if="this.$router.currentRoute.path != '/home'">
            <el-breadcrumb-item :to="{ path: '/home' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>{{
              this.$router.currentRoute.name
            }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div
            class="homeWelcome"
            v-if="this.$router.currentRoute.path == '/home'"
          >
            欢迎来到云E办系统!
          </div>
          <router-view class="homeRouterView" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user")),
    };
  },
  mounted() {
    console.log(this.$router);
    console.log(this.routes);
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
  },
  methods: {
    gochat() {
      this.$router.push("/chat");
    },
    handleCommand(command) {
      if (command == "logout") {
        this.$confirm("此操作将注销登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            //注销登录
            this.postRequest("/logout");
            //清除tokenStr 和 user  即清空用户信息
            sessionStorage.removeItem("tokenStr");
            sessionStorage.removeItem("user");
            //清空菜单
            this.$store.commit("initRoutes", []);
            //跳转到登录页
            // this.$router.replace("/");
            //1.解决手动在地址栏输入路径时,出现空白页面的bug
            let path = this.$route.query.redirect;
            this.$router.replace(
              path == "/" || path == undefined ? "/login" : path
            );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
      };
      if(command="userinfo"){
        this.$router.push('/userInfo')
      }

    },
  },
};
</script>
<style lang='less' scoped>
.el-header {
  background-color: #B3C0D1;
  color: rgb(29, 3, 3);
  padding: 10px;
  height: 10vh;
  font-size: 25px;
  display: flex;
  .el-button{
    position:absolute;
    right: 110px;
    top: 28px;
    
  }
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
  height: 92vh;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  // text-align: center;
  // line-height: 160px;
}
.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.el-dropdown {
  position: absolute;
  right: 20px;
  top: 5px;
}
.homeWelcome {
  color: rgb(88, 176, 248);
  font-size: 24px;
  text-align: center;
}
.homeRouterView {
  margin-top: 10px;
}
</style>