<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/img/mainlogo.jpg" alt="" />
        <span>小黄片后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏-->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <!-- 切换按钮 -->
        <div class="toggle-button" @click="toggleClick">|||</div>

        <!-- 侧边栏菜单 -->
        <el-menu
          :uniqueOpened="true"
          class="el-menu-vertical-demo"
          :default-active="activePath"             
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="iscollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template #title>
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 左侧主体区域 -->
      <el-main>
        <!-- welcom展示界面路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
 
  data() {
    return {
      menuList: [],
      iconList: {
        125: "el-icon-user",
        103: "el-icon-box",
        101: "el-icon-goods",
        102: "el-icon-tickets",
        145: "el-icon-data-analysis",
      },
      iscollapse: false,
      //被激活的链接地址
      activePath:''
    };
  },
   created() {
    this.getMenuList();
    // 去掉的话，在页面后退回来后，侧边栏导航没有蓝色高亮
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    //退出功能
    logout() {
      // 清理token值，返回登陆界面
      window.sessionStorage.clear();
      this.$router.push("/login");
    },

    //请求左侧菜单信息
    async getMenuList() {
      const { data: res } = await this.$axios.get("menus");
      if (res.meta.status !== 200) return this.$ElMessage.error("菜单获取失败");
      this.menuList = res.data;
    },
    //点击按钮切换菜单的折叠与展开
    toggleClick() {
      this.iscollapse = !this.iscollapse;
    },
    //保存链接激活的状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath=activePath;
    },
  },
};
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-menu {
  border-right: none;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  font-size: 20px;
  background-color: #373d41;

  div {
    display: flex;
    align-items: center;
    color: #fff;

    img {
      border-radius: 50%;
    }
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>