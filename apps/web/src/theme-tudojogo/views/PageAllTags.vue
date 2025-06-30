<template>
    <div class="w-full relative bg-[#0a0a1a]">
        <div class="w-full max-w-[1200px] mx-auto px-4">
            <!-- Main Content -->
            <div class="bg-[#0a0a1a] rounded-lg p-6 article-container overflow-hidden flex-grow text-gray-100">
                <header class="border-b border-[#303443] pb-4 mb-6 pt-4 text-center">
                    <h1 class="text-3xl font-bold text-white mb-3 text-shadow-gamer" style="text-shadow: 0 0 10px rgba(102, 0, 204, 0.8), 0 0 5px #fff;">Todas as Tags</h1>
                    <p class="text-gray-300 mb-4 mx-auto max-w-2xl">Lista completa de todas as tags do blog em ordem alfabética.</p>
                </header>

                <!-- Top AdSense Banner -->
                <div v-if="adSettings.enableAds && getAdHtml('header')" class="w-full bg-gray-100 rounded-lg mb-8 overflow-hidden flex justify-center">
                    <div class="ad-container ad-banner-top py-2 px-4">
                        <div v-html="getAdHtml('header')"></div>
                    </div>
                </div>

                <!-- Initial loading state -->
                <div v-if="loading" class="flex justify-center items-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6600cc]"></div>
                </div>

                <!-- Tags List -->
                <div v-else-if="tags.length > 0" class="my-6">
                    <!-- Alphabet navigation -->
                    <div class="flex flex-wrap justify-center gap-2 mb-8">
                        <button 
                            v-for="letter in alphabet" 
                            :key="letter"
                            @click="scrollToLetter(letter)"
                            style="text-shadow: 0 0 3px rgba(255,255,255,0.5);"
                            class="w-8 h-8 rounded-full flex items-center justify-center bg-[#191a30] text-white hover:bg-[#6600cc] hover:text-white transition-colors font-medium"
                            :class="{'bg-[#6600cc] text-white font-bold': hasTagsStartingWith(letter)}"
                        >
                            {{ letter }}
                        </button>
                    </div>

                    <!-- Tags grouped by letter -->
                    <div class="space-y-6">
                        <template v-for="letter in alphabet" :key="letter">
                            <div v-if="hasTagsStartingWith(letter)" :id="`letter-${letter}`" class="letter-section">
                                <h2 class="text-2xl font-bold text-white mb-4 border-b-2 border-[#6600cc] pb-2 text-shadow-gamer" style="text-shadow: 0 0 8px rgba(102, 0, 204, 0.7), 0 0 4px #fff;">{{ letter }}</h2>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <div v-for="tag in getTagsStartingWith(letter)" :key="tag.id" class="tag-card">
                                        <a :href="`/tag/${tag.slug}`" class="block bg-[#191a30] border border-[#303443] rounded-lg p-4 hover:shadow-glow transition-all hover:border-[#6600cc]">
                                            <h3 class="text-lg font-medium text-white mb-1">{{ tag.name }}</h3>
                                            <div class="text-sm text-gray-400">{{ tag.postCount === 1 ? '1 post' : (tag.realPostCount !== null && tag.realPostCount !== undefined ? `${tag.realPostCount} posts` : 'Ver posts') }}</div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- No tags state -->
                <div v-else class="text-center py-16">
                    <h2 class="text-2xl font-bold mb-2 text-white">Nenhuma tag encontrada</h2>
                    <p class="text-gray-300">Não encontramos nenhuma tag no sistema.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onServerPrefetch, watch } from 'vue';
import { useAds } from '../../composables/useAds';
import { useSettingsStore } from '../../store/settings';
import { useHead } from '@unhead/vue';
import * as cmmv from '@cmmv/blog/client';

const tags = ref<Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    postCount: number;
    realPostCount?: number | null;
}>>([]);

const loading = ref(true);
const settingsStore = useSettingsStore();
const blogAPI = cmmv.vue3.useBlog();
const { adSettings, getAdHtml } = useAds(settingsStore.getSettings, 'tags');

// Alfabeto para navegação e agrupamento
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Função para verificar se existem tags começando com determinada letra
const hasTagsStartingWith = (letter: string) => {
    return tags.value.some(tag => tag.name.toUpperCase().startsWith(letter));
};

// Função para obter todas as tags que começam com determinada letra
const getTagsStartingWith = (letter: string) => {
    return tags.value.filter(tag => tag.name.toUpperCase().startsWith(letter))
        .sort((a, b) => a.name.localeCompare(b.name));
};

