<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="部门管理" name="DepMana"
        ><DepMana></DepMana
      ></el-tab-pane>
      <el-tab-pane label="职位管理" name="PosMana"
        ><PosMana></PosMana
      ></el-tab-pane>
      <el-tab-pane label="职称管理" name="JobLevelMana"
        ><JobLevelMana></JobLevelMana
      ></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="EcMana"
        ><EcMana></EcMana
      ></el-tab-pane>
      <el-tab-pane label="权限组" name="PemissMana"
        ><PemissMana></PemissMana
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DepMana from "@/components/sys/DepMana";
import JobLevelMana from "@/components/sys/JobLevelMana";
import PemissMana from "@/components/sys/PemissMana";
import PosMana from "@/components/sys/PosMana";
import EcMana from "@/components/sys/EcMana";
export default {
  name: "SysBasic",
  components: {
    DepMana,
    JobLevelMana,
    PemissMana,
    PosMana,
    EcMana,
  },
  data() {
    return {
      //默认激活
      activeName: "DepMana",
    };
  },

  mounted() {},

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style lang='less' scoped>
</style>