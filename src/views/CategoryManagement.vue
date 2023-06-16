<template>
  <div class="dashboard-container" id="category-app">
    <div class="container">
      <div>
          class="tableBar"
          style="display: inline-block"      //一个div元素，设置了class为"tableBar"，并且设置了样式"display: inline-block"。
      >
        <el-button
            type="primary"
            class="continue"
            @click="addClass('class')"
        > //饿了么UI库的button组件，设置了type为"primary"，class为"continue"，并且绑定了一个点击事件@click，当点击按钮时会调用组件中的addClass方法，并传入参数"class"。
          + 新增菜品分类
        </el-button>
        <el-button
            type="primary"
            @click="addClass('meal')"
        >  //另一个饿了么UI库的button组件,设置了type为"primary"，并且绑定了一个点击事件@click，当点击按钮时会调用组件中的addClass方法，并传入参数"meal"。
          + 新增套餐分类
        </el-button>
      </div>
      <el-table
          :data="tableData"
          stripe
          class="tableBox"
      >                               //用el-table 来展示数据
        <el-table-column
            prop="name"
            label="分类名称"
        />
        <el-table-column
            prop="type"
            label="分类类型"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.type == '1' ? '菜品分类' : '套餐分类' }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="updateTime"
            label="操作时间"
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column
            prop="sort"
            label="排序"
        >
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
                @click="editHandle(scope.row)"
            >   //使用了 slot-scope 属性来自定义该列的内容，添加了两个按钮，分别用于修改和删除该行数据。
              修改
            </el-button>
            <el-button
                type="text"
                size="small"
                class="delBut non"
                @click="deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pageList"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></el-pagination>                   //el-pagination是一个分页组件
    </div>
    <el-dialog
        :title="classData.title"
        :visible.sync="classData.dialogVisible"
        width="30%"
        :before-close="handleClose"
    >                                      //el-dialog是一个弹窗组件
      <el-form
          class="demo-form-inline"
          label-width="100px"
      >                                 //el-form是表单组件  包含了两个表单项：分类名称和排序
        <el-form-item label="分类名称：">
          <el-input
              v-model="classData.name"
              placeholder="请输入分类名称"
              maxlength="14"
          />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="classData.sort" type="number" placeholder="请输入排序"/>
        </el-form-item>
      </el-form>
      <span
          slot="footer"
          class="dialog-footer"
      >    #这个组件还包含了一些事件处理函数，如handleSizeChange和handleCurrentChange用于处理分页信息的变化，submitForm用于提交表单数据。
        <el-button
            size="medium"
            @click="classData.dialogVisible = false"
        >取 消</el-button>
        <el-button
            type="primary"
            size="medium"
            @click="submitForm()"
        >确 定</el-button>
        <el-button
            v-if="action != 'edit'"
            type="primary"
            size="medium"
            class="continue"
            @click="submitForm('go')"
        > 保存并继续添加 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getCategoryPage,deleCategory,addCategory,editCategory} from "../../../../qiyeshixun/reggie-frontend-manager/src/api/category"


export default {
  name: "CategoryManagement",
  data() {  //Vue组件的定义 组件名为"CategoryManagement"，data()是Vue组件中的一个选项，用于定义组件的数据
            //在这里，data()返回一个对象，包含了组件中需要用到的数据。
    return {                          //action: 用于存储当前操作的类型，比如添加、编辑、删除等。
-                                     //counts: 用于存储分类的总数。
-                                     //page: 当前页码。
-                                     //pageSize: 每页显示的分类数量。
-                                     //tableData: 用于存储分类数据的数组。
-                                     //type: 用于存储分类的类型，比如菜品分类、酒水分类等。
-                                      //classData: 一个对象，包含了添加菜品分类的相关数据，比如对话框是否可见、分类ID、名称、排序等。
      action: '',
      counts: 0,
      page: 1,
      pageSize: 10,
      tableData: [],
      type: '',
      classData: {
        'title': '添加菜品分类',
        'dialogVisible': false,
        'categoryId': '',
        'name': '',
        'sort': ''
      }
    }
  },
  computed: {},
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    async init() {        //在init()方法中，通过调用getCategoryPage()方法获取数据，并将数据赋值给tableData和counts变量。
                          //如果获取数据失败，则会弹出错误提示    是一个异步请求方法
      await getCategoryPage({'page': this.page, 'pageSize': this.pageSize}).then(res => {
        if (String(res.code) === '1') {
          this.tableData = res.data.records
          this.counts = Number(res.data.total)
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      }).catch(err => {
        this.$message.error('请求出错了：' + err)
      })
    },
    handleQuery() {         //handleQuery()方法用于处理查询操作，将当前页数page设置为1，然后调用init()方法重新获取数据。
      this.page = 1;
      this.init();
    },
    // 添加
    addClass(st) {
      if (st == 'class') {
        this.classData.title = '新增菜品分类'
        this.type = '1'
      } else {
        this.classData.title = '新增套餐分类'
        this.type = '2'
      }
      this.action = 'add'
      this.classData.name = ''
      this.classData.sort = ''
      this.classData.dialogVisible = true
    },
    editHandle(dat) {
      this.classData.title = '修改分类'
      this.action = 'edit'
      this.classData.name = dat.name
      this.classData.sort = dat.sort
      this.classData.id = dat.id
      this.classData.dialogVisible = true
    },
    // 关闭弹窗
    // eslint-disable-next-line no-unused-vars
    handleClose(st) {
      this.classData.dialogVisible = false
    },
    //删除
    deleteHandle(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        deleCategory(id).then(res => {
          if (res.code === 1) {
            this.$message.success('删除成功！')
            this.handleQuery()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
      })
    },
    //数据提交
    submitForm(st) {
      const classData = this.classData
      const valid = (classData.name === 0 || classData.name) && (classData.sort === 0 || classData.sort)
      if (this.action === 'add') {
        if (valid) {
          const reg = /^\d+$/
          if (reg.test(classData.sort)) {
            addCategory({'name': classData.name, 'type': this.type, sort: classData.sort}).then(res => {
              console.log(res)
              if (res.code === 1) {
                this.$message.success('分类添加成功！')
                if (!st) {
                  this.classData.dialogVisible = false
                } else {
                  this.classData.name = ''
                  this.classData.sort = ''
                }
                this.handleQuery()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错了：' + err)
            })
          } else {
            this.$message.error('排序只能输入数字类型')
          }

        } else {
          this.$message.error('请输入分类名称或排序')
        }
      } else if (valid) {
        const reg = /^\d+$/
        if (reg.test(this.classData.sort)) {
          editCategory({'id': this.classData.id, 'name': this.classData.name, sort: this.classData.sort}).then(res => {
            if (res.code === 1) {
              this.$message.success('分类修改成功！')
              this.classData.dialogVisible = false
              this.handleQuery()
            } else {
              this.$message.error(res.msg || '操作失败')
            }
          }).catch(err => {
            this.$message.error('请求出错了：' + err)
          })
        } else {
          this.$message.error('排序只能输入数字类型')
        }
      } else {
        this.$message.error('请输入分类名称或排序')
      }
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
