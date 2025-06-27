<template>
    <div class="bg-white rounded-lg shadow-md p-5 mb-6 gamer-popular-posts">
        <h2 class="text-xl font-bold mb-4 pb-2 text-[#0a5d28] border-b-2 border-[#ffcc00] titulo-gamer">
            <span>Mais Populares</span>
        </h2>

        <div class="space-y-4">
            <div
                v-for="post in posts"
                :key="post.id"
                class="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0 post-popular-item hover:transform hover:-translate-y-1 transition-all duration-300"
            >
                <div class="w-20 h-16 flex-shrink-0 overflow-hidden rounded-md">
                    <a :href="`/post/${post.slug}`">
                        <OptimizedImage
                            v-if="post.image"
                            :src="post.image"
                            :alt="post.title"
                            width="80"
                            height="64"
                            loading="lazy"
                            icon-size="sm"
                            class="w-full h-full object-cover"
                        />
                    </a>
                </div>
                <div class="flex-grow">
                    <a :href="`/post/${post.slug}`" class="block">
                        <h3 class="text-sm font-semibold text-white hover:text-[#00ccff] transition-colors line-clamp-2">
                            {{ post.title }}
                        </h3>
                    </a>
                    <span class="text-xs text-gray-500 mt-1 block flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(post.publishedAt) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import OptimizedImage from '../../components/OptimizedImage.vue';
import { formatDate } from '../../composables/useUtils.js';

const props = defineProps({
  posts: {
    type: Array as () => any[],
    required: true,
  },
});

const { posts } = toRefs(props);
</script>

<style scoped>
.optimized-image-debug {
  border: 2px dashed red;
  background: #eee;
}
</style> 