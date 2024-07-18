import request, { RequestOptions } from "helper/request";

export function getSectorList(body: {}, options: RequestOptions = {}) {
  return request<API.Sector[]>("/data/sector-entity/findList", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function findCurrencyIdListBySectorIds(
  body: { sectorIdList: string[]; categoriesAtomId: number },
  options: RequestOptions = {}
) {
  return request<Record<string, string[]>>(
    "/data/sector-entity/findCurrencyIdListBySectorIds",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getCoinBaseInfoList(body: {}, options: RequestOptions = {}) {
  return request<API.ListResponse<API.CoinBaseInfo>>(
    "/data/currency/anno/findBasePage",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getPairMarketList(
  body: { categoriesAtomId?: number; topType?: number; ids?: string[] },
  options: RequestOptions = {}
) {
  return request<API.PairMarket[]>("/data/symbols/market", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getCurrencyById(
  symbolId: string,
  options: RequestOptions = {}
) {
  return request<API.CurrencyHandicap>(
    `/data/symbols/getBySymbolId/${symbolId}`,
    {
      method: "GET",
      ...options,
    }
  );
}
