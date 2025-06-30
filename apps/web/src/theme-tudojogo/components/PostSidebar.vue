<template>
    <div class="lg:col-span-1 min-w-[300px]">
        <!-- AdSense Rectangle (Top) -->
        <article v-if="adSettings.enableAds && adSettings.articlePageSidebarTop"
            class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300 flex flex-col items-center justify-center min-h-[120px] post-card mb-6">
            <div class="ad-container ad-sidebar-top py-2 px-4 w-full flex items-center justify-center h-full" v-if="getAdHtml('sidebarTop')">
                <div v-html="getAdHtml('sidebarTop')" class="w-full flex items-center justify-center h-full"></div>
            </div>
            <div class="ad-container ad-sidebar-top py-2 px-4 w-full flex items-center justify-center h-full" v-else>
                <div class="ad-placeholder w-full h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-yellow-400 min-h-[90px]">
                    <span>Anúncio</span>
                </div>
            </div>
        </article>

        <!-- Share Widget -->
        <div class="bg-[#0a0a1a] rounded-lg shadow-md p-5 mb-6 border border-[#303443] border-l-4 border-l-[#6600cc] text-gray-100 sticky top-24 z-30">
            <h2
                class="text-xl font-bold mb-4 pb-2 text-white border-b-2 border-[#ffcc00] titulo-gamer bg-[#6600cc]/20 pl-2 py-1 rounded-t-md">
                Compartilhar
            </h2>
            <div class="flex flex-wrap gap-2">
                <a class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110"
                    rel="nofollow noopener"
                    :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl)"
                    onclick="window.open(this.href, 'facebook-share','width=580,height=296');return false;"
                    title="Compartilhar no Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                    </svg>
                </a>

                <a class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110"
                    rel="nofollow noopener"
                    :href="'https://twitter.com/share?text=' + encodeURIComponent(post.title) + '&url=' + encodeURIComponent(pageUrl)"
                    onclick="window.open(this.href, 'twitter-share', 'width=550,height=235');return false;"
                    title="Compartilhar no Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                </a>

                <a class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110"
                    rel="nofollow noopener"
                    :href="'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(pageUrl) + '&title=' + encodeURIComponent(post.title)"
                    onclick="window.open(this.href, 'linkedin-share', 'width=490,height=530');return false;"
                    title="Compartilhar no LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </a>

                <a class="bg-green-500 hover:bg-green-600 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                    rel="nofollow noopener"
                    :href="whatsappShareUrl"
                    target="_blank"
                    data-action="share/whatsapp/share"
                    title="Compartilhar no WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </a>

                <button @click="copyPageUrl"
                    class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110"
                    title="Copiar link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span v-if="linkCopied"
                        class="absolute -right-16 whitespace-nowrap bg-green-600 text-white text-xs py-1 px-2 rounded">
                        Copiado!
                    </span>
                </button>
            </div>
        </div>

        <!-- Popular Posts Widget -->
        <div v-if="popularPosts && popularPosts.length > 0"
            class="bg-[#0a0a1a] rounded-lg shadow-md p-5 mb-6 hidden md:block border border-[#303443] gamer-popular-posts">
            <h2
                class="text-xl font-bold mb-4 pb-2 text-white border-b-2 border-[#ffcc00] titulo-gamer bg-[#6600cc]/20 pl-2 py-1 rounded-t-md">
                Mais Populares
            </h2>
            <div class="space-y-4">
                <div v-for="popularPost in popularPosts" :key="popularPost.id"
                    class="flex gap-3 pb-3 border-b border-[#303443] last:border-0 last:pb-0">
                    <div class="w-20 h-16 flex-shrink-0 overflow-hidden rounded-md">
                        <a :href="`/post/${popularPost.slug}`">
                            <OptimizedImage v-if="popularPost.image || popularPost.featureImage"
                                :src="popularPost.image || popularPost.featureImage" :alt="popularPost.title"
                                class="w-full h-full object-cover imgix-lazy" width="80" height="64" icon-size="sm" />
                            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </a>
                    </div>
                    <div class="flex-grow">
                        <a :href="`/post/${popularPost.slug}`" class="block">
                            <h3
                                class="text-sm font-semibold text-white hover:text-[#00ccff] transition-colors line-clamp-2">
                                {{ popularPost.title }}
                            </h3>
                        </a>
                        <span class="text-xs text-gray-300 mt-1 block">
                            {{ formatDate(popularPost.publishedAt || popularPost.updatedAt) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- AdSense Rectangle (Bottom) -->
        <article v-if="adSettings.enableAds && adSettings.articlePageSidebarBottom"
            class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300 flex flex-col items-center justify-center min-h-[120px] post-card mb-6">
            <div class="ad-container ad-sidebar-bottom py-2 px-4 w-full flex items-center justify-center h-full" v-if="getAdHtml('sidebarBottom')">
                <div v-html="getAdHtml('sidebarBottom')" class="w-full flex items-center justify-center h-full"></div>
            </div>
            <div class="ad-container ad-sidebar-bottom py-2 px-4 w-full flex items-center justify-center h-full" v-else>
                <div class="ad-placeholder w-full h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-yellow-400 min-h-[90px]">
                    <span>Anúncio</span>
                </div>
            </div>
        </article>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useAdManager } from '../composables/useAdManager';
import { usePostsStore } from '../../store/posts';
import { useSettingsStore } from '../../store/settings';
import { useFetch } from '../composables/useFetch';
import OptimizedImage from '../../components/OptimizedImage.vue';
import { formatDate } from '../../composables/useUtils';

const props = defineProps<{
    post: any;
    popularPosts: any[];
}>();

const { adSettings, getAdHtml, settings } = useAdManager();

const postsStore = usePostsStore();
const settingsStore = useSettingsStore();

const pageUrl = computed(() => {
    const baseUrl = settings.value?.['blog.url'] || 'http://localhost:3000';
    return `${baseUrl}/post/${props.post?.slug || ''}`
});

const isDesktop = ref(typeof window !== 'undefined' && window.innerWidth > 768);

const whatsappShareUrl = computed(() => {
    if (!props.post) return '';
    const text = encodeURIComponent(props.post.title + ' ' + pageUrl.value)
    return isDesktop.value
        ? `https://web.whatsapp.com/send?text=${text}`
        : `https://api.whatsapp.com/send?text=${text}`
});

const linkCopied = ref(false);
const copyPageUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(pageUrl.value).then(() => {
            linkCopied.value = true
            setTimeout(() => (linkCopied.value = false), 2000)
        })
    }
}

const popularPosts = computed(() => postsStore.getPosts || []);

onMounted(async () => {
  if (!popularPosts.value || popularPosts.value.length === 0) {
    const { data: postsData } = await useFetch<any[]>('/api/blog/posts/list?sort=views&limit=5', 'popular-posts');
    if (postsData.value) {
      postsStore.setPosts(postsData.value);
    }
  }
});
</script> 