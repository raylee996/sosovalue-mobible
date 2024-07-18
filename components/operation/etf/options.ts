const getOptions = (key: string, mode?: string) => {
  const obj: any = {
    Total_Crypto_Market_Cap: {
      params: [
        {
          chartName: "Total_Crypto_Market_Cap_totalMarketCap",
          name: "Market Cap",
          color: `${mode === "dark" ? "#E5E5E5" : "#1A1A1A"}`,
          series: {
            type: "line",
          },
        },
        {
          chartName: "Total_Crypto_Market_Cap_totalVolume24H",
          name: "24h Vol",
          height: "8px",
          color: "#4D67BF",
          series: {
            type: "bar",
            yAxisIndex: 1,
          },
        },
      ],
      grid: {
        left: "55px",
        top: "20px",
        bottom: "45px",
        right: "45px",
      },
      yAxis: [
        {
          type: "log",
          name: "",
          position: "left",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          min: 1,
          logBase: 10000,
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      showDataZoom: true,
      transferMoney: true,
    },
    Stablecoin_Total_Market_Cap: {
      params: [
        {
          chartName: "Stablecoin_Total_Market_Cap_Mcap",
          name: "Market Cap",
          color: `${mode === "dark" ? "#E5E5E5" : "#1A1A1A"}`,
          series: {
            type: "line",
            areaStyle: {
              color: "#E5E5E5",
              opacity: 0.15,
            },
          },
        },
        {
          chartName: "Stablecoin_Total_Market_Cap_usdt",
          name: "USDT",
          color: "#4D67BF",
          series: {
            type: "line",
            areaStyle: {
              color: "#4D67BF",
              opacity: 0.15,
            },
          },
        },
        {
          chartName: "Stablecoin_Total_Market_Cap_usdc",
          name: "USDC",
          color: "#4D8FBF",
          series: {
            type: "line",
            areaStyle: {
              color: "#4D8FBF",
              opacity: 0.15,
            },
          },
        },
        {
          chartName: "Stablecoin_Total_Market_Cap_busd",
          name: "BUSD",
          color: "#4DBFBC",
          series: {
            type: "line",
            areaStyle: {
              color: "#4DBFBC",
              opacity: 0.15,
            },
          },
        },
      ],
      grid: {
        left: "45px",
        top: "20px",
        bottom: "45px",
        right: "35px",
      },
      graphic: {
        type: "image",
        left: "center",
        top: "center",
        z: -1,
        //rotation: Math.PI / 4,
        style: {
          image: "/img/watermark.svg",
          x: 0,
          y: 0,
          width: 200,
          height: 44,
          opacity: 1,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          show: true,
          formatter: function (value: number, index: number) {
            if (value >= 1000000000000) {
              return value / 1000000000000 + "T";
            } else if (value >= 1000000000) {
              return value / 1000000000 + "B";
            } else if (value >= 1000000) {
              return value / 1000000 + "M";
            } else if (value >= 1000) {
              return value / 1000 + "K";
            } else {
              return value;
            }
          },
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "#333333",
          },
        },
      },
      showDataZoom: true,
      transferMoney: true,
    },
    FGI_Indicator: {
      params: [
        {
          chartName: "index_fgi",
          name: "Crypto Fear & Greed Index",
          color: "#2174FF",
          series: {
            type: "line",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "",
          min: 0,
          max: 100,
          interval: 20,
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#333333",
            },
          },
        },
      ],
      visualMap: [
        {
          show: false,
          type: "continuous",
          //min:Math.min(...tList.slice(0, tList.length - 1)),
          min: 0,
          max: 100,
          //max:Math.max(...tList.slice(0, tList.length - 1)),
          color: ["#24A148", "#72C14E", "#D29E08", "#ED8139", "#DA1E28"],
        },
      ],
      grid: {
        left: "45px",
        top: "10px",
        bottom: "45px",
        right: "40px",
      },
      graphic: {
        type: "image",
        left: "center",
        top: 70,
        z: -1,
        style: {
          image: "/img/watermark.svg",
          x: 0,
          y: 0,
          width: 200,
          height: 44,
          opacity: 1,
        },
      },
      hideLegend: false,
      showDataZoom: true,
      transferMoney: true,
    },
    Altcoin_Market_Cap_Volume: {
      params: [
        {
          color: `${mode === "dark" ? "#E5E5E5" : "#1A1A1A"}`,
          series: {},
        },
        {
          height: "8px",
          series: {
            yAxisIndex: 1,
          },
        },
      ],
      grid: {
        left: "60px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      yAxis: [
        {
          type: "log",
          name: "",
          position: "left",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
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
                return value;
              }
            },
          },
          min: 1,
          logBase: 10000,
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
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
                return value;
              }
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      transferMoney: true,
    },
    Funding_Rate: {
      params: [
        {
          height: "8px",
          series: {},
        },
        {
          series: {
            yAxisIndex: 1,
          },
        },
      ],
      grid: {
        left: "60px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      yAxis: [
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
      ],
      transferMoney: true,
    },
    Futures_Open_Interest: {
      params: [
        {
          height: "8px",
          series: {},
        },
        {
          series: {
            yAxisIndex: 1,
          },
        },
      ],
      grid: {
        left: "95px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      yAxis: [
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
      ],
      transferMoney: true,
    },
    BTC_Mining_difficulty: {
      params: [
        {
          chartName: "BTC_Mining_difficulty",
          name: "BTC Mining difficulty",
          color: "#4d67bf",
          series: {
            type: "line",
          },
        },
      ],
      grid: {
        left: "60px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      yAxis: [
        {
          type: "log",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          min: 1,
          logBase: 1000,
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
      ],
      showDataZoom: true,
      transferMoney: true,
    },
    BTC_Hashrate: {
      params: [
        {
          chartName: "BTC_Hashrate",
          name: "BTC Hashrate",
          color: "#4d67bf",
          series: {
            type: "line",
          },
        },
      ],
      grid: {
        left: "95px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      yAxis: [
        {
          type: "log",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          min: 1,
          logBase: 1000,
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
      ],
      showDataZoom: true,
      transferMoney: true,
    },
    Active_Address_on_Chains: {
      params: [
        {
          chartName: "active_address_on_chains_eth",
          name: "Address",
          series: {
            type: "line",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          min: 1,
          logBase: 1000,
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
      ],
      grid: {
        left: "68px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      showDataZoom: true,
      transferMoney: true,
    },
    Transactions_on_Chains: {
      params: [
        {
          chartName: "transactions_on_chains_eth",
          name: "Transactions",
          series: {
            type: "line",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          min: 1,
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
      ],
      grid: {
        left: "68px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      showDataZoom: true,
      transferMoney: true,
    },
    ETH_Staking_Amount: {
      params: [
        {
          chartName: "ETH_Staking_Amount_staked_calc",
          name: "ETH Staked (ETH)",
          color: "#E5E5E5",
          height: "8px",
          series: {
            type: "bar",
            barCategoryGap: "0%",
            barGap: "0%",
          },
        },
        {
          chartName: "ETH_Staking_usd_calc",
          name: "ETH Staked (USD)",
          color: "#4D67BF",
          series: {
            type: "line",
            yAxisIndex: 1,
          },
        },
      ],
      grid: {
        left: "60px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      yAxis: [
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return (value / 1000000000000).toFixed(2) + "T";
              } else if (value >= 1000000000) {
                return (value / 1000000000).toFixed(2) + "B";
              } else if (value >= 1000000) {
                return (value / 1000000).toFixed(2) + "M";
              } else if (value >= 1000) {
                return (value / 1000).toFixed(2) + "K";
              } else {
                return value;
              }
            },
          },
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
        {
          type: "value",
          axisLabel: {
            show: true,
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return (value / 1000000000000).toFixed(2) + "T";
              } else if (value >= 1000000000) {
                return (value / 1000000000).toFixed(2) + "B";
              } else if (value >= 1000000) {
                return (value / 1000000).toFixed(2) + "M";
              } else if (value >= 1000) {
                return (value / 1000).toFixed(2) + "K";
              } else {
                return value;
              }
            },
          },
          splitLine: {
            lineStyle: {
              color: "#3C3C3C",
            },
          },
        },
      ],
      showDataZoom: false,
      transferMoney: true,
    },
    ETH_Staking_Ratio: {
      params: [
        {
          chartName: "ETH_Staking_Ratio_staked_calc",
          name: "Staking",
          color: "#E5E5E5",
          height: "8px",
          series: {
            type: "bar",
            stack: "Staked",
            barGap: "0%",
            barCategoryGap: "0%",
          },
        },
        {
          chartName: "ETH_Staking_Ratio_staked_calc_non",
          type: "non",
          name: "Non-Staked",
          color: "#4D67BF",
          height: "8px",
          series: {
            type: "bar",
            stack: "Staked",
            barGap: "0%",
            barCategoryGap: "0%",
          },
        },
      ],
      grid: {
        left: "60px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      showDataZoom: false,
      transferMoney: true,
    },
    AHR_999_Indicator: {
      params: [
        {
          chartName: "AHR999_Indicator_value",
          name: "BTC Price",
          series: {
            type: "line",
            yAxisIndex: 1,
          },
        },
        {
          chartName: "AHR999_Indicator_ahr999",
          name: "AHR999",
          series: {
            type: "line",
            //yAxisIndex: true,
          },
        },
        {
          chartName: "",
          name: "Fixed investment zome",
          static: 0.45,
          color: "#30D158",
          series: {
            type: "line",
            color: "#30D158",
          },
        },
        {
          chartName: "",
          name: "Buy at the buttom",
          static: 1.2,
          color: "#FF453A",
          series: {
            type: "line",
            color: "#FF453A",
          },
        },
      ],
      grid: {
        left: "50px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      yAxis: [
        {
          type: "log",
          min: 0.1,
          position: "left",
          logBase: 10,
          axisLabel: {
            show: true,
            formatter: function (value: number, index: number) {
              if (value == 0.1) {
                return "0";
              } else {
                return value + "";
              }
            },
          },
          //min:1,
          //max:Math.max(...tList),
          //interval:Math.max(...tList)/10,
          //logBase: 10,
          splitLine: {
            show: true,
            lineStyle: {
              color: "#343434",
            },
          },
        },
        {
          type: "log",
          min: 1,
          splitNumber: 7,
          position: "right",
          logBase: 10,
          axisLabel: {
            show: true,
            formatter: function (value: number, index: number) {
              if (value == 1) {
                return "0";
              } else {
                return value + "";
              }
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      showDataZoom: true,
      transferMoney: true,
    },
    Total_Crypto_Spot_ETF_Fund_Flow: {
      params: [
        {
          chartName: "Etf_btc_Fund_flow",
          name: "Fund flow",
          color: `#30D158`,
          height: "8px",
          series: {
            type: "bar",
            itemStyle: {
              normal: {
                color: function (params: any) {
                  if (params.value > 0) {
                    return "#30D158";
                  } else {
                    return "#FF453A";
                  }
                },
              },
            },
          },
        },
        {
          chartName: "Etf_btc_Total_Net_Assets_Value",
          name: "Total Net Assets Value",
          color: `${mode === "dark" ? "#E5E5E5" : "#1A1A1A"}`,
          series: {
            type: "line",
            yAxisIndex: 1,
          },
        },
      ],
      grid: {
        left: "80px",
        top: "20px",
        bottom: "45px",
        right: "45px",
      },
      yAxis: [
        {
          type: "value",
          name: "",
          position: "left",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
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
                return value;
              }
            },
          },
          splitLine: {
            lineStyle: {},
          },
        },
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
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
                return value;
              }
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      showDataZoom: true,
      transferMoney: true,
    },
  };
  return (
    obj[key] || {
      params: [
        {
          series: {},
        },
        {
          series: {
            // yAxisIndex: 1,
          },
        },
      ],
      grid: {
        left: "60px",
        top: "20px",
        bottom: "45px",
        right: "60px",
      },
      yAxis: [
        {
          type: "value",
          name: "",
          axisLabel: {
            show: true,
            fontSize: 12,
            fontFamily: "JetBrains Mono",
            formatter: function (value: number, index: number) {
              if (value >= 1000000000000) {
                return value / 1000000000000 + "T";
              } else if (value >= 1000000000) {
                return value / 1000000000 + "B";
              } else if (value >= 1000000) {
                return value / 1000000 + "M";
              } else if (value >= 1000) {
                return value / 1000 + "K";
              } else {
                return value;
              }
            },
          },
          splitLine: {
            lineStyle: {
              color: "#343434",
            },
          },
        },
        // {
        //   type: "value",
        //   name: "",
        //   axisLabel: {
        //     show: false,
        //     fontSize: 12,
        //     fontFamily: "JetBrains Mono",
        //     formatter: function (value: number, index: number) {
        //       if (value >= 1000000000000) {
        //         return value / 1000000000000 + "T";
        //       } else if (value >= 1000000000) {
        //         return value / 1000000000 + "B";
        //       } else if (value >= 1000000) {
        //         return value / 1000000 + "M";
        //       } else if (value >= 1000) {
        //         return value / 1000 + "K";
        //       } else {
        //         return value;
        //       }
        //     },
        //   },
        //   splitLine: {
        //     lineStyle: {
        //       color: "#343434",
        //     },
        //   },
        // },
      ],
      transferMoney: true,
    }
  );
};

export default getOptions;
