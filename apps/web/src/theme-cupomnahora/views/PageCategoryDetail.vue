<template>
    <div class="w-full max-w-[1200px] mx-auto px-4 py-8">
        <div v-if="loading" class="flex justify-center items-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
            <span class="ml-3 text-gray-500">Carregando...</span>
        </div>

        <div v-else-if="error" class="text-center py-10 bg-white rounded-lg p-6">
            <p class="text-lg text-red-500">{{ error }}</p>
            <p class="text-gray-500 mt-2">Não foi possível carregar a categoria. Tente novamente mais tarde.</p>
        </div>

        <div v-else-if="!category" class="text-center py-10 bg-white rounded-lg p-6">
            <p class="text-lg text-gray-600">Categoria não encontrada</p>
            <p class="text-gray-500 mt-2">A categoria que você está procurando não existe.</p>
            <a href="/cupom" class="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
                Ver todas as categorias
            </a>
        </div>

        <div v-else>
            <!-- Header da Categoria -->
            <div class="bg-white rounded-lg p-6 mb-8">
                <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div class="flex-1">
                        <div class="flex flex-col text-center md:text-left">
                            <h1 class="text-3xl font-bold text-gray-800 mb-2">Cupons de desconto {{ category.name }}</h1>
                            <p class="text-gray-500 mb-2">Atualizado em {{ formatDate(new Date()) }}</p>
                            <p class="text-gray-700">
                                Encontramos {{ relatedCampaigns.length }}
                                {{ relatedCampaigns.length === 1 ? 'loja' : 'lojas' }}
                                com cupons de desconto para {{ category.name }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lista de Campanhas -->
            <div v-if="relatedCampaigns.length === 0" class="text-center py-10 bg-white rounded-lg p-6">
                <p class="text-lg text-gray-600">Nenhuma loja encontrada para esta categoria</p>
                <p class="text-gray-500 mt-2">Tente outra categoria ou volte mais tarde.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="campaign in relatedCampaigns" :key="campaign.id"
                    class="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 ease-out"
                    :class="campaign.highlight ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 ring-2 ring-orange-200' : 'hover:border-gray-300'">

                    <!-- Header com logo -->
                    <div class="flex items-center justify-center mb-4">
                        <div class="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg">
                            <img v-if="campaign.logo" :src="campaign.logo" :alt="campaign.name"
                                class="max-w-full max-h-full object-contain rounded">
                            <div v-else class="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Info da loja -->
                    <div class="text-center mb-4">
                        <h3 class="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{{ campaign.name }}</h3>
                        <p class="text-xs text-gray-500">{{ campaign.couponCount }} {{ campaign.couponCount === 1 ? 'cupom' : 'cupons' }} disponível{{ campaign.couponCount === 1 ? '' : 'is' }}</p>
                    </div>

                    <!-- Botão Ver Cupons -->
                    <a :href="`/desconto/${campaign.slug}`"
                        class="block w-full text-center py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
                        :class="campaign.highlight ?
                            'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600' :
                            'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700'
                        ">
                        <span class="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Ver Cupons
                        </span>
                    </a>

                    <!-- Badge de destaque -->
                    <div v-if="campaign.highlight"
                        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                        🔥 Popular
                    </div>

                    <!-- Badge de quantidade -->
                    <div class="absolute top-2 left-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {{ campaign.couponCount }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { useRoute } from 'vue-router';
import { vue3 } from '@cmmv/blog/client';
import { vue3 as affiliateVue3 } from '@cmmv/affiliate/client';
import { useSettingsStore } from '../../store/settings';

const route = useRoute();
const blogAPI = vue3.useBlog();
const affiliateAPI = affiliateVue3.useAffiliate();
const settingsStore = useSettingsStore();

const settings = ref<any>(settingsStore.getSettings);
const category = ref<any>(null);
const campaigns = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);


// SEO
const headData = computed(() => ({
    title: `Cupons de Desconto ${category.value?.name || 'Categoria'} | ${settings.value?.['blog.title'] || 'Site de Cupons'}`,
    meta: [
        {
            name: 'description',
            content: `Economize com cupons de desconto ${category.value?.name || 'Categoria'}. Códigos verificados e funcionando.`
        },
        {
            property: 'og:title',
            content: `Cupons de Desconto ${category.value?.name || 'Categoria'} | ${settings.value?.['blog.title'] || 'Site de Cupons'}`
        },
        {
            property: 'og:description',
            content: `Economize com cupons de desconto ${category.value?.name || 'Categoria'}. Códigos verificados e funcionando.`
        },
        { property: 'og:type', content: 'website' },
        {
            property: 'og:url',
            content: `${settings.value?.['blog.url'] || 'https://cupomnahora.com.br'}/categoria/${route.params.slug}`
        }
    ]
}));

