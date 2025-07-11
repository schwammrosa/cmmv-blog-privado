<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-start pt-20" @click.self="close">
        <div class="bg-[#0a0a1a] rounded-lg shadow-xl w-full max-w-2xl transform transition-all" @click.stop>
            <div class="p-5 border-b border-[#303443] flex justify-between items-center">
                <h3 class="text-lg font-medium text-white">Buscar no site</h3>
                <button @click="close" class="text-gray-400 hover:text-white">&times;</button>
            </div>
            <div class="p-5">
                <div class="relative">
                    <input
                        type="text"
                        v-model="searchQuery"
                        @input="performSearch"
                        placeholder="O que você está procurando?"
                        class="w-full bg-[#1a1b26] border border-[#303443] text-white rounded-md p-3 focus:ring-[#6600cc] focus:border-[#6600cc]"
                    />
                    <div v-if="isLoading" class="absolute top-3 right-3">
                        <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    </div>
                </div>

                <div v-if="results.length > 0" class="mt-5 max-h-96 overflow-y-auto">
                    <ul>
                        <li v-for="post in results" :key="post.id" class="border-b border-[#303443] last:border-b-0">
                            <a :href="`/post/${post.slug}`" class="block hover:bg-[#1a1b26] p-4 transition-colors">
                                <h4 class="font-semibold text-white">{{ post.title }}</h4>
                                <p class="text-sm text-gray-400 line-clamp-2">{{ post.excerpt || stripHtml(post.content) }}</p>
                            </a>
                        </li>
                    </ul>
                </div>
                <div v-else-if="searchQuery && !isLoading" class="mt-5 text-center text-gray-400">
                    <p>Nenhum resultado encontrado para "{{ searchQuery }}".</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { vue3 } from '@cmmv/blog/client';
import { stripHtml } from '../../composables/useUtils';
import debounce from 'lodash.debounce';

const props = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits(['close']);

const searchQuery = ref('');
const results = ref<any[]>([]);
const isLoading = ref(false);
const blogApi = vue3.useBlog();

const performSearch = debounce(async () => {
    if (searchQuery.value.length < 3) {
        results.value = [];
        return;
    }
    isLoading.value = true;
    try {
        const response = await blogApi.posts.search(searchQuery.value);
        results.value = response;
    } catch (error) {
        console.error('Error during search:', error);
        results.value = [];
    } finally {
        isLoading.value = false;
    }
}, 300);

const close = () => {
    searchQuery.value = '';
    results.value = [];
    emit('close');
};

watch(() => props.isOpen, (newValue) => {
    if (!newValue) {
        searchQuery.value = '';
        results.value = [];
    }
});
</script> 