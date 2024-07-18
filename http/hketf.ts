import request, { RequestOptions } from "helper/request";

export function getHkList(
  body: {
    isListing: number;
    status?: number;
    type: number;
    orderItems: [{}];
  },
  options: RequestOptions = {}
) {
  return request<API.hkEtfList[]>(
    "/finance/ads-market-etf-target1-d-do/anno/findList",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}

export function getFindHkLastList(
  body: { isListing: number; status?: number; type: number },
  options: RequestOptions = {}
) {
  return request<any>("/finance/eth-data-history-do/anno/findHkEtfData/V2", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function findByNameChart(
  body: {
    langType: number;
    innerKey: string;
  },
  options: RequestOptions = {}
) {
  return request<any>(`/data/s-chart-config-do/findByName`, {
    method: "POST",
    data: body,
    ...options,
  });
}
