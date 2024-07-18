import request, { RequestOptions } from "helper/request";

export function getMarketsData(options: RequestOptions = {}) {
  return request<API.Quotation24H[]>("/data/anno/market/quotation/all", {
    method: "GET",
    ...options,
  });
}
export function getCurrencyDetailList(
  body: { sosCoinId: string | number },
  options: RequestOptions = {}
) {
  return request<API.ListResponse<API.OriginalCurrencyDetail>>(
    "/data/currency/details/findPage",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getCurrencyDetail(
  sosCoinId: string | number,
  options: RequestOptions = {}
) {
  return request<API.OriginalCurrencyDetail>(
    `/data/currency/details/sos_coin_id/V2/${sosCoinId}`,
    {
      method: "GET",
      ...options,
    }
  );
}
export function getCurrency(symbol: string, options: RequestOptions = {}) {
  return request<API.CurrencySymbolInfo>(
    `/data/symbols/getOneBySymbolId/${symbol}`,
    {
      method: "GET",
      ...options,
    }
  );
}
export function getCurrencyDataDOVOById(
  symbolId: string,
  options: RequestOptions = {}
) {
  return request<any>(`/data/symbols/getBySymbolId/${symbolId}`, {
    method: "GET",
    ...options,
  });
}
export function getCoinByFullName(coin: string, options: RequestOptions = {}) {
  return request<any>(`/data/currency/trade/${coin}`, {
    method: "GET",
    ...options,
  });
}
export function getCoinByExchangePairs(
  exchangeName: string,
  pairs: string,
  options: RequestOptions = {}
) {
  return request<any>(`/data/symbols/cex/${exchangeName}/${pairs}`, {
    method: "GET",
    ...options,
  });
}
export function getCurrencyInfo(
  id: string | number,
  options: RequestOptions = {}
) {
  return request<API.CurrencyInfo>(`/data/currency/${id}`, {
    method: "GET",
    ...options,
  });
}
export function getDevelopmentProcess(
  body: { sosCoinId: string | number },
  options: RequestOptions = {}
) {
  return request<API.ListResponse<API.DevelopmentProcess>>(
    "/data/currency/details/development/findPage",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getTradingPair(
  body: { baseAsset: string; status: number },
  options: RequestOptions = {}
) {
  return request<API.TradingPair[]>("/data/symbols-entity/findList", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function collect(body: API.Collect, options?: RequestOptions) {
  return request("/usercenter/bookmark/create", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function createComment(
  body: Partial<API.CreateComment>,
  options: RequestOptions = {}
) {
  return request("/operation/operation/comment/create", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function getComments(
  body: { topicId: number | string },
  options: RequestOptions = {}
) {
  return request<API.ListResponse<API.Comment>>(
    "/operation/operation/comment/findPage",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function like(
  commentId: string | number,
  userId: number | string,
  options: RequestOptions = {}
) {
  return request<API.Comment[]>(
    `/operation/operation/comment/${commentId}/${userId}/like`,
    {
      method: "GET",
      ...options,
    }
  );
}
export function unlike(
  commentId: string | number,
  userId: number | string,
  options: RequestOptions = {}
) {
  return request<API.Comment[]>(
    `/operation/operation/comment/${commentId}/${userId}/unlike`,
    {
      method: "GET",
      ...options,
    }
  );
}

export function getMarketsList(symbolId: string, options: RequestOptions = {}) {
  return request<API.TradingPair[]>(
    `/data/currency/getOneBySymbolId/${symbolId}`,
    {
      method: "GET",
      ...options,
    }
  );
}
