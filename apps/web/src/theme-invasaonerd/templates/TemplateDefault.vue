<template>
    <div class="flex flex-col min-h-screen bg-gray-100">
        <!-- Header -->
        <header class="bg-[#1a1a1a] sticky top-0 z-50 shadow-md">
            <div class="container mx-auto px-4">
                <div class="flex justify-between items-center py-3">
                    <!-- Logo -->
                    <div class="flex-shrink-0">
                        <a href="/" class="block">
                            <img src="/src/theme-invasaonerd/logo-invert.png" alt="Invasão Nerd" class="h-10" width="77" height="40" />
                        </a>
                    </div>

                    <!-- Social and Search -->
                    <div class="flex items-center space-x-4">
                        <!-- Social Icons -->
                        <a v-if="settings['blog.facebook']" :href="`https://facebook.com/${settings['blog.facebook']}`" target="_blank" rel="noopener noreferrer" title="Facebook" class="text-white hover:text-[#ff3e3e] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a v-if="settings['blog.instagram']" :href="`https://instagram.com/${settings['blog.instagram']}`" target="_blank" rel="noopener noreferrer" title="Instagram" class="text-white hover:text-[#ff3e3e] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                            </svg>
                        </a>
                        <a v-if="settings['blog.twitter']" :href="`https://twitter.com/${settings['blog.twitter']}`" target="_blank" rel="noopener noreferrer" title="Twitter" class="text-white hover:text-[#ff3e3e] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                        <a v-if="settings['blog.youtube']" :href="`https://youtube.com/${settings['blog.youtube']}`" target="_blank" rel="noopener noreferrer" title="YouTube" class="text-white hover:text-[#ff3e3e] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                        </a>
                        <a v-if="settings['blog.github']" :href="`https://github.com/${settings['blog.github']}`" target="_blank" rel="noopener noreferrer" title="GitHub" class="text-white hover:text-[#ff3e3e] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </a>

                        <!-- Search Button -->
                        <button @click="openSearchModal"
                            class="text-white hover:text-[#ff3e3e] transition-colors bg-transparent border-0 p-0"
                            title="Pesquisar"
                            aria-label="Pesquisar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        <!-- Mobile Menu Toggle -->
                        <button @click="mobileMenuOpen = !mobileMenuOpen"
                            class="md:hidden text-white hover:text-[#ff3e3e] transition-colors bg-transparent border-0 p-0"
                            title="Abrir menu"
                            aria-label="Abrir menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <nav class="bg-[#b4011a]">
                <div class="container mx-auto px-4">
                    <ul class="flex flex-wrap list-none">
                        <li>
                            <a href="/" class="block text-white hover:bg-[#d12222] px-5 py-4 font-semibold uppercase text-sm transition-colors">Home</a>
                        </li>
                        <li v-for="category in categories.slice(0, 7)" :key="category.id">
                            <a :href="`/category/${category.slug}`" class="block text-white hover:bg-[#d12222] px-5 py-4 font-semibold uppercase text-sm transition-colors">{{ category.name }}</a>
                        </li>
                    </ul>

                    <!-- Mobile Menu -->
                    <div v-show="mobileMenuOpen" class="md:hidden py-3 border-t border-[#d12222]">
                        <div class="grid grid-cols-2 gap-1">
                            <a v-for="category in categories.slice(7, 15)" :key="category.id"
                                :href="`/category/${category.slug}`"
                                class="block text-white hover:bg-[#d12222] rounded px-3 py-2 text-sm"
                                title="Clique para ver todos os posts da categoria"
                                aria-label="Clique para ver todos os posts da categoria">
                                {{ category.name }}
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <!-- Main content -->
        <main class="flex-grow container mx-auto px-4 py-6">
            <router-view />
        </main>

        <!-- Newsletter -->
        <div class="container mx-auto px-4 mb-8">
            <div class="bg-[#1a1a1a] rounded-lg p-8 text-center">
                <div class="max-w-2xl mx-auto">
                    <h3 class="text-2xl font-bold text-white mb-4">Fique por dentro de todas as novidades!</h3>
                    <p class="text-gray-300 mb-6">Assine nossa newsletter e receba atualizações diárias sobre o mundo nerd diretamente no seu e-mail.</p>
                    <form class="flex flex-col sm:flex-row gap-2" @submit.prevent="subscribeNewsletter">
                        <input
                            type="email"
                            v-model="newsletterEmail"
                            placeholder="Digite seu e-mail"
                            required
                            class="flex-grow px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-[#ff3e3e]">
                        <button type="submit" class="bg-[#ff3e3e] hover:bg-[#d12222] text-white font-semibold px-6 py-3 rounded-md transition-colors">
                            Assinar
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-[#1a1a1a] text-white mt-auto">
            <div class="container mx-auto px-4 py-12">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-lg font-bold mb-4 pb-3 border-b-2 border-[#ff3e3e] inline-block">Sobre nós</h3>
                        <p class="text-gray-300 text-sm mb-4">
                            O Invasão Nerd é um portal dedicado a trazer as melhores e mais recentes notícias do universo geek, incluindo filmes, séries, games, animes, HQs e tecnologia.
                        </p>
                        <p class="text-gray-300 text-sm mb-4">
                            Nossa missão é manter você atualizado sobre tudo que acontece no mundo nerd!
                        </p>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold mb-4 pb-3 border-b-2 border-[#ff3e3e] inline-block">Links Rápidos</h3>
                        <ul class="space-y-2">
                            <li><a href="/" class="text-gray-300 hover:text-[#ff3e3e] transition-colors">Home</a></li>
                            <li><a href="/sobre" class="text-gray-300 hover:text-[#ff3e3e] transition-colors">Sobre</a></li>
                            <li><a href="/contato" class="text-gray-300 hover:text-[#ff3e3e] transition-colors">Contato</a></li>
                            <li><a href="/terms-of-service" class="text-gray-300 hover:text-[#ff3e3e] transition-colors">Política de Privacidade</a></li>
                            <li><a href="/terms-of-privacy" class="text-gray-300 hover:text-[#ff3e3e] transition-colors">Termos de Uso</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold mb-4 pb-3 border-b-2 border-[#ff3e3e] inline-block">Categorias</h3>
                        <div class="grid grid-cols-2 gap-x-4">
                            <ul class="space-y-2">
                                <li v-for="category in footerCategories.slice(0, Math.ceil(footerCategories.length / 2))" :key="category.id">
                                    <a :href="`/category/${category.slug}`" class="text-gray-300 hover:text-[#ff3e3e] transition-colors">
                                        {{ category.name }}
                                    </a>
                                </li>
                            </ul>
                            <ul class="space-y-2">
                                <li v-for="category in footerCategories.slice(Math.ceil(footerCategories.length / 2))" :key="category.id">
                                    <a :href="`/category/${category.slug}`" class="text-gray-300 hover:text-[#ff3e3e] transition-colors">
                                        {{ category.name }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-700 mt-8 pt-6 text-center">
                    <p class="text-gray-400 text-sm">
                        &copy; {{ new Date().getFullYear() }} Invasão Nerd - Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>

        <!-- Search Modal -->
        <div v-if="searchModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="search-modal" role="dialog" aria-modal="true">
            <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <!-- Background overlay -->
                <div class="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="closeSearchModal"></div>

                <!-- Modal panel -->
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10">
                    <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="w-full">
                                <!-- Search header with close button -->
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Pesquisar
                                    </h3>
                                    <button @click="closeSearchModal" class="text-gray-400 hover:text-gray-500 focus:outline-none bg-transparent border-0 p-0" title="Close" aria-label="Close">
                                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <!-- Search input -->
                                <div class="mb-4 relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="search"
                                        v-model="searchQuery"
                                        @input="debouncedSearch"
                                        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-[#ff3e3e] focus:border-[#ff3e3e]"
                                        placeholder="Pesquisar posts..."
                                        autocomplete="off"
                                        ref="searchInput"
                                    />
                                </div>

                                <!-- Search results -->
                                <div class="mt-4 max-h-[70vh] overflow-y-auto">
                                    <div v-if="isSearching" class="flex justify-center items-center py-8">
                                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff3e3e]"></div>
                                    </div>

                                    <div v-else-if="searchResults.length === 0 && searchQuery.length > 1" class="py-8 text-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>Nenhum resultado encontrado para "{{ searchQuery }}"</p>
                                    </div>

                                    <!-- Search results with query -->
                                    <div v-else-if="searchQuery.length > 1" class="space-y-4">
                                        <p v-if="searchResults.length > 0" class="text-sm text-gray-500 mb-2">
                                            {{ searchResults.length }} resultado{{ searchResults.length !== 1 ? 's' : '' }} encontrado{{ searchResults.length !== 1 ? 's' : '' }}
                                        </p>
                                        <a
                                            v-for="post in searchResults"
                                            :key="post.id"
                                            :href="`/post/${post.slug}`"
                                            class="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div class="flex flex-col sm:flex-row">
                                                <div v-if="post.featureImage" class="w-full sm:w-32 h-40 sm:h-24 flex-shrink-0">
                                                    <img :src="post.featureImage" :alt="post.title" class="w-full h-full object-cover" loading="lazy" />
                                                </div>
                                                <div class="p-4 flex-grow">
                                                    <h4 class="font-bold text-gray-900 mb-1">{{ post.title }}</h4>
                                                    <p v-if="post.excerpt" class="text-sm text-gray-600 line-clamp-2">
                                                        {{ post.excerpt }}
                                                    </p>
                                                    <div class="mt-2 text-xs text-gray-500 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {{ formatDate(post.publishedAt || post.updatedAt) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <CookieConsent />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { vue3 } from '@cmmv/blog/client';
import { useHead } from '@unhead/vue'
import { useSettingsStore } from '../../store/settings';
import { useCategoriesStore } from '../../store/categories';

import CookieConsent from '../../components/CookieConsent.vue';

const blogAPI = vue3.useBlog();
const categoriesStore = useCategoriesStore();
const settingsStore = useSettingsStore();

const settings = ref<any>(settingsStore.getSettings);

useHead({
    link: [
        {
            rel: 'preload',
            as: 'style',
            href: '/src/theme-invasaonerd/style.css',
            onload: 'this.onload=null;this.rel=`stylesheet`'
        },
        {
            rel: 'icon',
            type: 'image/ico',
            href: '/src/theme-invasaonerd/favicon.ico'
        }
    ],
    script: []
})

const isDarkMode = ref(false);
const searchModalOpen = ref(false);
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const searchTimeout = ref<any>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const mobileMenuOpen = ref(false);
const newsletterEmail = ref('');

const categories = ref<any[]>(categoriesStore.getCategories || []);

const footerCategories = computed(() => {
    return categories.value.slice(0, 12);
});

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
    applyTheme();
};

const applyTheme = () => {
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const openSearchModal = () => {
    searchModalOpen.value = true;
    setTimeout(() => {
        searchInput.value?.focus();
    }, 100);
};

const closeSearchModal = () => {
    searchModalOpen.value = false;
    searchQuery.value = '';
    searchResults.value = [];
};

const debouncedSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }

    searchTimeout.value = setTimeout(() => {
        performSearch();
    }, 300);
};

const performSearch = async () => {
    if (searchQuery.value.trim().length < 2) {
        searchResults.value = [];
        return;
    }

    isSearching.value = true;

    try {
        const response = await blogAPI.posts.search(searchQuery.value);

        if (Array.isArray(response)) {
            searchResults.value = response;
        } else if (response && typeof response === 'object') {
            const typedResponse = response as { posts?: any[] };
            searchResults.value = Array.isArray(typedResponse.posts) ? typedResponse.posts : [];
        } else {
            searchResults.value = [];
        }
    } catch (error) {
        console.error('Search error:', error);
        searchResults.value = [];
    } finally {
        isSearching.value = false;
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

const subscribeNewsletter = async () => {
    if (!newsletterEmail.value) return;

    try {
        // Here you would implement the actual newsletter subscription
        // For example: await blogAPI.newsletter.subscribe(newsletterEmail.value);
        console.log('Newsletter subscription for:', newsletterEmail.value);
        alert('Obrigado por se inscrever na nossa newsletter!');
        newsletterEmail.value = '';
    } catch (error) {
        console.error('Failed to subscribe to newsletter:', error);
        alert('Houve um erro ao inscrever-se. Por favor, tente novamente mais tarde.');
    }
};

onMounted(async () => {
    // Load categories if needed
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

    // Set light theme by default
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
});

watch(isDarkMode, () => {
    applyTheme();
});
</script>

<style>
.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>
