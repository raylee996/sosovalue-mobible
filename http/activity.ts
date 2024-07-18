import request, { RequestOptions } from "helper/request";

export function getVotedList(options: RequestOptions = {}) {
  return request<{ id: string; researcherId: string; userId: string }[]>(
    "/rights/researcher-votes-do/getVoted",
    {
      method: "GET",
      ...options,
    }
  );
}
export function voteRequest(
  body: { researcherId: string },
  options: RequestOptions = {}
) {
  return request<boolean>("/rights/researcher-votes-do/create", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getRewards(
  body: API.Pagination & { userId?: string; rewardType?: number },
  options: RequestOptions = {}
) {
  return request<
    API.ListResponse<{
      name: string;
      exp: number;
      ssc: number;
      id: string;
      userId: string;
      researcherId?: string;
      rewardType: number;
    }>
  >("/rights/researcher-rewards-do/findPage", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function getVoteNum(
  body: API.Pagination & { issue?: number },
  options: RequestOptions = {}
) {
  return request<
    API.ListResponse<{
      id: string;
      votes: number;
    }>
  >("/usercenter/researchers-do/findPage", {
    method: "POST",
    data: body,
    ...options,
  });
}

// 查询报名结果
export function getSignResult(body: any = {}, options: RequestOptions = {}) {
  return request<any>(`/rights/user-activity-sign-in/get`, {
    method: "GET",
    data: body,
    ...options,
  });
}

// 报名
export function SignUp(body: any = {}, options: RequestOptions = {}) {
  return request(`/rights/user-activity-sign-in/create`, {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}

// 报名
export function changeSignUp(body: any = {}, options: RequestOptions = {}) {
  return request(`/usercenter/activity-sign-in/update`, {
    method: "PUT",
    data: body,
    ...options,
  });
}

//获取用户文章列表
export function getArticleList(
  body: Partial<API.Pagination & { userId: string; status: number }>,
  options: RequestOptions = {}
) {
  return request<any[]>(`/rights/user-activity-contribute/findList`, {
    method: "POST",
    data: body,
    ...options,
  });
}

// 报名信息
export function getActivitySign(options: RequestOptions = {}) {
  return request(`/rights/user-activity-sign-in/get`, {
    method: "GET",
    ...options,
  });
}

// 时间线配置
export function getActivityTimeline(
  body: any = {},
  options: RequestOptions = {}
) {
  return request<any>(`/rights/activity-timeline/anno/findList`, {
    method: "POST",
    data: body,
    ...options,
  });
}

// 经验值配置
export function getActivityExperience(
  body: any = {},
  options: RequestOptions = {}
) {
  return request(`/rights/activity-experience/anno/findList`, {
    method: "POST",
    data: body,
    // skipErrorHandler: true,
    ...options,
  });
}

// 查询投稿数据
export function deleteArticle(id: string, options: RequestOptions = {}) {
  return request<any>(`/usercenter/activity-contribute/delete/${id}`, {
    method: "DELETE",
    ...options,
  });
}
export function activityEarlyAccessCreate(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request<any>("/rights/activity-early-access/anno/create", {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
//获取用户经验
export function getUserExp(options: RequestOptions = {}) {
  return request<any>(`/rights/user-activity-experience/get`, {
    method: "GET",
    ...options,
  });
}

//获取用户经验变动
export function getExpList(
  body: API.Pagination & { orderItems: [{}] },
  options: RequestOptions = {}
) {
  return request<any>(`/rights/user-activity-experience-detail/findPage`, {
    method: "POST",
    data: body,
    ...options,
  });
}
