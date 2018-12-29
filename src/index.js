import VueEpdf from './components/Epdf.vue'

VueEpdf.install = function (Vue, opt = {}) {
  if (install.installed) return
  install.installed = true
  Vue.component('VueEpdf', VueEpdf)
}

if (typeof window !== undefined && window.Vue) {
  window.Vue.use(VueEpdf)
}

export default VueEpdf

