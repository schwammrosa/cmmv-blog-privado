<template>
    <div class="w-full relative bg-[#0a0a1a]">
        <div class="lg:max-w-4xl md:max-w-3xl mx-auto">
            <div v-if="!category" class="bg-[#0a0a1a] rounded-lg p-6 text-gray-100 border border-[#303443]">
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-white mb-4">Categoria não encontrada</h1>
                    <p class="text-gray-300">A categoria que você está procurando não existe ou está indisponível.</p>
                </div>
            </div>

            <div v-else class="bg-[#0a0a1a] rounded-lg p-6 article-container overflow-hidden text-gray-100 border border-[#303443]">
                <header class="border-b border-[#303443] pb-4 mb-6 pt-4 text-center">
                    <div class="bg-[#6600cc] py-2 px-8 rounded-md inline-block mb-3">
                        <h1 class="text-3xl font-bold text-white uppercase">{{ category.name }}</h1>
                    </div>
                    <p v-if="category.description" class="text-gray-300 mb-4">{{ category.description }}</p>
                    <div class="text-sm text-gray-400">{{ category.postCount }} posts nesta categoria</div>
                </header>

                <!-- Initial loading state -->
                <div v-if="loading && posts.length === 0" class="flex justify-center items-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ade80]"></div>
                </div>

                <!-- Posts List Grid -->
                <div v-else-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
                    <template v-for="(post, idx) in posts" :key="post.id">
                        <article
                            class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300 flex flex-col min-h-[120px] post-card"
                        >
                            <a :href="`/post/${post.slug}`" class="block">
                                <div class="h-48 overflow-hidden relative group">
                                    <OptimizedImage
                                        v-if="post.featureImage"
                                        :src="post.featureImage"
                                        :alt="post.featureImageAlt || post.title"
                                        class="w-full h-full object-cover imgix-lazy transition-transform duration-500 group-hover:scale-110"
                                        width="300"
                                        height="180"
                                        loading="lazy"
                                        priority="low"
                                        icon-size="sm"
                                    />
                                    <div v-else class="w-full h-full border border-[#303443] flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <!-- Aqui mostramos sempre a categoria atual -->
                                    <div class="absolute top-2 left-2">
                                        <span class="bg-[#5046e5] text-white px-3 py-1 rounded-full text-xs font-medium">
                                            {{ category.name }}
                                        </span>
                                    </div>
                                </div>
                            </a>
                            <div class="p-4 flex flex-col flex-1">
                                <a :href="`/post/${post.slug}`" class="block mb-auto">
                                    <h3 class="text-lg font-bold text-gray-900 mb-2 hover:text-[#00ccff] transition-colors line-clamp-2 border-l-2 border-[#6600cc] pl-2">
                                        {{ post.title }}
                                    </h3>
                                </a>
                                <p class="text-gray-700 text-sm mb-3 line-clamp-2">
                                    {{ post.excerpt || stripHtml(post.content).substring(0, 120) + '...' }}
                                </p>
                                <div class="flex justify-between items-center text-xs text-gray-500 mb-3">
                                    <span v-if="post.author && getAuthor(post)">Por {{ getAuthor(post).name }}</span>
                                    <span>{{ formatDate(post.publishedAt || post.updatedAt) }}</span>
                                </div>
                                
                                <!-- Botão Continuar Lendo -->
                                <div class="text-center mt-auto">
                                    <a :href="`/post/${post.slug}`" class="gamer-button inline-block px-4 py-2 text-sm font-medium rounded-md transition-all hover:shadow-lg text-white" style="color: white !important;">
                                        Continuar lendo
                                    </a>
                                </div>
                            </div>
                        </article>
                        <AdBanner v-if="(idx + 1) % 3 === 0" placement="inContent" />
                    </template>
                </div>

                <!-- No posts state -->
                <div v-else-if="!loading && posts.length === 0" class="text-center py-16">
                    <h2 class="text-2xl font-bold mb-2 text-white">Nenhum post encontrado nesta categoria</h2>
                    <p class="text-gray-300">Volte mais tarde para novos conteúdos!</p>
                </div>

                <!-- Loading more indicator -->
                <div v-if="loadingMore" class="mt-8 flex justify-center items-center py-6">
                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ade80]"></div>
                </div>

                <!-- No more posts indicator -->
                <div v-if="!hasMorePosts && posts.length > 0 && !loadingMore" class="mt-8 text-center py-4 text-gray-400">
                    Você chegou ao final dos posts
                </div>

                <!-- Intersection observer target -->
                <div ref="observerTarget" class="h-4 w-full"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue'
