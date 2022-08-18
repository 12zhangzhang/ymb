<template>
  <div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-input
            prefix-icon="el-icon-search"
            placeholder="请输入员工名搜索..."
            style="width: 400px"
            v-model="empName"
            @keydown.enter.native="initEmps"
            clearable
            @clear="initEmps"
            :disabled="showAdvanceSearchVisible"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            style="margin-left: 10px"
            @click="initEmps"
            :disabled="showAdvanceSearchVisible"
            >搜索</el-button
          >
          <el-button
            type="primary"
            style="margin-left: 10px"
            @click="showAdvanceSearchVisible = !showAdvanceSearchVisible"
          >
            <i
              :class="
                showAdvanceSearchVisible
                  ? 'fa fa-angle-double-up'
                  : 'fa fa-angle-double-down'
              "
              aria-hidden="true"
            ></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-upload
            style="display: inline-flex; margin-right: 8px"
            action="/employee/import"
            :headers="headers"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :disabled="importDataDisabled"
          >
            <el-button
              type="success"
              :icon="importDataBtnIcon"
              :disabled="importDataDisabled"
            >
              {{ importDataBtnText }}
            </el-button>
          </el-upload>

          <el-button type="success" @click="exportData" icon="el-icon-download">
            导出数据
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
            添加员工
          </el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <!-- 高级搜索 -->
      <div
        style="
          border: 1px solid #409eff;
          border-radius: 5px;
          box-sizing: border-box;
          padding: 5px;
          margin: 5px 0px;
        "
        v-show="showAdvanceSearchVisible"
      >
        <el-row>
          <el-col :span="5">
            政治面貌
            <el-select
              v-model="searchValue.politicId"
              size="mini"
              style="width: 130px"
              placeholder="政治面貌"
            >
              <el-option
                v-for="item in politicsstatus"
                size="mini"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            民族:
            <el-select
              v-model="searchValue.nationId"
              placeholder="民族"
              size="mini"
              prefix-icon="el-icon-edit"
              style="width: 130px"
            >
              <el-option
                v-for="item in nations"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职位
            <el-select
              v-model="searchValue.posId"
              placeholder="职位"
              size="mini"
              prefix-icon="el-icon-edit"
              style="width: 130px"
            >
              <el-option
                v-for="item in positions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职称
            <el-select
              v-model="emp.jobLevelId"
              placeholder="职称"
              size="mini"
              prefix-icon="el-icon-edit"
              style="width: 130px"
            >
              <el-option
                v-for="item in joblevels"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            聘用形式
            <el-radio-group v-model="searchValue.engageForm">
              <el-radio label="劳动合同">劳动合同</el-radio>
              <el-radio label="劳务合同">劳务合同</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="5">
            所属部门
            <el-popover
              placement="bottom"
              title="请选择部门"
              width="200px"
              trigger="manual"
              v-model="visible2"
              ><el-tree
                :data="allDeps"
                :props="defaultProps"
                @node-click="searchHandleNodeClick"
                default-expand-all
              ></el-tree>
              <div
                slot="reference"
                style="
                  width: 130px;
                  display: inline-flex;
                  border: 1px solid #dedede;
                  height: 25px;
                  border-radius: 5px;
                  cursor: pointer;
                  margin-top: 0px;
                  line-height: 25px;
                  font-size: 8px;
                  padding-left: 15px;
                  box-sizing: border-box;
                "
                @click="showDepView2"
              >
                {{ inputDepName }}
              </div>
            </el-popover>
          </el-col>
          <el-col :span="10">
            入职日期
            <el-date-picker
              value-format="yyyy-MM-dd"
              size="mini"
              v-model="searchValue.beginDateScope"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="5" :offset="4">
            <el-button size="mini">取消</el-button>
            <el-button
              icon="el-icon-search"
              type="primary"
              size="mini"
              @click="initEmps('advanced')"
              >搜索</el-button
            >
          </el-col>
        </el-row>
      </div>
    </transition>
    <div style="margin-top: 10px">
      <el-table
        :data="emps"
        stripe
        border
        style="width: 100%"
        v-loading="loading"
        height="500"
      >
        <el-table-column type="selection" width="55" fixed> </el-table-column>
        <el-table-column prop="name" label="姓名" width="90" align="left">
        </el-table-column>
        <el-table-column prop="workID" label="工号" width="85" align="left">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="85" align="left">
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="出生日期"
          width="85"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号码"
          width="150"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="wedlock"
          label="婚姻状况"
          width="100"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="nation.name"
          label="民族"
          width="50"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="nativePlace"
          label="籍贯"
          width="80"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="politicsStatus.name"
          label="政治面貌"
          width="100"
          align="left"
        >
        </el-table-column>
        <el-table-column prop="email" label="电子邮件" width="180" align="left">
        </el-table-column>
        <el-table-column prop="phone" label="电话号码" width="100" align="left">
        </el-table-column>
        <el-table-column
          prop="address"
          label="联系地址"
          width="300"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="department.name"
          label="所属部门"
          width="100"
          align="left"
        >
        </el-table-column>
         <el-table-column
          prop="jobLevelId"
          label="职称"
          width="100"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="position.name"
          label="所属职位"
          width="100"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="engageForm"
          label="聘用形式"
          width="100"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="tiptopDegree"
          label="最高学历"
          width="80"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="school"
          label="毕业院校"
          width="150"
          align="left"
        >
        </el-table-column>
        <el-table-column prop="specialty" label="专业" width="150" align="left">
        </el-table-column>
        <el-table-column
          prop="workState"
          label="在职状态"
          width="70"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="beginDate"
          label="入职日期"
          width="95"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="conversionTime"
          label="转正日期"
          width="95"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="beginContract"
          label="合同起始日期"
          width="95"
          align="left"
        >
        </el-table-column>
        <el-table-column label="合同年限" width="100" align="left">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag
            >年
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              style="padding: 3px"
              size="mini"
              @click="showEditEmpView(scope.row)"
              >编辑</el-button
            >
            <el-button type="primary" style="padding: 3px" size="mini"
              >查看高级资料</el-button
            >
            <el-button
              type="danger"
              style="padding: 3px"
              size="mini"
              @click="deleteEmp(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="sizes,prev, pager, next,jumper,->,total"
        :total="total"
        style="float: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
      <div>
        <el-form ref="empForm" :rules="rules" :model="emp">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名:" prop="name">
                <el-input
                  prefix-icon="el-icon-edit"
                  size="mini"
                  style="width: 150px"
                  v-model="emp.name"
                  placeholder="请输入员工姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                  v-model="emp.birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  size="mini"
                  style="width: 150px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌:" prop="politicId">
                <el-select
                  v-model="emp.politicId"
                  placeholder="政治面貌"
                  size="mini"
                >
                  <el-option
                    v-for="item in politicsstatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="民族:" prop="nationId">
                <el-select
                  v-model="emp.nationId"
                  placeholder="民族"
                  size="mini"
                  prefix-icon="el-icon-edit"
                  style="width: 150px"
                >
                  <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input
                  prefix-icon="el-icon-edit"
                  style="width: 120px"
                  v-model="emp.nativePlace"
                  placeholder="请输入籍贯"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input
                  prefix-icon="el-icon-edit"
                  style="width: 150px"
                  v-model="emp.email"
                  placeholder="请输入邮箱"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址:" prop="address">
                <el-input
                  prefix-icon="el-icon-edit"
                  style="width: 200px"
                  v-model="emp.address"
                  placeholder="请输入联系地址"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="posId">
                <el-select
                  v-model="emp.posId"
                  placeholder="职位"
                  size="mini"
                  prefix-icon="el-icon-edit"
                  style="width: 150px"
                >
                  <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select
                  v-model="emp.jobLevelId"
                  placeholder="职称"
                  size="mini"
                  prefix-icon="el-icon-edit"
                  style="width: 150px"
                >
                  <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门:" prop="departmentId">
                <el-popover
                  placement="bottom"
                  title="请选择部门"
                  width="200"
                  trigger="manual"
                  v-model="visible"
                  ><el-tree
                    :data="allDeps"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    default-expand-all
                  ></el-tree>
                  <div
                    slot="reference"
                    style="
                      width: 150px;
                      display: inline-flex;
                      border: 1px solid #dedede;
                      height: 28px;
                      border-radius: 5px;
                      cursor: pointer;
                      margin-top: 5px;
                      line-height: 28px;
                      font-size: 8px;
                      padding-left: 15px;
                      box-sizing: border-box;
                    "
                    @click="showDepView"
                  >
                    {{ inputDepName }}
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码:" prop="phone">
                <el-input
                  style="width: 200px"
                  v-model="emp.phone"
                  placeholder="请输入电话号码"
                  size="mini"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="workID">
                <el-input
                  style="width: 150px"
                  v-model="emp.workID"
                  placeholder="请输入工号"
                  size="mini"
                  prefix-icon="el-icon-edit"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历:" prop="tiptopDegree">
                <el-select
                  v-model="emp.tiptopDegree"
                  placeholder="学历"
                  size="mini"
                  prefix-icon="el-icon-edit"
                  style="width: 150px"
                >
                  <el-option
                    v-for="item in tiptopDegrees"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校:" prop="school">
                <el-input
                  style="width: 150px"
                  v-model="emp.school"
                  placeholder="请输入毕业院校"
                  size="mini"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称:" prop="specialty">
                <el-input
                  style="width: 200px"
                  v-model="emp.specialty"
                  placeholder="请输入专业名称"
                  size="mini"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期:" prop="beginDate">
                <el-date-picker
                  v-model="emp.beginDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="入职日期"
                  size="mini"
                  style="width: 130px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="转正日期:" prop="conversionTime">
                <el-date-picker
                  v-model="emp.conversionTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="转正日期"
                  size="mini"
                  style="width: 130px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期:" prop="beginContract">
                <el-date-picker
                  v-model="emp.beginContract"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="合同起始日期"
                  size="mini"
                  style="width: 130px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="合同截止日期:" prop="endContract">
                <el-date-picker
                  v-model="emp.endContract"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="合同截止日期"
                  size="mini"
                  style="width: 170px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号:" prop="idCard">
                <el-input
                  style="width: 200px"
                  v-model="emp.idCard"
                  placeholder="身份证号"
                  size="mini"
                  prefix-icon="el-icon-edit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式:" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况:" prop="wedlock">
                <el-radio-group v-model="emp.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddEmp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      searchValue: {
        nationId: null,
        posId: null,
        politicId: null,
        jobLevelId: null,
        engageForm: "",
        departmentId: null,
        beginDateScope: null,
      },
      //是否展示高级搜索框
      showAdvanceSearchVisible: false,
      headers: {
        Authorization: window.sessionStorage.getItem("tokenStr"),
      },
      importDataDisabled: false,
      importDataBtnText: "导入数据",
      importDataBtnIcon: "el-icon-upload2",
      title: "",
      value: "",
      visible: false,
      visible2: false,
      emps: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      empName: "",
      dialogVisible: false,
      nations: [],
      joblevels: [],
      politicsstatus: [],
      positions: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      allDeps: [],
      //所属部门的输入框的值
      inputDepName: "",
      tiptopDegrees: [
        "博士",
        "硕士",
        "本科",
        "大专",
        "高中",
        "初中",
        "小学",
        "其他",
      ],
      emp: {
        address: "",
        beginContract: "",
        beginDate: "",
        birthday: "",
        contractTerm: "",
        conversionTime: "",
        department: {},
        departmentId: null,
        email: "",
        endContract: "",
        engageForm: "",
        gender: "",
        id: null,
        idCard: "",
        jobLevelId: null,
        joblevel: {},
        name: "",
        nation: {},
        nationId: null,
        nativePlace: "",
        notWorkDate: "",
        phone: "",
        politicId: null,
        politicsStatus: {},
        posId: null,
        position: {},
        salary: {},
        salaryId: null,
        school: "",
        specialty: "",
        tiptopDegree: "",
        wedlock: "",
        workAge: null,
        workID: "",
        workState: "在职",
      },

      rules: {
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        beginContract: [
          { required: true, message: "请输入合同起始日期", trigger: "blur" },
        ],
        beginDate: [
          { required: true, message: "请输入入职日期", trigger: "blur" },
        ],
        birthday: [
          { required: true, message: "请输入出生日期", trigger: "blur" },
        ],
        contractTerm: [
          { required: true, message: "请输入合同期限", trigger: "blur" },
        ],
        conversionTime: [
          { required: true, message: "请输入转正日期", trigger: "blur" },
        ],
        departmentId: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入电子邮件", trigger: "blur" },
          {
            type: "email",
            required: true,
            message: "邮箱地址格式不正确",
            trigger: "change",
          },
        ],
        endContract: [
          { required: true, message: "请输入合同结束日期", trigger: "blur" },
        ],
        engageForm: [
          { required: true, message: "请输入聘用方式", trigger: "blur" },
        ],
        gender: [{ required: true, message: "请输入性别", trigger: "blur" }],
        idCard: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          {
            pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "身份证号码格式不正确",
            trigger: "blur",
          },
        ],
        jobLevelId: [
          { required: true, message: "请输入职称", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        nationId: [{ required: true, message: "请输入民族", trigger: "blur" }],
        nativePlace: [
          { required: true, message: "请输入籍贯", trigger: "blur" },
        ],
        notWorkDate: [
          { required: true, message: "请输入离职日期", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        politicId: [
          { required: true, message: "请输入政治面貌", trigger: "blur" },
        ],
        posId: [{ required: true, message: "请输入职位", trigger: "blur" }],
        school: [
          { required: true, message: "请输入毕业院校", trigger: "blur" },
        ],
        specialty: [{ required: true, message: "请输入专业", trigger: "blur" }],
        tiptopDegree: [
          { required: true, message: "请输入学历", trigger: "blur" },
        ],
        wedlock: [
          { required: true, message: "请输入婚姻状况", trigger: "blur" },
        ],
        workAge: [{ required: true, message: "请输入工龄", trigger: "blur" }],
        workID: [{ required: true, message: "请输入工号", trigger: "blur" }],
        workState: [
          { required: true, message: "请输入工作状态", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.initEmps();
    this.initData();
    this.initPosition();
  },

  methods: {
    //高级搜索中所属部门的弹出框的显示
    showDepView2() {
      this.visible2 = !this.visible2;
    },
    //高级搜索中所属部门的树形控件的处理
    searchHandleNodeClick(data) {
      this.inputDepName = data.name;
      this.searchValue.departmentId = data.id;
      this.visible2 = !this.visible2;
    },
    //上传成功时的钩子
    onSuccess() {
      //导入数据按钮的图标
      this.importDataBtnIcon = "el-icon-upload2";
      //导入数据按钮的文本内容
      this.importDataBtnText = "导入数据";
      //导入按钮是否禁用
      this.importDataDisabled = false;
      //更新员工列表
      this.initEmps();
    },
    //上传失败时的钩子
    onError() {
      this.importDataBtnIcon = "el-icon-upload2";
      this.importDataBtnText = "导入数据";
      this.importDataDisabled = false;
    },
    //导入前的钩子函数
    beforeUpload() {
      this.importDataBtnIcon = "el-icon-loading";
      this.importDataBtnText = "正在导入";
      //禁用
      this.importDataDisabled = true;
    },
    //导出
    exportData() {
      this.downloadRequest("/employee/export");
    },
    //编辑员工
    showEditEmpView(data) {
      this.title = "编辑员工信息";
      this.dialogVisible = true;
      this.emp = data;
      //单独处理职位
      this.initPosition();
      // 单独处理所属部门
      this.inputDepName = data.department.name;
    },
    //删除员工
    deleteEmp(data) {
      this.$confirm(
        "此操作将永久删除【" + data.name + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/employee/" + data.id).then((resp) => {
            if (resp) {
              this.initEmps();
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
    //添加/编辑员工
    doAddEmp() {
      //判断是否有id,如果有id就是编辑,如果没有id,就是添加
      if (this.emp.id) {
        this.$refs["empForm"].validate((valid) => {
          if (valid) {
            this.putRequest("/employee/", this.emp).then((res) => {
              if (res) {
                this.initEmps();
                this.dialogVisible = false;
              }
            });
          }
        });
      } else {
        this.$refs["empForm"].validate((valid) => {
          if (valid) {
            this.postRequest("/employee/", this.emp).then((res) => {
              if (res) {
                this.initEmps();
                this.dialogVisible = false;
              }
            });
          }
        });
      }
    },
    //树形控件事件
    handleNodeClick(data) {
      this.inputDepName = data.name;
      this.emp.departmentId = data.id;
      this.visible = !this.visible;
    },
    // 所属部门
    showDepView() {
      this.visible = !this.visible;
    },

    //获取工号  最大id,在展示弹出框的时候调用
    getMaxWorkID() {
      this.getRequest("/employee/maxWorkID").then((res) => {
        this.emp.workID = res.obj;
      });
    },
    //初始化职位数据,在打开对话框的时候调用
    initPosition() {
      this.getRequest("/employee/positions").then((res) => {
        if (res) {
          this.positions = res;
        }
      });
    },

    //初始化数据(不怎么变动的)
    initData() {
      if (!window.sessionStorage.getItem("nations")) {
        this.getRequest("/employee/nations").then((res) => {
          if (res) {
            this.nations = res;
            window.sessionStorage.setItem("nations", JSON.stringify(res));
          }
        });
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
      }
      if (!window.sessionStorage.getItem("joblevels")) {
        this.getRequest("/employee/joblevels").then((res) => {
          if (res) {
            this.joblevels = res;
            window.sessionStorage.setItem("joblevels", JSON.stringify(res));
          }
        });
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
      }
      if (!window.sessionStorage.getItem("politicsstatus")) {
        this.getRequest("/employee/politicsstatus").then((res) => {
          if (res) {
            this.politicsstatus = res;
            window.sessionStorage.setItem(
              "politicsstatus",
              JSON.stringify(res)
            );
          }
        });
      } else {
        this.politicsstatus = JSON.parse(
          window.sessionStorage.getItem("politicsstatus")
        );
      }
      if (!window.sessionStorage.getItem("allDeps")) {
        this.getRequest("/employee/deps").then((res) => {
          if (res) {
            this.allDeps = res;
            window.sessionStorage.setItem("allDeps", JSON.stringify(res));
          }
        });
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("allDeps"));
      }
    },
    //添加员工
    showAddEmpView() {
      this.emp = {
        id: null,
        address: "",
        beginContract: "",
        beginDate: "",
        birthday: "",
        contractTerm: "",
        conversionTime: "",
        department: {},
        departmentId: null,
        email: "",
        endContract: "",
        engageForm: "",
        gender: "",
        id: null,
        idCard: "",
        jobLevelId: null,
        joblevel: {},
        name: "",
        nation: {},
        nationId: null,
        nativePlace: "",
        notWorkDate: "",
        phone: "",
        politicId: null,
        politicsStatus: {},
        posId: null,
        position: {},
        salary: {},
        salaryId: null,
        school: "",
        specialty: "",
        tiptopDegree: "",
        wedlock: "",
        workAge: null,
        workID: "",
        workState: "在职",
      };
      this.inputDepName = "";
      this.initPosition();
      this.getMaxWorkID();
      this.title = "添加员工";
      this.dialogVisible = true;
    },

    //员工信息展示,包括搜索和分页
    initEmps(type) {
      // console.log(type);
      this.loading = true;
      //高级搜索的处理
      let url =
        "/employee/?currentPage=" + this.currentPage + "&size=" + this.size;
      if (type && type == "advanced") {
        if (this.searchValue.politicId) {
          url += "&politicId=" + this.searchValue.politicId;
        }
        if (this.searchValue.nationId) {
          url += "&nationId=" + this.searchValue.nationId;
        }
        if (this.searchValue.posId) {
          url += "&posId=" + this.searchValue.posId;
        }
        if (this.searchValue.jobLevelId) {
          url += "&jobLevelId=" + this.searchValue.jobLevelId;
        }
        if (this.searchValue.engageForm) {
          url += "&engageForm=" + this.searchValue.engageForm;
        }
        if (this.searchValue.departmentId) {
          url += "&departmentId=" + this.searchValue.departmentId;
        }
        if (this.searchValue.beginDateScope) {
          url += "&beginDateScope=" + this.searchValue.beginDateScope;
        }
      } else {
        //普通搜索的处理
        url += "&name=" + this.empName;
      }
      this.getRequest(url).then((res) => {
        this.loading = false;
        // console.log(res);
        if (res) {
          this.emps = res.data;
          this.total = res.total;
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.initEmps();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.initEmps();
    },
  },
};
</script>
<style lang='less' scoped>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>