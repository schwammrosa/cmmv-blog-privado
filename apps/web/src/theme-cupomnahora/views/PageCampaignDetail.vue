<template>
    <div class="w-full relative">
        <div class="w-full max-w-[1200px] mx-auto px-4 py-8">
            <div v-if="loading" class="flex justify-center items-center py-10">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
                <span class="ml-3 text-gray-500">Carregando cupons...</span>
            </div>

            <div v-else-if="error" class="text-center py-10 bg-white rounded-lg p-6">
                <p class="text-lg text-red-500">{{ error }}</p>
                <p class="text-gray-500 mt-2">Não foi possível carregar os cupons. Tente novamente mais tarde.</p>
            </div>

            <div v-else-if="!campaign" class="text-center py-10 bg-white rounded-lg p-6">
                <p class="text-lg text-gray-600">Campanha não encontrada</p>
                <p class="text-gray-500 mt-2">A loja ou campanha que você está procurando não existe.</p>
                <a href="/desconto" class="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
                    Ver todas as lojas
                </a>
            </div>

            <div v-else class="bg-white rounded-lg p-6">
                <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                    <div class="w-32 h-32 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        <img v-if="campaign.logo" :src="campaign.logo" :alt="campaign.name" class="w-full h-full object-cover">
                        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex flex-col text-center md:text-left">
                            <h1 class="text-3xl font-bold text-gray-800 mb-2">Cupons de desconto {{ campaign.name }}</h1>
                            <p class="text-gray-500 mb-2">Atualizado em {{ formatDate(new Date()) }}</p>
                            <p class="text-gray-700">Encontramos {{ coupons.length }} cupons de desconto para {{ campaign.name }} →</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-sm font-medium">Termina em: 02:03:31</span>
                    </div>
                </div>

                <!-- Filtro -->
                <div class="border-t border-b border-gray-200 py-4 mb-8">
                    <div class="flex flex-wrap gap-2">
                        <div class="text-gray-700 font-medium mr-2 flex items-center">Filtrar por:</div>
                        <button 
                            @click="setFilter('all')" 
                            class="px-3 py-1.5 rounded-md text-sm font-medium"
                            :class="activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                        >
                            Todos ({{ coupons.length }})
                        </button>
                        <button 
                            @click="setFilter('codes')" 
                            :disabled="codesCount === 0"
                            class="px-3 py-1.5 rounded-md text-sm font-medium"
                            :class="[
                                activeFilter === 'codes' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                codesCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            ]"
                        >
                            Códigos ({{ codesCount }})
                        </button>
                        <button 
                            @click="setFilter('offers')" 
                            :disabled="offersCount === 0"
                            class="px-3 py-1.5 rounded-md text-sm font-medium"
                            :class="[
                                activeFilter === 'offers' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                offersCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            ]"
                        >
                            Ofertas ({{ offersCount }})
                        </button>
                        <button 
                            @click="setFilter('expired')" 
                            :disabled="expiredCount === 0"
                            class="px-3 py-1.5 rounded-md text-sm font-medium"
                            :class="[
                                activeFilter === 'expired' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                                expiredCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            ]"
                        >
                            Expirados ({{ expiredCount }})
                        </button>
                    </div>
                </div>

                <!-- Lista de Cupons -->
                <div v-if="filteredCoupons.length === 0" class="text-center py-10">
                    <p class="text-lg text-gray-600">Nenhum cupom encontrado para este filtro.</p>
                    <p class="text-gray-500 mt-2">Tente outro filtro ou volte mais tarde.</p>
                </div>
                
                <div v-else class="space-y-6">
                    <div v-for="coupon in filteredCoupons" :key="coupon.id" 
                        class="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow duration-300 bg-white relative"
                        :class="{'expired-coupon': new Date(coupon.expiration) < new Date()}">
                        
                        <!-- Etiqueta de desconto ou etiqueta de expirado -->
                        <div v-if="new Date(coupon.expiration) < new Date()" 
                            class="absolute top-0 left-0 bg-gray-500 text-white px-4 py-2 rounded-tr-lg rounded-bl-lg font-bold">
                            Expirado
                        </div>
                        <div v-else
                            class="absolute top-0 left-0 bg-indigo-600 text-white px-4 py-2 rounded-tr-lg rounded-bl-lg font-bold">
                            <template v-if="isCurrencyDiscount(coupon.title)">
                                {{ extractDiscountValue(coupon.title) + ' OFF' }}
                            </template>
                            <template v-else-if="extractDiscountPercentage(coupon.title)">
                                {{ extractDiscountPercentage(coupon.title) }} OFF
                            </template>
                            <template v-else>
                                Produto
                            </template>
                        </div>
                        
                        <div class="mt-6 md:ml-6">
                            <div class="flex flex-col md:flex-row">
                                <div class="flex-grow md:pr-6">
                                    <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-2">{{ coupon.title }}</h3>
                                    
                                    <!-- Cashback info -->
                                    <div v-if="coupon.cashbackPercentage" class="text-sm text-indigo-600 font-medium mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        + {{ coupon.cashbackPercentage }}% de cashback 
                                        <span v-if="coupon.oldCashbackPercentage" class="text-gray-500 line-through ml-1">(era {{coupon.oldCashbackPercentage}}%)</span>
                                    </div>
                                    
                                    <p class="text-gray-600 text-sm mb-3">{{ coupon.description }}</p>
                                    
                                    <!-- Validade e verificação -->
                                    <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mb-4">
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Verificado hoje</span>
                                        </div>
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span v-if="new Date(coupon.expiration) < new Date()" class="text-red-500 font-medium">Expirado em {{ formatDate(coupon.expiration) }}</span>
                                            <span v-else>Válido até {{ formatDate(coupon.expiration) }}</span>
                                        </div>
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span>{{ 100 + Math.floor(Math.random() * 500) }} usados hoje</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="md:w-48 flex-shrink-0 flex justify-center mt-4 md:mt-0">
                                    <button v-if="coupon.code"
                                        @click="openCouponModal(coupon)"
                                        class="w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center flex flex-col items-center"
                                        :class="[new Date(coupon.expiration) < new Date() ? 
                                            'bg-gray-700 hover:bg-gray-800 text-white' : 
                                            'bg-indigo-600 hover:bg-indigo-700 text-white']">
                                        <span class="block mb-1">VER CUPOM</span>
                                        <span class="text-xs">···{{ coupon.code.slice(-3) }}</span>
                                    </button>
                                    <a v-else
                                        :href="coupon.link || coupon.linkRef || '#'"
                                        target="_blank"
                                        class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center">
                                        VER OFERTA
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de Cupom (simplificado, pode ser substituído pelo CouponScratchModal) -->
    <div v-if="showCouponModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background-color: rgba(0, 0, 0, 0.5);">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
            <div class="text-center">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Seu cupom para {{ campaign?.name }}</h3>
                <div class="bg-gray-100 p-4 rounded-lg mb-4">
                    <p class="text-sm text-gray-600 mb-2">Copie e cole este código no checkout:</p>
                    <div class="flex items-center justify-center">
                        <div class="bg-white border border-gray-300 rounded px-4 py-2 text-lg font-mono font-bold text-gray-800">
                            {{ selectedCoupon?.code }}
                        </div>
                        <button @click="copyCouponCode" class="ml-2 p-2 bg-gray-200 hover:bg-gray-300 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                    <p v-if="codeCopied" class="text-sm text-indigo-600 mt-2">Copiado!</p>
                </div>
                <a :href="selectedCoupon?.link || selectedCoupon?.linkRef || '#'" target="_blank" 
                   class="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    IR PARA A LOJA
                </a>
                <button @click="closeCouponModal" class="mt-4 text-gray-600 hover:text-gray-800">
                    Fechar
                </button>
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
const campaign = ref<any>(null);
const coupons = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Estado para filtros
const activeFilter = ref('all'); // 'all', 'codes', 'offers', 'expired'