import { vue3 } from '@cmmv/blog/client';
import { useSettingsStore } from '../../store/settings';
import OptimizedImage from '../../components/OptimizedImage.vue';
import AdBanner from '../components/AdBanner.vue';

import {
    formatDate, stripHtml
} from '../../composables/useUtils';

const settingsStore = useSettingsStore();
const blogAPI = vue3.useBlog();
const route = useRoute();

const isSSR = import.meta.env.SSR
const posts = ref<any[]>([]);
const settings = ref<any>(settingsStore.getSettings);
const category = ref<any>(null);
const pagination = ref<any>(null);
const loading = ref(true);
const loadingMore = ref(false);
const hasMorePosts = ref(true);
const currentPage = ref(0);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);

loading.value = true;

const data = ref<any>(route.params.id ?
    await blogAPI.categories.getById(route.params.id as string) :
    await blogAPI.categories.getBySlug(route.params.slug as string));

category.value = data.value.category;
posts.value = data.value.posts?.data || [];
pagination.value = data.value.posts?.pagination;

hasMorePosts.value = posts.value.length < (data.value.posts?.count || 0);

const pageUrl = computed(() => {
    return `${import.meta.env.VITE_WEBSITE_URL}/category/${category.value?.slug || ''}`
})

const headData = ref({
    title: category.value.name + ' - ' + settings.value['blog.title'],
    meta: [
        { name: 'description', content: category.value.description },
        { name: 'keywords', content: settings.value['blog.keywords'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: category.value.name + ' - ' + settings.value['blog.title'] },
        { property: 'og:description', content: category.value.description },
        { property: 'og:image', content: settings.value['blog.logo'] },
        { property: 'og:url', content: pageUrl.value }
    ],
    link: [
        { rel: 'canonical', href: pageUrl.value }
    ]
})

useHead(headData);

const loadMorePosts = async () => {
    if (loadingMore.value || !hasMorePosts.value) return;

    try {
        loadingMore.value = true;
        currentPage.value++;

        const response = route.params.id ?
            await blogAPI.categories.getById(route.params.id as string, posts.value.length) :
            await blogAPI.categories.getBySlug(route.params.slug as string, posts.value.length);

        if (response && response.posts && response.posts.data && response.posts.data.length > 0) {
            posts.value = [...posts.value, ...response.posts.data];
            hasMorePosts.value = posts.value.length < (response.posts.count || 0);
        } else {
            hasMorePosts.value = false;
        }
    } catch (err) {
        console.error('Failed to load more posts:', err);
    } finally {
        loadingMore.value = false;
    }
};

const setupIntersectionObserver = () => {
    observer.value = new IntersectionObserver(
        (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMorePosts.value && !loadingMore.value) {
                loadMorePosts();
            }
        },
        { threshold: 0.1 }
    );

    if (observerTarget.value) {
        observer.value.observe(observerTarget.value);
    }
};

const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, '');
};

const getAuthor = (post) => {
    if (!post) return null;
    if (post.author) return post.author;
    if (settings.value && settings.value.author) return settings.value.author;
    return null;
};

onMounted(async () => {
    loading.value = false;
    setupIntersectionObserver();
});

onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
});
</script>
