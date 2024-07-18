import request, { RequestOptions } from 'helper/request'

export function getKlineData(body: {direct?: number; exchangeId: number | string; limit: number; minTime?: number; period: string; symbolId: number | string;}, options: RequestOptions = {}) {
    return request<string[][]>('/data/kline/history', {
        method: 'POST',
        data: body,
        ...options
    })
}