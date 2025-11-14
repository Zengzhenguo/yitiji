<template>
  <div class="photo-box">
    <page-header v-show="show" class="photo-page-header" />
    <div v-if="type === 'single'" class="pic" @click="handleGo">
      <div class="logo">
        <template v-if="path.toLowerCase().indexOf('pdf') > -1">
          <embed
            :src="$utils.getFile(path)"
            type="application/pdf"
            style="overflow:hidden"
          />
        </template>
        <template v-else>
          <img :src="path ? $utils.getFile(path) : defaultImage" />
        </template>
      </div>
      <div class="desc">
        <img src="../../assets/images/camera_icon.png" />
        <span>{{ singleTips }}</span>
      </div>
    </div>
    <el-button v-else class="camera-btn" @click="handleGo">拍照上传</el-button>
    <div v-if="showGuide" class="guide-box">
      <div class="camera-guide">
        <div class="title">请将需要拍照的文件横向放入扫描入口</div>
        <img src="../../assets/images/camera_guide.gif" alt="" />
        <div class="btn-group">
          <el-button type="primary" @click="showGuide = false;show = false">取消拍照</el-button>
          <el-button type="primary" @click="handleNext">下一步</el-button>
        </div>
      </div>
    </div>

    <div v-if="showCamera" class="camera-box">
      <div class="box">
        <!-- <div class="tips">{{ tips }}</div> -->
        <div class="tips">{{ type === 'single' ? '请将证件放置在框内' : '请将文件横向放置在白框内' }}</div>
        <div v-if="device === 'MD'||device ==='ZW'||device ==='HDY'" class="camera md_camera">
          <img id="photo" :src="mdImgPath" />
        </div>
        <div v-else class="camera"></div>
      </div>
      <div v-if="filePaths.length" class="photos">
        <div v-for="(item,index) in filePaths" :key="index">
          <img :src="$utils.getFile(item)" alt="" />
          <div @click="handleDel(index)">删除</div>
        </div>
      </div>
      <div v-if="type === 'single' && path" class="photos" style="justify-content: center;">
        <div>
          <img :src="$utils.getFile(path)" alt="" />
          <div @click="handleDel(-1)">删除</div>
        </div>
      </div>
      <div class="btn-group">
        <el-button type="primary" :disabled="loading" @click="handleCancel">取消拍照</el-button>
        <el-button type="primary" :disabled="loading" @click="handleBegin">点击拍照</el-button>
        <el-button type="primary" :disabled="disabled" @click="handleComplete('success')">完成拍照</el-button>
      </div>
    </div>
    <div v-if="!isConstitutionPdf && filePaths.length > 0 && type !== 'single'" class="img-list">
      <div v-for="(item,index) in filePaths" :key="item" class="list">
        <img v-if="!judgeIsPdf(item)" class="preview" :src="$utils.getFile(item)" alt="" @click="handlePreviewFile(item)" />
        <div v-else class="pdf" @click="handlePreviewFile(item)">
          <pdf
            class="preview"
            :src="baseUrl + item"
            style="overflow:hidden;"
          />
        </div>
        <!-- <el-button type="primary" size="mini" class="del_button" @click="handleDel(index)">删除</el-button> -->
        <span class="del_button" @click="handleDel(index)">删除</span>
      </div>
    </div>
    <el-dialog :visible.sync="isPicturePreview">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <!-- 章程 -->
    <div v-if="isConstitutionPdf" class="btns">
      <el-upload
        action="/"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :multiple="false"
        :disabled="loading"
        accept=".PDF"
      >
        <el-button :loading="loading">本地上传</el-button>
      </el-upload>
      <div class="tips">支持PDF</div>
    </div>
    <div v-if="isConstitutionPdf && filePaths.length > 0" class="img-list">
      <div v-for="(item,index) in filePaths" :key="item" class="list">
        <!-- <img class="check" src="../../assets/images/checked.png" alt="上传成功" />
        <div class="text" @click="handlePreview(item)">{{ item }}</div>
        <img class="del-btn" src="../../assets/images/del_btn.png" alt="删除" @click="handleDel(index)" /> -->
        <div class="pdf" @click="handlePreviewFile(item)">
          <pdf
            class="preview"
            :src="baseUrl + item"
            style="overflow:hidden;"
          />
        </div>
        <!-- <el-button type="primary" size="mini" class="del_button" @click="handleDel(index)">删除</el-button> -->
        <span class="del_button" @click="handleDel(index)">删除</span>
      </div>
    </div>
    <el-dialog :visible.sync="isPdfPreview" width="70%">
      <embed
        :src="dialogPdfUrl"
        type="application/pdf"
        style="overflow:hidden;width:100%;height:500px;"
      />
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile } from '@/api/common'
import waitImg from '@/assets/images/wait.jpg'
import { openSnCamera, closeSnCamera, snCameraBeginSnap, MD_GetDeviceCount, MD_StartPreview, MD_getframe, MD_StopPreview, MD_getPic, MD_EnableDeskImage, ZW_getImgBase64 } from '@/api/terminal'
import PageHeader from '@/components/PageHeader/index'
import pdf from 'vue-pdf'
import { getIdCardInfo } from '@/api'
export default {
  components: {
    PageHeader,
    pdf
  },
  props: {
    // tips: {
    //   type: String,
    //   default: '请将文件横向放置在白框内'
    // },
    filePaths: { // type为multiple时有效
      type: Array,
      default: () => []
    },
    path: { // type为single时有效
      type: String,
      default: ''
    },
    singleTips: {
      type: String,
      default: ''
    },
    defaultImage: {
      type: String,
      default: ''
    },
    type: { // 类型：single、multiple
      type: String,
      default: 'multiple'
    },
    isConstitutionPdf: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disabled: true,
      show: false, // 显示头部
      showGuide: false, // 显示指引
      showCamera: false, // 显示高拍仪
      loading: false,
      cachedPaths: [], // 缓存已有内容
      isPicturePreview: false,
      isPdfPreview: false,
      dialogImageUrl: '',
      dialogPdfUrl: '',
      baseUrl: '', // 预览PDF域名
      device: '',
      mdImgPath: waitImg,
      timer: null,
      websock: null
    }
  },
  beforeDestroy() { // 销毁时关闭高拍仪
    let tid = this.$utils.getLocalItem('tId')
    if (this.device === 'MD' || tid.includes('MD')) {
      clearInterval(this.timer)
      if (this.type === 'single') {
        MD_EnableDeskImage(0)
      }
    } else if (this.device === 'ZW' || this.device === 'HDY' || tid.includes('ZW')) {
      // 离开路由之后断开websocket连接
      this.websock.close()
    } else {
      closeSnCamera()
    }
  },
  mounted() {
    let tid = this.$utils.getLocalItem('tId')
    // console.log('NODE_ENV = ', process.env.NODE_ENV)
    // console.log('window.location.origin = ', window.location.origin)
    this.baseUrl = window.location.origin + `${this.$utils.getPrefix()}/open-platform/`
    this.disabled = true
    this.device = this.$utils.getLocalItem('device') || ''
    if (this.device === 'ZW' || tid.includes('ZW')) {
      // this.initWebSocket()
    }
  },
  methods: {
    // 判断文件 uuid是否为 pdf
    judgeIsPdf(url) {
      const type = url.slice(-3)
      return type === 'pdf'
    },
    handlePreviewFile(url) {
      if (!this.judgeIsPdf(url)) {
        this.isPicturePreview = true
        this.dialogImageUrl = this.$utils.getFile(url)
      } else {
        this.isPdfPreview = true
        this.dialogPdfUrl = this.$utils.getFile(url)
      }
    },
    handleGo() {
      // 打开指引
      if (this.$route.query.mode === 'test' || this.$utils.getLocalItem('mode')) {
        return
      }
      this.showGuide = true
      this.show = true
    },
    handleNext() { // 点击下一步，打开高拍仪
      this.showGuide = false
      this.showCamera = true
      this.disabled = true
      if (this.type === 'single') {
        this.cachedPaths = [this.path]
      } else {
        this.cachedPaths = JSON.parse(JSON.stringify(this.filePaths))
      }
      this.handleOpen()
    },
    handleDel(index) {
      if (this.type === 'single') {
        this.$emit('update:path', '')
        this.disabled = true
      } else {
        this.filePaths.splice(index, 1)
        if (!this.filePaths.length) {
          this.disabled = true
        }
      }
    },
    async handleOpen() {
      this.$utils.showLoading({ text: '正在打开高拍仪，请稍后' })
      if (this.device === 'MD' || this.$utils.getLocalItem('tId').includes('MD')) {
        const res = await this.handleUsePromise(MD_GetDeviceCount)
        if (res.customErrCode) {
          return this.$utils.showError('连接设备失败！')
        } else if (+res.data) { // 含有设备数量
          const previewInfo = await this.handleUsePromise(MD_StartPreview)
          if (!+previewInfo.returnCode) { // 开启预览成功
            this.$utils.hideLoading()
            this.timer = setInterval(async () => {
              const frameInfo = await this.handleUsePromise(MD_getframe)
              if (!+frameInfo.returnCode) {
                this.mdImgPath = 'data:image/jpg;base64,' + frameInfo.data.img
              }
            }, 1000)
            // 每次进入关闭纠偏
            MD_EnableDeskImage(0)
            // 开启纠偏
            if (this.type === 'single') {
              setTimeout(() => {
                MD_EnableDeskImage(1)
              }, 1000)
            }
          }
        }
      } else if (this.device === 'ZW' || this.device === 'HDY' || this.$utils.getLocalItem('tId').includes('ZW')) {
        this.init()
        this.$utils.hideLoading()
      } else {
        setTimeout(() => {
          let data = {}
          if (this.type === 'single') { // 默认单图是证件照，后面可能要改
            data = {
              snType: 2,
              x: 640,
              y: 184,
              width: 640, // 1060
              height: 480
            }
          } else {
            data = {
              snType: 0,
              x: 640,
              y: 184,
              width: 640, // 1060
              height: 480
            }
          }
          openSnCamera(data).then(res => {
            this.$utils.hideLoading()
            if (!res.success) {
              this.$utils.showError('打开高拍仪失败，请重试！')
            }
          })
        }, 300)
      }
    },
    async handleBegin() {
      if (this.device === 'MD' || this.$utils.getLocalItem('tId').includes('MD')) {
        // 纠偏处理
        // MD_EnableDeskImage(1).then(async () => {
        //   const res = await this.handleUsePromise(MD_getPic)
        //   // 关闭纠偏
        //   MD_EnableDeskImage(0)

        // })
        // 优化高拍仪图片上传速度，高拍仪返回base64转回file上传
        const res = await this.handleUsePromise(MD_getPic)
        const file = this.$utils.base64ToFile(res.data.img)
        const formData = new FormData()
        formData.append('file', file)
        this.loading = true
        uploadFile(formData).then(resp => {
          this.loading = false
          if (this.type === 'single') { // 单图（证件照）
            // this.filePaths = [resp.files.file]
            // 单图使用path
            this.$emit('update:path', resp.files.file)
            this.disabled = false
          } else {
            // 多图时使用filePaths
            this.filePaths.push(resp.files.file)
            this.disabled = false
          }
        }).catch(() => {
          this.loading = false
          this.$utils.showError('拍照失败，请重试！')
        })
      } else if (this.device === 'ZW' || this.device === 'HDY'|| this.$utils.getLocalItem('tId').includes('ZW')) {
        console.log('拍照')
        const time = new Date().getTime()
        // 先切边
        this.websock.send(`bSetMode(3)`)
        // 拍照保存在本地
        this.websock.send(`bSaveJPG(D:\\faceImage\\,${time})`)
        setTimeout(() => {
          ZW_getImgBase64().then(res => {
            console.log(res)
            if (res.flag === 500) {
              this.$utils.showError(res.message)
              return
            }
            const FileBase64 = res.data
            const file = this.$utils.base64ToFile(FileBase64)
            const formData = new FormData()
            formData.append('file', file)
            this.loading = true
            uploadFile(formData).then(resp => {
              this.loading = false
              if (this.type === 'single') { // 单图（证件照）
              // this.filePaths = [resp.files.file]
              // 单图使用path
                this.$emit('update:path', resp.files.file)
                this.disabled = false
              } else {
              // 多图时使用filePaths
                this.filePaths.push(resp.files.file)
                this.disabled = false
              }
            })
          })
        }, 3000)
      } else {
        snCameraBeginSnap().then(res => {
        // 优化高拍仪图片上传速度，高拍仪返回base64转回file上传
          const file = this.$utils.base64ToFile(res.obj.snapImage)
          const formData = new FormData()
          formData.append('file', file)
          this.loading = true
          uploadFile(formData).then(resp => {
            this.loading = false
            if (this.type === 'single') { // 单图（证件照）
            // this.filePaths = [resp.files.file]
            // 单图使用path
              this.$emit('update:path', resp.files.file)
              this.disabled = false
            } else {
            // 多图时使用filePaths
              this.filePaths.push(resp.files.file)
              this.disabled = false
            }
          }).catch(() => {
            this.loading = false
            this.$utils.showError('拍照失败，请重试！')
          })
        })
      }
    },
    handleCancel() {
      if (this.type === 'single') {
        this.$emit('update:path', this.cachedPaths[0])
      } else {
        this.filePaths = JSON.parse(JSON.stringify(this.cachedPaths))
      }
      this.handleComplete('cancel')
    },
    handleClose() {
      this.$utils.showLoading({ text: '正在关闭高拍仪，请稍后' })
      if (this.device === 'MD' || this.$utils.getLocalItem('tId').includes('MD')) {
        if (this.type === 'single') {
          // 关闭纠偏
          MD_EnableDeskImage(0)
        }
        MD_StopPreview().then(() => {
          this.$utils.hideLoading()
          this.showGuide = false
          this.showCamera = false
          this.show = false
          this.mdImgPath = waitImg
        })
      } else if (this.device === 'ZW' || this.device === 'HDY' || this.$utils.getLocalItem('tId').includes('ZW')) {
        // start('bStopPlay')
        this.$utils.hideLoading()
        this.showGuide = false
        this.showCamera = false
        this.show = false
        this.mdImgPath = waitImg
        this.websock.send('bStopPlay()')
        this.websock.onclose()
      } else {
        closeSnCamera().then(() => { // 点击完成，关闭2个弹窗
          this.$utils.hideLoading()
          this.showGuide = false
          this.showCamera = false
          this.show = false
        })
      }
    },
    async handleComplete(type) {
      // 单图上传（身份证）且不是取消拍照
      if (this.type === 'single') {
        // ocr校验
        // 获取图片base64
        if (type !== 'cancel') { // 不是取消拍照，校验身份证
          this.$utils.showLoading({ text: '正在识别身份证信息，请稍后...' })
          // 正面：e01e0853b4d245e7a34561c4f4051c3d.png
          // 反面: c60520c76e414954859bef106dc6dea3.png
          // const imageBase64 = await this.$utils.getImageBase64(this.path)
          getIdCardInfo(this.$utils.getFile(this.path)).then(res => {
            this.$utils.hideLoading()
            this.$emit('setIdCard', res.outData.cards)
            // 关闭高拍仪
            this.handleClose()
          })
        } else { // 取消拍照只关闭高拍仪
          // 关闭高拍仪
          this.handleClose()
        }
      } else {
        // 关闭高拍仪
        this.handleClose()
      }
    },
    /**
     * action：异步处理方法
     * data: 入参
     * expand: 扩展字段
     */
    handleUsePromise(action, data = {}) {
      return new Promise((resolve, reject) => {
        action(data).then(res => {
          resolve(res)
        }).catch(() => {
          this.$utils.showError('获取数据失败！')
          resolve({
            customErrCode: '1'
          })
        })
      })
    },

    // init函数可在页面加载的时候就进行初始化或者根据自己的业务需求在需要打开通讯的时候在进行初始化
    init() {
    // 实例化socket，这里的实例化直接赋值给this.websock是为了后面可以在其它的函数中也能调用websocket方法，例如：this.websock.close(); 完成通信后关闭WebSocket连接
      this.websock = new WebSocket('ws://127.0.0.1:1818')

      // 监听是否连接成功
      this.websock.onopen = () => {
        console.log('websock连接状态：' + this.websock.readyState)
        // 连接成功则发送一个数据
        this.websock.send('vSetResolution(8)')
        this.websock.send('bStartPlay')
        this.websock.send('bStartPlayRotate(90)')
      }

      // 接听服务器发回的信息并处理展示
      this.websock.onmessage = (event) => {
        // console.log('接收返回的data：', event.data)
        if (event.data === 'BeginbStopPlaytrueEndbStopPlay') {
          return
        }
        this.mdImgPath = 'data:image/jpg;base64,' + event.data
      }

      // 监听连接关闭事件
      this.websock.onclose = () => {
      // 监听整个过程中websocket的状态
        console.log('websock连接状态：' + this.websock.readyState)
      }

      // 监听并处理error事件
      this.websock.onerror = function(error) {
        console.log(error)
      }
    },
    // 图片转base64
    getImageBase64(url) {
      return new Promise(resolve => {
        const img = new Image()
        img.src = url
        // img.crossOrigin = ''
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, img.width, img.height)
          const dataURL = canvas.toDataURL().replace('data:image/png;base64,', '')
          resolve(dataURL)
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.photo-box {
  .photo-page-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
  }
  .camera-btn {
    width: 86px;
    height: 43px;
    padding: 0;
    text-align: center;
    border: 1px solid #3162E8;
    color: #3162E8;
  }
  .pic {
    width: 300px;
    height: 165px;
    border: 1px dashed #E0E0E0;
    border-radius: 8px;
    margin-right: 30px;
    .logo {
      width: 218px;
      height: 108px;
      margin: 18px auto 0 auto;
      img,embed {
        width: 218px;
        height: 108px;
      }
    }
    .desc {
      display: flex;
      height: 21px;
      align-items: center;
      justify-content: center;
      margin-top: 9px;
      img {
        width: 21px;
        height: 21px;
      }
      span {
        height: 21px;
        line-height: 21px;
        font-size: 14px;
        font-weight: 500;
        color: #7F7E7E;
        margin-left: 4px;
      }
    }
  }
  .guide-box {
    position: fixed;
    top: 100px;
    left: 0;
    width: 100%;
    height: calc(100vh - 100px);
    background: #FFF;
    z-index: 99;
    .camera-guide {
      width: 868px;
      margin: 0 auto;
      .title {
        font-size: 28px;
        font-weight: 600;
        color: #333333;
        padding-top: 50px;
        padding-bottom: 40px;
        text-align: center;
      }
      img {
        width: 868px;
        height: 563px;
      }
      .btn-group {
        padding-top: 60px;
        padding-bottom: 20px;
        text-align: center;
        .el-button {
          width: 155px;
          height: 48px;
          padding: 0;
          box-sizing: border-box;
          text-align: center;
          line-height: 48px;
          border: 1px solid #3162E8;
          color: #fff;
        }
      }
    }
  }

  .camera-box {
    position: fixed;
    top: 116px;
    left: 0;
    width: 100%;
    z-index: 99;
    height: calc(100vh - 116px);
    overflow: hidden;
    background: #333;
    .box {
      .tips {
        text-align: center;
        font-size: 28px;
        color: #fff;
        font-weight: 600;
        padding-top: 30px;
        padding-bottom: 30px;
      }
      .camera {
        width: 1060px;
        height: 488px;
      // background: #fff;
        margin: 0 auto;
        &.md_camera {
          width: 650px;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .photos {
      position: relative;
      width: 1060px;
      margin: 0 auto;
      display: flex;
      img {
        width: 72px;
        height: 90px;
        border: 1px solid #F9F9F9;
        box-sizing: border-box;
      }
      div {
        margin-top: 14px;
        font-size: 16px;
        font-weight: 400;
        color: #91B6FC;
        margin-right: 38px;
        text-align: center;
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .btn-group {
      padding-top: 20px;
      padding-bottom: 20px;
      text-align: center;
      .el-button {
        width: 155px;
        height: 48px;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
        line-height: 48px;
        border: 1px solid #3162E8;
        color: #fff;
      }
    }
  }
  .img-list {
    display: flex;
    overflow-x: auto;
    .list {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    .preview {
      width: 86px;
      height: 105px;
      margin: 15px 10px 5px 0;
      border-radius: 5px;
      border: 1px solid #DCDFE6;
      &:hover {
        cursor: pointer;
        border-color: #C0C4CC;
        // opacity: .8;
      }
      .pdf {
        width: 100%;
        height: 100%;
      }
    }
    .del_button {
      margin-left: -8px;
      margin-top: -10px;
      color: #3162E8;
      font-size: 12px;
      &:hover {
        color: #357cff;
        cursor: pointer;
      }
    }
  }
}
</style>
