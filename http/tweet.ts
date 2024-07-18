import request, { RequestOptions } from 'helper/request'

export function getConfig(body: { typeIdList: number[] }, options: RequestOptions = {}) {
    return request<API.Dict[]>('/configuration/configuration/findList', {
        method: 'POST',
        data: body,
        ...options
    })
}

