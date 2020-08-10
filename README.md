## vue-config-wrapper
一个vue项目配置的包装器.  
当项目依赖的模块更换配置项时, 根据 项目已有配置 和 实际安装的版本, 给出提示或直接修补配置, 使开发者可以比较平滑地升级项目依赖, 获得更好的开发体验.


## 支持的配置项
- [x] sass

## 开发说明
我们可以在lib里基于vue.config.js里某个配置的变动, 建立一个对它进行适配的脚本, 比如项目创建最初的[sassLoader.js](./src/lib/sassLoader.js)  
一个这样的脚本, 一般最少包含以下几种属性:  
| 属性名 | 类型 | 描述 |
| -- | -- | -- |
| name | string | 标识名 |
| path | string | 要操作的项在vue.config.js导出对象中的访问路径, 用.进行分级 |
| type | string | 操作类型, option/module, option表示一般配置项, module表示模块配置项 |
| changelog | object[] | 变动记录 |
| handler | function | 操作方法 |
  
### changelog 规则
``` javascript
[{
    // changelog是一个对象数组, 它的每一个元素都应当有一个版本号.
    version: '8.0.0',
    // utils 工具方法 updateConfig 里预定义了对 replace 属性的处理
    // replace: {key: value} 如果是低版本向高版本升级
    // 在 handler 方法的参数 itemConfig 里, 如果有相同key, 会被替换为value
    // 如果是高版本向低版本降, 则是逆向操作
    replace: {
        data: 'prependData'
    },
    // 如果update不是函数, 或 是函数且返回值严格相等于true, 那么执行预定义的处理
    
    // itemConfig 是 handler 的参数
    // item 即update函数所在的元素
    // index 索引 reverseIndex 开始翻转的索引

    // changelog会按版本从小到大进行一次排序, 然后依次与itemInfo.version比较
    // 小于等于的按正常顺序, 大于的会被翻转(从大到小)
    // changelog: [{version: 0},1,2,3,4,5] item.version: 3 实际遍历时的数组顺序 [0,1,2,3,5,4]
    // index: 0,1,2,3,4,5 reverseIndex 4
    update(itemConfig, item, index, reverseIndex) {
        return true
    }
}]
// 例如
// 7.0.0 升 8.0.0 时, 
// 原来的itemConfig为 {data: '@/assets/scss/index.scss'}
// 处理后itemConfig为 {prependData: '@/assets/scss/index.scss'}

```

### type 可选值
- option: 只读取@vue/cli-service信息
- module: 同时读取 @vue/cli-service 和 模块自身信息

### handler 参数
- itemConfig  根据path读取到的配置 (如果path指向一个非对象, 会被包装到一个对象里, 可以通过path最后一级地址访问它)
- itemInfo  当前可用的信息. type为module时, 那么它是模块自身的信息, type为option时, 则是@vue/cli-service的信息
- utils  提供的一些工具方法
- moreInfo  type为module时, 会传入@vue/cli-service的信息, 否则就是{}

## license
MIT