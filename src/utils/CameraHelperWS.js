
export default {
  socket: null,
  host: null,
  paramsInner: null,
  callback: { 'openCam': [], 'faceCheck': [], 'closeCam': [], 'cropImage': [], 'snapFrame': [], 'initSDK': [], 'exitSDK': [], 'extractFeat': [], 'matchTwoFeat': [] },
  sendMsg(msg) {
    if (this.socket) {
      this.socket.send(msg)
    }
    //  else {
    //   alert('socket连接失败，可能connet未调用。')
    // }
  },

  // 初始化：传入json参数、传入回调、创建ws并初始化
  initParam(paramsObj) {
    // 参数赋值
    if (paramsObj) {
      this.host = paramsObj['host']
      this.paramsInner = paramsObj
    }
  },
  getSocketStatus() {
    if (this.socket) return this.socket.readyState
  },
  connect(onSucc, onErr) {
    // console.log('进入连接', this.socket)
    if (typeof this.socket === 'object' && this.socket != null) return// 防止重复创建socket
    onSucc = onSucc || function() { console.log('socket连接成功') }
    onErr = onErr || function() { console.log('socket连接失败') }

    this.socket = new WebSocket(this.host)
    console.log(this.socket, this.host)
    // CONNECTING:0
    // OPEN:1
    // CLOSING:2
    // CLOSED:3
    this.socket.onopen = (msg) => {
      if (this.socket.readyState === WebSocket.OPEN) {
        console.log(111)
        if (onSucc) {
          onSucc()
        }
      } else {
        if (onErr) onErr()
      }
    }
    this.socket.onclose = (msg) => {
      // console.log("onclose:"+msg);
    }
    this.socket.onerror = (msg) => {
      onErr(10001, '连接失败')
    }
    this.socket.onmessage = (msg) => {
      if (typeof msg.data !== 'string') return
      const arrayMsg = msg.data.split('$&')
      // console.log("length="+arrayMsg.length);
      // console.log(msg.data);
      if (arrayMsg.length < 2) return
      const cmd = arrayMsg[0]
      const ret = arrayMsg[1]
      switch (cmd) {
        case '203':	// 打开双模
          if (ret === '0') {
            this.callback['openCam'][0]()
          } else {
            this.callback['openCam'][1](ret, '打开失败')
          }
          break

        case '204' : // 关闭设备
          this.callback['closeCam'][0]()
          break

        case '205' : // 检活结果
          if (ret === '0') {	// 启动检活成功，不做提示

          } else if (ret === '100') {	// 检活成功，显示结果图像
            this.callback['faceCheck'][0](arrayMsg[2] + '$&' + arrayMsg[3] + '$&' + arrayMsg[4])
            // console.log('检活成功' + ret)
          } else { // 检活失败，含启动失败+结果失败
            // console.log('ack=206:ret=' + ret)
            if (ret !== '104') {	// “取消”不再回调
              this.callback['faceCheck'][1](ret, '检活失败')
            }
          }

          break

        case '207':
          if (ret === '0') {
            this.callback['cropImage'][0](arrayMsg[2])
          } else {
            this.callback['cropImage'][1](ret, '裁剪失败')
          }
          break

        case '208':
          if (ret === '0') {
            this.callback['snapFrame'][0](arrayMsg[2] + '$&' + arrayMsg[3])
          } else {
            this.callback['snapFrame'][1](ret, '抓拍失败')
          }
          break
        case '300': // 预览数据
          this.callback['openCam'][2](arrayMsg[2])
          break
        case '2000':	// 初始化
          if (ret === '0') {
            this.callback['initSDK'][0]()
          } else {
            this.callback['initSDK'][1](ret, '初始化失败')
          }
          break

        case '2001' : // 反初始化
          this.callback['exitSDK'][0]()
          break

        case '2002' : // 提取特征
          if (ret === '0') {
            this.callback['extractFeat'][0](arrayMsg[2])
          } else {
            this.callback['extractFeat'][1](ret, '提取特征失败')
          }

          break

        case '2003':	// 特征比对
          if (ret === '0') {
            this.callback['matchTwoFeat'][0](arrayMsg[2])
          } else {
            this.callback['matchTwoFeat'][1](ret, '比对失败')
          }
          break
      }
    }
  },

  // 断开连接(释放websocket对象)
  disconnect(onSucc, onErr) {
    onSucc = onSucc || function() {}
    onErr = onErr || function() {}
    if (typeof this.socket === 'object' && this.socket != null) {
      this.socket.onclose = function() {}
      this.socket.close()
      this.socket = null
    }
    onSucc()
  },

  // 打开双模设备
  openCam(onSucc, onErr, onPreview) {
    onSucc = onSucc || function() { console.log('打开摄像头成功') }
    onErr = onErr || function(msg) { console.log('打开摄像头失败:' + msg) }
    onPreview = onPreview || function(data) {}
    this.callback['openCam'][0] = onSucc
    this.callback['openCam'][1] = onErr
    this.callback['openCam'][2] = onPreview
    this.sendMsg('203$&' + JSON.stringify(this.paramsInner))
  },

  // 启动双模检活
  faceCheck(onSucc, onErr) {
    onSucc = onSucc || function() { /* console.log('检活成功')*/ }
    onErr = onErr || function(msg) { /* console.log('检活失败:' + msg) */ }
    this.callback['faceCheck'][0] = onSucc
    this.callback['faceCheck'][1] = onErr
    this.sendMsg('205')
  },

  // 关闭设备
  closeCam(onSucc, onErr) {
    onSucc = onSucc || function() { console.log('关闭成功') }
    onErr = onErr || function(msg) { console.log('关闭失败:' + msg) }
    this.callback['closeCam'][0] = onSucc
    this.callback['closeCam'][1] = onErr
    this.sendMsg('204')
  },

  // 裁剪
  cropImage(imgWhole, faceRc, maxSize, onSucc, onErr) {
    onSucc = onSucc || function() { console.log('裁剪成功') }
    onErr = onErr || function(msg) { console.log('裁剪失败:' + msg) }
    this.callback['cropImage'][0] = onSucc
    this.callback['cropImage'][1] = onErr
    this.sendMsg('207$&' + imgWhole + '$&' + faceRc + '$&' + maxSize)
  },

  // 抓拍当前帧
  snapFrame(mode, onSucc, onErr) {
    onSucc = onSucc || function() { console.log('获取成功') }
    onErr = onErr || function(msg) { console.log('获取失败:' + msg) }
    this.callback['snapFrame'][0] = onSucc
    this.callback['snapFrame'][1] = onErr
    this.sendMsg('208$&' + mode)
  },
  // 初始化
  initSDK(onSucc, onErr) {
    console.log('初始化进来了吗')
    onSucc = onSucc || function() { console.log('初始化成功') }
    onErr = onErr || function(msg) { console.log('初始化失败:' + msg) }
    this.callback['initSDK'][0] = onSucc
    this.callback['initSDK'][1] = onErr
    this.sendMsg('2000')
  },

  // 反初始化
  exitSDK(onSucc, onErr) {
    console.log('反初始化进来了')
    onSucc = onSucc || function() { console.log('反初始化成功') }
    onErr = onErr || function(msg) { console.log('反初始化失败:' + msg) }
    this.callback['exitSDK'][0] = onSucc
    this.callback['exitSDK'][1] = onErr
    this.sendMsg('2001')
  },

  // 提取特征
  extractFeat(imgB64, onSucc, onErr) {
    onSucc = onSucc || function(featB64) { console.log('提取特征成功') }
    onErr = onErr || function(msg) { console.log('提取特征失败:' + msg) }
    this.callback['extractFeat'][0] = onSucc
    this.callback['extractFeat'][1] = onErr
    this.sendMsg('2002$&' + imgB64)
  },

  // 特征比对
  matchTwoFeat(featB64_1, featB64_2, onSucc, onErr) {
    console.log('进入比对')
    onSucc = onSucc || function(score) { console.log('比对成功 ' + score) }
    onErr = onErr || function(msg) { console.log('比对失败:' + msg) }
    this.callback['matchTwoFeat'][0] = onSucc
    this.callback['matchTwoFeat'][1] = onErr
    this.sendMsg('2003$&' + featB64_1 + '$&' + featB64_2)
  }

}
