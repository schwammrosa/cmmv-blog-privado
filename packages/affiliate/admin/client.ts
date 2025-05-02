//@ts-ignore
import { useApi } from '@cmmv/blog/admin/api';

export const useAffiliateClient = () => {
    const api = useApi();

    const networks = {
        get: async (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRootRequest(`affiliate/networks?${query}`, "GET");
        },
        insert: async (data: any) => {
            return api.authRootRequest("affiliate/networks", "POST", data);
        },
        update: async (id: string, data: any) => {
            return api.authRootRequest(`affiliate/networks/${id}`, "PUT", data);
        },
        delete: async (id: string) => {
            return api.authRootRequest(`affiliate/networks/${id}`, "DELETE");
        }
    }

    const campaigns = {
        get: async (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRootRequest(`affiliate/campaigns?${query}`, "GET");
        },
        insert: async (data: any) => {
            return api.authRootRequest("affiliate/campaigns", "POST", data);
        },
        update: async (id: string, data: any) => {
            return api.authRootRequest(`affiliate/campaigns/${id}`, "PUT", data);
        },
        delete: async (id: string) => {
            return api.authRootRequest(`affiliate/campaigns/${id}`, "DELETE");
        }
    }

    const coupons = {
        get: async (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`affiliate/coupons?${query}`, "GET");
        },
        insert: async (data: any) => {
            return api.authRequest("affiliate/coupons", "POST", data);
        },
        update: async (id: string, data: any) => {
            return api.authRequest(`affiliate/coupons/${id}`, "PUT", data);
        },
        delete: async (id: string) => {
            return api.authRequest(`affiliate/coupons/${id}`, "DELETE");
        }
    }

    return {
        networks,
        campaigns,
        coupons
    };
};
