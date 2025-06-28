import axios, { AxiosInstance } from 'axios';
import { CommandHandler } from './registry.js';

export interface SiYuanResponse<T = any> {
    code: number;
    msg: string;
    data: T;
}

// Factory function to create a standard handler
export function createHandler(endpoint: string): (params: unknown) => Promise<any> {
    return async (params: unknown) => {
        const response = await client.post(endpoint, params);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(response.data)
                }
            ]
        };
    };
}

class SiYuanClient {
    private static instance: SiYuanClient | null = null;
    private static baseURL: string = process.env.SIYUAN_API_URL || "http://localhost:6806";
    private static token: string = process.env.SIYUAN_TOKEN || "";
    private axiosInstance: AxiosInstance;

    private constructor() {
        if (!SiYuanClient.token) {
            console.warn('Warning: SIYUAN_TOKEN environment variable is not set, API calls may fail');
        }

        this.axiosInstance = axios.create({
            baseURL: SiYuanClient.baseURL,
            headers: {
                'Authorization': `Token ${SiYuanClient.token}`,
                'Content-Type': 'application/json'
            }
        });

        // Add a response interceptor
        this.axiosInstance.interceptors.response.use(
            response => response.data,
            error => {
                // Enhanced error handling
                if (error.response) {
                    console.error('API response error:', {
                        status: error.response.status,
                        data: error.response.data
                    });
                } else if (error.request) {
                    console.error('API request error:', error.message);
                } else {
                    console.error('Other error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    public static getInstance(): SiYuanClient {
        if (!SiYuanClient.instance) {
            SiYuanClient.instance = new SiYuanClient();
        }
        return SiYuanClient.instance;
    }

    // Basic HTTP methods
    async post<T = any>(url: string, data?: any): Promise<SiYuanResponse<T>> {
        return this.axiosInstance.post(url, data);
    }
}

export const client = SiYuanClient.getInstance();