## 简介

本项目是一个基于element-ui，swagger2的快速接口测试工具。其实swagger-ui已经可以满足接口测试的场景，但是我们项目要求接口参数加密，这就导致了swagger-ui无法使用，所以诞生了此项目。<br>
另外，直接使用本项目可能会存在跨域的问题，请在后台设置测试环境下允许跨域。（正式环境请禁用swagger2）

## 安装

### 组件

```sh
$ npm i element-api-docs
或
$ yarn add element-api-docs
```

### 源码

<a href="https://github.com/sscfaith/element-api-docs" target="_blank">github</a>

```sh
$ yarn
$ yarn serve
```

## 使用

```
import ElementApiDocs from 'element-api-docs'

Vue.use(ElementApiDocs)
```

```html
<template>
  <el-api-docs ref="api"
               :doc-url="docUrl"
               :base-url="baseUrl"
               :data.sync="data"
               :headers.sync="headers"
               :result.sync="result"
               :auto-request="false"
               @submit="handleSubmit">
  <div slot="leftMenu">
    <el-button type="text"
               @click="handleClick">自定义按钮</el-button>
  </div>
</el-api-docs>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        docUrl: 'http://localhost:8001/v2/api-docs',
        baseUrl: 'http://localhost:8001',
        data: [{
          key: 1,
          value: 2
        }],
        headers: [{
          key: 3,
          value: 4
        }],
        result: {
          data: {},
          code: 200,
          msg: "描述信息",
        }
      }
    },
    methods: {
      handleSubmit (val) {
        console.log(val)
      },
      handleClick () {
        console.log(this.$refs.api.getConfig())
      }
    }
  }
</script>
```
本示例展示了组建的全部功能，正常使用的话可以只配置doc-url，其余属性皆有默认值，详情见下。

### 属性

| 参数 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| aside-width | 左侧栏宽度 | Number | 350 |
| doc-url | swagger2接口文档地址(/v2/api-docs) | String | "" |
| base-url | axios请求baseUrl | String | swagger2文档中的baseUrl |
| data | 初始请求参数，格式为[{key: '', value: '', required: false}] | Array | [{}] |
| headers | 初始请求头，格式为[{key: '', value: ''}] | Array | [{ }] |
| result | 返回结果预展示 | Object | { data: {}, code: 200, msg: "描述信息" } |
| validate | 提交时是否校验参数 | Boolean | true |
| auto-request | 提交时是否自动请求，若为false请使用@submit接受拼装好的参数，自行处理请求 | Boolean | true |
| export-btn | 是否显示导出按钮 | Boolean | true |

data、headers、result可通过.sync修饰符获取到实时组件内值的变化

#### 若使用导出功能，请自行引入以下js，并且加入publish文件夹下的word模板

```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/docxtemplater/3.9.1/docxtemplater.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.6.1/jszip.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.0.2/jszip-utils.js"></script>
```

### 事件

| 名称 | 说明 | 回调参数 |
| ------ | ------ | ------ |
| submit | auto-request为false时此事件存在，可自行处理参数 | axios的config |

### 方法

| 名称 | 说明 | 返回值 |
| ------ | ------ | ------ |
| getConfig | 获取拼接好的axios的config，可直接用于axios请求 | config |

### 插槽

```html
<el-api-docs :doc-url="docUrl">
  <div slot="leftMenu">
    <el-button type="text">自定义按钮</el-button>
  </div>
</el-api-docs>
```

## 打包

### 组件

```sh
$ yarn lib
```

### 源码

```sh
$ yarn build
```

## 捐赠
如果你觉得本项目帮助到你的话，可以给作者买杯咖啡。
<img src="http://112.74.43.150/images/donate.png">

## License

<a href="https://opensource.org/licenses/MIT" target="_blank">MIT</a>
