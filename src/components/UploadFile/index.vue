<template>
  <div class="upload-file">
    <div v-if="!isConstitutionPdf" class="btns">
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
      <div class="tips">支持JPG,PNG,PDF</div>
    </div>
    <div v-if="!isConstitutionPdf && filePaths.length > 0" class="img-list">
      <div v-for="(item,index) in filePaths" :key="item" class="list">
        <img v-if="!judgeIsPdf(item)" class="preview" :src="$utils.getFile(item)" alt="" @click="handlePreview(item)" />
        <div v-else class="pdf" @click="handlePreview(item)">
          <pdf
            class="preview"
            :src="baseUrl + item"
            style="overflow:hidden;"
          />
          {{ baseUrl + item }}
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
        <div class="pdf" @click="handlePreview(item)">
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
import { filterFileType } from '@/filters'
import pdf from 'vue-pdf'
export default {
  components: {
    pdf
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
      loading: false,
      isPicturePreview: false,
      isPdfPreview: false,
      dialogImageUrl: '',
      dialogPdfUrl: '',
      baseUrl: '' // 预览PDF域名
    }
  },
  mounted() {
    this.baseUrl = window.location.origin + `${this.$utils.getPrefix()}/open-platform/`
  },
  methods: {
    // 判断文件 uuid是否为 pdf
    judgeIsPdf(url) {
      const type = url.slice(-3)
      return type === 'pdf'
    },
    handlePreview(url) {
      console.log(`${url}`)
      if (!this.judgeIsPdf(url)) {
        this.isPicturePreview = true
        this.dialogImageUrl = this.$utils.getFile(url)
      } else {
        this.isPdfPreview = true
        this.dialogPdfUrl = this.$utils.getFile(url)
      }
    },
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
        const message = this.isConstitutionPdf ? '附件只能上传JPG、PNG、PDF' : '附件只能上传PDF'
        this.$utils.showError(message)
        return false
      }
    },
    uploadFiles() {
      this.loading = true
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        formData.append(i, this.files[i])
      }
      uploadFile(formData).then(res => {
        if (+res.errCode === 1) {
          let fs = Object.values(res.files)
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
    },
    handleDel(index) {
      this.filePaths.splice(index, 1)
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
