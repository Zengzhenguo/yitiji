<template>
  <div>
    <el-popover
      v-model="visible"
      :placement="placement"
      trigger="click"
      @show="showCode"
      @hide="hideCode"
    >
      <div class="codeBox">
        <vue-qr class="code" :text="codeText" :size="200" :logo-src="imageUrl" />
        <p>请用微信扫码上传</p>
        <p>（上传过程请勿关闭二维码）</p>
      </div>
      <el-button slot="reference" class="codeBtn">扫码上传</el-button>
    </el-popover>
  </div>
</template>

<script>
import vueQr from 'vue-qr'
import { getFileUUID, uploadGetUUID } from '@/api/index'
import { getIdCardInfo } from '@/api'
export default {
  components: {
    vueQr
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['placement', 'alias'],
  data () {
    return {
      codeText: '', // 二维码内容
      token: '',
      ident: '',
      tipStatus: false, // 提示标识 -- 默认为关闭提示
      visible: false, // popover可见状态
      imageUrl: '' // require('../../assets/images/logo.png') // 二维码logo地址
    }
  },
  created () {
    this.token = window.localStorage.getItem('token')
    this.ident = window.sessionStorage.getItem('ident')
  },
  methods: {
    async showCode () {
      this.tipStatus = false // 重置提示状态
      // 自行改成本地ip调试，移动端需要写死token
      // const host = `https://rong.wetruetech.cn${this.$utils.getPrefix()}/ecGovBizHubei/#/` //这里修改了
      const host = `https://scjg.hubei.gov.cn/zhkb/ecGovBizHubei/#/`
      // const host = `http://172.20.10.4:8081${this.$utils.getPrefix()}/ecGovBizHubei/#/`
      let params = `${host}?type=5&token=${this.token}&ident=${this.ident}&alias=${this.alias}`
      if (this.alias === 'jysqbUrl') {
        params += `&isXls=true`
        console.log(`%c%s`, `color:blue`, `[Debug] ~ showCode ~ params`, params)
      }
      this.codeText = params
      // 扫码上传前先清空接口上一轮的数据
      await uploadGetUUID(this.ident)
      // 开启轮询
      this.openInterval()
      return
    },
    // 轮询接口查询数据
    openInterval() {
      console.log('---开启轮询---')
      this.intervalID = setInterval(async () => {
        const res = await getFileUUID(this.ident)
        if (res.errMsg !== '成功' || res.errCode !== '1') return
        const inData = res.outData && res.outData.jobPackage.HB_QYKB_DRAFT.inData
        if (inData.files.length !== 0) {
          this.hideCode(1)
          this.$emit('update', {
            data: inData.files,
            type: inData.type
          })
          if (inData.type === 'personnel') { // 身份证
            // 获取图片base64
            let front = {}
            let back = {}
            if (inData.files[0].front) {
              // const imageBase64 = await this.$utils.getImageBase64(inData.files[0].front)
              front = await this.getIdCardInfo(this.$utils.getFile(inData.files[0].front), '正')
            }
            if (inData.files[0].back) {
              // const imageBase64 = await this.$utils.getImageBase64(inData.files[0].back)
              back = await this.getIdCardInfo(this.$utils.getFile(inData.files[0].back), '反')
            }
            this.$emit('setIdCard', [front, back])
          }
        }
      }, 3000)
    },
    getIdCardInfo(path, type) {
      return new Promise(resolve => {
        this.$utils.showLoading({ text: `正在识别身份证${type}面，请稍后...` })
        getIdCardInfo(path).then(res => {
          this.$utils.hideLoading()
          resolve(res.outData.cards)
        })
      })
    },
    hideCode(val) {
      // 关闭轮询
      this.destroyInterval()
      console.log('---关闭轮询---')
      // 已上传时触发
      if (+val === 1) {
        this.tipStatus = true
        this.visible = false // 关闭popover
        this.$utils.showSuccess('扫码上传已完成！')
        return
      }
      // 关闭时触发
      if (!this.tipStatus) {
        this.$utils.showWarn('扫码上传通道已关闭！')
      }
    },
    // 销毁定时器
    destroyInterval () {
      clearInterval(this.intervalID)
      this.intervalID = null
      // clearTimeout(this.timeoutID)
      // this.timeoutID = null
    }
  }
}
</script>

<style lang='scss' scope>
  .codeBtn {
    float: left;
    margin-right: 10px;
    width: 86px;
    height: 43px;
    padding: 0;
    box-sizing: border-box;
    text-align: center;
    line-height: 43px;
    border: 1px solid #3162E8;
    color: #3162E8;
    &:hover {
      border: 1px solid #3162E8;
    }
  }
  .codeBox {
    text-align: center;
    .code {
      display: block!important;
      margin: 0 auto;
      width: 200px;
      height: 200px;
    }
  }
  .none {
    display: none;
  }
</style>
