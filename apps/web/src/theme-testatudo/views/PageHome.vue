<template>
    <div>
        <div v-if="error" class="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Erro ao carregar posts</h2>
            <p class="text-gray-600 mb-4">Não foi possível carregar os posts. Por favor, tente novamente.</p>
            <button @click="loadPosts" class="px-4 py-2 bg-[#ff0030] text-white rounded-md hover:bg-red-700 transition-colors">
                Tentar novamente
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="posts.length === 0" class="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Nenhum post encontrado</h2>
            <p class="text-gray-600">Volte mais tarde para novos conteúdos!</p>
        </div>

        <div v-else>
            <!-- Hero Section - Carrossel Automático -->
            <section class="relative h-[500px] md:h-[400px] sm:h-[300px] bg-gray-800 mb-8 overflow-hidden">
                <div class="w-full h-full relative">
                    <!-- Botões de navegação -->
                    <div class="absolute inset-0 z-30 pointer-events-none flex justify-between items-center px-5">
                        <button @click="prevCarouselSlide" class="w-10 h-10 rounded-full bg-black/50 text-white flex justify-center items-center cursor-pointer transition-all hover:bg-[#ff0030]/80 hover:scale-110 pointer-events-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <button @click="nextCarouselSlide" class="w-10 h-10 rounded-full bg-black/50 text-white flex justify-center items-center cursor-pointer transition-all hover:bg-[#ff0030]/80 hover:scale-110 pointer-events-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Slides -->
                    <div v-for="(post, index) in carouselPosts" :key="post.id"
                         class="absolute inset-0 bg-cover bg-center transition-all duration-1200 ease-in-out"
                         :class="{ 'opacity-100 z-20 transform scale-100': currentCarouselIndex === index, 'opacity-0 z-10 transform scale-105': currentCarouselIndex !== index }"
                         :style="{ backgroundImage: `url('${post.featureImage || 'https://via.placeholder.com/1200x500'}')` }">
                        <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
                            <h2 class="text-3xl md:text-2xl sm:text-xl font-bold mb-4 sm:mb-2">{{ post.title }}</h2>
                            <p class="text-base sm:text-sm mb-5 sm:mb-3 max-w-2xl mx-auto">
                                {{ post.excerpt || stripHtml(post.content).substring(0, 150) + '...' }}
                            </p>
                            <a :href="`/post/${post.slug}`" class="inline-block bg-[#ff0030] text-white px-4 py-2 sm:px-3 sm:py-1.5 rounded text-sm font-medium hover:bg-red-700 transition-colors mb-6 sm:mb-3">Leia mais</a>
                        </div>
                    </div>

                    <!-- Indicadores de slide -->
                    <div class="absolute bottom-5 left-0 right-0 z-30 flex justify-center gap-3">
                        <span
                            v-for="(_, idx) in carouselPosts"
                            :key="idx"
                            class="w-3.5 h-3.5 rounded-full bg-white/50 border-2 border-transparent cursor-pointer transition-all hover:scale-110"
                            :class="{'bg-[#ff0030] border-white scale-120': currentCarouselIndex === idx}"
                            @click="currentCarouselIndex = idx">
                        </span>
                    </div>
                </div>
            </section>

            <!-- Latest News -->
            <section class="px-4 mb-10">
                <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-[#ff0030] pb-2 mb-6 relative">
                    Últimas Notícias
                    <span class="absolute bottom-[-2px] left-0 w-[60px] h-[4px] bg-[#ff0030]"></span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <article v-for="post in posts.slice(0, 3)" :key="post.id" class="bg-white rounded-lg overflow-hidden shadow-md hover:translate-y-[-5px] transition-transform duration-300 flex flex-col h-full">
                        <img :src="post.featureImage || 'https://via.placeholder.com/400x180'" :alt="post.title" class="w-full h-[180px] object-cover">
                        <div class="p-4 flex-grow flex flex-col">
                            <span v-if="post.categories && post.categories.length > 0" class="inline-block bg-[#ff0030] text-white text-xs px-2 py-1 rounded mb-2 self-start">
                                {{ post.categories[0].name }}
                            </span>
                            <h3 class="text-lg font-semibold mb-2">{{ post.title }}</h3>
                            <p class="text-gray-600 text-sm mb-4 flex-grow">
                                {{ post.excerpt || stripHtml(post.content).substring(0, 120) + '...' }}
                            </p>
                            <div class="flex justify-between text-gray-500 text-xs mt-auto">
                                <span>Por: {{ getAuthor(post)?.name || 'Redação' }}</span>
                                <span>{{ formatDate(post.publishedAt || post.createdAt) }}</span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <!-- Reviews -->
            <section class="px-4 mb-10">
                <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-[#ff0030] pb-2 mb-6 relative">
                    Reviews
                    <span class="absolute bottom-[-2px] left-0 w-[60px] h-[4px] bg-[#ff0030]"></span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <article class="md:col-span-2 bg-white rounded-lg overflow-hidden shadow-md">
                        <img :src="reviewPosts[0]?.featureImage || 'https://via.placeholder.com/600x300'" :alt="reviewPosts[0]?.title" class="w-full h-[300px] object-cover">
                        <div class="p-6">
                            <span class="inline-block bg-[#ff0030] text-white text-sm font-bold px-2.5 py-1 rounded mb-2.5">9.5</span>
                            <h3 class="text-2xl font-bold mb-3">{{ reviewPosts[0]?.title || 'Review em destaque' }}</h3>
                            <p class="text-gray-600 mb-4">
                                {{ reviewPosts[0]?.excerpt || stripHtml(reviewPosts[0]?.content || '').substring(0, 200) + '...' || 'Conteúdo da review em destaque.' }}
                            </p>
                            <a :href="`/post/${reviewPosts[0]?.slug || '#'}`" class="inline-block bg-[#ff0030] text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors">
                                Leia a análise completa
                            </a>
                        </div>
                    </article>
                    <div class="md:col-span-1 flex flex-col gap-4">
                        <article v-for="post in reviewPosts.slice(1, 4)" :key="post.id" class="flex bg-white rounded-lg overflow-hidden shadow-md">
                            <img :src="post.featureImage || 'https://via.placeholder.com/100x100'" :alt="post.title" class="w-[100px] h-[100px] object-cover">
                            <div class="p-3 flex-1">
                                <span class="inline-block bg-[#ff0030] text-white text-xs font-bold px-1.5 py-0.5 rounded mb-1">8.7</span>
                                <h4 class="font-bold text-sm mb-1">{{ post.title }}</h4>
                                <p class="text-gray-500 text-xs">
                                    {{ post.excerpt ? post.excerpt.substring(0, 60) + '...' : stripHtml(post.content).substring(0, 60) + '...' }}
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <!-- Videos -->
            <section class="px-4 mb-10">
                <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-[#ff0030] pb-2 mb-6 relative">
                    Vídeos em Destaque
                    <span class="absolute bottom-[-2px] left-0 w-[60px] h-[4px] bg-[#ff0030]"></span>
                </h2>
                <div class="relative overflow-hidden px-10">
                    <button @click="prevVideoSlide" class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-[#ff0030] text-white p-2 rounded-r-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div class="carousel-track flex gap-5 py-4 transition-transform duration-500" :style="{ transform: `translateX(-${videoSlideOffset}px)` }">
                        <div v-for="post in videoPosts" :key="post.id" class="flex-none w-[300px] aspect-video relative rounded overflow-hidden shadow-md">
                            <img :src="post.featureImage || 'https://via.placeholder.com/300x170'" :alt="post.title" class="w-full h-full object-cover">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-10 h-10 bg-[#ff0030]/80 text-white rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                <h4 class="text-sm font-semibold text-white">{{ post.title }}</h4>
                            </div>
                        </div>
                    </div>
                    <button @click="nextVideoSlide" class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-[#ff0030] text-white p-2 rounded-l-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <div class="carousel-dots flex justify-center mt-4 gap-2">
                        <button
                            v-for="i in Math.ceil(videoPosts.length / visibleVideoSlides)"
                            :key="i"
                            @click="videoSlideOffset = (i-1) * (visibleVideoSlides * 300)"
                            class="w-2 h-2 rounded-full bg-gray-300 transition-colors"
                            :class="{ 'bg-[#ff0030]': videoSlideOffset === (i-1) * (visibleVideoSlides * 300) }">
                        </button>
                    </div>
                </div>
            </section>

            <!-- Tech Section -->
            <section class="px-4 mb-10">
                <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-[#ff0030] pb-2 mb-6 relative">
                    Tecnologia
                    <span class="absolute bottom-[-2px] left-0 w-[60px] h-[4px] bg-[#ff0030]"></span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <article v-for="post in technologyPosts" :key="post.id" class="flex bg-white rounded-lg overflow-hidden shadow-md hover:translate-y-[-5px] transition-transform duration-300">
                        <img :src="post.featureImage || 'https://via.placeholder.com/200x150'" :alt="post.title" class="w-[200px] h-[150px] object-cover flex-shrink-0">
                        <div class="p-4 flex flex-col flex-grow">
                            <span class="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mb-2 self-start">Hardware</span>
                            <h3 class="text-lg font-semibold mb-2">{{ post.title }}</h3>
                            <p class="text-gray-600 text-sm mb-4 flex-grow">
                                {{ post.excerpt ? post.excerpt.substring(0, 100) + '...' : stripHtml(post.content).substring(0, 100) + '...' }}
                            </p>
                            <a :href="`/post/${post.slug}`" class="text-gray-700 font-medium hover:text-[#ff0030] transition-colors mt-auto">Leia mais →</a>
                        </div>
                    </article>
                </div>
            </section>

            <!-- Games Section -->
            <section class="px-4 mb-10">
                <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-[#ff0030] pb-2 mb-6 relative">
                    Games
                    <span class="absolute bottom-[-2px] left-0 w-[60px] h-[4px] bg-[#ff0030]"></span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <article v-for="post in gamePosts" :key="post.id" class="flex bg-white rounded-lg overflow-hidden shadow-md hover:translate-y-[-5px] transition-transform duration-300">
                        <img :src="post.featureImage || 'https://via.placeholder.com/200x150'" :alt="post.title" class="w-[200px] h-[150px] object-cover flex-shrink-0">
                        <div class="p-4 flex flex-col flex-grow">
                            <span class="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded mb-2 self-start">RPG</span>
                            <h3 class="text-lg font-semibold mb-2">{{ post.title }}</h3>
                            <p class="text-gray-600 text-sm mb-4 flex-grow">
                                {{ post.excerpt ? post.excerpt.substring(0, 100) + '...' : stripHtml(post.content).substring(0, 100) + '...' }}
                            </p>
                            <a :href="`/post/${post.slug}`" class="text-gray-700 font-medium hover:text-[#ff0030] transition-colors mt-auto">Leia mais →</a>
                        </div>
                    </article>
                </div>
            </section>

            <!-- Hardware Section -->
            <section class="px-4 mb-10" v-if="posts.length > 12">
                <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-[#ff0030] pb-2 mb-6 relative">
                    Hardware
                    <span class="absolute bottom-[-2px] left-0 w-[60px] h-[4px] bg-[#ff0030]"></span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <article v-for="post in hardwarePosts" :key="post.id" class="flex bg-white rounded-lg overflow-hidden shadow-md hover:translate-y-[-5px] transition-transform duration-300">
                        <img :src="post.featureImage || 'https://via.placeholder.com/200x150'" :alt="post.title" class="w-[200px] h-[150px] object-cover flex-shrink-0">
                        <div class="p-4 flex flex-col flex-grow">
                            <span class="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded mb-2 self-start">Processadores</span>
                            <h3 class="text-lg font-semibold mb-2">{{ post.title }}</h3>
                            <p class="text-gray-600 text-sm mb-4 flex-grow">
                                {{ post.excerpt ? post.excerpt.substring(0, 100) + '...' : stripHtml(post.content).substring(0, 100) + '...' }}
                            </p>
                            <a :href="`/post/${post.slug}`" class="text-gray-700 font-medium hover:text-[#ff0030] transition-colors mt-auto">Leia mais →</a>
                        </div>
                    </article>
                </div>
            </section>

            <!-- Loading More Indicator -->
            <div v-if="loadingMore" class="flex justify-center items-center py-8 mb-6">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff0030]"></div>
                <span class="ml-3 text-gray-600">Carregando mais posts...</span>
            </div>

            <!-- Infinite Scroll Observer Target -->
            <div ref="observerTarget" class="h-4 w-full"></div>
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
import { formatDate, stripHtml } from '../../composables/useUtils';

const settingsStore = useSettingsStore();
const categoriesStore = useCategoriesStore();
const postsStore = usePostsStore();
const blogAPI = vue3.useBlog();

// State
const settings = ref<any>(settingsStore.getSettings);
const categories = ref<any[]>(categoriesStore.getCategories || []);
const posts = ref<any[]>(postsStore.getPosts || []);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(0);
const hasMorePosts = ref(true);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const currentCarouselIndex = ref(0);
const carouselInterval = ref<number | null>(null);
const videoSlideOffset = ref(0);
const totalVideoSlides = ref(0);
const visibleVideoSlides = ref(3);

const carouselPosts = computed(() => {
    return posts.value.slice(0, 5);
});

const reviewPosts = computed(() => {
    const reviewCategory = categories.value.find(cat =>
        cat.name.toLowerCase().includes('review') ||
        cat.name.toLowerCase().includes('análise')
    );

    if (reviewCategory) {
        return posts.value.filter(post =>
            post.categories &&
            post.categories.some(cat => cat.id === reviewCategory.id)
        ).slice(0, 4);
    }

    return posts.value.slice(3, 7);
});

const videoPosts = computed(() => {
    const videoCategory = categories.value.find(cat =>
        cat.name.toLowerCase().includes('vídeo') ||
        cat.name.toLowerCase().includes('video')
    );

    if (videoCategory) {
        return posts.value.filter(post =>
            post.categories &&
            post.categories.some(cat => cat.id === videoCategory.id)
        ).slice(0, 5);
    }

    return posts.value.slice(7, 12);
});

const technologyPosts = computed(() => {
    const techCategory = categories.value.find(cat =>
        cat.name.toLowerCase().includes('tech') ||
        cat.name.toLowerCase().includes('tecnologia')
    );

    if (techCategory) {
        return posts.value.filter(post =>
            post.categories &&
            post.categories.some(cat => cat.id === techCategory.id)
        ).slice(0, 4);
    }

    return posts.value.slice(12, 16);
});

const gamePosts = computed(() => {
    const gameCategory = categories.value.find(cat =>
        cat.name.toLowerCase().includes('game') ||
        cat.name.toLowerCase().includes('jogo')
    );

    if (gameCategory) {
        return posts.value.filter(post =>
            post.categories &&
            post.categories.some(cat => cat.id === gameCategory.id)
        ).slice(0, 4);
    }

    return posts.value.slice(16, 20);
});

const hardwarePosts = computed(() => {
    const hardwareCategory = categories.value.find(cat =>
        cat.name.toLowerCase().includes('hardware')
    );

    if (hardwareCategory) {
        return posts.value.filter(post =>
            post.categories &&
            post.categories.some(cat => cat.id === hardwareCategory.id)
        ).slice(0, 4);
    }

    return posts.value.slice(20, 24);
});

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

const startCarouselInterval = () => {
    carouselInterval.value = window.setInterval(() => {
        nextCarouselSlide();
    }, 5000);
};

const stopCarouselInterval = () => {
    if (carouselInterval.value) {
        clearInterval(carouselInterval.value);
        carouselInterval.value = null;
    }
};

const nextCarouselSlide = () => {
    stopCarouselInterval();
    if (carouselPosts.value.length) {
        currentCarouselIndex.value = (currentCarouselIndex.value + 1) % carouselPosts.value.length;
    }
    startCarouselInterval();
};

const prevCarouselSlide = () => {
    stopCarouselInterval();
    if (carouselPosts.value.length) {
        currentCarouselIndex.value = (currentCarouselIndex.value - 1 + carouselPosts.value.length) % carouselPosts.value.length;
    }
    startCarouselInterval();
};

const nextVideoSlide = () => {
    const maxOffset = Math.max(0, (videoPosts.value.length - visibleVideoSlides.value) * 300);
    videoSlideOffset.value = Math.min(videoSlideOffset.value + 300, maxOffset);
};

const prevVideoSlide = () => {
    videoSlideOffset.value = Math.max(videoSlideOffset.value - 300, 0);
};

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
    await loadPosts();
    setupIntersectionObserver();
    startCarouselInterval();

    // Set visible video slides based on screen width
    const updateVisibleSlides = () => {
        if (window.innerWidth < 640) {
            visibleVideoSlides.value = 1;
        } else if (window.innerWidth < 1024) {
            visibleVideoSlides.value = 2;
        } else {
            visibleVideoSlides.value = 3;
        }
    };

    updateVisibleSlides();
    window.addEventListener('resize', updateVisibleSlides);
});

onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
    stopCarouselInterval();
    window.removeEventListener('resize', () => {});
});
</script>

<style scoped>
.section-title::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 4px;
    background-color: #ff0030;
}

.carousel-dots .active {
    background-color: #ff0030;
}

.scale-120 {
    transform: scale(1.2);
}
</style>


