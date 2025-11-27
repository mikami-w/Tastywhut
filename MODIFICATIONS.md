# 微信小程序项目修改文档

## 项目概述
本项目为微信小程序"TastyWhut"添加了本地浏览记录和本地积分系统两大功能。

## 功能特性

### 1. 本地积分系统
- **登录奖励**：用户登录时获得1积分
- **浏览奖励**：用户浏览菜谱详情时获得1积分
- **收藏奖励**：用户收藏菜品时获得2积分
- **用户绑定**：积分与用户openid绑定，退出登录保留，注销账号时清零

### 2. 本地浏览记录
- **自动记录**：进入菜谱详情页时自动记录浏览历史
- **智能去重**：相同食堂的重复浏览只更新时间戳
- **用户绑定**：浏览记录与用户绑定，退出登录保留，注销账号时清零
- **显示优化**：显示食堂名称而非ID，按时间倒序排列

### 3. 用户管理增强
- **退出登录**：仅清空登录状态，保留用户数据
- **注销账号**：双重确认后永久删除所有用户数据

## 修改文件清单

### 1. `frontend/miniprogram-1/utils/util.js` - 工具函数库

#### 新增函数
```javascript
// 用户ID获取
const getCurrentUserId = () => {
  return wx.getStorageSync('openid') || 'guest';
}

// 积分系统函数（异步优化）
const addPoints = (type, value) => {
  // 异步积分累加，与用户绑定
}

const getTotalPoints = () => {
  // 获取用户积分
}

const clearUserPoints = () => {
  // 清空用户积分
}

// 浏览记录函数（异步优化）
const addBrowseHistory = (foodId, shopName) => {
  // 异步添加浏览记录，与用户绑定
}

const getBrowseHistory = () => {
  // 获取用户浏览记录
}

const clearUserBrowseHistory = () => {
  // 清空用户浏览记录
}
```

#### 修改内容
- 新增用户绑定逻辑，所有数据按`openid`隔离存储
- 积分存储键格式：`points_${userId}`
- 浏览记录存储键格式：`browse_history_${userId}`
- 所有存储操作异步化，避免阻塞页面加载
- 添加错误处理机制

### 2. `frontend/miniprogram-1/pages/index/index.js` - 登录页面

#### 修改内容
```javascript
// 新增导入
const { addPoints } = require('../../utils/util.js')

// 在returnlogin函数中添加积分奖励
returnlogin(e){
  // ... 原有登录逻辑 ...

  // 登录积分奖励
  addPoints('login', 1);
}
```

### 3. `frontend/miniprogram-1/pages/foodcomments/foodcomments.js` - 菜谱详情页面

#### 修改内容
```javascript
// 新增导入
const { addPoints, addBrowseHistory } = require('../../utils/util.js')

// 在onLoad中添加浏览记录和积分逻辑
onLoad(options) {
  // ... 原有逻辑 ...

  // 记录浏览历史和积分（异步，不阻塞页面加载）
  if (get && get.id) {
    addBrowseHistory(get.id, get.name);
    addPoints('browse', 1);
  }
}

// 在intorecipe收藏函数中添加积分奖励
intorecipe(){
  if(this.data.inrecipe == false){
    // ... 原有收藏逻辑 ...

    // 收藏积分奖励
    addPoints('collect', 2);
  }
}
```

### 4. `frontend/miniprogram-1/pages/person/person.js` - 个人中心页面

#### 新增数据字段
```javascript
data: {
  // ... 原有字段 ...
  totalPoints: 0,          // 用户积分
  browseHistory: [],       // 浏览记录
  showHistory: false       // 控制浏览记录显示
}
```

#### 新增方法
```javascript
// 获取本地浏览记录
getBrowseHistory(){
  return getBrowseHistory();
}

// 获取总积分
getTotalPoints(){
  return getTotalPoints();
}

// 切换浏览记录显示
toggleBrowseHistory(){
  this.setData({
    showHistory: !this.data.showHistory
  })
}

// 时间格式化函数
formatTime(timestamp) {
  // 格式化时间为可读格式
}

// 注销账号功能
deleteAccount() {
  // 双重确认后清空所有用户数据
}
```

#### 修改onShow方法
```javascript
onShow(){
  // ... 原有逻辑 ...

  // 异步获取积分和浏览记录
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
}
```

### 5. `frontend/miniprogram-1/pages/person/person.wxml` - 个人中心页面模板

