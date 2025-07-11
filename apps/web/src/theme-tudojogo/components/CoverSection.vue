<template>
    <section v-if="posts.length > 0" class="mb-8 md:block hidden">
        <!-- Full Layout (default) -->
        <div v-if="coverSettings.layoutType === 'full' || !coverSettings.layoutType" class="bg-white rounded-lg overflow-hidden shadow-md">
            <a v-if="coverPosts.full" :href="`/post/${coverPosts.full.slug}`" class="block rounded-lg overflow-hidden shadow-md bg-white" style="height:180px;max-height:180px;">
                <div class="relative w-full h-full" style="height:180px;">
                    <OptimizedImage
                        :src="coverPosts.full?.featureImage"
                        :alt="coverPosts.full?.title"
                        class="absolute inset-0 w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                        <div v-if="coverPosts.full && coverPosts.full.categories && coverPosts.full.categories.length > 0" class="mb-1 hidden md:block">
                            <span class="bg-[#5046e5] text-white px-2 py-0.5 rounded-full text-xs font-medium category-tag gamer-tag truncate">
                                {{ coverPosts.full.categories[0].name }}
                            </span>
                        </div>
                        <h2 v-if="coverPosts.full" class="text-base font-bold mb-1 truncate">
                            <span class="gamer-highlight">{{ coverPosts.full.title }}</span>
                        </h2>
                        <p v-if="coverPosts.full" class="feature-excerpt mb-1 text-xs truncate">
                            {{ coverPosts.full.excerpt }}
                        </p>
                        <span class="gamer-button inline-block px-2 py-1 text-xs font-medium rounded-md">Continuar lendo</span>
                    </div>
                </div>
            </a>
        </div>

        <!-- Carousel Layout -->
        <div v-else-if="coverSettings.layoutType === 'carousel'" class="bg-white rounded-lg overflow-hidden shadow-md">
            <div class="relative w-full h-full" style="height:180px;max-height:180px;">
                <div v-for="(post, index) in coverPosts.carousel" :key="post.id"
                        class="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
                        :class="{ 'opacity-100': currentCarouselIndex === index, 'opacity-0': currentCarouselIndex !== index }">
                    <a :href="`/post/${post.slug}`" class="block w-full h-full">
                        <OptimizedImage
                            :src="post.featureImage"
                            :alt="post.title"
                            class="absolute inset-0 w-full h-full object-cover"
                        />
                        <div class="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                            <div v-if="post.categories && post.categories.length > 0" class="mb-1 hidden md:block">
                                <span class="bg-[#5046e5] text-white px-2 py-0.5 rounded-full text-xs font-medium truncate">
                                    {{ post.categories[0].name }}
                                </span>
                            </div>
                            <h2 class="text-base font-bold mb-1 truncate">{{ post.title }}</h2>
                            <p class="text-xs mb-1 truncate">{{ post.excerpt }}</p>
                            <span class="gamer-button inline-block px-2 py-1 text-xs font-medium rounded-md">Continuar lendo</span>
                        </div>
                    </a>
                </div>

                <!-- Carousel Controls -->
                <div class="absolute top-0 bottom-0 left-0 flex items-center">
                    <button @click="prevCarouselSlide" class="bg-black/30 hover:bg-black/50 text-white p-2 rounded-r-md focus:outline-none z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                <div class="absolute top-0 bottom-0 right-0 flex items-center">
                    <button @click="nextCarouselSlide" class="bg-black/30 hover:bg-black/50 text-white p-2 rounded-l-md focus:outline-none z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <!-- Carousel Indicators -->
                <div class="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10">
                    <button
                        v-for="(_, index) in coverPosts.carousel"
                        :key="index"
                        @click="currentCarouselIndex = index"
                        class="w-3 h-3 rounded-full bg-white/50 focus:outline-none"
                        :class="{ 'bg-white': currentCarouselIndex === index }"
                    ></button>
                </div>
            </div>
        </div>

        <!-- Split Layout (1 large, 2 small) -->
        <div v-else-if="coverSettings.layoutType === 'split'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2 bg-white rounded-lg overflow-hidden shadow-md h-full">
                <a v-if="coverPosts.splitMain" :href="`/post/${coverPosts.splitMain.slug}`" class="block w-full h-full overflow-hidden">
                    <div class="relative w-full h-full flex items-center justify-center" style="height: 376px;">
                        <div class="absolute inset-0 w-full h-full">
                            <OptimizedImage
                                :src="coverPosts.splitMain?.featureImage"
                                :alt="coverPosts.splitMain?.title"
                                class="w-full h-full object-cover object-center"
                                style="min-width: 100%; min-height: 100%;"
                            />
                        </div>
                        <div class="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white z-10">
                            <div v-if="coverPosts.splitMain && coverPosts.splitMain.categories && coverPosts.splitMain.categories.length > 0" class="mb-1 hidden md:block">
                                <span class="bg-[#5046e5] text-white px-2 py-0.5 rounded-full text-xs font-medium truncate">
                                    {{ coverPosts.splitMain.categories[0].name }}
                                </span>
                            </div>
                            <h2 v-if="coverPosts.splitMain" class="text-lg font-bold mb-1 line-clamp-2">{{ coverPosts.splitMain.title }}</h2>
                            <p v-if="coverPosts.splitMain" class="text-sm mb-1 line-clamp-2">{{ coverPosts.splitMain.excerpt }}</p>
                            <span class="gamer-button inline-block px-4 py-2 text-sm font-medium rounded-md">Continuar lendo</span>
                        </div>
                    </div>
                </a>
            </div>
            <div class="md:col-span-1 flex flex-col gap-4">
                <div v-for="(post) in coverPosts.splitSide" :key="post.id" class="bg-white rounded-lg overflow-hidden shadow-md" style="height: 180px;">
                    <a :href="`/post/${post.slug}`" class="block w-full h-full">
                        <div class="relative w-full h-full">
                            <OptimizedImage
                                :src="post.featureImage"
                                :alt="post.title"
                                class="absolute inset-0 w-full h-full object-cover"
                            />
                            <div class="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                                <div v-if="post.categories && post.categories.length > 0" class="mb-1 hidden md:block">
                                    <span class="bg-[#5046e5] text-white px-2 py-0.5 rounded-full text-xs font-medium truncate">
                                        {{ post.categories[0].name }}
                                    </span>
                                </div>
                                <h3 class="text-sm font-bold mb-1 line-clamp-2">{{ post.title }}</h3>
                                <span class="gamer-button inline-block px-2 py-1 text-xs font-medium rounded-md">Continuar lendo &rarr;</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Dual Layout (2 equal columns) -->
        <div v-else-if="coverSettings.layoutType === 'dual'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(post, index) in coverPosts.dual" :key="post.id" class="bg-white rounded-lg overflow-hidden shadow-md">
                <a :href="`/post/${post.slug}`" class="block rounded-lg overflow-hidden shadow-md bg-white" style="height:180px;max-height:180px;">
                    <div class="relative w-full h-full" style="height:180px;">
                        <OptimizedImage
                            :src="post.featureImage"
                            :alt="post.title"
                            class="absolute inset-0 w-full h-full object-cover"
                        />
                        <div class="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                            <div v-if="post.categories && post.categories.length > 0" class="mb-1 hidden md:block">
                                <span class="bg-[#5046e5] text-white px-2 py-0.5 rounded-full text-xs font-medium truncate">
                                    {{ post.categories[0].name }}
                                </span>
                            </div>
                            <h2 class="text-base font-bold mb-1 truncate">{{ post.title }}</h2>
                            <p class="text-xs mb-1 truncate">{{ post.excerpt }}</p>
                            <span class="gamer-button inline-block px-2 py-1 text-xs font-medium rounded-md">Continuar lendo</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, toRefs } from 'vue';
import OptimizedImage from '../../components/OptimizedImage.vue';

const props = defineProps({
  posts: {
    type: Array as () => any[],
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
});

const { posts, settings } = toRefs(props);

const coverSettings = computed(() => {
    try {
        const config = settings.value.cover;
        return config ? JSON.parse(config) : { layoutType: 'full' };
    } catch (err) {
        console.error('Error parsing cover settings:', err);
        return { layoutType: 'full' };
    }
});

const hasCoverConfig = computed(() => {
    return !!settings.value.cover && Object.keys(coverSettings.value).length > 0;
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
            if (config.layoutType === 'full' && config.fullCover?.postId) {
                const configPost = posts.value.find(p => p.id === config.fullCover.postId);
                if (configPost) result.full = configPost;
            }

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

            if (config.layoutType === 'split') {
                if (config.split?.main?.postId) {
                    const mainPost = posts.value.find(p => p.id === config.split.main.postId);
                    if (mainPost) result.splitMain = mainPost;
                }

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

// Carousel logic
const currentCarouselIndex = ref(0);
const carouselInterval = ref<number | null>(null);

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

onMounted(() => {
    startCarouselInterval();
});

onUnmounted(() => {
    stopCarouselInterval();
});

</script>

<style scoped>
.featured-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style> 