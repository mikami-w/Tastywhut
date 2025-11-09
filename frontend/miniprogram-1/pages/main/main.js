// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haslogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let hasuserinfo=wx.getStorageSync('hasUserInfo');
    let hasuserid=wx.getStorageSync('hasuserid');
    let haslogin=hasuserid&&hasuserinfo
    this.setData({
      haslogin:haslogin
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  showlogin(){
    wx.showModal({
      title: '您还没有登录呢，请先登录',
      content: '确定即代表同意授权用户数据',
      success:function(res){
        if(res.confirm){
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
        else if(res.cancel){
          wx.showToast({
            title: '您取消了登录授权！',
            duration: 2000,
            mask:true,
            icon:'none'
          })
        }
      }
    })
  },
  btn_incampus(e){
    if(this.data.haslogin){
      wx.navigateTo({
        url: '../foodlist/foodlist?id=incampus',
      })
    }
    else{
      this.showlogin()
    }
    
  },
  btn_outcampus(e){
    if(this.data.haslogin){
      wx.navigateTo({
        url: '../foodlist/foodlist?id=outcampus',
      })
    }
    else{
      this.showlogin()
    }
  },
  btn_rank(e){
    if(this.data.haslogin){
      wx.navigateTo({
        url: '../foodlist/foodlist?id=rank',
      })
    }
    else{
      this.showlogin()
    }
  },
  // btn_more(e){
  //   wx.navigateTo({
  //     url: '../foodlist/foodlist?id=incampus',
  //   })
  // },

})