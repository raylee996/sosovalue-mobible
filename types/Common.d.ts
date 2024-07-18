declare namespace Common {
  export type SearchCrypto = {
    fullName: string;
    iconUrl: string;
    id: string;
    name: string;
    status: number;
    sort: number;
    exchangeRate: string;
  };
  export type SearchPair = {
    baseCurrencyIcon?: string;
    currencyId?: string;
    exchangeName: string;
    exchangeIcon: string;
    dexIcon: string;
    networkIcon: string;
    id: string;
    status: number;
    symbol: string;
    exchangeId: string;
    exchangeRate: string;
    nature: "cex" | "dex";
    baseAsset: string;
    quoteAsset: string;
  };
  export type SearchResult = {
    crypto?: API.ListResponse<Common.SearchCrypto>;
    pairs?: API.ListResponse<Common.SearchPair>;
    insights?: API.ListResponse<Research.Post>;
    institution?: API.ListResponse<Research.Post>;
    news?: API.ListResponse<Research.Post>;
    research?: API.ListResponse<Research.Post>;
    onChain?: API.ListResponse<Research.Post>;
  };
  export type ClassNameMap<ClassKey extends string = string> = {
    [P in ClassKey]?: string;
  };
}
