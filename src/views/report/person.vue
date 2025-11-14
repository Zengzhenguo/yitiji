<template>
  <div class="companyMessage">
    <!-- <PageHeader /> -->
    <div class="companyMessageMain">
      <div class="top">
        <div>AI辅助开办，智能秒批</div>
        <div>一表填报，智能辅助，轻松打照</div>
      </div>
      <Breadcrumb style="text-align:left;border-bottom:1px solid #ccc;margin-bottom:60px;" />
      <el-form ref="ruleForm" :model="form" :rules="rules" class="report_form">
        <p v-if="form['经营者名称']" style="color:red;font-size:15px;">*已自动填充上一年公示信息，请核准后再提交公示</p>
        <Caption title="基本信息" ></Caption>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" align="middle" class="obtainCountWarp">
              <p>年报年度</p>
              <el-form-item ref="年报年度" label="" prop="年报年度">
                <el-date-picker
                  v-model="form['年报年度']"
                  type="year"
                  :editable="false"
                  placeholder="请选择年报年度"
                  :picker-options="handleSetDisabled"
                  value-format="yyyy"
                >
                </el-date-picker>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" align="middle" class="obtainCountWarp">
              <p>个体名称</p>
              <el-form-item ref="个体名称" label="" prop="个体名称">
                <el-input disabled v-model.trim="form['企业名称']" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" align="middle" class="obtainCountWarp">
              <p>统一社会信用代码</p>
              <el-form-item ref="统一社会信用代码" label="" prop="统一社会信用代码">
                <el-input disabled v-model.trim="form['统一社会信用代码']" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" align="middle" class="obtainCountWarp">
              <p>经营者名称</p>
              <el-form-item ref="经营者姓名" label="" prop="经营者名称">
                <el-input v-model.trim="form['经营者名称']" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" align="middle" class="obtainCountWarp">
              <p>资金数额</p>
              <el-form-item ref="资金数额" label="" prop="资金数额">
                <el-input v-model="form['资金数额']" type="number" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" align="middle" class="obtainCountWarp">
              <p>联系电话</p>
              <el-form-item ref="联系电话" label="" prop="企业联系电话">
                <el-input v-model.trim="form['企业联系电话']" maxlength="11" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" align="middle" class="obtainCountWarp">
              <p>从业人数</p>
              <el-form-item ref="从业人数" label="" prop="从业人数">
                <el-input v-model="form['从业人数']" placeholder="请输入" clearable @blur="handleSetInt('从业人数')"></el-input>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>

        <Caption title="从业人数（其中）" ></Caption>
        <el-row type="flex" class="obtainCountWarp" align="middle">
          <el-col :span="6">
            <p class="label">其中高校毕业生人数（不公示）</p>
          </el-col>
          <el-col :span="9">
            <el-row class="obtainCount">
              经营者
              <el-form-item ref="高校毕业生经营者人数" class="other-clo" prop="高校毕业生经营者人数" size="mini">
                <el-input v-model="form['高校毕业生经营者人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('高校毕业生经营者人数')" size="mini"></el-input>
              </el-form-item>
                人；
            </el-row>
          </el-col>
          <el-col :span="9">
            <el-row class="obtainCount">
              雇员
                <el-form-item ref="高校毕业生雇员人数" class="other-clo" prop="高校毕业生雇员人数" size="mini">
                  <el-input v-model="form['高校毕业生雇员人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('高校毕业生雇员人数')" size="mini"></el-input>
                </el-form-item>
                人；
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" class="obtainCountWarp" align="middle">
          <el-col :span="6">
            <p class="label">其中退役士兵人数（不公示）</p>
          </el-col>
          <el-col :span="9">
            <el-row class="obtainCount">
              经营者
              <el-form-item ref="退役士兵经营者人数" class="other-clo" prop="退役士兵经营者人数" size="mini">
                <el-input v-model="form['退役士兵经营者人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('退役士兵经营者人数')" size="mini"></el-input>
              </el-form-item>
                人；
            </el-row>
          </el-col>
          <el-col :span="9">
            <el-row class="obtainCount">
              雇员
                <el-form-item ref="退役士兵雇员人数" class="other-clo" prop="退役士兵雇员人数" size="mini">
                  <el-input v-model="form['退役士兵雇员人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('退役士兵雇员人数')" size="mini"></el-input>
                </el-form-item>
                人；
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" class="obtainCountWarp" align="middle">
          <el-col :span="6">
            <p class="label">其中残疾人人数（不公示）</p>
          </el-col>
          <el-col :span="9">
            <el-row class="obtainCount">
              经营者
              <el-form-item ref="残疾人经营者人数" class="other-clo" prop="残疾人经营者人数" size="mini">
                <el-input v-model="form['残疾人经营者人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('残疾人经营者人数')" size="mini"></el-input>
              </el-form-item>
                人；
            </el-row>
          </el-col>
          <el-col :span="9">
            <el-row class="obtainCount">
              雇员
                <el-form-item ref="残疾人雇员人数" class="other-clo" prop="残疾人雇员人数" size="mini">
                  <el-input v-model="form['残疾人雇员人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('残疾人雇员人数')" size="mini"></el-input>
                </el-form-item>
                人；
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" class="obtainCountWarp" align="middle">
          <el-col :span="6">
            <p class="label">其中失业人员再就业人数（不公示）</p>
          </el-col>
          <el-col :span="9">
            <el-row class="obtainCount">
              经营者
              <el-form-item ref="失业人员再就业经营者人数" class="other-clo" prop="失业人员再就业经营者人数" size="mini">
                <el-input v-model="form['失业人员再就业经营者人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('失业人员再就业经营者人数')" size="mini"></el-input>
              </el-form-item>
                人；
            </el-row>
          </el-col>
          <el-col :span="9">
            <el-row class="obtainCount">
              雇员
                <el-form-item ref="失业人员再就业雇员人数" class="other-clo" prop="失业人员再就业雇员人数" size="mini">
                  <el-input v-model="form['失业人员再就业雇员人数']" type="number" placeholder="请输入" clearable @blur="handleSetInt('失业人员再就业雇员人数')" size="mini"></el-input>
                </el-form-item>
                人；
            </el-row>
          </el-col>
        </el-row>

        <Caption title="资产状况信息" ></Caption>

        <el-row type="flex" class="obtainCountWarp" align="middle">
          <p>营业额或营业收入</p>
          <el-form-item ref="营业额或营业收入" label="" prop="营业额或营业收入" size="mini" >
            <!-- <el-row :gutter="10" type="flex" > -->
              <!-- <el-col :span="12"> -->
                <el-input v-model="form['营业额或营业收入']" type="number" placeholder="请输入" clearable size="mini"></el-input>
              <!-- </el-col> -->
            <!-- </el-row> -->
          </el-form-item>
          <p>万元（人民币）</p>
          <el-radio v-model="form['营业额或营业收入是否公示']" label="公示">公示</el-radio>
          <el-radio v-model="form['营业额或营业收入是否公示']" label="不公示">不公示</el-radio>
        </el-row>
        <el-row type="flex" class="obtainCountWarp" align="middle">
          <p>纳税总额</p>
          <el-form-item ref="纳税总额" label="" prop="纳税总额" size="mini" >
            <!-- <el-row :gutter="10" type="flex" > -->
              <!-- <el-col :span="12"> -->
                <el-input v-model="form['纳税总额']" type="number" placeholder="请输入" clearable size="mini"></el-input>
              <!-- </el-col> -->
            <!-- </el-row> -->
          </el-form-item>
          <p>万元（人民币）</p>
          <el-radio v-model="form['纳税总额是否公示']" label="公示">公示</el-radio>
          <el-radio v-model="form['纳税总额是否公示']" label="不公示">不公示</el-radio>
        </el-row>


        <Caption title="网站或网店信息" ></Caption>

        <el-row class="obtainCountWarp" type="flex" align="middle">
          <p>是否有网站或网店</p>
          <el-form-item label="" size="mini">
            <el-radio v-model="form['是否有网站或网店']" label="是">是</el-radio>
            <el-radio v-model="form['是否有网站或网店']" label="否">否</el-radio>
          </el-form-item>
        </el-row>

        <template v-if="form['是否有网站或网店'] === '是'">
          <div v-for="(item,index) in form['网站或网店']" :key="'网站' + index">
            <!-- <div class="cell">
              <div>网站或网店 {{ 1 + index }}</div>
              <span class="del-btn" @click="handleDelField('网站或网店',index)">删除</span>
            </div> -->
            <!-- <el-form-item
              :ref="'网站或网店.' + index + '.网站或网店名称'"
              label="网站或网店名称"
              :prop="'网站或网店.' + index + '.网站或网店名称'"
              :rules="{
                required: true, message: '请输入网站或网店名称', trigger: 'blur'
              }"
            >
              <el-input v-model="item['网站或网店名称']" placeholder="请输入" clearable></el-input>
            </el-form-item> -->
            <el-row class="obtainCountWarp" type="flex" align="middle">
              <p>网站或网店网址</p> 
              <el-form-item
                :ref="'网站或网店.' + index + '.网站或网店网址'"
                label=""
                :prop="'网站或网店.' + index + '.网站或网店网址'"
                :rules="{
                  required: true, message: '请输入网站或网店网址', trigger: 'blur'
                }"
              >
                <el-input v-model="item['网站或网店网址']" placeholder="请输入" clearable></el-input>
              </el-form-item>
              <el-button v-if="!(form['网站或网店'].length == 1)" type="danger" icon="el-icon-delete"  @click="handleDelField('网站或网店',index)" circle></el-button>
              <el-button v-if="index == form['网站或网店'].length-1" type="primary" icon="el-icon-edit" @click="handleAddField('网站或网店')" circle></el-button>
            </el-row>
            <!-- <el-form-item
              :ref="'网站或网店.' + index + '.网站或网店类型'"
              label="网站或网店类型"
              :prop="'网站或网店.' + index + '.网站或网店类型'"
              :rules="{
                required: true, message: '请选择网站或网店类型', trigger: 'change'
              }"
            >
              <el-select v-model="item['网站或网店类型']" placeholder="请选择">
                <el-option label="网站" value="网站" />
                <el-option label="网店" value="网店" />
              </el-select>
            </el-form-item> -->
          </div>
          <!-- <div class="add-btn" @click="handleAddField('网站或网店')"></div> -->
        </template>



        <!-- <el-form-item label="企业经营状态" prop="企业经营状态">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-select v-model="form['企业经营状态']" placeholder="请选择">
                <el-option label="开业" value="开业" />
                <el-option label="歇业" value="歇业" />
                <el-option label="停业" value="停业" />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-radio v-model="form['企业经营状态是否公示']" label="公示">公示</el-radio>
              <el-radio v-model="form['企业经营状态是否公示']" label="不公示">不公示</el-radio>
            </el-col>
          </el-row>
        </el-form-item> -->

        <Caption title="党建信息" ></Caption>

        <el-row class="obtainCountWarp" type="flex" align="middle">
          <p>是否有党建信息</p>
          <el-form-item label="" size="mini">
            <el-radio v-model="form['是否有党建信息']" label="是">是</el-radio>
            <el-radio v-model="form['是否有党建信息']" label="否">否</el-radio>
          </el-form-item>
          <p></p>
        </el-row>
        <el-row class="obtainCountWarp" type="flex" align="middle">
          <p>中共党员（包括预备党员）人数（不公示）</p>
          <el-form-item ref="中共党员（包括预备党员）人数" label="" prop="中共党员（包括预备党员）人数">
            <el-input v-model="form['中共党员（包括预备党员）人数']" :disabled="isDisabled" type="number" placeholder="请输入" clearable @blur="handleSetInt('中共党员（包括预备党员）人数')"></el-input>
          </el-form-item>
          <p>人</p>
        </el-row>
        <el-row class="obtainCountWarp" type="flex" align="middle">
          <p>党组织建制（不公示）</p>
          <el-form-item label="">
            <el-radio v-model="form['党组织建制']" label="党委" :disabled="isDisabled">党委</el-radio>
            <el-radio v-model="form['党组织建制']" label="党总支" :disabled="isDisabled">党总支</el-radio>
            <el-radio v-model="form['党组织建制']" label="党支部" :disabled="isDisabled">党支部</el-radio>
            <el-radio v-model="form['党组织建制']" label="未成立党组织" :disabled="isDisabled">未成立党组织</el-radio>
          </el-form-item>
          <p></p>
        </el-row>
        <el-row class="obtainCountWarp" type="flex" align="middle">
          <p>经营者是否为党员（不公示）</p>
          <el-form-item ref="经营者是否为党员" label="" prop="经营者是否为党员">
            <el-radio v-model="form['经营者是否为党员']" label="是" :disabled="isDisabled">是</el-radio>
            <el-radio v-model="form['经营者是否为党员']" label="否" :disabled="isDisabled">否</el-radio>
          </el-form-item>
          <p></p>
        </el-row>
        <el-row class="obtainCountWarp" type="flex" align="middle">
          <p>经营者是否为党组织书记（不公示）</p>
          <el-form-item rel="经营者是否为党组织书记" label="" prop="经营者是否为党组织书记">
            <el-radio v-model="form['经营者是否为党组织书记']" label="是" :disabled="isDisabled">是</el-radio>
            <el-radio v-model="form['经营者是否为党组织书记']" label="否" :disabled="isDisabled">否</el-radio>
          </el-form-item>
          <p></p>
        </el-row>
        <!-- <el-form-item class="z_button_group">
          <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
          <el-button @click="saveDraftForm('draft')">暂存草稿</el-button>
        </el-form-item> -->
        <el-row style="margin: 50px auto" type="flex" justify="center">
          <el-form-item class="z_button_group">
            <el-button type="primary" @click="submitForm('ruleForm')">提交并公示</el-button>
            <el-button @click="saveDraftForm('draft')">暂存草稿</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-dialog
      class="success-dialog"
      :visible.sync="dialogVisible"
       width="506px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="top text-center">
        <img src="../../assets/images/success.png" />
        <p>提交成功</p>
      </div>
      <div class="dialog-btns text-center">
        <el-button class="plain" type="primary" @click="$router.replace('/?pageType=report')">返回首页</el-button>
        <el-button class="plain" type="primary" @click="handleGoDetail">查看进度</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderInfo, draftDetail,personReportApply } from '@/api'