// Estado para modal de cupom
const showCouponModal = ref(false);
const selectedCoupon = ref<any>(null);
const codeCopied = ref(false);

// Contadores para os filtros
const codesCount = computed(() => coupons.value.filter(coupon => coupon.code).length);
const offersCount = computed(() => coupons.value.filter(coupon => !coupon.code).length);
const expiredCount = computed(() => coupons.value.filter(coupon => new Date(coupon.expiration) < new Date()).length);

// Filtrar cupons baseado no filtro ativo
const filteredCoupons = computed(() => {
    if (activeFilter.value === 'all') return coupons.value;
    if (activeFilter.value === 'codes') return coupons.value.filter(coupon => coupon.code);
    if (activeFilter.value === 'offers') return coupons.value.filter(coupon => !coupon.code);
    if (activeFilter.value === 'expired') return coupons.value.filter(coupon => new Date(coupon.expiration) < new Date());
    return coupons.value;
});

// SEO
const headData = computed(() => ({
    title: `Cupons de Desconto ${campaign.value?.name || ''} | ${settings.value?.['blog.title'] || 'Site de Cupons'}`,
    meta: [
        { 
            name: 'description', 
            content: `Economize com ${coupons.value.length} cupons de desconto ${campaign.value?.name || ''} válidos. Códigos verificados e funcionando.` 
        },
        { 
            property: 'og:title', 
            content: `Cupons de Desconto ${campaign.value?.name || ''} | ${settings.value?.['blog.title'] || 'Site de Cupons'}` 
        },
        { 
            property: 'og:description', 
            content: `Economize com ${coupons.value.length} cupons de desconto ${campaign.value?.name || ''} válidos. Códigos verificados e funcionando.` 
        },
        { property: 'og:type', content: 'website' },
        { 
            property: 'og:url', 
            content: `${settings.value?.['blog.url'] || 'https://cupomnahora.com.br'}/desconto/${route.params.slug}` 
        }
    ]
}));

