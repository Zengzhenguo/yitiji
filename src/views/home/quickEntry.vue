<!--
 * @Author: your name
 * @Date: 2021-12-21 09:49:28
 * @LastEditTime: 2022-07-20 11:05:53
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /ec-gov-biz-hubei-pc 2/src/views/home/quickEntry.vue
-->
<template>
  <div style="padding-bottom:60px;">
    <page-header />
    <div class="notice_page">
      <div v-if="$route.query.type === '9210commercial'" style="text-align: center;margin-top:20px">
        <div style="font-size:30px;font-weight:600;margin-bottom:10px">荆州市企业开办“9210”</div>
        <div style="font-size:18px">照章户税社水电气网“一网通办”</div>
      </div>
      <div v-if="$route.query.type === 'commercial'" style="text-align: center;margin-top:20px">
        <div style="font-size:30px;font-weight:600;margin-bottom:10px">十堰市市场主体“一链通”</div>
      </div>
      <div class="title">
        <img src="@/assets/images/handleNotice/line.png" alt="" class="img" />
        办理须知
        <img src="@/assets/images/handleNotice/line.png" alt="" class="img" />
      </div>
      <div>欢迎使用本系统，办理前仔细阅读以下内容,提前做好准备,以帮助您快速办理业务:</div>
      <!-- 内资企业 -->
      <template v-if="$route.query.type === 'company'">
        <ul class="content">
          <li>本系统暂支持有限责任公司和股份有限公司的企业开办，其他企业类型请到<el-link class="link" type="primary" :underline="false" target="_blank" style="font-size:16px; margin:-1px 5px 0;">湖北政务服务网</el-link>办理。</li>
          <li>如公司的经营范围涉及前置审批事项，请到<el-link class="link" type="primary" :underline="false" target="_blank" style="font-size:16px; margin:-1px 5px 0;">湖北政务服务网</el-link>办理。</li>
          <li>办理前，请经办人、全部股东、董监高人员 <span class="link" @click="dialogTab = true">扫码下载《登记注册身份验证》APP</span> 认证身份。</li>
          <li>请提前准备好相关人员的身份证件,正反面照片。 </li>
          <li>请提前准备好经营地址合法使用证明，包括但不仅限租赁协议、房屋所有权证明、房屋使用权证明等文件。并承诺自主申报经营地址符合法律法规相关要求。</li>
          <li>前置审批许可事项如下：</li>
        </ul>
      </template>
      <!-- 商事一链通企业 -->
      <template v-if="$route.query.type === 'commercial' || $route.query.type === 'commercialRegister'">
        <ul class="content">
          <li>本系统暂支持十堰市范围内的商事主体（内资股份有限公司、外商投资企业除外)的企业开办，其他企业类型请到<el-link class="link" type="primary" :underline="false" target="_blank" style="font-size:16px; margin:-1px 5px 0;">湖北政务服务网</el-link>办理。</li>
          <li>如公司的经营范围涉及前置审批事项，请到<el-link class="link" type="primary" :underline="false" target="_blank" style="font-size:16px; margin:-1px 5px 0;">湖北政务服务网</el-link>办理。</li>
          <li>办理前，请经办人、全部股东、董监高人员 <span class="link" @click="dialogTab = true">扫码下载《登记注册身份验证》APP</span> 认证身份。</li>
          <li>请提前准备好相关人员的身份证件,正反面照片。 </li>
          <li>请提前准备好企业住所（经营场所）的相关信息并承诺自主申报的经营地址符合法律法规相关要求。</li>
          <li>前置审批许可事项如下：</li>
        </ul>
      </template>
      <!-- 个体工商户 -->
      <template v-if="$route.query.type === 'person'">
        <ul class="content">
          <template>
            <li>个体工商户注册登记，可以通过名称自主申报获得商户名称，也可以采用不核名方式进行注册登录。选择不核名方式注册登记，系统将自动采用主要经营者的姓名做为商户名称。</li>
            <li>如个体工商户的经营范围涉及前置审批事项，请到窗口办理。</li>
            <li>办理前，请经办人、全部参与经营者前往手机应用市场或 <span class="link" @click="dialogTab = true">扫码下载《登记注册身份验证》APP</span> 认证身份。</li>
          </template>
          <li>请提前准备好相关人员的身份证件,正反面照片。 </li>
          <li>请提前准备好经营地址合法使用证明，包括但不仅限租赁协议、房屋所有权证明、房屋使用权证明等文件。并承诺自主申报经营地址符合法律法规相关要求。</li>
          <li>前置审批许可事项如下：</li>
        </ul>
      </template>
      <!-- 一事联办 -->
      <template v-if="$route.query.type !== 'person' && $route.query.type !== 'company'&& $route.query.type !== 'commercial' && $route.query.type !== 'commercialRegister'">
        <ul class="content">
          <li>本系统暂支持有限责任公司、股份有限公司、个体工商户的营业执照+经营许可证联办，其他企业类型/事项请到<el-link class="link" type="primary" :underline="false" target="_blank" style="font-size:16px; margin:-1px 5px 0;">湖北政务服务网</el-link>办理。</li>
          <li>如单位的经营范围涉及前置审批事项，请到窗口办理。</li>
          <li>办理前，请经办人、全部股东、法定代表人、董监高人员、主要经营者/参与经营者 <span class="link" @click="dialogTab = true">扫码下载《登记注册身份验证》APP</span> 认证身份。</li>
          <li>前置审批许可事项如下：</li>
        </ul>
      </template>
      <el-table v-if="$route.query.type === 'commercial' || $route.query.type === 'commercialRegister'" :data="syssResult" border :span-method="objectSpanMethod" :header-cell-style="{fontWeight: '400',color: '#464646'}" height="400px">
        <el-table-column label="序号" type="index" width="50px" />
        <el-table-column prop="frontBusinessItem" label="项目名称" width="450px" />
        <el-table-column prop="hangldDepartment" label="实施机关" width="456px" />
        <el-table-column prop="gist" label="设定依据" width="456px" />
      </el-table>
      <el-table v-else :data="result" border :span-method="objectSpanMethod" :header-cell-style="{fontWeight: '400',color: '#464646'}" height="400px">
        <el-table-column label="序号" type="index" width="50px" />
        <el-table-column prop="frontBusinessItem" label="项目名称" width="450px" />
        <el-table-column prop="hangldDepartment" label="实施机关" width="456px" />
      </el-table>
      <!-- 我要开餐厅 -->
      <div v-if="$route.query.type !== 'person' && $route.query.type !== 'company'&& $route.query.type !== 'commercial'&& $route.query.type !== 'commercialRegister'">
        <div class="restaurant-title">5.需要预先准备的材料清单：</div>
        <el-table :data="resultRestaurant" border :header-cell-style="{fontWeight: '400',color: '#464646'}" height="400px">
          <el-table-column label="序号" type="index" width="50px" />
          <el-table-column prop="name" label="材料名称" width="350px" />
          <el-table-column prop="provide" label="是否必须提供" width="256px" />
          <el-table-column prop="origin" label="材料来源" width="300px" />
        </el-table>
      </div>
      <div class="notice_btn">
        <el-button type="primary" @click="nextPage(1)">{{ $route.query.type === 'person' ? '办理有字号注册登记' : '开始办理' }}</el-button>
        <!-- 个体户无名称申报注册登录按钮 -->
        <el-button v-if="$route.query.type === 'person'" type="primary" @click="nextPage(2)">办理无字号注册登记</el-button>
      </div>
      <!-- <el-button type="primary" class="notice_btn" @click="nextPage">开始办理</el-button> -->
      <!-- title="登记注册身份验证APP下载" -->
      <el-dialog
        :visible.sync="dialogTab"
        width="500px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div slot="title" class="dialog_title">登记注册身份验证APP下载</div>
        <ul class="flex">
          <li class="flex-item">
            <img src="@/assets/images/handleNotice/huawei.png" alt="" />
            <div>华为</div>
          </li>
          <li class="flex-item">
            <img src="@/assets/images/handleNotice/tecent.png" alt="" />
            <div>腾讯应用宝</div>
          </li>
          <li class="flex-item">
            <img src="@/assets/images/handleNotice/vivo.png" alt="" />
            <div>VIVO</div>
          </li>
          <li class="flex-item">
            <img src="@/assets/images/handleNotice/ios.png" alt="" />
            <div>苹果</div>
          </li>
        </ul>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogTips"
        width="800px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="tips-content">
          <div style="">为深入贯彻落实《关于以市场主体需求为导向打造一流营商环境的若干措施》（鄂发〔2020〕23号）、省优化营商环境领导小组《关于开展优化营商环境先行试点创建工作的通知》(鄂营商发〔2020〕4)等文件精神，进一步提升开办企业便利化水平，在十堰市探索实行商事主体登记确认制。</div>
          <div>"商事主体登记确认制"以申请人信用承诺为基础，推进材料清单标准化、办理流程电子化、登记审查智能化，登记机关对申请材料是否齐全、是否符合法定形式进行形式审查。申请人对提交材料真实性、合法性作出承诺的，登记机关即予以登记确认并核发营业执照。</div>
          <div>"商事主体登记确认制"需满足以下条件：</div>
          <div>（1）属于拟在十堰市内设立登记的商事主体（内资有限公司、个体工商户)；</div>
          <div>（2）采用告知承诺方式申报企业名称，承诺知晓并已主动规避名称冲突风险；</div>
          <div>（3）经营范围全部按标准表述勾选且不涉及前置审批事项；</div>
          <div>（4）需要签署材料的人员或单位符合数字签名条件；</div>
          <div style="font-weight:bold;margin-top:10px">符合上述条件的，可以选择"试点商事主体登记确认制"。</div>
        </div>
        <div style="text-align: center">
          <el-button type="primary" @click="dialogTips = false">内资企业"登记确认制"</el-button>
          <el-button type="primary" @click="toPerson">个体工商户"登记确认制"</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 操作指引 -->
    <syHelpGuide v-if="$route.query.type === 'commercial'"/> 
    <helpGuide v-else/> 
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader/index'
import { createJobQueue, getBizCode } from '@/api/index'
import { getBaseData } from '@/api'
import helpGuide from '@/components/helpGuide'
import syHelpGuide from '@/components/syHelpGuide'
export default {
  components: {
    PageHeader,
    helpGuide,
    syHelpGuide
  },
  data() {
    return {
      dialogTab: false,
      dialogTips: this.$route.query.type === 'commercial' || this.$route.query.type === 'commercialRegister',
      spanArr: [],
      result: [
        { frontBusinessItem: '证券公司设立审批', hangldDepartment: '证监会' },
        { frontBusinessItem: '烟草专卖生产企业许可证核发', hangldDepartment: '国家烟草专卖局' },
        { frontBusinessItem: '烟草专卖批发企业许可证核发', hangldDepartment: '国家烟草专卖局或省级烟草专卖行政主管部门' },
        { frontBusinessItem: '通用航空企业经营许可', hangldDepartment: '民航地区管理局' },
        { frontBusinessItem: '营利性民办学校(营利性民办培训机构)办学许可', hangldDepartment: '县级以上人民政府教育行政部门、县级以上人民政府劳动和社会保障行政部门' },
        { frontBusinessItem: '民用爆炸物品生产许可', hangldDepartment: '工业和信息化部' },
        { frontBusinessItem: '爆破作业单位许可证核发', hangldDepartment: '省级、设区的市级人民政府公安机关' },
        { frontBusinessItem: '民用枪支（弹药）制造、配售许可', hangldDepartment: '公安部、省级人民政府公安机关' },
        { frontBusinessItem: '制造、销售弩或营业性射击场开设弩射项目审批', hangldDepartment: '省级人民政府公安机关' },
        { frontBusinessItem: '保安服务许可证核发', hangldDepartment: '省级人民政府公安机关' },
        { frontBusinessItem: '涉及国家规定实施准入特别管理措施的外商投资企业的设立及变更审批', hangldDepartment: '商务部、国务院授权的部门或地方人民政府' },
        { frontBusinessItem: '设立经营个人征信业务的征信机构审批', hangldDepartment: '中国人民银行' },
        { frontBusinessItem: '卫星电视广播地面接收设施安装许可审批', hangldDepartment: '新闻出版广电总局' },
        { frontBusinessItem: '设立出版物进口经营单位审批', hangldDepartment: '新闻出版广电总局' },
        { frontBusinessItem: '设立出版单位审批', hangldDepartment: '新闻出版广电总局' },
        { frontBusinessItem: '境外出版机构在境内设立办事机构审批', hangldDepartment: '新闻出版广电总局' },
        { frontBusinessItem: '境外出版机构在境内设立办事机构审批', hangldDepartment: '国务院新闻办' },
        { frontBusinessItem: '境外广播电影电视机构在华设立办事机构审批', hangldDepartment: '新闻出版广电总局' },
        { frontBusinessItem: '境外广播电影电视机构在华设立办事机构审批', hangldDepartment: '国务院新闻办' },
        { frontBusinessItem: '危险化学品经营许可', hangldDepartment: '县级、设区的市级人民政府安全生产监督管理部门' },
        { frontBusinessItem: '新建、改建、扩建生产、储存危险化学品（包括使用长输管道输送危险化学品）建设项目安全条件审查；新建、改建、扩建储存、装卸危险化学品的港口建设项目安全条件审查', hangldDepartment: '设区的市级以上人民政府安全生产监督管理部门；港口行政管理部门' },
        { frontBusinessItem: '烟花爆竹生产企业安全生产许可', hangldDepartment: '省级人民政府安全生产监督管理部门' },
        { frontBusinessItem: '外资银行营业性机构及其分支机构设立审批', hangldDepartment: '银监会' },
        { frontBusinessItem: '外国银行代表处设立审批', hangldDepartment: '银监会' },
        { frontBusinessItem: '中资银行业金融机构及其分支机构设立审批', hangldDepartment: '银监会' },
        { frontBusinessItem: '非银行金融机构（分支机构）设立审批', hangldDepartment: '银监会' },
        { frontBusinessItem: '融资性担保机构设立审批', hangldDepartment: '省级人民政府确定的部门' },
        { frontBusinessItem: '外国证券类机构设立驻华代表机构核准', hangldDepartment: '证监会' },
        { frontBusinessItem: '设立期货专门结算机构审批', hangldDepartment: '证监会' },
        { frontBusinessItem: '设立期货交易场所审批', hangldDepartment: '国务院或证监会' },
        { frontBusinessItem: '证券交易所设立审核、证券登记结算机构设立审批', hangldDepartment: '国务院' },
        { frontBusinessItem: '专属自保组织和相互保险组织设立审批', hangldDepartment: '保监会' },
        { frontBusinessItem: '保险公司及其分支机构设立审批', hangldDepartment: '保监会' },
        { frontBusinessItem: '外国保险机构驻华代表机构设立审批', hangldDepartment: '保监会' },
        { frontBusinessItem: '快递业务经营许可', hangldDepartment: '国家邮政局或省级邮政管理机构' }
      ],
      syssResult: [
        { frontBusinessItem: '	证券公司设立审批', hangldDepartment: '	中国证券监督管理委员会', gist: '	《中华人民共和国证券法》	' },
        { frontBusinessItem: '	烟草专卖生产企业许可证核发', hangldDepartment: '	国家烟草专卖局', gist: '《中华人民共和国烟草专卖法》《中华人民共和国烟草专卖法实施条例》'	 },
        { frontBusinessItem: '	烟草专卖批发企业许可证核发', hangldDepartment: '	国家烟草专卖局或省级烟草专卖行政主管部门	', gist: '《中华人民共和国烟草专卖法》《中华人民共和国烟草专卖法实施条例》'	 },
        { frontBusinessItem: '营利性民办学校（营利性民办培训机构）办学许可', hangldDepartment: '	县级以上人民政府教育行政部门、县级以上人民政府人力资源社会保障部门	', gist: '《中华人民共和国民办教育促进法》	' },
        { frontBusinessItem: '	金融控股公司设立审批', hangldDepartment: '	中国人民银行', gist: '《国务院关于实施金融控股公司准入管理的决定》（国发〔2020〕12号）《金融控股公司监督管理试行办法》'	 },
        { frontBusinessItem: '	民用爆炸物品生产许可', hangldDepartment: '	中华人民共和国工业和信息化部', gist: '《民用爆炸物品安全管理条例》'	 },
        { frontBusinessItem: '	爆破作业单位许可证核发', hangldDepartment: '	省级、设区的市级人民政府公安部门', gist: '《民用爆炸物品安全管理条例》'	 },
        { frontBusinessItem: '	民用枪支（弹药）制造、配售许可', hangldDepartment: '中华人民共和国公安部、省级人民政府公安部门', gist: '《中华人民共和国枪支管理法》	'	 },
        { frontBusinessItem: '	制造、销售弩或营业性射击场开设弩射项目审批', hangldDepartment: '省级人民政府公安部门', gist:	'《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《公安部国家工商行政管理局关于加强弩管理的通知》（公治〔1999〕1646号）'	 },
        { frontBusinessItem: '	保安服务许可证核发', hangldDepartment: '省级人民政府公安部门', gist: '《保安服务管理条例》'	 },
        { frontBusinessItem: '	设立经营个人征信业务的征信机构审批', hangldDepartment: '中国人民银行', gist: '《征信业管理条例》'	 },
        { frontBusinessItem: '卫星电视广播地面接收设施安装许可审批', hangldDepartment: '国家广播电视总局', gist: '卫星电视广播地面接收设施安装许可审批 国家广播电视总局 《卫星电视广播地面接收设施管理规定》《关于进一步加强卫星电视广播地面接收设施管理的意见》（广发外字〔2002〕254号）' },
        { frontBusinessItem: '	设立出版物进口经营单位审批', hangldDepartment: '国家新闻出版署', gist: '《出版管理条例》'	},
        { frontBusinessItem: '	设立出版单位审批', hangldDepartment: '国家新闻出版', gist: '《出版管理条例》'	},
        { frontBusinessItem: '	境外出版机构在境内设立办事机构审批', hangldDepartment: '国家新闻出版署国务院新闻办', gist: '境外出版机构在境内设立办事机构审批 国家新闻出版署国务院新闻办 《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《外国企业常驻代表机构登记管理条例》'	 },
        { frontBusinessItem: '	境外电影机构在华设立办事机构审批', hangldDepartment: '国家电影局国务院新闻办', gist: '境外出版机构在境内设立办事机构审批 国家新闻出版署国务院新闻办 《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《外国企业常驻代表机构登记管理条例》'	 },
        { frontBusinessItem: '	境外广播电视机构在华设立办事机构审批	', hangldDepartment: '	国家广播电视总局国务院新闻办', gist: '境外出版机构在境内设立办事机构审批 国家新闻出版署国务院新闻办 《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《外国企业常驻代表机构登记管理条例》'	 },
        { frontBusinessItem: '	危险化学品经营许可	', hangldDepartment: '县级、设区的市级人民政府应急管理部门', gist: '	《危险化学品安全管理条例》'	 },
        { frontBusinessItem: '	新建、改建、扩建生产、储存危险化学品（包括使用长输管道输送危险化学品）建设项目安全条件审查；新建、改建、扩建储存、装卸危险化学品的港口建设项目安全条件审查	', hangldDepartment: '设区的市级以上人民政府应急管理部门；港口行政管理部门', gist: '	《危险化学品安全管理条例》'		 },
        { frontBusinessItem: '	烟花爆竹生产企业安全生产许可	', hangldDepartment: '	省级人民政府应急管理部门	', gist: '	《烟花爆竹安全管理条例》' },
        { frontBusinessItem: '	外资银行营业性机构及其分支机构设立审批	', hangldDepartment: '	中国银行保险监督管理委员会	', gist: '《中华人民共和国银行业监督管理法》《中华人民共和国外资银行管理条例》'	 },
        { frontBusinessItem: '	外国银行代表处设立审批	', hangldDepartment: '	中国银行保险监督管理委员会	', gist: '外国银行代表处设立审批 中国银行保险监督管理委员会 《中华人民共和国银行业监督管理法》《中华人民共和国外资银行管理条例》《外国企业常驻代表机构登记管理条例》'	 },
        { frontBusinessItem: '	中资银行业金融机构及其分支机构设立审批	', hangldDepartment: '	中国银行保险监督管理委员会	', gist: '《中华人民共和国银行业监督管理法》《中华人民共和国商业银行法》'	 },
        { frontBusinessItem: '	非银行金融机构（分支机构）设立审批', hangldDepartment: '	中国银行保险监督管理委员会', gist: '《中华人民共和国银行业监督管理法》《金融资产管理公司条例》'	 },
        { frontBusinessItem: '	融资担保公司设立审批	', hangldDepartment: '	省级人民政府确定的部门	', gist: '《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《国务院关于修改〈国务院对确需保留的行政审批项目设定行政许可的决定〉的决定》（国务院令第548号）《融资担保公司监督管理条例》《融资性担保公司管理暂行办法》（银监会令2010年第3号）'	 },
        { frontBusinessItem: '	外国证券类机构设立驻华代表机构核准	', hangldDepartment: '	中国证券监督管理委员会	', gist: '外国证券类机构设立驻华代表机构核准 中国证券监督管理委员会 《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《外国企业常驻代表机构登记管理条例》《证券公司监督管理条例》《国务院关于管理外国企业常驻代表机构的暂行规定》（国发〔1980〕272号）'	 },
        { frontBusinessItem: '	设立期货专门结算机构审批	', hangldDepartment: '	中国证券监督管理委员会	', gist: '	《期货交易管理条例》（国务院令第627号）	 '	},
        { frontBusinessItem: '	设立期货交易场所审批	', hangldDepartment: '	国务院或中国证券监督管理委员会	', gist: '	《期货交易管理条例》（国务院令第627号）	'	 },
        { frontBusinessItem: '	证券交易所设立审核、证券登记结算机构设立审批	', hangldDepartment: '	国务院、中国证券监督管理委员会	', gist: '	《中华人民共和国证券法》	 '	},
        { frontBusinessItem: '	专属自保组织和相互保险组织设立审批	', hangldDepartment: '	中国银行保险监督管理委员会	', gist: '	《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）	 '	},
        { frontBusinessItem: '	保险公司及其分支机构设立审批	', hangldDepartment: '	中国银行保险监督管理委员会	', gist: '《中华人民共和国保险法》《中华人民共和国外资保险公司管理条例》'	 },
        { frontBusinessItem: '	外国保险机构驻华代表机构设立审批', hangldDepartment: '	中国银行保险监督管理委员会	', gist: '《中华人民共和国保险法》《国务院对确需保留的行政审批项目设定行政许可的决定》（国务院令第412号）《外国企业常驻代表机构登记管理条例》'	 },
        { frontBusinessItem: '	快递业务经营许可	', hangldDepartment: '	国家邮政局或省级邮政管理机构	', gist: '	《中华人民共和国邮政法》	 '	},
        { frontBusinessItem: '	经营劳务派遣业务许可	', hangldDepartment: '	省、市、县级人民政府人力资源社会保障部门	', gist: '	《中华人民共和国劳动合同法》	 '	},
        { frontBusinessItem: '	使用"交易所"字样的交易场所审批	', hangldDepartment: '	国务院或国务院金融管理部门、省级人民政府	', gist: '《防范和处置非法集资条例》《国务院关于清理整顿各类交易场所切实防范金融风险的决定》（国发〔2011〕38号）'	 }
      ], // 商事
      resultRestaurant: [
        { name: '法定代表人（负责人）/主要经营者身份证明', provide: '是', origin: '申请人自备' },
        { name: '企业董监高等管理人员、个体工商户家庭参与经营者的身份证明', provide: '是', origin: '申请人自备' },
        { name: '委托代理人的身份证明文件', provide: '非法定代表人本人办理时需提供', origin: '申请人自备' },
        { name: '经营住所使用证明，包括但不仅限租赁协议、房屋所有权证明、房屋使用权证明等文件', provide: '是', origin: '申请人自备' },
        { name: '仓库地址使用证明，包括但不仅限租赁协议、房屋所有权证明、房屋使用权证明等文件', provide: '在经营场所外设置仓库时需系统', origin: '申请人自备' },
        { name: '公司章程', provide: '申请主体为企业时提供', origin: '申请人自备/使用系统章程模板' },
        { name: '与食品销售相适应的设施设备清单及布局示意图（布局示意图上应标明长、宽，并注明面积）', provide: '是', origin: '申请人自备' },
        // { name: '从业人员健康管理、食品安全自查、进货查验记录等保证食品安全的规章制度', provide: '主体业态为食品销售经营者时需提供', origin: '申请人自备' },
        { name: '自动售货设备的产品合格证明、具体放置地点，经营者名称、住所、联系方式、食品经营许可证的公示方法等', provide: '主体业态为食品销售经营者时需提供', origin: '申请人自备' },
        { name: '设置专职或者兼职食品安全管理岗位相关人员的身份证明', provide: '主体业态含自动售货设备时需提供', origin: '申请人自备' },
        { name: '专（兼）职食品安全管理人员培训证明', provide: '主体业态为餐饮服务经营者/单位食堂时需提供', origin: '申请人自备' },
        { name: '经营场所、设备布局、加工流程、卫生设施等平面示意图及说明和经营设备或者设施清单（布局示意图上应标明长、宽，并注明面积）', provide: '主体业态为餐饮服务经营者/单位食堂时需提供', origin: '申请人自备' },
        // { name: '从业人员健康管理、食品安全自查、进货查验、食品安全事故处置等保证食品安全的规章制度', provide: '主体业态为餐饮服务经营者/单位食堂时需提供', origin: '申请人自备' },
        { name: '关键环节食品加工操作规程', provide: '主体业态为单位食堂时需提供', origin: '申请人自备' },
        { name: '从事接触直接入口食品工作从业人员的健康证明', provide: '从事接触直接入口食品工作从业人员需提供', origin: '申请人自备' },
        { name: '与挂钩生产单位的合作协议（合同），生产单位的《食品生产许可证》', provide: '经营项目含散装熟食时需提供', origin: '申请人自备' },
        { name: '加工消毒等关键环节操作规程、加工设备、包装材料（容器）的生产合格证明、成品安全性检验合格报告和奶源供货合同及供货商资质等文件', provide: '经营项目含自制生鲜乳饮品时需提供', origin: '申请人自备' },
        { name: '符合食品安全要求的产品包装材料证明，以及与经营规模相适应、符合配送要求的设施设备等有关资料（运输车辆、容器等）', provide: '经营项目含网络经营时需提供', origin: '申请人自备' },
        { name: '关键环节食品加工操作规程、符合食品安全要求的产品包装材料证明、与实际产品内容相符合的标识说明样张、与经营规模相适应、符合配送要求的设施设备等有关资料（运输车辆、容器等）和开展食品及环节表面菌落总数、致病菌检验设施设备清单', provide: '经营项目含中央厨房、从事集体用餐配送时需提供', origin: '申请人自备' }
      ],
      curAreaDistrict: this.$utils.getLocalItem('curArea').district
    }
  },
  async created() {
    try {
      if (this.$route.query.type === '9210commercial') {
        this.$utils.setLocalItem('tId', '2021II-ZW-JZGXQ')
      }
      if (this.$route.query.type === 'commercial') {
        this.$utils.setLocalItem('tId', '2021II-ZW-SYJK')
      }
      if (this.$route.query.mode === 'test' && this.$route.query.type === 'commercial') {
        this.$utils.setItem('origin', '湖北政务网一链通')
      }
      this.$utils.setLocalItem('mode', 'test')
      const res = await getBaseData()
      const baseInfo = res.outData.jobPackage.HB_QYKB_DRAFT.inData
      // 基础数据存储
      this.$utils.setLocalItem('baseInfo', baseInfo)
      // 获取当前地区数据
      let curArea = Object.values(baseInfo.areaInfo).filter(item => item.tId.indexOf(this.$utils.getLocalItem('tId')) !== -1)
      if (!curArea.length) curArea = [baseInfo.areaInfo['十堰经济技术开发区']]
      this.$utils.setLocalItem('curArea', curArea[0])
      // 十堰市除经开区和郧阳区事监局的其他地区首页增加一个入口
    } catch (error) {
      this.$utils.showError('获取基本信息失败，请检查网络！')
    }
  },
  mounted() {
    this.getSpanArr(this.result)
  },
  methods: {
    // 商事去个体开办
    toPerson() {
      this.dialogTips = false
      this.$router.push({ path: '/form/handleNotice', query: { type: 'person', bizName: '个体工商户辅助开办' }})
    },
    nextPage(type) {
      console.log(type)
      if (!this.$utils.getLocalItem('token')) {
        this.$utils.showError('未授权，请重新授权')
        return
      }
      this.$loading({ text: '加载中...' })
      createJobQueue().then(async res => {
        this.$utils.setItem('ident', res.outData.queueIdent)
        // 没有平台代码，则去获取
        if (!this.$utils.getLocalItem('bizCode')) {
          const bizInfo = await getBizCode()
          this.$utils.setLocalItem('bizCode', bizInfo.outData.bizCode)
        }
        // 从须知页进入，清除草稿订单号，相当于新建订单
        this.$utils.removeItem('draftNumber')
        this.$loading().close()
        // 新建订单清除draftInfo
        this.$store.commit('draft/SET_DRAFT_INFO', null)
        if (type === 2) { // 1个人有字号、企业开办；2个人无字号
          this.$router.push({ path: '/form/noNameApply', query: { ...this.$route.query }})
        } else {
          // if (this.$route.query.type === 'company' || this.$route.query.type === 'person') { // 我要开餐馆-一事联办
          //   this.$router.push({ path: '/form/nameApply', query: { ...this.$route.query }})
          // } else if (this.$route.query.type === 'commercial' || this.$route.query.type === '9210commercial' || this.$route.query.type === 'commercialRegister') {
          //   this.$router.push({ path: '/form/businessHandling', query: { ...this.$route.query }})
          // } else {
          //   this.$router.push({ path: '/form/business', query: { ...this.$route.query }})
          // }
          if (this.$route.query.type === 'company' || this.$route.query.type === 'person') { // 我要开餐馆-一事联办
            return this.$router.push({ path: '/form/nameApply', query: { ...this.$route.query }})
          }
          if (this.$route.query.type === 'commercial') {
            return this.$router.push({ path: '/form/businessHandling', query: { ...this.$route.query, bizName: '商事主体确认登记' }})
          }
          if (this.$route.query.type === '9210commercial') {
            return this.$router.push({ path: '/form/businessHandling', query: { ...this.$route.query }})
          }
          if (this.$route.query.type === 'commercialRegister') {
            return this.$router.push({ path: '/form/businessHandling', query: { ...this.$route.query }})
          }
          this.$router.push({ path: '/form/business', query: { ...this.$route.query }})
        }
      }).catch(err => {
        this.$loading().close()
        console.log(err)
      })
    },
    // 表格行合并算法
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 数组spanArr用于存放每一行记录的合并数。0不渲染，1渲染，>1合并
    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素的frontBusinessItem是否相同
          if (data[i].frontBusinessItem === data[i - 1].frontBusinessItem) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.notice_page{
  font-size: 16px;
  width: 957px;
  margin: 0 auto;
  color: #464646;
}
.notice_page .title{
  font-size: 28px;
  color: #333;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px 0;
}
.notice_page .img{
  width: 27px;
  margin: 0 15px;
}
.notice_page .content{
  padding: 15px 0;
}
.notice_page .content li{
  padding: 12px 0;
  list-style-type: decimal;
  margin-left: 15px;
  line-height: 26px;
  /* list-style-position: inside; */
}
.notice_page .title2{
  padding-bottom: 30px;
}
.notice_btn {
  /* width: 155px; */
  padding: 0 25px!important;
  height: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 80px auto 0 auto;
}
::v-deep .notice_btn .el-button:last-child {
  margin-left: 50px;
}
.button{
  width: 155px;
  padding: 15px 0;
  background: blue;
  color: #FFFFFF;
  text-align: center;
  border-radius: 4px;
  margin: 60px auto;
  cursor: pointer;
}
.link{
  color: blue;
  cursor: pointer;
}

.flex{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 27px;
}
.flex .flex-item{
  text-align: center;
  list-style: none;
  padding-bottom: 10px;
}
.flex .flex-item img{
  width: 185px;
  padding: 5px 0 0;
}
.dialog_title{
  text-align: center;
  font-weight: bold;
  color: #000;
  font-size: 20px;
  padding-top: 30px;
}
.el-table th>.cell {
  color: #464646;
}
.restaurant-title {
  padding: 30px 0 10px 0;
}
.tips-content{
  padding: 20px;
  line-height: 30px;
  font-size: 16px;
  text-indent: 20px;
}
</style>
