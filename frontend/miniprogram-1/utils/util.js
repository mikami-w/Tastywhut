const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 获取当前用户ID
const getCurrentUserId = () => {
  return wx.getStorageSync('openid') || 'guest';
}

// 本地积分系统函数（与用户绑定）- 优化性能
const addPoints = (type, value) => {
  // 使用异步操作避免阻塞
  setTimeout(() => {
    try {
      const userId = getCurrentUserId();
      const storageKey = `points_${userId}`;

      // 获取当前用户的积分
      let currentPoints = wx.getStorageSync(storageKey) || 0;
      // 增加积分
      currentPoints += value;
      // 保存积分
      wx.setStorageSync(storageKey, currentPoints);
      console.log(`用户${userId}积分变更: ${type} +${value}, 总积分: ${currentPoints}`);
    } catch (error) {
      console.error('积分变更失败:', error);
    }
  }, 0);
}

const getTotalPoints = () => {
  const userId = getCurrentUserId();
  const storageKey = `points_${userId}`;
  return wx.getStorageSync(storageKey) || 0;
}

// 清空当前用户的积分（退出登录时调用）
const clearUserPoints = () => {
  const userId = getCurrentUserId();
  const storageKey = `points_${userId}`;
  wx.removeStorageSync(storageKey);
  console.log(`用户${userId}积分已清空`);
}

// 本地浏览记录函数（与用户绑定）- 优化性能
const addBrowseHistory = (foodId, shopName) => {
  // 使用异步操作避免阻塞
  setTimeout(() => {
    try {
      const userId = getCurrentUserId();
      const storageKey = `browse_history_${userId}`;

      // 获取当前用户的浏览记录
      let history = wx.getStorageSync(storageKey) || [];

      // 检查是否已存在相同记录，如果存在则只更新时间
      const existingIndex = history.findIndex(item => item.food_id === foodId);
      if (existingIndex !== -1) {
        // 更新现有记录的时间
        history[existingIndex].time = Date.now();
        // 将记录移到最前面
        const [record] = history.splice(existingIndex, 1);
        history.unshift(record);
      } else {
        // 创建新记录
        const newRecord = {
          food_id: foodId,
          shop_name: shopName || `食堂${foodId}`,
          time: Date.now()
        };
        // 添加到记录开头（最新的在前面）
        history.unshift(newRecord);
        // 控制最大记录数量为50条
        if (history.length > 50) {
          history = history.slice(0, 50);
        }
      }

      // 保存记录
      wx.setStorageSync(storageKey, history);
      console.log(`用户${userId}添加浏览记录: 食堂=${shopName}, food_id=${foodId}`);
    } catch (error) {
      console.error('添加浏览记录失败:', error);
    }
  }, 0);
}

const getBrowseHistory = () => {
  const userId = getCurrentUserId();
  const storageKey = `browse_history_${userId}`;
  return wx.getStorageSync(storageKey) || [];
}

// 清空当前用户的浏览记录（退出登录时调用）
const clearUserBrowseHistory = () => {
  const userId = getCurrentUserId();
  const storageKey = `browse_history_${userId}`;
  wx.removeStorageSync(storageKey);
  console.log(`用户${userId}浏览记录已清空`);
}

module.exports = {
  formatTime,
  addPoints,
  getTotalPoints,
  clearUserPoints,
  addBrowseHistory,
  getBrowseHistory,
  clearUserBrowseHistory
}
