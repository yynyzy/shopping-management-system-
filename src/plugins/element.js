import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElSubmenu,
  ElMenuItem,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElTooltip,
  ElPagination,
  ElDialog,
  ElMessageBox
} from 'element-plus'

import 'element-plus/lib/theme-chalk/index.css'



export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElAside)
  app.use(ElMenu)
  app.use(ElSubmenu)
  app.use(ElMenuItem)
  app.use(ElBreadcrumb)
  app.use(ElBreadcrumbItem)
  app.use(ElCard)
  app.use(ElMain)
  app.use(ElRow)
  app.use(ElCol)
  app.use(ElTable)
  app.use(ElTableColumn)
  app.use(ElSwitch)
  app.use(ElTooltip)
  app.use(ElPagination)
  app.use(ElDialog)

  app.config.globalProperties.$ElMessage = ElMessage
  app.config.globalProperties.$confirm =ElMessageBox.confirm
}
