<template>
    <header class="gamer-header sticky top-0 z-50 shadow-md">
        <div class="max-w-[1200px] mx-auto px-4">
            <div class="flex justify-between items-center h-18">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center h-32">
                    <a href="/" class="text-white flex items-center h-full py-2">
                        <img src="/src/theme-tudojogo/assets/Logo.webp" alt="TudoJogo Logo" class="h-32 max-h-full object-contain">
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center space-x-1 gamer-nav">
                    <template v-for="category in mainNavCategories.rootCategories" :key="category.id">
                        <div v-if="mainNavCategories.childrenMap[category.id]" class="relative">
                            <button
                                @click="(e) => toggleDropdown(category.id, e)"
                                class="dropdown-toggle text-white hover:bg-[#064019] px-2 py-1 rounded text-sm flex items-center whitespace-nowrap transition-colors"
                                :class="{'bg-[#064019] text-[#ffcc00]': openDropdowns[category.id]}"
                            >
                                {{ category.name }}
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div
                                v-show="openDropdowns[category.id]"
                                class="dropdown-menu gamer-dropdown absolute left-0 mt-1 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                            >
                                <a v-for="child in mainNavCategories.childrenMap[category.id]" :key="child.id"
                                    :href="`/category/${child.slug}`"
                                    class="block text-white px-3 py-2 text-sm transition-colors"
                                >
                                    {{ child.name }}
                                </a>
                            </div>
                        </div>
                        <a v-else
                            :href="`/category/${category.slug}`"
                            class="text-white px-2 py-1 rounded text-sm whitespace-nowrap transition-colors"
                        >
                            {{ category.name }}
                        </a>
                    </template>
                </nav>

                <!-- Social and Search -->
                <div class="hidden md:flex items-center space-x-3 gamer-social">
                    <a v-if="settings['blog.facebook']" :href="`https://facebook.com/${settings['blog.facebook']}`" target="_blank" rel="noopener noreferrer" title="Facebook" class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a v-if="settings['blog.twitter']" :href="`https://twitter.com/${settings['blog.twitter']}`" target="_blank" rel="noopener noreferrer" title="Twitter" class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                    <a v-if="settings['blog.instagram']" :href="`https://instagram.com/${settings['blog.instagram']}`" target="_blank" rel="noopener noreferrer" title="Instagram" class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                    </a>
                    <a v-if="settings['blog.youtube']" :href="`https://youtube.com/${settings['blog.youtube']}`" target="_blank" rel="noopener noreferrer" title="YouTube" class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                    </a>
                    <a v-if="settings['blog.github']" :href="`https://github.com/${settings['blog.github']}`" target="_blank" rel="noopener noreferrer" title="GitHub" class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                    </a>
                    <a v-if="settings['blog.whatsapp']" :href="`https://chat.whatsapp.com/${settings['blog.whatsapp']}`" target="_blank" rel="noopener noreferrer" title="WhatsApp" class="bg-green-500 hover:bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 448 512" fill="currentColor">
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                        </svg>
                    </a>
                    <a v-if="settings['blog.telegram']" :href="`https://t.me/${settings['blog.telegram']}`" target="_blank" rel="noopener noreferrer" title="Telegram" class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.325.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                    </a>
                    <a v-if="settings['blog.discord']" :href="`https://discord.gg/${settings['blog.discord']}`" target="_blank" rel="noopener noreferrer" title="Discord" class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/>
                        </svg>
                    </a>

                    <!-- Search Button -->
                    <button @click="openSearchModal" class="text-white hover:text-[#ffcc00] transition-colors" title="Search" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                <!-- Mobile Menu Button -->
                <div class="md:hidden flex items-center space-x-3">
                    <button @click="openSearchModal" class="text-white hover:text-[#ffcc00] transition-colors" title="Search" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-white" title="Navbar" aria-label="Navbar">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-show="mobileMenuOpen" class="md:hidden py-3 gamer-mobile-menu">
                <div class="flex flex-col gap-1">
                    <template v-for="category in mainNavCategories.rootCategories" :key="category.id">
                        <div v-if="mainNavCategories.childrenMap[category.id]" class="w-full">
                            <button
                                @click="(e) => toggleDropdown(category.id, e)"
                                class="dropdown-toggle flex items-center justify-between w-full text-white rounded px-3 py-2 text-sm"
                                :class="{'bg-[#064019] text-[#ffcc00]': openDropdowns[category.id]}"
                            >
                                {{ category.name }}
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div v-show="openDropdowns[category.id]" class="pl-4 py-1 gamer-dropdown rounded mt-1">
                                <a
                                    v-for="child in mainNavCategories.childrenMap[category.id]"
                                    :key="child.id"
                                    :href="`/category/${child.slug}`"
                                    class="block px-4 py-2 text-sm text-white rounded"
                                >
                                    {{ child.name }}
                                </a>
                            </div>
                        </div>
                        <a
                            v-else
                            :href="`/category/${category.slug}`"
                            class="block text-white rounded px-3 py-2 text-sm"
                        >
                            {{ category.name }}
                        </a>
                    </template>
                </div>

                <!-- Social Icons for Mobile -->
                <div class="flex justify-center space-x-6 mt-3 pt-3 border-t gamer-footer-border gamer-social">
                    <a href="#" class="text-white hover:text-[#ffcc00] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="#" class="text-white hover:text-[#ffcc00] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                    <a href="#" class="text-white hover:text-[#ffcc00] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        <SearchModal :is-open="isSearchModalOpen" @close="closeSearchModal" />
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useSettingsStore } from '../../store/settings';
import { useCategoriesStore } from '../../store/categories';
import { useRouter } from 'vue-router';
import SearchModal from './SearchModal.vue';
import { useFetch } from '../composables/useFetch';

