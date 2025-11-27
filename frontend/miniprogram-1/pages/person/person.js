// pages/person/person.js
const { getBrowseHistory, getTotalPoints, clearUserPoints, clearUserBrowseHistory } = require('../../utils/util.js')

  Page({
    data:{
      nickname:"",
      userimage:"",
      showaddshop:true,
      haslogin:false,
      totalPoints: 0,
      browseHistory: [],
      showHistory: false
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

      // 异步获取积分和浏览记录，避免阻塞页面渲染
      setTimeout(() => {
        const totalPoints = this.getTotalPoints();
        const browseHistory = this.getBrowseHistory();

        // 格式化时间
        const formattedHistory = browseHistory.map(item => ({
          ...item,
          timeFormatted: this.formatTime(item.time)
        }));

        this.setData({
          totalPoints: totalPoints,
          browseHistory: formattedHistory
        })
      }, 50);
    },
    // 获取本地浏览记录
    getBrowseHistory(){
      return getBrowseHistory();
    },
    // 获取总积分
    getTotalPoints(){
      return getTotalPoints();
    },
    // 切换浏览记录显示
    toggleBrowseHistory(){
      this.setData({
        showHistory: !this.data.showHistory
      })
    },
    // 时间格式化函数
    formatTime(timestamp) {
      if (!timestamp) return '';

      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();

      return year + '-' +
        (month < 10 ? '0' + month : month) + '-' +
        (day < 10 ? '0' + day : day) + ' ' +
        (hour < 10 ? '0' + hour : hour) + ':' +
        (minute < 10 ? '0' + minute : minute);
    },
    // 注销账号
    deleteAccount() {
      wx.showModal({
        title: '确认注销账号',
        content: '注销账号将永久删除您的所有积分和浏览记录，此操作不可恢复！确定要注销吗？',
        confirmText: '确定注销',
        confirmColor: '#ff4757',
        success: (res) => {
          if (res.confirm) {
            wx.showModal({
              title: '最后确认',
              content: '再次确认：注销后所有数据将被永久删除，无法恢复！',
              confirmText: '确认注销',
              confirmColor: '#ff4757',
              success: (res2) => {
                if (res2.confirm) {
                  // 清空用户积分
                  clearUserPoints();
                  // 清空用户浏览记录
                  clearUserBrowseHistory();

                  // 清空登录状态
                  wx.removeStorageSync('userId');
                  wx.removeStorageSync('userImage');
                  wx.removeStorageSync('hasUserInfo');
                  wx.removeStorageSync('hasuserid');
                  wx.removeStorageSync('openid');

                  // 设置默认头像和昵称
                  const avatarurl = "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";
                  const nickname = "点击登录";

                  wx.setStorageSync('userImage', avatarurl);
                  wx.setStorageSync('userId', nickname);

                  wx.showToast({
                    title: '账号已注销',
                    icon: 'success',
                    duration: 2000,
                    complete: () => {
                      // 刷新页面状态
                      this.onShow();
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  });

  /**
   * 生命周期函数--监听页面加载
   */

 