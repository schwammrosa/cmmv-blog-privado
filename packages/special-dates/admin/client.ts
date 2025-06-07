//@ts-ignore
import { useApi } from '@cmmv/blog/admin/api';

export const useSpecialDatesClient = () => {
    const api = useApi();

    const specialDates = {
        get: async (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`special-dates?${query}`, "GET");
        },
        insert: async (data: any) => {
            return api.authRequest("special-dates", "POST", data);
        },
        update: async (id: string, data: any) => {
            return api.authRequest(`special-dates/${id}`, "PUT", data);
        },
        delete: async (id: string) => {
            return api.authRequest(`special-dates/${id}`, "DELETE");
        }
    }

    return {
        specialDates
    };
}; 