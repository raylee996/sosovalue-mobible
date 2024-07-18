import request, { RequestOptions } from 'helper/request';

/**
 * 获取telegram机器人信息
 * @param type 1: PC；1 2: mobile。该项目始终为 "2"
 */
export const getTelegramBotInfo = async (type: "1" | "2", options: RequestOptions = {}) => {
    return request<API.TelegramBotInfo>(`/usercenter/thirdparty/anno/getTgInfo?type=${type}`, {
        method: "GET",
        ...options
    })
}
