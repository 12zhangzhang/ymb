<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <el-button type="primary" icon="el-icon-plus" @click="showAddSalaryView"
        >添加工资账套</el-button
      >
      <el-button
        type="success"
        icon="el-icon-refresh"
        @click="initSalaries"
      ></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table :data="salaries" border stripe>
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column label="账套名称" prop="name" width="120">
        </el-table-column>
        <el-table-column label="基本工资" prop="basicSalary" width="70">
        </el-table-column>
        <el-table-column label="交通补助" prop="trafficSalary" width="70">
        </el-table-column>
        <el-table-column label="午餐补助" prop="lunchSalary" width="70">
        </el-table-column>
        <el-table-column label="奖金" prop="bonus" width="70">
        </el-table-column>
        <el-table-column label="启用时间" prop="createDate" width="100">
        </el-table-column>
        <el-table-column label="养老金" align="center">
          <el-table-column
            prop="pensionPer"
            label="比率"
            width="70"
          ></el-table-column>
          <el-table-column
            prop="pensionBase"
            label="基数"
            width="70"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="医疗保险" align="center">
          <el-table-column
            prop="medicalPer"
            label="比率"
            width="70"
          ></el-table-column>
          <el-table-column
            prop="medicalBase"
            label="基数"
            width="70"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="公积金" align="center">
          <el-table-column
            prop="accumulationFundPer"
            label="比率"
            width="70"
          ></el-table-column>
          <el-table-column
            prop="accumulationFundBase"
            label="基数"
            width="70"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="showEditSalaryView(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" @click="deleteSalary(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加工资账套弹出框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <!-- 步骤条 -->
      <div
        style="
          display: flex;
          justify-content: space-around;
          align-items: center;
        "
      >
        <el-steps direction="vertical" :active="activeItemIndex">
          <el-step
            :title="itemName"
            v-for="(itemName, index) in salaryItemName"
            :key="index"
          ></el-step>
        </el-steps>
        <el-input
          v-model="salary[title]"
          :placeholder="'请输入' + salaryItemName[index] + '...'"
          v-for="(value, title, index) in salary"
          :key="index"
          v-show="activeItemIndex == index"
          style="width: 200px"
        ></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="preStep">{{
          activeItemIndex == 10 ? "取消" : "上一步"
        }}</el-button>
        <el-button type="primary" @click="nextStep">{{
          activeItemIndex == 10 ? "完成" : "下一步"
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SalSob",
  data() {
    return {
      dialogTitle: "添加工资账套",
      activeItemIndex: 0,
      salaries: [],
      dialogVisible: false,
      salaryItemName: [
        "账套名称",
        "基本工资",
        "交通补助",
        "午餐补助",
        "奖金",
        "养老金比率",
        "养老金基数",
        "医疗保险比率",
        "医疗保险基数",
        "公积金比率",
      ],
      salary: {
        name: "",
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionPer: 0,
        pensionBase: 0,
        medicalPer: 0,
        medicalBase: 0,
        accumulationFundPer: 0,
        accumulationFundBase: 0,
      },
    };
  },

  mounted() {
    this.initSalaries();
  },

  methods: {
    //点击编辑框
    showEditSalaryView(data) {
      this.dialogTitle = "编辑工资账套";
      this.salary.id=data.id;
      this.salary.name = data.name;
      this.salary.basicSalary = data.basicSalary;
      this.salary.trafficSalary = data.trafficSalary;
      this.salary.lunchSalary = data.lunchSalary;
      this.salary.bonus = data.bonus;
      this.salary.pensionPer = data.pensionPer;
      this.salary.pensionBase = data.pensionBase;
      this.salary.medicalPer = data.medicalPer;
      this.salary.medicalBase = data.medicalBase;
      this.salary.accumulationFundPer = data.accumulationFundPer;
      this.salary.accumulationFundBase = data.accumulationFundBase;
      this.dialogVisible = true;
      this.activeItemIndex = 0;
    },
    //删除
    deleteSalary(data) {
      this.$confirm(
        "此操作将永久删除【" + data.name + "】工资账套, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/salary/sob/" + data.id).then((resp) => {
            if (resp) {
              this.initSalaries();
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

    //上一步
    preStep() {
      if (this.activeItemIndex == 10) {
        this.dialogVisible = false;
      }
      this.activeItemIndex--;
    },
    //下一步
    nextStep() {
      if (this.activeItemIndex == 10) {
        //判断如果有id就是编辑,如果没有id,就是添加
        if (this.salary.id) {
          this.putRequest("/salary/sob/", this.salary).then((res) => {
            if (res) {
              this.initSalaries();
              this.dialogVisible = false;
            }
          });
        } else {
          this.postRequest(" /salary/sob/", this.salary).then((res) => {
            if (res) {
              this.initSalaries();
              this.dialogVisible = false;
            }
          });
          // console.log(this.salary);
        }
        return;
      }

      this.activeItemIndex++;
    },
    //展示添加工资账套框
    showAddSalaryView() {
      this.dialogTitle = "添加工资账套";
      this.salary = {
        name: "",
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionPer: 0,
        pensionBase: 0,
        medicalPer: 0,
        medicalBase: 0,
        accumulationFundPer: 0,
        accumulationFundBase: 0,
      };
      this.activeItemIndex = 0;
      this.dialogVisible = true;
    },
    initSalaries() {
      this.getRequest("/salary/sobcfg/salaries").then((res) => {
        if (res) {
          this.salaries = res;
        }
      });
    },
  },
};
</script>
<style lang='less' scoped>
</style>