useHead(headData);

// Carregar dados da campanha e cupons
const loadData = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        // Pegar o slug da rota
        const slug = route.params.slug;
        
        if (!slug) {
            error.value = 'Loja não encontrada';
            loading.value = false;
            return;
        }
        
        // Carregar todas as campanhas
        const campaignsData = await affiliateAPI.campaigns.getAllWithCouponCounts();
        
        if (!campaignsData || campaignsData.length === 0) {
            error.value = 'Não foi possível carregar as lojas';
            loading.value = false;
            return;
        }
        
        // Encontrar a campanha pelo slug
        const foundCampaign = campaignsData.find((c: any) => c.slug === slug);
        
        if (!foundCampaign) {
            error.value = 'Loja não encontrada';
            loading.value = false;
            return;
        }
        
        campaign.value = foundCampaign;
        
        // Carregar cupons reais da API
        try {
            const realCoupons = await affiliateAPI.coupons.getByCampaignId(campaign.value.id);
            if (realCoupons && realCoupons.length > 0) {
                //console.log("Cupons reais carregados:", realCoupons.length);
                coupons.value = realCoupons;
            }
        } catch (couponError) {
            console.error("Erro ao carregar cupons reais:", couponError);
        }
        
        loading.value = false;
    } catch (err: any) {
        console.error('Erro ao carregar campanha:', err);
        error.value = err.message || 'Erro ao carregar a loja e seus cupons';
        loading.value = false;
    }
};
/*
// Função auxiliar para gerar cupons simulados baseados na campanha
const generateDummyCoupons = () => {
    if (!campaign.value) return;
    
    const campaignName = campaign.value.name;
    const dummyCoupons = [];
    
    // Gerar entre 5 e 10 cupons aleatórios
    const numCoupons = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < numCoupons; i++) {
        const hasCode = Math.random() > 0.3; // 70% dos cupons terão código
        const discountValue = Math.floor(Math.random() * 60) + 5; // Desconto entre 5% e 65%
        
        // Determina se é um cupom expirado (30% de chance)
        const isExpired = Math.random() > 0.7;
        let expirationDate = new Date();
        
        if (isExpired) {
            // Data no passado (1-30 dias atrás)
            const randomDaysExpired = Math.floor(Math.random() * 30) + 1;
            expirationDate.setDate(expirationDate.getDate() - randomDaysExpired);
        } else {
            // Data no futuro (1-30 dias à frente)
            const randomDaysValid = Math.floor(Math.random() * 30) + 1;
            expirationDate.setDate(expirationDate.getDate() + randomDaysValid);
        }
        
        const couponTitles = [
            `Aproveite até ${discountValue}% OFF utilizando cupom ${campaignName}`,
            `Ganhe até ${discountValue}% OFF em suas compras com código ${campaignName}`,
            `Utilize código ${campaignName} e garanta Eletroportáteis com até ${discountValue}% OFF`,
            `Seus pedidos com até ${discountValue}% OFF aplicando o cupom ${campaignName}`,
            `Use voucher ${campaignName} e tenha ${discountValue}% de desconto em Bicicletas`
        ];
        
        const couponDescriptions = [
            `Desconto válido para seleção de produtos do link.`,
            `Válido nos Eletrodomésticos do link. Aplique o código na página de pagamento.`,
            `Aproveite Frete Grátis em suas compras (confira as regras no site). Desconto válido para eletroportáteis.`,
            `Válido para seleção do link. Aplique o cupom na página de pagamento.`,
            `Desconto válido na seleção do link.`
        ];
        
        dummyCoupons.push({
            id: `coup-${i}-${Date.now()}`,
            title: couponTitles[i % couponTitles.length],
            code: hasCode ? generateRandomCode(6) : null,
            description: couponDescriptions[i % couponDescriptions.length],
            expiration: expirationDate,
            type: hasCode ? 'code' : 'offer',
            typeDiscount: discountValue,
            cashbackPercentage: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : null,
            oldCashbackPercentage: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : null,
            linkRef: `https://${campaign.value.domain || 'example.com'}`
        });
        
    }
    
    coupons.value = dummyCoupons;
};

// Gerar código aleatório para cupons
const generateRandomCode = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
*/
// Formatar data para exibição
const formatDate = (date: Date | string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
};

