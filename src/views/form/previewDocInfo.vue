<template>
  <div class="preview-pdf">
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="w-1200 box">
      <div class="title">{{ $route.meta.title }}</div>
      <h3 class="H3magin30">档案结构</h3>
      <div style="display: flex;">
        <el-tree :data="this.directory" 
        class="PDFleft"
        @node-click="handleNodeClick"
        node-key="id"
        ></el-tree>
        <div class="pdf">
          <embed
             v-if="this.pdf_isshow"
            :src="this.pdfURL"
            type="application/pdf"
            style="overflow:hidden"
          />
          <div v-else>
           <strong>请点击左侧目录下进行查看pdf</strong> 
          </div>
        </div>
      </div>
      <div class="btn-group text-center">
        <el-button  @click="$router.go(-1)"  style="color: #357cff;">上一步</el-button>
        <el-button type="primary" v-if="this.pdf_isshow" @click="down">扫码下载</el-button>
      </div>
    </div>
    <el-dialog
      class="success-dialog"
      :visible.sync="dialogVisible"
      width="506px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
    >
    <div class="success-dialog_son">
    <vue-qr style="margin-top: 29px;width: 200px;height: 200px;" :text="this.pdfURL"  :size="200" /> 
    <div class="dialog-tips">请使用手机浏览器扫码下载</div>
    </div>
    <span slot="footer" class="dialog-footer">
    </span>
    </el-dialog>
  </div>
</template>

<script>
import vueQr from 'vue-qr'
import Breadcrumb from '@/components/Breadcrumb/index'
import {Personal_directory_pdf} from '@/api/index'
export default {
  components: { 
    Breadcrumb ,
    vueQr,
  },
  data() {
    return {
      access_token:'',
      directory:[
        // {
        //   label: '设立登记',
        //   children: [{
        //     label: '二级 1-1',
        //   }]
        // },
        // {
        //   label: '企业变更',
        //   children: [{
        //     label: '二级 1-1',
        //   }]
        // }
      ],
      dialogVisible: false,
      pdf_isshow:false,
      pdfURLPre :'https://rong.wetruetech.cn/zhkb/open-platform/',
      pdfURL:'',
      pdfListInfomation:[]
    }
  },
  computed: {
    pdfListInfo() {
      return this.$store.state.pdfList.pdfList
    },
  },
  created(){
    if(this.pdfListInfo.length === 0){
      return this.$utils.showWarn('企业信息未获取成功')
    }
  this.pdfListInfomation  = this.pdfListInfo.data
  this.access_token= this.pdfListInfo.access_token
  const  new_element = {'label': null}
  for(let i=0, len=this.pdfListInfo.data.length;i<len;i++){
    this.directory.push(JSON.parse(JSON.stringify(new_element)))
    this.directory[i].label =this.pdfListInfomation[i].busnm
  }
  },
  watch: {
  },
  activated() {
  },
  methods: {
    down(){
      this.dialogVisible = true
      console.log(this.pdfURL,'this.pdfURL');
    },
    handleNodeClick(val){
      this.$loading({ text: '查询时间较长，请耐心等待' })
      console.log(val.label,'val');
      let targetObject = null;
      //获取对象
      for (let i = 0; i < this.pdfListInfomation.length; i++) {
        if (this.pdfListInfomation[i].busnm === val.label) {
          targetObject = this.pdfListInfomation[i];
          break;
        }
      }
      console.log(targetObject);
      let data = {
        access_token:this.access_token,
        data:targetObject
      }
      Personal_directory_pdf(data).then(res=>{
        this.$loading().close()
        if(res.outData.data){
          this.pdfURL = this.pdfURLPre + res.outData.data
          this.pdf_isshow = true
          console.log(this.pdfURL,'123');
        }
        console.log(res);
      })

    }
  },
  
}
</script>
<style lang='scss' scoped>
.preview-pdf {
  .box {
    .title {
      text-align: center;
      padding-top: 29px;
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      line-height: 40px;
    }
    .pdf {
      width: 100%;
      // padding-top: 30px;
      height: 530px;
      embed {
        width: 100%;
        height: 500px;
      }
    }
    .btn-group {
      padding-top: 60px;
      padding-bottom: 60px;
      .el-button {
        width: 155px;
        height: 48px;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
        line-height: 48px;
        border: 1px solid #3162E8;
        color: #3162E8;
        &:last-child {
          width: 232px;
          color: #fff;
        }
      }
    }
  }
  .success-dialog {
    .success-dialog_son{
      display: flex;
      align-items: center;
      flex-direction: column;
      flex-wrap: wrap;
    }
  }
  .sign_dialog {
    .dialog_wrap{
      text-align: center;
      padding-bottom: 30px;
    }
    .ewm {
      width: 300px;
      margin-bottom: 15px;
    }
  }
}
.dialog-tips{
      margin-top: 17px;
      font-size: 18px;
      font-family: PingFangHK-Medium, PingFangHK;
      font-weight: 550;
      color: #3162E8;
    }
.PDFleft{
  width: 500px;
}
.H3magin30{
  margin: 30px 0px 10px 0px;
}
</style>
