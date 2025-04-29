import { createSSRApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import { createPiniaInstance } from './store/index.js';
import { useSettingsStore } from './store/settings.js';
import ClientOnly from './components/ClientOnly.vue'
import App from './App.vue';

declare global {
    interface Window {
        __CMMV_DATA__: Record<string, any>;
        __PINIA__: Record<string, any>;
    }
}

async function main() {
    try{
        const head = createHead();
        const app = createSSRApp(App)
        const pinia = createPiniaInstance();

        const preloadedData = window.__CMMV_DATA__ || {};

        app.provide('preloaded', preloadedData)
        app.component('ClientOnly', ClientOnly)
        app.use(head)
        app.use(pinia);

        if ((window as any).__PINIA__)
            pinia.state.value = (window as any).__PINIA__;

        let theme = pinia.state.value.settings.data["blog.theme"] || import.meta.env.VITE_DEFAULT_THEME;
        const routerModules = import.meta.glob('./theme-*/router.ts');
        const importFn = routerModules[`./theme-${theme}/router.ts`] || routerModules[`./theme-default/router.ts`];
        //@ts-ignore
        const { createRouter } = await importFn();
        const router = createRouter();
        app.use(router);
        router.isReady().then(() => {
            app.mount('#app', true)
        })
    }
    catch(error){}
}

main();
