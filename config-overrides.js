const { override, fixBabelImports,addLessLoader } = require('customize-cra');
module.exports = override(
  //针对antd实现按需打包：根据import来打包(使用bable-plugin-import)
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style:true , //自动打包相关的样式
    }),
    //设置自定义主题的配置 看官方的文档进行具体的配置
    //使用less-loader对源码中的less变量进行覆盖
    addLessLoader({
      lessOptions:{
        javascriptEnabled: true,
        //主题颜色
         modifyVars: { '@primary-color': '#1DA57A' },
      }
    })
  );