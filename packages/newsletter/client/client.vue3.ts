//@ts-nocheck
import { useApi } from "@cmmv/blog/client/client.vue3";

let ref = (val) => ({ value: val });
let inject = () => ({});
let App = function () { };

try {
    const Vue = require('vue');
    ref = Vue.ref;
    inject = Vue.inject;
    App = Vue.App;
} catch (e) {}

/**
 * @description Use the Newsletter API to manage subscriptions
 * @returns {Object} The Newsletter API object
 */
export const useNewsletter = () => {
    const api = useApi();

    const subscribers = {
        subscribe: async (data: { email: string; name?: string; source?: string }) => {
            return api.post("newsletter/subscribers/subscribe", data)
                .then(response => response?.data || { success: true })
                .catch(error => {
                    console.error("Newsletter subscribe error:", error);
                    throw error;
                });
        },
        
        unsubscribe: async (email: string) => {
            return api.post(`newsletter/subscribers/unsubscribe/${encodeURIComponent(email)}`)
                .then(response => response?.data || { success: true })
                .catch(error => {
                    console.error("Newsletter unsubscribe error:", error);
                    throw error;
                });
        },

        getStatus: async (email: string) => {
            return api.get(`newsletter/subscribers/status/${encodeURIComponent(email)}`, `subscriber_status_${email}`)
                .then(response => response?.data || { subscribed: false })
                .catch(error => {
                    console.error("Newsletter status check error:", error);
                    return { subscribed: false };
                });
        }
    };

    return {
        subscribers
    };
}; 