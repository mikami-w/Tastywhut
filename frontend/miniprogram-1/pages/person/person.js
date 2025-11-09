// pages/person/person.js

  Page({
    data:{
      nickname:"",
      userimage:"",
      showaddshop:true,
      haslogin:false
    },
    onLoad(options){
      let accountinfo=__wxConfig.envVersion;
      console.log(accountinfo)
      this.showaddshop(accountinfo)
      // const app=getApp();
      // var nickname=(wx.getStorageSync('userId')||[])
      // var userimage=(wx.getStorageSync('userImage')||[])
      // this.setData({
      //   nickname:nickname,
      //   userimage:userimage
      // })
    },
    showaddshop(info){
      if(info!='release')
      {
        this.setData({
          showaddshop:false
        })
      }
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
    goToMyEvaluation: function() {
      if(this.data.haslogin){
        wx.navigateTo({
          url: '/pages/evaluate/evaluate',
        })
      }
      else{
        this.showlogin()
      }
    },
    gotoaddfood(){
      if(this.data.haslogin){
        wx.navigateTo({
          url: '/pages/addfood/addfood',
        })
      }
      else{
        this.showlogin()
      }
    },
    gotouserinfo(){
      if(this.data.haslogin){
        wx.navigateTo({
          url: '/pages/userinfo/userinfo',
        })
      }
      else{
        this.showlogin()
      }
      
    },
    gotoaboutus(){
      wx.navigateTo({
        url: '/pages/aboutus/aboutus',
      })
    },
    onShow(){
      var nickname=(wx.getStorageSync('userId'))
      var userimage=(wx.getStorageSync('userImage'))
      var hasuserinfo=wx.getStorageSync('hasUserInfo')
      var hasuserid=wx.getStorageSync('hasuserid')
      let haslogin=hasuserinfo&&hasuserid
      this.setData({
        nickname:nickname,
        userimage:userimage,
        haslogin:haslogin
      })
    }
  });

  /**
   * 生命周期函数--监听页面加载
   */

 