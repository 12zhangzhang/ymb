<template>
  <div>
    <div>
      <el-input
        class="addposinput"
        placeholder="添加职位"
        suffix-icon="el-icon-plus"
        v-model="pos.name"
      >
      </el-input>
      <el-button type="primary" @click="addPostions">添加</el-button>
    </div>
    <div class="posMain">
      <el-table
        size="small"
        stribe
        border
        :data="positions"
        style="width: 80%"
        ref="multipleSelection"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="编号" width="55"> </el-table-column>
        <el-table-column prop="name" label="职位" width="120">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="200">
        </el-table-column>
        <el-table-column prop="enabled" label="是否启用" width="120">
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="danger"
        size="small"
        style="margin-top: 18px"
        :disabled="multipleSelection.length > 0 ? false : true"
        @click="deleteMany"
        >批量删除</el-button
      >
    </div>
    <el-dialog
      title="编辑职位"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>
        <el-tag style="margin-right: 10px">职位</el-tag
        ><input type="text" v-model="updatePos.name" />
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="doUpdate" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data() {
    return {
      multipleSelection: [],
      centerDialogVisible: false,
      pos: {
        name: "",
      },
      updatePos: {
        name: "",
      },
      positions: [],
    };
  },

  mounted() {
    this.initPositions();
  },

  methods: {
    //添加职位
    addPostions() {
      if (this.pos.name) {
        this.postRequest("/system/basic/pos/", this.pos).then((res) => {
          if (res) {
            this.initPositions();
            this.pos.name = "";
          }
        });
      } else {
        this.$message.error("职位名称不能为空!");
      }
    },
    // 获取初始数据
    initPositions() {
      this.getRequest("/system/basic/pos/").then((res) => {
        console.log(res);
        if (res) {
          this.positions = res;
        }
      });
    },
    //编辑
    handleEdit(data) {
      // console.log(data);
      this.centerDialogVisible = true;
      //Object.assign(目标对象,源对象);
      Object.assign(this.updatePos, data);
      this.updatePos.createDate = "";
      console.log(this.updatePos);
    },
    doUpdate() {
      this.putRequest("/system/basic/pos/", this.updatePos).then((res) => {
        console.log(res); //获取不到
        if (res) {
          // this.pos.name = this.job;
          this.initPositions();
          this.centerDialogVisible = false;
        }
      });
    },
    //删除
    handleDelete(data) {
      // console.log(index, row);
      this.$confirm(
        "此操作将永久删除[" + data.name + "]职位, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest(`/system/basic/pos/${data.id}`).then((res) => {
            if (res) {
              this.initPositions();
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
    //监控多选框状态
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    //批量删除
    deleteMany(){
       this.$confirm(
        "此操作将永久删除这[" + this.multipleSelection.length + "]条职位, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let ids='?';
          this.multipleSelection.forEach(item=>{
            ids+='ids='+item.id+'&';
          })
          this.deleteRequest(`/system/basic/pos/`+ids).then((res) => {
            if (res) {
              this.initPositions();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  },
};
</script>
<style lang='less' scoped>
.addposinput {
  width: 300px;
}
.posMain {
  margin-top: 10px;
}
</style>