//@ts-ignore
import { useApi } from '@cmmv/blog/admin/api';

export const useYTClient = () => {
    const api = useApi();

    const channels = {
        get: (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`ytfeed/channels?${query}`, "GET");
        },
        insert: (data: any) => api.authRequest("ytfeed/channels", "POST", data),
        update: (id: string, data: any) => api.authRequest(`ytfeed/channels/${id}`, "PUT", data),
        delete: (id: string) => api.authRequest(`ytfeed/channels/${id}`, "DELETE"),
        processChannels: () => api.authRequest("ytfeed/channels/processChannels", "GET"),
        processChannel: (channelId: string) => api.authRequest(`ytfeed/channels/processChannel/${channelId}`, "GET"),
        getChannelInfo: (channelUrl: string) => api.authRequest(`ytfeed/channels/getChannelInfo?u=${encodeURIComponent(channelUrl)}`, "GET")
    };

    const videos = {
        get: (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`ytfeed/videos/admin?${query}`, "GET");
        },
        insert: (data: any) => api.authRequest("ytfeed/videos", "POST", data),
        update: (id: string, data: any) => api.authRequest(`ytfeed/videos/${id}`, "PUT", data),
        delete: (id: string) => api.authRequest(`ytfeed/videos/${id}`, "DELETE"),
        getAI: (id: string, data?: any) => api.authRequest(`ytfeed/videos/admin/ai/${id}`, "POST", data),
        reject: (id: string) => api.authRequest(`ytfeed/videos/admin/reject/${id}`, "DELETE")
    };

    return {
        channels,
        videos
    };
};
