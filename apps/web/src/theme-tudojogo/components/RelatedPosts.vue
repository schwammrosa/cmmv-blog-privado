<template>
    <div class="mt-10">
        <h2 class="text-xl font-bold mb-6 pb-2 text-white border-b-2 border-[#ffcc00] titulo-gamer bg-[#6600cc]/20 pl-2 py-1 rounded-t-md">
            Mais Conteúdo
        </h2>

        <div ref="relatedPostsObserver" class="min-h-[200px]">
            <div v-if="!posts" class="flex justify-center items-center py-6">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0a5d28]"></div>
                <span class="ml-3 text-gray-300">Carregando posts relacionados...</span>
            </div>

            <div v-else-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <article
                    v-for="relatedPost in posts"
                    :key="relatedPost.id"
                    class="bg-[#0a0a1a] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 border border-[#303443] hover:border-[#6600cc] text-gray-100"
                >
                    <a :href="`/post/${relatedPost.slug}`" class="block group">
                        <div class="overflow-hidden relative" style="height: 180px; width: 100%; aspect-ratio: 16/9;">
                                <OptimizedImage
                                    v-if="relatedPost.featureImage"
                                    :src="relatedPost.featureImage"
                                    :alt="relatedPost.title"
                                    class="w-full h-full object-cover imgix-lazy transition-transform duration-500 group-hover:scale-110"
                                    width="300"
                                    height="180"
                                    loading="lazy"
                                    priority="low"
                                    icon-size="sm"
                                />
                                <div v-else class="w-full h-full bg-[#0a0a1a] border border-[#303443] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div v-if="relatedPost.categories && relatedPost.categories.length > 0" class="absolute top-2 left-2">
                                <span class="bg-[#5046e5] text-white px-3 py-1 rounded-full text-xs font-medium">
                                    {{ relatedPost.categories[0].name }}
                                </span>
                            </div>
                        </div>
                    </a>
                    <div class="p-4">
                        <a :href="`/post/${relatedPost.slug}`" class="block">
                            <h3 class="text-lg font-bold text-white mb-2 hover:text-[#00ccff] transition-colors line-clamp-2 border-l-2 border-[#6600cc] pl-2">
                                {{ relatedPost.title }}
                            </h3>
                        </a>
                        <p class="text-gray-300 text-sm mb-3 line-clamp-2">
                            {{ relatedPost.excerpt }}
                        </p>
                        <div class="flex justify-between items-center text-xs text-gray-400 mb-3">
                            <span v-if="getAuthor(relatedPost)">Por {{ getAuthor(relatedPost).name }}</span>
                            <span>{{ formatDate(relatedPost.publishedAt || relatedPost.updatedAt) }}</span>
                        </div>
                        
                        <div class="text-center mt-auto">
                            <a :href="`/post/${relatedPost.slug}`" class="gamer-button inline-block px-4 py-2 text-sm font-medium rounded-md transition-all hover:shadow-lg text-white" style="color: white !important;">
                                Continuar lendo
                            </a>
                        </div>
                    </div>
                </article>
                <!-- Card de anúncio se faltar para completar a linha -->
                <article
                  v-if="posts.length % 3 !== 0"
                  class="bg-[#0a0a1a] rounded-lg overflow-hidden shadow-md flex flex-col items-center justify-center border border-[#303443] text-gray-100 min-h-[320px]"
                >
                  <div class="w-full h-full flex flex-col items-center justify-center p-4">
                    <div v-html="getAdHtml && getAdHtml('relatedPosts')"></div>
                    <div v-if="!getAdHtml || !getAdHtml('relatedPosts')" class="ad-placeholder h-[90px] w-full max-w-[300px] bg-[#0a0a1a] flex items-center justify-center text-gray-400 text-sm border border-[#303443] mt-4">
                      <span>Anúncio</span>
                    </div>
                  </div>
                </article>
            </div>

            <div v-else class="text-center py-4 text-gray-600">
                Nenhum post relacionado encontrado.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, inject } from 'vue';
import OptimizedImage from '../../components/OptimizedImage.vue';
import { formatDate } from '../../composables/useUtils.js';
import { useAdManager } from '../composables/useAdManager';

const props = defineProps({
  posts: {
    type: Array as () => any[] | null,
    required: true,
  },
});

const { posts } = toRefs(props);
const { getAdHtml } = useAdManager();

const getAuthor = (post: any) => {
    if (!post.authors || !post.authors.length) return null;
    return post.authors.find((author: any) => author.user === post.author);
};
</script> 