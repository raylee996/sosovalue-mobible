import React from "react";
import dayjs from "dayjs";
import { transferMoney } from "helper/tools";
import { useTranslation } from "next-i18next";
import Chart from "components/base/Chart";
import { useThemeStore } from "store/useThemeStore";
const Twitter = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
}) => {
  const { t } = useTranslation("home");
  const [type, setType] = React.useState("Total");
  const [time, setTime] = React.useState("MAX");
  const theme = useThemeStore((state) => state.theme);
  const changeData = (val: number[] | string[]) => {
    if (time === "30D") {
      return val.slice(val.length - 4, val.length);
    } else if (time === "90D") {
      return val.slice(val.length - 12, val.length);
    } else {
      return val;
    }
  };
  const twitter = React.useMemo(() => {
    const data =
      originalCurrencyDetail?.twitterData &&
      JSON.parse(originalCurrencyDetail.twitterData);

    let datalist =
      originalCurrencyDetail?.twitterData &&
      Object.keys(JSON.parse(originalCurrencyDetail.twitterData));

    let count: any = [];
    datalist &&
      datalist.forEach((item, index) => {
        datalist && count.push(data[datalist[index]].count);
      });
    const list = datalist;
    const countList = count;
    let color: string[] = [];
    let time: string[] = [];
    let Tweets: number[] = [];
    let tolViews: number[] = [];
    let avgViews: number[] = [];
    let tolLike: number[] = [];
    let avgLike: number[] = [];
    let tolComment: number[] = [];
    let avgComment: number[] = [];
    let tolShares: number[] = [];
    let avgShares: number[] = [];
    countList?.forEach((item: any, index: number) => {
      datalist && time.push(dayjs(+datalist[index] * 1000).format("MM/DD"));
      Tweets.push(item.total);
      tolViews.push(item.sumImpression);
      avgViews.push(item.avgImpression);
      tolLike.push(item.sumLike);
      avgLike.push(item.avgLike);
      tolComment.push(item.sumReply);
      avgComment.push(item.avgReply);
      tolShares.push(item.sumRetweet);
      avgShares.push(item.avgRetweet);
    });
    let legend = [];
    if (type === "Total") {
      legend = [
        {
          height: "8px",
          name: "Tweets",
          color: "#FF4F20",
          val: transferMoney(Tweets[Tweets.length - 1]),
        },
        {
          height: "8px",
          name: "Views",
          color: "#1D4ED8",
          val: transferMoney(tolViews[tolViews.length - 1]),
        },
        {
          height: "8px",
          name: "Like",
          color: "#93221A",
          val: transferMoney(tolLike[tolLike.length - 1]),
        },
        {
          height: "8px",
          name: "Comment",
          color: "#FFC133",
          val: transferMoney(tolComment[tolComment.length - 1]),
        },
        {
          height: "8px",
          name: "Shares",
          color: "#525252",
          val: transferMoney(tolShares[tolShares.length - 1]),
        },
      ];
    } else {
      legend = [
        {
          height: "8px",
          name: "Tweets",
          color: "#FF4F20",
          val: transferMoney(Tweets[Tweets.length - 1]),
        },
        {
          height: "8px",
          name: "Views",
          color: "#1D4ED8",
          val: transferMoney(avgViews[avgViews.length - 1]),
        },
        {
          height: "8px",
          name: "Like",
          color: "#93221A",
          val: transferMoney(avgLike[avgLike.length - 1]),
        },
        {
          height: "8px",
          name: "Comment",
          color: "#FFC133",
          val: transferMoney(avgComment[avgComment.length - 1]),
        },
        {
          height: "8px",
          name: "Shares",
          color: "#525252",
          val: transferMoney(avgShares[avgShares.length - 1]),
        },
      ];
    }
    if (theme === "dark") {
      color = ["#FF4F20", "#2563EB", "#93221A", "#FFC133", "#A3A3A3"];
    } else {
      color = ["#FF4F20", "#1D4ED8", "#93221A", "#FFC133", "#525252"];
    }
    let option: any = {
      color: color,
      tooltip: {
        trigger: "axis",
        backgroundColor: "#1E1E1E",
        borderColor: "#1E1E1E",
        padding: 4,
        textStyle: {
          color: "#A5A7AB",
          fontSize: 10,
        },
        axisPointer: {
          type: "line",
        },
        formatter: function (params: any) {
          let Paramsss = `<div>${params[0].axisValue}</div>`;
          params.map((item: any) => {
            Paramsss += `<i style="margin-right:4px;font-family:Lato;display:inline-block;width:6px;height:6px;border-radius:50%;font-size:14px;background:${item.color}"></i>${item.seriesName}: ${item.value} <br/>`;
          });
          return Paramsss;
        },
      },

      xAxis: {
        type: "category",
        data: changeData(time),
        nameTextStyle: {
          color: "#F5F5F5",
          fontWeight: 400,
          fontSize: 10,
        },
        axisLine: {
          lineStyle: {
            color: "#343434", // 坐标轴线的颜色
            width: 1, // 坐标轴线的宽度
            type: "solid", // 坐标轴线的类型（实线、虚线等）
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          showMaxLabel: true,
          fontFamily: "Lato",
          color: theme === "dark" ? "#A3A3A3" : "#525252",
          interval: Math.ceil(time.length / 2),
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
          type: "value",
          name: "",
          position: "left",
          axisLabel: {
            show: false,
            fontSize: 12,
            fontFamily: "Lato",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else if (value <= -1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value <= -1000000000) {
                return value / 1000000000 + "B";
              } else if (value <= -1000000) {
                return value / 1000000 + "M";
              } else if (value <= -1000) {
                return value / 1000 + "K";
              } else {
                return value + "";
              }
            },
          },
          min: 1,
          logBase: 10000,
          splitLine: {
            show: false,
            lineStyle: {
              color: "#F5F5F5",
            },
          },
        },
        {
          type: "value",
          name: "",

          position: "left",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "Lato",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else if (value <= -1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value <= -1000000000) {
                return value / 1000000000 + "B";
              } else if (value <= -1000000) {
                return value / 1000000 + "M";
              } else if (value <= -1000) {
                return value / 1000 + "K";
              } else {
                return value + "";
              }
            },
          },
          min: 1,
          logBase: 10000,
          splitLine: {
            show: false,
            lineStyle: {
              color: "#F5F5F5",
            },
          },
        },
      ],
      grid: {
        left: "55px",
        top: "20px",
        bottom: "20px",
        right: "25px",
      },
    };
    if (type === "Total") {
      option = {
        ...option,
        series: [
          {
            name: "Tweets",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: changeData(Tweets),
          },
          {
            name: "Views",
            type: "line",
            smooth: true,
            showSymbol: false,
            yAxisIndex: 1,
            data: changeData(tolViews),
          },
          {
            name: "Like",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: changeData(tolLike),
          },
          {
            name: "Comment",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: changeData(tolComment),
          },
          {
            name: "Shares",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: changeData(tolShares),
          },
        ],
      };
    } else {
      option = {
        ...option,
        series: [
          {
            name: "Tweets",
            type: "line",
            smooth: true,
            showSymbol: false,

            data: changeData(Tweets),
          },
          {
            name: "Views",
            type: "line",
            smooth: true,
            showSymbol: false,
            yAxisIndex: 1,
            data: changeData(avgViews),
          },
          {
            name: "Like",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: changeData(avgLike),
          },
          {
            name: "Comment",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: changeData(avgComment),
          },
          {
            name: "Shares",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: changeData(avgShares),
          },
        ],
      };
    }

    return {
      countList,
      list,
      option,
      legend,
    };
  }, [originalCurrencyDetail, type, time]);

  return (
    <div className="">
      <div className="w-auto overflow-x-hidden p-4 m-4 rounded-lg border border-solid border-primary-100-700">
        <div className=" text-primary-900-White font-bold text-lg leading-8 mb-2">
          {t("Twitter weekly trends")}
        </div>
        <div className="flex items-center mb-4">
          <div className="flex items-center bg-hover-50-900 border border-solid rounded-xl border-primary-100-700">
            <div
              onClick={() => setType("Average")}
              className={`text-xs cursor-pointer text-primary-900-White h-6 leading-6 px-2  rounded-xl ${
                type === "Average" && "bg-background-secondary-White-700"
              }`}
            >
              {t("Average")}
            </div>
            <div
              onClick={() => setType("Total")}
              className={`text-xs cursor-pointer text-primary-900-White h-6  rounded-xl leading-6 px-2 ${
                type === "Total" && "bg-background-secondary-White-700"
              }`}
            >
              {t("Total")}
            </div>
          </div>
          <div className="ml-2 flex items-center bg-hover-50-900 border border-solid rounded-xl border-primary-100-700">
            <div
              onClick={() => setTime("30D")}
              className={`text-xs cursor-pointer text-primary-900-White h-6 leading-6 px-2 rounded-xl ${
                time === "30D" && "bg-background-secondary-White-700"
              }`}
            >
              30D
            </div>
            <div
              onClick={() => setTime("90D")}
              className={`text-xs cursor-pointer text-primary-900-White h-6 rounded-xl leading-6 px-2 ${
                time === "90D" && "bg-background-secondary-White-700"
              }`}
            >
              90D
            </div>
            <div
              onClick={() => setTime("MAX")}
              className={`text-xs cursor-pointer text-primary-900-White h-6 rounded-xl leading-6 px-2 ${
                time === "MAX" && "bg-background-secondary-White-700"
              }`}
            >
              MAX
            </div>
          </div>
        </div>
        <Chart
          option={twitter.option}
          classes="w-full h-[300px]"
          legend={twitter.legend}
        />
        {/* <div className="text-[10px] text-primary-900-White text-center">
          <div className="">
            <div className="flex items-center">
              <div className="flex-1 items-center min-2-[100px]"></div>
              <div className="flex-1 items-center "></div>
              {twitter.countList.map((item: any, index: number) => {
                return (
                  <div key={item.avgImpression} className="flex-1 items-center">
                    {twitter.list &&
                      `${dayjs(
                        +twitter.list[index] * 1000 - 86400 * 1000
                      ).format("MMM-D")}
                    -
                    ${dayjs(+twitter.list[index] * 1000 - 604800 * 1000).format(
                      "MMM-D"
                    )}`}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center py-2 border-0 border-b border-primary-100-700 border-solid  ">
              <div className="flex-1 items-center text-sm text-[#F5F5F5] min-w-[80px]">
                <div className="flex text-xs text-primary-900-White justify-start items-center">
                  <TwitterLogo size={20} className="mr-1" />
                  {t("Tweets")}
                </div>
              </div>
              <div className="flex-1 items-center text-primary-900-White">
                {t("Total")}
              </div>
              {twitter.countList.map((item: any, index: number) => {
                return (
                  <div
                    key={item.avgLike}
                    className="flex-1 items-center text-secondary-500-300"
                  >
                    {transferMoney(item.total)}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center py-2 border-0 border-b border-primary-100-700 border-solid ">
              <div className="flex-1 items-center text-sm text-[#F5F5F5] min-w-[80px]">
                <div className="flex text-xs text-primary-900-White justify-start items-center">
                  <Eye size={20} className="mr-1" />
                  {t("Views")}
                </div>
              </div>
              <div className="flex-1 items-center text-primary-900-White">
                {t("Total")} <br />
                {t("Average")}
              </div>
              {twitter.countList.map((item: any, index: number) => {
                return (
                  <div
                    key={item.avgReply}
                    className="flex-1 items-center text-[10px] text-secondary-500-300"
                  >
                    {transferMoney(item.sumImpression)} <br />
                    {transferMoney(item.avgImpression)}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center py-2 border-0 border-b border-primary-100-700 border-solid ">
              <div className="flex-1 items-center text-sm text-[#F5F5F5] min-w-[80px]">
                <div className="flex text-xs text-primary-900-White justify-start items-center">
                  <HeartStraight size={20} className="mr-1" />
                  {t("Like")}
                </div>
              </div>
              <div className="flex-1 items-center text-primary-900-White">
                {t("Total")} <br />
                {t("Average")}
              </div>
              {twitter.countList.map((item: any, index: number) => {
                return (
                  <div
                    key={item.avgRetweet}
                    className="flex-1 items-center text-[10px] text-secondary-500-300"
                  >
                    {transferMoney(item.sumLike)} <br />
                    {transferMoney(item.avgLike)}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center py-2  border-0 border-b border-primary-100-700 border-solid">
              <div className="flex-1 items-center text-sm text-[#F5F5F5] min-w-[80px]">
                <div className="flex text-xs text-primary-900-White justify-start items-center">
                  <ChatText size={20} className="mr-1" />
                  {t("Comment")}
                </div>
              </div>
              <div className="flex-1 items-center text-primary-900-White">
                {t("Total")} <br />
                {t("Average")}
              </div>
              {twitter.countList.map((item: any, index: number) => {
                return (
                  <div
                    key={item.sumImpression}
                    className="flex-1 items-center text-[10px] text-secondary-500-300"
                  >
                    {transferMoney(item.sumReply)} <br />
                    {transferMoney(item.avgReply)}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center py-2">
              <div className="flex-1 items-center text-sm text-[#F5F5F5] min-w-[80px]">
                <div className="flex text-xs  text-primary-900-White justify-start items-center">
                  <ShareFat size={20} className="mr-1" />
                  {t("Shares")}
                </div>
              </div>
              <div className="flex-1 items-center text-primary-900-White">
                {t("Total")} <br />
                {t("Average")}
              </div>
              {twitter.countList.map((item: any, index: number) => {
                return (
                  <div
                    key={item.sumLike}
                    className="flex-1 items-center text-[10px] text-secondary-500-300"
                  >
                    {transferMoney(item.sumRetweet)} <br />
                    {transferMoney(item.avgRetweet)}
                  </div>
                );
              })}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Twitter;
