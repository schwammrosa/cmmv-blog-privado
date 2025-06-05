<template>
    <div class="w-full relative" style="background-color: var(--bg-color);">
        <div class="lg:max-w-[1400px] mx-auto px-4">
            <div v-if="!data.tag" class="rounded-lg p-6" style="background-color: var(--card-bg); color: var(--text-color);">
                <div class="text-center">
                    <h1 class="text-2xl font-bold mb-4" style="color: var(--text-color);">Tag não encontrada</h1>
                    <p style="color: var(--text-secondary);">A tag que você está procurando não existe ou está indisponível.</p>
                </div>
            </div>

            <div v-else class="flex flex-col xl:flex-row gap-3 sm:gap-5 md:gap-6 lg:gap-8 px-0 sm:px-2">


                <!-- Main Content -->
                <div class="rounded-lg p-2 sm:p-3 md:p-5 lg:p-6 article-container overflow-hidden flex-grow w-full" style="background-color: var(--card-bg); color: var(--text-color); border: 1px solid rgba(0, 160, 121, 0.3);">
                    <header class="border-b border-neutral-200 pb-2 sm:pb-4 mb-3 sm:mb-6 pr-2 sm:pr-4 pt-2 sm:pt-4">
                        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3" style="color: var(--text-color);">Tag: {{ data.tag.name }}</h1>
                        <p v-if="data.tag.description" class="mb-4" style="color: var(--text-secondary);">{{ data.tag.description }}</p>
                        <div class="text-sm" style="color: var(--text-secondary);">{{ data.tag.postCount }} posts com esta tag</div>
                    </header>



                    <!-- Initial loading state -->
                    <div v-if="loading && posts.length === 0" class="flex justify-center items-center py-20">
                        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0a5d28]"></div>
                    </div>

                    <!-- Posts List -->
                    <div v-else-if="posts.length > 0" class="space-y-6 sm:space-y-8 md:space-y-10 post-content prose prose-sm sm:prose max-w-none" style="color: var(--text-color);">
                        <article v-for="(post, index) in posts" :key="post.id" class="border-b border-neutral-200 pb-4 sm:pb-6 md:pb-8 last:border-0">
                            <!-- Feature Image -->
                            <a :href="`/post/${post.slug}`" class="block mb-2 sm:mb-3 md:mb-4" aria-label="Ler mais sobre este post">
                                <div v-if="post.featureImage" class="relative aspect-video overflow-hidden rounded-lg">
                                    <img :src="post.featureImage" :alt="post.featureImageAlt || post.title" class="w-full h-full object-cover" loading="lazy" />
                                </div>
                            </a>

                            <!-- Post Title -->
                            <h2 class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 break-words" style="color: var(--text-color);">
                                <a :href="`/post/${post.slug}`" class="hover:text-[#00A079] transition-colors" style="color: var(--text-color);" aria-label="Ler mais sobre este post">
                                    {{ post.title }}
                                </a>
                            </h2>

                            <!-- Post Meta -->
                            <div class="flex items-center mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm text-neutral-600">
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{{ formatDate(post.publishedAt || post.updatedAt) }}</span>
                                </div>
                            </div>

                            <!-- Post Excerpt -->
                            <div v-if="post.excerpt" class="mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base" style="color: var(--text-secondary);">
                                {{ post.excerpt }}
                            </div>
                            <div v-else-if="post.content" class="mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base" style="color: var(--text-secondary);">
                                {{ stripHtml(post.content).substring(0, 200) }}{{ stripHtml(post.content).length > 200 ? '...' : '' }}
                            </div>

                            <!-- Tags -->
                            <div v-if="post.tags && post.tags.length > 0" class="mb-3 sm:mb-4 flex flex-wrap gap-1 sm:gap-2">
                                <a v-for="tag in post.tags" :key="tag" :href="`/tag/${tag.slug}`"
                                class="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full transition-colors" style="background-color: var(--tag-bg, #333333); color: var(--tag-color, #aaaaaa);">
                                    {{ tag.name }}
                                </a>
                            </div>

                            <!-- Read More Button -->
                            <div class="mt-2 sm:mt-3 md:mt-4">
                                <a :href="`/post/${post.slug}`"
                                class="inline-flex items-center text-[#0a5d28] font-medium hover:text-[#064019] transition-colors text-sm sm:text-base">
                                    Ler mais
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </a>
                            </div>


                        </article>
                    </div>

                    <!-- No posts state -->
                    <div v-else-if="!loading && posts.length === 0" class="text-center py-16">
                        <h2 class="text-2xl font-bold mb-2" style="color: var(--text-color);">Nenhum post encontrado com esta tag</h2>
                        <p style="color: var(--text-secondary);">Volte mais tarde para novos conteúdos!</p>
                    </div>



                    <!-- Loading more indicator -->
                    <div v-if="loadingMore" class="mt-8 flex justify-center items-center py-6">
                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0a5d28]"></div>
                    </div>

                    <!-- Intersection observer target -->
                    <div ref="observerTarget" class="h-4 w-full"></div>
                </div>

                <!-- Right Sidebar with AdSense spaces -->
                <aside class="w-full md:w-72 lg:w-80 shrink-0 mt-4 md:mt-0">
                    <div class="sticky top-16 sm:top-20 md:top-24 space-y-4 sm:space-y-6">





                    </div>
                </aside>
            </div>
        </div>
    </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { vue3 } from '@cmmv/blog/client';
