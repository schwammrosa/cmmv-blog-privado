<template>
    <div class="flex flex-col min-h-screen gamer-main-bg text-gray-200">
        <TheHeader />

        <!-- Main content -->
        <main class="flex-grow container mx-auto md:px-4 md:py-6 text-gamer-text">
            <div class="flex flex-col lg:flex-row gap-6">
                <router-view />
            </div>
        </main>

        <TheFooter />
        <CookieConsent />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick } from 'vue';
import { useHead } from '@unhead/vue';
import { useSettingsStore } from '../../store/settings';
import CookieConsent from '../../components/CookieConsent.vue';
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

const settingsStore = useSettingsStore();
const settings = computed(() => settingsStore.getSettings);

const scripts = computed(() => {
    const baseScripts = [
        {
            src: '/imgix-min.js?v=0.0.6',
            type: 'text/javascript',
            async: true,
            defer: true
        }
    ];
    if (settingsStore.googleAnalyticsScripts) {
    return [...baseScripts, ...settingsStore.googleAnalyticsScripts];
    }
    return baseScripts;
});

useHead({
     meta: computed(() => settingsStore.allMetaTags || []),

     link: computed(() => [
        {
            rel: 'stylesheet',
            href: '/src/theme-tudojogo/style.css'
        },
        {
            rel: 'stylesheet',
            href: '/src/theme-tudojogo/gamer-style.css'
        },
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap'
        },
        {
            rel: 'icon',
            type: 'image/ico',
            href: '/src/theme-tudojogo/assets/favicon.ico?v=2'
        },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com/' },
        { rel: 'preconnect', href: 'https://www.google-analytics.com/' },
        { rel: 'preconnect', href: 'https://www.googletag.com/' },
        { rel: 'preconnect', href: 'https://connect.facebook.net/' },
        { rel: 'preconnect', href: 'https://securepubads.g.doubleclick.net/' },
        { rel: 'preconnect', href: 'https://tpc.googlesyndication.com/' },
        { rel: 'preconnect', href: 'https://www.googletag.com/' },
        { rel: 'preconnect', href: 'https://static.tudojogo.com.br/' },
        { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com/' },
        { rel: 'dns-prefetch', href: 'https://securepubads.g.doubleclick.net' },
        { rel: 'dns-prefetch', href: 'https://static.tudojogo.com.br/' },
         { rel: 'alternate', href: `${settings.value?.['blog.url']}/feed`, type: 'application/rss+xml', title: settings.value?.['blog.title'] }
     ]),

    script: scripts
});

onMounted(() => {
    nextTick(() => {
        setTimeout(() => {
            document.querySelectorAll('.post-item, article, .post').forEach(post => {
                post.classList.add('post-card');
            });
            document.querySelectorAll('a.more-link, a.read-more, button.more, .button').forEach(btn => {
                btn.classList.add('read-more-btn');
            });
            document.querySelectorAll('a').forEach(link => {
                if (link.textContent && link.textContent.includes('Continuar')) {
                    link.classList.add('read-more-btn');
                }
            });
            document.querySelectorAll('.tag, .category, .tags a, .categories a').forEach(tag => {
                tag.classList.add('post-tag');
            });
            document.querySelectorAll('h2.widget-title, h3.widget-title, h2.section-heading, h3.section-heading').forEach(title => {
                title.classList.add('section-title');
            });
            document.querySelectorAll('.pagination a, .nav-links a, .page-numbers').forEach(page => {
                page.classList.add('pagination-item');
                if(page.classList.contains('current')) {
                    page.classList.add('active');
                }
            });
        }, 500);
    });
});
</script>

<style>
/* Estilos globais para o tema gamer */
.gamer-main-bg {
    background-color: #0d0d2b;
}

.text-gamer-text {
    color: #e0e0e0;
}
</style>