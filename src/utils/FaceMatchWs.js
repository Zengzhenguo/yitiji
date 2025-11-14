
export default {
  socket2: null,
  host2: null,
  sendMsg2(msg) {
    if (this.socket2) {
      this.socket2.send(msg)
    }
    //  else {
    //   alert('socket连接失败，可能connet未调用。')
    // }
  },
  callback: { 'initSDK': [], 'exitSDK': [], 'extractFeat': [], 'matchTwoFeat': [] },
  getSocketStatus2() {
    if (this.socket2) return this.socket2.readyState
  },

  connect(url, onSucc, onErr) {
    if (typeof this.socket2 === 'object' && this.socket2 != null) return// 防止重复创建socket
    console.log(111)
    onSucc = onSucc || function() { console.log('socket连接成功') }
    onErr = onErr || function() { console.log('socket连接失败') }

    if (url) {
      this.host2 = url
    }

    this.socket2 = new WebSocket(this.host2)
    // CONNECTING:0
    // OPEN:1
    // CLOSING:2
    // CLOSED:3
    this.socket2.onopen = (msg) => {
      if (this.socket2.readyState === WebSocket.OPEN) {
        if (onSucc) {
          onSucc()
        }
      } else {
        if (onErr) onErr()
      }
    }
    this.socket2.onclose = (msg) => {
      // console.log("onclose:"+msg);
    }
    this.socket2.onerror = (msg) => {
      onErr(10001, '连接失败')
    }
    this.socket2.onmessage = (msg) => {
      if (typeof msg.data !== 'string') return
      var arrayMsg = msg.data.split('$&')
      // console.log("length="+arrayMsg.length);
      // console.log(msg.data);
      if (arrayMsg.length < 2) return
      var cmd = arrayMsg[0]
      var ret = arrayMsg[1]
      switch (cmd) {
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
          } else { // 提取特征失败
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
  disconnect2(onSucc, onErr) {
    onSucc = onSucc || function() {}
    onErr = onErr || function() {}
    if (typeof this.socket2 === 'object' && this.socket2 != null) {
      this.socket2.onclose = function() {}
      this.socket2.close()
      this.socket2 = null
    }
    onSucc()
  },

  // 初始化
  initSDK(onSucc, onErr) {
    onSucc = onSucc || function() { console.log('初始化成功') }
    onErr = onErr || function(msg) { console.log('初始化失败:' + msg) }
    this.callback['initSDK'][0] = onSucc
    this.callback['initSDK'][1] = onErr
    this.sendMsg2('2000')
  },

  // 反初始化
  exitSDK(onSucc, onErr) {
    onSucc = onSucc || function() { console.log('反初始化成功') }
    onErr = onErr || function(msg) { console.log('反初始化失败:' + msg) }
    this.callback['exitSDK'][0] = onSucc
    this.callback['exitSDK'][1] = onErr
    this.sendMsg2('2001')
  },

  // 提取特征
  extractFeat(imgB64, onSucc, onErr) {
    onSucc = onSucc || function(featB64) { console.log('提取特征成功') }
    onErr = onErr || function(msg) { console.log('提取特征失败:' + msg) }
    this.callback['extractFeat'][0] = onSucc
    this.callback['extractFeat'][1] = onErr
    this.sendMsg2('2002$&' + imgB64)
  },

  // 特征比对
  matchTwoFeat(featB64_1, featB64_2, onSucc, onErr) {
    console.log('进入比对')
    onSucc = onSucc || function(score) { console.log('比对成功 ' + score) }
    onErr = onErr || function(msg) { console.log('比对失败:' + msg) }
    this.callback['matchTwoFeat'][0] = onSucc
    this.callback['matchTwoFeat'][1] = onErr
    this.sendMsg2('2003$&' + featB64_1 + '$&' + featB64_2)
  }
}
