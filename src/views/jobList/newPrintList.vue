<template>
  <div class="list-page">
    <page-header/>
    <breadcrumb title="打印证照"/>
    <div class="title">{{ $route.meta.title }}</div>
    <div class="tips">
      <img src="../../assets/images/tips.png"/>
      <span>法定代表人、主要经营者或委托代理人才能查看和打印证照</span>
    </div>
    <el-form
        ref="form"
        label-position="left"
        class="w-1000 form"
        :model="form"
        :rules="rules"
        label-width="94px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
              class="radio"
              label="请选择身份"
              label-width="110px"
              prop="role"
          >
            <el-radio
                v-model="form.role"
                label="法定代表人"
                border
                @change="handleChangeType"
            >法定代表人/主要经营者
            </el-radio
            >
            <el-radio
                v-model="form.role"
                label="经办人"
                border
                @change="handleChangeType"
            >经办人/委托代理人
            </el-radio
            >
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属机构" prop="regorg">
            <el-select v-model="form.regorg" style="width:100%" placeholder="请选择所属机构">
              <el-option v-for="item in orgList" :key="item.code" :value="item.code" :label="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="单位名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入要打印证照的单位名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="领取人电话" prop="phone" label-width="104px">
            <el-input v-model="form.phone" placeholder="请输入领取人电话号码" maxlength="11" />
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <template v-if="form.role !== '经办人'">
          <el-col :span="12">
            <el-form-item
                label="法定代表人/主要经营者姓名"
                prop="legalPerson"
                label-width="220px"
            >
              <el-input
                  v-model="form.legalPerson"
                  placeholder="请输入法定代表人/主要经营者姓名"
                  :disabled="form.role === '法定代表人'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="legalPersonCerNo">
              <el-input
                  v-model="form.legalPersonCerNo"
                  placeholder="请输入证件号码"
                  :disabled="form.role === '法定代表人'"
                  maxlength="18"
              />
            </el-form-item>
          </el-col>
        </template>
        <template v-if="form.role === '经办人'">
          <el-col :span="12">
            <el-form-item
                label="经办人/委托代理人姓名"
                label-width="190px"
                prop="agentName"
            >
              <el-input
                  v-model="form.agentName"
                  placeholder="请输入经办人/委托代理人姓名"
                  :disabled="form.role === '经办人'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="agentCerNo">
              <el-input
                  v-model="form.agentCerNo"
                  maxlength="18"
                  placeholder="请填写证件号码"
                  :disabled="form.role === '经办人'"
              />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="12">
          <el-form-item label="领取人电话" prop="phone" label-width="104px">
            <el-input v-model="form.phone" placeholder="请输入领取人电话号码" maxlength="11"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="padding-top: 30px">
          <el-form-item
              label-width="0"
              class="promise text-center"
              prop="promise"
          >
            <el-checkbox v-model="form.promise"
            >本人同意系统采集刷脸认证登录时的人像作为打印证照签收凭证
            </el-checkbox
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="btn-group text-center" label-width="0">
        <!-- <el-button type="primary" @click="onSubmit">暂存草稿</el-button> -->
        <el-button @click="handleSearch">查询</el-button>
      </el-form-item>
      <template v-if="search">
        <div>
          <el-table
              ref="tableData"
              :data="printList"
              highlight-current-row
              style="width: 100%; padding-top: 30px"
              :header-cell-class-name="cellClass"
              @select="singleElection"
          >
            <!-- 单选方法,返回选中的表格行 -->
            <el-table-column align="center" label="选择" width="55">
              <el-table-column
                  type="selection"
                  width="55">
              </el-table-column>
              <!-- <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" :label="scope.$index"
                  >&nbsp;</el-checkbox
                >
              </template> -->
            </el-table-column>
            <el-table-column
                type="index"
                label="序号"
                width="80"
                align="center"
            />
            <el-table-column
                property="companyName"
                label="单位名称"
                width="400"
                align="center"
            />
            <el-table-column
                property="name"
                label="证件名称"
                width="400"
                align="center"
            />
            <el-table-column
                property="num"
                label="数量"
                width="100"
                align="center"
            />
            <el-table-column label="打印状态" align="center">
              <template slot-scope="{ row }">
                {{ row.status ? "已打印" : "未打印" }}
              </template>
            </el-table-column>
          </el-table>
          <div class="btn-group text-center">
            <el-button @click="handleNext">打印</el-button>
          </div>
        </div>
        <!-- <div v-if="device == 'MD'">
          <el-table ref="singleTable" :data="printList" highlight-current-row style="width: 100%;padding-top: 30px;">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column property="companyName" label="单位名称" width="400" align="center" />
            <el-table-column property="name" label="证件名称" width="200" align="center" />
            <el-table-column property="num" label="数量" width="100" align="center" />
            <el-table-column label="打印状态" align="center">
              <template slot-scope="{ row }">
                {{ row.status ? '已打印' : '未打印' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template v-if="!scope.row.status" slot-scope="scope">
                <el-button type="text" size="small" @click="pdfFullScreen(scope.row.filepath, scope.row.name)">打印</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div> -->
      </template>
    </el-form>
    <el-dialog
        :visible.sync="showDialog"
        width="506px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
      <div class="dialog-wrap text-center">
        <img v-if="type" src="../../assets/images/success.png" alt=""/>
        <my-loading v-else width="56" height="56" :src="loadingImg"/>
        <div class="desc" :style="type ? 'padding-bottom: 20px;' : ''">
          {{ type ? "打印完成，请取走文件" : "正在打印中，请不要离开" }}
        </div>
        <div v-if="type && !device" class="print-tips">
          如果<span>{{ second }}</span
        >S内未操作，系统将自动退出
        </div>
        <div
            v-if="type && !device"
            class="btn-group"
            style="padding: 20px 0 56px"
        >
          <el-button type="primary" @click="handleGoHome">返回首页</el-button>
          <el-button @click="logOut">立即退出</el-button>
        </div>
        <div v-if="type && device && !finished">
          打印失败？点击<span class="reload" @click="showDialog = false"
        >重新打印</span
        >
        </div>
        <div
            v-if="type && device && finished"
            class="btn-group"
            style="padding: 20px 0 56px"
        >
          <el-button type="primary" @click="handleGoHome">返回首页</el-button>
          <el-button @click="logOut">立即退出</el-button>
        </div>
        <div
            v-if="type && device && !finished"
            class="btn-group"
            style="padding: 20px 0 56px"
        >
          <el-button type="primary" @click="handleUploadResult">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
        :visible.sync="qrcodeDialog"
        width="598px"
        close-on-click-modal
        close-on-press-escape
        :show-close="false"
    >
      <div class="dialog-qrcode text-center">
        <div class="dialog-title">
          请法定代表人/主要经营者，搜索“湖北市场监督融平台”微信小程序，或扫描下方二维码，找到授权委托申请，完成电子签名
        </div>
        <img src="../../assets/images/auth_qrcode.png" alt=""/>
        <el-button class="auth-btn" @click="qrcodeDialog = false"
        >完成授权
        </el-button
        >
      </div>
    </el-dialog>
    <el-dialog
        :visible.sync="dialogSign"
        width="500px"
        close-on-click-modal
        close-on-press-escape
        :show-close="true"
        class="sign_dialog"
    >
      <div class="dialog_wrap">
        <img src="@/assets/images/qrcode.png" alt="" class="ewm"/>
        <div style="font-size: 16px">请用微信扫码签名,过程中请不要关掉弹窗</div>
      </div>
    </el-dialog>
    <el-dialog
        :visible.sync="dialogVisible"
        width="506px"
        :center="true"
        class="newDialog"
        :close-on-click-modal="false"
    >
      <span>营业执照是否打印成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="failed">否</el-button>
        <el-button type="success" @click="success">是</el-button>
      </span>
    </el-dialog>
    <div>
      <iframe
          id="fullScreenPDF"
          class="fullScreenPDF"
          :src="path"
          frameborder="0"
          width="0"
          height="0"
      ></iframe>
    </div>
    <div v-if="isShow" class="preview-box">
      <!-- 个体户正本 -->
      <div ref="preview1" class="license-box-pre">
        <div class="license-number-pre">
          <div>统一社会信用代码</div>
          <div>{{ printData.creditCode }}</div>
        </div>
        <!-- <div class="number">
      (1——1)
      </div> -->
        <!-- 二维码 -->
        <div class="planar-pre">
          <vue-qr
              :text="url"
              :margin="0"
              color-dark="#000"
              color-light="#fff"
              :logo-src="qrIcon"
              :logo-scale="0.3"
              :size="100"
          />
        </div>
        <div class="planar-content-pre">
          <span
          >扫描二维码登录‘国家企业信用信息公示系统’了解更多登记、备案、许可、监管信息</span
          >
        </div>
        <div class="left-container-pre">
          <div>
            <span>名称</span>
            <span>{{ printData.companyName }}</span>
          </div>
          <div>
            <span>类型</span>
            <span>{{ printData.companyType }}</span>
          </div>
          <div>
            <span>经营者</span>
            <span>{{ printData.legalPerson }}</span>
          </div>
          <div>
            <span>经营范围</span>
            <span style="font-size: 17px">{{ printData.businessScope }}</span>
          </div>
        </div>
        <div class="right-container-pre">
          <div>
            <span>组成形式</span>
            <span>{{ printData.constitute }}</span>
          </div>
          <div>
            <span>注册日期</span>
            <span class="dateNumber" style="margin-left: 70px">{{
                printData.year
              }}</span>
            <span class="dateWord">年</span>
            <span class="dateNumber">{{ printData.monter }}</span>
            <span class="dateWord">月</span>
            <span class="dateNumber">{{ printData.date }}</span>
            <span class="dateWord" style="margin-left: 0">日</span>
          </div>
          <div>
            <span>经营场所</span>
            <span>{{ printData.address }}</span>
          </div>
        </div>
        <div class="date-pre">
          <span>{{ printData.year }}</span>
          <span>{{ printData.monter }}</span>
          <span>{{ printData.date }}</span>
        </div>
        <div class="net-link-pre">
          <span>http://www.gsxt.gov.cn</span>
        </div>
        <!-- <div class="bottom-content">
      <span>市场主体应当于每年1月1日至6月30日通过国家企业信用信息公示系统报送公示 </span>
    </div> -->
      </div>
      <div style="text-align: center">
        <el-button @click="screenShot1">打印正本</el-button>
      </div>
      <!-- 个体户副本 -->
      <div ref="preview2" class="license-box">
        <div class="license-number">
          <div>统一社会信用代码</div>
          <div>{{ printData.creditCode }}</div>
        </div>
        <div class="number">1—1</div>
        <!-- 二维码 -->
        <div class="planar">
          <vue-qr
              :text="url"
              :margin="0"
              color-dark="#000"
              color-light="#fff"
              :logo-src="qrIcon"
              :logo-scale="0.3"
              :size="82"
          />
        </div>
        <div class="planar-content">
          <span
          >扫描二维码登录
            ‘国家企业信用信息公示系统’了解更多登记、备案、许可、监管信息</span
          >
        </div>
        <div class="left-container">
          <div>
            <span>名称</span>
            <span>{{ printData.companyName }}</span>
          </div>
          <div>
            <span>类型</span>
            <span>{{ printData.companyType }}</span>
          </div>
          <div>
            <span>经营者</span>
            <span>{{ printData.legalPerson }}</span>
          </div>
          <div>
            <span>经营范围</span>
            <span>{{ printData.businessScope }}</span>
          </div>
        </div>
        <div class="right-container">
          <div>
            <span>组成形式</span>
            <span>{{ printData.constitute }}</span>
          </div>
          <div>
            <span>注册日期</span>
            <span class="dateNumber" style="margin-left: 12px">{{
                printData.year
              }}</span>
            <span class="dateWord">年</span>
            <span class="dateNumber">{{ printData.monter }}</span>
            <span class="dateWord">月</span>
            <span class="dateNumber">{{ printData.date }}</span>
            <span class="dateWord" style="margin-left: 0">日</span>
          </div>
          <div>
            <span>经营场所</span>
            <span>{{ printData.address }}</span>
          </div>
        </div>
        <div class="date">
          <span>{{ printData.year }}</span>
          <span>{{ printData.monter }}</span>
          <span>{{ printData.date }}</span>
        </div>
        <div class="net-link">
          <span>http://www.gsxt.gov.cn</span>
        </div>
        <div class="bottom-content">
          <span
          >市场主体应当于每年1月1日至6月30日通过国家企业信用信息公示系统报送公示
          </span>
        </div>
      </div>
      <div style="text-align: center">
        <el-button @click="screenShot2">打印副本</el-button>
      </div>
      <!-- 企业正本 -->
      <div ref="preview3" class="license-box-pre">
        <div class="license-number-pre">
          <div>统一社会信用代码</div>
          <div>{{ printData.creditCode }}</div>
        </div>
        <!-- <div class="number">
      (1——1)
      </div> -->
        <!-- 二维码 -->
        <div class="planar-pre">
          <vue-qr
              :text="url"
              :margin="0"
              color-dark="#000"
              color-light="#fff"
              :logo-src="qrIcon"
              :logo-scale="0.3"
              :size="100"
          />
        </div>
        <div class="planar-content-pre-qyzb">
          <span
          >扫描二维码登录 '国家企业信用信息公示系统'
            了解更多登记、备案、许可、监管信息。</span
          >
        </div>
        <div class="left-container-pre">
          <div>
            <span>名称</span>
            <span>{{ form.companyName }}</span>
          </div>
          <div>
            <span>类型</span>
            <span>{{ printData.companyType }}</span>
          </div>
          <div>
            <span style="letter-spacing: 7.5px">法定代表人</span>
            <span>{{ form.legalPerson }}</span>
          </div>
          <div>
            <span>经营范围</span>
            <span style="font-size: 17px">{{ printData.businessScope }}</span>
          </div>
        </div>
        <div class="right-container-pre">
          <div>
            <span>注册资本</span>
            <span>{{ printData.capitalCN }}</span>
          </div>
          <div>
            <span>成立日期</span>
            <span class="dateNumber" style="margin-left: 70px">{{
                printData.year
              }}</span>
            <span class="dateWord">年</span>
            <span class="dateNumber">{{ printData.monter }}</span>
            <span class="dateWord">月</span>
            <span class="dateNumber">{{ printData.date }}</span>
            <span class="dateWord" style="margin-left: 0">日</span>
          </div>
          <div>
            <span>营业期限</span>
            <span>{{ printData.endDateF }}</span>
          </div>
          <div>
            <span style="letter-spacing: 102px">住所</span>
            <span>{{ printData.address }}</span>
          </div>
        </div>
        <div class="date-pre">
          <span>{{ printData.year }}</span>
          <span>{{ printData.monter }}</span>
          <span>{{ printData.date }}</span>
        </div>
        <div class="net-link-pre">
          <span>http://www.gsxt.gov.cn</span>
        </div>
        <!-- <div class="bottom-content">
      <span>市场主体应当于每年1月1日至6月30日通过国家企业信用信息公示系统报送公示 </span>
    </div> -->
      </div>
      <div style="text-align: center">
        <el-button @click="screenShot3">打印正本</el-button>
      </div>
      <!-- 企业副本 -->
      <div ref="preview4" class="license-box">
        <div class="license-number">
          <div>统一社会信用代码</div>
          <div>{{ printData.creditCode }}</div>
        </div>
        <div class="number">1—1</div>
        <!-- 二维码 -->
        <div class="planar">
          <vue-qr
              :text="url"
              :margin="0"
              color-dark="#000"
              color-light="#fff"
              :logo-src="qrIcon"
              :logo-scale="0.3"
              :size="82"
          />
        </div>
        <div class="planar-content">
          <span
          >扫描二维码登录
            ‘国家企业信用信息公示系统’了解更多登记、备案、许可、监管信息</span
          >
        </div>
        <div class="left-container">
          <div>
            <span>名称</span>
            <span>{{ form.companyName }}</span>
          </div>
          <div>
            <span>类型</span>
            <span>{{ printData.companyType }}</span>
          </div>
          <div>
            <span style="letter-spacing: -0.5px">法定代表人</span>
            <span>{{ form.legalPerson }}</span>
          </div>
          <div>
            <span>经营范围</span>
            <span>{{ printData.businessScope }}</span>
          </div>
        </div>
        <div class="right-container">
          <div>
            <span>注册资本</span>
            <span>{{ printData.capitalCN }}</span>
          </div>
          <div>
            <span>成立日期</span>
            <span class="dateNumber" style="margin-left: 12px">{{
                printData.year
              }}</span>
            <span class="dateWord">年</span>
            <span class="dateNumber">{{ printData.monter }}</span>
            <span class="dateWord">月</span>
            <span class="dateNumber">{{ printData.date }}</span>
            <span class="dateWord" style="margin-left: 0">日</span>
          </div>
          <div>
            <span>营业期限</span>
            <span>{{ printData.endDateF }}</span>
          </div>
          <div>
            <span style="letter-spacing: 48px">住所</span>
            <span>{{ printData.address }}</span>
          </div>
        </div>
        <div class="date">
          <span>{{ printData.year }}</span>
          <span>{{ printData.monter }}</span>
          <span>{{ printData.date }}</span>
        </div>
        <div class="net-link">
          <span>http://www.gsxt.gov.cn</span>
        </div>
        <div class="bottom-content">
          <span
          >市场主体应当于每年1月1日至6月30日通过国家企业信用信息公示系统报送公示
          </span>
        </div>
      </div>
      <div style="text-align: center">
        <el-button @click="screenShot4">打印副本</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb/index";
import {print, ZW_print, HDY_print} from "@/api/terminal";
import myLoading from "@/components/Loading/index";
import loadingImg from "@/assets/images/loading_blue.png";
import {
  getPrintList,
  getLicenseInfo,
  uploadResult,
  trustAgent,
  saveTakeRecord,
  getOrganization
} from "@/api/index";
import PageHeader from "@/components/PageHeader/index";
import {getPrefix} from "@/utils/index";
import $ from "jquery";
import html2canvas from "html2canvas";
import vueQr from "vue-qr";

export default {
  components: {
    Breadcrumb,
    myLoading,
    PageHeader,
    vueQr,
  },
  data() {
    const {validateField} = this.$utils;
    const validatePromise = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择承诺"));
      } else {
        callback();
      }
    };
    return {
      orgList: [],
      orgName: '',
      checked: '',
      isShow: true, // 是否显示打印预览
      isFull: false, // 是否全屏遮罩
      dialogVisible: false, // 显示正在打印弹框
      search: false, // 是否已经查询
      showDialog: false, // 显示加载弹窗
      qrcodeDialog: false, // 显示二维码弹窗
      dialogSign: false, // 签名弹窗
      signTimer: null, // 签名定时器
      ident: "", // 轮询ident
      type: 1, // 弹窗类型，0：loading 1：成功
      loadingImg, // loading图片
      printData: {}, // 打印数据
      conum: "1", // 营业执照数量，默认1
      second: 30,
      timer: null,
      device: "", // 一体机设备 美鼎:MD
      path: "",
      form: {
        role: "",
        companyName: "", // 单位名称
        phone: "", // 领取人电话
        legalPerson: "", // 法人名称
        legalPersonCerNo: "", // 法人证件号
        agentName: "", // 代理人姓名
        agentCerNo: "", // 代理人身份证
        promise: false,
        regorg: '',
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
      rules: {
        regorg: [
          {required: true, message: "请选择所属机构", trigger: "change"}
        ],
        role: [{required: true, message: "请选择身份", trigger: "change"}],
        companyName: [
          {required: true, message: "请填写单位名称", trigger: "change"},
        ],
        phone: [
          {required: true, message: "请填写领取人电话", trigger: "change"},
          {validator: validateField("mobile")},
        ],
        legalPerson: [
          {
            required: true,
            message: "请填写法定代表人/主要经营者姓名",
            trigger: "change",
          },
        ],
        agentName: [
          {
            required: true,
            message: "请填写经办人/委托代理人姓名",
            trigger: "change",
          },
        ],
        legalPersonCerNo: [
          {
            required: true,
            message: "请填写法定代表人/主要经营者证件号码",
            trigger: "change",
          },
          {validator: validateField("id")},
        ],
        agentCerNo: [
          {
            required: true,
            message: "请填写经办人/委托代理人姓名证件号码",
            trigger: "change",
          },
          {validator: validateField("id")},
        ],
        promise: [
          {required: true, validator: validatePromise, trigger: "blur"},
        ],
      },
      printList: [],
      fullScreen: false,
      finished: false,
      url: "", // 二维码链接
      qrIcon: "", // 二维码中间图片地址
    };
  },
  computed: {
    printPDF() {
      return function (pdf) {
        return location.origin + getPrefix() + "/open-platform/" + pdf;
      };
    },
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
        this.clearSignTimer();
      }
    },
  },
  created() {
    this.form.legalPerson = '';
    this.form.legalPersonCerNo = '';
    this.form.phone = '';
    this.clearTimer();
    this.clearSignTimer();
    this.device = this.$utils.getLocalItem('device'); // 美鼎打印
    this.getOrgan()
    // this.setTimer()
  },
  beforeDestroy() {
    this.clearTimer();
    this.clearSignTimer();
  },

  methods: {
    cellClass(row) {
      if (row.columnIndex == 0) {
        return 'disabledCheck';
      }
    },
    getOrgan() {
      const data = {
        function: 'query_machine_data',
        arg: {
          '一体机码': this.$utils.getLocalItem('tId')
        }
      }
      getOrganization(data).then((res) => {
        this.$loading().close();
        if (res.state === 'successful') {
          this.orgList = res.outData.data.行政区划
          if (this.orgList.length !== 0) {
            this.form.regorg = this.orgList[0].code
          }
        } else {

        }
      })
    },
    singleElection(selection, row) {
      console.log(selection, row)
      // 有分组的，需要同一组一起选中和不选
      this.$refs.tableData.toggleRowSelection(row)
      this.printList.forEach(item => {
        if (item.id === row.id) {
          this.$refs.tableData.toggleRowSelection(item)
        } else {
          // 排他,每次选择时把其他选项都清除
          item.checked = false;
          this.$refs.tableData.toggleRowSelection(item, false)
        }
      })
      this.ident = row.serialNo
      this.companyName = row.companyName
      this.creditCode = row.creditCode
    },
    clearSignTimer() {
      clearInterval(this.signTimer);
    },
    handleChangeType(val) {
      const userInfo = this.$utils.getLocalItem('userInfo');
      if (val === '法定代表人') {
        this.form.agentName = '';
        this.form.agentCerNo = '';
        this.form.legalPerson = userInfo.name
        this.form.legalPersonCerNo = userInfo.idNumber
        // 测试
        // if (process.env.NODE_ENV === 'development') {
        //   this.form.legalPerson = '吴泽宏'
        //   this.form.legalPersonCerNo = '445221199608046956'
        //   this.form.companyName = '梁子湖区益稳早餐店'
        //   this.form.phone = '13995828917'
        // }
      } else {
        this.form.legalPerson = ''
        this.form.legalPersonCerNo = ''
        this.form.agentName = userInfo.name
        this.form.agentCerNo = userInfo.idNumber
      }
    },
    handleSearch() {
      // getLicenseInfo('2021012910014899700000080').then(data => {
      //   console.log(typeof data)
      //   const printData = data.outData
      //   console.log(data.outData, printData)
      // })
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            device: this.$utils.getLocalItem('device')
                ? this.$utils.getLocalItem('device')
                : '',
            creditCode: '',
          }
          this.$loading({text: '查询中，请稍后'})
          if (this.form.role === '经办人') {
            // trustAgent(data).then((res) => {
            //   if (res.state === 'successful') {
            //     if (!res.outData) {
            //       this.$utils.showError('经办人校验失败')
            //       return
            //     }
            getPrintList(data).then((res) => {
              this.$loading().close()
              if (res.state === 'successful') {
                // 获取成功
                this.search = true
                const outData = res.outData
                // this.ident = res.outData.serialNo
                // this.companyName = outData.companyName
                // this.creditCode = outData.creditCode
                let list = []
                outData.license_data_list.forEach((item, index) => {
                  item.print_list.forEach((td) => {
                    list.push({
                      ...td,
                      id: index + 1,
                      checked: false,
                      companyName: item.companyName,
                      creditCode: item.creditCode,
                      serialNo: item.serialNo
                    })
                  })
                })
                this.printList = list
              }
              //   })
              // }
            })
            return
          }
          getPrintList(data).then((res) => {
            this.$loading().close()
            if (res.state === 'successful') {
              // 获取成功
              this.search = true
              const outData = res.outData
              // this.ident = res.outData.serialNo
              // this.companyName = outData.companyName
              // this.creditCode = outData.creditCode
              let list = []
              outData.license_data_list.forEach((item, index) => {
                item.print_list.forEach((td) => {
                  list.push({
                    ...td,
                    id: index + 1,
                    checked: false,
                    companyName: item.companyName,
                    creditCode: item.creditCode,
                    serialNo: item.serialNo
                  })
                })
              })
              this.printList = list
              // // this.form.creditCode = res.data.outData.creditCode
              // this.printList = res.outData['print_list'].map((item) => {
              //   if (item.name === '营业执照副本') {
              //     this.conum = item.num
              //   }
              //   return {
              //     ...item,
              //     companyName: outData.companyName,
              //     // status: 0
              //   }
              // })
            } else {
              // 获取失败
              if (res.errMsg === '企业未授权') {
                this.qrcodeDialog = true
              } else {
                this.$utils.showError(res.errMsg)
              }
            }
          })
        } else {
          this.$utils.showError('请按提示填写必填项')
        }
      })
    },
    setTimer() {
      this.timer = setInterval(() => {
        if (this.second > 0) {
          this.second--
        } else {
          this.clearTimer()
          this.logOut()
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
      this.second = 30
    },
    handleGoHome() {
      this.clearTimer()
      this.$router.replace('/')
    },
    logOut() {
      // 退出登录
      this.$router.replace('/')
      this.$utils.removeLocalItem('token')
      this.$utils.removeLocalItem('userInfo')
      this.$utils.removeLocalItem('expiryDate')
      this.$store.commit('login/SET_USER_INFO', null)
    },
    handleNext() {
      console.log('打印')
      // const that = this
      // if (this.form.role === '法定代表人') {
      this.handlePrint()
      // } else {
      //   this.dialogSign = true
      //   // 开始轮询
      //   this.signTimer = setInterval(() => {
      //     that.handlePrint()
      //   }, 5000)
      // }
    },
    handlePrint() {
      this.$loading({text: '正在打印，请稍后'})
      getLicenseInfo(this.ident, this.form.role === '法定代表人', this.creditCode).then(
          (resp) => {
            this.$loading().close()
            if (resp.state === 'successful') {
              this.dialogSign = false
              // 这个应该可以去掉
              this.clearSignTimer()
              const printData = resp.outData
              let busscope = ''
              if (printData.businessScope.length >= 800) {
                // 处理经营范围，超出部分只显示800个字
                busscope = printData.businessScope.substring(0, 800)
              } else {
                busscope = printData.businessScope
              }
              if (
                  this.$utils.getLocalItem('curArea').district === '硚口区' &&
                  printData.address &&
                  printData.address.includes('自主申报')
              ) {
                printData.address = printData.address.replace('（自主申报）', '')
              }
              const data = {
                apprdate: printData.entEstDateF, // 核准日期
                busscope, // 经营范围
                ewm: '', // 采用网址+社会统一信用代码 方式，上层传空值即可
                compform: printData.constitute, // 经营方式 1：个人经营 2：家庭经营
                conum: this.conum || '1', // 副本数
                dom: printData.address, // 经营住所
                dymb: printData.dymb, // A-H，服务根据执行不同时用不同打印模板
                entname: printData.companyName, // 公司名称
                enttypemc: printData.companyType, // 企业类型
                // 'enttypemc': printData.companyType, // 企业类型
                estdate: printData.entEstDateF, // 成立日期 格式 YYYY-MM-DD
                lerep: printData.legalPerson, // 法人姓名
                opfrom: printData.startDateF, // 营业期限起
                opto: printData.endDateF, // 营业执照止
                regcapDx: printData.capitalCN.replace('元', '圆'), // 注册资本中文，小写元替换成圆
                regcapcur: '', // 币种
                uniscid: printData.creditCode, // 统一社会信用代码
                printername: 'yyzz', // 终端使用时固定为 yyzz，为后 续多打印机预留
              }
              this.type = 0
              this.showDialog = true
              this.printData = printData
              this.url = `http://www.gsxt.gov.cn/index.html?uniscid=${this.printData.creditCode}`
              let date = JSON.parse(JSON.stringify(this.printData.entEstDateF))
              date = date.split('-')
              this.printData.year = date[0]
              this.printData.monter = date[1]
              this.printData.date = date[2]
              let tid = this.$utils.getLocalItem('tId')
              // console.log(this.printData)
              if (this.device === 'MD' || tid.includes('MD')) {
                console.log('美鼎打印')
                if (printData.dymb === 'A') {
                  setTimeout(() => {
                    this.screenShot3()
                    this.screenShot4()
                  }, 1000)
                  setTimeout(() => {
                    this.dialogVisible = true
                  }, 60000)
                }
                if (printData.dymb === 'F') {
                  setTimeout(() => {
                    this.screenShot1()
                    this.screenShot2()
                  }, 1000)
                  setTimeout(() => {
                    this.dialogVisible = true
                  }, 60000)
                }
                return
              }
              if (this.device === 'ZW' || tid.includes('ZW')) {
                const info = {
                  size: 'A3',
                  style: printData.dymb,
                  code: printData.creditCode,
                  name: printData.companyName,
                  type: printData.companyType,
                  person: printData.legalPerson,
                  business: busscope,
                  money: printData.capitalCN.replace('元', '圆'),
                  // birthday:	printData.entEstDateF,
                  birthday:
                      printData.entEstDateF.replace('-', '年').replace('-', '月') +
                      '日', // yyyy年mm月dd日
                  // time:	`${printData.startDateF}至${printData.endDateF}`,
                  time: `${printData.endDateF}`,
                  address: printData.address,
                  format: printData.constitute,
                  register: printData.entEstDateF,
                }
                this.zwPrint(info, printData)
                return
              }
              if (this.device === 'HDY') {
                const info = {
                  uniscid: printData.creditCode, // 企业信用代码
                  companyName: printData.companyName, // 公司名称
                  registeredCapital: printData.capitalCN.replace('元', '圆'), // 注册资金
                  companyType: printData.companyType, // 公司类型
                  operators: printData.legalPerson, // 法定代表人
                  establishedDate: printData.entEstDateF, // 成立日期
                  businessScope: busscope, // 经营范围
                  residence: printData.address, // 住所
                  operatingPeriod: `${printData.startDateF}至${printData.endDateF}`, // 有效期
                  type: printData.dymb === 'A' ? '2' : '1', // 1个人 2企业
                  formation: printData.constitute, // 组成形式
                }
                this.hdyPrint(info, printData)
              }
              // // 让浏览器跳转到自定义协议，触发 exe 启动：
              // window.location.href = 'zxzzj://print';
              //
              // // 如果需要在页面上给用户一个提示，可以再加一句：
              // this.$message({
              //   type: 'info',
              //   message: '正在调用打印程序，请在弹窗中选择“允许”'
              // });
              print(data)
                  .then((res) => {
                    this.$loading().close()
                    if (+res.code === 10000) {
                      const userInfo = this.$utils.getLocalItem('userInfo')
                      const result = {
                        companyName: printData.companyName,
                        creditCode: printData.creditCode,
                        name: userInfo.name,
                        cerNo: userInfo.idNumber,
                        image: userInfo.facePic,
                        // print_list: this.printList,
                      }
                      uploadResult(result).then(() => {
                        this.type = 1
                        this.showDialog = true
                        this.setTimer()
                      })
                      this.saveRecord(printData)
                    } else {
                      this.$utils.showError(res.msg)
                    }
                  })
                  .catch((res) => {
                    this.showDialog = false
                    this.$utils.showError(res.msg)
                  })
            } else {
              this.$utils.showError(resp.errMsg)
            }
          }
      )
    },
    pdfFullScreen(pdf, name) {
      console.log(name)
      this.name = name
      this.path = location.origin + getPrefix() + '/open-platform/' + pdf
      this.finished = false
      setTimeout(() => {
        document.getElementById('fullScreenPDF').contentWindow.print()
      }, 500)
      setTimeout(() => {
        this.showDialog = true
        this.type = 0
      }, 2000)
      setTimeout(() => {
        this.type = 1
        this.$loading().close()
      }, 8000)
      // this.$router.push({path: '/pdfPreview', query:{path: this.path}})
    },
    failed() {
      this.dialogVisible = false
      this.showDialog = false
    },
    success() {
      this.dialogVisible = false
      this.handleUploadResult()
    },
    handleUploadResult() {
      this.printList = this.printList.map((item) => {
        if (item.name === this.name) {
          item.status = 1
        }
        return item
      })
      console.log(this.printList)
      const userInfo = this.$utils.getLocalItem('userInfo')
      const result = {
        companyName: this.companyName,
        creditCode: this.creditCode,
        name: userInfo.name,
        cerNo: userInfo.idNumber,
        image: userInfo.facePic,
        print_list: this.printList
      }
      uploadResult(result).then(() => {
        this.type = 1
        this.showDialog = true
        this.finished = true
      })
      this.saveRecord(this.printData)
    },
    // 截图
    screenShot1() {
      html2canvas(this.$refs.preview1, {
        // width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        // height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      }).then((canvas) => {
        // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
        const img = canvas.toDataURL('image/png')
        const index = img.lastIndexOf(',')
        const FileBase64 = img.substring(index + 1, img.length)
        console.log(FileBase64)
        this.mdPrint('printImg3', FileBase64)
      })
    },
    screenShot2() {
      html2canvas(this.$refs.preview2, {
        // width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        // height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      }).then((canvas) => {
        // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
        const img = canvas.toDataURL('image/png')
        const index = img.lastIndexOf(',')
        const FileBase64 = img.substring(index + 1, img.length)
        console.log(FileBase64)
        this.mdPrint('printImg2', FileBase64)
      })
    },
    screenShot3() {
      html2canvas(this.$refs.preview3, {
        // width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        // height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      }).then((canvas) => {
        // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
        const img = canvas.toDataURL('image/png')
        const index = img.lastIndexOf(',')
        const FileBase64 = img.substring(index + 1, img.length)
        console.log(FileBase64)
        this.mdPrint('printImg3', FileBase64)
      })
    },
    screenShot4() {
      html2canvas(this.$refs.preview4, {
        // width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        // height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      }).then((canvas) => {
        // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
        const img = canvas.toDataURL('image/png')
        const index = img.lastIndexOf(',')
        const FileBase64 = img.substring(index + 1, img.length)
        console.log(FileBase64)
        this.mdPrint('printImg2', FileBase64)
      })
    },
    // 美鼎打印
    mdPrint(type, img) {
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8172/PrintApi',
        data: {
          Fun: type,
          FileBase64: img
        },
        dataType: 'json',
        async: false,
        success: () => {
          console.log('post success')
        },
        error: () => {
          console.log('post error')
        },
      })
    },
    // 至唯打印
    zwPrint(info, printData) {
      ZW_print(info).then((res) => {
        this.$loading().close()
        console.log(res)
        if (res.flag === '200') {
          const userInfo = this.$utils.getLocalItem('userInfo')
          const result = {
            companyName: printData.companyName,
            creditCode: printData.creditCode,
            name: userInfo.name,
            cerNo: userInfo.idNumber,
            image: userInfo.facePic,
            print_list: this.printList
          }
          this.finished = true
          uploadResult(result).then(() => {
            this.type = 1
            this.showDialog = true
            this.setTimer()
          })
          this.saveRecord(printData)
        } else {
          this.finished = false
          this.$utils.showError(res.message)
        }
      })
    },
    // 汉德院打印
    hdyPrint(info, printData) {
      HDY_print(info).then((res) => {
        this.$loading().close()
        console.log(res)
        if (res.flag === '200') {
          const userInfo = this.$utils.getLocalItem('userInfo')
          const result = {
            companyName: printData.companyName,
            creditCode: printData.creditCode,
            name: userInfo.name,
            cerNo: userInfo.idNumber,
            image: userInfo.facePic,
            print_list: this.printList
          }
          this.finished = true
          uploadResult(result).then(() => {
            this.type = 1
            this.showDialog = true
            this.setTimer()
          })
          this.saveRecord(printData)
        } else {
          this.finished = false
          this.$utils.showError(res.message)
        }
      })
    },
    // 新增打照埋点
    saveRecord(printData) {
      const data = {
        companyName: this.form.companyName, // 企业名称
        uniscid: printData.creditCode, // 企业统一社会信用代码
        companyType: printData.companyType, // 企业类型
        licenseType: '营业执照', // 证照类型
        person: this.$utils.getLocalItem('userInfo').name, // 打照人
        personIdcNum: this.$utils.getLocalItem('userInfo').idNumber, // 打照人证件号码
        personType: this.form.role, // 打照人角色
        takeTerminalId: this.$utils.getLocalItem('tId'), // 打照终端ID
        city: this.$utils.getLocalItem('curArea').city, // 市
        area: this.$utils.getLocalItem('curArea').district // 区
      }
      saveTakeRecord(data).then((res) => {
        if (res.flag !== 200) {
          this.$utils.showError(res.message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// 深度选择器 去掉全选按钮
::v-deep .el-table .disabledCheck .cell .el-checkbox__inner {
  display: none;
}

::v-deep .el-table .disabledCheck .cell::before {
  content: '';
  text-align: center;
  line-height: 37px;
}

.list-page {
  ::v-deep .el-dialog__header {
    padding: 0;
  }

  ::v-deep .el-dialog__body {
    padding: 0;
  }

  .w-1000 {
    width: 1000px;
    margin: 0 auto;
  }

  .sign_dialog {
    .dialog_wrap {
      text-align: center;
      padding: 30px 0 30px 0;

      .ewm {
        width: 300px;
        margin-bottom: 15px;
      }
    }
  }

  .title {
    text-align: center;
    padding-top: 29px;
    font-size: 28px;
    font-weight: 600;
    color: #333333;
    line-height: 40px;
  }

  .tips {
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #7f7e7e;
    padding-top: 15px;

    img {
      width: 22px;
      height: 22px;
      margin-right: 4px;
    }
  }

  .form {
    padding-top: 36px;

    ::v-deep .el-select,
    .el-cascader {
      width: 100%;
      height: 43px;

      input {
        height: 43px;
      }
    }

    ::v-deep .el-input {
      height: 43px;

      input {
        height: 43px;
      }
    }

    ::v-deep .el-form-item__label {
      font-size: 16px;
      font-weight: 600;
    }

    .promise {
      width: 340px;
      margin: 0 auto;
    }

    .radio {
      height: 43px;

      .el-radio {
        min-width: 60px;
        height: 43px;
        padding: 0 20px;
        line-height: 43px;
        margin-right: 0;
        text-align: center;

        ::v-deep .el-radio__label {
          padding: 0;
        }
      }

      ::v-deep .el-radio__input {
        display: none;
      }

      ::v-deep .is-checked {
        background: #3162e8;
      }

      ::v-deep .el-radio__input.is-checked + .el-radio__label {
        color: #fff;
      }
    }

    .btn-group {
      padding-top: 30px;

      &.dialog-btn {
        padding-bottom: 20px;
      }

      .el-button {
        width: 100px;
        height: 48px;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
        line-height: 48px;
        border: 1px solid #3162e8;
        color: #3162e8;
      }
    }
  }

  .dialog-wrap {
    padding-top: 76px;

    img {
      width: 86px;
      height: 86px;
    }

    .desc {
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      padding-top: 59px;
      padding-bottom: 92px;
    }

    .print-tips {
      span {
        color: red;
      }
    }

    .reload {
      color: red;
      cursor: pointer;
    }
  }

  .dialog-qrcode {
    padding: 45px;

    .dialog-title {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      padding-bottom: 35px;
    }

    img {
      display: block;
      width: 326px;
      height: 325px;
      margin: 0 auto;
    }

    .auth-btn {
      width: 155px;
      height: 48px;
      margin: 35px auto 0;
      color: #3162e8;
      border: 1px solid #3162e8;
    }
  }

  .newDialog {
    & ::v-deep .el-dialog__body {
      height: 173px;
      width: 100%;
      font-size: 29px;

      & span {
        display: inline-block;
        width: 100%;
        margin-top: 90px;
        text-align: center;
      }
    }
  }
}

// 证书样式一
.license-box {
  // background-color: cadetblue;
  width: 1122px;
  height: 794px;
  position: relative;
  margin: 0 auto;

  .license-number {
    position: absolute;
    top: 195px;
    left: 125px;

    & > div:first-child {
      font-size: 16px;
      font-family: myFontTitle;
      font-weight: 400;
      color: #040000;
      line-height: 39px;
      letter-spacing: 5px;
    }

    & > div:last-child {
      font-size: 14px;
      font-family: myFontContent;
      font-weight: 400;
      color: #373838;
      line-height: 39px;
    }
  }

  .number {
    position: absolute;
    left: 635px;
    top: 252px;
    font-family: SimSun;
  }

  .planar {
    width: 82px;
    height: 82px;
    position: absolute;
    left: 820px;
    top: 183px;
  }

  .planar-content {
    width: 98px;
    height: 82px;
    font-size: 9px;
    line-height: 15px;
    position: absolute;
    left: 925px;
    top: 184px;
    // font-family: myFontTitle;
  }

  .left-container {
    position: absolute;
    left: 110px;
    top: 365px;
    // 左边名称
    & > div:nth-child(1) > span:first-child,
    & > div:nth-child(2) > span:first-child {
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

    & > div:nth-child(3) > span:first-child {
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

    & > div:nth-child(4) > span:first-child {
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
    & > div > span:last-child {
      margin-left: 12px;
      font-size: 14px;
      font-family: myFontContent;
      font-weight: 400;
      color: #373838;
      line-height: 39px;
    }

    & > div:nth-child(4) > span:last-child {
      display: inline-block;
      width: 375px;
      height: 21px;
      line-height: 21px;
      vertical-align: text-bottom;
    }
  }

  // 右部样式
  .right-container {
    position: absolute;
    left: 638px;
    top: 365px;

    & > div > span:first-child {
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

    & > div > span:last-child {
      margin-left: 12px;
      font-size: 14px;
      font-family: myFontContent;
      font-weight: 400;
      color: #373838;
      line-height: 39px;
    }

    .dateNumber {
      font-size: 14px;
      font-family: SimSun;
      font-weight: 400;
      color: #373838;
      line-height: 39px;
    }

    .dateWord {
      font-size: 14px;
      font-family: myFontContent;
      font-weight: 400;
      color: #373838;
      line-height: 39px;
    }
  }

  .date {
    position: absolute;
    left: 844px;
    top: 676px;

    & > span {
      font-size: 18px;
      font-family: SimSun;
      font-weight: 400;
      color: #040000;
      line-height: 39px;
    }

    & > span:nth-child(1),
    & > span:nth-child(2) {
      margin-right: 40px;
    }
  }

  .net-link {
    position: absolute;
    left: 240px;
    top: 765px;
    font-family: SimSun;
  }

  .bottom-content {
    position: absolute;
    top: 755px;
    left: 540px;

    & > span {
      display: inline-block;
      width: 235px;
      font-size: 12px;
    }
  }
}

// 证书二
.license-box-pre {
  // background-color: cadetblue;
  width: 1588px;
  height: 1122px;
  position: relative;
  margin: 0 auto;

  .license-number-pre {
    position: absolute;
    top: 310px;
    left: 155px;

    & > div:first-child {
      font-size: 24px;
      font-family: myFontTitle;
      font-weight: 400;
      color: #040000;
      line-height: 50px;
      letter-spacing: 5px;
    }

    & > div:last-child {
      font-size: 18px;
      font-family: myFontContent;
      font-weight: 400;
      color: #373838;
      line-height: 50px;
    }
  }

  .planar-pre {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 1230px;
    top: 320px;
  }

  .planar-content-pre {
    width: 108px;
    height: 100px;
    font-size: 12px;
    line-height: 17px;
    position: absolute;
    left: 1340px;
    top: 320px;
    // font-family: myFontTitle;
  }

  .planar-content-pre-qyzb {
    width: 94px;
    height: 100px;
    font-size: 13px;
    line-height: 18px;
    position: absolute;
    left: 1350px;
    top: 315px;
  }

  .left-container-pre {
    position: absolute;
    left: 155px;
    top: 500px;
    // 左边名称
    & > div:nth-child(1) > span:first-child,
    & > div:nth-child(2) > span:first-child {
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

    & > div:nth-child(3) > span:first-child {
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

    & > div:nth-child(4) > span:first-child {
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
    & > div > span:last-child {
      margin-left: 70px;
      font-size: 20px;
      font-family: myFontContent;
      font-weight: 400;
      color: #373838;
      line-height: 39px;
    }

    & > div:nth-child(4) > span:last-child {
      display: inline-block;
      width: 520px;
      height: 26px;
      line-height: 30px;
      vertical-align: text-bottom;
    }
  }

  // 右部样式
  .right-container-pre {
    position: absolute;
    left: 890px;
    top: 500px;

    & > div > span:first-child {
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

    & > div > span:last-child {
      margin-left: 70px;
      font-size: 20px;
      font-family: myFontContent;
      font-weight: 400;
      color: #373838;
      line-height: 39px;
    }

    .dateNumber {
      font-size: 20px;
      font-family: SimSun;
      font-weight: 400;
      color: #373838;
      line-height: 39px;
    }

    .dateWord {
      font-size: 20px;
      font-family: myFontContent;
      font-weight: 400;
      color: #373838;
      line-height: 39px;
    }
  }

  .date-pre {
    position: absolute;
    left: 1210px;
    top: 960px;

    & > span {
      font-size: 27px;
      font-family: SimSun;
      font-weight: 400;
      color: #040000;
      line-height: 39px;
    }

    & > span:nth-child(1),
    & > span:nth-child(2) {
      margin-right: 40px;
    }
  }

  .net-link-pre {
    position: absolute;
    left: 280px;
    top: 1085px;
    font-family: SimSun;
  }

  .bottom-content-pre {
    position: absolute;
    top: 740px;
    left: 440px;

    & > span {
      display: inline-block;
      width: 235px;
      font-size: 12px;
    }
  }
}

.preview-box {
  height: 0;
  opacity: 1;
  overflow: hidden;
}
</style>
