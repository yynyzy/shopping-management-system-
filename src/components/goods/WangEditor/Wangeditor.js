import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
// 引入wangeditor组件
import WangEditor from 'wangeditor';

export default {
  name: 'Wangeditor',
  setup(props, content) {
    // 获取编辑器实例html
    const editor = ref();
    // 编辑器实例对象
    let instance = '';
     
    onMounted(() => {
      // 编辑器实例对象
      instance = new WangEditor(editor.value);
      //插入代码语言配置
      instance.config.languageType = [     
        'CSS',    
        'JavaScript',
        'JSON',
        'TypeScript',
        'Html', 
        'Markdown',  
        'typescript'
      ]
      // 自定义菜单
      instance.config.menus = [
        // 'head',
        'bold', //字体加粗  
        'fontSize',//字号
        'fontName',//字体
        // 'italic',
        // 'underline',//下划线
        // 'strikeThrough',//删除线
        // 'indent',
        // 'lineHeight',
        'foreColor',
        // 'backColor',
        'link',
        // 'list',//列表
        // 'todo',
        // 'justify',//对其
        // 'quote',// 引用
        'emoticon',
        'image',
        // 'video',//视频
        // 'table',//表格
        'code',
        // 'splitLine',
        // 'undo',//撤销
        // 'redo',//恢复
      ];
      
      instance.config.uploadImgServer = '/upload-img';
      // 限制上传图片格式
      instance.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
      instance.config.height = 400;
      // 设置编辑器页面层级
      instance.config.zIndex = 10;
      // 设置编辑器placeholder
      instance.config.placeholder = '请输入您的文字！';
      // 配置编辑器显示颜色
      instance.config.colors = [
        '#000000',
        '#eeece0',
        '#1c487f',
        '#4d80bf'
      ];
      // 忽略粘贴内容中的图片
      instance.config.pasteIgnoreImg = true;
 
      Object.assign(instance.config, {
        // wangeditor 值发生变化的时候
        onchange() {
          // 将值传递至父组件
          content.emit('getWangEditorValue', instance.txt.html());
        },
        
      });
      instance.create();
    });
 
    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });
    return {
      editor,
    };
  },
}
