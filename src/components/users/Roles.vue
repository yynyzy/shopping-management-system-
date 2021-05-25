<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <!-- 搜索与添加区 -->
    <el-row :gutter="20" class="addrow">
      <el-col :span="8">
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>

    <el-table :data="rolesList" border stripe>
      <el-table-column type="expand">
        <template v-slot:default="scope">
          <el-row
            :class="['bd-bottom', index1 == 0 ? 'bd-top' : '', 'v-center ']"
            v-for="(item, index1) in scope.row.children"
            :key="item.id"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row, item.id)">
                {{ item.authName }}</el-tag
              >
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级权限和三级权限-->
            <el-col :span="19">
              <el-row
                :class="[index2 == 0 ? '' : 'bd-bottom', 'v-center']"
                v-for="(item2, index2) in item.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="removeRightById(scope.row, item2.id)"
                  >
                    {{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="(item3, index3) in item2.children"
                    :key="item3.id"
                    closable
                    @close="removeRightById(scope.row, item3.id)"
                  >
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot:default="slotProps">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showRolesUser(slotProps.row.id)"
            >编辑</el-button
          >

          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteRolesUser(slotProps.row.id)"
            >删除</el-button
          >

          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="showRightsDialog(slotProps.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 编辑对话框 -->
  <el-dialog
    title="编辑用户"
    v-model="editDialogVisible"
    width="50%"
    @close="editdialogClose"
  >
    <el-form
      ref="editRolesFormRef"
      label-width="70px"
      :model="editRolesForm"
      :rules="editRolesFormRules"
    >
      <el-form-item label="名称" prop="roleName">
        <el-input v-model="editRolesForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="editRolesForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesUserInfo">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 分配权限对话框 -->
  <el-dialog
    title="权限分配"
    v-model="setRightsdialogVisible"
    width="50%"
    @close="setRightsdialogClose"
  >
    <!-- 树形控件 -->
    <el-tree
      ref="treeRef"
      :data="setRightForm"
      :props="treeProps"
      show-checkbox
      default-expand-all
      node-key="id"
      :default-checked-keys="defkeys"
    ></el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </template>
  </el-dialog>


  


</template>


<script>
export default {
  data() {
    return {
      //用户权限列表
      rolesList: [],
      // 编辑用户的表单数据
      editRolesForm: {},
      editDialogVisible: false,
      editRolesFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在1到10个字符", trigger: "blur" },
        ],
      },
      // 获取分配权限数据
      setRightForm: {},
      // 控制分配权限对话框显示与隐藏
      setRightsdialogVisible: false,
      //树形控件的属性绑定对象
      treeProps: {
        //label 显示哪个值让我们看到
        label: "authName",
        // children， 表示以什么属性来表示嵌套
        children: "children",
      },
      //默认树形控件勾选的权限表单
      defkeys: [],
      //获取角色id
      roleId: "",

    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //   请求用户权限
    async getRolesList() {
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$ElMessage.error("请求失败");
      }
      this.rolesList = res.data;
    },

    //编辑操作按钮
    async showRolesUser(id) {
      const { data: res } = await this.$axios.get("roles/" + id);
      if (res.meta.status !== 200) {
        this.$ElMessage.error("请求失败");
      }
      this.editRolesForm = res.data;
      console.log(res.data);
      this.editDialogVisible = true;
    },

    //编辑操作对话框确认按钮
    async editRolesUserInfo() {
      this.$refs.editRolesFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          "roles/" + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$ElMessage.error("编辑失败");
        }
        this.$ElMessage.success("信息编辑成功");
        // console.log(res.data);
        this.getRolesList();
        this.editDialogVisible = false;
      });
    },

    //编辑操作对话框关闭事件
    editdialogClose() {
      this.$refs.editRolesFormRef.resetFields();
    },
    //删除用户按钮操作
    async deleteRolesUser(id) {
      // 弹框提示确认是否删除用户
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

      const { data: res } = await this.$axios.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$ElMessage.error("删除失败");
      }
      this.$ElMessage.success("用户删除成功");
      this.getRolesList();
    },
    //删除权限
    async removeRightById(role, rightId) {
      // 弹框提示确认是否删除权限
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
        return this.$ElMessage.info("取消删除权限");
      }
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$ElMessage.error("删除权限失败");
      }
      role.children = res.data;
    },
    //获取分配权限信息
    async showRightsDialog(role) {
      // 获取所有权限
      this.roleId = role.id;
      const { data: res } = await this.$axios.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$ElMessage.error("获取权限列表失败");
      // 将获取的数据保存到 data中
      this.setRightForm = res.data;
      // 获取角色下所有三级权限的id
      this.getLeftKeys(role, this.defkeys);
      this.setRightsdialogVisible = true;
    },
    //通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
    getLeftKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeftKeys(item, arr);
      });
    },
    setRightsdialogClose() {
      this.defkeys = [];
    },
    //确定按钮提交分配权限
    async allotRight() {
      const dir = [
        //返回目前被选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      //  转成以逗号分割的字符串
      const dirStr = dir.join(",");
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`, {rids: dirStr,});
      if (res.meta.status !== 200) return this.$ElMessage.error("修改失败");
      this.getRolesList();
      this.setRightsdialogVisible = false;
    },

  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;

  font-size: 14px;
}
.addrow {
  margin-bottom: 10px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin-bottom: 5px;
  margin-top: 5px;
}
.v-center {
  display: flex;
  align-items: center;
}
</style>