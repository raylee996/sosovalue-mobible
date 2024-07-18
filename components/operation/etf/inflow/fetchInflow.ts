import { transformETFData } from 'helper/ugly'
import { getChartDatas } from 'http/home'
import { ETFTab } from '..'

export const fetchInflow = async (type: ETFTab, nameList: string[]) => {
  const { data: chart } = await getChartDatas({ nameList })
  if (type === ETFTab.USBTCSpot) {
    return transformETFData({
      master: {
        name: "Fund flow",
        data: JSON.parse(chart.Etf_btc_Fund_flow),
      },
      slaves: [
        {
          name: "Total Net Assets Value",
          data: JSON.parse(chart.Etf_btc_Total_Net_Assets_Value),
        },
        {
          name: "BTC Price",
          data: JSON.parse(chart.AHR999_Indicator_value),
        },
      ],
    })
  }
  if (type === ETFTab.HKBTCSpot) {
    return transformETFData({
      master: {
        name: '1D BTC Inflow',
        data: JSON.parse(chart.Etf_hk_btc_Fund_flow),
      },
      slaves: [
        {
          name: 'Total BTC in HK ETF',
          data: JSON.parse(chart.Etf_hk_btc_Cum_Fund_flow),
        },
        {
          name: 'Total Net Assets Value',
          data: JSON.parse(chart.Etf_hk_btc_Total_Net_Assets_Value),
        },
        {
          name: 'BTC Price',
          data: JSON.parse(chart.AHR999_Indicator_value),
        },
      ],
    })
  }
  if (type === ETFTab.HKETHSpot) {
    return transformETFData({
      master: {
        name: '1D ETH Inflow',
        data: JSON.parse(chart.Etf_hk_eth_Fund_flow),
      },
      slaves: [
        {
          name: 'Total ETH in HK ETF',
          data: JSON.parse(chart.Etf_hk_eth_Cum_Fund_flow),
        },
        {
          name: 'Total Net Assets Value',
          data: JSON.parse(chart.Etf_hk_eth_Total_Net_Assets_Value),
        },
        {
          name: 'ETH Price',
          data: JSON.parse(chart.etf_eth_daily_amount),
        },
      ],
    })
  }
}
