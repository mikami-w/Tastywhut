// pages/foodlist/foodlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:{},
    // shoplist:[{"id":1,"image":"114514.jpg","name":"番茄虾滑","phone":"10086","address":"南湖城市广场醉得意","openinghour":"unknown","star":"5.0"}]
    shoplist:[],
    navtitle:{"incampus":"校内食堂","outcampus":"校外小吃","rank":"排行"},
    page: 1,
    pagesize: 10,
    total: 0,
    isloading: false,
    refreshing: false,
    gotocomments:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let accountinfo=__wxConfig.envVersion;
    
    this.showcomment(accountinfo);

    this.setData({
      query:options
    })
    this.getshoplist();

  },


  //判定
  showcomment(info){
    if(info=='release')
    {
      this.setData({
        gotocomments:false
      })
    }
  },



  getshoplist(stopPD){
    this.setData({
      isloading:true,
    })
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      // url:`http://2l35209f44.iok.la/data/${this.data.query.id}`,
      // //url:"http://clownpiece.51vip.biz/listtest",
      url: `https://www.tastywhut.site/data/${this.data.query.id}`,
      method:"GET",
      data:{
        page:this.data.page,
        limit:this.data.pagesize,
      },
      success:(res)=>{
        this.setData({
          shoplist:[...this.data.shoplist,...res.data],
          total:res.header['total-count'] - 0,
        })
      },
      complete:()=>{
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
    // wx.setNavigationBarTitle({
    //   title: this.data.query.id,
    // })
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

  /**wx.hideLoading();
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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

  },

  shopbtn:function(e){
    if(this.data.gotocomments){
    // if(true){
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
    
  }
})