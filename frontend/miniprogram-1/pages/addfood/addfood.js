// pages/addfood/addfood.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:["校外小吃","校内食堂"],
    locnum:0,
    opentime:"00:00",
    closetime:"00:00",
    shopimage:"",
    hasauthor:false,
    show:true,
    buttonready:true,
    shopname:"",
    shopaddress:"",
    shopphone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let hasauthor=wx.getStorageSync('hasauthor')
    this.setData({
      hasauthor:hasauthor
    })
    
    let accountinfo=__wxConfig.envVersion;
    if(accountinfo=='release')
    {
      this.setData({
        show:false
      })
    }
  },
  checkboxchanged(e){
    this.setData({
      hasauthor:!this.data.hasauthor
    })
    

  },
  submitmsg(e){
    if(!this.data.buttonready)
    {
      return;
    }
    if(!this.data.hasauthor)
    {
      wx.showToast({
        icon:"none",
        title: '请同意用户协议！',
      })
      return;
    }
    let k=e.detail.value
    if(Object.keys(k.shopname).length<1||Object.keys(k.shopaddress).length<1||Object.keys(k.shopphone).length<1)
    {
      wx.showToast({
        icon:"none",
        title: '请完善店铺信息！',
      })
      return;
    }

    let that=this;
    this.setData({
      buttonready:false
    })
    var time=k.opentime+'-'+k.closetime
    var msg={"name":k.shopname,"phone":k.shopphone,"address":k.shopaddress,"image":that.data.shopimage,
              "openinghour":time,"locnum":that.data.locnum,}
    console.log(msg)
    console.log(that.data.buttonready)
    wx.request({
      // url: 'http://2l35209f44.iok.la/add_shop',
      url: 'https://www.tastywhut.site/add_shop',
      method:'POST',
      data:{
        name:msg.name,
        phone:msg.phone,
        address:msg.address,
        image:msg.image,
        openinghour:msg.openinghour,
        incampus:msg.locnum
      },  
      header:{
        'content-type':'application/x-www-form-urlencoded',
      },
      success(res){
        wx.setStorageSync('hasauthor', that.hasauthor)
        that.setData({
          buttonready:true,
          shopname:"",
          shopaddress:"",
          shopphone:""
        })
        wx.showToast({
          title: '提交成功！',
        })
        // wx.switchTab({
        //   url: '/pages/person/person',
        // })
      }
    }) 
  },
  bindPickerChange_1:function(e){
    this.setData({
      locnum:e.detail.value
    })
  },
  bindPickerChange_2:function(e){
    this.setData({
      opentime:e.detail.value
    })
  },
  bindPickerChange_3:function(e){
    this.setData({
      closetime:e.detail.value
    })
  },
  chooseimg(){
    let that=this;
    wx.chooseMedia({
      count:1,
      mediaType:['image'],
      sourceType:['album','camera'],
      sizeType:['compressed'],
      camera:'back',
      success(res){
        // console.log(res.tempFiles);
        wx.cropImage({
          cropScale: '1:1',
          src: res.tempFiles[0].tempFilePath,
          success:function(res){
            console.log(res.tempFilePath)
            that.setData({
              shopimage:res.tempFilePath
            })
            that.uploadImage(that.data.shopimage)
          }
        })

      }
    })
    
  },

  uploadImage(imagepath){
    wx.uploadFile({
      filePath: imagepath,
      name: 'file',
      url: 'https://www.tastywhut.site/add_shop_image',
      success:(res)=>{
        this.setData({
          shopimage:res.data
        })
      },
      fail:function(res){
        console.log(res)
      }
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