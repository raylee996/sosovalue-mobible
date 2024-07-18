import request, { RequestOptions } from 'helper/request'

export function getCalendarIndicators(body: {startTime: number, endTime: number}, options: RequestOptions = {}) {
    return request<Record<string, API.Indicator[]>>('/data/indicator/findRecentIndicators', {
        method: 'POST',
        data: body,
        ...options
    })
}
export function getIndicatorClasses(body: {level?: number; parentId?: string;type?:number}, options: RequestOptions = {}) {
    return request<API.Indicator[]>('/data/indicator-classification-do/findList', {
        method: 'POST',
        data: body,
        ...options
    })
}
export function getIndicatorData(body: {classificationId: string | number; isDisplay: number;} & API.Pagination, options: RequestOptions = {}) {
    return request<API.ListResponse<API.IndicatorData>>('/data/indicator/findPage', {
        method: 'POST',
        data: body,
        ...options
    })
}
export function getLastUpdateTime(body: {classificationId: string | number;}, options: RequestOptions = {}) {
    return request<string>('/data/indicator/getLastUpdateTime', {
        method: 'POST',
        data: body,
        ...options
    })
}

export function getChartData(id: string | number, options: RequestOptions = {}) {
    return request<API.ChartDataWrap>(`/data/chart/data/chart/${id}`, {
        method: 'GET',  
        ...options
    })
}

export function getChartInvestData(id: string | number, params:{startTime: number, endTime: number}, options: RequestOptions = {}) {
    return request<API.ChartDataWrap>(`/data/chart/data/chart/invest/${id}`, {
        method: 'GET',  
        params,
        ...options
    })
}