<template>
  <div class="address-form">
    <!-- <page-header /> -->
    <breadcrumb v-show="$route.query.mode !== 'test'" />
    <div class="box">
      <div class="title">{{ $route.meta.title }}</div>
      <el-form ref="form" label-position="left" class="form" :model="form" :rules="rules" label-width="94px">
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="form.companyName" :disabled="companyDisabled" placeholder="请填写企业名称" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item class="radio" label="是否使用住所（经营住所）自主申报" label-width="274px">
              <el-radio v-model="form.useAddress" :label="true" border @change="clearValidate">是</el-radio>
              <el-radio v-model="form.useAddress" :label="false" border @change="clearValidate">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="isShowXS && isAddress">
          <el-col :span="12">
            <el-form-item label="经营住所" prop="addressArea">
              <!-- <template v-if="!immovableDisable"></template> -->
              <el-cascader
                ref="addressArea"
                v-model="form.areaArr"
                :options="areaList"
                separator=" "
                disabled
                :props="{ expandTrigger: 'hover' }"
                placeholder="请选择行政区划"
                @change="handleChangeArea($event,'addressArea')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="showStreet" :span="4" style="padding-left: 0;padding-right: 0;">
            <el-form-item label-width="0" prop="addressAreaStreet">
              <el-select v-model="form.addressAreaStreetCode" placeholder="请选择街道" @change="handleChangeStreet($event,'addressArea')">
                <el-option
                  v-for="item in addressAreaStreetArr"
                  :key="item.code"
                  :label="item.table"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0" prop="address">
               <el-select
               v-if="$utils.getItem('area').label === '浠水县'"
                v-model="form.address"
                style="width: 300px;"
                filterable
                remote
                :remote-method="debounce(searchformquest,300,false)"
                class="area-select"
                placeholder="请输入关键词选择地址库中存在的地址"
                clearable
                @change="handleSelect"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="`${item.houseLocation}`"
                  :value="item"
                />
              </el-select>
              <el-select
                v-else
                v-model="form.address"
                style="width: 300px;"
                filterable
                remote
                :remote-method="debounce(searchformquest,300,false)"
                class="select"
                placeholder="请输入关键词"
                clearable
                @change="handleSelect"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="`${item.houseLocation}`"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="isShowXS" type="flex" align="middle">
          <el-col :span="10">
              <div style="margin-bottom: 22px;color: red;"> 提醒：标准地址库中是否有您的经营地址。</div>
          </el-col>
          <el-col :span="14">
            <el-form-item class="radio"  label-width="">
              <el-radio v-model="isAddress" :label="true" border @change="clearValidate1">是</el-radio>
              <el-radio v-model="isAddress" :label="false" border @change="clearValidate1">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="companyType === '个体工商户'">
          <el-col :span="12">
            <el-form-item class="radio" label="仅使用网络地址经营" label-width="180px" required>
              <el-radio v-model="form.isNetwork" :label="true" border @change="clearValidate">是</el-radio>
              <el-radio v-model="form.isNetwork" :label="false" border @change="clearValidate">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col v-if="form.isNetwork" :span="12">
            <el-form-item label-width="0" class="site-btn">
              <el-button @click="handleAddSite">添加网络地址</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <template v-if="companyType === '个体工商户' && form.isNetwork">
            <div v-for="(item,index) in form.networkAddress" :key="index">
              <el-col :span="10">
                <el-form-item
                  label="平台名称"
                  :prop="'networkAddress.' + index + '.name'"
                  :rules="{
                    required: true, message: '请填写平台名称', trigger: 'blur'
                  }"
                >
                  <el-input v-model="item.name" style="width: 221px;" placeholder="请填写平台名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="padding-right: 0;">
                <el-form-item
                  label="平台网址"
                  :prop="'networkAddress.' + index + '.site'"
                  :rules="{
                    required: true, message: '请填写平台网址', trigger: 'blur'
                  }"
                >
                  <el-input v-model="item.site" placeholder="请填写平台网址" />
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: right;">
                <el-button type="text" @click="handleDelSite(index)">删除</el-button>
              </el-col>
            </div>
          </template>
          <template v-else>
            <el-col :span="12">
              <el-form-item label="房屋业主" prop="ownerName">
                <el-input v-model="form.ownerName" placeholder="请填写房屋提供者名称" @blur="inquireImmovableInfo" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业主手机" prop="ownerPhone">
                <el-input v-model="form.ownerPhone" maxlength="11" placeholder="请填写业主手机" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="(不动产)产权证号/土地使用权证号" prop="rightNumber" label-width="264px">
                <el-input :disabled="Boolean(isShowXS && isAddress  && form.address  && form.rightNumber)" v-model="form.rightNumber" placeholder="鄂（20xx）xx市不动产权第xxxxxxx号" @blur="inquireImmovableInfo" />
              </el-form-item>
            </el-col>
            <el-col v-if="immovableDisable" :span="24">
              <el-form-item label="业主身份证号/企业信用代码" prop="certificateHolderCode" label-width="225px">
                <el-input v-model="form.certificateHolderCode" maxlength="18" placeholder="请填写业主身份证号/企业信用代码" @blur="addressTrust" />
              </el-form-item>
            </el-col>
            <template v-if="!(isShowXS && isAddress)">
              <el-col :span="12">
                <el-form-item label="经营住所" prop="addressArea">
                  <!-- <template v-if="!immovableDisable"></template> -->
                  <el-cascader
                    ref="addressArea"
                    v-model="form.areaArr"
                    :options="areaList"
                    separator=" "
                    disabled
                    :props="{ expandTrigger: 'hover' }"
                    placeholder="请选择行政区划"
                    @change="handleChangeArea($event,'addressArea')"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="showStreet" :span="4" style="padding-left: 0;padding-right: 0;">
                <el-form-item label-width="0" prop="addressAreaStreet">
                  <el-select v-model="form.addressAreaStreetCode" placeholder="请选择街道" @change="handleChangeStreet($event,'addressArea')">
                    <el-option
                      v-for="item in addressAreaStreetArr"
                      :key="item.code"
                      :label="item.table"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item v-if="!syjkDisabled" label-width="0" prop="address">
                  <el-input   v-model="form.address" class="addr_textarea" placeholder-class="textarea" type="textarea" :disabled="!syjkAddress"  placeholder="请填写详细地址(无需输入省市区)" style="width: 255px;" />
                </el-form-item>
                <el-form-item v-else label-width="0" prop="address">
                  <el-input  v-model="form.address" class="addr_textarea" placeholder-class="textarea" type="textarea" :disabled="immovableDisable" placeholder="请填写详细地址(无需输入省市区)" style="width: 255px;" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="4"><span style="color: red;font-size:14px;">请填写详细经营地址</span></el-col> -->
            </template>
            <el-col :span="12">
              <el-form-item label="场所性质" prop="nature">
                <el-select  v-model="form.nature" :disabled="immovableDisable || Boolean(isShowXS && isAddress && form.address && form.nature)" placeholder="请选择场所性质">
                  <el-option
                    v-for="item in natures"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用方式" required  prop="useWay">
                <el-select v-model="form.useWay" placeholder="请选择使用方式">
                  <el-option
                    v-for="item in useWays"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="租赁的起止时间" required label-width="140px" v-if="this.form.useWay==='租赁'">
                <el-date-picker
                  v-model="dataTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  class="DATETIME"
                  >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="syjkDisabled_copy" label="产权面积(m²)12" prop="rightSize" label-width="120px">
                <el-input  v-model="form.rightSize"  maxlength="11" placeholder="请填写产权面积(m²)" />
              </el-form-item>
              <el-form-item v-else label="产权面积(m²)" prop="rightSize" label-width="120px">
                <el-input  v-model="form.rightSize" :disabled=" immovableDisable || Boolean(isShowXS && isAddress  && form.address && form.rightSize)" maxlength="11" placeholder="请填写产权面积(m²)" />
              </el-form-item>
            </el-col>
            <el-col v-if="!form.useAddress" :span="24">
              <el-form-item label="房屋使用证明（租赁合同或无偿使用证明）" label-width="330px" prop="instructions">
                <upload-code placement="bottom-start" alias="instructions" @update="updateFileList" />
                <upload-file :file-paths="form.instructions" />
              </el-form-item>
            </el-col>
          </template>
          <div v-if="form.addressConsistent && form.isNetwork">
              <el-col :span="16">
                <el-form-item label="营业执照登记地区" prop="productArea" label-width="180px">
                  <el-cascader
                    ref="productArea"
                    v-model="form.productAreaArr"
                    :options="areaList"
                    separator=" "
                    placeholder="请选择行政区划"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChangeArea($event,'productArea')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4" style="padding-left: 0;padding-right: 0;">
                <el-form-item label-width="0" prop="productAreaStreet">
                  <el-select v-model="form.productAreaStreetCode" placeholder="请选择街道" @change="handleChangeStreet($event,'productArea')">
                    <el-option
                      v-for="item in productAreaStreetArr"
                      :key="item.code"
                      :label="item.table"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
          </div>
          <el-col :span="24">
            <el-form-item class="radio" label="生产经营地与经营住所是否一致" label-width="244px">
              <el-radio v-model="form.addressConsistent" :label="true" border @change="clearValidate">是</el-radio>
              <el-radio v-model="form.addressConsistent" :label="false" border @change="clearValidate">否</el-radio>
            </el-form-item>
          </el-col>
          <template v-if="!form.addressConsistent">
            <div>
              <el-col :span="12">
                <el-form-item label="生产地址" prop="productAreaArr">
                  <el-cascader
                    ref="productArea"
                    v-model="form.productAreaArr"
                    :options="areaList"
                    separator=" "
                    placeholder="请选择行政区划"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChangeArea($event,'productArea')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4" style="padding-left: 0;padding-right: 0;">
                <el-form-item label-width="0" prop="productAreaStreet">
                  <el-select v-model="form.productAreaStreetCode" placeholder="请选择街道" @change="handleChangeStreet($event,'productArea')">
                    <el-option
                      v-for="item in productAreaStreetArr"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="0" prop="productAddress">
                  <!-- <el-input v-model="form.productAddress" :disabled="immovableDisable" placeholder="请填写详细地址" /> -->
                  <el-input v-model="form.productAddress" type="textarea" :autosize="{ minRows: 1.5}" :disabled="immovableDisable" placeholder="请填写详细地址" />
                </el-form-item>
              </el-col>
              <el-col v-if="!form.useAddress" :span="24">
                <el-form-item class="house-pic" label="房屋使用证明" label-width="126px" prop="productInstructions">
                  <upload-code placement="bottom-start" alias="productInstructions" @update="updateFileList" />
                  <upload-file :file-paths="form.productInstructions" />
                </el-form-item>
              </el-col>
            </div>
          </template>
          <template v-else>
            <div>
              <el-col v-if="form.isNetwork" :span="24">
                <el-form-item class="house-pic" label="平台相关证明" label-width="126px" prop="productInstructions">
                  <upload-code placement="bottom-start" alias="productInstructions" @update="updateFileList" />
                  <upload-file :file-paths="form.productInstructions" />
                </el-form-item>
              </el-col>
            </div>
          </template>
          <el-col v-if="$route.query.whatfrom === 'jointOffice'" :span="24">
            <el-form-item class="radio" label="是否外设仓库" label-width="126px">
              <el-radio v-model="form.warehouse" :label="true" border>是</el-radio>
              <el-radio v-model="form.warehouse" :label="false" border>否</el-radio>
            </el-form-item>
          </el-col>
          <template v-if="form.warehouse">
            <div>
              <el-col :span="12">
                <el-form-item label="外设仓库地址" prop="warehouseArea" label-width="126px">
                  <el-cascader
                    ref="warehouseArea"
                    v-model="form.warehouseAreaArr"
                    :options="areaList"
                    separator=" "
                    placeholder="请选择行政区划"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChangeArea($event,'warehouseArea')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="0" prop="warehouseAddress">
                  <el-input v-model="form.warehouseAddress" placeholder="请填写详细地址" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item class="house-pic" label="房屋使用证明" label-width="126px" prop="warehouseInstructions">
                  <upload-code placement="bottom-start" alias="warehouseInstructions" @update="updateFileList" />
                  <upload-file :file-paths="form.warehouseInstructions" />
                </el-form-item>
              </el-col>
            </div>
          </template>
          <el-col v-if="form.useAddress" :span="24" style="padding-top: 20px;">
            <div>
              <el-form-item label-width="0" class="promise text-center" prop="promise">
                <el-checkbox v-model="form.promise"><span style="color:#606266">本人知悉并同意执行</span><span class="link" @click="dialogTab=true">《住所（经营场所）信息申报承诺》</span></el-checkbox>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item class="btn-group text-center" label-width="0">
          <el-button @click="$router.go(0)">刷新当前页面</el-button>
          <el-button @click="handleSaveDraft(true)">暂存草稿</el-button>
          <el-button @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="handleNext" :disabled="!jgsFlag">下一步</el-button>
        </el-form-item>
      </el-form>

      <el-dialog :visible.sync="dialogTab" width="827px" :close-on-click-modal="false" :close-on-press-escape="false" class="name_dialog">
        <div class="dialog_wrap">
          <div slot="title" class="dialog_title">住所（经营场所）信息申报承诺</div>
          <div class="title2">您拟申请设立登记或住所(经营场所)变更登记。根据《企业住所(经营场所)信息申报承诺制管理办法》的规定，向登记机关申报下列住所(经营场所)登记信息，并郑重作出以下承诺：</div>
          <ul class="content">
            <li>
              <p>一、申报的住所(经营场所)登记信息</p>
              <p>如实填报住所（经营场所）详细地址、产权人(含共有人)、房屋(不动产)产权证号(或土地使用权证号)、产权性质、产权面积(㎡ )、使用方式等信息。</p>
            </li>
            <li>
              <p>二、对住所(经营场所)登记申报信息作如下承诺:</p>
              <p>1、已阅读并知悉《企业住所(经营场所)信息申报承诺制管理办法》的各项规定。</p>
              <p>2、申报的住所(经营场所)登记信息真实、准确、完整，不含虚假内容。已依法办理房屋租赁备案，并取得该房屋的合法使用权。</p>
              <p>3、申报的住所（经营场所）不属于市场主体住所（经营场所）禁设区域清单所列区域;不属于开发区管委会确定的不适用情形;申报的住所(经营场所)为邮政信函可送达地。</p>
              <p>4.申报登记的住所（经营场所）属合法建筑物，不在拆迁征收区域内，符合有关法律、法规、规章规定的作为市场主体住所（经营场所）的登记条件。</p>
              <p>5、法律、法规规定应当经有关部门批准方可作为住所 (经营场所)从事相关经营活动的，申报登记的住所（经营场所）与取得许可的经营地址完全一致，在取得许可证或批准文件前不开展相关经营活动。</p>
              <p>6、申报的住所（经营场所）为住宅性质的，已经在申报住所(经营场所)登记前征得有利害关系业主的同意，且保证做到“安全、环保、不扰民”。不得利用居民住宅从事易燃易爆、餐饮、娱乐、网吧、产生噪音或者异味的生产加工等经营活动。如存在扰民情形，将无条件消除不良影响或主动搬离，承担相应法律责任。</p>
              <p>7、申报登记的企业及其住所（经营场所）内不从事违法犯罪活动，否则承担相应法律责任。</p>
              <p>8、本承诺真实、合法，并承担因申报登记的住所（经营场所）信息虚假所产生的一切法律责任。</p>
            </li>
          </ul>

          <div class="text-center">
            <el-button type="primary" class="button" @click="dialogTab=false">已阅读，关闭</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import PageHeader from '@/components/PageHeader/index'
