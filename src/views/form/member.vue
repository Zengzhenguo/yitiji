<template>
  <div class="member-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" :title="$route.query.type === 'person' ? '个体工商户开办' : '内资企业开办'
      " />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <div class="tips">
        <img src="../../assets/images/after.png" />
        <span>请经办人、全体股东、董监高管理人员都下载《登记注册身份验证》APP认证身份，再提交申请</span>
      </div>
      <el-form ref="form" label-position="left" class="form" :model="form" label-width="84px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item class="radio" label="是否设立董事会" label-width="127px">
              <el-radio v-model="form.directors" :label="true" border @change="handleChangeDirectors">
                是
              </el-radio>
              <el-radio v-model="form.directors" :label="false" border @change="handleChangeDirectors">
                否
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col v-if="form.directors" :span="5">
            <el-form-item label="任职年限">
              <el-select v-model="form.directorsTime" placeholder="请选择">
                <el-option label="1" value="1" />
                <el-option label="2" value="2" />
                <el-option label="3" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item class="radio" label="是否设立监事会" label-width="127px">
              <el-radio v-model="form.visitors" :label="true" border @change="handleChangeVisitors">
                是
              </el-radio>
              <el-radio v-model="form.visitors" :label="false" border @change="handleChangeVisitors">
                否
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col v-if="form.visitors" :span="5">
            <el-form-item label="任职年限">
              <el-select v-model="form.visitorsTime" placeholder="请选择">
                <el-option label="1" value="1" />
                <el-option label="2" value="2" />
                <el-option label="3" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="添加类型">
              <el-button class="plain" @click="handleShowDialog(1)">添加自然人</el-button>
              <!-- <el-button class="plain" @click="handleShowDialog(2)"
                >添加法人</el-button
              > -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table ref="singleTable" :data="form.memberList" highlight-current-row style="width: 100%">
              <el-table-column type="index" label="序号" width="80" align="center" />
              <el-table-column property="idcName" label="姓名/名称" width="200" align="center" />
              <el-table-column label="是否股东" width="200" align="center">
                <template slot-scope="{ row }">
                  {{ row.investors ? "是" : "否" }}
                </template>
              </el-table-column>
              <el-table-column label="职务" align="center">
                <template slot-scope="{ row }">
                  {{
                    row.jobs.length
                    ? row.jobs.map((item) => item.name).join("、")
                    : "/"
                  }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">
                    编辑
                  </el-button>
                  <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template> </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="$router.go(0)">刷新当前页面</el-button>
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext">下一步</el-button>
        </el-form-item>
      </el-form>
      <!--自然人弹窗-->
      <el-dialog class="dialog" :visible.sync="showNaturalDialog" :show-close="false" width="945px"
        :close-on-click-modal="false">
        <div slot="title" class="custom-title">
          <div class="label">添加自然人</div>
          <div class="close" @click="showNaturalDialog = false">关闭</div>
        </div>
        <div>
          <el-form ref="natural-form" label-position="left" class="form" :model="memberForm" label-width="84px"
            style="padding-top: 0">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="证件照片">
                  <div class="pic-box" v-if="validateFront || !dzform.base64DownPhoto">
                    <upload-card type="single" single-tips="点击上传人像面" :default-image="front" :path.sync="memberForm.front"
                      @setIdCard="handleSetIdCard($event, 'front')" />
                    <upload-card type="single" single-tips="点击上传徽章面" :default-image="back" :path.sync="memberForm.back"
                      :files-type="'pdf'" @setIdCard="handleSetIdCard($event, 'back')" />
                  </div>
                  <div class="pic-box" v-else>
                    <el-image style="width: 200px;" :src="dzform.base64DownPhoto"></el-image>
                    <el-image style="width: 200px;margin-left:20px;" :src="dzform.base64UpPhoto"></el-image>
                  </div>
                  <el-col v-if="memberForm.idcType === '身份证'" :span="24" style="margin-top: 10px; padding: 0px">
                    <upload-code placement="right-start" alias="personnel" @update="updateFileList"
                      @setIdCard="handleSetIdCardForCode" />
                    <el-button v-if="$utils.getLocalItem('curArea').city == '十堰市'" type="primary"
                      @click="openDzzz">电子证照库查询上传</el-button>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="人员姓名">
                  <el-input v-model="memberForm.idcName" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="移动电话">
                  <el-input v-model="memberForm.phone" maxlength="11" placeholder="请填写" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="证件类型">
                  <el-select v-model="memberForm.idcType" placeholder="请选择">
                    <el-option label="身份证" value="身份证" />
                    <!-- <el-option label="香港往来内地通行证" value="香港往来内地通行证" />
                    <el-option label="澳门往来内地通行证" value="澳门往来内地通行证" /> -->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="证件号码">
                  <el-input v-model="memberForm.idcNumber" maxlength="18" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item label="证件地址">
                  <el-input v-model="memberForm.idAddress" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="性别">
                  <el-select v-model="memberForm.sex" placeholder="请选择">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="民族">
                  <el-select v-model="memberForm.nation" placeholder="请选择">
                    <el-option v-for="item in baseData.nations" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item class="radio" label="是否投资人" label-width="100">
                  <el-radio v-model="memberForm.investors" :label="true" border @change="handleChangeRadio">是</el-radio>
                  <el-radio v-model="memberForm.investors" :label="false" border @change="handleChangeRadio">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col v-if="memberForm.investors" :span="12" class="add-btn">
                <el-button class="plain" @click="handleAddInvestment">添加投资方式</el-button>
              </el-col>
            </el-row>
            <template v-if="memberForm.investors && memberForm.investorsList.length > 0">
              <el-row v-for="(item, index) in memberForm.investorsList" :key="index + 10000" :gutter="20">
                <el-col :span="10">
                  <el-form-item label="出资方式">
                    <el-select :value="item.way" placeholder="请选择" @change="handleChangeWay($event, index)">
                      <el-option v-for="val in ways" :key="val" :label="val" :value="val" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="认缴出资额" label-width="100px">
                    <el-select v-model="item.currency" placeholder="请选择">
                      <el-option label="人民币" value="人民币" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="0">
                    <el-input ref="inputMoney" v-model="item.money" maxlength="4" placeholder="请填写"
                      @change="handleChangeBtn(memberForm.investors)">
                      <template slot="append">万元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label-width="0">
                    <el-button type="text" @click="handleDelInvestment(index)">删除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <div v-if="memberForm.investors && memberForm.investorsList.length === 0
              " class="add-tips">
              请添加投资方式
            </div>
            <el-row v-if="memberForm.investors" :gutter="20">
              <el-col :span="10">
                <el-form-item label="出资时间">
                  <el-date-picker v-model="memberForm.time" :editable="false" type="date" value-format="yyyy-MM-dd"
                    placeholder="选择出资时间" :picker-options="pickerOptions" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="担任职务" />
              </el-col>
              <el-col :span="12" class="add-btn">
                <el-button class="plain" @click="handleAddJob">添加职务</el-button>
              </el-col>
            </el-row>
            <template v-if="memberForm.jobs.length">
              <el-row v-for="(item, index) in memberForm.jobs" :key="index" :gutter="20">
                <el-col :span="1">
                  <div class="job-number">
                    <span>{{ $utils.formatNumber(1 + index) }}</span>
                  </div>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="职务名称">
                    <el-select v-model="item.id" placeholder="请选择" @change="handleChangeJob($event, index)">
                      <el-option v-for="val in jobsList" :key="val.id" :label="val.name" :value="val.id"
                        :disabled="val.disabled" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item v-if="!isShowFdrAddJob(item) && keys.includes(item.id)" label="任免方式">
                    <el-select v-model="item.ways" placeholder="请选择">
                      <el-option v-for="val in item.waysList" :key="val" :label="val" :value="val" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item v-if="!isShowFdrAddJob(item) && keys.includes(item.id)" label="任免机构">
                    <el-select v-model="item.institutions" placeholder="请选择">
                      <el-option v-for="val in item.institutionsList" :key="val.value" :label="val.label"
                        :value="val.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="isShowFdrAddJob(item) && item.id" :span="7">
                  <el-form-item label="兼任">
                    <el-select v-model="memberForm.fddbrJob" placeholder="请选择">
                      <el-option v-for="val in fddbrJobList_FX" :key="val.value" :label="val.label" :value="val.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label-width="0">
                    <el-button type="text" @click="handleDelJob(index)">删除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <div v-else class="add-tips">若担任职务请添加</div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="disabled" @click="handleAddMember('showNaturalDialog')">确定添加</el-button>
        </span>
      </el-dialog>
      <!--法人弹窗-->
      <el-dialog class="dialog" :visible.sync="showLegalDialog" :show-close="false" width="945px"
        :close-on-click-modal="false">
        <div slot="title" class="custom-title">
          <div class="label">添加法人</div>
          <div class="close" @click="showLegalDialog = false">关闭</div>
        </div>
        <div>
          <el-form ref="legal-form" label-position="left" class="form" :model="memberForm" label-width="84px"
            style="padding-top: 0">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="公司名称">
                  <el-input v-model="memberForm.idcName" placeholder="请填写" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="证件类型">
                  <el-select v-model="memberForm.idcType" placeholder="请选择">
                    <el-option label="营业执照" value="营业执照" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="证件号码">
                  <el-input v-model="memberForm.idcNumber" maxlength="18" placeholder="请填写统一社会信用代码" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="证件照片">
                  <div class="pic-box">
                    <upload-card type="single" single-tips="点击上传营业执照" :default-image="license"
                      :path.sync="memberForm.licensePic" />
                  </div>
                  <el-col :span="24" style="margin-top: 10px; padding: 0px">
                    <upload-code placement="right-start" alias="licensePic" @update="updateFileList" />
                  </el-col>
                  <!-- <upload-code placement="right-start" style="top: 0; position: absolute; left: 363px;" /> -->
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="法定代表人姓名" label-width="132px">
                  <el-input v-model="memberForm.legalName" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="移动号码">
                  <el-input v-model="memberForm.phone" maxlength="11" placeholder="请填写" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="证件类型">
                  <el-select v-model="memberForm.legalIdType" placeholder="请选择">
                    <el-option label="身份证" value="身份证" />
                    <!-- <el-option label="香港往来内地通行证" value="香港往来内地通行证" />
                    <el-option label="澳门往来内地通行证" value="澳门往来内地通行证" /> -->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="证件号码">
                  <el-input v-model="memberForm.legalIdNumber" maxlength="18" placeholder="请填写" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="投资情况" />
              </el-col>
              <el-col :span="12" class="add-btn">
                <el-button class="plain" @click="handleAddInvestment">添加投资方式</el-button>
              </el-col>
            </el-row>
            <template v-if="memberForm.investorsList.length">
              <el-row v-for="(item, index) in memberForm.investorsList" :key="index + 10000" :gutter="20">
                <el-col :span="10">
                  <el-form-item label="出资方式">
                    <el-select :value="item.way" placeholder="请选择" @change="handleChangeWay($event, index)">
                      <el-option v-for="val in ways" :key="val" :label="val" :value="val" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="认缴出资额" label-width="100px">
                    <el-select v-model="item.currency" placeholder="请选择">
                      <el-option label="人民币" value="人民币" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label-width="0">
                    <el-input v-model="item.money" placeholder="请填写" @input="checkmoney" maxlength="4">
                      <template slot="append">万元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label-width="0">
                    <el-button type="text" @click="handleDelInvestment(index)">删除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
            <div v-else class="add-tips">请添加投资方式</div>
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="出资时间">
                  <el-date-picker v-model="memberForm.time" :editable="false" type="date" value-format="yyyy-MM-dd"
                    placeholder="选择出资时间" :picker-options="pickerOptions" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAddMember('showLegalDialog')">确定添加</el-button>
        </span>
      </el-dialog>
      <el-dialog class="dialog" :visible.sync="DzzzDialog" :show-close="false" width="40%" :close-on-click-modal="false">
        <div slot="title" class="custom-title">
          <div class="label">电子证照库查询</div>
          <div class="close" @click="DzzzDialog = false">关闭</div>
        </div>
        <el-form ref="dzform" label-position="left" class="form" :model="dzform">
          <el-row :gutter="20">
            <!-- <el-col :span="20">
              <el-form-item class="radio" label="证件号：" label-width="127px">
                <el-input v-model="dzform.idcard" placeholder="请输入证件号查询电子证照库信息" disabled/>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="2">
              <el-button type="primary" @click="searchDzzz">查询</el-button>
            </el-col> -->
          </el-row>
          <el-row :gutter="20" v-if="dzform.base64DownPhoto">
            <el-col :span="12" style="height: auto;">
              <el-form-item label="证件照正面：" label-width="127px">
                <el-image style="width: 200px;" :src="dzform.base64DownPhoto"></el-image>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="dzform.base64UpPhoto">
            <el-col :span="12" style="height: auto;">
              <el-form-item label="证件照反面：" label-width="127px">
                <el-image style="width: 200px;" :src="dzform.base64UpPhoto"></el-image>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getIdCardInfos">上传</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import baseData from "@/config/baseData.js";
import {
  GetCertificateDataByCertificateID,
  GetCertificateImageByCertificateID,
  checkIfLaoLai,
  checkIfBlack,
  SYRetrieval,
  getIdCardInfo
} from "@/api";
import Breadcrumb from "@/components/Breadcrumb/index";
import license from "@/assets/images/license.png";
import front from "@/assets/images/front.png";
import back from "@/assets/images/back.png";
import UploadCard from "@/components/UploadFile/camera";
import UploadCode from "@/components/UploadFile/uploadCode";
import { debounce } from "@/utils";
export default {
  components: {
    Breadcrumb,
    UploadCard,
    UploadCode,
  },
  data() {
    return {
      dzform: {
        idcard: "",
        base64DownPhoto: "",
        base64UpPhoto: ''
      },
      printList: [],
      DzzzDialog: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      oneflag: false,
      blackflag: false,
      llflag: false,
      validateFront: false, // 是否正确校验身份证正面
      validateBack: false, // 是否正确校验身份证反面
      baseData,
      editIndex: -1, // 编辑下标
      keys: [10, 20, 30, 40, 45, 50, 60, 70, 80, 85], // 需要显示任免方式和任免机构的id
      showNaturalDialog: false, // 自然人弹窗
      showLegalDialog: false, // 法人弹窗
      license,
      front,
      back,
      disabled: true, // 是否禁用自然人确认提交按钮
      ways: [
        "货币",
        "实物",
        "知识产权",
        "债券",
        "高新技术成果",
        "土地使用权",
        "股权",
        "其他",
      ], // '劳务',
      jobsList: [],
      currentCount: {
        // 初始化人数避免报错
        法定代表人: 0,
        经理: 0,
        执行董事: 0,
        财务负责人: 0,
        联络员: 0,
        "经办人/委托代理人": 0,
        监事会主席: 0,
        监事: 0,
        "监事（职工代表）": 0,
        董事长: 0,
        副董事长: 0,
        董事: 0,
        "董事（职工代表）": 0,
      },
      addJob: [
        // 基础职位
        {
          id: 10,
          name: "法定代表人",
        },
        {
          id: 85,
          name: "经理",
        },
        {
          id: 70,
          name: "监事",
        },
        {
          id: 90,
          name: "财务负责人",
        },
        {
          id: 100,
          name: "联络员",
        },
        {
          id: 110,
          name: "经办人/委托代理人",
        },
      ],
      addJob1: [
        // 不设立董事会监事会插入
        {
          id: 45,
          name: "执行董事",
        },
      ],
      addJob2: [
        // 设立董事会
        {
          id: 20,
          name: "董事长",
        },
        {
          id: 30,
          name: "副董事长",
        },
        {
          id: 40,
          name: "董事",
        },
        {
          id: 50,
          name: "董事（职工代表）",
        },
      ],
      addJob3: [
        // 设立监事会
        {
          id: 60,
          name: "监事会主席",
        },
        {
          id: 80,
          name: "监事（职工代表）",
        },
      ],
      memberForm: {
        idcName: "", // 人员姓名或企业名称
        idcType: "", // 证件类型
        idcNumber: "", // 证件号码
        idAddress: "", // 自然人证件地址
        legalName: "", // 法人姓名
        legalIdType: "身份证", // 法人证件类型
        legalIdNumber: "", // 法人证件号码
        sex: "", // 性别
        nation: "汉族", // 民族
        front: "", // 自然人身份证人像面
        back: "", // 自然人身份证背面
        licensePic: "", // 法人营业执照照片
        phone: "", // 自然人或法人移动电话
        investors: false, // 是否投资人
        type: "", // 股东类型（自然人股东、法人股东）
        investorsList: [
          {
            // 投资人列表
            way: "货币", // 自然人或法人出资方式
            currency: "人民币", // 币种
            money: "", // 自然人或法人出资金额,支持小数点后3位
          },
        ],
        time: "", // 自然人或法人出资时间
        jobs: [
          // { // 自然人人员职务
          //   id: '', // 职务名称ID
          //   name: '', // 职务名称(显示项)
          //   ways: '', // 任免方式
          //   nationality: '中国', // 国籍
          //   institutions: '', // 任免机构
          //   waysList: [], // 该职务任免方式选项
          //   institutionsList: [] // 该职务任免机构选项
          // }
        ],
        fddbrJob: "", // 法定代表人兼任职位
      },
      form: {
        visitors: false, // 是否设立监事会
        directors: false, // 是否设立董事会
        visitorsTime: "3", // 监事会任职年限
        directorsTime: "3", // 董事会任职年限
        memberList: [],
      },
      companyType: "",
      fddbrJobList_FX: [
        {
          // 法定代表人兼任职位列表
          label: "经理",
          value: 10,
        },
        //2023/7/14屏蔽
        // {
        //   label: "执行董事",
        //   value: 20,
        // },
        // {
        //   label: "执行董事兼经理",
        //   value: 30,
        // },
      ],
    };
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo;
    },
  },
  watch: {
    'memberForm.idcNumber': debounce(function (data) {
      if (data.length === 18 && this.memberForm.idcType === "身份证" && !this.memberForm.sex) {
        this.memberForm.sex = parseInt(this.memberForm.idcNumber.substr(16, 1)) % 2 === 1 ? "男" : "女";
      }
      this.handlecheck();
    }, 500),
    'memberForm.legalIdNumber': debounce(function (data) {
      this.handlecheck();
    }, 500)
  },

  activated() {
    if (this.$utils.getItem("draftNumber")) {
      this.$store
        .dispatch("draft/getDraftDetail", this.$utils.getItem("draftNumber"))
        .then(async (res) => {
          if (res.member) {
            this.form = res.member;
          }
          this.currentCount = this.handleGetCount();
          // 设置公司类型
          this.companyType = res.nameApply.companyType;
        });
    }
    if(localStorage.getItem('userInfo')&&JSON.parse(localStorage.getItem('userInfo')).idNumber){
      this.dzform.idcard = JSON.parse(localStorage.getItem('userInfo')).idNumber
    }else{
      return this.$utils.showError("发生错误，请联系管理员");
    }
    // // 先赋值再拿名称申报的名称覆盖
    // if (this.$utils.getItem('member')) {
    //   const member = this.$utils.getItem('member')
    //   if (member.memberOrgWay) { // 含有组织方式字段,个体户
    //     this.$utils.removeItem('member')
    //   } else {
    //     this.form = member
    //   }
    // }
    // if (this.$utils.getItem('nameApply')) {
    //   this.companyType = this.$utils.getItem('nameApply').companyType
    // }
    // // 应该可以弃用
    // if (this.$utils.getItem('currentCount')) {
    //   this.currentCount = this.$utils.getItem('currentCount')
    // }
  },
  methods: {
    checkIdCardInfo(path, type) {
      return new Promise(resolve => {
        this.$utils.showLoading({ text: `正在识别身份证${type}面，请稍后...` })
        getIdCardInfo(path).then(res => {
          this.$utils.hideLoading()
          resolve(res.outData.cards)
        })
      })
    },
    checkmoney(value) {
      if (value > 10000) {
        this.$utils.showError("认缴出资额上限：10000万元");
      }
    },
    searchDzzz() {
      this.$loading({ text: '加载中...' })
      let params = {
        CertificateHolderCode: this.dzform.idcard,
        CertificateType: "中华人民共和国居民身份证",
        CertificateTypeCode: "",
        CertificateNumber: "",
        CertificateName: "",
        Mode: "1",
      };
      if(params.CertificateHolderCode===''||params.CertificateHolderCode===null){
        return this.$utils.showError("发生错误，请联系管理员"); 
      }
      SYRetrieval(params).then((res) => {
        this.$loading().close()
        this.dzform.base64DownPhoto = res.data.base64DownPhoto;
        this.dzform.base64UpPhoto = res.data.base64UpPhoto;
        this.$utils.setItem('base64DownPhoto', res.data.base64DownPhoto)
        this.$utils.setItem('base64UpPhoto', res.data.base64UpPhoto)
      });
      // this.$loading().close()
      // return this.$utils.showError("证照库未查询到相关信息"); 
    },
    async getIdCardInfos() {
      let base64DownPhoto = this.$utils.getItem('base64DownPhoto')
      let base64UpPhoto = this.$utils.getItem('base64UpPhoto')
      if (!base64DownPhoto || !base64UpPhoto) {
        return this.$utils.showError("查询证照失败")
      }
      let img = base64DownPhoto.substring(20)
      let front = await this.checkIdCardInfo(img, '正')
      if (!front) return this.$utils.showError("身份证正面识别失败")
      this.memberForm.idcName = front.name;
      this.memberForm.idcNumber = front.id_card_number;
      this.memberForm.idAddress = front.address;
      this.memberForm.front = base64DownPhoto

      let img2 = base64UpPhoto.substring(20)
      let back = await this.checkIdCardInfo(img2, '反')
      if (!back) return this.$utils.showError("身份证反面识别失败")
      this.memberForm.back = base64UpPhoto
      this.validateFront = false
      this.DzzzDialog = false
    },
    openDzzz() {
      this.DzzzDialog = true;
      setTimeout(()=>{
        this.searchDzzz()
      },0)
    },
    singleElection(selection, row) {
      this.getuserimg(row);
      this.getuserinfo(row);
    },
    getuserimg(row) {
      let params = {
        AccountId: "11420300741794186H.017",
        CertificateID: row.certificateID,
      };
      GetCertificateImageByCertificateID(params).then((res) => {
        let result = JSON.parse(res.data);
        result.data = JSON.parse(result.data);
        console.log(result.data, "111111111");
      });
    },
    getuserinfo(row) {
      let params = {
        AccountId: "11420300741794186H.017",
        CertificateID: row.certificateID,
      };
      GetCertificateDataByCertificateID(params).then((res) => {
        let result = JSON.parse(res.data);
        result.data = JSON.parse(result.data);
        console.log(result.data, "111111111");
      });
    },
    // 保存草稿
    handleSaveDraft(showTips = false) {
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          member: this.form, // 现在数据覆盖原有数据
          businessType: this.$route.query.type === "person" ? "1" : "2",
          showTips, // 是否显示提示
        };
        this.$store
          .dispatch("draft/saveDraft", data)
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    handleSetIdCardForCode(e) {
      setTimeout(() => {
        if (e[0].type && !e[0].id_card_number) {
          // 有识别正面
          this.validateFront = false;
          return this.$utils.showError("身份证正面识别失败！");
        }
        if (e[1].type && !e[1].valid_date) {
          // 有识别反面
          this.validateBack = false;
          return this.$utils.showError("身份证反面识别失败！");
        } else if (e[1].type && e[1].valid_date) {
          // 校验是否过期
          const time = new Date(
            e[1].valid_date.split("-")[1].replace(/\./g, "-")
          ).getTime();
          const nowTime = new Date().getTime();
          if (parseFloat(time) - parseFloat(nowTime) < 0) {
            // 证件已过有效期
            this.validateBack = false;
            return this.$utils.showError("身份证已过期，请上传有效的身份证！");
          } else {
            // 反面校验，证件未过有效期
            this.validateBack = true;
          }
        }
        if (e[0].type && e[0].id_card_number) {
          // 校验正面
          this.memberForm.idcName = e[0].name;
          this.memberForm.idcNumber = e[0].id_card_number;
          this.memberForm.idAddress = e[0].address;
          this.validateFront = true;
        }
      }, 300);
    },
    handleSetIdCard(e, type) {
      // 延迟0.3秒，保证附件成功上传
      setTimeout(() => {
        /* 用户上传身份证图片后，自动识别身份证姓名，证件号，证件地址并自动填写到页面对应的位置
        用户上传身份证图片后，自动识别身份证有效期，如证件已过期，提示用户：证件已过期
        过期的证件信息不允许保存提交
      */
        if (type === "front" && !e.id_card_number) {
          this.validateFront = false;
          return this.$utils.showError("身份证正面识别失败！");
        }
        if (type === "back" && !e.valid_date) {
          this.validateBack = false;
          return this.$utils.showError("身份证反面识别失败！");
        } else if (type === "back" && e.valid_date) {
          // 校验是否过期
          const time = new Date(
            e.valid_date.split("-")[1].replace(/\./g, "-")
          ).getTime();
          const nowTime = new Date().getTime();
          if (parseFloat(time) - parseFloat(nowTime) < 0) {
            // 证件已过有效期
            this.validateBack = false;
            return this.$utils.showError("身份证已过期，请上传有效的身份证！");
          } else {
            // 反面校验，证件未过有效期
            this.validateBack = true;
          }
        }
        if (type === "front" && e.id_card_number) {
          // 校验正面
          this.memberForm.idcName = e.name;
          this.memberForm.idcNumber = e.id_card_number;
          this.memberForm.idAddress = e.address;
          this.validateFront = true;
        }
      }, 300);
    },
    // 处理默认选中当前日期 +90天 -> 更改为+30年
    defaultTime() {
      var date1 = new Date();
      var date2 = new Date(date1);
      // date2.setDate(date1.getDate() + 90)
      date2.setFullYear(date1.getFullYear() + 30);
      var year = date2.getFullYear();
      var month = date2.getMonth();
      var date = date2.getDate();
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date}`;
      // console.log(defaultDate)
      this.$set(this.memberForm, "time", defaultDate);
    },
    // 更新扫码上传数据
    updateFileList(val) {
      if (val.type === "personnel") {
        this.$set(this.memberForm, "back", val.data[0].back);
        this.$set(this.memberForm, "front", val.data[0].front);
      } else {
        this.$set(this.memberForm, "licensePic", val.data[0]);
      }
    },
    // 校验自然人身份证和手机号
    filterGD(memberForm) {
      // 编辑操作先重置
      if (this.editIndex !== -1) {
        this.form.memberList[this.editIndex].idcNumber = "";
        this.form.memberList[this.editIndex].phone = "";
      }
      // console.log(this.form.memberList, this.editIndex)
      for (const item of this.form.memberList) {
        if (item.idcNumber === memberForm.idcNumber) {
          return "idcNumber";
        }
        if (item.phone === memberForm.phone) {
          return "phone";
        }
      }
    },
    handleEdit(index) {
      this.validateFront = true; // 编辑设置为true
      this.validateBack = true;
      // 每次调用弹窗重置职务选项
      this.handleResetJobsList();
      this.memberForm = JSON.parse(JSON.stringify(this.form.memberList[index]));
      this.editIndex = index;
      if (!this.memberForm.investors && !this.memberForm.jobs.length) {
        // 不是股东且没有职务
        this.disabled = true;
      } else {
        this.disabled = false; // 编辑时数据已经合法，打开按钮
      }

      if (this.memberForm.type === "自然人股东") {
        this.showNaturalDialog = true;
      } else {
        this.showLegalDialog = true;
      }
    },
    handleChangeDirectors(value) {
      const names = ["董事长", "副董事长", "董事", "董事（职工代表）"];

      // 不设立董事会，清除name中的职务
      if (!value && this.form.memberList.length) {
        this.handleSpliceJob(names);
      } else if (value && this.form.memberList.length) {
        // 设立董事会，清除执行董事
        this.handleSpliceJob(["执行董事"]);
      }
      this.currentCount = this.handleGetCount();
    },
    handleChangeVisitors(value) {
      const names = ["监事会主席", "监事（职工代表"];
      if (!value && this.form.memberList.length) {
        // 不设立监事会，清除names职务
        this.handleSpliceJob(names);
      }
      this.currentCount = this.handleGetCount();
    },
    // 遍历清除对应职务
    handleSpliceJob(names) {
      for (let i = this.form.memberList.length - 1; i >= 0; i--) {
        if (this.form.memberList[i].jobs.length) {
          for (let j = this.form.memberList[i].jobs.length - 1; j >= 0; j--) {
            if (names.includes(this.form.memberList[i].jobs[j].name)) {
              this.form.memberList[i].jobs.splice(j, 1);
            }
          }
          // if (!this.form.memberList[i].jobs.length && !this.form.memberList[i].investors) { // 如果不是投资人且没有职务
          //   this.form.memberList.splice(i, 1)
          // }
        }
      }
    },
    handleDelete(index) {
      this.form.memberList.splice(index, 1);
    },
    handleShowDialog(type) {
      this.$utils.setLocalItem("tabType", type == 1 ? "自然人" : "法人");
      // 显示弹窗是重置数据
      if (this.from !== "camera") {
        // 如果不是高拍仪返回，重置数据
        this.handleReset();
      }

      // 默认显示时间
      this.defaultTime();
      if (type === 1) {
        this.memberForm.idcType = "身份证";
        this.memberForm.type = "自然人股东";
        // 每次调用弹窗重置职务选项
        this.handleResetJobsList();
        this.showNaturalDialog = true;
        // 默认是股东
        this.$set(this.memberForm, "investors", true);
      } else {
        this.showLegalDialog = true;
        this.memberForm.idcType = "营业执照";
        this.memberForm.type = "法人股东";
        this.memberForm.investors = true; // 企业肯定是股东
      }
    },
    handleResetJobsList() {
      this.jobsList = [];
      if (!this.form.directors && !this.form.visitors) {
        // 不设立董事会监事会
        this.jobsList = this.jobsList.concat(this.addJob).concat(this.addJob1);
      } else if (this.form.directors && !this.form.visitors) {
        // 设立董事会不设立监事会
        this.jobsList = this.jobsList.concat(this.addJob).concat(this.addJob2);
      } else if (!this.form.directors && this.form.visitors) {
        // 不设立董事会设立监事会
        this.jobsList = this.jobsList
          .concat(this.addJob)
          .concat(this.addJob3)
          .concat(this.addJob1);
      } else {
        //  设立董事会设立监事会
        this.jobsList = this.jobsList
          .concat(this.addJob)
          .concat(this.addJob2)
          .concat(this.addJob3);
      }
      this.sort(this.jobsList);
    },
    // 出资方式
    handleChangeWay(value, index) {
      // 切换出资方式，按钮变成可提交
      this.disabled = false;
      let bool = true;
      this.memberForm.investorsList.forEach((item) => {
        if (item.way === value) {
          bool = false;
        }
      });
      if (bool) {
        this.memberForm.investorsList[index].way = value;
      } else {
        this.$utils.showError(
          "您已经选择过这种出资方式了，请选择其他出资方式！"
        );
        this.memberForm.investorsList[index].way = "";
      }
    },
    handleAddInvestment() {
      this.memberForm.investorsList.push({
        way: "", // 自然人或法人出资方式
        currency: "人民币", // 币种
        money: "", // 自然人或法人出资金额,支持小数点后3位
      });
    },
    handleDelInvestment(index) {
      this.memberForm.investorsList.splice(index, 1);
      this.handleChangeBtn(this.memberForm.investors);
      // if (this.memberForm.investors && !this.memberForm.investorsList.length) { // 如果是投资人而且删到没数据
      //   this.disabled = true
      // }
    },
    // 添加职务
    handleAddJob() {
      this.memberForm.jobs.push({
        id: "", // 职务名称ID
        name: "", // 职务名称
        ways: "", // 任免方式
        nationality: "中国", // 国籍
        institutions: "", // 任免机构
        waysList: [], // 该职务任免方式选项
        institutionsList: [], // 该职务任免机构选项
      });
    },
    // 删除职务
    handleDelJob(index) {
      this.memberForm.jobs.splice(index, 1);
      // if (!this.memberForm.investors && !this.memberForm.jobs.length) { // 如果不是投资人且删到没职务
      //   this.disabled = true
      // }
      this.handleChangeBtn(this.memberForm.investors);
      this.currentCount = this.handleGetCount();
    },
    // 修改职务
    handleChangeJob(value, index) {
      // 过滤出已选职务名称
      const name = this.jobsList.filter((item) => item.id === value)[0].name;
      const keys = this.memberForm.jobs.map((item) => item.id);
      if (!this.memberForm.investors && keys.length) {
        // 如果不是投资人,且设置了职务
        this.disabled = false;
      } else if (!this.memberForm.investors && keys.length === 0) {
        this.disabled = true;
      }
      // 先清空值，满足条件再重新赋值
      this.memberForm.jobs[index].id = "";
      this.memberForm.jobs[index].name = "";
      // 选择拦截
      // 添加完成更新人员数量
      const currentCount = this.handleGetCount();
      // 只允许一人的职务
      const names = [
        "法定代表人",
        "经理",
        "执行董事",
        "财务负责人",
        "联络员",
        "经办人/委托代理人",
        "董事长",
        "监事会主席",
      ];
      // const names2 = ['董事长', '副董事长', '董事', '董事（职工代表）']
      // const names3 = ['监事会主席', '监事', '监事（职工代表']
      if (names.includes(name) && currentCount[name] === 1) {
        // 已经设置过对应职务了
        return this.$utils.showError(
          `${name}最多只能添加1个，您已添加过了，无需再添加`
        );
      } else if (name === "监事" && currentCount[name] >= 2) {
        return this.$utils.showError(
          `${name}最多只能添加2个，您已添加过了，无需再添加`
        );
      }
      // else if (names2.includes(name) && (this.currentCount['董事长'] + this.currentCount['副董事长'] + this.currentCount['董事'] + this.currentCount['董事（职工代表）'] < 3)) { // 选择了董事会职务
      //   return this.$utils.showError(`董事会成员不得少于3个`)
      // }
      console.log(keys, value);
      const count = keys.filter((item) => item === value);

      // 查重
      if (count.length > 1) {
        return this.$utils.showError(`您已经选择过该职务了，无需重复选择`);
      }
      // 自动配置单个任免方式
      this.handleSetWays(index, value);
      switch (value) {
        case 10: // 选定法定代表人或者经理或执行董事，禁用监事会主席，监事，监事（职工代表）
        case 45:
        case 85:
        case 90:
          if (keys.includes(60) || keys.includes(70) || keys.includes(80)) {
            this.$utils.showError("您已选择了监事相关职务，不能选择该职务");
          } else {
            this.memberForm.jobs[index].id = value;
            this.memberForm.jobs[index].name = name;
          }
          break;
        case 60: // 选了监事会主席
          if (keys.includes(10)) {
            this.$utils.showError(`您已选择了法定代表人，不能选择该职务`);
          } else if (keys.includes(45)) {
            this.$utils.showError(`您已选择了执行董事，不能选择该职务`);
          } else if (keys.includes(85)) {
            this.$utils.showError(`您已选择了经理，不能选择该职务`);
          } else if (keys.includes(90)) {
            this.$utils.showError(`您已选择了财务负责人，不能选择该职务`);
          } else if (keys.includes(70)) {
            this.$utils.showError(`您已选择了监事，不能选择该职务`);
          } else if (keys.includes(80)) {
            this.$utils.showError(`您已选择了监事（职工代表），不能选择该职务`);
          } else if (keys.includes(40)) {
            this.$utils.showError(`您已选择了董事，不能选择该职务`);
          } else {
            this.memberForm.jobs[index].id = value;
            this.memberForm.jobs[index].name = name;
          }
          break;
        case 70: // 选了监事、监事（职工代表）
        case 80:
          if (keys.includes(10)) {
            this.$utils.showError(`您已选择了法定代表人，不能选择该职务`);
          } else if (keys.includes(45)) {
            this.$utils.showError(`您已选择了执行董事，不能选择该职务`);
          } else if (keys.includes(85)) {
            this.$utils.showError(`您已选择了经理，不能选择该职务`);
          } else if (keys.includes(90)) {
            this.$utils.showError(`您已选择了财务负责人，不能选择该职务`);
          } else if (keys.includes(60)) {
            this.$utils.showError(`您已选择了监事会主席，不能选择该职务`);
          } else if (value === 70 && keys.includes(80)) {
            this.$utils.showError(`您已选择了监事（职工代表），不能选择该职务`);
          } else if (value === 80 && keys.includes(70)) {
            this.$utils.showError(`您已选择了监事，不能选择该职务`);
          } else if (keys.includes(20)) {
            this.$utils.showError(`您已选择了董事长，不能选择该职务`);
          } else if (keys.includes(30)) {
            this.$utils.showError(`您已选择了副董事长，不能选择该职务`);
          } else if (keys.includes(40)) {
            this.$utils.showError(`您已选择了董事，不能选择该职务`);
          } else if (keys.includes(50)) {
            this.$utils.showError(`您已选择了董事（职工代表），不能选择该职务`);
          } else {
            this.memberForm.jobs[index].id = value;
            this.memberForm.jobs[index].name = name;
          }
          break;
        case 20:
        case 30:
          if (keys.includes(60)) {
            this.$utils.showError(`您已选择了监事会主席，不能选择该职务`);
          } else if (keys.includes(80)) {
            this.$utils.showError(`您已选择了监事（职工代表），不能选择该职务`);
          } else if (keys.includes(70)) {
            this.$utils.showError(`您已选择了监事，不能选择该职务`);
          } else if (value === 30 && keys.includes(20)) {
            this.$utils.showError(`您已选择了董事长，不能选择该职务`);
          } else if (value === 20 && keys.includes(30)) {
            this.$utils.showError(`您已选择了副董事长，不能选择该职务`);
          } else if (keys.includes(40)) {
            this.$utils.showError(`您已选择了董事，不能选择该职务`);
          } else {
            this.memberForm.jobs[index].id = value;
            this.memberForm.jobs[index].name = name;
          }
          break;
        case 40:
        case 50:
          if (keys.includes(60)) {
            this.$utils.showError(`您已选择了监事会主席，不能选择该职务`);
          } else if (keys.includes(80)) {
            this.$utils.showError(`您已选择了监事（职工代表），不能选择该职务`);
          } else if (keys.includes(70)) {
            this.$utils.showError(`您已选择了监事，不能选择该职务`);
          } else if (keys.includes(20)) {
            this.$utils.showError(`您已选择了董事长，不能选择该职务`);
          } else if (keys.includes(30)) {
            this.$utils.showError(`您已选择了副董事长，不能选择该职务`);
          } else if (value === 50 && keys.includes(40)) {
            this.$utils.showError(`您已选择了董事，不能选择该职务`);
          } else if (value === 40 && keys.includes(50)) {
            this.$utils.showError(`您已选择了董事（职工代表），不能选择该职务`);
          } else {
            this.memberForm.jobs[index].id = value;
            this.memberForm.jobs[index].name = name;
          }
          break;
        default: // 其余职务不冲突，直接赋值
          this.memberForm.jobs[index].id = value;
          this.memberForm.jobs[index].name = name;
          break;
      }
    },
    // 配置任免方式，有index单个，没index所有
    handleSetWays(index, value) {
      const way1 = ["任命", "委派"];
      const way2 = ["聘任", "指定", "选举"];
      const way3 = ["选举"];
      // const institutions1 = ['股东'] // 股东会（股东）
      // const institutions3 = ['股东会全体', '股东会所持表决权2/3', '股东会所持表决权过半']
      // const institutions4 = ['董事会全体', '董事会人数超过2/3', '董事会人数超过过半']
      // const institutions5 = ['职工代表大会']
      // const institutions6 = ['监事会人数过半选举']
      const institutions1 = [
        {
          label: "股东",
          value: "股东会（股东）",
        },
        {
          // 06-13 房县优化-新增“股东会”选项
          label: "股东会（全体）",
          value: "股东会全体",
        },
      ];

      const institutions2 = [
        {
          label: "执行董事",
          value: "其他",
        },
        {
          label: "股东",
          value: "股东会（股东）",
        },
      ];
      const institutions3 = [
        {
          label: "股东会（全体）",
          value: "股东会全体",
        },
        {
          label: "股东会所持表决权2/3",
          value: "股东会所持表决权2/3",
        },
        {
          label: "股东会所持表决权过半",
          value: "股东会所持表决权过半",
        },
      ];
      const institutions4 = [
        {
          label: "董事会全体",
          value: "董事会全体",
        },
        {
          label: "董事会人数超过2/3",
          value: "董事会人数超过2/3",
        },
        {
          label: "董事会人数超过过半",
          value: "董事会人数超过过半",
        },
      ];
      const institutions5 = [
        {
          label: "职工代表大会",
          value: "职工代表大会",
        },
      ];
      const institutions6 = [
        {
          label: "监事会人数过半选举",
          value: "监事会人数过半选举",
        },
      ];
      if (index >= 0) {
        switch (value) {
          case 10: // 法定代表人
          case 45: // 执行董事
          case 70: // 监事
          case 40: // 董事
            // 06-13 房县优化-执行董事新增“选举”
            if (+value === 45) {
              way1.push("选举");
            }
            // 09-21
            if (+value === 70) {
              way2.push("委派");
              way3.push("委派");
            }
            if (this.companyType === "一人有限责任公司") {
              if (this.memberForm.investors) {
                // 一人股东且是投资人
                this.memberForm.jobs[index].waysList = way1;
                this.memberForm.jobs[index].ways = "委派";
              } else {
                // 一人股东不是投资人
                this.memberForm.jobs[index].waysList = way2;
                this.memberForm.jobs[index].ways = "委派";
              }
              // 一人股东，任免机构只有股东会（股东）
              this.memberForm.jobs[index].institutionsList = institutions1;
              this.memberForm.jobs[index].institutions = "股东会（股东）";
            } else {
              if (this.memberForm.investors) {
                // 多人股东且是投资人
                this.memberForm.jobs[index].waysList = way3;
                this.memberForm.jobs[index].ways = "选举";
              } else {
                // 多人股东且不是投资人
                this.memberForm.jobs[index].waysList = way2;
                this.memberForm.jobs[index].ways = "聘任";
              }
              // 多人股东，股东大会
              this.memberForm.jobs[index].institutionsList = institutions3;
              this.memberForm.jobs[index].institutions = "股东会全体";
            }
            break;
          case 85: // 经理
            // 06-13 房县优化-经理去除”选举“
            way2.splice(-1);
            this.memberForm.jobs[index].waysList = way2;
            this.memberForm.jobs[index].ways = "聘任";
            // 一人股东任免方式只有执行董事
            if (this.companyType === "一人有限责任公司") {
              if (this.form.directors) {
                this.memberForm.jobs[index].institutionsList = institutions4;
                this.memberForm.jobs[index].institutions = "董事会全体";
              } else {
                this.memberForm.jobs[index].institutionsList = institutions2;
                this.memberForm.jobs[index].institutions = "其他";
              }
            } else {
              // 多人股东
              if (this.form.directors) {
                // 如果有董事会,则以董事会选项为准
                this.memberForm.jobs[index].institutionsList = institutions4;
                this.memberForm.jobs[index].institutions = "董事会全体";
              } else {
                this.memberForm.jobs[index].institutionsList = institutions3;
                this.memberForm.jobs[index].institutions = "股东会全体";
              }
            }

            break;
          case 20: // 董事长
          case 30: // 副董事长
          case 50: // 董事（职工代表）
          case 60: // 监事会主席
          case 80: // 监事（职工代表）
            this.memberForm.jobs[index].waysList = way3;
            this.memberForm.jobs[index].ways = "选举";
            if (value === 50 || value === 80) {
              this.memberForm.jobs[index].institutionsList = institutions5;
              this.memberForm.jobs[index].institutions = "职工代表大会";
            } else if (value === 60) {
              this.memberForm.jobs[index].institutionsList = institutions6;
              this.memberForm.jobs[index].institutions = "监事会人数过半选举";
            } else {
              this.memberForm.jobs[index].institutionsList = institutions4;
              this.memberForm.jobs[index].institutions = "董事会全体";
            }
            break;
          default:
            break;
        }
      }
    },
    // 切换是否投资人按钮
    handleChangeRadio(value) {
      this.handleChangeBtn(value);
      // const way1 = ['任命', '委派']
      // const way2 = ['聘任']
      // const way3 = ['选举']
      // this.memberForm.jobs.forEach(item => {
      //   switch (item.id) {
      //     case 10: // 法定代表人
      //     case 45: // 执行董事
      //     case 70: // 监事
      //     case 40: // 董事
      //       if (this.companyType === '一人有限责任公司' && this.memberForm.investors) { // 一人股东且是投资人
      //         item.waysList = way1
      //         item.ways = '任命'
      //       } else if (this.companyType === '一人有限责任公司' && !this.memberForm.investors) { // 一人股东不是投资人
      //         item.waysList = way2
      //         item.ways = '聘任'
      //       } else if ((this.companyType === '有限责任公司（自然人投资或控股）' || this.companyType === '股份有限公司（非上市）') && this.memberForm.investors) { // 多人股东且是投资人
      //         item.waysList = way3
      //         item.ways = '选举'
      //       } else if ((this.companyType === '有限责任公司（自然人投资或控股）' || this.companyType === '股份有限公司（非上市）') && !this.memberForm.investors) { // 多人股东且不是投资人
      //         item.waysList = way2
      //         item.ways = '聘任'
      //       }
      //       break
      //     default:
      //       break
      //   }
      // })
      this.memberForm.jobs.forEach((item, index) => {
        this.handleSetWays(index, item.id);
      });
    },
    // 判断按钮是否禁用
    handleChangeBtn(value) {
      if (value && this.memberForm.investorsList.length) {
        // 是投资人且有出资方式
        this.disabled = false;
      } else if (value && !this.memberForm.investorsList.length) {
        // 是投资人且没有出资方式
        this.disabled = true;
      } else if (!value && !this.memberForm.jobs.length) {
        // 不是投资人且职务列表为空
        this.disabled = true;
      } else if (!value && this.memberForm.jobs.length) {
        // 不是投资人且有职务列表
        this.disabled = false;
      }
    },
    // 添加人员成功以后重置数据
    handleReset() {
      this.disabled = true; // 禁用添加按钮
      this.jobsList = []; // 重置职务列表
      this.editIndex = -1; // 重置编辑下标
      this.memberForm = {
        idcName: "", // 人员姓名或企业名称
        idcType: "", // 证件类型
        idcNumber: "", // 证件号码
        idAddress: "", // 自然人证件地址
        legalName: "", // 法人姓名
        legalIdType: "身份证", // 法人证件类型
        legalIdNumber: "", // 法人证件号码
        sex: "", // 性别
        nation: "汉族", // 民族
        front: "", // 自然人身份证人像面
        back: "", // 自然人身份证背面
        licensePic: "", // 法人营业执照照片
        phone: "", // 自然人或法人移动电话
        investors: false, // 是否投资人
        type: "", // 股东类型（自然人股东、法人股东）
        investorsList: [
          {
            // 投资人列表
            way: "货币", // 自然人或法人出资方式
            currency: "人民币", // 币种
            money: "", // 自然人或法人出资金额,支持小数点后3位
          },
        ],
        time: "", // 自然人或法人出资时间
        jobs: [
          // { // 自然人人员职务
          //   id: '', // 职务名称ID
          //   name: '', // 职务名称(显示项)
          //   ways: '', // 任免方式
          //   nationality: '中国', // 国籍
          //   institutions: '', // 任免机构
          //   waysList: [], // 该职务任免方式选项
          //   institutionsList: [] // 该职务任免机构选项
          // }
        ],
      };
    },
    // 人员排序，按id
    sort(arr) {
      arr.sort((a, b) => {
        return a.id - b.id;
      });
      return arr;
    },
    handleGetCount() {
      const currentCount = {
        // 初始化人数避免报错
        法定代表人: 0,
        经理: 0,
        执行董事: 0,
        财务负责人: 0,
        联络员: 0,
        "经办人/委托代理人": 0,
        监事会主席: 0,
        监事: 0,
        "监事（职工代表）": 0,
        董事长: 0,
        副董事长: 0,
        董事: 0,
        "董事（职工代表）": 0,
      };
      this.form.memberList.forEach((item) => {
        if (item.jobs.length) {
          // 校验自然人职务人数
          item.jobs.forEach((val) => {
            if (currentCount[val.name]) {
              currentCount[val.name] += 1;
            } else {
              currentCount[val.name] = 1;
            }
          });
        }
      });
      return currentCount;
    },
    //校验
    async checkUser() {
      let title = this.$utils.getLocalItem("modaltitle");
      let type = this.$utils.setLocalItem("tabType");
      if (title == "内资企业辅助开办" && type == "法人") {
        let data = {
          cerno: this.memberForm.idcNumber,
          uniscid: memberForm.legalIdNumber,
        };
        await this.checkIfOnePerson(data);
      }
      this.checkIfLaoLai();
      this.checkIfBlack();
    },
    handlecheck() {
      this.disabled = false;
      this.checkUser();
    },
    checkIfOnePerson(data) {
      checkIfOnePerson(data).then((res) => {
        let message = JSON.parse(res.message);
        if (message.code == 200) {
          this.oneflag = true;
          this.disabled = true;
          this.$utils.showError("一人有限公司无法添加股东");
        }
      });
    },
    checkIfBlack() {
      let params = {
        cerno: this.memberForm.idcNumber || this.memberForm.legalIdNumber,
      };
      checkIfBlack(params).then((res) => {
        let message = JSON.parse(res.message);
        if (message.code == 200) {
          this.blackflag = true;
          this.disabled = true;
          this.$utils.showError("该自然人存在黑名单中，无法添加");
        }
      });
    },
    checkIfLaoLai() {
      let params = {
        cerno: this.memberForm.idcNumber || this.memberForm.legalIdNumber,
      };
      checkIfLaoLai(params).then((res) => {
        let message = JSON.parse(res.message);
        if (message.code == 200) {
          this.llflag = true;
          this.disabled = true;
          this.$utils.showError("该自然人存在老赖名单中，无法添加");
        }
      });
    },
    // 确认添加人员
    handleAddMember(type) {
      let bool = true;
      if (window.location.href.includes("192.168.114")) {
        this.memberForm.back = "d73100ee37244672b90f82fe722301c9.jpg";
        this.memberForm.front = "d73100ee37244672b90f82fe722301c9.jpg";
      }


      const memberForm = this.memberForm;
      memberForm.investorsList.forEach((item) => {
        if (!item.way) {
          bool = false;
          return this.$utils.showError("请选择出资方式");
        }
        if (!item.money && memberForm.investors && memberForm.investorsList.length > 0) {
          bool = false;
          return this.$utils.showError("请填写认缴出资额");
        }
        if (item.money) {
          if (Number(item.money) > 10000) {
            return this.$utils.showError("认缴出资额上限：10000万元");
          }
          const obj = {
            value: String(item.money),
          };
          if (obj.value.indexOf(".") >= 0) {
            // 判断是否有小数点
            // console.log('小数点位置' + obj.value.indexOf('.'))
            // 小数点前9位
            if (obj.value.substring(0, obj.value.indexOf(".")).length > 12) {
              bool = false;
              return this.$utils.showError(
                "请填写正确的注册资本（金额整数不能超过12位，小数部分不能超过6位）"
              );
            }
            // 小数点后六位
            if (
              obj.value.substring(obj.value.indexOf(".") + 1, obj.value.length)
                .length > 6
            ) {
              bool = false;
              return this.$utils.showError(
                "请填写正确的注册资本（金额整数不能超过12位，小数部分不能超过6位）"
              );
            }
          }
          // 不存在小数点
          if (obj.value.indexOf(".") < 0) {
            if (obj.value.length > 12) {
              bool = false;
              return this.$utils.showError(
                "请填写正确的注册资本（金额整数不能超过12位，小数部分不能超过6位）"
              );
            }
          }
        }
      });
      if (!bool) {
        return false;
      }
      // 过滤完以后做非空校验
      if (
        type === "showNaturalDialog" &&
        !window.location.href.includes("192.168.114")
      ) {
        if (!memberForm.idcName) {
          // 人员姓名
          return this.$utils.showError("请填写人员姓名");
        } else if (!memberForm.phone) {
          return this.$utils.showError("请填写移动电话");
        } else if (!this.$utils.regExp("phone", memberForm.phone)) {
          return this.$utils.showError("移动电话格式不正确");
        } else if (!memberForm.idcNumber) {
          return this.$utils.showError("请填写证件号码");
          // } else if (memberForm.idcType === '身份证' && !this.$utils.regExp('idCard', memberForm.idcNumber)) {
          // return this.$utils.showError('身份证格式不正确')
        }
        else if (
          memberForm.legalIdType === "身份证" &&
          !this.$utils.validIdcNumber(memberForm.idcNumber)
        ) {
          // this.validIdcNumber(memberForm.legalIdNumber)
          return this.$utils.showError("身份证格式不正确");
        } else if (!memberForm.idAddress) {
          return this.$utils.showError("请填写证件地址");
        } else if (!memberForm.front) {
          return this.$utils.showError("请上传身份证人像面");
        } else if (!memberForm.back) {
          return this.$utils.showError("请上传身份证人像背面");
        } else if (!this.validateFront && !this.dzform.base64DownPhoto) {
          return this.$utils.showError("身份证人像面识别失败，请重新上传!");
        } else if (!this.validateBack && !this.dzform.base64UpPhoto) {
          return this.$utils.showError(
            "身份证国徽面识别失败或已过有效期，请重新上传!"
          );} 
        else if (memberForm.investors && !memberForm.investorsList.length) {
          // 是投资人且没填出资方式
          return this.$utils.showError("请添加投资方式");
        } else if (memberForm.investors && !memberForm.time) {
          // 是投资人且没填出资时间
          return this.$utils.showError("请选择出资时间");
        } else if (memberForm.investors && memberForm.investorsList.length) {
          // 是投资人且有出资方式
          let bool = true;
          memberForm.investorsList.forEach((item) => {
            if (!item.way) {
              bool = false;
              return this.$utils.showError("请选择出资方式");
            }
            if (!item.money) {
              bool = false;
              return this.$utils.showError("请填写认缴出资额");
            }
            if (item.money) {
              if (Number(item.money) > 10000) {
                return this.$utils.showError("认缴出资额上限：10000万元");
              }
              const obj = {
                value: String(item.money),
              };
              if (obj.value.indexOf(".") >= 0) {
                // 判断是否有小数点
                // console.log('小数点位置' + obj.value.indexOf('.'))
                // 小数点前9位
                if (
                  obj.value.substring(0, obj.value.indexOf(".")).length > 12
                ) {
                  bool = false;
                  return this.$utils.showError(
                    "请填写正确的注册资本（金额整数不能超过12位，小数部分不能超过6位）"
                  );
                }
                // 小数点后六位
                if (
                  obj.value.substring(
                    obj.value.indexOf(".") + 1,
                    obj.value.length
                  ).length > 6
                ) {
                  bool = false;
                  return this.$utils.showError(
                    "请填写正确的注册资本（金额整数不能超过12位，小数部分不能超过6位）"
                  );
                }
              }
              // 不存在小数点
              if (obj.value.indexOf(".") < 0) {
                if (obj.value.length > 12) {
                  bool = false;
                  return this.$utils.showError(
                    "请填写正确的注册资本（金额整数不能超过12位，小数部分不能超过6位）"
                  );
                }
              }
            }
          });
          if (!bool) {
            return false;
          }
        } else if (!memberForm.investors && !memberForm.jobs.length) {
          // 不是投资人且没有职务
          return this.$utils.showError("请添加职务");
        } else if (memberForm.jobs.length) {
          let bool = true;
          memberForm.jobs.forEach((item) => {
            if (!item.id) {
              bool = false;
              this.$utils.showError("请选择职务名称");
            }
          });
          if (!bool) {
            return false;
          }
        }
      } else if (
        type === "showLegalDialog" &&
        !window.location.href.includes("192.168.114")
      ) {
        if (!memberForm.idcName) {
          // 人员姓名
          return this.$utils.showError("请填写公司名称");
        } else if (!memberForm.idcNumber) {
          return this.$utils.showError("请填写统一社会信用代码");
        } else if (!memberForm.licensePic) {
          return this.$utils.showError("请上传营业执照");
        } else if (!memberForm.legalName) {
          return this.$utils.showError("请填写法定代表人姓名");
        } else if (!memberForm.phone) {
          return this.$utils.showError("请填写法定代表人移动号码");
        } else if (!this.$utils.regExp("phone", memberForm.phone)) {
          return this.$utils.showError("法定代表人移动号码格式不正确");
        } else if (!memberForm.legalIdNumber) {
          return this.$utils.showError("请填写法定代表人证件号码");
          // } else if (memberForm.legalIdType === '身份证' && !this.$utils.regExp('idCard', memberForm.legalIdNumber)) {
          // return this.$utils.showError('法定代表人身份证格式不正确')
        } else if (
          memberForm.legalIdType === "身份证" &&
          !this.$utils.validIdcNumber(memberForm.legalIdNumber)
        ) {
          return this.$utils.showError("法定代表人身份证格式不正确");
        } else if (!memberForm.time) {
          return this.$utils.showError("请选择出资时间");
        } else if (memberForm.investorsList.length) {
          let bool = true;
          memberForm.investorsList.forEach((item) => {
            if (!item.way) {
              bool = false;
              return this.$utils.showError("请选择出资方式");
            }
            if (!item.money) {
              bool = false;
              return this.$utils.showError("请填写认缴出资额");
            }
            if (
              !/^[1-9]\d{0,11}(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(item.money)
            ) {
              bool = false;
              return this.$utils.showError(
                "请填写正确的注册资本（金额整数不能超过12位，小数部分不能超过6位）"
              );
            }
            if (Number(item.money) > 10000) {
              return this.$utils.showError("认缴出资额上限：10000万元");
            }
          });
          console.log("俺啥都会凤凰山：", bool);
          if (!bool) {
            console.log("dshhhhh");
            return false;
          }
        } else if (!memberForm.investorsList.length) {
          return this.$utils.showError("请添加出资方式");
        }
      }
      // 校验自然人身份证和手机号
      if (this.filterGD(memberForm) === "idcNumber") {
        return this.$utils.showWarn("身份证已占用，请修改！");
      } else if (this.filterGD(memberForm) === "phone") {
        return this.$utils.showWarn("手机号已占用，请修改！");
      }
      // 校验人员是否未成年
      if (memberForm.idcType === "身份证") {
        const age = this.$utils.formatIdCard(memberForm.idcNumber, 3);
        if (+age < 18) {
          return this.$utils.showWarn(
            "该人员年龄未满18周岁，不可作为企业管理人员！"
          );
        }
      }
      if (type === "showNaturalDialog") {
        // 添加前自然人过滤多余人员和出资方式
        this.memberForm.jobs = this.memberForm.jobs.filter((item) => item.id);
        this.memberForm.investorsList = this.memberForm.investorsList.filter(
          (item) => item.way
        );
      }

      // 检查法定代表人是否设置兼任职位
      this.handleFdrAddJob();

      if (this.editIndex === -1) {
        // 新增
        this.form.memberList.push(this.memberForm);
      } else {
        // 编辑
        this.form.memberList.splice(this.editIndex, 1, this.memberForm);
      }
      if (type === "showNaturalDialog") {
        // 添加完成更新人员数量到data中
        this.currentCount = this.handleGetCount();
      }
      this.handleReset();
      this[type] = false;
    },


    async handleNext() {

      //判断登录名是否为自然人
      const userInfo=this.$utils.getLocalItem('userInfo')
      if (!this.form.memberList.some(item => item.idcName === userInfo.name)) {
        return this.$utils.showError(`登陆人 ${userInfo.name} 需担任至少一个职位`);
      }


      const names1 = [
        "法定代表人",
        "经理",
        "执行董事",
        "财务负责人",
        "联络员",
        "经办人/委托代理人",
        "监事",
      ]; // 无董事会无监事会
      const names2 = [
        "法定代表人",
        "经理",
        "财务负责人",
        "联络员",
        "经办人/委托代理人",
        "董事长",
        "监事",
      ]; // 有董事会无监事会
      const names3 = [
        "法定代表人",
        "经理",
        "执行董事",
        "财务负责人",
        "联络员",
        "经办人/委托代理人",
        "监事会主席",
        "监事",
      ]; // 无董事会有监事会
      const names4 = [
        "法定代表人",
        "经理",
        "财务负责人",
        "联络员",
        "经办人/委托代理人",
        "董事长",
        "监事会主席",
        "监事",
      ]; // 有董事会有监事会
      // 查出必须要有的职务缺少的部分
      let names = [];
      if (!this.form.directors && !this.form.visitors) {
        names = names1;
      } else if (this.form.directors && !this.form.visitors) {
        names = names2;
      } else if (!this.form.directors && this.form.visitors) {
        names = names3;
      } else if (this.form.directors && this.form.visitors) {
        names = names4;
      }
      for (const i in this.currentCount) {
        if (names.includes(i) && this.currentCount[i] === 0) {
          return this.$utils.showError(
            `至少要添加一个${i},请先添加后再进行下一步操作`
          );
        }
      }

      // visitors: false, // 是否设立监事会
      // directors: false, // 是否设立董事会
      const visitorsCount =
        parseInt(this.currentCount["监事"]) +
        parseInt(this.currentCount["监事会主席"]) +
        parseInt(this.currentCount["监事（职工代表）"]);

      const directorsCount =
        parseInt(this.currentCount["董事长"]) +
        parseInt(this.currentCount["副董事长"]) +
        parseInt(this.currentCount["董事"]) +
        parseInt(this.currentCount["董事（职工代表）"]);
      if (this.form.visitors && visitorsCount < 3) {
        return this.$utils.showError(`监事会总人数不得少于3个`);
      } else if (
        this.form.visitors &&
        this.currentCount["监事（职工代表）"] / visitorsCount < 1 / 3
      ) {
        return this.$utils.showError(
          "监事（职工代表）人数不得少于监事会总人数的1/3"
        );
      }
      if (this.form.directors && directorsCount < 3) {
        return this.$utils.showError("董事会总人数不得少于3个");
      }
      if (
        this.companyType === "有限责任公司（自然人投资或控股）" &&
        this.form.directors &&
        (directorsCount < 3 || directorsCount > 13)
      ) {
        // 有限责任公司设立董事会
        return this.$utils.showError("有限公司董事会人数应为3-13人");
      }
      if (
        this.companyType === "股份有限公司（非上市）" &&
        this.form.directors &&
        (directorsCount < 5 || directorsCount > 19)
      ) {
        // 股份有限公司设立董事会
        return this.$utils.showError("股份有限公司董事会人数应为5-19人");
      }
      const count = this.form.memberList.filter((item) => item.investors); // 股东人数
      if (
        this.companyType === "有限责任公司（自然人投资或控股）" &&
        (count.length < 2 || count.length >= 50)
      ) {
        return this.$utils.showError("有限公司股东人数应该大于1人且少于50人");
      }
      if (
        this.companyType === "股份有限公司（非上市）" &&
        (count.length <= 2 || count.length >= 200)
      ) {
        return this.$utils.showError(
          "股份有限公司股东人数应该大于2人且少于200人"
        );
      }
      if (this.companyType === "一人有限责任公司" && count.length === 0) {
        return this.$utils.showError("一人有限责任公司必须要一个股东");
      }
      if (this.companyType === "一人有限责任公司" && count.length > 1) {
        return this.$utils.showError("一人有限责任公司只能添加一个股东");
      }
      const nameApply = this.$utils.getItem("nameApply");
      let money = 0;
      this.form.memberList.forEach((item) => {
        if (item.investors) {
          item.investorsList.forEach((val) => {
            money = money + parseFloat(val.money);
          });
        }
      });
      if (nameApply.industryFormulated.indexOf("实业") > -1 && money < 10000) {
        return this.$utils.showWarn(
          "设立实业公司注册资金必须大于或等于1亿元！"
        );
      }
      let bool = true;
      const arrIndex = [];
      this.form.memberList.forEach((item, index) => {
        if (!item.investors && !item.jobs.length) {
          // 不是股东且没有职务
          bool = false;
          arrIndex.push(1 + index);
        }
      });
      if (bool) {
        // 可提交时把投资方式去掉
        // this.form.memberList.forEach(item => {
        //   if (!item.investors) { // 不是股东
        //     item.investorsList = []
        //   }
        // })
        await this.handleSaveDraft();
        this.$utils.setItem("member", this.form);
        // this.$utils.setItem('currentCount', this.currentCount)
        if (this.$route.query.whatfrom === "jointOffice") {
          // 一事联办，继续填写数据
          this.$router.push({
            path: "/form/personnel",
            query: { ...this.$route.query },
          });
          return;
        }
        this.$router.push({
          path: "/form/otherInfo",
          query: { ...this.$route.query },
        });
      } else {
        this.$utils.showError(
          `不是股东的人员必须拥有职务，请为第${arrIndex.join(
            "、"
          )}条人员数据添加职务！`
        );
      }
    },
    // 是否显示 任免方式、任免机构
    isShowFdrAddJob(item) {
      // 06-13 法代人不显示
      if (item.name === "法定代表人") {
        return true;
      }
      return false;
    },
    // 法代人兼任职务
    handleFdrAddJob() {
      const value = this.memberForm.fddbrJob;
      const jobs = this.memberForm.jobs;
      // 没选 法代 直接跳过
      if (!jobs.some((item) => item.id === 10)) {
        this.memberForm.fddbrJob = "";
        return false;
      }
      let flag = false;
      const jl = {
        id: 85, // 职务名称ID
        name: "经理", // 职务名称(显示项)
        ways: "聘任", // 任免方式
        nationality: "中国", // 国籍
        institutions: "执行董事", // 任免机构
      };
      const zxds = {
        id: 45, // 职务名称ID
        name: "执行董事", // 职务名称(显示项)
        ways: this.memberForm.investors ? "任命" : "聘任", // 任免方式
        nationality: "中国", // 国籍
        institutions: "股东", // 任免机构
      };
      switch (value) {
        case 10:
          // 经理
          flag = jobs.some((item) => item.id === 85);
          if (!flag) {
            this.memberForm.jobs.push(jl);
            this.handleSetWays(jobs.length - 1, 85);
          }
          break;
        case 20:
          // 执行董事
          flag = jobs.some((item) => item.id === 45);
          if (!flag) {
            this.memberForm.jobs.push(zxds);
            this.handleSetWays(jobs.length - 1, 45);
          }
          break;
        case 30:
          // 执行董事+经理
          flag = jobs.some((item) => item.id === 85);
          if (!flag) {
            this.memberForm.jobs.push(jl);
            this.handleSetWays(jobs.length - 1, 85);
          }
          flag = jobs.some((item) => item.id === 45);
          if (!flag) {
            this.memberForm.jobs.push(zxds);
            this.handleSetWays(jobs.length - 1, 45);
          }
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  padding-bottom: 15vh;
}

::v-deep .el-dialog__body {
  padding: 30px 45px;
}

::v-deep .el-table thead {
  color: #464646;
  font-weight: 600;
  font-size: 14px;
}

.member-form {
  .el-table::before {
    height: 0;
  }

  .box {
    width: 1200px;
    margin: 0 auto;

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
        margin-right: 5px;
      }
    }

    .form {
      padding-top: 35px;
      padding-top: 57px;

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

      .plain {
        border: 1px solid #3162e8;
        color: #3162e8;
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

        ::v-deep .el-radio__input.is-checked+.el-radio__label {
          color: #fff;
        }
      }

      .add-btn {
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
        // .el-button {
        //   margin-right: 26px;
        // }
      }

      .add-tips {
        font-size: 16px;
        font-weight: 500;
        color: #7f7e7e;
        text-align: center;
        padding-bottom: 25px;
      }

      .job-number {
        display: flex;
        height: 43px;
        align-items: center;

        span {
          flex: 0 0 23px;
          width: 23px;
          height: 23px;
          font-size: 14px;
          text-align: center;
          line-height: 23px;
          background: #e0ebff;
          color: #3162e8;
          border-radius: 50%;
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
          border: 1px solid #3162e8;
          color: #3162e8;

          &:last-child {
            color: #fff;
          }
        }
      }

      .pic-box {
        display: flex;

        .pic {
          width: 300px;
          height: 165px;
          border: 1px dashed #e0e0e0;
          border-radius: 8px;
          margin-right: 30px;

          .logo {
            width: 218px;
            margin: 18px auto 0 auto;

            img {
              width: 218px;
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
              color: #7f7e7e;
              margin-left: 4px;
            }
          }
        }
      }
    }

    .custom-title {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 40px;
      background: #f3f6fe;

      .label {
        flex: 1;
        font-size: 20px;
        font-weight: 600;
        color: #333333;
      }

      .close {
        font-size: 16px;
        font-weight: 500;
        color: #3162e8;
        cursor: pointer;
      }
    }

    ::v-deep .el-dialog__header {
      padding: 0;
    }

    ::v-deep .el-dialog__footer {
      text-align: center;
      padding-bottom: 40px;

      .el-button {
        width: 155px;
        height: 48px;
      }
    }
  }
}
</style>
