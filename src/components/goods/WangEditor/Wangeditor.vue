<template>
    <div ref='editor' ></div>
</template>
 
<script>
  // 引入js文件
  import Wangeditor from "./Wangeditor.js";
 
  // 使用js对象
  export default {
    ...Wangeditor,
  };
</script>