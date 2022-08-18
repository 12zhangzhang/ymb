<template>
  <div>
    <div style="display: flex; justify-content: center">
      <el-input
        placeholder="通过用户名搜索信息..."
        style="width: 400px; margin-right: 10px"
        prefix-icon="el-icon-search"
        size="small"
        v-model="keywords"
      >
      </el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="doSearch"
        >搜索</el-button
      >
    </div>
    <div class="admin-container">
      <el-card class="box-card" v-for="admin in admins" :key="admin.id">
        <div slot="header" class="clearfix">
          <span>{{ admin.name }}</span>
          <el-button
            style="float: right; padding: 3px 0; color: red"
            icon="el-icon-delete"
            type="text"
            @click="deleteAdmin(admin)"
          ></el-button>
        </div>
        <div>
          <div class="img-container">
            <img :src="admin.userFace" class="userFace-img" />
          </div>
        </div>
        <div class="userinfo-container">
          <div>用户名:{{ admin.name }}</div>
          <div>手机号:{{ admin.phone }}</div>
          <div>电话号码:{{ admin.telephone }}</div>
          <div>地址:{{ admin.address }}</div>
          <div>
            用户状态:
            <el-switch
              style="display: block"
              v-model="admin.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="禁用"
              inactive-text="启用"
              @change="enabledChange(admin)"
            >
            </el-switch>
          </div>
          <div>
            用户角色:
            <el-tag
              type="success"
              style="margin-right: 3px"
              size="mini"
              v-for="(role, indexj) in admin.roles"
              :key="indexj"
              >{{ role.nameZh }}</el-tag
            >
            <el-popover
              placement="bottom"
              title="角色列表"
              width="300"
              trigger="click"
              @show="showPop(admin)"
              @hide="updateRoles(admin)"
            >
              <el-select v-model="selectedRoles" multiple placeholder="请选择">
                <el-option
                  v-for="item in allRoles"
                  :key="item.id"
                  :label="item.nameZh"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-button
                slot="reference"
                type="text"
                icon="el-icon-more"
              ></el-button>
            </el-popover>
          </div>
          <div>备注: {{ admin.remark }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysAdmin",
  data() {
    return {
      admins: [],
      keywords: "",
      allRoles: [],
      //因为是多选,所以绑定的是一个数组
      selectedRoles: [],
    };
  },

  mounted() {
    this.initAdmins();
  },

  methods: {
    //更新角色,隐藏弹出框时触发
    updateRoles(admin) {
      let roles = [];
      Object.assign(roles, admin.roles);
      let flag = false;
      // 判断操作员信息中的roles的角色数组长度和被选中的角色数组长度是否相等,如果不相等,说明选中角色有变化,此时才更新,否则不更新
     //长度不相等,更新
     if (roles.length != this.selectedRoles.length) {
        flag = true;
      } else {
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i];
          for (let j = 0; j < this.selectedRoles.length; j++) {
            let sr = this.selectedRoles[j];
            if (role.id == sr) {
              //因为后面要用this.selectedRoles中的数据更新,所以删除原有角色数组中的数据
              roles.splice(i, 1);
              i--;
              break;
            }
          }
        }
        //不太懂
        if (roles.length != 0) {
          flag = true;
        }
      }

      if (flag) {
        //拼接url
        let url = "/system/admin/role?adminId=" + admin.id;
        this.selectedRoles.forEach((sr) => {
          url += "&rids=" + sr;
        });
        //  console.log(url);
        this.putRequest(url).then((res) => {
          if (res) {
            this.initAdmins();
          }
        });
      }
    },

    //展示弹出框
    showPop(admin) {
      this.initAllRoles();
      let roles = admin.roles;
      //把被选中的数组初始化
      this.selectedRoles = [];
      roles.forEach((item) => {
        //因为选择器value对应的值是id
        this.selectedRoles.push(item.id);
      });
    },
    //初始化allRoles
    initAllRoles() {
      this.getRequest("/system/admin/role").then((res) => {
        if (res) {
          this.allRoles = res;
          //记得调用initAllRoles
        }
      });
    },
    //用户状态
    enabledChange(admin) {
      console.log(admin);
      this.putRequest("/system/admin/", admin).then((res) => {
        if (res) {
          this.initAdmins();
        }
      });
    },
    //搜索
    doSearch() {
      this.initAdmins();
    },

    //初始化操作员
    initAdmins() {
      this.getRequest("/system/admin/?keywords=" + this.keywords).then(
        (res) => {
          console.log(res);
          if (res) {
            this.admins = res;
          }
        }
      );
    },
    //删除操作员
    deleteAdmin(admin) {
      console.log(admin);
      this.$confirm(
        "此操作将永久删除【" + admin.name + "】操作员, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/system/admin/" + admin.id).then((resp) => {
            if (resp) {
              this.initDeps();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang='less' scoped>
.el-card {
  width: 350px;
  margin: 10px;
}
.admin-container {
  display: flex;
  // justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 10px;
  div {
    line-height: 20px;
  }
}
.userFace-img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
}
.img-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.userinfo-container {
  font-size: 12px;
  color: rgb(16, 139, 139);
}
</style>