import Breadcrumb from '@/components/Breadcrumb/index'
import UploadFile from '@/components/UploadFile/camera'
import UploadCode from '@/components/UploadFile/uploadCode'
import { getStreet, verifyStreetAdress, trustAddress, trustAddressFromEcq, checkDisableAddress, xiShuiAddress,getImmovableInfo } from '@/api/index'
import { getPrefix, debounce } from '@/utils/index'
import axios from 'axios'
export default {
  components: {
    // PageHeader,
    Breadcrumb,
    UploadFile,
    UploadCode
  },
  data() {
    const { validateField } = this.$utils
    const validatePromise = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择承诺'))
      } else {
        callback()
      }
    }
    // 校验详细地址
    const verifyAdress = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写经营住所详细地址'))
      } else {
        verifyStreetAdress({ address: this.form.address, city: this.$utils.getItem('area').label }).then(res => {
          if (res.state !== 'successful') {
            this.$utils.showError(res.outData.msg)
            return
          }
          if (!res.outData.isTrue) {
            callback(res.outData.msg)
          }
          callback()
        })
      }
    }
    return {
      dataTime:'',//租赁的起止日期
      syjkDisabled:true,//十堰经开，茅箭区判断
      syjkDisabled_copy:false,//十堰经开，茅箭区判断
      syjkAddress:false,//十堰经开，茅箭区判断详细地址
      syjkarea:'',// 十堰经营场所详细地址

      isAddress: true,//是否选择地址库
      jgsFlag: true,
      baseInfo: {}, // 基础信息
      curArea: {}, // 当前地区数据
      companyType: '',
      dialogTab: false,
      showStreet: true, // 是否显示街道，如果没有街道则隐藏
      type: '',
      areaList: [], // 行政区划
      addressAreaStreetArr: [], // 经营住所街道列表
      productAreaStreetArr: [], // 生产地址街道列表
      companyDisabled: false, // 禁用公司名称
      natures: [
        '办公',
        '工业',
        '商业',
        '军产房',
        '住宅',
        '其他',
        '商住',
        '宅基地',
        '市场',
        '地下商业门面',
        '工业（一址多照）',
        '商业（一址多照）',
        '军产房（一址多照）',
        '住宅（11类直接登记）',
        '商住（一址多照）',
        '市场（一址多照）',
        '办公（一址多照）',
        '地下商业门面（一址多照）',
        '其他（一址多照）',
        '商务秘书公司（一址多照）'
      ],
      useWays: ['租赁', '自有', '无偿使用', '其他'],
      rules: {
        companyName: [
          { required: true, message: '请填写企业名称', trigger: 'change' }
        ],
        addressArea: [
          { required: true, message: '请选择经营住所行政区划', trigger: 'change' }
        ],
        addressAreaStreet: [
          { required: true, message: '请选择经营住所街道', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请填写经营住所详细地址', trigger: 'change' },
          { validator: verifyAdress, trigger: 'change' }
        ],
        instructions: [
          { type: 'array', required: true, message: '请上传经营住所房屋证明', trigger: 'blur' }
        ],
        ownerName: [
          { required: true, message: '请填写房屋业主名称', trigger: 'change' },
          { pattern: /[\u4e00-\u9fa5]/, message: '请填写中文字符' }
        ],
        ownerPhone: [
          { required: true, message: '请填写房屋业主手机', trigger: 'change' },
          { validator: validateField('mobile') }
        ],
        certificateHolderCode: [
          { required: true, message: '请填写业主身份证号/企业信用代码', trigger: 'blur' }
          // { pattern: /^[a-zA-Z0-9]*$/, message: '请按规范填写(不动产)产权证号/土地使用权证号', trigger: 'blur' }
        ],
        rightNumber: [
          { required: false, message: '请填写(不动产)产权证号/土地使用权证号', trigger: 'blur' }
          // { pattern: /^[a-zA-Z0-9]*$/, message: '请按规范填写(不动产)产权证号/土地使用权证号', trigger: 'blur' }
        ],
        rightSize: [
          { required: true, message: '请填写产权面积(m²)', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '产权面积必须为数字' }
        ],
        productArea: [
          { required: true, message: '请选择生产地址行政区划', trigger: 'change' }
        ],
        productAddress: [
          { required: true, message: '请填写生产地址', trigger: 'change' },
          { validator: validateField('houseNumber') }
        ],
        productInstructions: [
          { type: 'array', required: true, message: '请上传生产地址房屋使用证明', trigger: 'blur' }
        ],
        warehouseArea: [
          { required: true, message: '请选择生产地址行政区划', trigger: 'change' }
        ],
        warehouseAddress: [
          { required: true, message: '请填写生产地址', trigger: 'change' },
          { validator: validateField('houseNumber') }
        ],
        warehouseInstructions: [
          { type: 'array', required: true, message: '请上传生产地址房屋使用证明', trigger: 'blur' }
        ],
        promise: [
          { required: true, validator: validatePromise, trigger: 'blur' }
        ],
        nature: [{ required: true, message: '请选择场所性质', trigger: 'change' }]
      },
      form: {
        companyName: '', // 企业名称
        useAddress: false, // 是否使用住所（经营住所）自主申报
        addressConsistent: true, // 生产经营地与经营住所一致
        address: '', // 经营场所详细地址
        instructions: [], // 经营场所房屋证明
        addressArea: '', // 行政区划
        areaArr: [], // 经营场所行政区划数组
        addressAreaCode: '', // 行政区划代码
        addressAreaStreet: '', // 经营住所所在街道
        addressAreaStreetCode: '', // 经营住所街道编号
        nature: '办公', // 场所性质
        useWay: '租赁', // 使用方式
        rightNumber: '', // 产权证号
        rightSize: '', // 产权面积
        ownerName: '', // 房屋业主姓名
        ownerPhone: '', // 房屋业主电话
        certificateHolderCode: '', // 业主身份证号/企业信用代码
        isNetwork: false, // 是否使用网络地址
        networkAddress: [ // isNetwork为true时必传
          {
            name: '',
            site: ''
          }
        ],
        productAddress: '', // 生产地址
        productInstructions: [], // 生产地址房屋使用证明
        productArea: '', // 生产地址行政区划
        productAreaArr: [], // 生产地址行政区划数组
        productAreaCode: '', // 生产地址行政区划代码
        productAreaStreet: '', // 生产地址所在街道
        productAreaStreetCode: '', // 生产地址街道编号
        warehouse: false, // 是否外设仓库
        warehouseAddress: '', // 外设仓库地址
        warehouseInstructions: [], // 外设仓库房屋证明
        warehouseArea: '', // 外设仓库行政区划
        warehouseAreaArr: [], // 外设仓库行政区划数组
        warehouseAreaCode: '', // 外设仓库行政区划代码
        promise: false // 本人承诺自主申报经营地址符合法律法规相关要求
      },
      immovableList: [], // 不动产列表
      immovableDisable: false,
      isTrustAddress: false, // 是否调可信地址库
      options: [], // 浠水地址库数据
    }
  },
  created()
  {
    localStorage.removeItem('syjk')
    if (this.$utils.getItem('area').label === '十堰经济技术开发区'||this.$utils.getItem('area').label === '茅箭区') {
      this.syjkDisabled_copy = true
      }

  },
  updated()
  {
    if (this.$utils.getItem('area').label === '十堰经济技术开发区' ||this.$utils.getItem('area').label === '茅箭区') {
    this.form.address=this.$utils.getLocalItem('syjk')
    }
  },
  computed: {
    draftInfo() {
      return this.$store.state.draft.draftInfo
    },
    // 判断是哪个县
    isDistrict(){
      return this.$utils.getLocalItem('curArea').district
    },
    // 判断是否展示浠水地址库
    isShowXS(){
      let data = this.draftInfo.nameApply
      return this.isDistrict.includes('浠水') && this.form.useAddress && data && data.companyType !== '个体工商户'
    }
  },
  activated() {
    this.type = this.$route.query.type
    if (this.$utils.getLocalItem('baseInfo')) {
      this.baseInfo = this.$utils.getLocalItem('baseInfo')
    }
    if (this.$utils.getLocalItem('curArea')) {
      this.curArea = this.$utils.getLocalItem('curArea')
    }
    if (this.$utils.getItem('area').label === '十堰经济技术开发区' || this.$utils.getItem('area').label === '鄂城区'||this.$utils.getItem('area').label === '茅箭区') {
      // || this.$utils.getItem('area').label === '竹山县' || this.$utils.getItem('area').label === '竹溪县' || this.$utils.getItem('area').label === '郧西县' || this.$utils.getLocalItem('tId') === '2020II-500120573'
      this.immovableDisable = true
      // 将经开区的required变为true
      this.rules.rightNumber[0].required = true
      this.rules.rightSize[0].required = true
    }
    // 先赋值再拿名称申报的名称覆盖
    this.getAreaInfo().then(async () => {
      // 获取草稿详情
      if (this.$utils.getItem('draftNumber')) {
        this.$store.dispatch('draft/getDraftDetail', this.$utils.getItem('draftNumber')).then(async res => {
          if (res.address) {
            const addressForm = res.address
            if (addressForm.productAreaStreet) { // 生产地址含有街道信息
              await this.getStreet(addressForm.productAreaCode, 'productArea')
            }
            this.form = addressForm
          }
          if (res.nameApply) {
            if (res.nameApply.companyName) {
              this.form.companyName = res.nameApply.companyName
              this.companyDisabled = true
            }
            this.companyType = res.nameApply.companyType
          }
        })
      }
    })
  },
  
  methods: {
    debounce,
    searchformquest(val) {
      if (val) {
        this.$utils.showLoading({ text: '加载中' })
        // getDesc(val).then(res => {
        //   this.$utils.hideLoading()
        //   if (+res.errCode === 1 && res.outData) {
        //     this.options = res.outData.data
        //   }
        // })
        xiShuiAddress(val).then(res => {
          console.log(`%c%s`, `color:blue`, `[Debug] ~ getDescSJ ~ res`, res)
          this.$utils.hideLoading()
          if (+res.flag === 200 && res.data) {
            this.options = res.data
          }
        })
      }
    },
    // 选中地址库触发
    handleSelect(e){
      console.log(e)
      this.form.rightNumber = e.certificateNumber
      this.form.address = e.houseLocation
      this.form.nature = e.houseUse
      this.form.rightSize = e.area
    },
    //  切换是否自主申报
    clearValidate() {
      this.$refs['form'].clearValidate()
      if (this.$utils.getItem('area').label === '十堰经济技术开发区' || this.$utils.getItem('area').label === '鄂城区'||this.$utils.getItem('area').label === '茅箭区') {
        this.form.certificateHolderCode = ''
        // this.form.address = ''
        this.form.rightSize = ''
        if (!this.form.useAddress) {
          this.immovableDisable = false
          this.rules.rightNumber[0].required = false
          this.rules.rightSize[0].required = false
        } else {
          this.immovableDisable = true
          this.rules.rightNumber[0].required = true
          this.rules.rightSize[0].required = true
        }
      }
      if(this.$utils.getItem('area').label === '浠水县'){
        this.form.address = ''
        this.form.rightNumber = ''
        this.form.nature = ''
        this.form.rightSize = ''
      }
    },
    //  切换是否使用地址库
    clearValidate1(){
      this.form.address = ''
      this.form.rightNumber = ''
      this.form.nature = ''
      this.form.rightSize = ''
    },
    addressTrust() {
      if (this.$utils.getItem('area').label === '十堰经济技术开发区'||this.$utils.getItem('area').label === '茅箭区') {
        this.syjkDisabled=false
        this.addressTrustFromSy()
      }
      // else if (:disabled="immovableDisable") {
      //   this.addressTrustFromEcq()
      // }
    },
    addressTrustFromSy() {
      if (!this.form.certificateHolderCode) {
        return
      }
      this.isTrustAddress = false
      // 十堰标准地址库
      
      getImmovableInfo(this.form.certificateHolderCode, this.$utils.getItem('area').label,this.form.rightNumber).then(res => {
    // console.log(res)
    if (res.state !== 'successful') {
      this.$utils.showError(res.errMsg)
      this.form.address = ''
      this.form.nature = ''
      this.form.rightSize = ''
      this.immovableList = []
      return
    }
    this.immovableList = res.outData || []

    // this.syjkAddress=true
    // this.$set(this.form, 'address', res.outData.value)
    if(res.outData.hasOwnProperty('value')){
      this.form.address=res.outData.value
      this.$utils.setLocalItem('syjk',res.outData.value)
      this.inquireImmovableInfo()
    }else{
      this.$utils.showError('未查询到房产信息')
      this.form.address = ''
      this.form.nature = ''
      this.form.rightSize = ''
      this.immovableList = []
    }
    // this.form.address=JSON.parse(JSON.stringify(res.outData.value))

    // this.$set(this.form, "address", res.outData.value);  
    // console.log(this.$set);
    // this.$refs.addressInput.value = res.outData.value;
    // if (res.outData.hasOwnProperty('value')) {
    // this.inquireImmovableInfo()
    // } else {
    //   this.$utils.showError('未查询到房产信息')
    //   this.form.address = ''
    //   this.form.nature = ''
    //   this.form.rightSize = ''
    //   this.immovableList = []
    // }

  })
  // this.resetImmovableInfo()


      // trustAddress({ certificateHolderCode: this.form.certificateHolderCode,
      //   area: this.$utils.getItem('area').label }).then(res => {
      //   if (res.flag !== 200) {
      //     this.$utils.showError(res.data.errMsg)
      //     this.form.address = ''
      //     this.form.nature = ''
      //     this.form.rightSize = ''
      //     this.immovableList = []
      //     return
      //   }
      //   // this.immovableList = res.data || []
      //   // console.log(this.immovableList[0].address);
      //   // this.form.address=this.immovableList[0].address

        
      //   // console.log(this.form.address);
      //   if (this.immovableList.length > 0) {
      //     this.isTrustAddress = true
      //     this.inquireImmovableInfo()
      //   } else {
      //     this.inquireImmovableList()
      //   }
      // })
    },
    addressTrustFromEcq() {
      if (!this.form.certificateHolderCode || !this.form.rightNumber) {
        return
      }
      this.$utils.showLoading()
      // 鄂城区地址库
      trustAddressFromEcq({
        zjhm: this.form.certificateHolderCode,
        bdczh: this.form.rightNumber.replace('（', '(').replace('）', ')')
      }).then(res => {
        if (res.flag !== 200) {
          // this.$utils.showWarn('查询房产信息失败，请填写正确的产权证号')
          this.form.address = ''
          this.form.nature = ''
          this.form.rightSize = ''
          this.immovableList = []
          return
        }
        const { zl, mj, yt, czr } = res.data
        this.form.address = zl
        this.form.rightSize = mj
        this.form.nature = yt
        this.form.ownerName = czr
        // this.isTrustAddress = true
      }).finally(() => {
        this.$utils.hideLoading()
      })
    },


    resetImmovableInfo()
    {
      getImmovableInfo(this.form.certificateHolderCode, this.$utils.getItem('area').label,this.form.rightNumber).then(res => {
    console.log(res)
    if (res.state !== 'successful') {
      this.$utils.showError(res.errMsg)
      this.form.address = ''
      this.form.nature = ''
      this.form.rightSize = ''
      this.immovableList = []
      return
    }
    this.immovableList = res.outData || []
    // this.syjkAddress=true
    // this.$set(this.form, 'address', res.outData.value)
    this.form.address=res.outData.value
    this.$refs.addressInput.value = res.outData.value;
    // this.syjkarea=res.outData.value
    // console.log(this.form.address);
    // console.log(res.outData.value);
  })
    },
    // 查询该个人/企业下的不动产信息列表
    inquireImmovableList() {
      // if (!this.form.certificateHolderCode) {
      //   return
      // }
      // axios({
      //   withCredentials: true,
      //   method: 'POST',
      //   url: `${location.origin + getPrefix()}/v1/acceptance_platform/bizNum/queryImmovableInfo`,
      //   data: {
      //     certificateHolderCode: this.form.certificateHolderCode,
      //     area: this.$utils.getItem('area').label
      //   }
      // }).then(res => {
      //   // console.log('res.data', res.data)
      //   if (res.data.state !== 'successful') {
      //     this.$utils.showError(res.data.errMsg)
      //     this.form.address = ''
      //     this.form.nature = ''
      //     this.form.rightSize = ''
      //     this.immovableList = []
      //     return
      //   }
      //   this.immovableList = res.data.outData || []
      //   if (this.immovableList.length > 0) {
      //     this.inquireImmovableInfo()
      //   } else {
      //     this.$utils.showError('未查询到房产信息')
      //     this.form.address = ''
      //     this.form.nature = ''
      //     this.form.rightSize = ''
      //     this.immovableList = []
      //   }
      // })
      //   .catch(error => { // 请求失败处理
      //     console.log(error)
      //   })
      console.log(this.form.rightNumber);
      console.log(this.form.certificateHolderCode);
    getImmovableInfo(this.form.certificateHolderCode, this.$utils.getItem('area').label,this.form.rightNumber).then(res => {
    console.log(res)
    if (res.state !== 'successful') {
      this.$utils.showError(res.errMsg)
      this.form.address = ''
      this.form.nature = ''
      this.form.rightSize = ''
      this.immovableList = []
      return
    }
    this.immovableList = res.outData || []
    if (this.immovableList.length > 0) {
      this.inquireImmovableInfo()
    } else {
      this.$utils.showError('未查询到房产信息')
      this.form.address = ''
      this.form.nature = ''
      this.form.rightSize = ''
      this.immovableList = []
    }
  })
    },
    // 匹配该个人/企业下的不动产信息
    inquireImmovableInfo() {
      if(this.isShowXS && this.isAddress){ return }
      if (this.$utils.getItem('area').label === '鄂城区') {
        return this.addressTrustFromEcq()
      }
      if (!this.form.rightNumber || this.immovableList.length === 0 || !this.form.ownerName) {
        // this.form.address = ''
        // this.form.nature = '办公'
        // this.form.rightSize = ''
        return
      }
      const reg = /[\(]/g; const reg2 = /[\)]/g
      this.form.rightNumber = this.form.rightNumber.replace(reg, '（').replace(reg2, '）')
      let bool = true
      this.immovableList.forEach(element => {
        if (this.isTrustAddress) {
          if (element.propertyCertificateNum === this.form.rightNumber) {
            const nameBox = element.homeOwner.split('^')
            if (nameBox.includes(this.form.ownerName)) {
              this.form.address = element.street + element.address
              this.form.nature = element.natureOfPlace
              this.form.rightSize = element.propertyArea
              bool = false
            }
          } else {
            this.inquireImmovableList()
          }
        } else {
          element.forEach(item => {
            if ((item.certificateType === '不动产登记证明' || item.certificateType === '中华人民共和国不动产权证' || item.certificateType === '中华人民共和国不动产权证书') && item.certificateNumber === this.form.rightNumber) {
              const nameBox = item.certificateHolder.split('^')
              if (nameBox.includes(this.form.ownerName)) {
                item.surface.forEach(i => {
                  if (i.name === '坐落') this.form.address = i.value
                  if (i.name === '用途') this.form.nature = i.value
                  if (i.name === '面积') this.form.rightSize = i.value.split('/')[1].match(/\d+\.\d+/g)[0] || i.value.match(/\d+\.\d+/g)[0]
                  bool = false
                })
              }
            }
          })
        }
      })
      let index = 0
      if (this.form.address.includes('区')) {
        index = this.form.address.lastIndexOf('区')
      }
      if (this.form.address.includes('市')) {
        index = this.form.address.lastIndexOf('市')
      }
      if (this.form.address.includes('县')) {
        index = this.form.address.lastIndexOf('县')
      }
      if (!this.isTrustAddress) {
        this.form.address = this.form.address.substring(index + 1, this.form.address.length)
      }
      if (bool) {
        this.$utils.showError('未找到匹配的房产信息')
        this.form.address = ''
        this.form.nature = ''
        this.form.rightSize = ''
      }
    },

    // 保存草稿
    handleSaveDraft(showTips = false) {
      // console.log(this.form.address);
      return new Promise((resolve, reject) => {
        const data = {
          ...this.draftInfo, // 原有数据
          address: this.form, // 现在数据覆盖原有数据
          businessType: this.$route.query.type === 'person' ? '1' : '2',
          showTips // 是否显示提示
        }
        this.$store.dispatch('draft/saveDraft', data).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    getStreet(code, key) {
      this.$utils.showLoading()
      return new Promise(resolve => {
        getStreet(code).then(res => {
          this.$utils.hideLoading()
          console.log(this.addressAreaStreetArr,"addressAreaStreet1111111111Arr");
          this[`${key}StreetArr`] = res.outData.data
        if(this.$utils.getLocalItem('tId') === '2023II-ZW-HGHMX01'&&this.$utils.getItem("huangmei")==="黄梅餐饮"){
          this.addressAreaStreetArr= this.addressAreaStreetArr.filter(item=>{
            return item.table !== "黄梅镇(城南所)" && item.table !== "黄梅镇(城西所)" && item.table !== "黄梅镇(城北所)";
          })
        }
          console.log(this.addressAreaStreetArr,"addressAreaStreetArr");
          if (res.outData.data.length === 1) { // 只有一个街道，默认选中
            this.form[`${key}Street`] = res.outData.data[0].name
            this.form[`${key}StreetCode`] = res.outData.data[0].code
          }
          this.showStreet = !!res.outData.data.length
          if (this.$utils.getItem('area').label === '十堰经济技术开发区' || this.$utils.getItem('area').label === '郧西县' || this.$utils.getItem('area').label === '郧阳区' || this.$utils.getLocalItem('tId') === '2020II-500120573'||this.$utils.getItem('area').label === '茅箭区') {
            this.showStreet = false
          }
          resolve()
        })
      })
    },
    getAreaInfo() {
      return new Promise(resolve => {
        const params = {
          'inData': {},
          'job': 'HuBei_DistCode'
        }
        this.$utils.showLoading()
        this.$api.startJob(params).then(async res => {
        // 后续远程更新完十堰经济技术开发区再处理
          const areaCode = this.curArea.areaCode
          const areaLabel = this.curArea.areaLabel
          const area = this.$utils.getItem('area')
          const arr = res.outData.data.filter(item => item.label.trim() === this.curArea.city)
          console.log(`%c%s`, `color:blue`, `[Debug] ~ this.$api.startJob ~ arr`, arr)
          arr[0].children = arr[0].children.filter(item => item.label.trim() === area.label.trim())
          // if (arr[0].children[0].label === '市直属' ||
          // arr[0].children[0].label === '仙桃市' ||
          //  arr[0].children[0].label === '天门市' ||
          //  arr[0].children[0].label === '潜江市' ||
          //  arr[0].children[0].label === '神农架') {
          //   arr[0].children[0].label = ''
          // }

          //现在在经营住所中，将湖北去掉
          // this.areaList = [
          //   {
          //     value: '420000',
          //     label: '湖北省',
          //     children: arr
          //   }
          // ]
          this.areaList = [
            {
              value: '420000',
              label: '',
              children: arr
            }
          ]



          // if (arr[0].label !== '市直属' &&
          // arr[0].label !== '仙桃市' &&
          //  arr[0].label !== '天门市' &&
          //  arr[0].label !== '潜江市' &&
          //  arr[0].label !== '神农架') {
          //   areaLabel.push(area.label)
          // }
          areaLabel.push(area.label)
          areaCode.push(area.code)
          // console.log('areaList', this.areaList)
          // console.log('areaLabel', areaLabel)
          this.form.areaArr = areaCode // 地址码
          this.form.addressArea = areaLabel.join(' ') // 地址label
          this.form.addressAreaCode = areaCode[2] // 赋值中文以后赋值code
          // console.log(areaLabel)
          // console.log(areaCode)
          // console.log('addressArea', this.form.addressArea)
          // console.log('addressAreaCode', this.form.addressAreaCode)
          await this.getStreet(areaCode[2], 'addressArea')
          this.$utils.hideLoading()
          resolve()
        })
      })
    },
    // 选中街道
    handleChangeStreet(e, key) {
      const selected = this[`${key}StreetArr`].filter(item => item.code === e)
      if (selected.length) {
        this.form[`${key}Street`] = selected[0].name
        if(selected[0].authority == '') {
          this.$utils.showError('该街道无相对应监管所，请联系管理员')
          this.jgsFlag = false
        } else {
          this.jgsFlag = true
        }
      }
    },
    handleAddSite() {
      this.form.networkAddress.push({
        name: '',
        site: ''
      })
    },
    handleDelSite(index) {
      if (this.form.networkAddress.length > 1) {
        this.form.networkAddress.splice(index, 1)
      } else {
        this.$utils.showError('至少添加一个网络平台信息')
      }
    },
    // 更新扫码上传数据
    updateFileList(val) {
      console.log('扫码上传回调：', val)
      const arr = [
        ...this.form[val.type],
        ...val.data
      ]
      console.log('ssss:', arr)
      this.$set(this.form, val.type, arr)
    },
    // 修改省市区，获取街道信息
    handleChangeArea(value, key) {
      this.form[`${key}Code`] = value[2]
      this.form[key] = this.$refs[key].getCheckedNodes()[0].pathLabels.join(' ')
      this.form[`${key}Street`] = ''
      this.getStreet(value[2], key)
    },
    async handleNext() {
      if(this.form.useWay==="租赁"){
        if(!this.dataTime){
          return this.$utils.showError('请选择租赁的起止时间')
        }
        localStorage.setItem('dataTime',JSON.stringify(this.dataTime))
      }
      // 判断网络地址是否重复
      const ids = this.form.networkAddress.map(value => value.site)
      const idsSet = new Set(ids)
      if (idsSet.size !== ids.length) {
        this.$utils.showError('请填写网络经营地址不能相同')
        return
      }
      // 是否使用住所（经营住所）自主申报 值为true条件下的附加内容
      if (this.form.address) {
        if (this.form.useAddress) {
          if (this.form.address.includes('自主申报')) {
            console.log('有自主申报不需要在添加')
          } else this.form.address = this.form.address + '（自主申报）'
        }
      }

      if (this.$utils.getLocalItem('curArea').district === '硚口区' && this.form.address) {
        if (this.form.address.includes('（自主申报）')) {
          this.form.address = this.form.address.replace('（自主申报）', '')
        }
        // 校验禁用地址名单
        const data = {
          address: this.form.address,
          area: this.$utils.getLocalItem('curArea').district
        }
        const addressStatus = await checkDisableAddress(data)
        if (+addressStatus.flag === 500) {
          // return this.$utils.showError('该地址已被禁止使用，请更换地址')
          return
        }
      }

      if (!this.form.useAddress) {
        if (this.form.instructions.length <= 0) {
          return this.$utils.showError('请按提示信息补充完整表单！')
        }
      }

      this.$refs['form'].validate(async valid => {
        if (valid) {
          await this.handleSaveDraft()
          this.$utils.setItem('address', this.form)
          console.log(this.form)
          // return
          if (this.draftInfo.nameApply.companyType === '个体工商户') {
            this.$router.push({ path: '/form/member-self-employed', query: { ...this.$route.query }})
            return
          }
          this.$router.push({ path: '/form/member', query: { ...this.$route.query }})
        } else {
          this.$utils.showError('请按提示信息补充完整表单！')
        }
      })
    }
  },
  mounted() {
    console.log('this.$utils.getLocalItem', this.$utils.getLocalItem('scope') )
    console.log('this.$utils.getItem', this.$utils.getItem('scope') )
  }
}
</script>
<style lang='scss' scoped>
.address-form {
  .box {
    width: 800px;
    margin: 0 auto;
    .title {
      text-align: center;
      padding-top: 29px;
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      line-height: 40px;
    }
    .form {
      padding-top: 57px;
      ::v-deep .el-select,.el-cascader {
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
        .link {
          color: #025BFF;
          cursor: pointer;
        }
      }
      .site-btn {
        text-align:right;
        .el-button {
          width: 130px;
          height: 43px;
          padding: 0;
          box-sizing: border-box;
          text-align: center;
          border: 1px solid #3162E8;
          color: #3162E8;
        }
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
          background: #3162E8;
        }
        ::v-deep .el-radio__input.is-checked+.el-radio__label {
          color: #fff;
        }
      }
      .area-select  /deep/input::-webkit-input-placeholder,
      /deep/textarea::-webkit-input-placeholder {
        color: #F56C6C;
      }
     .area-select  /deep/input::-moz-input-placeholder,
      /deep/textarea::-moz-input-placeholder {
        color: #F56C6C;
      }
      .area-select  /deep/input::-ms-input-placeholder,
      /deep/textarea::-ms-input-placeholder {
        color: #F56C6C;
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
            color: #fff;
          }
        }
      }
    }
    .name_dialog .dialog_wrap{
      padding: 0 58px;
    }
    .name_dialog .dialog_title{
      font-size: 28px;
      color: #555;
      font-weight: bold;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .name_dialog .content{
      padding: 15px 0;
    }
    .name_dialog .content li{
      padding: 10px 0;
      font-size: 15px;
      list-style: none;
      line-height: 26px;
      text-indent: 2em;
      p {
        padding-top: 10px;
        line-height: 26px;
        &:first-child {
          font-weight: bold;
          font-size: 18px;
          line-height: 32px;
        }
      }
    }
    .name_dialog .title2{
      padding-top: 35px;
      font-size: 15px;
      color: #464646;
      margin-left: -8px;
      line-height: 26px;
      text-indent:2em;
    }
    .name_dialog .button{
      width: 155px;
      padding: 15px 0;
      text-align: center;
      border-radius: 4px;
      margin: 30px auto 15px;
      cursor: pointer;
    }
  }
}
.DATETIME{
  height: 41px;
}
.addr_textarea >>> .el-textarea__inner {
  padding-top: 11px;
}
</style>
