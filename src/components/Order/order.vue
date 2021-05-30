<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="yy">
          <template #append>
            <el-button icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表单区 -->
    <el-table :data="orderList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="订单编号"
        prop="order_number"
        width="400px"
      ></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template v-slot="scope">
          <el-tag v-if="scope.row.pay_status === '1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间" prop="create_time" width="200px">
        <template v-slot="scope">
          {{ $filters.dataFormat(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100px">
        
          <el-button
            size="mini"
            type="success"
            icon="el-icon-edit"
            @click="showBox"
          >
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-location"
            @click="showProgress"
          ></el-button>
        
      </el-table-column>
    </el-table>

    <!-- 分页区 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>

  <el-dialog
    title="修改地址"
    v-model="addressDialogVisible"
    width="50%"
    @closed="closeBox"
  >
    <el-form
      ref="addressFormRef"
      :model="addressForm"
      :rules="addressFormRules"
      label-width="80px"
    >
      <el-form-item label="省市区/县" prop="address1">
     
        <el-cascader 
          v-model="addressForm.address1"
          :options="cityData"
          :props="props"
          @change="handleChange"
        >
        </el-cascader>
      
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="addressForm.address2"></el-input>
      </el-form-item>
    </el-form>

     <template #footer>
    <span class="dialog-footer">
     <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </template>
   
  </el-dialog>

  <el-dialog
  title="提示"
  v-model="progressdialogVisible"
  width="50%"
  >
 <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="progressdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="progressdialogVisible = false">确 定</el-button>
    </span>
  </template>
</el-dialog>
</template>

<script>

import cityData from "./citydata";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: "",
      orderList: [],
      addressDialogVisible: false,
      addressForm: { address1: [], address2: "" },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请选择详细地址", trigger: "blur" },
        ],
      },
      cityData: cityData,
      props: { expandTrigger: "hover" },
      progressdialogVisible:false,
      progressInfo:[]
    };
  },
  created() {
    this.getOrderList();
  },
 
  methods: {
    async getOrderList() {
      const { data: res } = await this.$axios.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$ElMessage.error("获取订单失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
      console.log(this.orderList);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getOrderList();
    },
    showBox() {
      this.addressDialogVisible = true;
    },
    closeBox() {
      this.$refs.addressFormRef.resetFields();
    },
  async  showProgress(){
      const { data: res } = await this.$axios.get("")
      if(res.meta.status!=200) {
        return this.$ElMessage.error("获取物流进度失败")
      }
      this.progressInfo= res.data
      console.log( this.progressInfo);
this.progressdialogVisible=true
    }
  },
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.el-cascader  {
  width: 100%;
}
</style>