#### 新增UI元素
```xml
<!-- 积分显示区域 -->
<view class="points-section">
  <view class="points-display">
    <image src="/images/score.png" class="points-icon"></image>
    <text class="points-text">积分：{{totalPoints}}</text>
  </view>
</view>

<!-- 浏览记录功能 -->
<view class="btnui" bindtap="toggleBrowseHistory">
  <view class="icon"><image src="/images/recipe.png"></image></view>
  <text>浏览记录 ({{browseHistory.length}})</text>
  <text>{{showHistory ? '∨' : '>'}}</text>
</view>

<!-- 浏览记录详情 -->
<view wx:if="{{showHistory}}" class="history-section">
  <view wx:if="{{browseHistory.length === 0}}" class="no-history">
    <text>暂无浏览记录</text>
  </view>
  <view wx:elif="{{browseHistory.length > 0}}" class="history-list">
    <view wx:for="{{browseHistory}}" wx:key="food_id" class="history-item">
      <text>食堂: {{item.shop_name}}</text>
      <text>{{item.timeFormatted}}</text>
    </view>
  </view>
</view>

<!-- 注销账号按钮 -->
<view wx:if="{{haslogin}}" class="delete-btn" bindtap="deleteAccount">
  <text>注销账号</text>
</view>
```

### 6. `frontend/miniprogram-1/pages/person/person.wxss` - 个人中心页面样式

#### 新增样式
```css
/* 积分显示样式 */
.points-section {
  background-color: white;
  margin: 15rpx 0;
  padding: 30rpx 50rpx;
  border-bottom: 1px solid rgba(200, 200, 200, 40);
}

.points-display {
  display: flex;
  align-items: center;
}

.points-icon {
  width: 50rpx;
  height: 50rpx;
  margin-right: 20rpx;
}

.points-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ff6b35;
}

/* 浏览记录样式 */
.history-section {
  background-color: white;
  border-bottom: 1px solid rgba(200, 200, 200, 40);
  max-height: 600rpx;
  overflow-y: auto;
}

.history-item {
  border-bottom: 1px solid rgba(240, 240, 240, 100);
  padding: 30rpx 50rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.history-time {
  font-size: 24rpx;
  color: #999;
}

/* 注销账号按钮样式 */
.delete-btn {
  width: 90%;
  height: 120rpx;
  margin: 50rpx auto;
  border-radius: 20rpx;
  background-color: #fff5f5;
  border: 2rpx solid #ff4757;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-hover {
  background-color: #ffeaea !important;
}
```

### 7. `frontend/miniprogram-1/pages/person/person.wxs` - 页面模板脚本（已删除）

**删除原因**：微信小程序WXS不支持Date对象，已移除并在JS中处理时间格式化

## 技术优化

### 1. 性能优化
- **异步数据操作**：所有本地存储操作异步执行，不阻塞页面加载
- **延迟加载**：个人中心页面的积分和浏览记录异步加载
- **智能去重**：浏览记录相同条目只更新时间戳

### 2. 用户体验优化
- **数据隔离**：不同用户数据完全隔离
- **渐进式加载**：页面先显示基础信息，再加载详细数据
- **错误处理**：添加try-catch避免功能异常影响页面使用

### 3. 安全性优化
- **双重确认**：注销账号需要两次确认
- **数据保护**：退出登录保留用户数据，防止误操作

## 数据存储结构

### 积分数据
```javascript
// 存储键：points_${openid}
// 数据格式：number (积分数值)
wx.setStorageSync('points_o6zAJs9CSd3TzIhJ2PVooRIPd23I', 15);
```

### 浏览记录数据
```javascript
// 存储键：browse_history_${openid}
// 数据格式：Array
[
  {
    food_id: 123,
    shop_name: "学一食堂",
    time: 1710000000000
  },
  {
    food_id: 456,
    shop_name: "学二食堂",
    time: 1710000001000
  }
]
```

## 兼容性说明

- **微信小程序基础库**：支持2.0.0及以上版本
- **ES6语法**：使用const/let、箭头函数、模板字符串等现代语法
- **本地存储**：使用wx.getStorageSync/wx.setStorageSync API
- **异步处理**：使用setTimeout实现异步操作

## 测试建议

1. **功能测试**：
   - 登录积分累加
   - 浏览记录自动保存
   - 收藏积分奖励
   - 退出登录数据保留
   - 注销账号数据清空

2. **性能测试**：
   - 页面加载速度
   - 重复操作响应
   - 存储操作稳定性

3. **兼容性测试**：
   - 不同微信版本
   - 不同设备型号
   - 网络异常情况

---

**修改日期**：2025年11月27日
