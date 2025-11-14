<template>
  <div class="preview-pdf">
    <!-- <breadcrumb v-show="$route.query.mode !== 'test'" /> -->
    <div class="w-1200 box">
      <div class="title">{{ $route.meta.title }}</div>
      <h3 class="H3magin30">企业基本信息</h3>
      <div style="display: flex;">
        <el-tree :data="this.directory" 
        class="PDFleft"
        @node-click="handleNodeClick"
        node-key="id"
        ></el-tree>
        <div class="pdf">
          <div v-if="this.pdf_isshow" class="pdfDiv">
            <div class="ArchiveInfomationStyle">
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">名称</div></el-col>
                  <el-col :span="18"><div class="grid-content bg-purple-light"><div class="textBorder">{{this.nowArchiveObject.entname}}</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">注册号</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">{{this.nowArchiveObject.regno}}</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">统一信用代码</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">{{this.nowArchiveObject.uniscid}}</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">经营者</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">{{nowArchiveObject.name}}</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">住所所在单位行政区划</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple flexCenter">住所</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light flexCenter"><div class="textBorder">{{nowArchiveObject.oploc}}</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple flexCenter">生产经营地所在行政区划</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light flexCenter"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">生产经营地</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">生产经营地所在行政区划</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">邮政编码</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">{{nowArchiveObject.postalcode}}</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">联系电话</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">经营状态</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">资金 (万元)</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">行业门类</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">行业代码</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple flexCenter">经营范围</div></el-col>
                  <el-col :span="18"><div class="grid-content bg-purple-light flexCenter"><div class="textBorder">{{nowArchiveObject.jyfwnr}}</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">成立目期</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">核准日期</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">经营期限</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">经营期限起</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">登记机关</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">{{nowArchiveObject.regorg}}</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">属地市场监管</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">从业人数</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">{{nowArchiveObject.empnum}}</div></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple">管片组</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
              <div class="rowInfomationStyle">
                <el-row>
                  <el-col :span="6"><div class="grid-content bg-purple">是否电子商务经营</div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><div class="textBorder">暂无数据</div></div></el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-else>
           <strong>请点击左侧目录下进行查看公司基础信息</strong> 
          </div>
        </div>
      </div>
      <div class="btn-group text-center">
        <el-button  @click="$router.go(-1)"  style="color: #357cff;">上一步</el-button>
        <!-- <el-button type="primary" v-if="this.pdf_isshow" @click="down">扫码下载</el-button> -->
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
      nowArchiveObject:{}
    }
  },
  computed: {
    ArchivelList() {
      return this.$store.state.archive.archivelList
    },
  },
  created(){
      if(this.ArchivelList.length === 0){
        return this.$utils.showWarn('企业信息未获取成功')
      }
      console.log(this.ArchivelList,'this.ArchivelList');
      const  new_element = {'label': null}
      for(let i=0, len=this.ArchivelList.length;i<len;i++){
        this.directory.push(JSON.parse(JSON.stringify(new_element)))
        this.directory[i].label = this.ArchivelList[i].entname
      }
      console.log(this.directory,'directory');
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
      console.log(val,'val');
      // this.$loading({ text: '查询时间较长，请耐心等待' })
      // console.log(val.label,'val');
      // let targetObject = null;
      //获取对象
      for (let i = 0; i < this.ArchivelList.length; i++) {
        if (this.ArchivelList[i].entname === val.label) {
          this.nowArchiveObject = this.ArchivelList[i];
          break;
        }
      }
      this.pdf_isshow = true
      // console.log(targetObject);

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
      width: 800px;
      // padding-top: 30px;
      height: 530px;
      .pdfDiv{
        width: 1000px;
      }
      // embed {
      //   width: 100%;
      //   height: 500px;
      // }
    }
    .btn-group {
      margin-top: 150px;
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
  width: 700px;
}
.H3magin30{
  margin: 30px 0px 10px 0px;
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #f5f8fd;
  }
  .bg-purple {
    height: 36px;
    line-height: 36px;
    text-align: center;
    // background: #d3dce6;
  }
  .bg-purple-light {
    // border: 1px solid #797676a8;
    background: #e5e9f28a;
    height: 36px;
    line-height: 36px;
    text-align: center;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    // background-color: #f9fafc;
  }
.ArchiveInfomationStyle{
  width: 100%;
}
.ArchiveInfomationStyle:nth-child(1){
  border-bottom: 1px solid  #e7eaf1;
}
.rowInfomationStyle{
  width: 100%;
  display: flex;
  flex-direction: row;
  border: 1px solid #e7eaf1;
  border-bottom:none ;
}
.el-row{
  width: 100%;
}
.h80px{
  // height: 200px;
  // line-height: 200px;
  text-align: center;
}
.flexCenter {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 130px; /* change this value to adjust the minimum height */
}
.textBorder{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d6e4f6;
  border-radius: 8px ;
  transform: scaleX(0.98) scaleY(0.9);
  // padding: 10px;
}
::v-deep .el-tree-node{
  margin-bottom: 10px;
}
// .rowInfomationStyle >div{
//   border: 1px solid #3333338c;
//   height: 40px;
// }
</style>
