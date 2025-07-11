<template>
    <div class="w-full max-w-[1200px] mx-auto px-4">
        <div v-if="error" class="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Erro ao carregar posts</h2>
            <p class="text-gray-600 mb-4">Não foi possível carregar os posts. Por favor, tente novamente.</p>
            <button @click="loadPosts" class="px-4 py-2 bg-[#0a5d28] text-white rounded-md hover:bg-[#064019] transition-colors">
                Tentar novamente
            </button>
        </div>

        <div v-else-if="preparedPosts.length === 0 && !loading" class="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Nenhum post encontrado</h2>
            <p class="text-gray-600">Volte mais tarde para novos conteúdos!</p>
        </div>

        <div v-else>
            <CoverSection :posts="preparedPosts" :settings="settings" />
            
            <AdBanner placement="header" />

            <div class="flex flex-col lg:flex-row gap-8">
                <div class="flex-grow">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2">
                            <div>
                                <template v-for="(post, idx) in latestPosts" :key="post.id">
                                    <PostList
                                        v-if="idx === 0"
                                        title="Últimas Notícias"
                                        :posts="[post]"
                                        :horizontal="true"
                                    />
                                    <PostList
                                        v-else-if="idx === 1"
                                        title=""
                                        :posts="[post]"
                                        :horizontal="true"
                                    />

                                    <PostList
                                        v-else-if="idx > 1"
                                        title=""
                                        :posts="[post]"
                                        :horizontal="true"
                                    />
                                </template>
                            </div>
                            <AdBanner placement="belowContent" />

                            <div ref="maisConteudoObserver"></div>
                            
                            <div v-if="isMobile && !showMoreContentMobile" class="flex justify-center my-6">
                                <button @click="showMoreContentMobile = true" class="gamer-button px-6 py-2 rounded-md text-white font-bold text-lg shadow-md hover:shadow-lg transition-all">
                                    Carregar mais conteúdo
                                </button>
                            </div>
                            <div v-if="(isMobile ? showMoreContentMobile : showMoreContent)" class="mais-conteudo-section">
                                <h2 class="text-xl font-bold mb-6 pb-2 text-[#0a5d28] border-b-2 border-[#ffcc00] titulo-gamer">
                                    <span>Mais Conteúdo</span>
                                </h2>
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <template v-for="(post, idx) in paginatedMoreContent" :key="post.id">
                                        <article class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300 flex flex-col">
                                            <a :href="`/post/${post.slug}`" class="block w-full overflow-hidden relative">
                                                <OptimizedImage
                                                    :src="post.featureImage"
                                                    :alt="post.title"
                                                    width="400"
                                                    height="220"
                                                    loading="lazy"
                                                    :hover="true"
                                                    icon-size="md"
                                                    class="w-full h-56 min-h-56 max-h-56 object-cover object-center"
                                                />
                                                <div v-if="post.categories && post.categories.length > 0" class="absolute top-2 left-2 z-10">
                                                    <span class="bg-[#5046e5] text-white px-3 py-1 rounded-full text-xs font-medium">
                                                        {{ post.categories[0].name }}
                                                    </span>
                                                </div>
                                            </a>
                                            <div class="p-4 flex flex-col flex-1">
                                                <a :href="`/post/${post.slug}`" class="block">
                                                    <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-1 hover:text-[#0a5d28] transition-colors line-clamp-2">
                                                        {{ post.title }}
                                                    </h3>
                                                </a>
                                                <p class="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                                                    {{ post.excerpt }}
                                                </p>
                                                <div class="flex justify-between items-center text-xs text-gray-500 mb-2">
                                                    <span v-if="post.authors && post.authors.length > 0">Por {{ post.authors[0].name }}</span>
                                                    <span>{{ post.publishedAt }}</span>
                                                </div>
                                                <div class="mt-auto text-center">
                                                    <a :href="`/post/${post.slug}`" class="gamer-button inline-block px-3 py-1 text-xs font-medium rounded-md transition-all hover:shadow-lg text-white" style="color: white !important;">
                                                        Continuar lendo
                                                    </a>
                                                </div>
                                            </div>
                                        </article>
                                        

                                    </template>
                                </div>
                            </div>

                            <div v-if="showMoreContent && maisConteudoTotalPages > 1" class="mt-8 flex justify-center">
                                <div class="flex items-center space-x-2">
                                    <button 
                                        @click="maisConteudoPage > 1 && maisConteudoPage--" 
                                        class="px-3 py-1 rounded-md transition-colors gamer-button" 
                                        :class="{'opacity-50 cursor-not-allowed': maisConteudoPage === 1}">
                                        &laquo; Anterior
                                    </button>
                                    
                                    <template v-for="pageNum in maisConteudoTotalPages" :key="pageNum">
                                        <button 
                                            v-if="shouldShowPageButton(pageNum)"
                                            @click="maisConteudoPage = pageNum" 
                                            class="px-3 py-1 rounded-md transition-colors" 
                                            :class="maisConteudoPage === pageNum ? 'gamer-button' : 'border border-gray-300 hover:border-green-200'">
                                            {{ pageNum }}
                                        </button>
                                        <span v-else-if="pageNum === 2 && maisConteudoPage > 4" class="px-2">...</span>
                                        <span v-else-if="pageNum === maisConteudoTotalPages - 1 && maisConteudoPage < maisConteudoTotalPages - 3" class="px-2">...</span>
                                    </template>
                                    
                                    <button 
                                        @click="maisConteudoPage < maisConteudoTotalPages && maisConteudoPage++" 
                                        class="px-3 py-1 rounded-md transition-colors gamer-button"
                                        :class="{'opacity-50 cursor-not-allowed': maisConteudoPage === maisConteudoTotalPages}">
                                        Próximo &raquo;
                                    </button>
                                </div>
                            </div>
                            <AdBanner placement="belowContent" />
                        </div>

                        <div class="lg:col-span-1 min-w-[300px]">
                            <AdBanner placement="sidebarTop" />
                            <div class="hidden md:block">
                                <PopularPostsWidget :posts="popularPosts" />
                            </div>
                            <AdBanner placement="sidebarMid" />
                            <AdBanner placement="sidebarBottom" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="adSettings.enableAds && adSettings.enableTaboolaAds && adSettings.taboolaJsCode" v-html="adSettings.taboolaJsCode"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, provide } from 'vue';
