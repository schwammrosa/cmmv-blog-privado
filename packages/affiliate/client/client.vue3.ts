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

const PRELOADED_KEY = Symbol('preloaded');
type FetchMap = Record<string, Promise<any>>;
let ssrData: FetchMap = {};

/**
 * @description Get the environment variable
 * @param {string} key - The key of the environment variable
 * @returns {string | undefined} The environment variable
 */
export const getEnv = (key: string): string | undefined => {
    if (typeof import.meta !== 'undefined' && import.meta.env)
        return import.meta.env[key]

    if (typeof process !== 'undefined' && process.env)
        return process.env[key]

    return undefined
}

/**
 * @description Use the Blog API to fetch data from the server
 * @returns {Object} The Blog API object
 */
export const useAffiliate = () => {
    const api = useApi();

    const categories = {
        getAll: async () => {
            const { data } = await api.get<any[]>("blog/categories", "categories");
            categoriesData.value = data.value || [];
            return data.value || [];
        },
        getById: async (id: string, offset: number = 0) => {
            const urlQueries = new URLSearchParams({ limit: "32", offset: offset.toString() }).toString();
            const { data } = await api.get<any[]>(`blog/categories/${id}?${urlQueries}`, "category");
            return data.value || [];
        },
        getBySlug: async (slug: string, offset: number = 0) => {
            const urlQueries = new URLSearchParams({ limit: "32", offset: offset.toString() }).toString();
            const { data } = await api.get<any[]>(`blog/categories/slug/${slug}?${urlQueries}`, "category");
            return data.value || [];
        }
    };

    return {
        categories,
    };
};