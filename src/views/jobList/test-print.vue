<template>
  <div class="list-page">
    <div class="preview-box">
      <!-- 企业正本 -->
      <div ref="preview3" class="license-box-pre">
        <div class="license-number-pre">
          <div>统一社会信用代码</div>
          <div>12312312</div>
        </div>
        <!-- <div class="number">
      (1——1)
      </div> -->
        <!-- 二维码 -->
        <div class="planar-pre">
          <vue-qr
            text="312312"
            :margin="0"
            color-dark="#000"
            color-light="#fff"
            :logo-src="qrIcon"
            :logo-scale="0.3"
            :size="100"
          />
        </div>
        <div class="planar-content-pre">
          <span>扫描二维码登录 '国家企业信用信息公示系统' 了解更多登记、备案、许可、监管信息。</span>
        </div>
        <div class="left-container-pre">
          <div>
            <span>名称</span>
            <span>知木测试科技</span>
          </div>
          <div>
            <span>类型</span>
            <span>一人有限公司</span>
          </div>
          <div>
            <span style="letter-spacing: 7.5px;">法定代表人</span>
            <span>吴知木</span>
          </div>
          <div>
            <span>经营范围</span>
            <span style="font-size: 17px;">xxxxxxxxxx</span>
          </div>
        </div>
        <div class="right-container-pre">
          <div>
            <span>注册资本</span>
            <span>xxxx</span>
          </div>
          <div>
            <span>成立日期</span>
            <span class="dateNumber" style="margin-left:70px;">2022</span>
            <span class="dateWord">年</span>
            <span class="dateNumber">06</span>
            <span class="dateWord">月</span>
            <span class="dateNumber">24</span>
            <span class="dateWord" style="margin-left:0;">日</span>
          </div>
          <div>
            <span>营业期限</span>
            <span>长期</span>
          </div>
          <div>
            <span style="letter-spacing: 102px;">住所</span>
            <span>xxxxxx</span>
          </div>
        </div>
        <div class="date-pre">
          <span>2022</span>
          <span>06</span>
          <span>24</span>
        </div>
        <div class="net-link-pre">
          <span>http://www.gsxt.gov.cn</span>
        </div>
        <!-- <div class="bottom-content">
      <span>市场主体应当于每年1月1日至6月30日通过国家企业信用信息公示系统报送公示 </span>
    </div> -->
      </div>
      <!-- 企业副本 -->
      <div ref="preview4" class="license-box">
        <div class="license-number">
          <div>统一社会信用代码</div>
          <div>12312312</div>
        </div>
        <!-- <div class="number">
      (1——1)
      </div> -->
        <!-- 二维码 -->
        <div class="planar">
          <vue-qr
            text="312312"
            :margin="0"
            color-dark="#000"
            color-light="#fff"
            :logo-src="qrIcon"
            :logo-scale="0.3"
            :size="100"
          />
        </div>
        <div class="planar-content">
          <span>扫描二维码登录 '国家企业信用信息公示系统' 了解更多登记、备案、许可、监管信息。</span>
        </div>
        <div class="left-container">
          <div>
            <span>名称</span>
            <span>知木测试科技</span>
          </div>
          <div>
            <span>类型</span>
            <span>一人有限公司</span>
          </div>
          <div>
            <span style="letter-spacing: 7.5px;">法定代表人</span>
            <span>吴知木</span>
          </div>
          <div>
            <span>经营范围</span>
            <span style="font-size: 17px;">xxxxxxxxxx</span>
          </div>
        </div>
        <div class="right-container">
          <div>
            <span>注册资本</span>
            <span>xxxx</span>
          </div>
          <div>
            <span>成立日期</span>
            <span class="dateNumber" style="margin-left:70px;">2022</span>
            <span class="dateWord">年</span>
            <span class="dateNumber">06</span>
            <span class="dateWord">月</span>
            <span class="dateNumber">24</span>
            <span class="dateWord" style="margin-left:0;">日</span>
          </div>
          <div>
            <span>营业期限</span>
            <span>长期</span>
          </div>
          <div>
            <span style="letter-spacing: 102px;">住所</span>
            <span>xxxxxx</span>
          </div>
        </div>
        <div class="date">
          <span>2022</span>
          <span>06</span>
          <span>24</span>
        </div>
        <div class="net-link">
          <span>http://www.gsxt.gov.cn</span>
        </div>
        <div class="bottom-content">
          <span>市场主体应当于每年1月1日至6月30日通过国家企业信用信息公示系统报送公示 </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import loadingImg from '@/assets/images/loading_blue.png'
