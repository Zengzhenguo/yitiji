<template>
  <div>
    <page-header />
    <div class="face-box">
      <div class="box">
        <!-- <my-loading /> -->
        <div class="title">请看屏幕上方摄像头</div>
        <div class="tips">
          <img src="../../assets/images/notice.png" />
          <span>请将头像对准人形框，建议不要戴眼镜、帽子</span>
        </div>

        <div v-if="device =='MD'||device === 'ZW'||device === 'HDY'">
          <div class="camera">
            <img :src="imgPreview" />
          </div>
        </div>
        <div v-else class="camera"></div>
      </div>
      <!-- <div class="preview">
        <img :src="preview" />
      </div> -->
      <div class="btn-group">
        <el-button type="primary" @click="handleCanel">取消</el-button>
      </div>
    </div>
  </div>

</template>

<script>
import { face } from '@/api/terminal'
import { uploadFile } from '@/api/common'
import { login } from '@/api/login'
import { setLocalItem } from '@/utils/index'
import PageHeader from '@/components/PageHeader/index'
import CameraHelperWS from '@/utils/CameraHelperWS'
import FaceMatchWs from '@/utils/FaceMatchWs'
import waitImg from '@/assets/images/wait.jpg'
// import myLoading from '@/components/Loading/index'
export default {
  name: '',
  components: {
    PageHeader
    // myLoading
  },
  data() {
    return {
      userInfo: null,
      device: '',
      imgPreview: waitImg,
      preview: '',
      url: 'ws://127.0.0.1:28832',
      timer: null,
      imgBase64: '',
      websock: null,
      imgBase: '',
      // wss://localhost:29932
      /**
		 * 同时支持wss和ws两种方式，调用者根据需要选择对应的方式
		 * 1、http下两种方式均可使用
		 * 2、https下只能使用wss方式
		 * 3、使用wss方式，必须安装证书，一般SDK安装后会自动安装证书
		 */
      params: {
        /* "host" : "wss://localhost:19932", */
        'host': 'ws://127.0.0.1:18832',
        'Infrared': 0,
        'imgWidth': 640,
        'imgHeight': 480,
        'imgCompress': 85,
        'pupilDistMin': 0,
        'pupilDistMax': 1000,
        'minFaceWide': 60,
        'isActived': 1,
        'nirCount': 1,
        'liveThreshold': '0.6',
        'isAudio': 1,
        'isText': 1,
        'timeOut': 10,
        'deviceIdxCol': 0,
        'deviceIdxNir': 1,
        'definitionAsk': 0,
        'compareFacePos': 1,
        'headLeft': 10,
        'headRight': 10,
        'headLow': 0,
        'headHigh': 0,
        'eyeDegree': 0,
        'mouthDegree': 0,
        'mask': 1,
        'glass': 0,
        'sunGlass': 0,
        'occEx': 0,
        'leftCheek': 50,
        'rightCheek': 50,
        'forehead': 70,
        'chin': 50,
        'AlphaLayerType': 0,
        'FaceRectStyle': 0,
        'moveList': '',
        'flip': 1,
        'updw': 0,
        'rota': 0,
        'fill': 1,
        'roiX': 0,
        'roiY': 0,
        'roiW': 0,
        'roiH': 0,
        'brightnessMin': 50,
        'brightnessMax': 255,
        'showFaceRect': 0,
        'delay': 0,
        'stableCount': 0,
        'stableThreshold': 0,
        'unliveEvent': 0,
        'multiFace': 0,
        'distanceFromAxis': 0,
        'openByThread': 1,
        'savePath': '',
        'backgroundGray': 255,
        'LocalFileCache': 1,
        'saveResult': '',
        'backlightInterval': 0,
        'backlightRangeVis': '9,14',
        'backlightRangeNir': '4,13',
        'threshold_eye': 60,
        'threshold_mouth': 15,
        'threshold_headYaw': 10,
        'threshold_headPitch': 8,
        'language': 0,
        'detectInterval': 0,
        'liveInterval': 0,
        'dualCameras': '735f2209735f2210',
        'singleCameras': '08060806'
      }
      // userInfo: { // 模拟身份证识别
      //   name: '梁国江',
      //   idcode: '440183198907185213',
      //   imagePath: '', // 图片本地路径
      //   imagebase64: '' // 图片base64
      // }
    }
  },
  mounted() {
    // this.faceIdentify()
    if (this.device === 'MD' || this.$utils.getLocalItem('tId').includes('MD')) {
      this.init(this.params).then(() => {
        if (this.$utils.getItem('userInfo') && JSON.stringify(this.$utils.getItem('userInfo')) !== '{}') {
          this.userInfo = this.$utils.getItem('userInfo')
        }
        this.openCamera()
      })
    } else if (this.device === 'ZW' || this.device === 'HDY' || this.$utils.getLocalItem('tId').includes('ZW')) {
      if (this.$utils.getItem('userInfo') && JSON.stringify(this.$utils.getItem('userInfo')) !== '{}') {
        this.userInfo = this.$utils.getItem('userInfo')
      }
      this.ZW_init()
    } else {
      face({ Type: '04' }).then(res => { // 先反初始化再操作，进成功回调就往下走，一般没调用初始化再反初始化会报4000
        setTimeout(() => {
          if (this.$utils.getItem('userInfo') && JSON.stringify(this.$utils.getItem('userInfo')) !== '{}') {
            this.userInfo = this.$utils.getItem('userInfo')
            this.faceIdentify()
          } else {
            // this.$utils.showError('获取身份证信息失败，请先识别身份证')
            // this.$router.go(-1)
          }
        }, 500)
      })
    }
  },
  created() {
    const device = this.$utils.getLocalItem('device')
    this.device = device || ''
  },
  destroyed() {
    // 页面销毁
    console.log('离开页面，断开websocket连接')
    CameraHelperWS.disconnect()
    FaceMatchWs.disconnect2()
    this.websock.close()
    clearInterval(this.timer)
    if (this.$loading) {
      this.$loading().close()
    }
  },
  methods: {
    init(params) {
      CameraHelperWS.initParam(params)
      return new Promise((resolve, reject) => {
        CameraHelperWS.connect(() => { // 连接成功
          resolve()
        }, function() {
          reject()
        })
      })
    },
    // 美鼎打开摄像头
    openCamera() {
      CameraHelperWS.openCam(() => {}, () => {}, previewData => {
        this.imgPreview = 'data:image/jpg;base64,' + previewData
        setTimeout(() => {
          CameraHelperWS.faceCheck((data) => {
            if (data.includes('$&')) {
              const arrayData = data.split('$&')		// 结果数据格式：全图+"$&"+坐标+"$&"+默认裁剪图
              this.imgBase64 = arrayData[0]
              this.exit()
            }
          })
        }, 3000)
      })
      this.timer = setInterval(() => {
        if (this.imgBase64) { // 抓拍成功，比对
          // 拿到抓拍图片，清除定时器
          clearInterval(this.timer)
          // 连接比对websocket
          console.log('开始连接比对socket')
          FaceMatchWs.connect(this.url, () => {
            console.log('连接比对socket成功')
            FaceMatchWs.initSDK(() => {
              console.log('初始化成功')

              // 开始比对
              this.$loading({ text: '正在进行活体图片和证件照比对' })
              // 图片一提取特征
              FaceMatchWs.extractFeat(this.userInfo.photobase64, idCard_pic => {
                console.log('身份证照片提取特征成功')
                FaceMatchWs.extractFeat(this.imgBase64, face_pic => {
                  console.log('活体照片提取特征成功')
                  FaceMatchWs.matchTwoFeat(idCard_pic, face_pic, score => {
                    console.log(score, '分值')
                    if (+score < 65) {
                      this.backPage('人脸识别失败，请退出页面重试')
                    } else {
                      this.$loading().close()
                      this.$utils.showSuccess('人脸识别成功')
                      // 反初始化
                      FaceMatchWs.exitSDK(() => {
                        // 断开长连接
                        CameraHelperWS.disconnect()
                        FaceMatchWs.disconnect2()
                        this.handleLogin(this.imgBase64)
                      })
                    }
                  }, () => {
                    this.backPage('身份证图片与活体图片比对出现问题，请退出页面重试')
                  })
                }, () => {
                  this.backPage('活体照片特征提取失败，请退出页面重试！')
                })
              }, () => {
                this.backPage('身份证特征提取失败，请退出页面重试')
              })
            }, () => {
              console.log('初始化失败')
            })
          }, () => {
            this.$utils.showError('socket连接失败')
            clearInterval(this.timer)
          })
        }
      }, 1000)
    },
    backPage(errmsg) {
      this.$loading().close()
      this.$utils.showError(errmsg)
      this.$loading().close()
      // 反初始化
      FaceMatchWs.exitSDK(() => {
        // 断开长连接
        CameraHelperWS.disconnect()
        FaceMatchWs.disconnect2()
        this.$router.go(-1)
      })
    },
    // 美鼎，退出
    exit() {
      console.log('可以退出')
      return new Promise((resolve, reject) => {
        CameraHelperWS.disconnect(() => {
          resolve()
        }, () => {
          reject()
        })
      })
    },
    handleCanel() {
      if (this.device === 'MD' || this.$utils.getLocalItem('tId').includes('MD')) {
        this.exit().then(() => {
          this.$router.go(-1)
        })
      } else if (this.device === 'ZW' || this.device === 'HDY' || this.$utils.getLocalItem('tId').includes('ZW')) {
        console.log('取消进入zw');
        this.websock.send('bStopPlay()')
        this.websock.send('bStopPlay4()')
        this.websock.close()
        this.$router.go(-1)
      } else {
        face({ Type: '04' }).then(res => {
          this.$router.go(-1)
        })
      }
    },
    faceIdentify() {
      const time = new Date().getTime()
      const Imagepath = `D:/faceImage/${time}.jpg`
      this.$loading({ text: '正在初始化' })
      face({ Type: '01' }).then(result => {
        this.$loading().close()
        if (+result.code === 10000) {
          setTimeout(() => {
            face({ Type: '02', Imagepath }).then(res => {
              if (+res.code === 10000) {
                // 模拟身份证识别
                // this.userInfo.imagePath = Imagepath
                setTimeout(() => {
                  this.$loading({ text: '正在进行活体图片和证件照比对' })
                  face({ Type: '03', Photopath1: this.userInfo.imagePath, Photopath2: Imagepath }).then(resp => {
                    this.$loading().close()
                    if (+resp.code === 10000) {
                      if (resp.score < 45) {
                        this.$utils.showError('人脸识别失败，请重试')
                        this.$router.go(-1)
                        this.uninit()
                      } else {
                        this.$utils.showSuccess('人脸识别成功')
                        face({ Type: '05', Imagepath }).then(data => {
                          // 反初始化
                          this.uninit()
                          // 存储base64
                          // this.userInfo.imagebase64 = data.imagebase64
                          this.handleLogin(data.imagebase64)
                        })
                      }
                    } else {
                      this.$utils.showError('身份证图片与活体图片比对出现问题，请退出页面重试')
                      this.uninit()
                    }
                  })
                }, 500)
              } else {
                this.$utils.showError(res.msg + '请退出页面重试')
              }
            })
          }, 500)
        } else {
          this.$utils.showError('初始化活体校验失败，请退出页面重试')
        }
      })
    },
    uninit() {
      face({ Type: '04' })
    },
    handleLogin(base64) {
      const data = {
        name: this.userInfo.name,
        idNum: (this.device === 'MD' || this.$utils.getLocalItem('tId').includes('MD')) ? this.userInfo.cardno : this.userInfo.idcode,
        // name: '梁国江',
        // idNum: '440183198907185213',
        idType: '1',
        userName: 'hbqykb',
        password: 'a1c5ba40a15549998e85db4a7123bca1',
        self: { // 扩展内容
          'userGender': this.userInfo.sex,
          'userIdcAddress': this.userInfo.addr,
          // 'userIdcFrontSrc': 'c9b22537be394d96bfe56e64d96687f9.jpg',
          'userIdcFrontSrc': '', // 用人脸识别头像覆盖身份证照
          'userIdcNation': this.userInfo.nation,
          'userIdcType': '身份证',
          // 'userIdcValidDateScope': this.userInfo.startDate + '~' + this.userInfo.endDate,
          'userIdnumber': this.userInfo.idcode,
          'userName': this.userInfo.name
        }
      }
      this.$utils.showLoading({ text: '正在登录，请稍后' })
      // 进行二次登录，保存人脸照，因为上传接口需要依赖token
      login(data).then(res => {
        if (+res.resultCode === 1) {
          setLocalItem('token', res.data.token)
          // 加入过期时间
          setLocalItem('expiryDate', new Date().getTime() + 1000 * 60 * 60 * 24)
          // 转换base64图片到后台，存储路径（暂时没用）
          console.log('base64', base64)
          const index = base64.lastIndexOf(',')
          const FileBase64 = base64.substring(index + 1, base64.length)
          const file = this.$utils.base64ToFile(FileBase64)
          const formData = new FormData()
          formData.append('file', file)
          uploadFile(formData).then(result => {
            console.log('文件上传')
            // 存储完成，更新userInfo
            this.userInfo.facePic = result.files.file
            data.self.userIdcFrontSrc = result.files.file
            // 再次发起登录
            login(data).then(res => {
              this.$utils.hideLoading()
              if (+res.resultCode === 1) {
                setLocalItem('token', res.data.token)
                setLocalItem('expiryDate', new Date().getTime() + 1000 * 60 * 60 * 24)
                this.$utils.showSuccess('登录成功！')
                // 更新完成以后进行登录注册（登录注册成功以后删除sessionStroage缓存里面的userInfo，改用localStroage）
                const userInfo = {
                  name: res.data.name,
                  idNumber: res.data.idNum,
                  facePic: this.userInfo.facePic
                }
                if(this.device === 'ZW') {
                  console.log('登陆成功，尝试关闭zw摄像头')
                  this.websock.send('bStopPlay()')
                  this.websock.send('bStopPlay4()')
                  this.websock.close()
                }
                // 获取用户信息成功以后存储到storage和vueX中
                setLocalItem('userInfo', userInfo)
                this.$store.commit('login/SET_USER_INFO', userInfo)
                this.$utils.removeItem('userInfo')
                this.$router.replace('/')
              }
            }).catch(() => {
              this.$utils.hideLoading()
            })
          })
        } else {
          this.$utils.showError('登录失败，请联系管理员！')
        }
      }).catch(() => {
        this.$utils.hideLoading()
      })
    },
    // init函数可在页面加载的时候就进行初始化或者根据自己的业务需求在需要打开通讯的时候在进行初始化
    ZW_init() {
    // 实例化socket，这里的实例化直接赋值给this.websock是为了后面可以在其它的函数中也能调用websocket方法，例如：this.websock.close(); 完成通信后关闭WebSocket连接
      this.websock = new WebSocket('ws://127.0.0.1:1818')

      // 监听是否连接成功
      this.websock.onopen = () => {
        console.log('websock连接状态：' + this.websock.readyState)
        // 连接成功则发送一个数据
        this.websock.send('vSetResolution(2)')
        this.websock.send('bStartPlay6(0)')
        this.websock.send('bStartPlay4(0)')
        setTimeout(() => {
          this.$loading({ text: '正在进行活体检测' })
          this.websock.send('bLivingBodyDetect(0.5,0.4)')
        }, 5000)
      }
      // 接听服务器发回的信息并处理展示
      this.websock.onmessage = (event) => {
        // console.log('接收返回的data：', event.data)
        if (event.data.indexOf('BeginbLivingBodyDetect') >= 0) {
          console.log('活体检测结果', (event.data.replace('BeginbLivingBodyDetect', '').replace('EndbLivingBodyDetect', '')))
          if ((event.data.replace('BeginbLivingBodyDetect', '').replace('EndbLivingBodyDetect', '')) === 'true') {
            this.$utils.showSuccess('活体检测成功')
            this.$loading().close()
            setTimeout(() => {
              this.$loading({ text: '正在进行人脸对比' })
              this.websock.send('sGetBase64')
              const time = new Date().getTime()
              const Imagepath = `D:\\\\faceImage\\\\${time}.jpg`
              this.websock.send(`bSaveJPG(D:\\faceImage\\,${time})`)
              console.log('人脸', Imagepath)
              console.log('证件', this.userInfo.photoUrl)
              setTimeout(() => {
                this.websock.send(`lImageMatch(${Imagepath},${this.userInfo.photoUrl})`)
              }, 5000)
            }, 2000)
          } else {
            this.$utils.showError('活体检测失败,请退出页面重试')
            this.$loading().close()
            this.websock.close()
            this.$router.go(-1)
          }
          return
        }
        if (event.data.indexOf('BeginlImageMatch') >= 0) {
          this.$loading().close()
          if ((event.data.replace('BeginlImageMatch', '').replace('EndlImageMatch', '')) >= 5000) {
            this.$utils.showSuccess('人脸对比成功')
            this.handleLogin(this.imgBase)

          } else {
            this.$utils.showError('人脸对比失败')
            this.websock.onclose()
            this.$router.go(-1)
          }
        }
        if (event.data === 'BeginbStopPlaytrueEndbStopPlay') {
          return
        }
        this.imgPreview = 'data:image/jpg;base64,' + event.data
        this.imgBase = 'data:image/jpg;base64,' + event.data
      }
      // 监听连接关闭事件
      this.websock.onclose = () => {
        console.log('websock：' + this.websock)
        console.log('websock连接状态onclose：' + this.websock.readyState)
        this.websock.send('bStopPlay()')
        this.websock.send('bStopPlay4()')
        this.websock.close()
      // 监听整个过程中websocket的状态
      }

      // 监听并处理error事件
      this.websock.onerror = function(error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.face-box {
  min-height: calc(100vh - 100px);
  background: #4C4C4C;
  .box {
    .title {
      text-align: center;
      padding-top: 81px;
      font-size: 28px;
      font-weight: 600;
      color: #fff;
      line-height: 40px;
    }
    .tips {
      display: flex;
      height: 30px;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #fff;
      padding-top: 15px;
      opacity: .7;
      img {
        width: 22px;
        height: 22px;
        margin-right: 10px;
      }
    }
    .camera {
      width: 637px;
      height: 541px;
      margin: 0 auto;
      // background: #fff;
      margin-top: 41px;
    }
  }
  .btn-group {
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    .el-button {
      width: 155px;
      height: 48px;
      padding: 0;
      box-sizing: border-box;
      text-align: center;
      line-height: 48px;
      border: 1px solid #3162E8;
      color: #fff;
    }
  }
}
</style>
