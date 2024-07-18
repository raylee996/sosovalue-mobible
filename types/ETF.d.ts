declare namespace ETF {
  export type ETFData = {
    approveTime: null;
    cumNetInflow: string;
    cumNetInflowLast: string;
    dailyChange: -0.0008;
    dailyVol: 929343;
    etfCoinType: string;
    etfType: string;
    exchangeId: null;
    exchangeName: string;
    fee: 0.0021;
    fiatMoney: null;
    id: string;
    inst: string;
    isListing: 1;
    isOpen: 0;
    listingDate: string;
    mktPrice: 66.55;
    name: string;
    nav: 39.77192;
    netAssetsChange: string;
    netAssetsChangeLast: string;
    netInflow: string;
    oneMRoi: null;
    oneYrRoi: string;
    outstandingShares: 12880000;
    premDsc: string;
    premDscLast: string;
    sixMRoi: null;
    status: 1;
    threeMRoi: null;
    ticker: string;
    timeZone: string;
    totalNav: string | null | "-" | "NaN";
    totalNavLast: string;
    type: 1;
    volume: number;
    volumeLast: string;
  };
  type _LastData = Record<string, Record<string, string>>;
  export type ETFLastData = {
    cumNetInflowMap: _LastData;
    netAssetsChangeMap: _LastData;
    netInflowInCashMap: _LastData
    netInflowInKindMap: _LastData
    cumNetInflowInCashMap: _LastData
    cumNetInflowInKindMap: _LastData
    
    netInflowMap: _LastData;
    premDscMap: _LastData;
    totalNavMap: _LastData;
    volumeTradedMap: _LastData;
  };
}
