<template>
    <div class="w-full">
        <!-- Mensagens de erro/empty state -->
        <div v-if="error" class="text-center py-16 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Erro ao carregar posts</h2>
            <button @click="loadPosts" class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[#5a189a] transition-colors">
                Tentar novamente
            </button>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-16 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Nenhum post encontrado</h2>
            <p class="text-gray-600">Volte mais tarde para novos conteúdos!</p>
        </div>

        <!-- Grid de Notícias -->
        <div v-else class="container mx-auto px-4 py-8">
            <!-- Notícia Principal em Destaque -->
            <div v-if="posts.length > 0" class="mb-12">
                <h2 class="text-2xl font-bold mb-6 relative pl-3 border-l-4 border-[#7b2cbf]">Destaque</h2>
                <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <a :href="`/post/${posts[0].slug}`" class="block">
                        <div class="relative h-96 md:h-[30rem] w-full overflow-hidden">
                            <img 
                                v-if="posts[0].featureImage" 
                                :src="posts[0].featureImage" 
                                :alt="posts[0].title"
                                class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                            />
                            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                <i class="fas fa-image text-gray-400 text-6xl"></i>
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                                <span 
                                    v-if="posts[0].categories && posts[0].categories.length > 0"
                                    class="inline-block bg-[#14f195] text-gray-900 px-3 py-1 rounded-full text-sm font-medium mb-2"
                                >
                                    {{ posts[0].categories[0].name }}
                                </span>
                                <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ posts[0].title }}</h3>
                                <p class="text-gray-200 mb-4 line-clamp-2">
                                    {{ posts[0].excerpt || stripHtml(posts[0].content).substring(0, 150) + '...' }}
                                </p>
                                <div class="flex justify-between items-center text-sm text-gray-300">
                                    <span>{{ formatDate(posts[0].publishedAt) }}</span>
                                    <span class="text-[#14f195] font-medium">Ler mais <i class="fas fa-arrow-right ml-1"></i></span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Últimas Notícias -->
            <div class="mb-10">
                <h2 class="text-2xl font-bold mb-6 relative pl-3 border-l-4 border-[#7b2cbf]">Últimas Notícias</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div 
                        v-for="post in posts.slice(1)" 
                        :key="post.id" 
                        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <a :href="`/post/${post.slug}`" class="block">
                            <div class="relative h-48 overflow-hidden">
                                <img 
                                    v-if="post.featureImage" 
                                    :src="post.featureImage" 
                                    :alt="post.title"
                                    class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <i class="fas fa-image text-gray-400 text-4xl"></i>
                                </div>
                            </div>
                            <div class="p-5">
                                <span 
                                    v-if="post.categories && post.categories.length > 0"
                                    class="inline-block bg-[#14f195] text-gray-900 px-2 py-1 rounded-full text-xs font-medium mb-2"
                                >
                                    {{ post.categories[0].name }}
                                </span>
                                <h3 class="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200 line-clamp-2">{{ post.title }}</h3>
                                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                    {{ post.excerpt || stripHtml(post.content).substring(0, 120) + '...' }}
                                </p>
                                <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span>{{ formatDate(post.publishedAt) }}</span>
                                    <span class="text-[#7b2cbf] dark:text-[#14f195] font-medium">Ler mais <i class="fas fa-arrow-right ml-1"></i></span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Botão de Carregar Mais -->
            <div v-if="hasMorePosts" class="flex justify-center mt-8 mb-6">
                <button 
                    @click="loadMorePosts" 
                    :disabled="loadingMore" 
                    class="px-6 py-3 bg-[#7b2cbf] text-white rounded-md hover:bg-[#5a189a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span v-if="loadingMore">Carregando... <i class="fas fa-spinner fa-spin ml-1"></i></span>
                    <span v-else>Carregar mais notícias</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { vue3 } from '@cmmv/blog/client';
import { useSettingsStore } from '../../store/settings';
import { useCategoriesStore } from '../../store/categories';
import { usePostsStore } from '../../store/posts';
import { useMostAccessedPostsStore } from '../../store/mostaccessed';
import { formatDate, stripHtml } from '../../composables/useUtils';

