<template>
  <div class="upload-card">
    <el-upload
      action="/"
      :limit="1"
      :show-file-list="false"
      accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PNG,.PDF"
      :before-upload="beforeUpload"
    >
      <div class="pic">
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
          <span>{{ tips }}</span>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { uploadFile } from '@/api/common'
import { filterFileType } from '@/filters'
import { getIdCardInfo } from '@/api'
export default {
  components: {},
  props: {
    tips: {
      type: String,
      default: ''
    },
    defaultImage: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      canvas: null
    }
  },
  methods: {
    // 使用async/await会使得return false失效
    beforeUpload(files) {
      if (filterFileType(files.name)) {
        if (files.name.toLowerCase().indexOf('pdf') > -1) {
          this.uploadFile(files, 'pdf')
        } else {
          this.$utils.imgToCompressed(files, { width: 400 }).then(base64Str => {
            this.uploadFile(base64Str, 'img')
          })
        }
      } else {
        this.$utils.showError(`附件只能上传JPG、PNG、PDF`)
      }
      return false
    },
    uploadFile(file, type) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData).then(async res => {
        this.$emit('update:path', res.files.file)
        if (type === 'img') {
          // ocr校验
          // 获取图片base64
          this.$utils.showLoading({ text: '正在识别信息，请稍后...' })
          getIdCardInfo(this.$utils.getFile(res.files.file)).then(res => {
            this.$utils.hideLoading()
            this.$emit('setIdCard', res.outData.cards)
          })
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.upload-card {
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
}

</style>
