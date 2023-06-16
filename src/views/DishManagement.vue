<template>
  <div class="dashboard-container" id="food-app">
    <div class="container">
      <div class="tableBar">
        <el-input    //这段代码是一个包含搜索框、操作按钮和新建菜品按钮的表格头部。其中，搜索框使用了 Element UI 的 el-input 组件，
                     //可以输入菜品名称进行搜索，并且可以点击搜索图标或按下回车键触发搜索事件。操作按钮包括批量删除、批量启售和批量停售，
                     //击按钮会触发相应的事件处理函数。新建菜品按钮使用了 Element UI 的 el-button 组件，
                     //点击按钮会触发添加菜品的事件处理函数。整个表格头部使用了一个 div 容器，并设置了一些样式。
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
          :data="tableData"
          stripe
          class="tableBox"
          @selection-change="handleSelectionChange"
      >
        <el-table-column>  //第一个 el-table-column 组件是选择列  type 属性为 selection，width 属性为列宽度。
            type="selection"
            width="50
        ></el-table-column>
        <el-table-column>     //el-table-column 组件是图片列 使用了 Element UI 中的 el-image 组件来展示图片，
            prop="name"      //并使用了 slot-scope 来获取当前行的数据
            label="菜品名称"
        ></el-table-column>
        <el-table-column prop="image" label="图片" align="center">
          <template slot-scope="{ row }">
            <el-image style="width: auto; height: 40px; border:none;cursor: pointer;"
                      :src="getImage(row.image)"
                      :preview-src-list="[ `${apiUrl}/common/download?name=${row.image}` ]">
              <div slot="error" class="image-slot">
                <img src="../../../../qiyeshixun/reggie-frontend-manager/src/images/noImg.png" style="width: auto; height: 40px; border:none;">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column>
            prop="categoryName"    //el-table-column 组件是菜品分类列 el-table-column 组件是菜品分类列，prop 属性为 categoryName。
            label="菜品分类"
        ></el-table-column>
        <el-table-column label="售价">    //el-table-column 组件是售价列，使用了 slot-scope 来格式化价格数据。
          <template slot-scope="scope">
            <span style="margin-right: 10px;">￥{{ scope.row.price / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="售卖状态">         //el-table-column 组件是售卖状态列，使用了 slot-scope 来根据状态值显示停售或启售。
          <template slot-scope="scope">
            <span style="margin-right: 10px;">{{ scope.row.status == '0' ? '停售' : '启售' }}</span>
          </template>
        </el-table-column>
        <el-table-column>
            prop="updateTime"    //el-table-column 组件是最后操作时间列 prop 属性为 updateTime
            label="最后操作时间"
        >
        </el-table-column>
        <el-table-column>
            label="操作"      //el-table-column 组件是操作列 包含两个 el-button 按钮，分别用于修改和删除菜品。
            width="160"
            align="center"
        >
          <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                class="blueBug"
                @click="addFoodtype(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
                type="text"
                size="small"
                class="blueBug"
                @click="statusHandle(scope.row)"
            >
              {{ scope.row.status == '0' ? '启售' : '停售' }}
            </el-button>
            <el-button
                type="text"
                size="small"
                class="delBut non"
                @click="deleteHandle('单删', scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination>         //这段代码是使用 Element UI 组件库中的分页组件 el-pagination
          class="pageList"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          @size-change="handleSizeChange"
          :current-page.sync="page"
          @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {getDishPage, deleteDish, dishStatusByStatus} from "../../../../qiyeshixun/reggie-frontend-manager/src/api/dish"

export default {
  name: "DishManagement.vue",
  data() {
    return {
      input: '',
      counts: 0,
      page: 1,
      pageSize: 10,
      tableData: [],
      dishState: '',
      checkList: [],
      apiUrl: this.$apiBaseUrl
    }                            // 主要实现了菜品管理的功能
                //name` 属性指定了组件的名称为 `DishManagement.vue`。
         //data` 方法返回了组件的数据对象，包括搜索框的输入值、当前页码、每页显示数量、表格数据、菜品状态、选中的菜品列表和接口地址等。
                 /computed` 属性为空，表示没有计算属性。
                 //created` 钩子函数在组件实例创建后立即执行，调用了 `init` 方法初始化页面数据。
                 //mounted` 钩子函数在组件挂载后执行，但是这里没有实现任何功能。
                 //methods` 属性包含了组件的方法，其中：
                 //init` 方法通过调用 `getDishPage` 接口获取菜品列表数据，并将数据赋值给表格数据和总记录数。
                 //getImage` 方法用于拼接图片的完整地址。
                 //handleQuery` 方法用于处理搜索框的查询操作，将页码重置为1并重新调用 `init` 方法获取数据。
  },
  computed: {},
  created() {
    this.init()
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
      await getDishPage(params).then(res => {
        if (String(res.code) === '1') {
          this.tableData = res.data.records || []
          this.counts = res.data.total
        }
      }).catch(err => {
        this.$message.error('请求出错了：' + err)
      })
    },
    getImage(image) {
      return `${this.apiUrl}/common/download?name=${image}`
    },
    handleQuery() {
      this.page = 1;
      this.init();
    },
    // 添加
    addFoodtype(st) {
      if (st === 'add') {
        window.parent.handleSelect({
          index: '2',
          route: '/dashboard/add-dish',
          title: '添加菜品'
        }, true)
      } else {
        window.parent.handleSelect({
          index: '2',
          route: '/dashboard/add-dish',
          name: '修改菜品',
          id: st
        }, true)
      }
    },

    // 删除
    deleteHandle(type, id) {
      if (type === '批量' && id === null) {
        if (this.checkList.length === 0) {
          return this.$message.error('请选择删除对象')
        }
      }
      this.$confirm('确认删除该菜品, 是否继续?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(() => {
        deleteDish(type === '批量' ? this.checkList.join(',') : id).then(res => {
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

    //状态更改
    statusHandle(row) {
      let params = {}
      if (typeof row === 'string') {
        if (this.checkList.length === 0) {
          this.$message.error('批量操作，请先勾选操作菜品！')
          return false
        }
        params.id = this.checkList.join(',')
        params.status = row
      } else {
        params.id = row.id
        params.status = row.status ? '0' : '1'
      }
      this.dishState = params
      this.$confirm('确认更改该菜品状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        // 起售停售---批量起售停售接口
        dishStatusByStatus(this.dishState).then(res => {
          if (res.code === 1) {
            this.$message.success('菜品状态已经更改成功！')
            this.handleQuery()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
      })
    },

    // 全部操作
    handleSelectionChange(val) {
      let checkArr = []
      val.forEach((n) => {
        checkArr.push(n.id)
      })
      this.checkList = checkArr
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
