<template>
  <div class="epdf" :style="epdfStyle">
    <header :class="{'white-bg': isFullscreen}">
      <v-button @click="switchFullscreen" type="text" class="control" v-show="!isFullscreen" :disabled="!hasInit">
        <i class="iconfont icon-fullscreen"></i>
      </v-button>
      <v-button @click="switchNormalscreen" type="text" class="control" v-show="isFullscreen" :disabled="!hasInit">
        <i class="iconfont icon-fullscreen-exit"></i>
      </v-button>
      <v-button @click="reload" type="text" class="control" :loading="isReloading" :disabled="!hasInit">
        <i class="iconfont icon-reload"></i>
      </v-button>
      <v-button @click="downloadFile" id="download-bt" type="text" class="control" :loading="isDownloading" :disabled="!hasInit">
        <i class="iconfont icon-download"></i>
      </v-button>
      <v-button @click="openNewWin" type="text" class="control" :loading="isOpenNew" :disabled="!hasInit">
        <i class="iconfont icon-openinnew" id="openinnew"></i>
      </v-button>
    </header>
    <section :id="containerId" ></section>
  </div>
</template>

<script>
import { EpdfView } from 'epdf-view'
import { download } from 'dl-easy'
import VButton from './VButton.vue'
import '../assets/iconfont/iconfont.css'
const remote = window.require('electron').remote

const normalStyle = { position: 'relative', height: '536px' }

export default {
  name: 'Epdf',
  data () {
    return {
      epdfView: null,
      containerId: `container-${new Date().getTime() + parseInt(Math.random() * 1000000)}`,
      hasInit: false,
      isInitializing: false,
      isFullscreen: false,
      epdfStyle: normalStyle,
      isDownloading: false,
      isOpenNew: false,
      isReloading: false,
      currentWindow: null
    }
  },
  props: {
    pdfUrl: {
      type: String,
      required: true
    },
    fullscreen: {
      type: Object,
      default () {
        return {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      } 
    }
  },
  watch: {
    pdfUrl (value) {
      if (value && !this.epdfView) {
        this.init()
      }
    }
  },
  mounted () {
    this.pdfUrl ? this.init() : ''
  },
  beforeDestroy () {
    if (this.epdfView && typeof this.epdfView.destroy === 'function') {
      this.epdfView.destroy()
      setTimeout(() => { this.epdfView = null }, 200)
    }
  },
  methods: {
    init () {
      if (this.isInitializing) return
      this.isInitializing = true
      let timer = setTimeout(() => { 
        this.isInitializing = false
        this.$emit('init-fail', new Error('timeout')) 
      }, 5 * 1000)

      this.$emit('init-start')
      let epdfView = new EpdfView(this.pdfUrl, this.containerId,  {
        'did-start-loading': this.handleStartLoad,
        'dom-ready': this.handleDomReady,
        'did-stop-loading': this.handleStopLoad,
        'did-fail-load': this.handleFailLoad,
        'destroyed': this.handleDestroyed
      }, (err, data) => {
        if (err) {
          this.hasInit = false
          this.isInitializing = false
          clearTimeout(timer)
          return this.$emit('init-fail', err)
        }
        this.hasInit = true
        this.isInitializing = false
        clearTimeout(timer)
        return this.$emit('init-success', data)
      })
      this.epdfView = epdfView
      this.currentWindow = remote.getCurrentWindow()
    },
    switchFullscreen () {
      this.epdfStyle = {
        position: 'fixed',
        zIndex: '2018',
        top: `${this.fullscreen.top}px`,
        bottom: `${this.fullscreen.bottom}px`,
        left: `${this.fullscreen.left}px`,
        right: `${this.fullscreen.right}px`,
      }
      this.isFullscreen = true
      this.epdfView.reload()
    },
    switchNormalscreen () {
      this.epdfStyle = normalStyle
      this.isFullscreen = false
      this.epdfView.reload()
    },
    openNewWin () {
      if (this.isOpenNew) return
      this.isOpenNew = true
      let timer = setTimeout(() => {
        this.isOpenNew = false
        this.$emit('timeout-open-new')
      }, 30 * 1000)

      this.epdfView.open(remote.BrowserWindow, this.pdfUrl, {
        width: 800,
        height: 600,
      }).then(data => {
        this.$emit('open-win-success', data)
        this.isOpenNew = false
        clearTimeout(timer)
      }).catch(err => {
        this.$emit('open-win-fail', err)
        this.isOpenNew = false
        clearTimeout(timer)
      })
    },
    reload () {
      if (this.isReloading) return
      this.isReloading = true

      this.$nextTick(() => {
        this.epdfView.reload()
          .then(data => {
            this.$emit('reload-success', data)
            this.isReloading = false
          })
          .catch(err => {
            this.$emit('reload-fail', err)
            this.isReloading = false
          })
      })
    },
    downloadFile () {
      if (this.isDownloading) return
      this.isDownloading = true 
      let timer = setTimeout(() => {
        this.isDownloading = false
        this.$emit('timeout-download')
      }, 30 * 1000)
      
      this.$nextTick(() => {
        download(this.currentWindow, this.pdfUrl, {
          'onStart': (fileObj) => { 
            this.$emit('start-download', fileObj)
          },
          'onCancel': (fileObj) => { 
            this.$emit('cancel-download', fileObj)
            this.isDownloading = false
            clearTimeout(timer)
          }
        })
          .then(fileObj => {
            this.$emit('download-success', fileObj)
            this.isDownloading = false
            clearTimeout(timer)
          })
          .catch(err => {
            this.$emit('download-fail', err)
            this.isDownloading = false
            clearTimeout(timer)
          })
      })
    },
    handleStartLoad () {
      this.$emit('start-load')
    },
    handleDomReady () {
      this.$emit('dom-ready')
    },
    handleStopLoad () {
      this.$emit('stop-load')
    },
    handleFailLoad (err) {
      this.$emit('fail-load', err)
    },
    handleDestroyed () {
      this.$emit('destroyed')
    },
    loadURL (url, isUpdate = false) {
      return new Promise((resolve, reject) => {
        this.epdfView.loadURL(url, isUpdate)
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  components: {
    VButton
  },
}
</script>

<style scoped>
.epdf{
  background: transparent;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0px 0px 4px 1px rgba(141, 103, 103, 0.15);
  min-width: 200px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
}
header{
  padding-left: 4px;
  flex: 0 0 auto;
  min-height: 30px;
  -webkit-user-select: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
section{
  flex: 1 1 auto;
}

button.control{
  padding: 4px 8px;
  margin: 4px 0px;
  border-radius: 2px !important;
  -webkit-user-select: none;
}
.control .iconfont{
  font-size: 16px;
  font-weight: 600;
}

.white-bg{
  background: #fff;
}
</style>