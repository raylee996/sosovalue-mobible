import { FunnelX } from "@phosphor-icons/react/dist/ssr";
import request, { RequestOptions } from "helper/request";

// export function getRecommendWithPic(body: {minScore: number, maxScore: number} & API.Pagination, options: RequestOptions = {}) {
//     return request<API.ListResponse<API.Post>>('/manager/article/home/select/research/recommendHavePic', {
//         method: 'POST',
//         data: body,
//         ...options
//     })
// }
// export function getResearchReport(body: {notInidList: string[], minScore: number, maxScore: number} & API.Pagination, options: RequestOptions = {}) {
//     return request<API.ListResponse<API.Post>>('/manager/article/home/select/research/report', {
//         method: 'POST',
//         data: body,
//         ...options
//     })
// }
// export function getRecommendWithoutPic(body: {notInidList: string[], minScore: number, maxScore: number} & API.Pagination, options: RequestOptions = {}) {
//     return request<API.ListResponse<API.Post>>('/manager/article/home/select/research/recommendNoPic', {
//         method: 'POST',
//         data: body,
//         ...options
//     })
// }
// export function getBannerOrResearchMap(body: { typeId: 3 | 5 }, options: RequestOptions = {}) {
//     return request<API.ResearchDict[]>('/manager/dict/banner/findList', {
//         method: 'POST',
//         data: body,
//         ...options
//     })
// }