const settingsStore = useSettingsStore();
const categoriesStore = useCategoriesStore();
const postsStore = usePostsStore();
const mostAccessedPostsStore = useMostAccessedPostsStore();
const blogAPI = vue3.useBlog();

// State
const settings = ref<any>(settingsStore.getSettings);
const categories = ref<any[]>(categoriesStore.getCategories || []);
const posts = ref<any[]>(postsStore.getPosts || []);
const popularPosts = ref<any[]>(mostAccessedPostsStore.getMostAccessedPosts || []);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(0);
const hasMorePosts = ref(true);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const currentCarouselIndex = ref(0);
const carouselInterval = ref<number | null>(null);

const coverSettings = computed(() => {
    try {
        const config = settings.value['blog.cover'];
        return config ? JSON.parse(config) : { layoutType: 'full' };
    } catch (err) {
        console.error('Error parsing cover settings:', err);
        return { layoutType: 'full' };
    }
});

const hasCoverConfig = computed(() => {
    return !!settings.value['blog.cover'] && Object.keys(coverSettings.value).length > 0;
});

const coverPosts = computed(() => {
    if (!posts.value.length) return {};

    const result: any = {
        full: posts.value[0],
        carousel: posts.value.slice(0, 3),
        splitMain: posts.value[0],
        splitSide: posts.value.slice(1, 3),
        dual: posts.value.slice(0, 2)
    };

    if (hasCoverConfig.value) {
        const config = coverSettings.value;
        const shouldRespectSelectedPosts = config.respectSelectedPosts !== false;

        if (shouldRespectSelectedPosts) {
            // Handle "full" layout
            if (config.layoutType === 'full' && config.fullCover?.postId) {
                const configPost = posts.value.find(p => p.id === config.fullCover.postId);
                if (configPost) result.full = configPost;
            }

            // Handle "carousel" layout
            if (config.layoutType === 'carousel' && Array.isArray(config.carousel)) {
                const carouselPostIds = config.carousel
                    .filter(item => item && item.postId)
                    .map(item => item.postId);

                if (carouselPostIds.length) {
                    const configPosts = carouselPostIds
                        .map((id: string) => posts.value.find(p => p.id === id))
                        .filter(Boolean);

                    if (configPosts.length) result.carousel = configPosts;
                }
            }

            // Handle "split" layout
            if (config.layoutType === 'split') {
                // Main post
                if (config.split?.main?.postId) {
                    const mainPost = posts.value.find(p => p.id === config.split.main.postId);
                    if (mainPost) result.splitMain = mainPost;
                }

                // Secondary posts
                if (Array.isArray(config.split?.secondary)) {
                    const secondaryPostIds = config.split.secondary
                        .filter(item => item && item.postId)
                        .map(item => item.postId);

                    if (secondaryPostIds.length) {
                        const secondaryPosts = secondaryPostIds
                            .map((id: string) => posts.value.find(p => p.id === id))
                            .filter(Boolean);

                        if (secondaryPosts.length) result.splitSide = secondaryPosts;
                    }
                }
            }

            // Handle "dual" layout
            if (config.layoutType === 'dual' && Array.isArray(config.dual)) {
                const dualPostIds = config.dual
                    .filter(item => item && item.postId)
                    .map(item => item.postId);

                if (dualPostIds.length) {
                    const configPosts = dualPostIds
                        .map((id: string) => posts.value.find(p => p.id === id))
                        .filter(Boolean);

                    if (configPosts.length) result.dual = configPosts;
                }
            }
        }
    }

    return result;
});

const startCarouselInterval = () => {
    if (coverSettings.value.layoutType === 'carousel' && coverPosts.value.carousel?.length > 1) {
        carouselInterval.value = window.setInterval(() => {
            nextCarouselSlide();
        }, 5000);
    }
};

const stopCarouselInterval = () => {
    if (carouselInterval.value) {
        clearInterval(carouselInterval.value);
        carouselInterval.value = null;
    }
};

const nextCarouselSlide = () => {
    stopCarouselInterval();
    if (coverPosts.value.carousel?.length) {
        currentCarouselIndex.value = (currentCarouselIndex.value + 1) % coverPosts.value.carousel.length;
    }
    startCarouselInterval();
};

