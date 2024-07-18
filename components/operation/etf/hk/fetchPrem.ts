import { findByNameChart } from 'http/hketf'
import { ETFTab } from '..'

export const langTypeParam: { [key: string]: number } = {
  en: 1,
  zh: 2,
  tc: 3,
}

export const fetchPrem = async (type: ETFTab, lang: string) => {
  const id = type === ETFTab.HKBTCSpot ? 'btc' : 'eth'

  const [{ data: chartData24h }, { data: chartData1d }] = await Promise.all([
    findByNameChart({
      innerKey: `ETF_Premium_Discount_Rate_hk_${id}_5m`,
      langType: langTypeParam[lang],
    }),
    findByNameChart({
      innerKey: `ETF_Premium_Discount_Rate_hk_${id}_1d`,
      langType: langTypeParam[lang],
    }),
  ])
  return {
    chartData24h,
    chartData1d,
  }
}