import { getPrefix } from '@/utils/index'
import vueQr from 'vue-qr'
export default {
  components: {
    vueQr
  },
  data() {
    return {
      isShow: true, // 是否显示打印预览
      isFull: false, // 是否全屏遮罩
      dialogVisible: false, // 显示正在打印弹框
      search: false, // 是否已经查询
      showDialog: false, // 显示加载弹窗
      qrcodeDialog: false, // 显示二维码弹窗
      dialogSign: false, // 签名弹窗
      signTimer: null, // 签名定时器
      ident: '', // 轮询ident
      type: 1, // 弹窗类型，0：loading 1：成功
      loadingImg, // loading图片
      printData: {}, // 打印数据
      conum: '1', // 营业执照数量，默认1
      second: 30,
      timer: null,
      device: '', // 一体机设备 美鼎:MD
      path: '',
      form: {
        role: '',
        companyName: '', // 单位名称
        phone: '', // 领取人电话
        legalPerson: '', // 法人名称
        legalPersonCerNo: '', // 法人证件号
        agentName: '', // 代理人姓名
        agentCerNo: '', // 代理人身份证
        promise: false
        // 'role': '法定代表人',
        // 'creditCode': '',
        // 'phone': '17771503886',
        // 'companyName': '嘉鱼县宸兴劳务有限公司',
        // 'legalPerson': '李洁',
        // 'agentName': '',
        // 'promise': true,
        // 'legalPersonCerNo': '500382198603035268',
        // 'agentCerNo': '',
        // 'role': '法定代表人',
        // 'creditCode': '',
        // 'phone': '13995828917',
        // 'companyName': '梁子湖区益稳早餐店',
        // 'legalPerson': '吴泽宏',
        // 'agentName': '',
        // 'promise': true,
        // 'legalPersonCerNo': '445221199608046956',
        // 'agentCerNo': ''
      },
      printList: [],
      fullScreen: false,
      finished: false,
      url: '', // 二维码链接
      qrIcon: '' // 二维码中间图片地址
    }
  },
  computed: {
    printPDF() {
      return function(pdf) {
        return location.origin + getPrefix() + '/open-platform/' + pdf
      }
    }
    // showbtn() {
    //   if (device === 'MD' || device === 'ZW') {
    //     return type && finished
    //   } else {
    //     return type && !finished
    //   }
    // }
  },
  watch: {
    dialogSign(val) {
      if (!val) {
        this.clearSignTimer()
      }
    }
  },
  created() {
  }
}
</script>
<style lang="scss" scoped>

