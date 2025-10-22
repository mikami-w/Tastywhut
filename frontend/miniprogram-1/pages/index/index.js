// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    motto: '用户登录',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    openid:"",
    hasuserid:false,
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    
  },
  
  methods: {
    onLoad(){
      var that=this;
      wx.getStorage({
        key:"userImage",
        success(res){
          that.data.userInfo.avatarUrl=res.data;
          //that.setData({
            // hasUserInfo:true,
          // })
        },
        // fail(){console.log("imgfail");this.setData({hasUserInfo:false})}
      })
      wx.getStorage({
        key:"userId",
        success(res){
          // let name=that.data.userInfo;
          // that.setData({name:res.data})
          that.data.userInfo.nickName=res.data;
          // that.setData({hasUserInfo:true})
        },
        // fail(){console.log("idfail");that.setData({hasUserInfo:false})}
      })
      var key=false;
      wx.getStorage({
        key:"hasUserInfo",
        success(res){
          that.setData({hasUserInfo:res.data});
          
        }
      })
      wx.getStorage({
        key:"hasuserid",
        success(res){
          that.setData({hasuserid:res.data});
        }
      })
      
      
      },
    onShow(){
      let key1=this.data.hasUserInfo;
      let key2=this.data.hasuserid;
      let e=key1&&key2
      this.judge(e);
    },
    // 事件处理函数
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs'
      })
    },
    onChooseAvatar(e) {
      let  {avatarUrl}  = e.detail
      let  {nickName}  = this.data.userInfo
      this.uploadImage(avatarUrl,nickName)
      // this.setData({
      //   "userInfo.avatarUrl": avatarUrl,
      //   hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      // })
    },
    uploadImage(avatarUrl,nickName){
      wx.uploadFile({
        filePath: avatarUrl,
        name: 'file',
        // url: 'http://2l35209f44.iok.la/add_avatar_image',
        url: 'https://www.tastywhut.site/add_avatar_image',
        success:(res)=>{
          this.setData({
            "userInfo.avatarUrl":res.data,
            hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl
          })
        },
        fail:function(res){
          console.log(res)
        }
      })
    },
    onInputChange(e) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
    returnlogin(e){
      wx.setStorage({
        key:"userId",
        data:this.data.userInfo.nickName
      })
      wx.setStorage({
        key:"userImage",
        data:this.data.userInfo.avatarUrl
      })
      wx.setStorage({
        key:"hasUserInfo",
        data:this.data.hasUserInfo
      })
      // wx.request({
      //   // url: '/add_comment',
      //   url: 'http://2l35209f44.iok.la/updateuserinfo',
      //   method:'POST',
      //   data:{
      //     openid:this.data.openid,
      //     avatar:this.data.userInfo.avatarUrl,
      //     nickname:this.data.userInfo.nickName
      //   },
      //   header:{
      //     'content-type':'application/x-www-form-urlencoded',
      //   },
      //   success:()=>{
      //     wx.switchTab({
      //       url: '../main/main',
      //     })
      //   }
      // })
      wx.switchTab({
       url: '../main/main',
      })
    },
    judge(key){
      if(key==true)
      {
        wx.switchTab({
          url: '../main/main',
        })
      }
      else{return;}
    },
    getopenid(){
      wx.login({
        success: (res) => {
          
          if (res.code) {
            console.log(res.code)//发起网络请求
            wx.request({
              url: 'http://2l35209f44.iok.la/getopenid',
              method:'GET',
              data: {
                code: res.code
              },
              // header:{
              //   'content-type':'application/json'
              // },
              success:(res)=>{
                console.log(res)
                this.setData({
                  openid:res.data.openid,
                  "userInfo.nickName":res.data.nickname,
                  "userInfo.avatarUrl":res.data.avatar,
                })
                console.log(5)
                if(res.data.openid!=""){
                  this.setData({
                    hasuserid:true,
                    hasUserInfo:true
                  })
                  wx.setStorageSync('openid', this.data.openid);
                  wx.setStorageSync('hasuserid', this.data.hasuserid);  
                }
                
                
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        },
      })
    }
  },
  
})
