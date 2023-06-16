<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">     //这是一个基于Element UI框架的后台管理系统的菜品管理页面的代码。页面包含一个搜索框、一个菜品列表、
                                 //一个批量操作栏和一个新建菜品按钮。菜品列表使用了Element UI的表格组件，包含了日期、姓名和地址三列信息
                                 //并且可以进行多选操作。页面还包含了一些操作按钮，如批量删除、批量启售、批量停售等。
        <el-input
            v-model="input"
            placeholder="请输入菜品名称"
            style="width: 250px"
            clearable
            @keyup.enter.native="handleQuery"
        >
          <i
              slot="prefix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer"
              @click="init"
          ></i>
        </el-input>
        <div class="tableLab">
          <span class="span-btn delBut non" @click="deleteHandle('批量', null)">批量删除</span>
          <span class="span-btn blueBug non" @click="statusHandle('1')">批量启售</span>
          <span style="border:none;" class="span-btn delBut non" @click="statusHandle('0')">批量停售</span>
          <el-button
              type="primary"
              @click="addFoodtype('add')"
          >
            + 新建菜品
          </el-button>
        </div>
      </div>
      <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          class="tableBox"
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            label="日期"
            width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="120">
        </el-table-column>
        <el-table-column
            prop="address"
            label="地址"
            show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
    </div>
  </div>
</template>
<script>    //展示一个表格，表格中包含了日期、姓名和地址三列，每一行数据都是一个对象，可以通过v-for指令遍历tableData数组来动态生成表格
            //同时，组件中还可以通过v-model指令绑定multipleSelection数组，实现多选功能。
export default {
  name: "ElementUITableTest",
  data() {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  } `toggleSelection(rows)`//该方法用于切换多选表格中的行的选中状态。如果传入了 `rows` 参数，
                                //则将 `rows` 数组中的每一行都切换选中状态；否则，清空所有选中状态。

`handleSelectionChange(val)`//该方法用于处理多选表格中选中行的变化。当选中行发生变化时，
     //`val` 参数会被更新为当前选中的行的数组。该方法将 `val` 赋值给组件的 `multipleSelection` 属性，以便在组件中使用选中的行数据。
}
</script>

<style scoped>
</style>
