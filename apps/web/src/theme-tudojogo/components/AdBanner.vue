<template>
  <div v-if="adSettings.enableAds && adConfig.enabled" class="w-full bg-[#0a0a1a] rounded-lg my-4 overflow-hidden flex justify-center">
    <div class="ad-container py-2 px-4" v-if="adHtml">
      <div v-html="adHtml"></div>
    </div>
    <div class="ad-container py-2 px-4" v-else>
      <div 
        class="ad-placeholder bg-[#0a0a1a] flex items-center justify-center text-gray-400 text-sm"
        :style="{ height: adConfig.height, width: adConfig.width }"
      >
        <span>Anúncio - {{ placement }}</span>
      </div>
    </div>
  </div>
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
  border: 1px dashed #ccc;
  border-radius: 4px;
}
</style> 