useHead(headData);

const relatedCampaigns = computed(() => {
    if (!category.value || !campaigns.value.length) return [];

    console.log('Categoria atual:', category.value);
    console.log('Total de campanhas:', campaigns.value.length);
    
    // Filtramos apenas campanhas que têm a categoria atual E que têm cupons disponíveis
    const campaignsInCategory = campaigns.value.filter(campaign => {
        // Verifica se a campanha tem cupons
        const hasCoupons = campaign.couponCount > 0;
        
        // Verifica a categoria de várias formas possíveis
        let hasCategory = false;
        
        // Método 1: Verifica se a categoria está no array de categorias (API)
        if (campaign.categories && Array.isArray(campaign.categories)) {
            // Comparação direta de IDs
            hasCategory = campaign.categories.includes(category.value.id);
            
            // Comparação de strings de IDs
            if (!hasCategory) {
                hasCategory = campaign.categories.some(catId => 
                    String(catId) === String(category.value.id)
                );
            }
        }
        
        
        // Método 2: Verifica se a categoria está no nome da campanha ou descrição (fallback)
        if (!hasCategory && category.value.name && campaign.name) {
            const categoryName = category.value.name.toLowerCase();
            const campaignName = campaign.name.toLowerCase();
            const campaignDesc = (campaign.description || '').toLowerCase();
            
            if (campaignName.includes(categoryName) || categoryName.includes(campaignName) ||
                campaignDesc.includes(categoryName)) {
                hasCategory = true;
            }
        }
        
        // Log para depuração
        if (campaign.name === 'Consul' || campaign.name === 'Brastemp') {
            console.log(`Campanha: ${campaign.name}, Tem cupons: ${hasCoupons}, Tem categoria: ${hasCategory}`);
            console.log('Categories:', campaign.categories);
        }
        
        return hasCategory && hasCoupons;
    });

    console.log('Campanhas filtradas:', campaignsInCategory.length);
    /*
    if (campaignsInCategory.length === 0) {
        // Fallback: Se não encontrarmos nenhuma campanha, mostrar todas as campanhas com cupons
        console.log('Nenhuma campanha na categoria. Mostrando todas as campanhas com cupons.');
        return campaigns.value.filter(campaign => campaign.couponCount > 0);
    }
    */
    // Ordenamos as campanhas: primeiro as destacadas, depois por número de cupons
    return [...campaignsInCategory].sort((a, b) => {
        if (a.highlight && !b.highlight) return -1;
        if (!a.highlight && b.highlight) return 1;
        if (a.couponCount !== b.couponCount) return b.couponCount - a.couponCount;
        return a.name.localeCompare(b.name);
    });
});

const loadData = async () => {
    try {
        loading.value = true;
        error.value = null;
        const slug = route.params.slug;

        if (!slug) {
            error.value = 'Categoria não encontrada';
            loading.value = false;
            return;
        }

        const categoriesData = await affiliateAPI.categories.getAll();

        if (!categoriesData || categoriesData.length === 0) {
            error.value = 'Não foi possível carregar as categorias';
            loading.value = false;
            return;
        }

        const foundCategory = categoriesData.find((c: any) => c.slug === slug);

        if (!foundCategory) {
            error.value = 'Categoria não encontrada';
            loading.value = false;
            return;
        }

        category.value = foundCategory;

        const campaignsData = await affiliateAPI.campaigns.getAllWithCouponCounts();

        if (campaignsData && campaignsData.length > 0) {
            campaigns.value = campaignsData;
        } else {
            campaigns.value = [];
        }

        loading.value = false;
    } catch (err: any) {
        console.error('Erro ao carregar categoria:', err);
        error.value = err.message || 'Erro ao carregar a categoria';
        loading.value = false;
    }
};

const formatDate = (date: Date | string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
};

onMounted(() => {
    loadData();
});

watch(() => route.params.slug, (newSlug, oldSlug) => {
    if (newSlug !== oldSlug) {
        loadData();
    }
});
</script>
