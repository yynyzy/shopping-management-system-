<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot:default="slotProps">
            <el-tag type="warning" v-if="slotProps.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="slotProps.row.level == 1">二级</el-tag>
            <el-tag v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "rights",
  data() {
    return {
      //用户权限列表
      rightList: [],
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    //   请求用户权限
    async getRightList() {
      const { data: res } = await this.$axios.get("rights/list");
      if (res.meta.status !== 200) {
        return this.$ElMessage.error("请求失败");
      }
      this.rightList = res.data;
    },
  },
};
</script>

<style  lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;

  font-size: 14px;
}
</style>