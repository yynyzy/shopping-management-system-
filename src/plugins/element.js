import {
  ElButton, ElForm, ElFormItem, ElInput,
  ElMessage
} from 'element-plus'

import 'element-plus/lib/theme-chalk/index.css'



export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.config.globalProperties.$ElMessage=ElMessage 
}
