<template>
  <!-- Não renderiza nada em ambiente de desenvolvimento ou para anúncios inContent -->
  <template v-if="!isDevelopment() && placement !== 'inContent'">
    <article v-if="adSettings.enableAds && adConfig.enabled" class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300 flex flex-col items-center justify-center min-h-[120px] post-card my-4">
      <div class="ad-container py-2 px-4 w-full flex items-center justify-center h-full">
        <div v-if="adHtml">
          <div v-html="adHtml" class="w-full flex items-center justify-center h-full"></div>
        </div>
        <div v-else class="ad-placeholder w-full h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-yellow-400 min-h-[90px]">
          <span>Anúncio - {{ placement }}</span>
        </div>
      </div>
    </article>
  </template>
  <!-- Mostra placeholder informativo em desenvolvimento, exceto para inContent -->
  <template v-else>
    <article v-if="adConfig.enabled && placement !== 'inContent'" class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300 flex flex-col items-center justify-center min-h-[120px] post-card my-4">
      <div class="ad-container py-2 px-4 w-full flex items-center justify-center h-full">
        <div class="ad-placeholder w-full h-full flex items-center justify-center text-yellow-400 text-sm border-2 border-dashed border-yellow-400 min-h-[90px]">
          <div class="text-center">
            <div class="text-xs mb-1">🚫 Anúncios Desabilitados</div>
            <div class="text-xs">(Desenvolvimento)</div>
          </div>
        </div>
      </div>
    </article>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAdManager } from '../composables/useAdManager.js';

const props = defineProps({
  placement: {
    type: String,
    required: true,
  },
});

const { adSettings, getAdHtml } = useAdManager();

// Helper function to check if we're in development environment
const isDevelopment = (): boolean => {
    if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('localhost');
    }
    return process.env.NODE_ENV === 'development';
};

const adPlacementMapping: Record<string, { key: string; height: string; width: string }> = {
  // Home page positions
  header: { key: 'homePageHeader', height: '70px', width: '728px' },
  inContent: { key: 'homePageInContent', height: '60px', width: '728px' },
  belowContent: { key: 'homePageAfterPosts', height: '70px', width: '728px' },
  sidebarTop: { key: 'homePageSidebarTop', height: '250px', width: '300px' },
  sidebarMid: { key: 'homePageSidebarMid', height: '250px', width: '300px' },
  sidebarBottom: { key: 'homePageSidebarBottom', height: '250px', width: '300px' },
  
  // Article page positions
  articleHeader: { key: 'articlePageHeader', height: '90px', width: '728px' },
  articleAfterTitle: { key: 'articlePageAfterTitle', height: '90px', width: '728px' },
  articleInContent: { key: 'articlePageInContent', height: '90px', width: '728px' },
  articleAfterContent: { key: 'articlePageAfterContent', height: '90px', width: '728px' },
  articleRelatedPosts: { key: 'articlePageRelatedPosts', height: '90px', width: '728px' },
  articleSidebarTop: { key: 'articlePageSidebarTop', height: '250px', width: '300px' },
  articleSidebarBottom: { key: 'articlePageSidebarBottom', height: '250px', width: '300px' },
};

const adConfig = computed(() => {
    const mapping = adPlacementMapping[props.placement];
    if (!mapping) {
        return { enabled: false, height: '0px', width: '0px' };
    }
    return {
        enabled: adSettings.value[mapping.key] || false,
        height: mapping.height,
        width: mapping.width,
    }
});

const adHtml = computed(() => getAdHtml(props.placement));

</script>

<style scoped>
.ad-placeholder {
  border-radius: 4px;
}
</style> 