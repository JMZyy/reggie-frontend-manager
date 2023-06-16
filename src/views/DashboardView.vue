<template>
  <div class="app-wrapper openSidebar clearfix">
    <!-- sidebar -->
    <div class="sidebar-container">
      <div class="logo">
        <img src="../../../../qiyeshixun/reggie-frontend-manager/src/images/login/login-logo.png" alt="" style="width: 116px; height: 32px"/>
      </div>
      <!-- 带有滚动条的容器-->
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu>//一个侧边栏的 HTML 结构，包含一个 logo 和一个菜单栏。菜单栏使用了 Element UI 的 el-menu 组件，
                   //通过 v-for 循环渲染菜单项，如果菜单项有子菜单，则使用 el-submenu 组件渲染，否则使用 el-menu-item 组件渲染。
                   //菜单项的点击事件绑定了对应的方法。整个侧边栏的容器使用了一个带有滚动条的容器 el-scrollbar 组件。
            :default-active="defAct"
            :unique-opened="false"
            :collapse-transition="false"
            background-color="#343744"
            text-color="#bfcbd9"
            active-text-color="#f4f4f5"
        >
          <div v-for="item in menuList" :key="item.index">
            <el-submenu :index="item.index" v-if="item.children && item.children.length>0">
              <template slot="title">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item
                  v-for="sub in item.children"
                  :index="sub.id"
                  :key="sub.id"
                  @click="menuHandle(sub,false)"
              >
                <i :class="iconfont + ' ' + sub.icon"></i>
                <span slot="title">{{ sub.title }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item.index" @click="handleSelect(item,false)">
              <i class="iconfont" :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-scrollbar>
    </div>

    <div class="main-container">
      <!-- <navbar /> -->
      <div class="navbar">  //一个包含class为"main-container"的div元素，作为整个组件的容器。
                       //一个class为"navbar"的div元素，作为页面的导航栏。
                       //导航栏中包含一个class为"head-lable"的div元素，用于显示页面标题。
                       //导航栏中包含一个class为"right-menu"的div元素，用于显示用户信息和退出登录按钮。
                       //一个class为"app-main"的div元素，作为页面主体内容的容器。
                       //主体内容中包含一个class为"divTmp"的div元素，用于显示页面加载中的动画。
                       //体内容中包含一个Vue.js的router-view元素，用于显示路由对应的组件内容。
        <div class="head-lable">
          <span v-if="goBackFlag" class="goBack" @click="goBack()"><img src="../../../../qiyeshixun/reggie-frontend-manager/src/images/icons/btn_back@2x.png" alt=""/> 返回</span>
          <span>{{ pageTitle }}</span>
        </div>
        <div class="right-menu">
          <div class="avatar-wrapper" v-if="userInfo != null">{{ userInfo.name }}</div>
          <img src="../../../../qiyeshixun/reggie-frontend-manager/src/images/icons/btn_close@2x.png" class="outLogin" alt="退出" @click="logout"/>
        </div>
      </div>
      <div class="app-main" v-loading="loading" style="overflow-y: auto; height: 90% " >
        <div class="divTmp" v-show="loading"></div>
        <router-view style="width: 100%;"></router-view>
      </div>
    </div>

  </div>
</template>

<script>
import {logoutApi} from "../../../../qiyeshixun/reggie-frontend-manager/src/api/login"
import {mapGetters, mapActions} from 'vuex';

export default {
  data() {
    return {  //一个Vue组件的定义   包含了该组件的数据属性和初始值
      pageTitle: "员工管理",
      route: '/dashboard/employee-management',
      defAct: '1',
      menuActived: '1',
      loading: true,
      goBackFlag: false,
      menuList: [
        {
          index: "1",
          icon: "icon-member",
          title: "员工管理",
          route: '/dashboard/employee-management',
        },
        {
          index: "2",
          icon: "icon-food",
          title: "菜品管理",
          route: '/dashboard/dish-management',
        },
        {
          index: "3",
          icon: "icon-combo",
          title: "套餐管理",
          route: '/dashboard/set-meal-management',
        },
        {
          index: "4",
          icon: "icon-category",
          title: "分类管理",
          route: '/dashboard/category-management',
        },
        {
          index: "5",
          icon: "icon-order",
          title: "订单管理",
          route: '/dashboard/order-management',
        },
      ],
      userInfo:'',
    };
  },
  computed: {
    ...mapGetters("employee", ["getUserInfo"]),
  },
  created() {   #包括了computed、created、beforeDestroy、mounted和methods等生命周期函数和方法。

    if (this.getUserInfo) {
      this.userInfo = JSON.parse(this.getUserInfo)
    }
    this.closeLoading()
  },                   //computed中使用了Vuex的mapGetters方法，将employee模块中的getUserInfo getter映射到了组件的getUserInfo属性上。
//created生命周期函数中，如果getUserInfo存在，将其解析为JSON格式并赋值给组件的userInfo属性，然后调用closeLoading方法。
//beforeDestroy生命周期函数中，清空了定时器。
//mounted生命周期函数中，将handleSelect方法绑定到全局window对象上，并调用handleSelect方法。
//methods中使用了Vuex的mapActions方法，将employee模块中的clearUserInfo action映射到了组件的clearUserInfo方法上。
//handleSelect方法用于处理菜单的选择，将loading属性设置为true，更新菜单的选中状态、路由、页面标题和返回标志，然后根据菜单的id属性是否存在，
//使用$router.push方法跳转到对应的页面，最后调用closeLoading方法。
//goBack方法用于处理返回操作，找到当前选中的菜单，将返回标志设置为false，然后调用handleSelect方法。
//closeLoading方法用于关闭loading状态，使用定时器实现了1秒后loading属性设置为false的效果。
//logout方法用于处理退出登录操作，调用了logoutApi方法，如果返回值的code属性为1，则清空用户信息并跳转到登录页面。
  beforeDestroy() {
    this.timer = null
    clearTimeout(this.timer)
  },
  mounted() {
    window.handleSelect = this.handleSelect
    this.handleSelect(this.menuList[0], false)
  },
  methods: {
    ...mapActions('employee', ['clearUserInfo']),

    handleSelect(item, goBackFlag) {
      this.loading = true
      this.menuActived = item.index
      this.route = item.route
      this.pageTitle = item.title
      this.goBackFlag = goBackFlag
      if (typeof item.id === "undefined") {
        this.$router.push(this.route)
      } else {
        this.$router.push({path: this.route, query: {id: item.id}})
      }
      this.closeLoading()
    },
    goBack() {
      // 针对add，edit这些页面，返回上一页
      const menu = this.menuList.find(item => item.index === this.menuActived)
      this.handleSelect(menu, false)
    },
    closeLoading() {
      this.timer = null
      this.timer = setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    logout() {
      logoutApi().then((res) => {
        if (res.code === 1) {
          this.clearUserInfo();
          this.$router.push({name: "login"});
        }
      })
    },
  },
};
</script>

<style scoped>
@import "../../../../qiyeshixun/reggie-frontend-manager/src/styles";
</style>
