<template>
    <div v-if="specialDate && Object.keys(specialDate).length > 0" class="special-date-page">
        <div class="banner-container" v-if="specialDate.image">
            <img :src="specialDate.image" :alt="specialDate.name" class="banner-image" />
        </div>
        <div class="header-container">
            <h1 class="title">{{ specialDate.name }}</h1>
            <h2 class="description">{{ specialDate.description }}</h2>
        </div>

        <div class="campaign-list" v-if="campaigns.length > 0">
            <h3>Campanhas Ativas</h3>
            <div class="grid">
                <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
                    <a :href="campaign.link" target="_blank" rel="noopener noreferrer">
                        <img :src="campaign.image" :alt="campaign.name" class="campaign-image" />
                        <div class="campaign-info">
                            <h4>{{ campaign.name }}</h4>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div v-else class="no-campaigns">
            <p>Nenhuma campanha disponível para esta data no momento.</p>
        </div>
    </div>
    <div v-else class="loading">
        <p>Carregando...</p>
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
    padding: 2rem;
    font-family: 'Inter', sans-serif;
}

.banner-container {
    margin-bottom: 2rem;
    text-align: center;
}

.banner-image {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.header-container {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
}

.title {
    font-size: 3rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5rem;
}

.description {
    font-size: 1.5rem;
    font-weight: 400;
    color: #555;
}

.campaign-list h3 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-align: center;
    color: #333;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
}

.campaign-card {
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.campaign-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.campaign-card a {
    text-decoration: none;
    color: inherit;
}

.campaign-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.campaign-info {
    padding: 1rem;
}

.campaign-info h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
}

.no-campaigns, .loading {
    text-align: center;
    padding: 3rem;
    font-size: 1.2rem;
    color: #777;
}
</style> 