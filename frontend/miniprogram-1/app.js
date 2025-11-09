// app.js
App({
  onLaunch() {
    let hasuserinfo=wx.getStorageSync('hasUserInfo');
    let hasuserid=wx.getStorageSync('hasuserid');
    let haslogin=hasuserid&&hasuserinfo
    const avatarurl="https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"
    const nickname="点击登录"
    if(!haslogin)
    {
      wx.setStorageSync('userImage',avatarurl)
      wx.setStorageSync('userId', nickname)
    }
    this.navonshow()
  },
  navonshow() {
    const rect = wx.getMenuButtonBoundingClientRect()
    var device=wx.getDeviceInfo()
    const isAndroid = device.platform === 'android'
    const isDevtools = device.platform === 'devtools'
    var res=wx.getWindowInfo()
    const ios=!isAndroid
    const innerPaddingRight=`padding-right: ${res.windowWidth - rect.left}px`
    const leftWidth=`width: ${res.windowWidth - rect.left }px`
    const safeAreaTop=isDevtools || isAndroid ? `height: calc(var(--height) + ${res.safeArea.top}px); padding-top: ${res.safeArea.top}px` : ``
    wx.setStorageSync('ios', ios)
    wx.setStorageSync('innerPaddingRight', innerPaddingRight)
    wx.setStorageSync('leftWidth', leftWidth)
    wx.setStorageSync('safeAreaTop', safeAreaTop)
  },
  globalData: {
    userInfo: null,
    accountinfo:null,

  }
})