import { useHead } from '@unhead/vue';
import { vue3 } from '@cmmv/blog/client';
import { useSettingsStore } from '../../store/settings';
import { useCategoriesStore } from '../../store/categories';
import { usePostsStore } from '../../store/posts';
import { useMostAccessedPostsStore } from '../../store/mostaccessed';
import { useAdManager } from '../composables/useAdManager.js';
import { usePreparedPosts } from '../composables/usePreparedPosts.js';
import { useErrorHandling } from '../composables/useErrorHandling.js';
import { useNetworkErrorHandling } from '../composables/useNetworkErrorHandling.js';

import CoverSection from '../components/CoverSection.vue';
import PostList from '../components/PostList.vue';
import PopularPostsWidget from '../components/PopularPostsWidget.vue';
import AdBanner from '../components/AdBanner.vue';
import OptimizedImage from '../../components/OptimizedImage.vue';

declare global {
    interface Window {
        adsbygoogle: any[];
        workbox: any;
        imgix: any;
    }
}

const settingsStore = useSettingsStore();
const categoriesStore = useCategoriesStore();
const postsStore = usePostsStore();
const mostAccessedStore = useMostAccessedPostsStore();
const blogAPI = vue3.useBlog();

const { preparePosts } = usePreparedPosts();
const { setupGlobalErrorHandling } = useErrorHandling();
const { setupNetworkErrorHandling } = useNetworkErrorHandling();

const isMobile = ref(false);
const checkMobileView = () => { isMobile.value = window.innerWidth < 768; };

onMounted(() => {
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    setupGlobalErrorHandling();
    setupNetworkErrorHandling();
});

onUnmounted(() => {
    window.removeEventListener('resize', checkMobileView);
});

