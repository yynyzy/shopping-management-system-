<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片区 -->
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->

     <!-- <el-table
      :data="catelist"
      style="width: 100%; margin-bottom: 20px"
      row-key="cat_id"
      border
      :tree-props="{ children: 'children'}"> 
      <el-table-column prop="cat_name" label="分类名称" sortable width="180">123
      </el-table-column>
      <el-table-column label="是否有效" prop="cat_deleted" sortable width="180">
       <template v-slot:default="scope"> 
           <i class="el-icon-check" v-if="cat_deleted == false" style="color:lightgreen"></i>
          <i class="el-icon-close" v-else style="color:red"></i> 
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="标签" sortable width="180">
        <el-tag size="mini"  v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level == 0">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
      </el-table-column>
    </el-table>-->

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
       :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">   -
    </el-pagination> 
  </el-card>

  <!-- 分页 -->
</template>

<script>
export default {
  data() {
    return {
//查询操作
    queryInfo: {
      type: 3,
      pagenum: 1,
      pagesize: 5
    },
    //商品分类的数据列表
    catelist: [],
    total: 0
    }
    
  },
  created() {
    this.gitCateList();
  },
  methods: {
    //获取商品分类数据
    async gitCateList() {
      const { data: res } = await this.$axios.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$ElMessage.error("获取商品分类数据失败");
      this.catelist = res.data;
      this.total = res.data.total;
      // console.log(this.catelist);
    },
  },
}
</script>

<style lang='less' scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>