import request, { RequestOptions } from "helper/request";

export function searchReq(
  body: API.Pagination & { keyword: string; type: 0 | 1 | 2 | 3 },
  options: RequestOptions = {}
) {
  return request<API.SearchResult>("/manager/article/content/manager/search", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getTopGainers(
  body: API.CommonListParams & { keyword?: string },
  options: RequestOptions = {}
) {
  return request<API.ListResponse<Market.TopGainer>>(
    "/statistics/ads-market-currency-change-percent-topn1-m-do/anno/findPage",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
