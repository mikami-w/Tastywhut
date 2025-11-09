// pages/changenickname/changenickname.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:"",
  },
  // onInputChange(e) {
  //   const nickName = e.detail.value
  //   this.setData({
  //     nickname: nickName,
  //   })
  // },
  submit(e){
    console.log(e.detail.value)
    let name=e.detail.value.nickname
    if(name!=""){
      this.setData({
        nickname:name
      })
      this.returnback()
    }
    else{
      this.returnback()
    }
    
    
  },
  returnback(){
    wx.setStorageSync('userId', this.data.nickname)
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      nickname:options.name
    })
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

  }
})