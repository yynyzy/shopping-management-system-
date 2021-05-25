<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable="true"
            @clear="getUserList"
          >
            <template #append>
              <el-button
                icon="el-icon-search"
                @click="
                  queryInfo.pagenum = 1;
                  getUserList();
                "
              ></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!--表格区 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              @change="userStateChange(slotProps.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="slotProps">
            <!-- 修改操作 -->
            <el-tooltip
              effect="dark"
              content="修改用户"
              placement="top-end"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(slotProps.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除操作 -->
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top-end"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(slotProps.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配权限 -->
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top-end"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(slotProps.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      v-model="addDialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        ref="addFormRef"
        label-width="70px"
        :model="addForm"
        :rules="addFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      v-model="editDialogVisible"
      width="50%"
      @close="editdialogClose"
    >
      <el-form
        ref="editFormRef"
        label-width="70px"
        :model="editForm"
        :rules="editFormRules"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>

  <!-- 分配角色按钮对话框 -->
  <el-dialog
    title="分配角色"
    v-model="setRoleDialogVisible"
    width="50%"
    @close="setRoleDialogClose"
  >
    <p>当前的用户:{{ userInfo.username }}</p>
    <p>当前的角色:{{ userInfo.role_name }}</p>
    <el-select v-model="selcetRolesId" placeholder="请选择">
      <el-option
        v-for="item in rolesList"
        :key="item.id"
        :label="item.roleName"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleInfo">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    // 邮箱验证规则
    let checkEmail = (rule, value, cb) => {
      const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (reg.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法邮箱"));
      }
    };
    let checkMobile = (rule, value, cb) => {
      const reg = /^(1)\d{10}$/;
      if (reg.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入正确手机号"));
      }
    };

    return {
      //获取用户列表参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 1,
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框显示隐藏
      addDialogVisible: false,
      // 控制修改用户对话框显示隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 修改用户的表单数据
      editForm: {},
      //添加用户的表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6到15个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //修改用户的表单验证规则
      editFormRules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      // 控制分配角色对话框显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      //角色列表
      rolesList: [],
      //被选中角色的id
      selcetRolesId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$axios.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$ElMessage.error("获取用户列表失败！");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //更新页号
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //更新页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch开关切换
    async userStateChange(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state != userInfo.mg_state;
        return this.$ElMessage.error("用户状态更改失败");
      }
      this.$ElMessage.closeAll();
      this.$ElMessage.success("用户状态更改成功");
    },
    //添加新用户对话框关闭重置表单
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮，添加新用户,重新请求用户列表刷新数据
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //通过验证进行axios请求
        const { data: res } = await this.$axios.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$ElMessage.error("添加用户失败");
        }
        this.$ElMessage.success("添加用户成功");
        //重新请求用户列表刷新数据
        this.getUserList();
        //  将对话框关闭
        this.addDialogVisible = false;
      });
    },
    //修改用户按钮
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get("users/" + id);
      if (res.meta.status !== 200) {
        this.$ElMessage.error("修改用户失败");
      }

      this.editForm = res.data;
      console.log(res.data);
      this.editDialogVisible = true;
    },
    //修改用户对话框关闭重置表单
    editdialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //对话框修改用户后确定按钮,重新请求用户列表刷新数据
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        //通过验证进行axios请求
        const { data: res } = await this.$axios.put(
          "users/" + this.editForm.id,
          { mobile: this.editForm.mobile, email: this.editForm.email }
        );
        if (res.meta.status !== 200) {
          this.$ElMessage.error("用户信息修改失败");
        }
        this.$ElMessage.success("用户信息修改成功");
        //重新请求用户列表刷新数据
        this.getUserList();
        //  将对话框关闭
        this.editDialogVisible = false;
      });
    },
    //根据id删除用户
    async removeUserById(id) {
      // 确认是否删除用户
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$ElMessage.info("用户删除取消");
      }
      const { data: res } = await this.$axios.delete("users/" + id);
      if (res.meta.status !== 200) {
        console.log(res.meta.status);
        return this.$ElMessage.error("用户删除失败");
      }
      this.$ElMessage.success("用户删除成功");
      this.getUserList();
    },
    //分配角色权限
    async setRole(userInfo) {
      this.userInfo = userInfo;
      // 在展示对话框之前先获取所有角色的列表
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status !== 200)
        return this.$ElMessage.error("获取角色列表失败");
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    //确然按钮分配角色
    async setRoleInfo() {
      if (!this.selcetRolesId) {
        return this.$ElMessage.error("请选择要分配的角色");
      }
      const { data: res } = await this.$axios.put(`users/${this.userInfo.id}/role`,{rid:this.selcetRolesId});
      if (res.meta.status !== 200) return this.$ElMessage.error("更新角色失败");
      this.$ElMessage.success("角色更新成功");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    setRoleDialogClose() {
      this.selcetRolesId = "";
      this.userInfo = {};
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;

  font-size: 14px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>