const rawSettings = computed(() => settingsStore.getSettings);
const settings = computed<Record<string, any>>(() => {
    const settingsObj = rawSettings.value || {};
    const blogSettings: Record<string, any> = {};
    Object.keys(settingsObj).forEach(key => {
        if (key.startsWith('blog.')) {
            const shortKey = key.replace('blog.', '');
            blogSettings[shortKey] = settingsObj[key];
        }
    });
    return blogSettings;
});
const categories = ref<any[]>(categoriesStore.getCategories || []);
const posts = ref<any[]>(postsStore.getPosts || []);
const preparedPosts = ref<any[]>([]);
const popularPosts = ref<any[]>(mostAccessedStore.getMostAccessedPosts || []);
const loading = ref(true);
const error = ref(null);
const maisConteudoPage = ref(1);
const maisConteudoPerPage = ref(6);
const showMoreContent = ref(false);
const showMoreContentMobile = ref(false);
const maisConteudoObserver = ref<HTMLElement | null>(null);
const hydrated = ref(false);

const { adSettings, loadAdScripts } = useAdManager();

const featuredPost = computed(() => {
    return preparedPosts.value.length > 0 ? preparedPosts.value[0] : null;
});

const latestPosts = computed(() => {
    const start = isMobile.value ? 0 : (featuredPost.value ? 3 : 0);
    const end = isMobile.value ? 4 : (featuredPost.value ? 7 : 4);
    return preparedPosts.value.slice(start, end);
});

const maisConteudoTotalPages = computed(() => {
    const totalItems = preparedPosts.value.length - (featuredPost.value ? 5 : 4);
    return Math.max(1, Math.ceil(totalItems / maisConteudoPerPage.value));
});

const paginatedMoreContent = computed(() => {
    const startIndex = isMobile.value ? (featuredPost.value ? 5 : 4) : (featuredPost.value ? 7 : 4);
    const offset = (maisConteudoPage.value - 1) * maisConteudoPerPage.value;
    return preparedPosts.value.slice(startIndex + offset, startIndex + offset + maisConteudoPerPage.value);
});

const shouldShowPageButton = (pageNum: number) => {
    if (pageNum === 1 || pageNum === maisConteudoTotalPages.value) return true;
    if (Math.abs(pageNum - maisConteudoPage.value) <= 1) return true;
    return false;
};

const headData = ref({
    title: settings.value.title,
    meta: [
        { name: 'description', content: settings.value.description },
        { name: 'keywords', content: settings.value.keywords },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: settings.value.title },
        { property: 'og:description', content: settings.value.description },
        { property: 'og:image', content: settings.value.logo }
    ],
    link: [
        { rel: 'canonical', href: settings.value.url },
        { rel: 'alternate', href: `${settings.value.url}/feed`, type: 'application/rss+xml', title: settings.value.title }
    ]
});

useHead(headData);

const loadPosts = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response: any = await blogAPI.posts.getAll(0);

        if (response) {
            posts.value = response.posts;
            preparedPosts.value = preparePosts(response.posts);

            maisConteudoPage.value = 1;

            if (!categories.value.length) {
                try {
                    const categoriesResponse = await blogAPI.categories.getAll();
                    if (categoriesResponse) {
                        categories.value = categoriesResponse;
                    }
                } catch (err) {
                    console.error('Failed to load categories:', err);
                }
            }
        }
    } catch (err: any) {
        console.error('Failed to load posts:', err);
        error.value = err;
    } finally {
        loading.value = false;
    }
};

provide('hydrated', hydrated);

onMounted(async () => {
    loading.value = false;
    hydrated.value = true;
    loadAdScripts();
    if(posts.value.length === 0) {
        await loadPosts();
    } else {
        preparedPosts.value = preparePosts(posts.value);
    }

    await nextTick();
    
    if (maisConteudoObserver.value && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        showMoreContent.value = true;
                        observer.disconnect();
                    }
                });
            },
            { 
                rootMargin: '0px',
                threshold: 0.1
            }
        );
        
        observer.observe(maisConteudoObserver.value);
    } else {
        showMoreContent.value = true;
    }
});

watch(() => posts.value, (newPosts) => {
    preparedPosts.value = preparePosts(newPosts);
}, { deep: true });
</script>

<style scoped>
@media (max-width: 1280px) {
    .ad-sidebar-left {
        display: none;
    }
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ad-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    border-radius: 4px;
}
</style>


