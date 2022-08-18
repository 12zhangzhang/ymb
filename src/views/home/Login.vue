<template>
  <div>
    <el-form
      v-loading="loading"
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="loginContainer"
    >
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          type="text"
          auto-complete="false"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <!--auto-complete 自动补全  -->
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          type="password"
          auto-complete="false"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          placeholder="点击图片更换验证码"
          type="text"
          auto-complete="false"
          style="width: 160px"
        ></el-input>
        <img :src="captchaUrl" @click="updateCapcha" /> <br />
        <el-checkbox v-model="checked">记住我</el-checkbox>
        <el-button type="primary" style="width: 100%" @click="sumitLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      //+newDate()是为了防止在图片看不清时,点击更换验证码的时候再更换到这张图片(确保验证码正常刷新)
      captchaUrl: "/captcha?time=" + new Date(),
      checked: true,
      loginForm: {
        username: "admin",
        password: "123",
        code: "",
      },
      rules: {
        //这里的属性和prop里面的字段对应
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      },
    };
  },

  mounted() {},

  methods: {
    updateCapcha() {
      this.captchaUrl = "/captcha?time=" + new Date();
    },
    sumitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          //loading图
          this.loading = true;
          //请求
          this.postRequest("/login", this.loginForm).then((res) => {
            console.log(res);

            //由于接口不能用,所以这个判断先删掉
            if (res) {
              this.loading = false;
              const tokenStr = res.obj.tokenHead + res.obj.token;
              sessionStorage.setItem("tokenStr", tokenStr);
              this.$router.replace("/home");
            } else {
              this.loading = false;
            }
          }).catch(err=>{
            console.log(err);
          })
        } else {
          //错误信息插件里有
          this.$message.error("请输入所有字段!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang='less' scoped>
.loginContainer {
  border-radius: 15px;
  margin: 190px auto;
  width: 350px;
  padding: 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.loginTitle {
  text-align: center;
}
</style>