import request, { RequestOptions } from 'helper/request'

export function getLibraryList(body: API.Pagination, options: RequestOptions = {}) {
    return request<API.ListResponse<API.Post>>('/manager/article/library/get/list', {
        method: 'POST',
        data: body,
        ...options
    })
}
export function getPost(id: string | number, options: RequestOptions = {}) {
    return request<API.Post>(`/manager/article/content/manager/${id}`, {
        method: 'GET',
        ...options
    })
}
export function increaseReadPost(id: string | number, options: RequestOptions = {}) {
    return request(`/manager/article/content/manager/reading/quantity/inCreate/${id}`, {
        method: 'POST',
        ...options
    })
}
export function scorePost(body: API.ScorePost, options: RequestOptions = {}) {
    return request(`/manager/article/content/manager/user/score`, {
        method: 'POST',
        data: body,
        ...options
    })
}