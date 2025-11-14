export const baseInfo = {
  'cityArr': ['十堰市', '恩施土家族苗族自治州'], // PC端使用(要显示的市)
  'includesArr': ['十堰经济技术开发区 ', '郧阳区', '恩施市'], // PC端使用(要显示的区)
  'areaInfo': { // PC和终端共用
    '十堰经济技术开发区': { // 对应地区
      'tId': '2020II-500120565', // 终端机编号
      'provice': '湖北省', // 所在省
      'city': '十堰市', // 所在市
      'district': '十堰经济技术开发区', // 所在区
      'areaCode': ['420000', '420300'], // 回显地址码（到市级）
      'areaLabel': ['湖北省', '十堰市'], // 回显地址码中文(到市级)
      'defaultValue': ['十堰市', '十堰经济技术开发区 '],
      'hideMenu': [], // 要隐藏的菜单
      'personData': [{ // 个体工商户名称区划
        'children': [{
          'label': '十堰经济技术开发区',
          'value': '十堰经济技术开发区'
        }],
        'label': '冠区/县名'
      }],
      'listName': 'HUBEI_SHIYAN_LICENSE_RECEIVE', // 打照列表job名，获取基础信息和ident
      'applyName': 'HUBEI_SY_ENT_APPLY', // 提交申请job名
      'resultName': 'HUBEI_SHIYAN_LICENSE_PRINTED_ARCHIVE', // 上传打照结果job名
      'licenseInfo': 'HUBEI_SHIYAN_LICENSE_INFO', // 获取轮询结果
      'companyData': [{ // 企业开办名称区划
        'children': [{
          'label': '十堰',
          'value': '十堰'
        }, {
          'label': '十堰市',
          'value': '十堰市'
        }],
        'label': '冠市名'
      }, {
        'children': [{
          'label': '湖北',
          'value': '湖北'
        }, {
          'label': '湖北十堰',
          'value': '湖北十堰'
        }, {
          'label': '湖北十堰市',
          'value': '湖北十堰市'
        }, {
          'label': '湖北省',
          'value': '湖北省'
        }, {
          'label': '湖北省十堰',
          'value': '湖北省十堰'
        }, {
          'label': '湖北省十堰市',
          'value': '湖北省十堰市'
        }],
        'label': '冠省名'
      }]
    },
    '恩施市': {
      'tId': '2020II-500120567',
      'provice': '湖北省',
      'city': '恩施土家族苗族自治州',
      'district': '恩施市',
      'areaCode': ['420000', '422800'],
      'areaLabel': ['湖北省', '恩施土家族苗族自治州'],
      'defaultValue': ['恩施土家族苗族自治州', '恩施市'],
      'hideMenu': [],
      'cityArr': [],
      'personData': [{
        'children': [
          {
            'label': '恩施市',
            'value': '恩施市'
          }
        ],
        'label': '冠区/县名'
      }],
      'listName': 'HUBEI_ENSHI_LICENSE_INFO',
      'applyName': 'HUBEI_ENSHI_ENT_APPLY',
      'companyData': [{
        'children': [
          {
            'label': '恩施州',
            'value': '恩施州'
          },
          {
            'label': '恩施自治州',
            'value': '恩施自治州'
          },
          {
            'label': '恩施州恩施市',
            'value': '恩施州恩施市'
          },
          {
            'label': '恩施自治州恩施市',
            'value': '恩施自治州恩施市'
          }
        ],
        'label': '冠市名'
      }, {
        'children': [{
          'label': '湖北',
          'value': '湖北'
        }, {
          'label': '湖北恩施州',
          'value': '湖北恩施州'
        }, {
          'label': '湖北恩施自治州',
          'value': '湖北恩施自治州'
        }, {
          'label': '湖北省',
          'value': '湖北省'
        }, {
          'label': '湖北省恩施州',
          'value': '湖北省恩施州'
        }, {
          'label': '湖北省恩施自治州',
          'value': '湖北省恩施自治州'
        }],
        'label': '冠省名'
      }],
      'resultName': 'HUBEI_ENSHI_LICENSE_PRINTED_ARCHIVE'
    },
    '郧阳区': {
      'tId': '2020II-500120573',
      'provice': '湖北省',
      'city': '十堰市',
      'district': '郧阳区',
      'areaCode': ['420000', '420300'],
      'areaLabel': ['湖北省', '十堰市'],
      'defaultValue': ['十堰市', '郧阳区'],
      'hideMenu': ['person'],
      'personData': [{
        'children': [{
          'label': '郧阳区',
          'value': '郧阳区'
        }],
        'label': '冠区/县名'
      }],
      'listName': 'HUBEI_YUNYANG_LICENSE_INFO',
      'applyName': 'HUBEI_YUNYANG_ENT_APPLY',
      'companyData': [{
        'children': [{
          'label': '十堰',
          'value': '十堰'
        }, {
          'label': '十堰市',
          'value': '十堰市'
        }],
        'label': '冠市名'
      }, {
        'children': [{
          'label': '湖北',
          'value': '湖北'
        }, {
          'label': '湖北十堰',
          'value': '湖北十堰'
        }, {
          'label': '湖北十堰市',
          'value': '湖北十堰市'
        }, {
          'label': '湖北省',
          'value': '湖北省'
        }, {
          'label': '湖北省十堰',
          'value': '湖北省十堰'
        }, {
          'label': '湖北省十堰市',
          'value': '湖北省十堰市'
        }],
        'label': '冠省名'
      }],
      'resultName': 'HUBEI_YUNYANG_LICENSE_PRINTED_ARCHIVE'
    }
  },
  'queueIdent': '5d62c8ae8ff44a439abf499cddbfe99d'
}
