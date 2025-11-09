Component({
  properties:{
    starValue:{
      value: 0,//父组件传过来的评分数字
      type:Number
    },
    disabled:{//是否只读，disabled="true"可评分，disabled="false"只显示（刚好写反了）
      value:false,
      type:Boolean
    },
    isShowStarValue:{
      value:false,//父组件传过来的是否显示评分
      type:Boolean
    },
    WH:{
      value: 20,//父组件设置评分星星的宽高
      type:Number
    },
    isInteger:{//父组件设置是操作整颗星 || 半颗星
      value:false,
      type:Boolean
    }
  },
 
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/no-star.png',//没有点亮的星星图片
    selectedSrc: '../../images/full-star.png',//完全点亮的星星图片
    halfSrc: '../../images/half-star.png',//点亮一半的星星图片
    showTap:true//是否可以点击
  },
  
 })