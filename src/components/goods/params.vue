<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-alert
      title="注意！只能改第三级参数"
      type="warning"
      :closable="false"
      show-icon
    >
    </el-alert>

    <el-row class="cat_opt">
      <el-col>
        <span> 选择商品分类: </span>
        <el-cascader
          v-model="selectedCateKeys"
          :options="catelist"
          :props="cateProps"
          @change="handleChange"
        >
        </el-cascader>
      </el-col>
    </el-row>

    <!-- 页签区 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many" size="mini">
        <el-button
          type="primary"
          size="mini"
          :disabled="isdisabled"
          @click="addDialogVisible = true"
          >添加参数</el-button
        >
        <el-table :data="manyTableData" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template v-slot="scope">
              <!-- 循环渲染tag标签 -->
              <el-tag
                v-for="(item, i) in scope.row.attr_vals"
                :key="i"
                closable
                @close="handleClosed(i, scope.row)"
                >{{ item }}</el-tag>
              <!-- 添加文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <!-- 添加按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <!--索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showDialog(scope.row.attr_id)"
                >编辑</el-button
              ><el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteDialog(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only" size="mini"
        ><el-button
          type="primary"
          size="mini"
          :disabled="isdisabled"
          @click="addDialogVisible = true"
          >添加属性</el-button
        >
        <el-table :data="onlyTableData" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template v-slot="scope">
              <!-- 循环渲染tag标签 -->
              <el-tag
                v-for="(item, i) in scope.row.attr_vals"
                :key="i"
                closable
                @close="handleClosed(i, scope.row)"
                >{{ item }}</el-tag
              >
              <!-- 添加文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <!-- 添加按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <!--索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showDialog(scope.row.attr_id)"
                >编辑</el-button
              ><el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteDialog(scope.row.attr_id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>

  <!-- 添加动态参数，静态属性对话框 -->
  <el-dialog
    :title="'添加' + testText"
    v-model="addDialogVisible"
    width="50%"
    @closed="addFormClose"
  >
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="80px"
    >
      <el-form-item :label="testText" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span>
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addParams">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 编辑对话框 -->
  <el-dialog
    :title="修改"
    v-model="editDialogVisible"
    width="50%"
    @closed="editFormClose"
  >
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-width="80px"
    >
      <el-form-item :label="testText" prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span>
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editParams">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //级联选择框双向绑定的数据
      selectedCateKeys: [],
      activeName: "many",
      // 动态属性数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      addDialogVisible: false,
      //添加参数表单数据
      addForm: { attr_name: "" },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入修改名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200)
        return this.$ElMessage.error("获取商品分类失败");
      this.catelist = res.data;
    },

    handleChange() {
      this.getParamsDate();
    },
    //点击页签的处理函数
    handleTabClick() {
      this.getParamsDate();
    },
    //获取下面的属性参数表单
    async getParamsDate() {
      //证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.onlyTableData =[]
        this.manyTableData=[]
        return
      }
      //证明选中的是三级分类
      //根据所选分类的id，获取对应参数
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200)
        return this.$ElMessage.error("获取参数列表失败");
      res.data.forEach((item) => {
        (item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : []),
          // // 控制文本框与按钮切换
          (item.inputVisible = false);
        // // 文本框中输入的内容
        item.inputValue = '';
      });

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    addFormClose() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮提交参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$ElMessage.error("添加失败");
        this.$ElMessage.success("添加成功");
        this.addDialogVisible = false;
        this.getParamsDate();
      });
    },
    //控制编辑对话框隐藏与显示
    async showDialog(attr_id) {
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status != 200) return this.$ElMessage.error("获取参数失败");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 点击按钮修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status != 200)
          return this.$ElMessage.error("修改参数失败");
        this.$ElMessage.success("修改参数成功");
        this.getParamsDate();
        this.editDialogVisible = false;
      });
    },
    editFormClose() {
      this.$refs.editFormRef.resetFields();
    },
    //点击按钮删除参数
    async deleteDialog(attr_id) {
      // 弹框提示确认是否删除用户
      const deleteResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (deleteResult !== "confirm") {
        return this.$ElMessage.info("参数删除取消");
      }

      const { data: res } = await this.$axios.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$ElMessage.error("删除失败");
      }
      this.$ElMessage.success("参数删除成功");
      this.getParamsDate();
    },
    async handleInputConfirm(row) {
      console.log(row);
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      const a = row.inputValue.trim();
      //如果没有return，则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    //将对attr的操作保存到数据库
    async saveAttrVals(row) {
      //需要发起请求，保存这次操作
      const { data: res } = await this.$axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status != 200) {
        return this.$ElMessage.error("操作失败");
      }
      this.$ElMessage.success("操作成功");
    },
    //展开项点击按钮显示文本框
    showInput(y) {
      y.inputVisible = true;
      //$nextTick方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClosed(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
  },
  computed: {
    isdisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选取的商品分类id
    cateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2];
      } else {
        return null;
      }
    },
    testText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style>
.el-breadcrumb {
  margin-bottom: 15px;
}
.cat_opt {
  margin-top: 15px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>