<template>
  <div id="app">
    <el-api-docs ref="api"
                 :doc-url="docUrl"
                 :base-url="baseUrl"
                 :data="data"
                 :headers="headers"
                 :result="result"
                 :auto-request="false"
                 @submit="handleSubmit">
      <div slot="leftMenu">
        <el-button type="text"
                   @click="handleClick">自定义按钮</el-button>
      </div>
    </el-api-docs>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      docUrl: 'http://localhost:8001/v2/api-docs',
      baseUrl: 'http://localhost:8001',
      data: [{
        key: 1,
        value: 2
      }],
      headers: [{
        key: "a",
        value: "a"
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