import { useSettingsStore } from '../../store/settings';

import {
    formatDate, stripHtml
} from '../../composables/useUtils';
import { useAds } from '../../composables/useAds';

// Declare adsbygoogle for TypeScript
declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const settingsStore = useSettingsStore();
const blogAPI = vue3.useBlog();
const route = useRoute();
const data = ref<any>(await blogAPI.tags.getPostsBySlug(route.params.slug as string));
const posts = ref<any[]>(data.value.posts || []);
const settings = ref<any>(settingsStore.getSettings);
const loading = ref(false);
const loadingMore = ref(false);
const hasMorePosts = ref(true);
const currentPage = ref(0);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const sidebarLeftAdContainer = ref<HTMLElement | null>(null);

const adPluginSettings = computed(() => {
    return settings.value || {};
});

const { adSettings, getAdHtml, loadAdScripts, loadSidebarLeftAd } = useAds(adPluginSettings.value, 'tag');

const pageUrl = computed(() => {
    const baseUrl = settings.value['blog.url'] || '';
    return `${baseUrl}/tag/${data.value?.tag?.slug || ''}`;
})

const headData = ref({
    title: data.value?.tag?.name + ' - ' + settings.value['blog.title'],
    meta: [
        { name: 'description', content: data.value?.tag?.description },
        { name: 'keywords', content: settings.value['blog.keywords'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: data.value?.tag?.name + ' - ' + settings.value['blog.title'] },
        { property: 'og:description', content: data.value?.tag?.description },
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

        const response = await blogAPI.tags.getPostsBySlug(route.params.slug as string, posts.value.length);

        if (response && response.posts && response.posts.length > 0) {
            posts.value = [...posts.value, ...response.posts];
            hasMorePosts.value = posts.value.length < (response.total || 0);
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

onMounted(async () => {
    loading.value = false;
    setupIntersectionObserver();

    // Load ad scripts and sidebar left ad
    loadAdScripts();
    loadSidebarLeftAd(sidebarLeftAdContainer.value);
});

onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
});
</script>

<style scoped>
.article-container {
    max-width: 48rem;
    margin: 0 auto;
}

.post-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0;
}

.post-content :deep(iframe) {
    max-width: 100%;
    border-radius: 4px;
    margin: 1rem 0;
}

.post-content :deep(table) {
    max-width: 100%;
    overflow-x: auto;
    display: block;
    border-collapse: collapse;
    margin: 1rem 0;
}

.post-content :deep(table td),
.post-content :deep(table th) {
    border: 1px solid #e5e5e5;
    padding: 0.5rem;
}

.post-content :deep(pre) {
    max-width: 100%;
    overflow-x: auto;
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
}

.post-content :deep(code) {
    white-space: pre-wrap;
    word-break: break-word;
    background-color: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
}

.post-content :deep(blockquote) {
    border-left: 4px solid #0a5d28;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #666;
}

.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.post-content :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
}

.post-content :deep(ul),
.post-content :deep(ol) {
    margin: 1rem 0;
    padding-left: 2rem;
}

.post-content :deep(li) {
    margin-bottom: 0.5rem;
}

.post-content :deep(a) {
    color: #0a5d28;
    text-decoration: underline;
}

.post-content :deep(a:hover) {
    color: #064019;
}

.ad-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    border-radius: 4px;
}

@media (max-width: 1536px) {
    .ad-sidebar-left {
        display: none;
    }
}
</style>
