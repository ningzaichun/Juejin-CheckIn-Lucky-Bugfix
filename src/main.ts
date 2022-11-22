import { addLucky, checkIn, bugfix, drawLottery } from "./utils/fetch";

const storageKey = "last_sign_timestamp";
// 获取上一次执行脚本的时间
const lastSignNumberOfDays = GM_getValue(storageKey, 0);
// 计算现在所在的日子
const currentNumberOfDays = Math.floor(
  new Date().valueOf() / 1000 / 60 / 60 / 24
);

// 如果今天已经请求过，不再请求
if (currentNumberOfDays !== lastSignNumberOfDays) {
  checkIn();
  addLucky();
  bugfix();
  drawLottery();
  // 更新最近一次执行脚本的时间
  GM_setValue(storageKey, currentNumberOfDays);
} else {
  console.log("今日任务已完成~,去摸鱼吧");
}
