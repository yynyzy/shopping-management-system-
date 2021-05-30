<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <el-alert title="添加商品" type="info" closable show-icon center> </el-alert>
  <!-- 步骤条区域 -->
  <el-steps
    :space="200"
    :active="activeIndex"
    finish-status="success"
    align-center
  >
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
    <el-step title="商品内容"></el-step>
    <el-step title="商品完成"></el-step>
  </el-steps>
  <!-- tab栏 -->
  <el-form
    :model="addForm"
    :rules="addFormRules"
    ref="addFormRef"
    label-width="100px"
    label-position="top"
  >
    <el-tabs
      v-model="activeIndexs"
      :tab-position="'left'"
      @tab-click="
        tabchange(activeIndexs);
        tabclick();
      "
      :before-leave="beforeTabLeave"
    >
      <el-tab-pane label="基本信息" name="0">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addForm.goods_price" type="number"> </el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input type="number" v-model="addForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数目" prop="goods_name">
          <el-input type="number" v-model="addForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            v-model="addForm.goods_cat"
            :options="catelist"
            :props="cateprops"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">
        <el-form-item
          :label="item.attr_name"
          v-for="item in manyDataList"
          :key="item.attr_id"
        >
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox
              :label="cb"
              v-for="(cb, i) in item.attr_vals"
              :key="i"
              border
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
        <el-form-item
          :label="item.attr_name"
          v-for="item in onlyDataList"
          :key="item.attr_id"
        >
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <el-upload
          :action="uploadUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :headers="headerObj"
          :on-success="handlesuccess"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <Wangeditor v-on:getWangEditorValue="getWangEditorValue"></Wangeditor>
        <el-button type="primary" @click="add">添加商品</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品完成" name="5">商品完成</el-tab-pane>
    </el-tabs>
  </el-form>

  <el-dialog title="图片预览" v-model="pictureVisible" width="600px">
    <img :src="pictureUrl" class="pic" />
  </el-dialog>
</template>

<script>
//富文本编辑器的引用
import {
  PropType,
  ref,
  reactive,
  toRefs,
  provide,
  inject,
  onBeforeMount, // 在组件挂载之前执行的函数
  onMounted,
  onBeforeUpdate, // 在组件修改之前执行的函数
  onUpdated,
  onBeforeUnmount, // 在组件卸载之前执行的函数
  onUnmounted,
  nextTick,
} from "vue";

import { useRouter, useRoute } from "vue-router";
import Wangeditor from "./WangEditor/Wangeditor.vue";

export default {
  components: {
    Wangeditor,
  },
  setup(props, content) {
    // // 实例化路由
    var router = useRouter();
    // // 路由参数
    var route = useRoute();
    const data = reactive({
      // 评论内容
      comment_content: "",
    });

    const getWangEditorValue = (str) => {
      data.comment_content = str;
    };
    const dataRef = toRefs(data);
    return {
      getWangEditorValue,
      ...dataRef,
      data
    };
  },

  data() {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: "",
        goods_price: 1,
        goods_weight: 0,
        goods_number: 1,
        goods_cat:[],
        pics: [],
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数目", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      catelist: [],
      cateprops: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover",
      },
      manyDataList: [],
      onlyDataList: [],
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      pictureVisible: false,
      pictureUrl: "",
    };
  },
  created() {
    this.getCateLists();
  },
  methods: {
    //步骤条与tab栏相关联
    tabchange(activeIndexs) {
      this.activeIndex = parseInt(activeIndexs);
    },
    async getCateLists() {
      const { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200) {
        userInfo.mg_state != userInfo.mg_state;
        return this.$ElMessage.error("获取信息失败");
      }
      this.catelist = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(activename, oldname) {
      if ((activename = "0" && this.addForm.goods_cat.length !== 3)) {
        this.$ElMessage.error("请先选择商品分类");
        return false;
      }
    },
    async tabclick() {
      //证明访问的是动态参数列表
      if (this.activeIndexs == "1") {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$ElMessage.error("获取动态参数列表失败");
        }
        res.data.forEach(
          (item) =>
            (item.attr_vals =
              item.attr_vals.length == 0 ? [] : item.attr_vals.split(","))
        );
        this.manyDataList = res.data;
      } else if (this.activeIndexs == "2") {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$ElMessage.error("获取静态属性列表失败");
        }
        this.onlyDataList = res.data;
      }
    },
    //处理图片预览
    handlePreview(file) {
      this.pictureUrl = file.response.data.url;
      this.pictureVisible = true;
    },
    //处理图片移除操作
    handleRemove(file) {
      console.log(file);
      const filepath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((f) => f.pic === filepath);
      this.addForm.pics.splice(i, 1);
    },
    //处理图片上传后服务器返回的信息
    handlesuccess(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    add() {
      this.$refs.addFormRef.validate( async valid => {
        if (!valid) return this.$ElMessage.error("请填写必要表单");
       
        this.addForm.goods_cat=this.addForm.goods_cat.join(',')
        //处理动态参数
        this.manyDataList.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyDataList.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newInfo);
        });

        const { data: res } = await this.$axios.post('goods',this.addForm)
      if(res.meta.status!== 201){
        console.log(res);
        return this.$ElMessage.error("商品添加失败")}
      this.$ElMessage.success("添加成功")
      this.$router.push({path:"/goods"})
      }
      )
     
    },
  },
  computed: {
    cateID() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang='less' scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-steps {
  margin: 15px;
}
.el-step_titles {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 5px 0 0;
}
.pic {
  width: 100%;
}
</style>