import Breadcrumb from '@/components/Breadcrumb/index'
import Caption from '@/components/Caption/index'
export default {
  components: {
    Breadcrumb,
    Caption
  },
  computed:{
    isDisabled(){
      return this.form['是否有党建信息'] == '否'
    }
  },
  data() {
    const { validateField } = this.$utils
    const checkCount = (rule, value, callback) => {
      if (parseInt(value) > parseInt(this.form['从业人数'])) {
        callback(new Error(`${rule.field}大于从业人数，请查证`))
      } else {
        callback()
      }
    }
    let timeArr = this.$utils.getItem('reportYear')
    return {
      dialogVisible:false,
      radio: '',
      checkList: [],
      handleSetDisabled: {
        disabledDate(time) { // 返回禁用日期
          return !timeArr.includes(time.getFullYear())
        }
      },
      ident: '', // 开放平台ident
      draftNumber: '', // 草稿箱编号
      name: '', // 办事主体
      bizName: '', // 事项名称
      form: {
        '企业通讯地址': '',
        '经营者名称': '',
        '退役士兵经营者人数': 0,
        '经营范围': '',
        '高校毕业生雇员人数': 0,
        '从业人数': 0,
        '企业名称': '',
        '失业人员再就业雇员人数': 0,
        '高校毕业生经营者人数': 0,
        '邮政编码': '',
        '失业人员再就业经营者人数': 0,
        '残疾人经营者人数': 0,
        '企业经营状态': '开业',
        '企业联系电话': '',
        '残疾人雇员人数': 0,
        '统一社会信用代码': '',
        '退役士兵雇员人数': 0,
        '资金数额': '',
        '企业联络员身份证号码': '',
        '年报年度': String(timeArr[0]),
        '企业经营状态是否公示': '不公示',
        '营业额或营业收入': '',
        '营业额或营业收入是否公示': '不公示',
        '纳税总额': '',
        '纳税总额是否公示': '不公示',
        '是否有党建信息': '否',
        '中共党员（包括预备党员）人数': 0,
        // '未成立党组织': '是',
        '党组织建制': '未成立党组织',
        '经营者是否为党员': '否',
        '经营者是否为党组织书记': '否',
        '是否有特种设备': '否',
        '办理使用登记特种设备总台数': '',
        '检验有效期内特种设备总台数': '',
        '是否有网站或网店': '否',
        '是否有行政许可': '否',
        '行政许可信息': [
          {
            '许可名称': '',
            '有效期止': ''
          }
        ],
        '网站或网店': [
          {
            '网站或网店名称': '',
            '网站或网店网址': '',
            '网站或网店类型': ''
          }
        ]
      },
      id: '', // 表单系统ID
      rules: {
        '年报年度': [
          { required: true, message: '请选择年报年度', trigger: 'change' }
        ],
        '经营者名称': [
          { required: true, message: '请输入经营者名称', trigger: 'change' }
        ],
        '企业联系电话': [
          { required: true, message: '请输入企业联系电话', trigger: 'change' },
          { validator: validateField('phone') }
        ],
        '资金数额': [
          { required: true, message: '请输入资金数额', trigger: 'change' }
        ],
        '从业人数': [
          { required: true, message: '请输入从业人数', trigger: 'change' }
        ],
        '营业额或营业收入': [
          { required: true, message: '请输入营业额或营业收入', trigger: 'change' }
        ],
        '纳税总额': [
          { required: true, message: '请输入纳税总额', trigger: 'change' }
        ],
        '高校毕业生经营者人数': [
          { required: true, message: '请输入高校毕业生经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '高校毕业生雇员人数': [
          { required: true, message: '请输入高校毕业生雇员人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '退役士兵经营者人数': [
          { required: true, message: '请输入退役士兵经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '退役士兵雇员人数': [
          { required: true, message: '请输入退役士兵经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '残疾人经营者人数': [
          { required: true, message: '请输入残疾人经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '残疾人雇员人数': [
          { required: true, message: '请输入残疾人雇员人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '失业人员再就业经营者人数': [
          { required: true, message: '请输入失业人员再就业经营者人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '失业人员再就业雇员人数': [
          { required: true, message: '请输入失业人员再就业雇员人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ],
        '中共党员（包括预备党员）人数': [
          { required: true, message: '请输入中共党员（包括预备党员）人数', trigger: 'change' },
          { required: true, validator: checkCount, trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.$utils.removeItem('long')
    const query = this.$route.query
    // 新增与编辑都先做一次省局数据赋值
    if (this.$utils.getItem('reportData')) {
      this.form = {
        ...this.form,
        ...this.$utils.getItem('reportData')
      }
      this.bizName = this.$utils.getItem('reportData').企业类型
      this.name = this.$utils.getItem('reportData').企业名称
      console.log(this.form)
    }
    if (query.ident) { // 有ident，根据ident去开放平台拿数据
      getOrderInfo(query.ident).then(res => {
        this.form = {
          ...this.form,
          ...res.inData
        }
        this.name = res.inData.企业名称
        this.bizName = res.inData.企业类型
      })
    }
    if (query.draftNumber) { // 有draftNumber，获取草稿详情
      draftDetail(query.draftNumber).then(res => {
        this.form = {
          ...this.form,
          ...res.outData.draftData
        }
        this.draftNumber = res.outData.draftNumber
        this.name = res.outData.name
        this.bizName = res.outData.bizName
      })
    }
  },
  methods: {
    handleGoDetail() {
      this.$utils.showLoading({ text: '准备跳转，请稍后' })
      setTimeout(() => {
        this.$utils.hideLoading()
        this.$router.replace(`/officeBox/progressDetails?ident=${this.ident}&bizName=内资企业公示信息填报`)
      }, 1500)
    },
    // 添加字段
    handleAddField(key) {
      switch (key) {
        case '网站或网店':
          this.form['网站或网店'].push({
            '网站或网店名称': '',
            '网站或网店网址': '',
            '网站或网店类型': ''
          })
          break
        case '行政许可信息':
          this.form['行政许可信息'].push({
            '许可名称': '',
            '有效期止': ''
          })
          break
        default:
          break
      }
    },
    // 删除字段
    handleDelField(key, index) {
      this.form[key].splice(index, 1)
    },
    handleSetInt(key) {
      this.form[key] = parseInt(this.form[key])
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid, object) => {
        if (!valid) {
          // this.$utils.showError('请根据提示完善表单信息！')
          this.$utils.scrollView(object, this)
          return
        }
        const data = JSON.parse(JSON.stringify(this.form))
        console.log(data)
        if (data['是否有网站或网店'] === '否') {
          delete data['网站或网店']
        }
        // if (data['是否有行政许可'] === '否') {
        //   delete data['行政许可信息']
        // }
        // if (data['是否有特种设备'] === '否') {
        //   data['办理使用登记特种设备总台数'] = 0
        //   data['检验有效期内特种设备总台数'] = 0
        // }
        data.token = this.$utils.getLocalItem('token')
        // 更新到草稿
        this.saveDraftForm(formName, data)
      })
    },
    // 提价并公示
    appltAction(data) {
      personReportApply(data).then(res => {
        this.dialogVisible = true
        this.ident = res.ident
        this.$api.startJob({ job: 'EC_BIZBOX_DRAFT_DELETE', inData: { draftNumber: this.draftNumber }})
      })
    },
    // 暂存草稿
    saveDraftForm(type, data = null) {
      const params = {
        job: 'EC_BIZBOX_DRAFT_SAVE',
        inData: {
          bizPushTime: (Date.parse(new Date())) / 1000,
          userToken: this.$utils.getLocalItem('token'),
          draftData: this.form,
          draftNumber: this.draftNumber
        }
      }
      this.$api.startJob(params).then(res => {
        if (res.state === 'successful') { // 跳转到下一页
          this.draftNumber = res.outData.draftNumber
          if (type === 'draft') {
            this.$utils.showSuccess('已存至草稿箱')
          } else {
            this.appltAction(data)
          }
        } else {
          this.$utils.showError(res.errMsg)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">  

.companyMessage{
  width: 100%;
  min-height: 100vh;
  overflow: auto;
  .companyMessageMain{
    text-align: center;
      .top{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 47px;
      margin-bottom: 40px;
      div:first-child{
        font-size: 32px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        line-height: 54px;
        color: #464646;
        opacity: 1;
      }
      div:last-child{
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 27px;
        color: #464646;
        opacity: 1;
      }
    }
    ::v-deep .report_form{
      margin-top: 60px;
      width: 1178px;
      text-align: center;
      margin: auto;
      text-align: left;
      .el-form-item{
        display: inline-block;
        margin: 0 20px !important;
        .el-form-item__label{
          font-size: 13px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.9);
          opacity: 1;
        }
        .el-input__inner{
          width: 300px;
          height: 45px;
        }
        .el-textarea__inner{
          width: 300px;
        }
        .el-radio{
          margin-right: 5px;
        }
        .el-form-item__label-wrap{
          margin-left: 0 !important;
        }
        .el-form-item__content{
          margin-left: 0 !important;
        }
      }
      .el-form-item--mini{
        margin: 0 20px !important;
        .el-form-item__content{
            margin-left: 0 !important;
        }
      }
      .obtainCountWarp{
        margin-bottom: 18px;
        .obtainCount{
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>