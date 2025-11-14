<template>
  <div class="marketMedia">
    <page-header />
    <breadcrumb />
    <div class="title">中介服务</div>
    <div class="mainContainer">
      <div class="mediaCompany">
        <el-row>
          <el-col v-for="item in companyList" :key="item.index" :span="6" class="companyItem">
            <div class="companyTitle">{{ item.name }}</div>
            <div class="companyName">
              <div v-for="(childrenItem,childrenindex) in item.intermediaryInfoList" :key="childrenindex" @click="toDetail(childrenItem.id)">{{ childrenItem.uniscid.indexOf('（')>0?childrenItem.uniscid.split('（')[0]:childrenItem.uniscid.split('(')[0] }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="bottom">
      <span>添加微信小程序”湖北市场监管融平台”小程序</span>
      <span style="margin-left: 210px">，也可以办理和查询业务</span>
      <img src="../../assets/images/mini_code.png" alt="" />
    </div>
    <footer>
      <div class="footer">
        <span>主办单位：湖北省市场监督管理局</span>
        <span style="margin-left:15px">技术支持单位：武汉网融信息科技有限公司</span>
        <span style="margin-left:140px">鄂公网安备42010602000665号 鄂ICP备05011090号-1 政府网站标识码：4200000093</span>
      </div>
    </footer>
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="491px"
    >
      <div class="agencyServiceDetail">
        <div class="detailHeader">
          <div>{{ companyInfo.uniscid }}</div>
          <div>
            <span>资质证书编号：</span>
            <span>{{ companyInfo.certificateNum }}</span>
          </div>
        </div>
        <div class="detailArticle">
          <div>业务范围：</div>
          <div>{{ companyInfo.businessScope }}</div>
        </div>
        <div class="detailFooter">
          <div class="contactMan">
            <div>联系人及电话：</div>
            <div>
              {{ companyInfo.contactAndName }}
            </div>
          </div>
          <div class="contactAddress">
            <div>联系地址：</div>
            <div>
              {{ companyInfo.address }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
import { queryIntermediaryInfo, queryIntermediaryInfoDetail } from '@/api'
export default {
  components: {
    PageHeader,
    Breadcrumb
  },
  data() {
    return {
      dialogVisible: false,
      companyList: [],
      companyInfo: {}
    }
  },
  created() {
    this.inint()
  },
  methods: {
    inint() {
      queryIntermediaryInfo().then(res => {
        console.log(res)
        if (res.flag === 500) {
          this.$loading().close()
          return this.$utils.showError(res.message)
        }
        this.companyList = res.data
      })
    },
    toDetail(id) {
      queryIntermediaryInfoDetail({ id: id }).then(res => {
        console.log(res.data)
        if (res.flag === 500) {
          this.$loading().close()
          return this.$utils.showError(res.message)
        }
        this.companyInfo = res.data
        this.dialogVisible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .marketMedia{
    position: relative;
    min-height: 100vh;
    background: url('../../assets/images/homePage_bg.png') no-repeat;
    background-size: 100% auto;
    background-position: left bottom;
    .title{
      text-align: center;
      font-size: 32px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 54px;
      color: #464646;
      margin-top: 20px;
    }
    .mainContainer{
      width: 1178px;
      height: 300px;
      margin: auto;
      .navMenu{
        width: 100%;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 24px;
        color: #666666;
        border-bottom: 1px solid #C4C4C4;
        padding-bottom: 14px;
      }
      .mediaCompany::-webkit-scrollbar{
        display: none;
      }
      .mediaCompany{
        margin-top: 43px;
        height: 370px;
        border: 1px solid #EAEAEA;
        border-radius: 4px;
        overflow-y: auto;
        padding-bottom:20px;
        &>.companyItem:last-child>.companyName{
          border-right: none;
        }
        .companyItem{
          .companyTitle{
            padding: 0 20px;
            height: 26px;
            margin-top: 12px;
            margin-bottom: 9px;
            font-size: 18px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 26px;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .companyName::-webkit-scrollbar{
            display: none;
          }
          .companyName{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            padding: 0 20px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 22px;
            color: #5F99F5;
            border-right: 1px solid #EAEAEA;
            border-top: 1px solid #EAEAEA;
            border-bottom: 1px solid #EAEAEA;
            height: 129px;
            overflow-y: scroll;
            &>div{
              cursor: pointer;
              flex-grow: 1;
            }
            &>div:not(:last-child){
              margin-bottom: 20px;
            }
            &>div:first-child{
              margin-top: 22px;
            }
          }
        }
      }
    }
      .mainContainer::-webkit-scrollbar{
          display: none;
        }
    .bottom{
      position: absolute;
      bottom: 100px;
      width: 967px;
      margin-top: 100px;
      height: 89px;
      line-height: 89px;
      padding: 0 35px;
      border-radius: 48px;
      border: 1px solid #3162E8;
      font-size: 20px;
      font-weight: 500;
      color: #025BFF;
      transform: translateX(-50%);
      left: 50%;
      img{
        position: absolute;
        width: 200px;
        height: 200px;
        top: -80px;
        left: 465px;
      }
    }
    footer{
      position: absolute;
      left: 83px;
      right: 83px;
      bottom: 30px;
      text-align: center;
      .footer{
        display: flex;
        span{
          font-size: 20px;
          color: #7F7E7E;
          &:nth-child(2) {
            flex: 1;
          }
        }
      }
    }
    ::v-deep .el-dialog{
      .el-dialog__header{
        border-bottom: 1px solid #EAEAEA;
        .el-dialog__title{
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            line-height: 27px;
            color: #464646;
        }
      }
      .el-dialog__body{
        padding: 24px 26px;
      }
      .agencyServiceDetail{
        .detailHeader{
          display: flex;
          flex-direction: column;
          &>div:first-child{
            font-size: 20px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            line-height: 28px;
            color: #464646;
          }
          &>div:last-child{
            margin-top: 12.5px;
            &>span:first-child{
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 16.5px;
              color: #A0A5AB;
            }
            &>span:last-child{
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 16.5px;
              color: #5F99F5;
            }
          }
        }
        .detailArticle{
          margin-top: 12.5px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 15px;
          color: #505050;
          letter-spacing: 2px;
          &>div:first-child{
            margin-bottom: 20px;
          }
        }
        .detailFooter{
          margin-top: 15px;
          .contactMan{
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
            &>div:first-child{
              font-size: 14px;
              font-family: Source Han Sans CN;
              font-weight: 500;
              line-height: 23px;
              color: #505050;
              letter-spacing: 2px;
            }
            &>div:last-child{
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 23px;
              color: #505050;
              letter-spacing: 2px;
            }
          }
          .contactAddress{
            display: flex;
            flex-direction: column;
            &>div:first-child{
              font-size: 14px;
              font-family: Source Han Sans CN;
              font-weight: 500;
              line-height: 23px;
              color: #505050;
              letter-spacing: 2px;
            }
            &>div:last-child{
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 23px;
              color: #505050;
              letter-spacing: 2px;
            }
          }
        }
      }
    }
  }
</style>
