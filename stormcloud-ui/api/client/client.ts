import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { axios } from './httpInstance';

const sendRequest = <T>(config: AxiosRequestConfig): Promise<T> => axios.request<T, AxiosResponse<T>>(config)
    .then((res: { data: any }) => Promise.resolve(res.data))
    .catch((error: AxiosError) => Promise.reject(error?.response?.data ?? error));

export const getFactory = <T>(url: string, headers: any = null) => sendRequest<T>({ url, method: 'GET' as const as any, headers });

export const postFactory = <T, K>(url: string, body: T, headers: any = null) => sendRequest<K>({
    url,
    method: 'POST' as const as any,
    data: body,
    headers
});

export const putFactory = <T, K>(url: string, body: T, headers: any = null) => sendRequest<K>({
    url,
    method: 'PUT' as const as any,
    data: body,
    headers
});

export const deleteFactory = (url: string, headers: any = null) => sendRequest<void>({ url, method: 'DELETE' as const as any, headers });
