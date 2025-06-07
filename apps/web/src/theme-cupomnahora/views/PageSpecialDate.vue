<template>
    <div v-if="specialDate && Object.keys(specialDate).length > 0" class="special-date-page">
        <!-- Banner Principal -->
        <div class="banner-hero" :style="specialDate.image ? `background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${specialDate.image})` : 'background-color: #4338ca'">
            <div class="banner-content">
                <div class="banner-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                </div>
                <h1>Cupons de Desconto {{ specialDate.name }}</h1>
                <p class="banner-description">
                    {{ specialDate.description }}
                </p>
            </div>
        </div>

        <!-- Intro Ofertas -->
        <div class="offers-intro">
            <p>
                Economize nas compras com <strong>{{ campaigns.length || '0' }} cupons</strong> de desconto para {{ specialDate.name }}. 
                Encontre os melhores cupons, promoções e ofertas exclusivas selecionados para esta data especial.
            </p>
        </div>

        <!-- Grid de Ofertas -->
        <div class="offers-grid" v-if="campaigns && campaigns.length > 0">
            <div v-for="campaign in campaigns" :key="campaign.id" class="offer-card">
                <div class="offer-logo">
                    <img :src="campaign.logo || '/src/theme-cupomnahora/assets/store-placeholder.png'" :alt="campaign.name" />
                </div>
                <div class="offer-info">
                    <h3 class="offer-percentage">
                        {{ campaign.discount || 'até 10%' }} 
                        <span>de cashback</span>
                    </h3>
                    <div class="offer-count">+{{ campaign.couponCount || 5 }} cupons</div>
                </div>
            </div>
        </div>

        <!-- Sem Ofertas -->
        <div v-else class="no-offers">
            <div class="no-offers-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
            </div>
            <h3>Nenhuma oferta disponível</h3>
            <p>Não há campanhas disponíveis para {{ specialDate.name }} no momento. Volte em breve para novas ofertas!</p>
        </div>

        <!-- Informação de desenvolvimento -->
         
        <div class="featured-offer">
            <div class="in-development-message">
                <h2>Em desenvolvimento</h2>
                <!--Todo-->
                <p>Todo:</p>
                <p> [ ] Criar relacionamento com as lojas (campanhas)</p>
                <p> [ ] Carregar cupons de desconto das lojas</p>
                
            </div>
        </div>

        <!-- Destaque de Oferta -->
        <div class="featured-offer" v-if="campaigns && campaigns.length > 0">
            <div class="featured-store-logo">
                <img :src="campaigns[0]?.logo || '/src/theme-cupomnahora/assets/store-placeholder.png'" :alt="campaigns[0]?.name || 'Loja'" />
            </div>

            <div class="featured-offer-content">
                <h2>Desfrute de um desconto irresistível de 10% nesta data especial</h2>
                <div class="featured-discount">+ 10% de cashback</div>
                <p class="featured-terms">Desconto não é cumulativo com outras promoções. Válido apenas para primeira compra.</p>
                <button class="coupon-button">Ver Cupom</button>
            </div>
        </div>
    </div>
    <div v-else class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando ofertas especiais...</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSpecialDates } from '@cmmv/special-dates/client/client.vue3';
import { useAffiliate } from '@cmmv/affiliate/client/client.vue3';

const route = useRoute();
const specialDate = ref<any>({});
const campaigns = ref<any[]>([]);
const { dates } = useSpecialDates();
const { campaigns: affiliateCampaigns } = useAffiliate();

