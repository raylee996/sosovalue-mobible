export const need100 = [
  'PremDsc',
  'NetAssetsChange',
  'premDsc',
  'turnoverRate', // .
]

export const seriesType: Record<string, 'line' | 'bar'> = {
  BTCPrice: 'line',
  ETHPrice: 'line',
  premDsc: 'line',
  mktPrice: 'line',
  volume: 'bar',
  dailyVol: 'bar',
  turnoverRate: 'line',
  oneDNewShares: 'bar',
  totalShares: 'bar',
  netInflow: 'bar',
  cumNetInflow: 'bar',
  totalNav: 'bar',
  PremDsc: 'line',
  '1DNetInflow': 'bar',
  CumNetInflow: 'bar',
  NetAssets: 'line',
  NetAssetsChange: 'line',
  MktPrice: 'line',
  VolTraded: 'bar',
}

export const getSeriesText = (name: string, coin: string) => {
  if (name === 'totalNav') {
    return 'NetAssets'
  } else if (name === 'netInflow') {
    if (coin === 'BTC') {
      return '1DBTCInflow'
    } else {
      return '1DETHInflow'
    }
  } else if (name === 'cumNetInflow') {
    if (coin === 'BTC') {
      return 'TotalBTC'
    } else {
      return 'TotalETH'
    }
  } else {
    return name.replace(name[0], name[0].toUpperCase())
  }
}
