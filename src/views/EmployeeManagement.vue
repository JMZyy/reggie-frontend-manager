<template>
  <div class="dashboard-container" id="member-app">
    <div class="container">
      <div class="tableBar">
        <el-input
            v-model="input"
            placeholder="请输入员工姓名"
            style="width: 250px"
            clearable
            @keyup.enter.native="handleQuery"
        >   //这段代码是一个员工管理的前端页面，包含一个搜索框和一个添加员工的按钮。搜索框可以输入员工姓名进行搜索，也可以按回车键进行搜索。
           //表格中展示了员工的姓名、账号、手机号和账号状态，并且可以进行编辑和禁用/启用操作。其中，禁用/启用操作只有管理员账号才有权限进行。
          <i
              slot="prefix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer"
              @click="handleQuery"
          ></i>
        </el-input>
        <el-button
            type="primary"
            @click="addMemberHandle('add')"
        >
          + 添加员工
        </el-button>
      </div>
      <el-table
          :data="tableData"
          stripe
          class="tableBox"
      >
        <el-table-column
            prop="name"
            label="员工姓名"
        ></el-table-column>
        <el-table-column
            prop="username"
            label="账号"
        ></el-table-column>
        <el-table-column
            prop="phone"
            label="手机号"
        ></el-table-column>
        <el-table-column label="账号状态">
          <template slot-scope="scope">
            {{ String(scope.row.status) === '0' ? '已禁用' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="160"
            align="center"
        >
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                class="blueBug"
                @click="addMemberHandle(scope.row.id)"
                :class="{notAdmin:user !== 'admin'}"
            >
              编辑
            </el-button>
            <el-button
                type="text"
                size="small"
                class="delBut non"
                @click="statusHandle(scope.row)"
                v-if="user === 'admin'"
            >
              {{ scope.row.status == '1' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination>
          //这是一个基于 Element UI 组件库的分页组件 el-pagination 的使用代码。具体解释如下：

          //class="pageList"`为组件添加了一个自定义的 CSS 类名，用于自定义样式。
      //page-sizes="[2]"`：设置每页显示条数的下拉选项，这里只有一个选项，即每页显示 2 条数据。
          //page-size="pageSize"`：设置每页显示的数据条数，这个值是从父组件传递过来的。

          //layout="total, sizes, prev, pager, next, jumper"`：设置分页组件的布局，total 表示总条数，
          //sizes 表示每页显示条数的下拉选项，prev 表示上一页按钮，pager 表示页码，next 表示下一页按钮，jumper 表示跳转到指定页码的输入框。

          //total="counts"`：设置总数据条数，这个值是从父组件传递过来的。
          //current-page.sync="page"`：设置当前页码，这个值是从父组件传递过来的，并且使用了 .sync 修饰符，表示可以双向绑定。
          //@size-change="handleSizeChange"`：当每页显示条数发生变化时，触发 handleSizeChange 方法。
          //@current-change="handleCurrentChange"`：当当前页码发生变化时，触发 handleCurrentChange 方法。
          class="pageList"
          :page-sizes="[2]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          :current-page.sync="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>

</template>

<script>
import {getMemberList, enableOrDisableEmployee} from "../../../../qiyeshixun/reggie-frontend-manager/src/api/member"
import {mapGetters} from "vuex";

export default {    //这段代码是一个Vue组件，名为EmployeeManagement.vue，其中包含了一些数据和方法。
//在data中，定义了一些数据，包括input、counts、page、pageSize、tableData、id、status和user。

//其中，input表示搜索框中的输入内容，counts表示总记录数，page表示当前页码，pageSize表示每页显示的记录数，tableData表示表格中的数据，
//id表示员工ID，status表示员工状态，user表示当前登录员工的账号。
//在computed中，使用了Vuex的mapGetters方法，获取了名为getUserInfo的getter，用于获取当前登录员工的信息。

//在created钩子函数中，调用了init方法，用于初始化页面数据。同时，如果getUserInfo不为null，则将其解析为JSON对象，并将其中的username赋值给user。

//在methods中，定义了一些方法，包括init、handleQuery等。其中，init方法用于获取员工列表数据，并将其赋值给tableData和counts；
//handleQuery方法用于处理搜索框中的查询操作，将page重置为1，并调用init方法重新获取数据。

  name: "EmployeeManagement.vue",
  data() {
    return {
      input: '',
      counts: 0,
      page: 1,
      pageSize: 2,
      tableData: [],
      id: '',
      status: '',
      user: '',
    }
  },
  computed: {
    ...mapGetters("employee", ["getUserInfo"]),
  },
  created() {
    this.init()

    if (this.getUserInfo != null) {
      //获取当前登录员工的账号，并赋值给模型数据user
      this.user = JSON.parse(this.getUserInfo).username
    }
  },
  mounted() {
  },
  methods: {
    async init() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.input ? this.input : undefined
      }
      await getMemberList(params).then(res => {
        if (String(res.code) === '1') {
          this.tableData = res.data.records || []
          this.counts = res.data.total
        }
      }).catch(err => {
        this.$message.error('请求出错了：' + err)
      })
    },
    handleQuery() {
      this.page = 1;
      this.init();
    },
    // 添加
    // `addMemberHandle(st)`：根据传入的参数 `st` 的值，判断是添加员工还是修改员工，然后调用父组件的 `handleSelect` 方法，传入相应的参数。
   // statusHandle(row)`：根据传入的参数 `row` 中的 `id` 和 `status` 属性，弹出确认框，
    //确认后调用 \`enableOrDisableEmployee\` 方法，传入相应的参数，根据返回结果进行相应的提示和操作。
   //handleSizeChange(val)`：根据传入的参数 `val`，改变当前页显示的数据条数，并重新调用 `init` 方法进行数据初始化。
   //handleCurrentChange(val)`：根据传入的参数 `val`，改变当前页码，并重新调用 `init` 方法进行数据初始化。
    addMemberHandle(st) {
      if (st === 'add') {
        window.parent.handleSelect({
          index: '1',
          route: '/dashboard/add-employee',
          title: '添加员工'
        }, true)
      } else {
        window.parent.handleSelect({
          index: '1',
          route: '/dashboard/add-employee',
          id: st,
          name: '修改员工'
        }, true)
      }
    },
    //状态修改
    statusHandle(row) {
      this.id = row.id
      this.status = row.status
      this.$confirm('确认调整该账号的状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        enableOrDisableEmployee({'id': this.id, 'status': !this.status ? 1 : 0}).then(res => {
          console.log('enableOrDisableEmployee', res)
          if (String(res.code) === '1') {
            this.$message.success('账号状态更改成功！')
            this.handleQuery()
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page = val
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
