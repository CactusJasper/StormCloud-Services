import Axios, { AxiosInstance, AxiosError } from 'axios';

import { defaultHeaders } from './defaultHeaders';
import { HttpStatus } from './responseCode.enum';

export const axios: AxiosInstance = Axios.create({
    timeout: 10000,
    headers: {
        ...defaultHeaders,
    },
});

export function RegisterInterceptor(): void {
    axios.interceptors.response.use((response: any) => response, async (error: AxiosError) => {
        if(!error.response) throw error;
        if(error.response.status === HttpStatus.FORBIDDEN) throw error;
        throw error;
    });
}
