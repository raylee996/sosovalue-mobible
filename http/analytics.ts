import request, { RequestOptions } from 'helper/request'

export function analytics(body: { path: string; source: string; appNum: number }, options: RequestOptions = {}) {
    return request('/message/data/upload/anno/create', {
        method: 'POST',
        data: body,
        ...options
    })
}

export function sendUserMessage(body: API.userMessage, options: RequestOptions = {}) {
    return request('/data/s-user-action-log-do/create', {
        method: 'POST',
        data: body,
        ...options
    })
}