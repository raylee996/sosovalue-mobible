import request, { RequestOptions } from 'helper/request'

export function getIndicatorTree(period: string, options: RequestOptions = {}) {
    return request<API.IndicatorTreeData[]>(`/data/s-indicator-config-do/findMultiList`, {
        method: 'POST',
        data: {period:period},
        ...options
    })
}

export function getDataChart(id: string | number,period: string | number, options: RequestOptions = {}) {
    return request<API.ChartDataWrap>(`/data/s-indicator-data-do/findMultiIndicator/detail`, {
        method: 'POST',
        data: {id:id,period:period},
        ...options
    })
}
//旧的多指标列表
// export function getIndicatorTree(period: string, options: RequestOptions = {}) {
//     return request<API.IndicatorTreeData[]>(`/data/multi-indicators-do/findIndicatorsWithCategoryPath/${period}`, {
//         method: 'POST',
//         data: {},
//         ...options
//     })
// }