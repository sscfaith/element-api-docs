import ApiDocs from './ApiDocs'

export default {
  install (Vue) {
    Vue.component('El' + ApiDocs.name, ApiDocs);
  }
}