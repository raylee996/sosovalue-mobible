import request, { RequestOptions } from "helper/request";

export function top10(
  body: { orderItems: { asc: boolean; column: string }[] } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<API.currencyDataTop>(
    "/data/ads-home-currency-top10-change-1d-do/findPage",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getBannerList(
  body: { userType?: number },
  options: RequestOptions = {}
) {
  return request<API.Banner[]>("/configuration/page-config-do/findList", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function getInformationList(
  body: {
    categoryList?: number[];
    userType?: number;
    idList?: string[];
    search?: string;
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
