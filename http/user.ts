import request, { RequestOptions } from "helper/request";

export function emailPwdLogin(
  body: API.EmailPwdLogin,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/authentication/auth/emailPasswordLogin", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function bindEmail(body: API.EmailBind, options: RequestOptions = {}) {
  return request<API.LoginResult>("/usercenter/personal/bindEmail", {
    method: "PUT",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
export function bindEmailV2(
  body: API.EmailBindV2,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/usercenter/personal/bindEmail/V2", {
    method: "PUT",
    data: body,
    ...options,
  });
}
export function bindEmailV3(
  body: API.EmailBindV2,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/usercenter/personal/v3/bindEmail", {
    method: "PUT",
    data: body,
    ...options,
  });
}
export function verifyLoginRegister(
  body: API.EmailCodeRegister,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/usercenter/user/anno/VerifyLoginRegister", {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
export function loginSendCode(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request("/authentication/auth/sendEmailLoginVerifyCode", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function sendBindEmailVerifyCode(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request("/usercenter/personal/sendBindEmailVerifyCode", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function resetSendCode(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request("/usercenter/user/anno/sendResetPasswordVerifyCode", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function checkResetPwdCode(
  body: { email: string; verifyCode: string },
  options: RequestOptions = {}
) {
  return request<string>("/usercenter/user/anno/checkResetPasswordVerifyCode", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function resetPassword(
  body: API.ResetPwd,
  options: RequestOptions = {}
) {
  return request("/usercenter/user/anno/forgot/resetPassword", {
    method: "PUT",
    data: body,
    ...options,
  });
}
export function resetPasswordV2(
  body: API.ResetPwd,
  options: RequestOptions = {}
) {
  return request("/usercenter/user/anno/forgot/resetPassword/V2", {
    method: "PUT",
    data: body,
    ...options,
  });
}
export function logindResetPwd(
  body: Omit<API.ResetPwd, "token"> & { originalPassword: string },
  options: RequestOptions = {}
) {
  return request("/usercenter/personal/resetPassword", {
    method: "PUT",
    data: body,
    ...options,
  });
}

export function checkOriginalPassword(
  originalPassword: string,
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/personal/checkOriginalPassword?originalPassword=${originalPassword}`,
    {
      method: "PUT",
      skipErrorHandler: true,
      ...options,
    }
  );
}

export function walletLoginRequest(
  body: API.WalletLogin,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/authentication/auth/walletLoin", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function getCurrentUser(options?: RequestOptions) {
  return request<API.CurrentUser>("/usercenter/user/getUserInfo", {
    method: "GET",
    skipErrorHandler: true,
    ...options,
  });
}
export function thirdPartyLogin(
  body: API.ThirdPartyLogin,
  options?: RequestOptions
) {
  return request<API.LoginResult>("/authentication/auth/thirdPartyLogin", {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
export function getUserSubList(
  body: { orderItems: { asc: boolean; column: string }[] } & API.Pagination,
  options?: RequestOptions
) {
  return request<API.ListResponse<API.Portfollo>>(
    "/usercenter/subscribe/findPage",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function getUserBookmarkList(
  body: {
    orderItems?: { asc: boolean; column: string }[];
    bookmarkType?: string;
  } & API.Pagination,
  options?: RequestOptions
) {
  return request<API.ListResponse<API.Bookmark>>(
    "/usercenter/bookmark/findPage",
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function subscribe(body: API.Subscribe, options?: RequestOptions) {
  return request("/usercenter/subscribe/create", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function unSubscribe(id: string, options?: RequestOptions) {
  return request(`/usercenter/subscribe/delete/${id}`, {
    method: "DELETE",
    ...options,
  });
}

export function usercenterUpdate(
  body: {
    id: string;
    photo?: string;
    introduction?: string;
  },
  options: RequestOptions = {}
) {
  return request<API.LoginResult>(`/usercenter/user/update`, {
    method: "PUT",
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
export function unCollect(
  id: string,
  bookmarkType: string,
  options?: RequestOptions
) {
  return request(
    `/usercenter/bookmark/delete/${id}?bookmarkType=${bookmarkType}`,
    {
      method: "DELETE",
      ...options,
    }
  );
}
export function checkSubStatus(
  params: { subscribeType: string; subscribeId: string },
  options?: RequestOptions
) {
  return request<boolean>("/usercenter/subscribe/checkStatus", {
    method: "GET",
    params,
    ...options,
  });
}
export function checkCollectStatus(
  params: { bookmarkType: string; bookmarkId: string },
  options?: RequestOptions
) {
  return request<boolean>("/usercenter/bookmark/checkStatus", {
    method: "GET",
    params,
    ...options,
  });
}
export function checkScoreStatus(
  body: { userId: string; articleId: string },
  options?: RequestOptions
) {
  return request<number>("/manager/article/content/manager/user/get/score", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function updateHeadPhoto(
  body: { photo: string },
  options?: RequestOptions
) {
  return request<boolean>("/usercenter/personal/updateHeadPhoto", {
    method: "PUT",
    data: body,
    ...options,
  });
}
export function updateUsername(
  body: { username: string },
  options?: RequestOptions
) {
  return request<boolean>("/usercenter/personal/updateUsername", {
    method: "PUT",
    data: body,
    ...options,
  });
}
export function updateUsernameV3(
  body: { username: string },
  options?: RequestOptions
) {
  return request<boolean>("/usercenter/personal/v3/updateUsername", {
    method: "PUT",
    data: body,
    ...options,
  });
}
export function bindWallet(body: API.WalletLogin, options?: RequestOptions) {
  return request<API.LoginResult>("/usercenter/personal/bindWallet", {
    method: "POST",
    data: body,
    ...options,
  });
}
export function bindThirdParty(
  body: Partial<API.ThirdParams>,
  options?: RequestOptions
) {
  return request<API.LoginResult>("/usercenter/personal/bindThirdParty", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function backpackList(body: {}, options: RequestOptions = {}) {
  return request<API.Backpack[]>("/usercenter/backpack/findList", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function createBatch(
  body: API.createBatchParams[],
  options: RequestOptions = {}
) {
  return request<API.Backpack[]>("/usercenter/symbol/bookmark/createBatch", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function bookmarkList(
  body: { userBackpackId: string },
  options: RequestOptions = {}
) {
  return request<API.bookmarkList[]>("/usercenter/symbol/bookmark/findList", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function createBackPack(
  body: { name: string },
  options: RequestOptions = {}
) {
  return request<API.Backpack[]>("/usercenter/backpack/create", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function updateBackPack(
  body: { name: string; id: string | number },
  options: RequestOptions = {}
) {
  return request<API.Backpack[]>("/usercenter/backpack/update", {
    method: "PUT",
    data: body,
    ...options,
  });
}

export function delBackPack(id: string | number, options?: RequestOptions) {
  return request(`/usercenter/backpack/delete/${id}`, {
    method: "DELETE",
    skipErrorHandler: true,
    ...options,
  });
}

export function delBackPackSymbol(
  body: string[],
  id?: string,
  options?: RequestOptions
) {
  return request(`/usercenter/symbol/bookmark/delete/${id}`, {
    method: "DELETE",
    data: body,
    ...options,
  });
}

export function findSelfAll(options?: RequestOptions) {
  return request<User.CollectCoins[]>(
    `/usercenter/symbol/bookmark/findSelfAll`,
    {
      method: "GET",
      ...options,
    }
  );
}

export function findListToIcon(body: {}, options?: RequestOptions) {
  return request<User.CollectCoins[]>(`/data/symbols/findListToIcon`, {
    method: "POST",
    data: body,
    ...options,
  });
}

export function sortBackPackSymbol(
  body: string[],
  id?: string,
  options?: RequestOptions
) {
  return request(`/usercenter/symbol/bookmark/sort/${id}`, {
    method: "POST",
    data: body,
    ...options,
  });
}
export function registerForEmail(
  body: { email: string; link: string },
  options: RequestOptions = {}
) {
  return request("/usercenter/email/anno/sendRegisterVerifyLink", {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}

export function waitListForEmail(
  body: { email: string; link: string },
  options: RequestOptions = {}
) {
  return request("/usercenter/email/anno/sendWaitlistVerifyLink", {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}

export function bindForEmail(
  body: { email: string; link: string },
  options: RequestOptions = {}
) {
  return request<API.LoginRes>("/usercenter/email/sendBindEmailVerifyLink", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function getUserTask(options?: RequestOptions) {
  return request<{ sumGiftNum: number; taskListVOList: API.GiftTask[] }>(
    "/usercenter/task/getUserInfo",
    {
      method: "GET",
      ...options,
    }
  );
}
export function createTwitterTask(type: number, options?: RequestOptions) {
  return request(`/usercenter/task/createTwitterTask/${type}`, {
    method: "GET",
    ...options,
  });
}
export function createFeedback(
  data: { type: number; replyEmail: string; description: string },
  options?: RequestOptions
) {
  return request("/usercenter/feedback/create", {
    method: "POST",
    data,
    ...options,
  });
}
export function changePwdForEmail(
  body: { email: string; link: string },
  options: RequestOptions = {}
) {
  return request("/usercenter/email/anno/sendResetPasswordVerifyLink", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function userRegister(
  body: API.UserRegister,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/usercenter/user/anno/register", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function thirdPartyRegister(
  body: API.ThirdPartyRegister,
  options?: RequestOptions
) {
  return request<API.LoginResult>("/usercenter/user/anno/thirdPartyRegister", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function emailPasswordLogin(
  body: API.UserLogin,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/authentication/auth/emailPasswordLogin", {
    method: "POST",
    data: body,
    ...options,
  });
}

export function checkUserNameIsRegister(
  username: string,
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/user/anno/checkUserNameIsRegister?username=${username}`,
    {
      method: "POST",
      skipErrorHandler: true,
      ...options,
    }
  );
}

export function advertisement(
  body: { type?: number | string; email: string },
  options: RequestOptions = {}
) {
  return request(`/operation/operation/waitlist/create`, {
    method: "POST",
    data: body,
    ...options,
  });
}
export function getRedirectUrl(
  body: { thirdpartyName: string; redirectUri: string },
  options: RequestOptions = {}
) {
  return request<string>(`/authentication/auth/getRedirectUrl`, {
    method: "POST",
    data: body,
    ...options,
  });
}
export function checkEmailIsRegister(
  email: string,
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/user/anno/checkEmailIsRegister/V2?email=${email}`,
    {
      method: "POST",
      skipErrorHandler: true,
      ...options,
    }
  );
}
export function generateUsername(
  username: string,
  options: RequestOptions = {}
) {
  return request<string[]>(
    `/usercenter/user/anno/generateUsername?username=${username}`,
    {
      method: "POST",
      ...options,
    }
  );
}
export function sendRegisterVerifyCode(
  body: {
    password: string;
    rePassword: string;
    username: string;
    email: string;
  },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/email/anno/sendRegisterVerifyCode/V2`, {
    method: "POST",
    data: body,
    ...options,
  });
}
export function sendResetPasswordVerifyCode(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request<string>(
    `/usercenter/email/anno/sendResetPasswordVerifyCode/V2`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
export function sendBindEmailVerifyCodeV2(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/email/sendBindEmailVerifyCode/V2`, {
    method: "POST",
    data: body,
    ...options,
  });
}
export function checkUserVerifyCode(
  body: { email: string; type: string; verifyCode: string },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/user/anno/checkUserVerifyCode/V2`, {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
export function emailRegisterV2(
  body: {
    password: string;
    rePassword: string;
    username: string;
    email: string;
    verifyCode: string;
  },
  options: RequestOptions = {}
) {
  return request<API.LoginResult>(`/usercenter/user/anno/register/V2`, {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
export function updateLoginStatus(options: RequestOptions = {}) {
  return request(`/usercenter/user/updateLoginStatus`, {
    method: "PUT",
    ...options,
  });
}
export function getLanguageByIp(options: RequestOptions = {}) {
  return request<User.IPData>(`/contentAndSocial/getLanguageByIp`, {
    method: "GET",
    ...options,
  });
}
export function getUserLog(
  body: { path?: string; userId?: string } & API.Pagination,
  options: RequestOptions = {}
) {
  return request<
    API.ListResponse<{ id: string; userId: string; path: string }>
  >(`/data/user-activity-log-do/findPage`, {
    method: "POST",
    data: body,
    ...options,
  });
}
export function addInviter(
  invitationCode: string,
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/user/addInviter?invitationCode=${invitationCode}`,
    {
      method: "POST",
      skipErrorHandler: true,
      ...options,
    }
  );
}
export function getUserExp(options: RequestOptions = {}) {
  return request<API.userExp>(`/rights/equity/rab-exp-info/getUserExe`, {
    method: "GET",
    ...options,
  });
}

export function switchLanguage(language: string, options: RequestOptions = {}) {
  return request<API.userExp>(
    `/usercenter/user/switchLanguage?language=${language}`,
    {
      method: "PUT",
      ...options,
    }
  );
}
export function getSubscriptionList(
  body: { userId: number | string; domainType: 1 | 2 },
  options: RequestOptions = {}
) {
  return request<
    {
      id: string;
      onesignalId: string;
      onesignalSubscriptionId: string;
      userId: string;
    }[]
  >(`/push/natification/push-subscription/findList`, {
    method: "POST",
    data: body,
    ...options,
  });
}
export function createSubscription(
  body: {
    userId: number | string;
    onesignalSubscriptionId: string;
    domainType: 1 | 2;
  },
  options: RequestOptions = {}
) {
  return request<boolean>(`/push/natification/push-subscription/create`, {
    method: "POST",
    data: body,
    ...options,
  });
}
export function createDayilyCheckin(
  body: { userId: string },
  options: RequestOptions = {}
) {
  return request<boolean>(`/rights/daily-checkin-do/create`, {
    data: body,
    method: "POST",
    skipErrorHandler: true,
    ...options,
  });
}
export function getDailyCheckinList(
  body: Partial<API.Pagination & { userId: string }>,
  options: RequestOptions = {}
) {
  return request<API.ListResponse<{ consecutiveDays: number }>>(
    `/rights/daily-checkin-do/findPage`,
    {
      data: body,
      method: "POST",
      ...options,
    }
  );
}
export function getExpTaskList(
  body: Partial<{
    userId: string;
    taskType?: 1 | 2;
    pageSize?: number;
    orderItems?: { asc: boolean; column: string }[];
  }>,
  options: RequestOptions = {}
) {
  return request<API.ListResponse<User.Task>>(`/rights/exp-task-do/findPage`, {
    data: body,
    method: "POST",
    ...options,
  });
}
export function updateTask(body: User.Task, options: RequestOptions = {}) {
  return request<boolean>(`/rights/exp-task-do/update`, {
    data: body,
    method: "PUT",
    ...options,
  });
}
export function addShareCount(
  body: { invitationCode: string },
  options: RequestOptions = {}
) {
  return request<boolean>(`/rights/user-share-do/create`, {
    data: body,
    method: "POST",
    ...options,
  });
}
export function createActivityPost(
  data: Partial<User.S2Post>,
  options?: RequestOptions
) {
  return request("/usercenter/activity-contribute/create", {
    method: "POST",
    data,
    ...options,
  });
}
export function getActivityArticleList(
  data: {
    id: string;
  },
  options?: RequestOptions
) {
  return request<User.S2Post[]>("/usercenter/activity-contribute/findList", {
    method: "POST",
    data,
    ...options,
  });
}
/** 发送用于注册的邮箱验证码 */
export function sendRegisterVerifyCodeByEmail(
  body: {
    password: string;
    rePassword: string;
    username: string;
    email: string;
  },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/email/anno/sendRegisterVerifyCode/V2`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 发用用于注册的邮箱验证码 */
export function sendRegisterVerifyCodeByPhone(
  body: { phone: string },
  options: RequestOptions = {}
) {
  return request<boolean>("/usercenter/phone/anno/sendRegisterVerifyCode", {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 用户手机号注册 */
export function registerByPhone(
  body: API.UserRegisterByPhone,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/usercenter/user/anno/phone/register", {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
/** 校验 - 手机号是否已注册 */
export function checkPhoneIsRegister(
  phone: string,
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/user/anno/checkPhoneIsRegister?phone=${phone}`,
    {
      method: "POST",
      skipErrorHandler: true,
      ...options,
    }
  );
}
/** 发送用于登录的邮箱验证码 */
export function sendLoginVerifyCodeByEmail(
  body: {
    email: string;
    interval?: number;
    link?: string;
  },
  options: RequestOptions = {}
) {
  return request<boolean>(`/usercenter/email/anno/sendLoginVerifyCode`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 发送用于登录的手机验证码 */
export function sendLoginVerifyCodeByPhone(
  body: {
    phone: string;
  },
  options: RequestOptions = {}
) {
  return request<boolean>(`/usercenter/phone/anno/sendLoginVerifyCode`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 发送用于登录的邮箱验证码后，执行验证码登录操作 */
export function emailCodeLogin(
  body: Omit<API.EmailCodeLogin, "type">,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/authentication/auth/emailVerifyCodeLogin", {
    method: "POST",
    data: { type: "portal", ...body },
    skipErrorHandler: true,
    ...options,
  });
}
/** 发送用于登录的手机验证码后，执行验证码登录操作 */
export function phoneCodeLogin(
  body: API.PhoneCodeLogin,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/authentication/auth/phoneVerifyCodeLogin", {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
/** 手机密码登录 */
export function phonePasswordLogin(
  body: API.UserPhonePwdLogin,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>("/authentication/auth/phonePasswordLogin", {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
/** 重置密码 - 发送手机验证码 */
export function sendResetPasswordByPhoneVerifyCode(
  body: { phone: string },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/phone/anno/sendResetPasswordVerifyCode`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/**
 * 校验手机验证码，使用场景如下
 * - 忘记密码 `FORGOT_PASSWORD_CODE`
 * - 绑定手机 `BIND_CODE`
 * - 换绑手机前 `BEFORE_CHANGE_BIND_CODE`
 * - 换绑手机后 `AFTER_CHANGE_BIND_CODE`
 * - 更改密码 `CHANGE_PASSWORD_CODE`
 * - 注销 `LOGOUT_CODE`
 */
export function checkUserPhoneVerifyCode(
  body: { phone: string; type: string; verifyCode: string },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/user/anno/checkPhoneVerifyCode`, {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
/** 用户绑定手机号发送验证码 */
export function sendBindPhoneVerifyCode(
  body: { phone: string },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/phone/sendBindPhoneVerifyCode`, {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
/** 绑定手机 */
export function bindPhone(body: API.PhoneBind, options: RequestOptions = {}) {
  return request<string>(`/usercenter/personal/bindPhone`, {
    method: "PUT",
    data: body,
    ...options,
  });
}
/** 手机方式 - 忘记密码 */
export function forgotResetPasswordByPhone(
  body: API.ResetPwd,
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/user/anno/phone/forgot/resetPassword`, {
    method: "PUT",
    data: body,
    ...options,
  });
}
/** 已登录情况下，发送邮箱修改密码验证码 */
export function sendChangePasswordEmailVerifyCode(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/email/sendChangePasswordVerifyCode`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 已登录情况下，发送手机修改密码验证码 */
export function sendChangePasswordPhoneVerifyCode(
  body: { phone: string },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/phone/sendChangePasswordVerifyCode`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 已登录情况下，执行手机方式修改密码操作 */
export function changePasswordByEmail(
  body: API.ResetPwd,
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/personal/changePasswordByEmail`, {
    method: "PUT",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
/** 已登录情况下，执行手机方式修改密码操作 */
export function changePasswordByPhone(
  body: API.ResetPwd,
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/personal/changePasswordByPhone`, {
    method: "PUT",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
/** 用户注销账户，发送邮箱验证码 */
export function sendLogoutVerifyCodeByEmail(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/email/sendLogoutVerifyCode`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 用户注销账户，发送手机验证码 */
export function sendLogoutVerifyCodeByPhone(
  body: { phone: string },
  options: RequestOptions = {}
) {
  return request<string>(`/usercenter/phone/sendLogoutVerifyCode`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 通过邮箱执行注销账户 */
export function logoutByEmail(
  body: { token: string },
  options: RequestOptions = {}
) {
  return request<boolean>(`/usercenter/personal/logoutByEmail`, {
    method: "PUT",
    data: body,
    ...options,
  });
}
/** 通过手机执行注销账户 */
export function logoutByPhone(
  body: { token: string },
  options: RequestOptions = {}
) {
  return request<boolean>(`/usercenter/personal/logoutByPhone`, {
    method: "PUT",
    data: body,
    ...options,
  });
}
/** 用户换绑前邮箱(旧邮箱)发送验证码 */
export function sendBeforeChangeBindEmailVerifyCode(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/email/sendBeforeChangeBindEmailVerifyCode`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
/** 用户换绑前手机(旧手机)发送验证码 */
export function sendBeforeChangeBindPhoneVerifyCode(
  body: { phone: string },
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/phone/sendBeforeChangeBindPhoneVerifyCode`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
/** 用户换绑后邮箱(新邮箱)发送验证码 */
export function sendAfterChangeBindEmailVerifyCode(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/email/sendAfterChangeBindEmailVerifyCode`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
/** 用户换绑后手机(新手机)发送验证码 */
export function sendAfterChangeBindPhoneVerifyCode(
  body: { phone: string },
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/phone/sendAfterChangeBindPhoneVerifyCode`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
/** 换绑邮箱 - 用户绑定新邮箱 */
export function changeBindEmail(
  body: Pick<
    API.ChangeBindRequest,
    "beforeChangeBindToken" | "afterChangeBindToken"
  >,
  options: RequestOptions = {}
) {
  return request<boolean>(`/usercenter/personal/changeBindEmail`, {
    method: "PUT",
    data: body,
    ...options,
  });
}
/** 换绑手机 - 用户绑定新手机 */
export function changeBindPhone(
  body: API.ChangeBindRequest,
  options: RequestOptions = {}
) {
  return request<boolean>(`/usercenter/personal/changeBindPhone`, {
    method: "PUT",
    data: body,
    ...options,
  });
}
/**
 * 登录前，校验是否为新设备。`true` 为新设备
 * - type: 1 邮箱
 * - type: 2 手机
 */
export function checkIsNewDevice(
  query: { emailOrPhone: string; type: 1 | 2 },
  options: RequestOptions = {}
) {
  return request<boolean>(
    `/usercenter/user/anno/checkIsNewDevice?emailOrPhone=${query.emailOrPhone}&type=${query.type}`,
    {
      method: "POST",
      ...options,
    }
  );
}
/** 新设备登录。发送邮箱验证码。 */
export function sendNewDeviceEmailVerifyCode(
  body: { email: string },
  options: RequestOptions = {}
) {
  return request<boolean>(`/usercenter/email/anno/sendNewDeviceVerifyCode`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 新设备登录。发送验手机证码 */
export function sendNewDevicePhoneVerifyCode(
  body: { phone: string },
  options: RequestOptions = {}
) {
  return request<boolean>(`/usercenter/phone/anno/sendNewDeviceVerifyCode`, {
    method: "POST",
    data: body,
    ...options,
  });
}
/** 邮箱注册 V3 */
export function emailRegisterV3(
  body: API.UserRegisterV3,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>(`/usercenter/user/anno/v3/register`, {
    method: "POST",
    data: body,
    skipErrorHandler: true,
    ...options,
  });
}
/** 邮箱登录 V2 */
export function emailPasswordLoginV2(
  body: API.UserLogin,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>(
    `/authentication/auth/v2/emailPasswordLogin`,
    {
      method: "POST",
      data: body,
      skipErrorHandler: true,
      ...options,
    }
  );
}
/** 即没有邮箱也没有手机帐号场景下注销帐号 */
export function thirdPartyAccountLogout(options: RequestOptions = {}) {
  return request<API.LoginResult>(`usercenter/personal/logout`, {
    method: "PUT",
    ...options,
  });
}
/** 检测邮箱密码是否正确 */
export function checkEmailPasswordLogin(
  body: API.UserLogin,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>(
    `/usercenter/user/anno/checkEmailPasswordLogin`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
/** 检测手机密码是否正确 */
export function checkPhonePasswordLogin(
  body: API.UserPhonePwdLogin,
  options: RequestOptions = {}
) {
  return request<API.LoginResult>(
    `/usercenter/user/anno/checkPhonePasswordLogin`,
    {
      method: "POST",
      data: body,
      ...options,
    }
  );
}