onMounted(async () => {
    const slug = route.params.slug as string;
    console.log("Slug recebido:", slug);
    
    if (slug) {
        try {
            console.log("Buscando data especial para slug:", slug);
            const response = await dates.getBySlug(slug);
            console.log("Resposta completa da API:", response);
            
            // Estrutura correta: response.data.value
            if (response && response.data && response.data.value) {
                console.log("Extraindo dados de response.data.value");
                specialDate.value = response.data.value;
            } else if (response && response.result) {
                console.log("Estrutura com 'result' encontrada");
                specialDate.value = response.result;
            } else {
                console.log("Usando estrutura direta da resposta");
                specialDate.value = response;
            }
            
            console.log("Data especial após processamento:", specialDate.value);
            
            // Simulando campanhas temporariamente - Remova isto quando tiver dados reais
            campaigns.value = [
                {
                    id: '1',
                    name: 'Vivara',
                    logo: 'https://logodownload.org/wp-content/uploads/2019/10/vivara-logo-0.png',
                    discount: '10%',
                    couponCount: 19
                },
                {
                    id: '2',
                    name: 'Renner',
                    logo: 'https://logodownload.org/wp-content/uploads/2014/07/renner-logo-1.png',
                    discount: 'até 3,1%',
                    couponCount: 40
                },
                {
                    id: '3',
                    name: 'O Boticário',
                    logo: 'https://logodownload.org/wp-content/uploads/2014/10/boticario-logo-0.png',
                    discount: '3,1%',
                    couponCount: 40
                },
                {
                    id: '4',
                    name: 'Casas Bahia',
                    logo: 'https://logodownload.org/wp-content/uploads/2014/05/casas-bahia-logo-0-novo.png',
                    discount: 'até 12%',
                    couponCount: 40
                },
                {
                    id: '5',
                    name: 'Samsung',
                    logo: 'https://logodownload.org/wp-content/uploads/2014/01/samsung-logo-0-2048x2048.png',
                    discount: '2%',
                    couponCount: 40
                },
                {
                    id: '6',
                    name: 'Shein',
                    logo: 'https://logodownload.org/wp-content/uploads/2021/06/shein-logo-0-2048x2048.png',
                    discount: '1,7%',
                    couponCount: 40
                }
            ];
            
            /*
            // Carregar campanhas relacionadas se disponível
            if (specialDate.value && specialDate.value.id) {
                try {
                    // Assumindo que exista um método para buscar campanhas por data especial
                    // Se não existir, você precisará implementá-lo
                    const campaignsData = await affiliateCampaigns.getBySpecialDate(specialDate.value.id);
                    campaigns.value = campaignsData || [];
                } catch (error) {
                    console.error("Erro ao buscar campanhas:", error);
                    campaigns.value = [];
                }
            }
           */
        } catch (error) {
            console.error("Erro ao buscar dados da data especial:", error);
        }
    }
});
</script>

<style scoped>
.special-date-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Banner principal com fundo de imagem */
.banner-hero {
    position: relative;
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
    border-radius: 16px;
    margin-bottom: 2rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}

.banner-content {
    max-width: 800px;
    padding: 2rem;
    z-index: 2;
}

.banner-icon {
    background-color: rgba(255, 255, 255, 0.2);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
}

.banner-hero h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.banner-description {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.5;
}

/* Intro texto */
.offers-intro {
    background-color: #f7f9fc;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 1.1rem;
    color: #4a5568;
    line-height: 1.6;
}

.offers-intro strong {
    color: #4338ca;
    font-weight: 600;
}

/* Grid de ofertas */
.offers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.offer-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #edf2f7;
}

.offer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.offer-logo {
    height: 120px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-bottom: 1px solid #f0f4f8;
}

.offer-logo img {
    max-width: 100%;
    max-height: 80px;
    object-fit: contain;
}

.offer-info {
    padding: 1.2rem;
    text-align: center;
    background-color: #f8fafc;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.offer-percentage {
    color: #6366f1;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.3rem;
}

.offer-percentage span {
    display: block;
    font-size: 0.85rem;
    font-weight: 500;
    color: #718096;
    margin-top: 0.2rem;
}

.offer-count {
    font-size: 0.85rem;
    color: #718096;
    font-weight: 500;
}

/* Estado sem ofertas */
.no-offers {
    background-color: #f7f9fc;
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    margin-bottom: 2rem;
}

.no-offers-icon {
    width: 60px;
    height: 60px;
    background-color: #edf2f7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    color: #718096;
}

.no-offers h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
}

.no-offers p {
    color: #718096;
    max-width: 500px;
    margin: 0 auto;
}

/* Oferta destacada */
.featured-offer {
    margin-top: 3rem;
    margin-bottom: 3rem;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    padding: 2rem;
    display: flex;
    gap: 2rem;
    border: 1px solid #edf2f7;
}

.featured-store-logo {
    flex: 0 0 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.featured-store-logo img {
    max-width: 100%;
    max-height: 80px;
    object-fit: contain;
}

.featured-offer-content {
    flex: 1;
}

.featured-offer h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #2d3748;
}

.featured-discount {
    display: inline-block;
    background-color: #f0f5ff;
    color: #3b82f6;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    margin-bottom: 1rem;
}

.featured-terms {
    font-size: 0.85rem;
    color: #718096;
    margin-bottom: 1.5rem;
}

.coupon-button {
    background-color: #4f46e5;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
}

.coupon-button:hover {
    background-color: #4338ca;
}

/* Loading state */
.loading {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: #718096;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #edf2f7;
    border-radius: 50%;
    border-top-color: #6366f1;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .banner-hero {
        height: auto;
        padding: 3rem 1rem;
    }
    
    .banner-hero h1 {
        font-size: 1.8rem;
    }
    
    .featured-offer {
        flex-direction: column;
        padding: 1.5rem;
        gap: 1rem;
    }
    
    .featured-store-logo {
        margin-bottom: 1rem;
    }
}
</style> 