// Alterar filtro ativo
const setFilter = (filter: string) => {
    activeFilter.value = filter;
};

// Funções para o modal de cupom
const openCouponModal = (coupon: any) => {
    selectedCoupon.value = coupon;
    showCouponModal.value = true;
    codeCopied.value = false;
};

const closeCouponModal = () => {
    showCouponModal.value = false;
    selectedCoupon.value = null;
};

const copyCouponCode = () => {
    if (!selectedCoupon.value?.code) return;
    
    navigator.clipboard.writeText(selectedCoupon.value.code)
        .then(() => {
            codeCopied.value = true;
            setTimeout(() => {
                codeCopied.value = false;
            }, 3000);
        })
        .catch(err => {
            console.error('Erro ao copiar: ', err);
        });
};

// Função para extrair percentual de desconto do título
const extractDiscountPercentage = (title: string) => {
    if (!title) return null;
    
    // Procura por padrões como "10%" ou "10 %" ou "10 por cento" ou "10 porcento"
    const percentRegex = /(\d+)(\s*)(%|\spor\scento|\sporcento)/i;
    const match = title.match(percentRegex);
    
    if (match && match[1]) {
        return match[1] + '%';
    }
    
    // Procura por padrões como "10 de desconto" ou "desconto de 10"
    const discountRegex = /(\d+)(\s*)(de\sdesconto|desconto)/i;
    const discountMatch = title.match(discountRegex);
    
    if (discountMatch && discountMatch[1]) {
        return discountMatch[1] + '%';
    }
    
    return null;
};

// Função para verificar se o desconto é em valor monetário
const isCurrencyDiscount = (title: string) => {
    if (!title) return false;
    
    // Procura por padrões como "R$49,99" ou "R$ 49,99"
    const currencyRegex = /R\$\s*\d+[\.,]?\d*/i;
    return currencyRegex.test(title);
};

// Função para extrair valor monetário do título
const extractDiscountValue = (title: string) => {
    if (!title) return 'Oferta';
    
    // Procura por padrões como "R$49,99" ou "R$ 49,99"
    const currencyRegex = /(R\$\s*\d+[\.,]?\d*)/i;
    const match = title.match(currencyRegex);
    
    if (match && match[1]) {
        return match[1];
    }
    
    return 'Oferta';
};

// Carregar dados quando a página é montada ou o slug muda
onMounted(() => {
    loadData();
});

watch(() => route.params.slug, (newSlug, oldSlug) => {
    if (newSlug !== oldSlug) {
        loadData();
    }
});
</script>

<style scoped>
/* Estilos adicionais se necessário */
.expired-coupon {
    background-color: #f8f8f8;
    opacity: 0.8;
    border-color: #ddd;
}

.expired-coupon h3,
.expired-coupon p {
    color: #999;
}

.expired-coupon button,
.expired-coupon a {
    opacity: 0.7;
}
</style> 