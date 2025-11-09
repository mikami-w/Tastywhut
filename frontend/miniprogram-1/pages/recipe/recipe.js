Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:{},
    shoplist:[],
    navtitle:{"incampus":"校内食堂","outcampus":"校外小吃","rank":"排行"},
    page: 1,
    pagesize: 10,
    total: 0,
    isloading: false,
    refreshing: false,
    gotocomments:true,
    searchkey:"",
    nolist:false
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
  showcomment(info){
    if(info!='release')
    {
      this.setData({
        gotocomments:false
      })
    }
  },
  getkey(res){
    this.setData({
      searchkey:res.detail.value
    })
  },
  getsearch(){
    var key=this.data.searchkey
    this.setData({
      shoplist:[]
    })
    console.log(key)
    this.getshoplist()
  },
  getshoplist(stopPD){
    this.setData({
      isloading:true,
    })
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      //url:"http://clownpiece.51vip.biz/fuzzysearch",
      url: `https://www.tastywhut.site/fuzzysearch`,
      method:"POST",
      data:{
        keywords:this.data.searchkey,
        page:this.data.page,
        limit:this.data.pagesize,
      },
      header:{
        'content-type':'application/x-www-form-urlencoded',
      },
      success:(res)=>{
        this.setData({
          shoplist:[...this.data.shoplist,...res.data],
          total:res.header['total-count'] - 0,
        })
      },//好特卖
      complete:()=>{
        wx.hideLoading()
        if(this.data.shoplist.length===0){
          this.setData({
            nolist:true
          })
        }
        else{
          this.setData({
            nolist:false
          })
        }
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
  shopbtn:function(e){
    if(this.data.gotocomments){
    // if(true){
      let id=e.currentTarget.dataset.id;
      let name=e.currentTarget.dataset.name;
      let image=e.currentTarget.dataset.image;
      let star=e.currentTarget.dataset.star;
      let query={'id':id,'name':name,'image':image,'star':star};
      wx.setStorageSync('query', query);
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

})