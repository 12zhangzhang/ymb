<template>
  <div>
    <div class="pemissManaTool">
      <el-input placeholder="请输入英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
        placeholder="请输入中文名"
        v-model="role.nameZh"
        @keydown.enter.native="doAddRole"
      >
      </el-input>
      <el-button @click="doAddRole">添加角色</el-button>
    </div>
    <div class="pemissManaMain">
      <el-collapse accordion @change="change" v-model="activeName">
        <el-collapse-item
          :title="item.nameZh"
          :name="item.id"
          v-for="(item, index) in roles"
          :key="index"
        >
          <div>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>可访问资源</span>
                <el-button
                  style="float: right; padding: 3px 0; color: red"
                  type="text"
                  icon="el-icon-delete"
                  @click="doDeleteRole(item)"
                ></el-button>
              </div>
              <div>
                <el-tree
                  node-key="id"
                  :default-checked-keys="selectMenus"
                  :data="allMenus"
                  :props="defaultProps"
                  ref="tree"
                  :key="index"
                  show-checkbox
                ></el-tree>
                <div style="display: flex; justify-content: flex-end">
                  <el-button size="mini" @click="cancelUpdate"
                    >取消修改</el-button
                  >
                  <el-button
                    size="mini"
                    type="primary"
                    @click="doUpdate(item.id, index)"
                    >确认修改</el-button
                  >
                </div>
              </div>
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PemissMana",
  data() {
    return {
      role: {
        name: "",
        nameZh: "",
      },
      roles: [],
      allMenus: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      selectMenus: [],
      activeName: -1,
    };
  },

  mounted() {
    this.initRoles();
  },

  methods: {
    //删除角色
    doDeleteRole(role) {
      this.$confirm(
        "此操作将永久删除[" + role.nameZh + "]角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest(`/system/basic/permiss/role/` + role.id).then(
            (res) => {
              if (res) {
                this.initRoles();
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    doAddRole() {
      //如果input框的值都存在,才能进行添加
      if (this.role.name && this.role.nameZh) {
        this.postRequest("/system/basic/permiss/role", this.role).then(
          (res) => {
            console.log(res);
            if (res) {
              this.initRoles();
              this.role.name = "";
              this.role.nameZh = "";
            }
          }
        );
      } else {
        this.$message.error("所有字段不能为空");
      }
    },
    //取消修改
    cancelUpdate() {
      //折叠板关闭
      this.activeName = -1;
    },
    //更新菜单
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      //getCheckedKeys()是组件自有的回调函数,可以获取节点数据数组,true的意思是数组只包含子节点
      let selectedKeys = tree.getCheckedKeys(true);
      //  console.log(selectedKeys);
      let url = "/system/basic/permiss/?rid=" + rid;
      selectedKeys.forEach((key) => {
        url += "&mids" + key;
      });
      // console.log(url);
      this.putRequest(url).then((res) => {
        if (res) {
          this.initRoles();
          //折叠板关闭
          this.activeName = -1;
        }
      });
    },

    change(rid) {
      if (rid) {
        this.initAllMenu();
        this.initSelectedMenus(rid);
      }
    },
    //选中
    initSelectedMenus(rid) {
      this.getRequest(`/system/basic/permiss/mid/${rid}`).then((res) => {
        console.log(res);
        if (res) {
          this.selectMenus = res;
        }
      });
    },
    //初始化菜单
    initAllMenu() {
      this.getRequest("/system/basic/permiss/menus").then((res) => {
        // console.log(res);
        if (res) {
          this.allMenus = res;
        }
      });
    },
    //初始化角色
    initRoles() {
      this.getRequest("/system/basic/permiss/").then((res) => {
        // console.log(res);
        if (res) {
          this.roles = res;
        }
      });
    },
  },
};
</script>
<style lang='less' scoped>
.pemissManaTool {
  display: flex;
  .el-input {
    width: 300px;
    margin-right: 8px;
  }
}
.pemissManaMain {
  margin-top: 10px;
  width: 715px;
}
</style>