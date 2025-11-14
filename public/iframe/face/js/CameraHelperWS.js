
var CameraHelperWS = (function() {
  var socket
  var host
  var paramsInner

  var sendMsg = function(msg) {
    if (socket) socket.send(msg)
    else alert('socket连接失败，可能connet未调用。')
  }
  var EcFaceWS = {
    callback: { 'openCam': [], 'faceCheck': [], 'closeCam': [], 'cropImage': [], 'snapFrame': [] },
    // 初始化：传入json参数、传入回调、创建ws并初始化
    initParam: function(paramsObj) {
      // 参数赋值
      if (paramsObj) {
        host = paramsObj['host']
        paramsInner = paramsObj
      }
    },
    getSocketStatus: function() {
      if (socket) return socket.readyState
    },
    connect: function(onSucc, onErr) {
      if (typeof socket === 'object' && socket != null) return// 防止重复创建socket
      var that = this
      onSucc = onSucc || function() { console.log('socket连接成功') }
      onErr = onErr || function() { console.log('socket连接失败') }

      socket = new WebSocket(host)
      // CONNECTING:0
      // OPEN:1
      // CLOSING:2
      // CLOSED:3
      socket.onopen = function(msg) {
        if (socket.readyState == WebSocket.OPEN) {
          if (onSucc) {
            onSucc()
          }
        } else {
          if (onErr) onErr()
        }
      }
      socket.onclose = function(msg) {
        // console.log("onclose:"+msg);
      }
      socket.onerror = function(msg) {
        onErr(10001, '连接失败')
      }
      socket.onmessage = function(msg) {
        if (typeof msg.data !== 'string') return
        var arrayMsg = msg.data.split('$&')
        // console.log("length="+arrayMsg.length);
        // console.log(msg.data);
        if (arrayMsg.length < 2) return
        var cmd = arrayMsg[0]
        var ret = arrayMsg[1]
        switch (cmd) {
          case '203':	// 打开双模
            if (ret == '0') {
              that.callback['openCam'][0]()
            } else {
              that.callback['openCam'][1](ret, '打开失败')
            }
            break

          case '204' : // 关闭设备
            that.callback['closeCam'][0]()
            break

          case '205' : // 检活结果
            if (ret == '0')	// 启动检活成功，不做提示
            {

            } else if (ret == '100')	// 检活成功，显示结果图像
            {
              that.callback['faceCheck'][0](arrayMsg[2] + '$&' + arrayMsg[3] + '$&' + arrayMsg[4])
              console.log('检活成功' + ret)
            } else // 检活失败，含启动失败+结果失败
            {
              console.log('ack=206:ret=' + ret)
              if (ret != '104')	// “取消”不再回调
              {
                that.callback['faceCheck'][1](ret, '检活失败')
              }
            }

            break

          case '207':
            if (ret == '0') {
              that.callback['cropImage'][0](arrayMsg[2])
            } else {
              that.callback['cropImage'][1](ret, '裁剪失败')
            }
            break

          case '208':
            if (ret == '0') {
              that.callback['snapFrame'][0](arrayMsg[2] + '$&' + arrayMsg[3])
            } else {
              that.callback['snapFrame'][1](ret, '抓拍失败')
            }

          case '300': // 预览数据
            that.callback['openCam'][2](arrayMsg[2])
            break
        }
      }
    },

    // 断开连接(释放websocket对象)
    disconnect: function(onSucc, onErr) {
      onSucc = onSucc || function() {}
      onErr = onErr || function() {}
      if (typeof socket === 'object' && socket != null) {
        socket.onclose = function() {}
        socket.close()
        socket = null
      }
      onSucc()
    },

    // 打开双模设备
    openCam: function(onSucc, onErr, onPreview) {
      onSucc = onSucc || function() { console.log('打开摄像头成功') }
      onErr = onErr || function(msg) { console.log('打开摄像头失败:' + msg) }
      onPreview = onPreview || function(data) {}
      this.callback['openCam'][0] = onSucc
      this.callback['openCam'][1] = onErr
      this.callback['openCam'][2] = onPreview
      sendMsg('203$&' + JSON.stringify(paramsInner))
    },

    // 启动双模检活
    faceCheck: function(onSucc, onErr) {
      onSucc = onSucc || function() { console.log('检活成功') }
      onErr = onErr || function(msg) { console.log('检活失败:' + msg) }
      this.callback['faceCheck'][0] = onSucc
      this.callback['faceCheck'][1] = onErr
      sendMsg('205')
    },

    // 关闭设备
    closeCam: (onSucc, onErr) {
      onSucc = onSucc || function() { console.log('关闭成功') }
      onErr = onErr || function(msg) { console.log('关闭失败:' + msg) }
      this.callback['closeCam'][0] = onSucc
      this.callback['closeCam'][1] = onErr
      sendMsg('204')
    },

    // 裁剪
    cropImage: function(imgWhole, faceRc, maxSize, onSucc, onErr) {
      onSucc = onSucc || function() { console.log('裁剪成功') }
      onErr = onErr || function(msg) { console.log('裁剪失败:' + msg) }
      this.callback['cropImage'][0] = onSucc
      this.callback['cropImage'][1] = onErr
      sendMsg('207$&' + imgWhole + '$&' + faceRc + '$&' + maxSize)
    },

    // 抓拍当前帧
    snapFrame: function(mode, onSucc, onErr) {
      onSucc = onSucc || function() { console.log('获取成功') }
      onErr = onErr || function(msg) { console.log('获取失败:' + msg) }
      this.callback['snapFrame'][0] = onSucc
      this.callback['snapFrame'][1] = onErr
      sendMsg('208$&' + mode)
    },
				
		// 初始化
		initSDK:function(onSucc, onErr){
			onSucc = onSucc || function(){console.log("初始化成功");};
			onErr = onErr || function(msg){console.log("初始化失败:"+msg);};
			this.callback["initSDK"][0] = onSucc;
			this.callback["initSDK"][1] = onErr;
			sendMsg("2000");
		},
		
		// 反初始化
		exitSDK:function(onSucc, onErr){
			onSucc = onSucc || function(){console.log("反初始化成功");};
			onErr = onErr || function(msg){console.log("反初始化失败:"+msg);};
			this.callback["exitSDK"][0] = onSucc;
			this.callback["exitSDK"][1] = onErr;
			sendMsg("2001");
		},
		
		// 提取特征
		extractFeat:function(imgB64, onSucc, onErr){
			onSucc = onSucc || function(featB64){console.log("提取特征成功");};
			onErr = onErr || function(msg){console.log("提取特征失败:"+msg);};
			this.callback["extractFeat"][0] = onSucc;
			this.callback["extractFeat"][1] = onErr;
			sendMsg("2002$&"+imgB64);
		}, 
		
		// 特征比对
		matchTwoFeat:function(featB64_1, featB64_2, onSucc, onErr){
			onSucc = onSucc || function(score){console.log("比对成功 "+score);};
			onErr = onErr || function(msg){console.log("比对失败:"+msg);};
			this.callback["matchTwoFeat"][0] = onSucc;
			this.callback["matchTwoFeat"][1] = onErr;
			sendMsg("2003$&"+featB64_1+"$&"+featB64_2);
		}
  }
  return EcFaceWS
})()
