<template>
  <div class="home-page" :class="{ adaptZw: isZww }">
    <page-header />
    <main>
      <div class="top">
      </div>
      <div class="center">
        <div
          class="liBox"
          :style="homeList.length < 4 ? 'justify-content: center;' : ''"
        >
          <div v-for="(item, index) in homeList" :key="index" class="liMain">
            <li class="liInfo" @click="nextPage(item)">
              <img
                :class="homeList.length > 5 ? 'five' : ''"
                :src="item.src"
                alt=""
              />
              <div class="event-module">
                <div :class="item.titile.length > 10 ? 'event-title' : ''">
                  {{ item.titile }}
                </div>
                <div>{{ item.describe }}</div>
              </div>
            </li>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div
        class="footer"
      >
        <span>主办单位：湖北省市场监督管理局</span>
        <span style="margin-left: 15px"
          >技术支持单位：武汉网融信息科技有限公司</span
        >
        <span style="margin-left: 140px"
          >鄂公网安备42010602000665号 鄂ICP备05011090号-1
          政府网站标识码：4200000093</span
        >
        <span v-if="isShow" style="margin-top: 15px"
          >支持单位：崇阳县工商银行崇阳支行</span
        >
      </div>
    </footer>

    <!-- 操作指引 -->
    <syHelpGuide class="help" v-if="areaname === '丹江口市'" />
    <helpGuide class="help" v-else />
    <!-- 外部链接弹框 -->
    <el-dialog
      :title="externalEvents.titile"
      :visible.sync="eventDialog"
      width="98%"
      top="1vh"
      destroy-on-close
      :modal="true"
      :modal-append-to-body="false"
    >
      <iframe
        width="100%"
        height="800"
        :src="externalEvents.path"
        frameborder="0"
      ></iframe>
    </el-dialog>
    <el-dialog
      title="选择营业执照打印"
      :visible.sync="printDialog"
      width="30%"
      :before-close="handleClose"
    >
      <span>请选择营业执照查询打印入口</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toPrint(1)">旧查询入口</el-button>
        <el-button type="primary" @click="toPrint(2)">新查询入口</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="温馨提示"
      :visible.sync="newDialog"
      width="30%"
      :before-close="handleClose"
    >
      <span>新系统切换，请稍后再使用。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import listImg1 from "../../assets/images/img1.png";