// Função para rolar até a seção de uma letra específica
const scrollToLetter = (letter: string) => {
    if (hasTagsStartingWith(letter)) {
        const element = document.getElementById(`letter-${letter}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// Função para carregar todas as tags
const loadTags = async () => {
    try {
        loading.value = true;
        // Iniciando busca de tags
        
        let tagsData: any[] = [];
        
        // Tenta método 1: tags.getAll
        if (blogAPI.tags && typeof blogAPI.tags.getAll === 'function') {
            const response = await blogAPI.tags.getAll();
            if (response && Array.isArray(response)) {
                tagsData = response;
            } else if (response && response.data && Array.isArray(response.data)) {
                tagsData = response.data;
            }
        }
        
        // Tenta método 4: request direto API
        if (tagsData.length === 0) {
            try {
                const response = await fetch('/api/blog/tags');
                const result = await response.json();
                if (result && result.data && Array.isArray(result.data)) {
                    tagsData = result.data;
                }
            } catch (fetchError) {
                // Erro ao buscar tags diretamente
            }
        }
        
        // Processar os dados obtidos
        if (tagsData.length > 0) {
            // Primeiro vamos obter contagens reais de posts para cada tag usando o método correto da API
            const processedTags: Array<{
                id: string;
                name: string;
                slug: string;
                description?: string;
                postCount: number;
                realPostCount: number | null;
            }> = tagsData.map(tag => ({
                id: tag.id || '',
                name: tag.name || '',
                slug: tag.slug || '',
                description: tag.description || '',
                postCount: tag.count || tag.postCount || 0,
                realPostCount: null
            }));

            // Agora vamos tentar obter a contagem real para algumas tags
            try {
                // Para evitar muitas chamadas à API, limitamos a 5 tags aleatórias para verificar
                const sampleTags = processedTags
                    .sort(() => 0.5 - Math.random())
                    .slice(0, Math.min(5, processedTags.length));
                
                for (const tag of sampleTags) {
                    try {
                        // Tentamos obter a primeira página de posts para a tag para ver a contagem real
                        if (blogAPI.tags && typeof blogAPI.tags.getPostsBySlug === 'function') {
                            const response = await blogAPI.tags.getPostsBySlug(tag.slug, 0);
                            if (response && typeof response.total === 'number') {
                                // Encontramos a contagem real!
                                const realCount = response.total;
                                // Atualizamos a tag correspondente no array principal
                                const tagToUpdate = processedTags.find(t => t.slug === tag.slug);
                                if (tagToUpdate) {
                                    tagToUpdate.realPostCount = realCount;
                                    // Se descobrirmos que a proporção está errada, aplicamos a mesma correção a todas as tags
                                    if (tagToUpdate.postCount !== realCount && tagToUpdate.postCount > 0) {
                                        const correctionFactor = realCount / tagToUpdate.postCount;
                                        if (correctionFactor > 0) {
                                            // Aplicar fator de correção em todas as tags
                                            processedTags.forEach(t => {
                                                if (t.slug !== tag.slug) {
                                                    t.realPostCount = typeof t.postCount === 'number' ? Math.round(t.postCount * correctionFactor) : null;
                                                }
                                            });
                                        }
                                    }
                                    break; // Apenas uma amostra é suficiente para determinar o fator de correção
                                }
                            }
                        }
                    } catch (err) {
                        // Erro ao verificar contagem real para tag
                    }
                }
            } catch (countError) {
                // Erro ao verificar contagens reais
            }

            // Ordenamos as tags alfabeticamente
            tags.value = processedTags.sort((a, b) => a.name.localeCompare(b.name));
            // Tags processadas e ordenadas
        } else {
            // Não foi possível obter tags
            tags.value = [];
        }
    } catch (error) {
        // Erro ao carregar tags
        tags.value = [];
    } finally {
        loading.value = false;
    }
};

// Informações de metadados da página para SEO
const headData = ref({
    title: 'Todas as Tags',
    meta: [
        {
            name: 'description',
            content: 'Lista completa de todas as tags do blog em ordem alfabética.'
        },
        {
            property: 'og:title',
            content: 'Todas as Tags'
        },
        {
            property: 'og:description',
            content: 'Lista completa de todas as tags do blog em ordem alfabética.'
        },
        {
            property: 'og:type',
            content: 'website'
        },
        {
            name: 'twitter:card',
            content: 'summary'
        }
    ]
});

// Função para atualizar os metadados da página para SEO
const updateHeadData = () => {
    const blogName = settingsStore.getSettings?.['blog.name'] || '';
    const blogUrl = settingsStore.getSettings?.['blog.url'] || '';
    headData.value = {
        title: 'Todas as Tags' + (blogName ? ' - ' + blogName : ''),
        meta: [
            {
                name: 'description',
                content: `Lista completa de todas as tags do ${blogName} em ordem alfabética.`
            },
            {
                property: 'og:title',
                content: `Todas as Tags${blogName ? ' - ' + blogName : ''}`
            },
            {
                property: 'og:description',
                content: `Lista completa de todas as tags do ${blogName} em ordem alfabética.`
            },
            {
                property: 'og:type',
                content: 'website'
            },
            {
                property: 'og:url',
                content: `${blogUrl}/tags`
            },
            {
                name: 'twitter:card',
                content: 'summary'
            },
            {
                name: 'twitter:title',
                content: `Todas as Tags${blogName ? ' - ' + blogName : ''}`
            },
            {
                name: 'twitter:description',
                content: `Lista completa de todas as tags do ${blogName} em ordem alfabética.`
            }
        ]
    };
};

// Configuração do Head para SEO
useHead(headData);

// Carregar dados no servidor para SSR
onServerPrefetch(async () => {
    await loadTags();
    updateHeadData();
});

// Inicialização dos dados na montagem do componente
onMounted(async () => {
    // Componente montado
    updateHeadData();
    
    if (tags.value.length === 0) {
        // Carregando tags no onMounted
        await loadTags();
    }
});

// Atualize os metadados quando o settingsStore estiver disponível
watch(() => settingsStore, () => {
    updateHeadData();
}, { immediate: true });

// Debug - exibir tags quando mudar
watch(() => tags.value, (newTags) => {
    // Tags atualizadas
}, { deep: true });
</script>

<style scoped>
.letter-section {
    scroll-margin-top: 2rem;
}
</style>