const settingsStore = useSettingsStore();
const settings = computed(() => settingsStore.getSettings);

const categoriesStore = useCategoriesStore();
const categories = computed(() => categoriesStore.getCategories);

const router = useRouter();

// State for UI
const mobileMenuOpen = ref(false);
const openDropdowns = ref<{ [key: string]: boolean }>({});
const isSearchModalOpen = ref(false);

// Fetch initial data
onMounted(async () => {
    if (!settings.value) {
        const { data } = await useFetch<any>('/api/blog/settings', 'settings');
        if(data.value) {
            settingsStore.setSettings(data.value);
        }
    }
    if (!categories.value || categories.value.length === 0) {
        const { data } = await useFetch<any[]>('/api/blog/categories', 'categories');
        if (data.value) {
            categoriesStore.setCategories(data.value);
        }
    }
});

// Navigation logic
const mainNavCategories = computed(() => {
    const allCategories = categories.value || [];
    
    // Filtra apenas as categorias que devem aparecer na navegação principal
    const navCategories = allCategories.filter((category: any) => category.mainNav);

    // Ordena as categorias pela ordem definida no painel
    navCategories.sort((a: any, b: any) => (a.mainNavIndex ?? 999) - (b.mainNavIndex ?? 999));

    // Separa as categorias raiz das subcategorias
    const rootCategories = navCategories.filter((cat: any) => !cat.parentCategory);
    const childCategories = navCategories.filter((cat: any) => cat.parentCategory);

    // Mapeia as subcategorias para suas respectivas categorias raiz
    const childrenMap = childCategories.reduce((map: Record<string, any[]>, child: any) => {
        const parentId = child.parentCategory;
        if (!map[parentId]) {
            map[parentId] = [];
        }
        map[parentId].push(child);
        return map;
    }, {} as Record<string, any[]>);
    
    return { rootCategories, childrenMap };
});

const toggleDropdown = (categoryId: string, event: MouseEvent) => {
    event.stopPropagation();
    const wasOpen = openDropdowns.value[categoryId];
    closeAllDropdowns();
    if (!wasOpen) {
        openDropdowns.value[categoryId] = true;
    }
};

const closeAllDropdowns = () => {
    openDropdowns.value = {};
};

// Search modal logic
const openSearchModal = () => {
    isSearchModalOpen.value = true;
};

const closeSearchModal = () => {
    isSearchModalOpen.value = false;
};

// Close dropdowns when clicking outside
onMounted(() => {
    document.addEventListener('click', closeAllDropdowns);
});

onUnmounted(() => {
    document.removeEventListener('click', closeAllDropdowns);
});

// Close mobile menu on route change
watch(() => router.currentRoute.value, () => {
    mobileMenuOpen.value = false;
});
</script>


<style scoped>
/* Scoped styles for header can be added here */
.gamer-header {
    background: linear-gradient(90deg, #0f0c29, #302b63, #24243e);
    border-bottom: 3px solid #ffcc00;
}
.gamer-nav a:hover, .gamer-nav button:hover {
    background-color: #064019;
    color: #ffcc00;
}
.gamer-dropdown {
    background-color: #1c1c3c;
    border: 1px solid #ffcc00;
}
.gamer-dropdown a:hover {
    background-color: #064019;
}
.gamer-social a {
    background-color: #2a2a52;
}
.gamer-social a:hover {
    background-color: #ffcc00;
    color: #121212 !important;
}
.gamer-mobile-menu {
    background-color: rgba(36, 36, 62, 0.98);
}
</style> 