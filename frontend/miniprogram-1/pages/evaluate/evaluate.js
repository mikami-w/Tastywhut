// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:{},
    shoplist:[],
    page: 1,
    pagesize: 10,
    total: 0,
    isloading: false,
    refreshing: false,
    gotocomments:true,
    noliked:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      query:options
    })
    this.getshoplist();
  },
  getshoplist(stopPD){
    var openid=wx.getStorageSync('openid')
    this.setData({
      isloading:true,
    })
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      // url:`http://2l35209f44.iok.la/data/${this.data.query.id}`,
      // //url:"http://clownpiece.51vip.biz/listtest",
      //url: `https://www.tastywhut.site/data/rank`,
      url:'https://www.tastywhut.site/usercollection',
      method:"POST",
      data:{
        page:this.data.page,
        limit:this.data.pagesize,
        openid:openid
      },
      header:{
        'content-type':'application/x-www-form-urlencoded',
      },
      success:(res)=>{
        console.log(res.data)
        this.setData({
          shoplist:[...this.data.shoplist,...res.data],
          total:res.header['total-count'] - 0,
        })
      },
      complete:()=>{
        if(this.data.total==0)
        {
          this.setData({
            noliked:true
          })
        }
        wx.hideLoading()
        this.setData({
          isloading: false,
        })
        if(stopPD==true){
          this.setData({
            refreshing:false,
          })
        };
      }
    })
  },

  onPullDownRefresh() {
    if(this.data.isloading==false){
      
      this.setData({
        refreshing:true,
        page:1,
        shoplist:[],
        total:0
      })
      // wx.stopPullDownRefresh();
      var stopPD=true;
      this.getshoplist(stopPD)
    }
  },
  shopbtn:function(e){
    //if(this.data.gotocomments){
    if(true){
      let id=e.currentTarget.dataset.id;
      let name=e.currentTarget.dataset.name;
      let image=e.currentTarget.dataset.image;
      let star=e.currentTarget.dataset.star;
      let query={'id':id,'name':name,'image':image,'star':star};
      wx.setStorageSync('query', query);
      // let query={"id":id,"name":name,"image":image};
      // console.log(query);
      wx.navigateTo({
        url: '../foodcomments/foodcomments',
      })
    }
    
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
    this.getshoplist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})