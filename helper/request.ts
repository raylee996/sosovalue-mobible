import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getUrl, getUploadURL } from "helper/config";
import { getLang, getToken, removeToken } from "helper/storage";
import { getUserDevice, isBrowser } from "helper/tools";
import { error } from "helper/alert";
import { IsAllowRegister } from "hooks/operation/useAuthModal";
import { Language } from "store/ThemeStore";
import router from "next/router";
import { WEAK_INTERNET_TIMEOUT } from "components/layout/Retry";

export interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  [key: string]: unknown;
}
interface BackendResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}
export type ResponseWrap<T = any> = {
  success: boolean;
  error: boolean;
} & BackendResponse<T>;

interface IRequest {
  <T = unknown>(url: string, opts: IRequestOptions): Promise<ResponseWrap<T>>;
}

export interface RequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  onRequestTimeout?: Function;
  [key: string]: unknown;
}

let deviceStr = "";

const axiosInstance = axios.create({
  baseURL: getUrl(),
  timeout: 20000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (isBrowser) {
    const token = getToken();

    if (!deviceStr) {
      const deviceData = getUserDevice();
      deviceStr = `${deviceData.browser.name}/${deviceData.browser.version}#${deviceData.os.name}/${deviceData.os.version}`;
    }

    if (token) {
      // @ts-ignore
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    const lang = router.locale || Language.EN;
    // @ts-ignore
    config.headers.set("Accept-Language", lang);
    config.headers.set("User-Device", deviceStr)
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<BackendResponse>) => {
    const config = response.config as RequestOptions;
    const { code, data, msg } = response.data;
    const result = {
      code,
      success: code === 0,
      error: code !== 0,
      data,
      msg,
    };
    if (code === 0) {
      return result;
    } else {
      if (!IsAllowRegister && code === 40014) {
        error("Registration is not yet open");
        return Promise.reject(result) as any;
      }
      if (code === 70004) {
        //查询不到对应币种币对的
        isBrowser && window.location.replace("/");
      }
      if (config.skipErrorHandler) {
        return result;
      } else {
        // error(msg);
        return Promise.reject(result) as any;
      }
    }
  },
  (err) => {
    // if (isBrowser && err.code === AxiosError.ECONNABORTED) {
    //   return timeoutRequest(() => axios(err.config));
    // }
    if (err.response?.status === 401) {
      removeToken();
      // if (userPaths.includes(window.location.pathname)) {
      //     window.location.replace('/')
      // }
    }
    if (err.response?.status !== 200) {
      // error(err.message);
    }

    console.log('err.?', err);
    
    if (
      isBrowser &&
      (err.code === AxiosError.ECONNABORTED ||
        err.code === AxiosError.ERR_NETWORK) &&
      err.config.onRequestTimeout
    ) {
      err.config.onRequestTimeout();
    }
    return Promise.reject(err);
  }
);

const timeoutRequest = (request: () => Promise<any>) => {
  let retryCount = 1;
  const requestHandle = (): Promise<any> => {
    if (retryCount >= 3) {
      return Promise.reject("网络异常，重连失败");
    }
    retryCount++;
    return request().catch((err: AxiosError) => {
      if (isBrowser && err.code === AxiosError.ECONNABORTED) {
        return requestHandle();
      } else {
        return Promise.reject(err);
      }
    });
  };
  return requestHandle();
};
const request: IRequest = (url, opts) => {
  return axiosInstance({ url, ...opts }) as Promise<any>;
};

export const uploadFile = (data: FormData) => {
  return axios.post<FormData, AxiosResponse<BackendResponse<{ url: string }>>>(
    `${getUploadURL()}/upload/upload`,
    data,
    {
      headers: {
        "Content-type": "multipart/form-data",
      },
    }
  );
};
// export const requestFormData = <T, R>(url: string, {data, ...opts}: AxiosRequestConfig) => {
//     const formData = new FormData()
//     Object.keys((key: string) => formData.append(key, data[key]))
//     return axios<T, AxiosResponse<ResponseWrap<R>>>({
//         url: getDomain() + url,
//         data,
//         ...opts,
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     })
// }
export default request;
