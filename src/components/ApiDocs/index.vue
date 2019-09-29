<template>
  <el-container class="el-api-docs">
    <el-aside :width="`${asideWidth}px`"
              v-show="docUrl">
      <el-card class="left"
               :body-style="{padding: '0 0 20px 0'}"
               shadow="never">
        <div slot="header"
             class="left-header">
          <span>接口地址</span>
          <div style="display: flex;">
            <slot name="leftMenu"></slot>
            <el-button v-if="exportBtn"
                       type="text"
                       style="margin-left: 10px;">导出</el-button>
          </div>
        </div>
        <el-collapse class="left-body"
                     v-if="list.length > 0">
          <el-collapse-item :title="item.label"
                            v-for="item in list"
                            :key="item.label">
            <div class="left-body-item"
                 v-for="(api, index) in item.children"
                 :key="index"
                 @click="handleApi(api)">
              <el-tag size="mini"
                      v-if="api.method == 'post'">post</el-tag>
              <el-tag size="mini"
                      type="success"
                      v-else-if="api.method == 'get'">get</el-tag>
              <el-tag size="mini"
                      type="warning"
                      v-else-if="api.method == 'put'">put</el-tag>
              <el-tag size="mini"
                      type="warning"
                      v-else-if="api.method == 'patch'">patch</el-tag>
              <el-tag size="mini"
                      type="danger"
                      v-else-if="api.method == 'delete'">delete</el-tag>
              {{api.url}} - {{api.summary}}
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="left-body-empty"
             v-else>暂无接口</div>
      </el-card>
    </el-aside>
    <el-main>
      <el-row :gutter="10">
        <el-col :span="24"
                style="display: flex; justify-content: space-around;">
          <el-input placeholder="请输入接口地址"
                    v-model="form.url"
                    style="margin-right: 10px">
            <el-select v-model="form.method"
                       slot="prepend"
                       style="width: 90px;">
              <el-option label="POST"
                         value="post"></el-option>
              <el-option label="GET"
                         value="get"></el-option>
              <el-option label="PUT"
                         value="put"></el-option>
              <el-option label="PATCH"
                         value="patch"></el-option>
              <el-option label="DELETE"
                         value="delete"></el-option>
            </el-select>
          </el-input>
          <div style="display: flex;">
            <el-button type="primary"
                       @click="handleSubmit">发 送</el-button>
            <el-button type="danger"
                       @click="handleReset">重 置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-col :span="24"
              style="margin-top: 10px;">
        <el-tabs>
          <el-tab-pane label="请求参数">
            <el-table border
                      :data="syncData"
                      size="small">
              <el-table-column label="参数名"
                               width="200">
                <template slot-scope="scope">
                  <span style="color: #F56C6C; position: absolute; left: 2px;"
                        v-if="scope.row.required">*</span>
                  <el-input size="small"
                            v-model="scope.row.key"
                            placeholder="请输入参数名"
                            clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column label="值">
                <template slot-scope="scope">
                  <el-input size="small"
                            v-model="scope.row.value"
                            :placeholder="scope.row.placeholder || '请输入值'"
                            clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               width="100">
                <template slot="header">
                  <el-button type="primary"
                             size="mini"
                             circle
                             plain
                             icon="el-icon-plus"
                             @click="handleFieldAdd"></el-button>
                </template>
                <template slot-scope="scope">
                  <el-button circle
                             plain
                             type="danger"
                             size="mini"
                             icon="el-icon-minus"
                             @click="handleFieldDelete(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="请求头">
            <el-table :data="syncHeaders"
                      border
                      size="small">
              <el-table-column label="参数名"
                               width="200">
                <template slot-scope="scope">
                  <el-input size="small"
                            v-model="scope.row.key"
                            placeholder="请输入参数名"
                            clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column label="值">
                <template slot-scope="scope">
                  <el-input size="small"
                            v-model="scope.row.value"
                            placeholder="请输入值"
                            clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               width="100">
                <template slot="header">
                  <el-button type="primary"
                             size="mini"
                             circle
                             plain
                             icon="el-icon-plus"
                             @click="handleHeaderAdd"></el-button>
                </template>
                <template slot-scope="scope">
                  <el-button circle
                             plain
                             type="danger"
                             size="mini"
                             icon="el-icon-minus"
                             @click="handleHeaderDelete(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="24"
              style="margin-top: 10px;">
        <el-card header="返回结果"
                 shadow="never"
                 :body-style="{padding: '0'}">
          <el-input type="textarea"
                    readonly
                    resize="none"
                    :value="JSON.stringify(syncResult, null, 2)"
                    autosize></el-input>
        </el-card>
      </el-col>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ApiDocs',
  props: {
    asideWidth: {
      type: Number,
      default: 350
    },
    docUrl: String,
    baseUrl: String,
    validate: {
      type: Boolean,
      default: true
    },
    autoRequest: {
      type: Boolean,
      default: true
    },
    exportBtn: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => {
        return [{}]
      }
    },
    headers: {
      type: Array,
      default: () => {
        return [{}]
      }
    },
    result: {
      type: Object,
      default: () => {
        return {
          data: {},
          code: 200,
          msg: "描述信息",
        }
      }
    }
  },
  data () {
    return {
      list: [],
      form: { method: 'post' },
      syncData: this.data,
      syncHeaders: this.headers,
      syncResult: this.result
    }
  },
  mounted () {
    if (this.docUrl) {
      this.getApis()
    }
  },
  methods: {
    getApis () { // 根据swagger2 url 获取接口文档
      axios.get(this.docUrl).then(res => {
        this.swagger = res.data
        res = res.data
        const list = []
        res.tags.forEach(tag => {
          const tagName = tag.name
          const obj = { label: tagName, children: [] }
          for (let url in res.paths) {
            const { post, get, put } = res.paths[url];
            const del = res.paths[url]['delete']
            if (post) if (post.tags.includes(tagName)) obj.children.push({ url, method: 'post', params: post.parameters, summary: post.summary })
            if (get) if (get.tags.includes(tagName)) obj.children.push({ url, method: 'get', params: get.parameters, summary: get.summary })
            if (put) if (put.tags.includes(tagName)) obj.children.push({ url, method: 'put', params: put.parameters, summary: put.summary })
            if (del) if (del.tags.includes(tagName)) obj.children.push({ url, method: 'delete', params: del.parameters, summary: del.summary })
          }
          list.push(obj)
        })
        this.list = list
      }).catch(err => {
        this.$message.error("获取swagger接口文档失败：" + err.message)
      })
    },
    async handleSubmit () { // 提交测试接口
      let { url, method } = this.form
      const params = this.syncData
      let data = {}
      const rules = {}
      if (!url) this.$message.error("请输入接口地址")
      else {
        params.forEach(p => {
          if (p.in == 'path') url = url.replace(`{${p.key}}`, p.value)
          else {
            data[p.key] = p.value;
            if (p.required) rules[p.key] = { required: true, message: `请填写 ${p.placeholder || p.key}` }
          }
        })

        const headers = {}
        this.syncHeaders.forEach(h => { if (h.key && h.value) headers[h.key] = h.value })

        const config = { url, method, headers, timeout: 30000, baseURL: this.baseUrl || `http://${this.swagger.host}` }

        if (method == 'get') config.params = data
        else config.data = data

        if (this.validate) { // 需要校验
          const valid = await this.handleValidate(data, rules)
          if (valid) this.handleRequest(config)
        } else this.handleRequest(config)
      }
    },
    getConfig () {
      let { url, method } = this.form
      const params = this.syncData
      let data = {}
      if (!url) this.$message.error("请输入接口地址")
      else {
        params.forEach(p => {
          if (p.in == 'path') url = url.replace(`{${p.key}}`, p.value)
          else {
            data[p.key] = p.value;
          }
        })

        const headers = {}
        this.syncHeaders.forEach(h => { if (h.key && h.value) headers[h.key] = h.value })

        const config = { url, method, headers, timeout: 30000, baseURL: this.baseUrl || `http://${this.swagger.host}` }

        if (method == 'get') config.params = data
        else config.data = data

        return config
      }
    },
    handleRequest (config) {
      if (this.autoRequest) { // 需要自动处理接口请求
        const loading = this.$loading({
          lock: true,
          text: '加载中',
          background: "rgba(0, 0, 0, .1)"
        })
        axios(config).then(res => {
          loading.close()
          this.syncResult = res.data
        }).catch(err => {
          loading.close()
          this.syncResult = err.response ? err.response.data : err
        })
      } else this.$emit("submit", config)
    },
    handleApi (item) { // 自动填写接口请求详情
      this.handleReset()
      const { url, method, params } = item
      this.form = { url, method }
      const arr = []
      if (params) params.forEach(p => { arr.push({ key: p.name, placeholder: p.description, in: p.in, required: p.required }) })
      this.syncData = arr
    },
    handleReset () { // 重置
      this.form = { method: 'post' }
      this.syncData = [{}]
      this.syncResult = {
        data: {},
        status: 200,
        message: "描述信息",
      }
    },
    handleFieldAdd () { // 表格添加一行
      const table = JSON.parse(JSON.stringify(this.syncData));
      if (table && table.length == 0) {
        table.push({})
        this.syncData = table
      } else {
        const last = table[table.length - 1]
        if (Object.keys(last).length != 0) {
          table.push({})
          this.syncData = table
        } else this.$message.error("表格最后一行未填写完成");
      }
    },
    handleFieldDelete (index) { // 表格删除一行
      const table = JSON.parse(JSON.stringify(this.syncData))
      if (table.length <= 1) this.$message.error("无法删除最后一行")
      else {
        table.splice(index, 1)
        this.syncData = table
      }
    },
    handleHeaderAdd () { // 请求头表格添加一行
      const table = JSON.parse(JSON.stringify(this.syncHeaders))
      if (table && table.length == 0) {
        table.push({})
        this.syncHeaders = table
      } else {
        const last = table[table.length - 1]
        if (Object.keys(last).length != 0) {
          table.push({})
          this.syncHeaders = table
        } else this.$message.error("表格最后一行未填写完成")
      }
    },
    handleHeaderDelete (index) { // 请求头表格删除一行
      const table = JSON.parse(JSON.stringify(this.syncHeaders))
      if (table.length <= 1) this.$message.error("无法删除最后一行")
      else {
        table.splice(index, 1)
        this.syncHeaders = table
      }
    },
    handleValidate (data, rules) {
      return new Promise((resolve, reject) => {
        if (data && rules) {
          let pass = true
          for (let key in rules) {
            let rule = rules[key]
            if (rule && rule.pattern && !rule.pattern.test(this.user[key])) {
              this.$message.error(rule.message || '校验失败')
              pass = false
              break
            } else if (rule && rule.required && !data[key]) {
              this.$message.error(rule.message || '校验失败')
              pass = false
              break
            }
          }
          resolve(pass)
        } else reject('需校验的对象为空')
      })
    }
  },
  watch: {
    data (val) {
      this.syncData = val
    },
    syncData: {
      handler (val) {
        this.$emit('update:data', val)
      },
      deep: true
    },
    headers (val) {
      this.syncHeaders = val
    },
    syncHeaders: {
      handler (val) {
        this.$emit('update:headers', val)
      },
      deep: true
    },
    result (val) {
      this.syncResult = val
    },
    syncResult: {
      handler (val) {
        this.$emit('update:result', val)
      },
      deep: true
    },
  }
}
</script>
<style lang="scss">
html {
  height: 100%;
}
body {
  height: calc(100% - 10px);
  margin: 0;
  background-color: #f0f2f5;
}
.el-api-docs {
  background: white;
  margin: 5px 5px 0 5px;
  border-radius: 5px;
  max-height: calc(100vh - 10px);
  overflow-y: scroll;

  .el-card__header {
    padding: 10px 20px;
  }
  .left {
    margin: 20px 0 0 20px;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-body {
      border: none;
      padding: 0 10px 0 20px;

      &-item {
        font-size: 15px;
        cursor: pointer;
      }
    }

    &-body-empty {
      padding-top: 20px;
      text-align: center;
    }
  }

  .el-textarea__inner {
    border: none;
    border-radius: 0px;
  }
}
</style>
