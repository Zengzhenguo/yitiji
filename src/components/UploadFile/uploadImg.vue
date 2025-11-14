<template>
  <div class="upload-file">
    <div class="btns">
      <!-- 图片 -->
      <el-upload
        action="/"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :multiple="multiple"
        :disabled="loading"
        accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PNG,.PDF"
      >
        <el-button :loading="loading">本地上传</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { uploadFile } from '@/api/common'
import { filterFileType } from '@/filters'
export default {
  components: {
  },
  props: {
    filePaths: {
      type: Array,
      default: () => []
    },
    // 是否可以一次上传多个附件
    multiple: {
      type: Boolean,
      default: true
    },
    isConstitutionPdf: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      files: [],
      timer: null,
      loading: false
    }
  },
  computed: {},
  mounted() {
  },
  methods: {
    // 附件上传
    beforeUpload(files) {
      if (filterFileType(files.name)) {
        this.files.push(files)
        this.clearTimer()
        // 延迟0.4秒执行，从而阻止并发请求（还没发起请求就return false，最后一次不会）
        this.timer = setTimeout(() => {
          this.uploadFiles()
        }, 400)
        return false
      } else {
        const message = this.isConstitutionPdf ? '附件只能上传PDF' : '附件只能上传JPG、PNG、PDF'
        this.$utils.showError(message)
        return false
      }
    },
    // 上传文件
    uploadFiles() {
      this.loading = true
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        formData.append(i, this.files[i])
      }
      uploadFile(formData).then(res => {
        if (+res.errCode === 1) {
          let fs = Object.values(res.files)
          console.log('上传问价回调：', fs)
          if (fs.length === 1) {
            fs = fs[0]
            this.filePaths.push(fs)
          } else {
            fs.forEach(ele => {
              this.filePaths.push(ele)
            })
          }
        }
        this.files = []
        this.loading = false
      }).catch(() => {
        this.files = []
        this.loading = false
      })
    },
    clearTimer() {
      clearTimeout(this.timer)
    }
  }
}
</script>
<style lang='scss' scoped>
.upload-file {
  // display: flex;
  .btns {
    flex: 1;
    display: flex;
    height: 43px;
    align-items: center;
    .el-button {
      width: 86px;
      height: 43px;
      padding: 0;
      box-sizing: border-box;
      text-align: center;
      line-height: 43px;
      border: 1px solid #3162E8;
      color: #3162E8;
    }
    .tips {
      font-size: 14px;
      font-weight: 400;
      color: #7F7E7E;
      margin-left: 14px;
      min-width: 135px;
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
