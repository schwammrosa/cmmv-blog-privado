<template>
    <div class="flex flex-col min-h-screen">
        <!-- Header -->
        <header class="bg-[#121212] text-white sticky top-0 z-50 shadow-md">
            <div class="container mx-auto px-4">
                <div class="flex justify-between items-center py-4">
                    <div class="logo">
                        <a href="/">
                            <img src="/Nome.png" alt="TudoJogos" class="h-10">
                        </a>
                    </div>
                    <nav class="hidden md:block">
                        <ul class="flex space-x-6">
                            <li><a href="#" class="hover:text-[#14f195]">Console</a></li>
                            <li><a href="#" class="hover:text-[#14f195]">Mobile</a></li>
                            <li><a href="#" class="hover:text-[#14f195]">PC</a></li>
                        </ul>
                    </nav>
                    <div class="flex items-center space-x-4">
                        <!-- Redes sociais (visíveis apenas em desktop) -->
                        <div class="hidden md:flex space-x-2">
                            <a href="#" class="w-8 h-8 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#14f195] hover:text-[#121212] transition-all transform hover:-translate-y-1">
                                <i class="fab fa-facebook"></i>
                            </a>
                            <a href="#" class="w-8 h-8 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#14f195] hover:text-[#121212] transition-all transform hover:-translate-y-1">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" class="w-8 h-8 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#14f195] hover:text-[#121212] transition-all transform hover:-translate-y-1">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="w-8 h-8 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#14f195] hover:text-[#121212] transition-all transform hover:-translate-y-1">
                                <i class="fab fa-youtube"></i>
                            </a>
                        </div>
                        <!-- Ícone de pesquisa -->
                        <button @click="openSearchModal" class="text-white hover:text-[#14f195]">
                            <i class="fas fa-search"></i>
                        </button>
                        <!-- Botão de tema -->
                        <button @click="toggleTheme" class="text-[#14f195]">
                            <i class="fas fa-moon"></i>
                        </button>
                        <!-- Ícone do menu mobile -->
                        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-white">
                            <i :class="[mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars']"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Modal de Pesquisa -->
        <div v-if="searchModalOpen" class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-xl p-6 relative">
                <button @click="closeSearchModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
                    <i class="fas fa-times text-xl"></i>
                </button>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Pesquisar</h2>
                <div class="flex w-full">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        @input="debouncedSearch" 
                        ref="searchInput"
                        placeholder="Digite sua busca..." 
                        class="flex-grow p-3 border border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                    <button 
                        @click="performSearch" 
                        class="bg-[#7b2cbf] text-white px-5 rounded-r-md hover:bg-[#6a1b9a] transition-colors"
                    >
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div v-if="isSearching" class="mt-6 flex justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7b2cbf]"></div>
                </div>
                <div v-else-if="searchResults.length > 0" class="mt-6">
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Resultados:</h3>
                    <div class="max-h-80 overflow-y-auto">
                        <a 
                            v-for="result in searchResults" 
                            :key="result.id" 
                            :href="`/post/${result.slug}`" 
                            class="block p-3 border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 transition-colors"
                            @click="closeSearchModal"
                        >
                            <h4 class="font-medium text-gray-800 dark:text-gray-200">{{ result.title }}</h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ result.excerpt }}</p>
                        </a>
                    </div>
                </div>
                <div v-else-if="searchQuery && !isSearching" class="mt-6 text-center text-gray-500 dark:text-gray-400">
                    Nenhum resultado encontrado para "{{ searchQuery }}"
                </div>
            </div>
        </div>

        <!-- Conteúdo principal -->
        <main class="flex-grow">
            <slot />
        </main>

        <!-- Footer -->
        <footer class="bg-[#121212] text-gray-300 py-8">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <img src="/Nome.png" alt="TudoJogos" class="h-8 mb-4">
                        <p class="text-sm">Seu portal completo de notícias gamer.</p>
                    </div>
                    <div>
                        <h3 class="text-white font-bold mb-4">Links Rápidos</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="hover:text-[#14f195] text-sm">Console</a></li>
                            <li><a href="#" class="hover:text-[#14f195] text-sm">Mobile</a></li>
                            <li><a href="#" class="hover:text-[#14f195] text-sm">PC</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-white font-bold mb-4">Redes Sociais</h3>
                        <div class="flex space-x-4">
                            <a href="#" class="text-gray-400 hover:text-[#14f195]"><i class="fab fa-facebook"></i></a>
                            <a href="#" class="text-gray-400 hover:text-[#14f195]"><i class="fab fa-twitter"></i></a>
                            <a href="#" class="text-gray-400 hover:text-[#14f195]"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="text-gray-400 hover:text-[#14f195]"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { vue3 } from '@cmmv/blog/client';
