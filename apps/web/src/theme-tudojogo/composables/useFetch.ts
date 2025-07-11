import { ref, inject, App } from 'vue'

type FetchMap = Record<string, Promise<any>>
const PRELOADED_KEY = Symbol('preloaded')

let ssrData: FetchMap = {}

export async function useFetch<T>(url: string, key: string) {
    const preloaded = inject<Record<string, any>>('preloaded', {})
    const data = ref<T | null>(preloaded[key] ?? null)

    const isSSR = typeof window === 'undefined';

    if (isSSR && !preloaded[key]) {
        if (!globalThis.__SSR_DATA__)
            globalThis.__SSR_DATA__ = {}

        globalThis.__SSR_DATA__[key] = await fetch(url).then(res => res.json()).then(data => data.result)
        data.value = globalThis.__SSR_DATA__[key];
    } else if (!isSSR && data.value === null) {
        data.value = await fetch(url).then(res => res.json()).then(data => data.result);
    }

    return { data }
}

export const useFetchPlugin = {
    install(app: App) {
        app.config.globalProperties.useFetch = useFetch
        app.provide(PRELOADED_KEY, {})

        app.provide('ssr-fetch-collector', {
            collect: () => ssrData,
            clear: () => {
                ssrData = {}
            }
        })
    }
} 