const prevCarouselSlide = () => {
    stopCarouselInterval();
    if (coverPosts.value.carousel?.length) {
        currentCarouselIndex.value = (currentCarouselIndex.value - 1 + coverPosts.value.carousel.length) % coverPosts.value.carousel.length;
    }
    startCarouselInterval();
};

const headData = ref({
    title: settings.value['blog.title'],
    meta: [
        { name: 'description', content: settings.value['blog.description'] },
        { name: 'keywords', content: settings.value['blog.keywords'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: settings.value['blog.title'] },
        { property: 'og:description', content: settings.value['blog.description'] },
        { property: 'og:image', content: settings.value['blog.logo'] }
    ],
    link: [
        { rel: 'canonical', href: settings.value['blog.url'] },
        { rel: 'alternate', href: `${settings.value['blog.url']}/feed`, type: 'application/rss+xml', title: settings.value['blog.title'] }
    ]
});

useHead(headData);

const pagination = ref({
    total: 0,
    limit: 12,
    offset: 0
});

const featuredPost = computed(() => {
    return posts.value.length > 0 ? posts.value[0] : null;
});

const reviewPosts = computed(() => {
    const reviewCategory = categories.value.find(cat =>
        cat.name.toLowerCase() === 'review' ||
        cat.name.toLowerCase() === 'reviews' ||
        cat.name.toLowerCase() === 'análise' ||
        cat.name.toLowerCase() === 'análises');

    if (reviewCategory) {
        return posts.value.filter(post =>
            post.categories &&
            post.categories.some(cat => cat.id === reviewCategory.id)
        ).slice(0, 2);
    } else {
        const middleIndex = Math.min(Math.floor(posts.value.length / 2), 5);
        return posts.value.slice(middleIndex, middleIndex + 2);
    }
});

const loadPosts = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response: any = await blogAPI.posts.getAll(currentPage.value * pagination.value.limit);

        if (response) {
            posts.value = response.posts;

            pagination.value = {
                total: response.meta?.pagination?.total || 0,
                limit: response.meta?.pagination?.limit || 12,
                offset: response.meta?.pagination?.offset || 0
            };

            hasMorePosts.value = posts.value.length < response.count;

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

const loadMorePosts = async () => {
    if (loadingMore.value || !hasMorePosts.value) return;

    try {
        loadingMore.value = true;
        currentPage.value++;

        const response: any = await blogAPI.posts.getAll(posts.value.length);

        if (response && response.posts && response.posts.length > 0) {
            posts.value = [...posts.value, ...response.posts];

            pagination.value = {
                total: response.meta?.pagination?.total || 0,
                limit: response.meta?.pagination?.limit || 12,
                offset: response.meta?.pagination?.offset || 0
            };

            hasMorePosts.value = posts.value.length < response.count;
        } else {
            hasMorePosts.value = false;
        }
    } catch (err: any) {
        console.error('Failed to load more posts:', err);
    } finally {
        loadingMore.value = false;
    }
};

const setupIntersectionObserver = () => {
    observer.value = new IntersectionObserver(
        (entries) => {
            const [entry] = entries;

            if (entry.isIntersecting && hasMorePosts.value && !loadingMore.value)
                loadMorePosts();
        },
        { threshold: 0.1 }
    );

    if (observerTarget.value) {
        observer.value.observe(observerTarget.value);
    }
};

const getAuthor = (post: any) => {
    if (!post.authors || !post.authors.length) return null;
    return post.authors.find((author: any) => author.id === post.author);
};

onMounted(async () => {
    await Promise.all([
        loadPosts()
    ]);
    setupIntersectionObserver();
    startCarouselInterval();
});

onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
    stopCarouselInterval();
});

watch(() => settings.value['blog.cover'], () => {
    stopCarouselInterval();
    startCarouselInterval();
}, { deep: true });
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Section styling to match Index.html */
section {
    margin-bottom: 40px;
    padding: 10px 0;
}

/* Section title styling */
.section-title, h2 {
    position: relative;
}

h2::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 4px;
    background-color: #ff0030;
}

.news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}
</style>