import listImg2 from "../../assets/images/img2.png";
import listImg3 from "../../assets/images/img3.png";
import listImg4 from "../../assets/images/img4.png";
import listImg9 from "../../assets/images/img9.png";
import { getBaseData } from "@/api";
import listImg5 from "../../assets/images/img5.png";
import listImg6 from "../../assets/images/img6.png";
import listImg7 from "../../assets/images/img7.png";
import listImg8 from "../../assets/images/img8.png";
import listImg10 from "../../assets/images/img10.png";
import listImg11 from "../../assets/images/img11.png";
import listImg12 from "../../assets/marketEntity/bg1.png";
import listImg13 from "../../assets/images/img13.png";
import listImg16 from "../../assets/images/img16.png";
import listImg15 from "../../assets/images/img15.png";
import listImg17 from "../../assets/images/img17.png";
import PageHeader from "@/components/PageHeader/index3";
import helpGuide from "@/components/helpGuide";
import syHelpGuide from "@/components/syHelpGuide";
export default {
  components: {
    PageHeader,
    helpGuide,
    syHelpGuide,
  },
  data() {
    return {
      areaname: "",
      printForm: {},
      printDialog: false,
      newDialog: false,
      externalEvents: {},
      eventDialog: false,
      provice: "", // 机器所在省
      city: "", // 机器所在市
      district: "", // 机器所在区
      tId: "", // 机器唯一编号
      homeList: [],
      businessList: [
        {
          src: listImg10,
          titile: '企业基本信息查询',
          describe: "企业基本信息查询",
          path: "/EnterpriseInformationSelfDeclaration",
          type: "EnterpriseInformationSelfDeclaration",
        },
        {
          src: listImg4,
          titile: "企业档案查询",
          describe: "企业档案查询",
          path: "/personprintDocInfoSelfDeclaration",
          type: "personprintDocInfoSelfDeclaration",
        },
        {
          src: listImg6,
          titile: "我要开饮品店",
          describe: "注册登记+经营许可证一事联办",
          path: "/form/handleNotice",
          type: "drink",
        },
      ],
    };
  },
  computed: {


    // 是否显示支持单位
    isShow: function () {
      if (this.$utils.getLocalItem("curArea").district === "崇阳县") {
        return true;
      }
      return false;
    },
    isZww() {
      return (
        this.$utils.getItem("origin") &&
        this.$utils.getItem("origin").includes("湖北政务网")
      );
    },
  },
  async created() {
    if (process.env.NODE_ENV === "development") {
      // window.localStorage.setItem('userInfo', JSON.stringify({ 'name': '曹柯华', 'idNumber': '51130419960703261X' }))
      // window.localStorage.setItem('token', 'fdab436e-00b4-4ba3-a343-6995f40e0e97')
      // window.localStorage.setItem('expiryDate', new Date().getTime() + 1000 * 60 * 60 * 2400)
    }
    this.$utils.removeLocalItem();
    const query = this.$route.query;
    if (helpGuide)
      if (query) {
        if (query.tId) {
          console.log(query.tId);
          this.$utils.setLocalItem("tId", query.tId);
        }
        if (query.device) {
          this.$utils.setLocalItem("device", query.device);
        }
      }
    try {
      const res = await getBaseData();
      const baseInfo = res.outData.jobPackage.HB_QYKB_DRAFT.inData;
      // 基础数据存储
      this.$utils.setLocalItem("baseInfo", baseInfo);
      // 获取当前地区数据
      let curArea = Object.values(baseInfo.areaInfo).filter(
        (item) => item.tId.indexOf(this.$utils.getLocalItem("tId")) !== -1
      );
      if (!curArea.length) curArea = [baseInfo.areaInfo["十堰经济技术开发区"]];
      this.$utils.setLocalItem("curArea", curArea[0]);
      this.areaname = this.$utils.getLocalItem("curArea").district;
      // 十堰市除 经开区和郧阳区 的其他地区首页增加一个入口
      // && this.$utils.getLocalItem('curArea').district !== '十堰经济技术开发区' && this.$utils.getLocalItem('curArea').district !== '郧阳区' && this.$utils.getLocalItem('curArea').district !== '郧西县'

    
      // 重构首页菜单（hideMenu为需要隐藏的菜单）
      for (let i = this.businessList.length - 1; i >= 0; i--) {
        const item = this.businessList[i];
        if (
          this.$utils.getLocalItem("device") === "MD" &&
          item.type === "company"
        ) {
          this.businessList.splice(i, 1);
        }
        if (curArea[0].hideMenu.includes(item.type)) {
          this.businessList.splice(i, 1);
          this.homeList = this.businessList;
        }
      }
      // if(this.$utils.getLocalItem("tId") === "QY-TEST") {
      //   this.businessList.push({
      //     src: listImg17,
      //     titile: '人工审批入口',
      //     describe: '进入政务网填报',
      //     path: 'http://zwfw.hubei.gov.cn/webview/tszq/web/qykb/index.html',
      //     type: 'rgsp'
      //   }),
      //   this.businessList.push({  
      //     src: listImg13,
      //     titile: "市场主体信息档案查询",
      //     describe: "市场主体信息档案查询",
      //     path: "/personprintDocInfo",
      //     type: "personprintDocInfo",
      //   })
      // }
      // if (this.$utils.getLocalItem("tId") === "2022II-ZW-WHQKQ02") {
      //   this.businessList.splice(1, 0, {
      //     src: listImg12,
      //     titile: "商事主体确认登记",
      //     describe: "照章户税社“一网通办”",
      //     path: "/form/handleNotice",
      //     type: "commercialRegister",
      //   });
      //    this.businessList.splice(0, 0, {
      //     src: listImg1,
      //     titile: "内资企业辅助开办",
      //     describe: "企业名称申报+设立登记联办",
      //     path: "/form/handleNotice",
      //     type: "company"
      //   });
      // }
      // if (this.$utils.getLocalItem("tId") === "2021II-500110305") {
      //   // 这是授权版本第二版
      // //   this.businessList.push({  
      // //     src: listImg13,
      // //     titile: "市场主体信息档案查询",
      // //     describe: "市场主体信息档案查询",
      // //     path: "/personprintDocInfo",
      // //     type: "personprintDocInfo",
      // //   })
      // // }

      // // 这是授权版本第一版
      //   this.businessList.push({  
      //     src: listImg13,
      //     titile: "市场主体信息档案查询",
      //     describe: "市场主体信息档案查询",
      //     path: "/personprintDocInfoTest",
      //     type: "personprintDocInfoTest",
      //   })
      // }
      // 浠水
      // 2021II-500110296,  加入一事联办
      // 22-09-14 屏蔽
      // if (this.$utils.getLocalItem('tId') === '2021II-500110296' || this.$utils.getLocalItem('tId') === '2021II-500100264') {
      //   this.homeList.splice(2, 0, {
      //     src: listImg5,
      //     titile: '我要开餐馆',
      //     describe: '注册登记+经营许可证一事联办',
      //     path: '/form/handleNotice',
      //     type: 'restaurant'
      //   },
      //   {
      //     src: listImg7,
      //     titile: '我要开小超市/便利店/副食店',
      //     describe: '注册登记+经营许可证一事联办',
      //     path: '/form/handleNotice',
      //     type: 'supermarket'
      //   },)
      // }
      // 以下机器屏蔽企业开办
      if (
        this.$utils.getLocalItem("tId") === "2021II-ZW-XSXNC" ||
        this.$utils.getLocalItem("curArea").district === "大冶市" ||
        this.$utils.getLocalItem("curArea").district === "宜城市" ||
        this.$utils.getLocalItem("tId") === "2021II-ZW-XSXQQ" ||
        this.$utils.getLocalItem("tId") === "2021II-ZW-XSXBC" ||
        this.$utils.getLocalItem("tId") === "2021II-ZW-XSXBH" ||
        this.$utils.getLocalItem("tId") === "2020II-500000003" ||
        // this.$utils.getLocalItem('tId') === '2021II-ZW-SYJK' ||
        this.$utils.getLocalItem("tId") === "2021II-ZW-JZGXQ" ||
        this.$utils.getLocalItem("tId") === "2021II-ZW-JZWLQ" ||
        this.$utils.getLocalItem("tId") === "2020II-ZW-SYZS2" ||
        this.$utils.getLocalItem("tId") === "2020II-500120567" ||
        this.$utils.getLocalItem("tId") === "2021II-500060111"
      ) {
        this.homeList = this.homeList.filter((item) => item.type !== "company");
      }
      // 以下机器屏蔽个体户
      if (this.$utils.getLocalItem("curArea").district === "张湾区") {
        this.homeList = this.homeList.filter((item) => item.type !== "person");
      }
      // 政务网屏蔽 打印
      if (this.isZww) {
        this.homeList = this.homeList.filter(
          (item) => item.type !== "printList"
        );
      }
    } catch (error) {
      this.$utils.showError("获取基本信息失败，请检查网络！");
    }
    console.log(this.homeList, "11111111111");
  },
  mounted() {},
  methods: {
    toPrint(value) {
      this.$router.push({
        path: value == 1 ? "/printList" : "/newPrintList",
        query: { type: this.printForm.type, bizName: this.printForm.titile },
      });
    },
    handleClose() {
      this.printDialog = false;
    },

    nextPage(item) {
      this.$utils.setLocalItem("modaltitle", item.titile);
      if (
        item.titile === "省内通办（房县）" ||
        item.titile === "跨省通办（房县）" ||
        item.titile === '人工审批入口'||
        item.titile === '湖北政务服务网'
        )
      {
        this.eventDialog = true;
        this.externalEvents = item;
      } else if (item.path.includes("http")) {
        location.href = item.path;
      } else {
        // if (this.$utils.getLocalItem('curArea').district !== '郧阳区' && item.type === 'printDoc') {
        //   location.href = 'http://scjg.hubei.gov.cn/JR-web/oauth/login_files.html'
        //   return
        // }
        this.$router.push({
          path: item.path,
          query: { type: item.type, bizName: item.titile },
        });
        // if(this.$utils.getLocalItem('curArea').city === '黄冈市') {
        //   if(item.path == '/printList') {
        //     // this.printDialog = true
        //     this.toPrint(2)
        //     this.printForm = item
        //   } else {
        //     this.$router.push({ path: item.path, query: { type: item.type, bizName: item.titile }})
        //   }
        // } else {
        //   this.$router.push({ path: item.path, query: { type: item.type, bizName: item.titile }})
        // }
      }
      // let flag = false
      // let cityData = ['武汉市', '黄冈市', '襄阳市', '仙桃市', '神农架林区', '恩施市', '利川市', '宜昌市', '随州市', '荆州市']
      // cityData.forEach(item => {
      //   if( this.$utils.getLocalItem('curArea').city == item) {
      //     return flag = true
      //   }
      // })
      // // if(this.$utils.getLocalItem('curArea').district == '测试区县'|| this.$utils.getLocalItem('curArea').district == '郧阳区') {
      // //   flag = true
      // // }
      // if(this.$utils.getLocalItem('curArea').district == '测试区县'|| this.$utils.getLocalItem('curArea').district == '郧阳区'|| this.$utils.getLocalItem('curArea').district == '松滋市'|| this.$utils.getLocalItem('curArea').district == '大冶市'|| this.$utils.getLocalItem('curArea').district == '梁子湖区'|| this.$utils.getLocalItem('curArea').district == '崇阳县') {
      //   flag = true
      // }
      // if(!flag) {
      //   this.newDialog = true
      // }else {

      // }
    },
  },
};
</script>
<style lang='scss' scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  background: url("../../assets/images/homePage_bg.png") no-repeat;
  background-size: 100% auto;
  background-position: left bottom;
  overflow: auto;
  ::v-deep .el-dialog__body {
    padding: 25px 25px 55px;
  }
  ::v-deep .el-dialog__header {
    padding: 15px;
    border-bottom: 1px solid #dbdbdb !important;
  }
  header {
    width: 100%;
    height: 100px;
    background: url("../../assets/images/header_top_bg.png");
    background-size: 1920px 150px;
    background-position: center;
    .header {
      display: flex;
      .left {
        padding-top: 22px;
        flex: 1;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        img {
          width: 50px;
          height: 50px;
          margin-right: 12px;
        }
        span {
          font-size: 26px;
          font-weight: 500;
          color: #ffffff;
        }
      }
      .right {
        padding-top: 20px;
        display: flex;
        align-items: center;
        .sign-out {
          display: flex;
          flex-direction: row;
          .name {
            font-size: 16px;
            color: #fff;
            height: 40px;
            line-height: 40px;
            margin-right: 20px;
          }
          .out {
            width: 99px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: #fff;
            border-radius: 4px;
            font-size: 16px;
            color: #3162e8;
            cursor: pointer;
            user-select: none;
            &:active {
              background: #9abdff;
            }
          }
        }
        .login {
          width: 99px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          background: #fff;
          border-radius: 4px;
          font-size: 16px;
          color: #3162e8;
          cursor: pointer;
          user-select: none;
          &:active {
            background: #9abdff;
          }
        }
      }
    }
    .header-bottom {
      position: relative;
      width: 1250px;
      margin: 0 auto;
      img {
        position: absolute;
        left: 2px;
        top: 28px;
        width: 1526px;
        height: 134px;
      }
    }
  }
  main {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    flex-direction: column;
    text-align: center;
    .top {
      margin-top: 30px;
      div:first-child {
        color: #464646;
        font-size: 40px;
        font-family: PingFangHK-Semibold, PingFangHK;
        font-weight: 600;
        margin-bottom: 13px;
      }
      div:last-child {
        color: #464646;
        font-size: 22px;
        font-family: PingFangHK-Regular, PingFangHK;
      }
    }
    .center {
      width: 1600px;
      margin: 30px auto 0;
      display: flex;
      justify-content: center;
      // padding-left: 80px;
      .liBox {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .liMain {
          background: #fff;
          box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.08);
          margin-right: 60px;
          margin-bottom: 10px;
          .liInfo {
            list-style-type: none;
            cursor: pointer;
            img {
              width: 334px;
              height: 170px;
              &.five {
                width: 280px;
                height: 134px;
              }
            }
            .event-module {
              margin-top: 20px;
              div:first-child {
                color: #333333;
                font-size: 26px;
                font-family: PingFangHK-Medium, PingFangHK;
                font-weight: 550;
                margin-bottom: 10px;
              }
              .event-title {
                font-size: 20px !important;
              }
              div:last-child {
                color: #666666;
                font-size: 18px;
                font-family: PingFangHK-Regular, PingFangHK;
                margin-bottom: 27px;
              }
            }
          }
        }
        .liMain:nth-child(4n) {
          margin-right: 0;
        }
        .liMain:last-child {
          margin-right: 0;
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 100px;
      width: 967px;
      margin-top: 100px;
      height: 89px;
      line-height: 89px;
      padding: 0 35px;
      border-radius: 48px;
      border: 1px solid #3162e8;
      font-size: 20px;
      font-weight: 500;
      color: #025bff;
      transform: translateX(-50%);
      left: 50%;
      img {
        position: absolute;
        width: 200px;
        height: 200px;
        top: -80px;
        left: 465px;
      }
    }
  }
  footer {
    position: absolute;
    left: 83px;
    right: 83px;
    bottom: 15px;
    text-align: center;
    .footer {
      display: flex;
      flex-wrap: wrap;
      span {
        font-size: 20px;
        color: #7f7e7e;
      }
    }
  }
  .dialog {
    width: 100%;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    flex-direction: column;
    text-align: center;
    .dialog-title {
      font-size: 26px;
      font-family: SourceHanSansSC-Bold, SourceHanSansSC;
      font-weight: bold;
      color: #464646;
    }
    .dialog-tips {
      margin-top: 17px;
      font-size: 18px;
      font-family: PingFangHK-Medium, PingFangHK;
      font-weight: 550;
      color: #3162e8;
    }
  }
}

// 适配政务网
.home-page.adaptZw {
  main {
    .top {
      transform: scale(0.8);
    }
    .center {
      transform: scale(0.8);
      width: 95%;
      margin-top: -25px;
    }
    .bottom {
      position: relative;
      left: 0;
      /* text-align: center; */
      transform: none;
      bottom: 0;
      margin: 30px 0 60px;
      transform: scale(0.8);
    }
  }
  footer {
    position: relative;
    transform: scale(0.8);
  }
}
</style>
