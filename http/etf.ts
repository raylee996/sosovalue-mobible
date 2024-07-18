import request, { RequestOptions } from "helper/request";

export function getList(
  body: {
    type?: number;
    isListing: number;
    status?: number;
    orderItems: [{}];
  },
  options: RequestOptions = {}
) {
  return request<ETF.ETFData[]>("/finance/etf-info-do/anno/findList", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function timeLine(
  body: {
    isListing: number;
    orderItems: [{}];
  } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<API.baseTimeLine>("/finance/etf-info-do/anno/findPage", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function getUpdateTime(
  body: {
    orderItems: [{}];
  } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<API.baseTime>("/finance/eth-data-history-do/findPage", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getHistory(
  body: { type?: number; orderItems: [{}] } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<any>("/finance/etf-statistics-do/findPage", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getFindLastList(
  body: { type?: number },
  options: RequestOptions = {}
) {
  return request<ETF.ETFLastData[]>(
    "/finance/eth-data-history-do/anno/findLastList/V2",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function chainsSectorInfo(options: RequestOptions = {}) {
  return request<API.sectionList[]>(
    "/finance/s-chains-statistics-do/chainsSectorInfo",
    {
      method: "POST",
      ...options,
    }
  );
}

export function getOneChains(id: string, options: RequestOptions = {}) {
  return request<any>(`/finance/s-chains-statistics-do/${id}`, {
    method: "GET",
    ...options,
  });
}
export function findByIds(body: {}, options: RequestOptions = {}) {
  return request<any>("/finance/s-chains-statistics-do/findByIds", {
    method: "POST",
    data: body,
    ...options,
  });
}
// /finance/s-chains-statistics-do/findPage
export function chainsFindPage(body: {}, options: RequestOptions = {}) {
  return request<any>("/finance/s-chains-statistics-do/findPage", {
    method: "POST",
    data: body,
    ...options,
  });
}
