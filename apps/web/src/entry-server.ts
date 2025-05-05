import * as fs from 'node:fs';
import { createSSRApp } from 'vue';
//@ts-ignore
import { loadEnv } from 'vite';
import { createHead } from '@unhead/vue/server'
import { renderToString } from 'vue/server-renderer';
import { createPiniaInstance } from "./store/index.js";
import { useSettingsStore } from './store/settings.js';
import { useCategoriesStore } from "./store/categories.js";
import { usePostsStore } from './store/posts.js';
import { useMostAccessedPostsStore } from './store/mostaccessed.js';

import ClientOnly from './components/ClientOnly.vue';
import App from './App.vue';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'VITE');

let settingsData: any;
let categoriesData: any;
let postsData: any;
let mostAccessedPostsData: any;

export async function setup(){
    const urlQueries = new URLSearchParams({
        limit: "32",
        status: "published",
        sort: "ASC",
        sortBy: "publishedAt",
        offset: "0"
    }).toString();

    const settings = await fetch(`${env.VITE_API_URL}/settings`);
    const categories = await fetch(`${env.VITE_API_URL}/blog/categories`);
    const posts = await fetch(`${env.VITE_API_URL}/blog/posts?${urlQueries}`);
    const mostAccessedPosts = await fetch(`${env.VITE_API_URL}/blog/posts/most-accessed`);

    if (!settings.ok)
        throw new Error('Failed to fetch settings');

    if (!categories.ok)
        throw new Error('Failed to fetch categories');

    const themes = import.meta.glob('./theme-*/theme.json', {
        eager: true
    });

    await fetch(`${env.VITE_API_URL}/blog/themes`, {
        method: 'POST',
        body: JSON.stringify(themes),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.VITE_SIGNATURE}`
        }
    });

    settingsData = await settings.json();
    categoriesData = await categories.json();
    postsData = await posts.json();
    mostAccessedPostsData = await mostAccessedPosts.json();
}

export async function render(url: string) {
    try {
        if(!settingsData || !categoriesData)
            await setup();

        globalThis.__SSR_DATA__ = {};
        globalThis.__SSR_METADATA__ = {};

        const app = createSSRApp(App);
        const head = createHead();
        const pinia = createPiniaInstance();

        app.component('ClientOnly', ClientOnly);
        app.use(pinia);
        app.use(head);

        const settingsStore = useSettingsStore();
        const categoriesStore = useCategoriesStore();
        const postsStore = usePostsStore();
        const mostAccessedPostsStore = useMostAccessedPostsStore();

        //Settings
        settingsStore.setSettings(settingsData);
        let theme = settingsStore.getSetting('blog.theme', env.VITE_DEFAULT_THEME);
        const routerModules = import.meta.glob('./theme-*/router.ts');
        const importFn = routerModules[`./theme-${theme}/router.ts`];
        //@ts-ignore
        const { createRouter } = await importFn();
        const router = createRouter();

        categoriesStore.setCategories(categoriesData);
        postsStore.setPosts(postsData.result.posts);
        mostAccessedPostsStore.setMostAccessedPosts(mostAccessedPostsData);

        router.push(url);
        await router.isReady();

        const route = router.currentRoute.value
        const match = matchLegacyRedirect(route);

        if (match)
            return { redirect: match }

        app.use(router);
        await renderToString(app);

        const prefetchPromises = Object.values(globalThis.__SSR_DATA__ || {});
        await Promise.all(prefetchPromises);

        const resolvedData = await resolveSSRData(globalThis.__SSR_DATA__);
        const appFinal = createSSRApp(App);
        const headFinal = createHead();

        appFinal.component('ClientOnly', ClientOnly);
        appFinal.use(router);
        appFinal.use(headFinal);
        appFinal.use(pinia);
        appFinal.provide('preloaded', resolvedData);

        const html = await renderToString(appFinal);

        return {
            html,
            head: headFinal,
            preloadedData: resolvedData,
            metadata: globalThis.__SSR_METADATA__,
            piniaState: pinia.state.value,
            settings: settingsData,
            categories: categoriesData,
            posts: postsData.result,
            mostAccessedPosts: mostAccessedPostsData
        }
    } catch (e: any) {
        console.error('Render error:', e);
    }
}

function matchLegacyRedirect(route: any): string | null {
    const slug = route.params.slug;

    const legacyPaths = [
        /^\/\d{4}\/\d{2}\/\d{2}\/(.+?)\/?$/,
        /^\/\d{4}\/\d{2}\/(.+?)\/?$/,
        /^\/arquivos\/(\d+)$/,
        /^\/\?p=(\d+)$/
    ];

    for (const pattern of legacyPaths) {
        const match = route.fullPath.match(pattern);

        if (match)
            return `/post/${match[1]}`;
    }

    return null;
}

async function resolveSSRData(obj: Record<string, Promise<any>>) {
    if (!obj || Object.keys(obj).length === 0) return {};

    const keys = Object.keys(obj)

    const resolvedEntries = await Promise.all(
        keys.map(async (key) => {
            try {
                const value = obj[key];
                const resolvedValue = value instanceof Promise ? await value : value;
                return [key, resolvedValue];
            } catch (error) {
                console.error(`Error resolving SSR data for key ${key}:`, error);
                return [key, null];
            }
        })
    )

    return Object.fromEntries(resolvedEntries)
}

setInterval(setup, 1000 * 60 * 10);
