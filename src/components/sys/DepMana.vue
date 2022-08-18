<template>
  <div style="width: 500px">
    <!-- prefix-icon 在输入框的前面添加图标 -->
    <el-input
      placeholder="请输入部门名称进行搜索"
      v-model="filterText"
      prefix-icon="el-icon-search"
    >
    </el-input>
    <!--  :filter-node-method="filterNode"  一个拦截的事件 -->
    <el-tree
      :data="deps"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ data }"
        style="display: flex; justify-content: space-between; width: 100%"
      >
        <span>{{ data.name }}</span>
        <span>
          <el-button
            class="depBtn"
            type="primary"
            size="mini"
            @click="() => showAddDep(data)"
          >
            添加部门
          </el-button>
          <el-button
            class="depBtn"
            type="danger"
            size="mini"
            @click="() => deleteDep(data)"
          >
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      title="添加部门"
      :visible.sync="centerDialogVisible"
      width="50%"
      center
    >
      <div>
        <table>
          <tr>
            <td>
              <el-tag size="mini">上级部门</el-tag>
            </td>
            <td>{{ pname }}</td>
          </tr>
          <tr>
            <td>
              <el-tag size="small">部门名称</el-tag>
            </td>
            <td>
              <el-input
                placeholder="请输入部门名字"
                v-model="dep.name"
                size="small"
              ></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="doAddDep" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      centerDialogVisible: false,
      filterText: "",
      deps: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      dep: {
        name: "",
        patentId: -1,
      },
      pname: "",
    };
  },

  mounted() {
    this.initDeps();
  },
  //ElementUI中有的
  watch: {
    filterText(val) {
      //filter其实就是调的filter-node-method事件
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    // initDep() {
    //   this.dep = {
    //     name: "",
    //     parentId: -1,
    //   };
    //   this.pname = "";
    // },
    // addDep2Deps(deps,dep){
    //   for(let i=0;i<deps.length;i++){
    //     let d=deps[i];
    //     if(d.id==dep.parentId){
    //       d.children.concat(dep);
    //       return;
    //     }else{
    //       this.addDep2Deps(d.children,dep)
    //     }
    //   }
    // },
    doAddDep() {
      // console.log(11111);
      this.postRequest("/system/basic/department/", this.dep).then((res) => {
        if (res) {
          // this.addDep2Deps(this.deps.res.obj);
          this.dep = {};
          this.pname = "";
          // this.initDep();
          this.initDeps();
          this.centerDialogVisible = false;
        }
      });
    },
    showAddDep(data) {
      this.dep.parentId = data.id;
      this.pname = data.name;
      this.centerDialogVisible = true;
    },
    deleteDep(data) {
      // console.log(node);
      console.log(data);
      this.$confirm(
        "此操作将永久删除【" + data.name + "】部门, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/system/basic/department/" + data.id).then(
            (resp) => {
              if (resp) {
                this.initDeps();
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
    initDeps() {
      this.getRequest("/system/basic/department/").then((res) => {
        if (res) {
          this.deps = res;
        }
      });
    },
    //ElementUI中有的
    filterNode(value, data) {
      //data就是当前目录下面的数据
      if (!value) return true;
      //返回true,节点就展示,返回false节点就隐藏
      return data.name.indexOf(value) !== -1;
    },
  },
};
</script>
<style lang='less' scoped>
.depBtn {
  padding: 2px;
}
</style>