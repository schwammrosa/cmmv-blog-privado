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
 * @description Use the Special Dates API to manage special dates
 * @returns {Object} The Special Dates API object
 */
export const useSpecialDates = () => {
    const api = useApi();

    const dates = {
        getAll: async () => {
            try {
                //console.log('[SpecialDatesClient] Fetching all special dates');
                const response = await api.get("special-dates", "special_dates_all", {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token') || ''
                    }
                });
                
                //console.log('[SpecialDatesClient] Response received:', 
                //    response ? 'data present' : 'no data',
                //    Array.isArray(response) ? `array length: ${response.length}` : 'not array');
                
                // Garantir um formato consistente na resposta
                if (!response) {
                    //console.warn('[SpecialDatesClient] Empty response, returning empty array');
                    return { data: [] };
                }
                
                // Se for um array, encapsular em um objeto com propriedade data
                if (Array.isArray(response)) {
                    //console.log('[SpecialDatesClient] Converting array response to object format');
                    return { data: response };
                }
                
                return response;
            } catch (error) {
                //console.error("[SpecialDatesClient] Special Dates getAll error:", error);
                return { data: [] };
            }
        },
        
        getBySlug: async (slug: string) => {
            try {
                const result = await api.get(`special-dates/find-by-slug/${slug}`, `special_date_${slug}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token') || ''
                    }
                });
                return result;
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 500)) {
                    try {
                        const result = await api.get(`special-dates?slug=${slug}`, `special_date_query_${slug}`, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token') || ''
                            }
                        });
                        return Array.isArray(result) && result.length > 0 ? result[0] : null;
                    } catch (fallbackError) {
                        try {
                            const allDates = await dates.getAll();
                            return Array.isArray(allDates) ? allDates.find(d => d.slug === slug) : null;
                        } catch (finalError) {
                            //console.error("Special Dates all fallbacks failed:", finalError);
                            throw finalError;
                        }
                    }
                }
                //console.error("Special Dates getBySlug error:", error);
                throw error;
            }
        },
    };

    return {
        dates
    };
}; 