export function getData(body: API.Pagination, options: RequestOptions = {}) {
  return request<API.ListResponse<API.Post>>("/api/post/hello", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function allSymbol() {
  return request<{ s: string; b: string; q: string }[]>(
    "/data/anno/symbol/all",
    {
      method: "GET",
    }
  );
}

export function getCurrencyEntityList(
  body: { categoriesAtomId: number | null | undefined; status: number },
  options: RequestOptions = {}
) {
  return request<API.currentList[]>("/data/currency/anno/findList", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getFindListToCurrency(
  body: { status: number },
  options: RequestOptions = {}
) {
  return request<API.findListToCurrency[]>(
    "/data/sector-entity/anno/findListToCurrency",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}

export function getDataChart(
  id: string | number,
  options: RequestOptions = {}
) {
  return request<API.ChartDataWrap>(`/data/chart/data/chart/${id}`, {
    method: "GET",
    ...options,
  });
}

export function getInitGasData(body: {}, options: RequestOptions = {}) {
  return request<any>(`/message/netty/statistics/anno/getInitGasData`, {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getChartDatas(
  body: { nameList: string | string[]; period?: string },
  options: RequestOptions = {}
) {
  return request<any>(`/data/s-indicator-data-do/findListByIdsOrNames`, {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getCryptoTotal() {
  return request<API.cryptoTotal[]>(
    `/data/anno/market/quotation/getCryptoTotal`,
    {
      method: "GET",
    }
  );
}

export function getArticleList(
  body: {
    category?: number;
    categoryList?: Array<string | number>;
    sector?: string;
    keyword?: string;
    coinId?: string;
    isOfficial?: 0 | 1;
    lastSortValues?: number[];
    currentField?: string;
  } & Partial<API.Pagination>,
  options: RequestOptions = {}
) {
  return request<API.ListResponse<Research.Post>>(
    "/contentAndSocial/content/information/v2/findPage",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}

export function getDataRekt(id: string | number, options: RequestOptions = {}) {
  return request<API.bcData>(`/data/chart/data/symbol/${id}`, {
    method: "GET",
    ...options,
  });
}

export function getDataInterest(
  id: string | number,
  params: { period: string },
  options: RequestOptions = {}
) {
  return request<API.bcData>(`/data/chart/data/openInterest/${id}`, {
    method: "GET",
    params,
    ...options,
  });
}

export function getDataBuySell(
  id: string | number,
  params: { period: string },
  options: RequestOptions = {}
) {
  return request<string>(`/data/chart/data/takerBuySellVolume/${id}`, {
    method: "GET",
    params,
    ...options,
  });
}

export function findListByBaseAsse(
  currencyId: string,
  options: RequestOptions = {}
) {
  return request<API.TradingPair[]>(
    `/data/symbols/findListByCurrency/${currencyId}/V2`,
    {
      method: "POST",
      ...options,
    }
  );
}

export function getCurrentCoin(
  id: string | number,
  options: RequestOptions = {}
) {
  return request<API.ChartDataWrap>(`/data/currency/${id}`, {
    method: "GET",
    ...options,
  });
}
export function globalSearch(
  body: Partial<
    API.Pagination & {
      category: string[];
      keyword: string;
    }
  >,
  options: RequestOptions = {}
) {
  return request<Common.SearchResult>("/data/search/v2/globalSearch", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function findDefaultSymbolByCurrencyIds(
  body: string[],
  options: RequestOptions = {}
) {
  return request<API.bookmarkList[]>(
    "/data/symbols/findDefaultSymbolByCurrencyIds",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function findListByAtomId(
  data: { categoriesAtomId?: number },
  options: RequestOptions = {}
) {
  return request<API.CoinCategory[]>(
    "/data/sector-entity/anno/findListByAtomId",
    {
      method: "POST",
      data,
      ...options,
    }
  );
}

export function findBasePage(
  body: {
    categoriesAtomId?: number | null | undefined;
    status: number;
    orderItems: [{}];
  } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<API.baseData>("/data/currency/anno/findBasePage", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function findPage(
  body: { currencyIdList: string[] } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<API.currencyData>("/data/currencyData/findPage", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function market(
  body?: {
    topType?: number;
    exchangeId?: number;
    ids?: string[];
    categoriesAtomId?: number;
  },
  options: RequestOptions = {}
) {
  return request<Market.PairMarketHistory[]>("/data/symbols/market", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function categoriesFindList(
  body: { status: number; orderItems: [{}] } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<API.findListToCurrency[]>("/data/sector-entity/findList", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function categoriesList(
  body: { status: number },
  options: RequestOptions = {}
) {
  return request<API.findListToCurrency[]>(
    "/data/sector-entity/anno/findListToCurrency/V2",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}

export function findCurrencyIdListBySectorIds(
  body: { sectorIdList: number[] },
  options: RequestOptions = {}
) {
  return request<any[]>("/data/sector-entity/findCurrencyIdListBySectorIds", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getSymbols(
  body: { status: number },
  options: RequestOptions = {}
) {
  return request<
    {
      baseAsset: string;
      quoteAsset: string;
      exchangeName: string;
      id: string;
    }[]
  >("/data/symbols/findList", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function sourcePlat(
  body: { useType: number; pageSize: number; weight: number },
  options: RequestOptions = {}
) {
  return request<Record<string, string>>(
    "/contentAndSocial/content/information/v2/group/sourcePlatId",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}

export function groupCategory(
  body: {
    useType: number;
    pageSize: number;
    search: string;
    sourcePlatIdList: string[];
    keyword: string;
    sector: string;
    weight?: number;
    isOfficial?: number;
    startTime?: number | undefined;
    endTime?: number | undefined;
  },
  options: RequestOptions = {}
) {
  return request<any>(
    "/contentAndSocial/content/information/v2/group/category",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}

export function authCategory(
  body: {
    useType: number;
    pageSize: number;
    isAuth: number;
    search: string;
    sourcePlatIdList: string[];
    keyword: string;
    sector: string;
    weight?: number;
    isOfficial?: number;
    startTime?: number | undefined;
    endTime?: number | undefined;
  },
  options: RequestOptions = {}
) {
  return request<any>("/contentAndSocial/content/information/v2/group/isAuth", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getArticleDetail(id: string, options: RequestOptions = {}) {
  return request<Research.Post>(
    `/contentAndSocial/content/information/v2/${id}`,
    {
      method: "GET",
      ...options,
    }
  );
}

export function getArticleDetailBySlug(
  seoSlug: string,
  options: RequestOptions = {}
) {
  return request<Research.Post>(
    `/contentAndSocial/content/information/v2/seoslug`,
    {
      method: "GET",
      params: { seoSlug },
      ...options,
    }
  );
}

export function getHotArticleDetail(id: string, options: RequestOptions = {}) {
  return request<any>(`/contentAndSocial/content-news-cluster-do/v2/${id}`, {
    method: "GET",
    ...options,
  });
}

export function getAudio(
  body: API.Pagination & { status: string },
  options: RequestOptions = {}
) {
  return request<
    API.ListResponse<{
      content: string;
      id: string;
      informationDoVo: Research.Post;
    }>
  >(`/configuration/content-config-do/v2/findPage`, {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getNewArticleList(
  body: {
    category?: number;
    categoryList?: string[];
    sector?: string;
    coinId?: string;
    isOfficial?: number | undefined;
    sourcePlatIdList?: any;
    userType?: number;
    search?: string;
    weight?: number;
    isAuth?: number;
    entityList?: string[];
  } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<any>("/contentAndSocial/content/information/v2/findPage", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function pushNatification(
  body: {
    category?: number;
    pushStatus?: number;
    pushType?: number;
  } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<any>("/push/natification/push-natification/findPage", {
    method: "POST",
    data: body,
    ...options,
  });
}

// /push/natification/push-messages-do/findPage
export function pushMessagesDo(
  body: {
    receiverId: string;
    isRead: number;
  },
  options: RequestOptions = {}
) {
  return request<any>("/push/natification/push-messages-do/ISRead", {
    method: "PUT",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
// /push/natification/push-messages-do/batchRead
export function batchRead(
  body: {
    receiverId: string;
    isRead: number;
  },
  options: RequestOptions = {}
) {
  return request<any>("/push/natification/push-messages-do/batchRead", {
    method: "PUT",
    data: body,
    ...options,
  });
}

export function getFindOne(
  body: { nameKey: string; classifyId: number },
  options: RequestOptions = {}
) {
  return request<API.ChartIntroduce>(
    `/configuration/s-multi-language-config-do/findOne`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
