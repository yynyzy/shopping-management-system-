<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
 <div id="main" style="width: 800px;height:400px;"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts"
export default {
  data() {
return{ 
        options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
}
  },
  created() {

  },
async mounted() {
//dom元素加载完毕后实行
// 基于准备好的dom，初始化echarts实例
 var myChart = echarts.init(document.getElementById('main'));


        const { data: res } = await this.$axios.get('reports/type/1')
        if (res.meta.status!=200) return this.$ElMessage.error("获取折线图失败")
         // 使用刚指定的配置项和数据显示图表。
         console.log(res.data);
         const result = Object.assign(this.options,res.data)
        myChart.setOption(result)
  },
  methods: {

  }
}
</script>

<style>
.el-breadcrumb {
    margin-bottom: 15px;
}
</style>