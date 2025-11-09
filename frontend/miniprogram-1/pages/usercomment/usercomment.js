// pages/usercomment/usercomment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:{"id":"1"},
    content:"",
    userid:"",
    userimg:"",
    openid:"",
    score:['0.5','1.0','1.5','2.0','2.5','3.0','3.5','4.0','4.5','5.0'],
    index:0,
    show:true,
    // index:0,
    // array:['校内','校外'],

  },
  bindPickerChange:function(e){
    this.setData({
      index:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let accountinfo=__wxConfig.envVersion;
    if(accountinfo=='release')
    {
      this.setData({
        show:false
      })
    }
    this.setData({
      query:options
    })
    this.syncuserinfo()
  },

  syncuserinfo(){
    let id=(wx.getStorageSync('userId')||[]);
    let img=(wx.getStorageSync('userImage')||[]);
    let openid=(wx.getStorageSync('openid'));
    this.setData({
      userid:id,
      userimg:img,
      openid:openid
    })
    console.log(this.data.userid,this.data.userimg,this.data.openid)
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

  },
  content(e){
    this.setData({
      content:e.detail.value
    })
  },
  submitmsg(e){
    var score=this.data.score[this.data.index]
    
    var array={"shopid":this.data.query.id,"content":this.data.content,"userid":this.data.userid,"userimg":this.data.userimg,"score":score,"openid":this.data.openid}
    this.postmsg(array)
  },
  postmsg(array){
    console.log(array);
    wx.request({
      // url: 'http://2l35209f44.iok.la/add_comment',
      url: 'https://www.tastywhut.site/add_comment',
      method:'POST',
      data:{
        shopid:array.shopid,
        content:array.content,
        userid:array.userid,
        userimg:array.userimg,
        score:array.score,
        openid:array.openid
      },
      header:{
        'content-type':'application/x-www-form-urlencoded',
      },
      success(res){
        wx.navigateBack();
      }
    })
  }
})