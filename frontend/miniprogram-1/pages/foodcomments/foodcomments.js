// pages/foodcomments/foodcomments.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:{},
    // comments:[{"id":1,"username":"niko","comment":"very good!","like":"194","star":"5"}]
    comments:[],
    page: 1,
    pagesize: 10,
    total: 0,
    isloading: false,
    refreshing:false,
    inrecipe:false,
    starsrc:"/images/unlike.png",
    shownav:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    let get=(wx.getStorageSync('query')||[]);
    console.log(get)
    this.setData({
      query:get,
    })
    wx.removeStorageSync('query');
    let accountinfo=__wxConfig.envVersion;
    if(accountinfo=='release')
    {
      this.setData({
        shownav:false
      })
    }
    this.getcomments()

    this.showlike()
  },
  showlike(){
    var that=this
    var shopid = this.data.query.id;
    var openid= wx.getStorageSync('openid');
    console.log(shopid,openid)
    wx.request({
      url: 'https://www.tastywhut.site/isliked',
      method: 'POST',
      data:{
        shopid:shopid,
        openid:openid,
      },
      header:{
        'content-type':'application/x-www-form-urlencoded',
      },
      success:(res)=>{
        console.log(res.data)
        if(res.data=='True'){
          that.setData({
            inrecipe:true,
            starsrc:"/images/like.png"
          })
        }
        else{
          that.setData({
            inrecipe:false,
            starsrc:"/images/unlike.png"
          })
        }
      }
    })
  },
  getcomments(stopPD){
    this.setData({
      isloading:true,
    })
    wx.showLoading({
      title: '数据加载中',
    })
    var openid=wx.getStorageSync('openid')
    wx.request({
      // url:`http://2l35209f44.iok.la/data/shopcomment`,
      url:"http://26.213.65.26/data/shopcomment",
      //url:`https://www.tastywhut.site/data/shopcomment`,
      //url:"http://clownpiece.51vip.biz/listtest",
      method:"GET",
      data:{
        id:this.data.query.id,
        page:this.data.page,
        limit:this.data.pagesize,
        openid:openid
      },
      success:(res)=>{
        this.setData({
          comments:[...this.data.comments,...res.data],
          total:res.header['total-count'] - 0,
        })
      },
      complete:()=>{
        wx.hideLoading();
        this.setData({
          isloading: false,
        });
        if(stopPD==true)
        {
          this.setData({
            refreshing:false,
          })
        };
      }
    })
  },
  deletecomment(e){
    var openid=wx.getStorageSync('openid')
    var commentid=e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '是否确认删除此评论',
      complete: (res) => {
        if (res.cancel) {
          return;
        }
    
        if (res.confirm) {
          console.log(e.currentTarget)
          console.log(openid,commentid)
          wx.request({
            // url:"https://www.tastywhut.site/deletecomment"
            url:"http://26.213.65.26/deletecomment",
            method:"POST",
            data:{
              openid:openid,
              commentid:commentid
            },
            header: {
              'content-type':'application/x-www-form-urlencoded'
            },
            success:(res)=>{
              if(res.data=="True"){
                wx.showToast({
                  title: '删除成功！',
                  icon:"none",
                  complete:()=>{
                    this.onPullDownRefresh()
                  }
                })
                
              }
              
            }
          })
        }
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
    // this.getcomments()
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
    var shopid = this.data.query.id;
    var openid= wx.getStorageSync('openid');
    if(this.data.inrecipe){
      wx.request({
        url: 'https://www.tastywhut.site/addcollection',
        method: 'POST',
        data:{
          shopid:shopid,
          openid:openid,
        },
        header:{
          'content-type':'application/x-www-form-urlencoded',
        },
        success:(res)=>{
          console.log(res.data)
        }
      })
    }
    else{
      wx.request({
        url: 'https://www.tastywhut.site/removecollection',
        method: 'POST',
        data:{
          shopid:shopid,
          openid:openid,
        },
        header:{
          'content-type':'application/x-www-form-urlencoded',
        },
        success:(res)=>{
          console.log(res.data)
        }
      })

    }
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    if(this.data.isloading==false){
      this.setData({
        refreshing:true,
        page:1,
        comments:[],
        total:0
      })
      // wx.stopPullDownRefresh();
      this.getcomments(true)
    }
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.page * this.data.pagesize>=this.data.total)
    {
      return wx.showToast({
        title: '已经到底啦！',
        icon:'none'
      })
    }
    if(this.data.isloading) return;
    this.setData({
      page:this.data.page + 1
    });
    this.getcomments();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  previewimage(e){
    console.log(e)
    var currenturl=e.currentTarget.dataset.src
    console.log(currenturl)
    wx.previewImage({
      current:currenturl,
      urls: [currenturl],
    })
  },
  navtocomment(){
    let id=this.data.query.id;
    wx.navigateTo({
      url: '../usercomment/usercomment?id='+id,
    })
  },
  intorecipe(){
    if(this.data.inrecipe==false)
    {
      this.setData({
        inrecipe:true,
        starsrc:"/images/like.png"
      })
      wx.showToast({
        title: '收藏成功！',
      })
    }
    else{
      this.setData({
        inrecipe:false,
        starsrc:"/images/unlike.png"
      })
      wx.showToast({
        title: '取消收藏！',
      })
    }
  }
})