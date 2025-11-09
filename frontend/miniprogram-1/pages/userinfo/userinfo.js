// pages/userinfo/userinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:null,
    nickname:null,
    openid:"",
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    islogout:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // var avatarurl=wx.getStorageSync('userImage')
    // var userid=wx.getStorageSync('userId')
    // this.setData({
    //   avatar:avatarurl,
    //   nickname:userid
    // })
  },
  // changeavatar(){
  //   let that=this;
  //   wx.chooseMedia({
  //     count:1,
  //     mediaType:['image'],
  //     sourceType:['album','camera'],
  //     sizeType:['compressed'],
  //     camera:'back',
  //     success(res){
  //       // console.log(res.tempFiles);
  //       wx.cropImage({
  //         cropScale: '1:1',
  //         src: res.tempFiles[0].tempFilePath,
  //         success:function(res){
  //           console.log(res.tempFilePath)
  //           that.setData({
  //             avatar:res.tempFilePath
  //           })
  //           that.uploadImage(that.data.avatar)
  //         }
  //       })
  //     }
  //   })
    
  // },
  onChooseAvatar(e) {
    let  {avatarUrl}  = e.detail
    this.uploadImage(avatarUrl)
    // this.setData({
    //   "userInfo.avatarUrl": avatarUrl,
    //   hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    // })
  },
  uploadImage(imagepath){
    wx.uploadFile({
      filePath: imagepath,
      name: 'file',
      url: 'https://www.tastywhut.site/add_avatar_image',
      success:(res)=>{
        this.setData({
          avatar:res.data,
        })
        wx.setStorageSync('userImage', this.data.avatar)
        wx.showToast({
            title: '上传成功！'
          })
      },
      fail:function(res){
        console.log(res)
        wx.showToast({
          title: '上传失败',
        })
      }
    })
  },
  changenickname(){
    wx.navigateTo({
      url: '/pages/changenickname/changenickname?name='+this.data.nickname,
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
    var avatarurl=wx.getStorageSync('userImage')
    var userid=wx.getStorageSync('userId')
    var openid=wx.getStorageSync('openid')
    this.setData({
      avatar:avatarurl,
      nickname:userid,
      openid:openid
    })
  },
  
  updateuserinfo(openid,avatar,nickname){
    console.log("update")
    wx.request({
      url: 'https://www.tastywhut.site/updateuserinfo',
      method:'POST',
      data:{
        openid:openid,
        avatar:avatar,
        nickname:nickname
      },
      header:{
        'content-type':'application/x-www-form-urlencoded',
      }
    })
  },
  iflogout(){
    wx.showActionSheet({
      itemList:['退出登录'],
      success:(res)=>{
        switch (res.tapIndex) {
          case 0:
            this.logout();
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/main/main',
              })},2000
              )
            break;
        };
        
      },
      fail(res){
      } 
    })
  },
  logout(){
    this.setData({
      islogout:true
    })
    const avatarurl="https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"
    const nickname="点击登录"
    wx.setStorageSync('userImage',avatarurl)
    wx.setStorageSync('userId', nickname)
    wx.removeStorageSync('openid')
    wx.removeStorageSync('hasUserInfo')
    wx.removeStorageSync('hasuserid')
    wx.showToast({
      title: '正在退出登录',
      icon:'loading',
      duration:2000,
      mask:true,
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
    if(!this.data.islogout){
      this.updateuserinfo(this.data.openid,this.data.avatar,this.data.nickname)
    }
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