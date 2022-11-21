import { RequestError } from "./error";

export function fetchData({ url = "", userId = "", data = {} }): Promise<{
  [key: string]: any;
}> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url,
      data: JSON.stringify({
        ...data,
      }),
      responseType: "json",
      headers: {
        "User-agent": window.navigator.userAgent,
        "content-type": "application/json",
        origin: "",
        "Access-Control-Allow-Origin": "*",
      },
      onload: function ({ status, response }) {
        if (status === 200) {
          resolve(response);
        } else {
          console.log("响应体", response);
          reject(
            new RequestError(
              `响应错误：状态码 ${status}`,
              `响应错误：状态码 ${status}，具体信息请见控制台`
            )
          );
        }
      },
      onabort: function () {
        reject(new RequestError("请求中断"));
      },
      onerror: function () {
        reject(new RequestError("请求发送失败"));
      },
      ontimeout: function () {
        reject(new RequestError(`请求超时`));
      },
    });
  });
}

export async function checkIn() {
  return await checkInrequest();
  async function checkInrequest() {
    return fetchData({
      url: "https://api.juejin.cn/growth_api/v1/check_in",
    }).then((response) => {
      // console.log("签到后返回的数据==》data===>", response);
      if (response.err_msg === "success") {
        alert("签到成功");
      } else {
        console.log(response.err_msg);
      }
    });
  }
}

export async function drawLottery() {
  return await startLottery();
  async function startLottery() {
    return fetchData({
      url: "https://api.juejin.cn/growth_api/v1/lottery/draw",
    }).then((response) => {
      if (response.err_msg === "success") {
        console.log("恭喜您抽中:", response.data.lottery_name);
      } else {
        console.log(response.err_msg);
      }
    });
  }
}

export async function addLucky() {
  return await lotteryHistoryList();
  //获取到可沾贴福气的列表
  async function lotteryHistoryList() {
    return fetchData({
      url: "https://api.juejin.cn/growth_api/v1/lottery_history/global_small",
      data: { page_no: 1 },
    }).then((response) => {
      //console.log("福气历史列表==response===>", response);
      if (response.err_msg === "success") {
        //获取到第一个数据的 lottery_history_id 然后请求 沾福气接口
        let lottery_history_id = response.data.lotteries[0].history_id;
        //console.log("lottery_history_id==>", lottery_history_id);
        return fetchData({
          url: "https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky",
          data: { lottery_history_id },
        }).then((response) => {
          if (response.err_msg === "success") {
            console.log("当前福气总数===>", response.data.total_value);
          } else {
            alert(response.err_msg);
          }
        });
      }
    });
  }
}

export async function bugfix() {
  return await bugfixList();
  //获取到可沾贴福气的列表
  async function bugfixList() {
    return fetchData({
      url: "https://api.juejin.cn/user_api/v1/bugfix/not_collect",
    }).then((response) => {
      if (response.err_msg === "success") {
        //console.log("未收集的bug列表==response===>", response);
        //{"bug_type":14,"bug_time":1668787200}
        //根据返回的结果组装数据来进行持续请求
        const { data } = response;
        data.forEach((item: { bug_type: any; bug_time: any }) => {
          return fetchData({
            url: "https://api.juejin.cn/user_api/v1/bugfix/collect",
            data: { bug_type: item.bug_type, bug_time: item.bug_time },
          }).then((response) => {
            if (response.err_msg === "success") {
              console.log("bug数+1===>");
            } else {
              console.log("暂无bug可收集");
            }
          });
        });
      } else {
        alert(response.err_msg);
      }
    });
  }
}
