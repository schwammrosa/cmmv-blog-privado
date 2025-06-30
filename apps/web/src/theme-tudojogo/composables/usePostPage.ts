import { ref, computed, onServerPrefetch, onMounted, watchEffect, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { vue3 } from '@cmmv/blog/client';
import { useSettingsStore } from '../../store/settings.js';
import { usePostsStore } from '../../store/posts.js';
import { useCategoriesStore } from '../../store/categories.js';
import { useMostAccessedPostsStore } from '../../store/mostaccessed.js';
import { useAdManager } from './useAdManager.js';
import { formatDate, stripHtml } from '../../composables/useUtils.js';

export function usePostPage() {
    const settingsStore = useSettingsStore();
    const postsStore = usePostsStore();
    const categoriesStore = useCategoriesStore();
    const mostAccessedPostsStore = useMostAccessedPostsStore();
    const blogAPI = vue3.useBlog();
    const route = useRoute();

    const { adSettings, getAdHtml, loadAdScripts, settings } = useAdManager();
    const post = ref<any>(null);
    const categories = ref<any[]>(categoriesStore.getCategories || []);
    const popularPosts = ref<any[]>(mostAccessedPostsStore.getMostAccessedPosts || []);
    const isSSR = import.meta.env.SSR;

    if(!isSSR) {
        if (window.__CMMV_DATA__ && window.__CMMV_DATA__["post"]) {
            post.value = window.__CMMV_DATA__["post"];
        }
    }

    const author = computed(() => post.value?.authors?.find((a: any) => a.user === post.value?.author));
    const relatedPosts = ref<any[]>([]);
    const isDesktop = ref(false);

    const authorInitials = computed(() => {
        return author.value?.name
            ? author.value.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()
            : '?';
    });

    const shuffleArray = (array: any[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const whatsappShareUrl = computed(() => {
        if (!post.value) return '';
        const text = encodeURIComponent(post.value.title + ' ' + pageUrl.value);
        return isDesktop.value
            ? `https://web.whatsapp.com/send?text=${text}`
            : `https://api.whatsapp.com/send?text=${text}`;
    });

    const getAuthor = (post: any) => {
        if (!post.authors || !post.authors.length) return null;
        return post.authors.find((author: any) => author.user === post.author);
    };

    onServerPrefetch(async () => {
        post.value = route.params.id
                ? await blogAPI.posts.getById(route.params.id as string)
                : await blogAPI.posts.getBySlug(route.params.slug as string);
    });

    watchEffect(() => {
        if (post.value && post.value.id) {
            const storePosts = postsStore.getPosts || [];

            if (storePosts.length > 0) {
                const filteredPosts = storePosts.filter(p => p.id !== post.value.id);

                if (filteredPosts.length > 0)
                    relatedPosts.value = shuffleArray(filteredPosts).slice(0, 3);
            }
        }
    });

    const pageUrl = computed(() => {
        return `${import.meta.env.VITE_WEBSITE_URL}/post/${post.value?.slug || ''}`;
    });

    const keywords = computed(() => post.value?.keywords ||
        (post.value?.tags?.map((tag: any) => tag.name).join(', ') || ''));

    const description = computed(() =>
        stripHtml(post.value?.description || post.value?.excerpt || post.value?.content || '')
            .substring(0, 150) + '...'
    );

    const metadata = computed(() => keywords.value
        .split(', ')
        .map((k: string) => ({ property: 'article:tag', content: k })));

    const headData = computed(() => ({
        title: post.value?.title,
        meta: [
            { name: 'description', content: description.value },
            { name: 'keywords', content: keywords.value },
            { property: 'og:type', content: 'article' },
            { property: 'og:title', content: post.value?.title },
            { property: 'og:description', content: description.value },
            { property: 'og:image', content: post.value?.featureImage || settings.value?.['blog.image'] },
            { property: 'og:url', content: pageUrl.value },
            { property: 'og:image:type', content: 'image/webp' },
            { property: 'og:image:alt', content: post.value?.title || 'Imagem' },
            { property: 'og:image:secure_url', content: post.value?.featureImage || settings.value?.['blog.image'] },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '675' },
            { property: 'og:updated_time', content: post.value?.updatedAt ? new Date(post.value.updatedAt).toISOString() : new Date().toISOString() },
            { property: 'article:published_time', content: post.value?.status === 'published' && post.value?.publishedAt ? new Date(post.value.publishedAt).toISOString() : post.value?.createdAt ? new Date(post.value.createdAt).toISOString() : new Date().toISOString() },
            { property: 'article:modified_time', content: post.value?.updatedAt ? new Date(post.value.updatedAt).toISOString() : new Date().toISOString() },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: post.value?.title },
            { name: 'twitter:description', content: description.value },
            { name: 'twitter:image', content: post.value?.featureImage || settings.value?.['blog.image'] },
            { name: 'twitter:url', content: pageUrl.value },
            ...metadata.value
        ],
        link: [
            { rel: 'canonical', href: pageUrl.value },
        ],
        script: isSSR ? [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(vue3.createLdJSON('post', post.value, settings.value))
            }
        ] : []
    }));

    useHead(headData);
    
    onMounted(() => {
        isDesktop.value = window.innerWidth >= 1024;
        loadAdScripts();
    });

    return {
        post,
        author,
        authorInitials,
        relatedPosts,
        popularPosts,
        adSettings,
        getAdHtml,
        getAuthor,
        whatsappShareUrl,
        formatDate,
        stripHtml
    };
} 