import { useHead } from '@unhead/vue'
import { useSettingsStore } from '../../store/settings';
import { useCategoriesStore } from '../../store/categories';
import CookieConsent from '../../components/CookieConsent.vue';

const blogAPI = vue3.useBlog();
const categoriesStore = useCategoriesStore();
const settingsStore = useSettingsStore();

const settings = ref<any>(settingsStore.getSettings);

const scripts = computed(() => {
    const baseScripts = [];
    return [...baseScripts, ...settingsStore.googleAnalyticsScripts];
});

useHead({
    meta: computed(() => settingsStore.allMetaTags),

    link: [
        {
            rel: 'stylesheet',
            href: '/src/theme-testatudo/style.css'
        },
        {
            rel: 'icon',
            type: 'image/ico',
            href: '/src/theme-testatudo/favicon.ico?v=2'
        },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com/' },
        { rel: 'preconnect', href: 'https://www.google-analytics.com/' },
        { rel: 'preconnect', href: 'https://www.googletag.com/' },
        { rel: 'preconnect', href: 'https://connect.facebook.net/' },
        { rel: 'preconnect', href: 'https://securepubads.g.doubleclick.net/' },
        { rel: 'preconnect', href: 'https://tpc.googlesyndication.com/' },
        { rel: 'preconnect', href: 'https://www.googletag.com/' },
        { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com/' },
        { rel: 'dns-prefetch', href: 'https://securepubads.g.doubleclick.net' }
    ],

    script: scripts
})

const isDarkMode = ref(false);
const popularPosts = ref<any[]>([]);
const loadingPopularPosts = ref(true);

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

const searchModalOpen = ref(false);
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const searchTimeout = ref<any>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const mobileMenuOpen = ref(false);

const categories = ref<any[]>(categoriesStore.getCategories || []);

const footerCategories = computed(() => {
    return categories.value.slice(0, 6);
});

const mainNavCategories = computed(() => {
    const navCategories = categories.value?.filter((category: any) => category.mainNav) || [];
    navCategories.sort((a: any, b: any) => (a.mainNavIndex ?? 999) - (b.mainNavIndex ?? 999));

    const rootCategories = navCategories.filter((cat: any) => !cat.parentCategory);
    const childCategories = navCategories.filter((cat: any) => cat.parentCategory);

    return {
        rootCategories,
        childrenMap: childCategories.reduce((map: Record<string, any[]>, child: any) => {
            if (!map[child.parentCategory]) {
                map[child.parentCategory] = [];
            }
            map[child.parentCategory].push(child);
            return map;
        }, {} as Record<string, any[]>),
    };
});

const openDropdowns = ref<Record<string, boolean>>({});

const toggleDropdown = (categoryId: string, event: Event) => {
    event.stopPropagation();
    if (openDropdowns.value[categoryId]) {
        openDropdowns.value = {
            ...openDropdowns.value,
            [categoryId]: false
        };
    } else {
        const newDropdownState: Record<string, boolean> = {};
        Object.keys(openDropdowns.value).forEach(key => {
            newDropdownState[key] = false;
        });
        newDropdownState[categoryId] = true;
        openDropdowns.value = newDropdownState;
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

const categoriesColumns = computed(() => {
    const allCategories = categories.value;
    const columnSize = Math.ceil(allCategories.length / 3);

    return [
        allCategories.slice(0, columnSize),
        allCategories.slice(columnSize, columnSize * 2),
        allCategories.slice(columnSize * 2)
    ];
});

onMounted(async () => {
    await Promise.all([
        (async () => {
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
        })()
    ]);

    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    document.addEventListener('click', closeDropdownsOnClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', closeDropdownsOnClickOutside);
});

const closeDropdownsOnClickOutside = (event: Event) => {
    const dropdownElements = document.querySelectorAll('.dropdown-menu');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    let clickedInsideDropdown = false;

    dropdownElements.forEach(el => {
        if (el.contains(event.target as Node)) {
            clickedInsideDropdown = true;
        }
    });

    dropdownToggles.forEach(el => {
        if (el.contains(event.target as Node)) {
            clickedInsideDropdown = true;
        }
    });

    if (!clickedInsideDropdown) {
        openDropdowns.value = {};
    }
};

watch(isDarkMode, () => {
    applyTheme();
});
</script>