// 证书样式一
.license-box{
  // background-color: cadetblue;
    width: 1122px;
    height: 794px;
    position: relative;
    margin: 0 auto;
    .license-number{
      position: absolute;
      top: 195px;
      left: 125px;
      &>div:first-child{
        font-size: 16px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
        letter-spacing: 5px;
      }
      &>div:last-child{
        font-size: 14px;
        font-family: myFontContent;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
    }
    .number{
      position: absolute;
      left: 635px;
      top: 252px;
      font-family: SimSun;
    }
    .planar{
      width: 82px;
      height: 82px;
      position: absolute;
      left: 820px;
      top: 183px;
    }
    .planar-content{
      width: 98px;
      height: 82px;
      font-size: 9px;
      line-height: 18px;
      position: absolute;
      left: 928px;
      top: 178px;
      // font-family: myFontTitle;
    }
    .left-container{
      position: absolute;
      left: 110px;
      top: 365px;
      // 左边名称
      &>div:nth-child(1)>span:first-child,
      &>div:nth-child(2)>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 18px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
        text-align: justify;
        letter-spacing: 52px;
        white-space: nowrap;
      }
      &>div:nth-child(3)>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 18px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
        text-align: justify;
        letter-spacing: 17px;
        white-space: nowrap;
      }
      &>div:nth-child(4)>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 18px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
        text-align: justify;
        letter-spacing: 5px;
        white-space: nowrap;
      }
      // 右边内容
      &>div>span:last-child{
        margin-left: 12px;
        font-size: 14px;
        font-family: myFontContent;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
      &>div:nth-child(4)>span:last-child{
        display: inline-block;
        width: 375px;
        height: 21px;
        line-height: 21px;
        vertical-align: text-bottom;
      }
    }
    // 右部样式
    .right-container{
      position: absolute;
      left: 638px;
      top: 365px;
      &>div>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 18px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
        text-align: justify;
        letter-spacing: 4px;
        white-space: nowrap;
      }
      &>div>span:last-child{
        margin-left: 12px;
        font-size: 14px;
        font-family: myFontContent;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
      .dateNumber{
        font-size: 14px;
        font-family: SimSun;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
      .dateWord{
        font-size: 14px;
        font-family: myFontContent;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
    }
    .date{
      position: absolute;
      left: 844px;
      top: 676px;
      &>span{
        font-size: 18px;
        font-family: SimSun;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
      }
      &>span:nth-child(1),
      &>span:nth-child(2){
        margin-right: 40px;
      }
    }
    .net-link{
      position: absolute;
      left: 240px;
      top: 765px;
      font-family: SimSun;
    }
    .bottom-content{
      position: absolute;
      top: 755px;
      left: 540px;
      &>span{
        display: inline-block;
        width: 235px;
        font-size: 12px;
      }
    }
  }
  // 证书二
  .license-box-pre{
    // background-color: cadetblue;
    width: 1588px;
    height: 1122px;
    position: relative;
    margin: 0 auto;
    .license-number-pre{
      position: absolute;
      top: 310px;
      left: 155px;
      &>div:first-child{
        font-size: 24px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 50px;
        letter-spacing: 5px;
      }
      &>div:last-child{
        font-size: 18px;
        font-family: myFontContent;
        font-weight: 400;
        color: #373838;
        line-height: 50px;
      }
    }
    .planar-pre{
      width: 100px;
      height: 100px;
      position: absolute;
      left: 1230px;
      top: 320px;
    }
    .planar-content-pre{
      // font-family: myFontTitle;
      width: 108px;
      height: 100px;
      font-size: 12px;
      line-height: 17px;
      position: absolute;
      left: 1340px;
      top: 320px;
    }
    .planar-content-pre-qyzb{
      width: 94px;
      height: 100px;
      font-size: 13px;
      line-height: 18px;
      position: absolute;
      left: 1350px;
      top: 315px;
    }
    .left-container-pre{
      position: absolute;
      left: 155px;
      top: 500px;
      // 左边名称
      &>div:nth-child(1)>span:first-child,
      &>div:nth-child(2)>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 24px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 50px;
        text-align: justify;
        letter-spacing: 102px;
        white-space: nowrap;
      }
      &>div:nth-child(3)>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 24px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 50px;
        text-align: justify;
        letter-spacing: 39px;
        white-space: nowrap;
      }
      &>div:nth-child(4)>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 24px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 50px;
        text-align: justify;
        letter-spacing: 18px;
        white-space: nowrap;
      }
      // 右边内容
      &>div>span:last-child{
        margin-left: 70px;
        font-size: 20px;
        font-family: myFontContent;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
      &>div:nth-child(4)>span:last-child{
        display: inline-block;
        width: 520px;
        height: 26px;
        line-height: 30px;
        vertical-align: text-bottom;
      }
    }
    // 右部样式
    .right-container-pre{
      position: absolute;
      left: 890px;
      top: 500px;
      &>div>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 24px;
        font-family: myFontTitle;
        font-weight: 400;
        color: #040000;
        line-height: 50px;
        text-align: justify;
        letter-spacing: 18px;
        white-space: nowrap;
      }
      &>div>span:last-child{
        margin-left: 70px;
        font-size: 20px;
        font-family: myFontContent;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
      .dateNumber{
        font-size: 20px;
        font-family: SimSun;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
      .dateWord{
        font-size: 20px;
        font-family: myFontContent;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
    }
    .date-pre{
      position: absolute;
      left: 1210px;
      top: 960px;
      &>span{
        font-size: 27px;
        font-family: SimSun;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
      }
      &>span:nth-child(1),
      &>span:nth-child(2){
        margin-right: 40px;
      }
    }
    .net-link-pre{
      position: absolute;
      left: 280px;
      top: 1085px;
      font-family: SimSun;
    }
    .bottom-content-pre{
      position: absolute;
      top: 740px;
      left: 440px;
      &>span{
        display: inline-block;
        width: 235px;
        font-size: 12px;
      }
    }
  }
  .preview-box{
    height: 0;
    // opacity: 1;
    // overflow: hidden;
  }
</style>
