<template>
  <div>
    <h2 class="text-xl font-bold mb-6 pb-2 text-[#0a5d28] border-b-2 border-[#ffcc00] titulo-gamer">
        <span>{{ title }}</span>
    </h2>

    <div :class="horizontal ? 'grid grid-cols-1 lg:grid-cols-1 gap-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'">
        <article
            v-for="post in posts"
            :key="post.id"
            :class="horizontal ? 'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300' : 'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300 flex flex-col'"
        >
            <template v-if="horizontal">
                <div class="flex flex-col sm:flex-row h-full">
                    <a :href="`/post/${post.slug}`" class="block w-full sm:w-1/3 overflow-hidden relative">
                        <OptimizedImage
                            :src="post.featureImage"
                            :alt="post.title"
                            width="160"
                            height="120"
                            loading="lazy"
                            :hover="true"
                            icon-size="md"
                            class="w-full h-full object-cover"
                        />
                        <div v-if="post.categories && post.categories.length > 0" class="absolute top-2 left-2 z-10 hidden md:block">
                            <span class="bg-[#5046e5] text-white px-3 py-1 rounded-full text-xs font-medium">
                                {{ post.categories[0].name }}
                            </span>
                        </div>
                    </a>
                    <div class="p-3 sm:p-4 flex-grow flex flex-col justify-center sm:w-2/3">
                        <a :href="`/post/${post.slug}`" class="block">
                            <h3 class="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 hover:text-[#0a5d28] transition-colors line-clamp-2">
                                {{ post.title }}
                            </h3>
                        </a>
                        <p class="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                            {{ post.excerpt }}
                        </p>
                        <div class="flex justify-between items-center text-xs text-gray-500 mb-2">
                            <span v-if="getAuthor(post)">Por {{ getAuthor(post).name }}</span>
                            <span>{{ formatDate(post.publishedAt) }}</span>
                        </div>
                        <div class="text-right">
                            <a :href="`/post/${post.slug}`" class="gamer-button inline-block px-3 py-1 text-xs font-medium rounded-md transition-all hover:shadow-lg text-white" style="color: white !important;">
                                Continuar lendo
                            </a>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
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
                    <div v-if="post.categories && post.categories.length > 0" class="absolute top-2 left-2 z-10 hidden md:block">
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
                        <span v-if="getAuthor(post)">Por {{ getAuthor(post).name }}</span>
                        <span>{{ formatDate(post.publishedAt) }}</span>
                    </div>
                    <div class="mt-auto text-center">
                        <a :href="`/post/${post.slug}`" class="gamer-button inline-block px-3 py-1 text-xs font-medium rounded-md transition-all hover:shadow-lg text-white" style="color: white !important;">
                            Continuar lendo
                        </a>
                    </div>
                </div>
            </template>
        </article>
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
  title: {
    type: String,
    required: true,
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
});

const { posts, horizontal } = toRefs(props);

const getAuthor = (post: any) => {
    if (!post.authors || !post.authors.length) return null;
    return post.authors.find((author: any) => author.id === post.author);
};
</script> 