<template>
  <div class="license-box-pre">
    <div class="license-number-pre">
      <div>统一社会信用代码：</div>
      <div>92420702MA4ERY496H</div>
    </div>
    <!-- <div class="number">
      (1——1)
    </div> -->
    <!-- 二维码 -->
    <div class="planar-pre">
    </div>
    <div class="planar-content-pre">
      <span>扫描二维码登录‘国家企业信用信息公示系统’了解更多登记、备案、许可、监管信息</span>
    </div>
    <div class="left-container-pre">
      <div>
        <span>名称</span>
        <span>梁子湖区益稳早餐店</span>
      </div>
      <div>
        <span>类型</span>
        <span>个体工商户</span>
      </div>
      <div>
        <span>经营者</span>
        <span>熊益稳</span>
      </div>
      <div>
        <span>经营范围</span>
        <span>一般项目：小餐饮；烟草制品零售（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）</span>
      </div>
    </div>
    <div class="right-container-pre">
      <div>
        <span>组成形式</span>
        <span>个人经营</span>
      </div>
      <div>
        <span>注册日期</span>
        <span>2021年07月30日</span>
      </div>
      <div>
        <span>经营场所</span>
        <span>湖北省鄂州市梁子湖区涂家垴镇宅俊街73号</span>
      </div>
    </div>
    <div class="date-pre">
      <span>2021</span>
      <span>07</span>
      <span>30</span>
    </div>
    <div class="net-link-pre">
      <span>http://www.gsxt.gov.cn</span>
    </div>
    <!-- <div class="bottom-content">
      <span>市场主体应当于每年1月1日至6月30日通过国家企业信用信息公示系统报送公示 </span>
    </div> -->
  </div>
</template>

<script>
export default ({

})
</script>

<style lang="scss" scoped>
  .license-box-pre{
    width: 1587px;
    height: 1022px;
    background-color: #ccc;
    position: relative;
    margin: 0 auto;
    .license-number-pre{
      position: absolute;
      top: 310px;
      left: 155px;
      &>div:first-child{
        font-size: 29px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
      }
      &>div:last-child{
        font-size: 17px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
    }
    .planar-pre{
      width: 100px;
      height: 100px;
      background-color: cadetblue;
      position: absolute;
      left: 1230px;
      top: 320px;
    }
    .planar-content-pre{
      width: 100px;
      height: 100px;
      font-size: 13px;
      line-height: 17px;
      position: absolute;
      left: 1340px;
      top: 320px;
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
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
        text-align: justify;
        letter-spacing: 61px;
        white-space: nowrap;
      }
      &>div:nth-child(3)>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 24px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
        text-align: justify;
        letter-spacing: 18px;
        white-space: nowrap;
      }
      &>div:nth-child(4)>span:first-child{
        display: inline-block;
        width: 90px;
        font-size: 24px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
        text-align: justify;
        letter-spacing: 4px;
        white-space: nowrap;
      }
      // 右边内容
      &>div>span:last-child{
        margin-left: 30px;
        font-size: 17px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
      &>div:nth-child(4)>span:last-child{
        position: absolute;
        display: inline-block;
        width: 578px;
        height: 22px;
        line-height: 27px;
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
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #040000;
        line-height: 39px;
        text-align: justify;
        letter-spacing: 5px;
        white-space: nowrap;
      }
      &>div>span:last-child{
        margin-left: 30px;
        font-size: 17px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #373838;
        line-height: 39px;
      }
    }
    .date-pre{
      position: absolute;
      left: 1185px;
      top: 810px;
      &>span{
        font-size: 20px;
        font-family: Source Han Sans CN;
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
      left: 130px;
      top: 935px;
    }
    .bottom-content{
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
</style>

