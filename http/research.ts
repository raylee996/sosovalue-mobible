import request, { RequestOptions } from "helper/request";

export function getProject(id: string, options: RequestOptions = {}) {
  return request<API.Project>(`/manager/project/${id}`, {
    method: "GET",
    ...options,
  });
}
export function getProjectList(
  body: API.Pagination,
  options: RequestOptions = {}
) {
  return request<API.Project[]>(
    `/manager/article/content/manager/project/list`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getAllProject(options: RequestOptions = {}) {
  return request<
    { id: number; value: string; sort: number; projectId: number }[]
  >(`/manager/project/findProjectOptionList`, {
    method: "POST",
    ...options,
  });
}
export function getResearchByProject(
  body: API.Pagination & { projectId: string; reportType: 1 | 2 },
  options: RequestOptions = {}
) {
  return request<API.ListResponse<API.Post>>(
    `/manager/article/content/manager/project/list`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getHotNews(
  body: API.Pagination & { status?: number },
  options: RequestOptions = {}
) {
  return request<API.ListResponse<Research.ClusterNews>>(
    `/contentAndSocial/content-news-cluster-do/v2/findPage`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}

export function getNewsCluster(
  body: API.Pagination & { status?: number },
  options: RequestOptions = {}
) {
  return request<API.ListResponse<Research.ClusterNews>>(
    `/contentAndSocial/content-news-cluster-do/v2/findPage`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getCuratedList(
  body: API.Pagination & { status?: number },
  options: RequestOptions = {}
) {
  return request<API.ListResponse<Research.Curated>>(
    `/contentAndSocial/content-curated-do/v2/findPage`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getRandomPostList(
  body: Partial<
    API.Pagination & {
      userType: number;
      weight: number;
      categoryList: number[];
      startTime: number;
      endTime: number;
    }
  >,
  options: RequestOptions = {}
) {
  return request<API.ListResponse<Research.Post>>(
    `/contentAndSocial/content/information/v2/randomList`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
