<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row :gutter="20" class="top">
      <el-col :span="8">
        <el-input 
        placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsLists">
         <template #append>
          <el-button  icon="el-icon-search" @click="handleCurrentChange(1);getGoodsLists">          
          </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="goodsLists" border>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="105px"
      ></el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="80px"
        
      ></el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间"
        width="160px" 
      >
      <template v-slot="scope">
        {{$filters.dataFormat(scope.row.add_time)}}
      </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
          <template v-slot:default="scope">
               <el-button size="mini" type="primary" icon="el-icon-edit" @click=""
          ></el-button
        ><el-button size="mini" type="danger" icon="el-icon-delete" @click="removeGoods(scope.row.goods_id)"
          ></el-button
        >
          </template>
       
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
       :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>   -
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: "10",
      },
      goodsLists: [],
      total:"" ,
    };
  },
  created() {
    //   在组件创立前就获取商品列表函数
    this.getGoodsLists();
  },
  methods: {
    //   获取商品列表
    async getGoodsLists() {
      const { data: res } = await this.$axios.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$ElMessage.error("获取商品列表失败");

      this.goodsLists = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodsLists);
    },
    //分页区
    handleSizeChange(newSize){
this.queryInfo.pagenum= newSize;
this.getGoodsLists()
    },
    handleCurrentChange(newPage){
this.queryInfo.pagenum= newPage;
this.getGoodsLists()
    },
    //删除商品
  async  removeGoods(id){
const confirmResult = await this.$confirm(
     "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$ElMessage.info("商品删除取消");
      }

      const { data: res } = await this.$axios.delete(`goods/${id}`);
      if (res.meta.status !== 200) {
        return this.$ElMessage.error("商品删除失败");
      }
      console.log(res.data);
      this.$ElMessage.success("商品删除成功");
      this.getGoodsLists()
    },
    addGoods(){
        this.$router.push({path: "/goods/add"})
    }
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.top {
  margin-bottom: 10px;
}
</style>