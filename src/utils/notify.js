import { Loading, Message, MessageBox, Notification } from 'element-ui'
let loadingInstance

const showLoading = function (options = {}) {
  // console.log('使用$Loading时的配置', options)
  loadingInstance = Loading.service({
    text: options.text || options.title || '加载中...', // 显示在加载图标下方的加载文案
    fullscreen: options.fullscreen || true, // 全屏遮罩,如果为true时遮罩会插入至 body 上
    lock: options.lock || true, // 是否锁定屏幕的滚动
    body: options.body || true, // 遮罩是否插入至 DOM 中的 body 上
    spinner: options.spinner || 'el-icon-loading', // 自定义加载图标类名
    background: options.background || 'hsla(0,0%,100%,.9)', // 遮罩背景色
    customClass: options.customClass// Loading 的自定义类名
  })
}
const hideLoading = function () {
  loadingInstance.close()
}
const message = function (options = {}) {
  // console.log('使用$Message时的配置', options)
  Message({
    type: options.message || 'info', // 主题success/warning/info/error
    message: options.message || '暂无消息', // 消息文字
    iconClass: options.iconClass, // 自定义图标的类名，会覆盖 type
    dangerouslyUseHTMLString: options.dangerouslyUseHTMLString || false, // 是否将 message 属性作为 HTML 片段处理
    customClass: options.customClass || '暂无消息', // 自定义类名
    duration: options.duration || 3000, // 显示时间, 毫秒。设为 0 则不会自动关闭
    showClose: options.showClose || true, // 是否显示关闭按钮
    center: options.center || true, // 文字是否居中
    onClose: options.onClose, // 关闭时的回调函数, 参数为被关闭的 message 实例
    offset: options.offset || 20 // Message 距离窗口顶部的偏移量
  })
}
// Message.closeAll() // 手动关闭所有实例
const showToast = function (options = {}) {
  // console.log('使用$MessageBox时的配置', options)
  MessageBox({
    title: options.title || '提醒', // MessageBox 标题
    message: options.message, // MessageBox 消息正文内容
    dangerouslyUseHTMLString: options.dangerouslyUseHTMLString || false,
    type: options.type, // 消息类型，用于显示图标success / info / warning / error
    iconClass: options.iconClass, // 自定义图标的类名，会覆盖 type
    customClass: options.customClass, // MessageBox 的自定义类名
    showClose: options.showClose || true, // MessageBox 是否显示右上角关闭按钮
    distinguishCancelAndClose: options.distinguishCancelAndClose || false, // 是否将取消（点击取消按钮）与关闭（点击关闭按钮或遮罩层、按下 ESC 键）进行区分
    lockScroll: options.lockScroll || true, // 是否在 MessageBox 出现时将 body 滚动锁定
    showConfirmButton: options.showConfirmButton || true, // 是否显示确定按钮
    confirmButtonText: options.confirmButtonText || '确定', // 确定按钮的文本内容
    showCancelButton: options.showCancelButton || true, // 是否显示取消按钮
    cancelButtonText: options.cancelButtonText || '取消', // 取消按钮的文本内容
    closeOnClickModal: options.closeOnClickModal || false, // 是否可通过点击遮罩关闭 MessageBox
    closeOnPressEscape: options.closeOnPressEscape || false, // 是否可通过按下 ESC 键关闭 MessageBox
    closeOnHashChange: options.closeOnHashChange || true, // 是否在 hashchange 时关闭 MessageBox
    center: options.center || true, // 是否居中布局
    roundButton: options.roundButton, // 是否使用圆角按钮
    beforeClose: options.beforeClose // MessageBox 关闭前的回调，会暂停实例的关闭
  }).then(() => {
    // message({message: '点击确定'})
    if (options.handleConfirm) options.handleConfirm()
  }).catch(() => {
    // message({message: '点击取消'})
    if (options.handleConfirm) options.handleConfirm()
  })
}
export default { showLoading, hideLoading, message, showToast, Notification }
