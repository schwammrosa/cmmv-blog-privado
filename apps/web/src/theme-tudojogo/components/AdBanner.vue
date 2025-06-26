<template>
  <div v-if="adSettings.enableAds && adConfig.enabled" class="w-full bg-gray-100 rounded-lg my-4 overflow-hidden flex justify-center">
    <div class="ad-container py-2 px-4" v-if="adHtml">
      <div v-html="adHtml"></div>
    </div>
    <div class="ad-container py-2 px-4" v-else>
      <div 
        class="ad-placeholder bg-gray-200 flex items-center justify-center text-gray-400 text-sm"
        :style="{ height: adConfig.height, width: adConfig.width }"
      >
        <span>Anúncio</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useAds } from '../../composables/useAds.js';

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
  placement: {
    type: String,
    required: true,
  },
});

const { settings, placement } = toRefs(props);

const { adSettings, getAdHtml } = useAds(settings, 'home');

const adPlacementMapping: Record<string, { key: string; height: string; width: string }> = {
  header: { key: 'homePageHeader', height: '90px', width: '728px' },
  inContent: { key: 'homePageInContent', height: '90px', width: '728px' },
  belowContent: { key: 'homePageAfterPosts', height: '90px', width: '728px' },
  sidebarTop: { key: 'homePageSidebarTop', height: '250px', width: '300px' },
  sidebarMid: { key: 'homePageSidebarMid', height: '250px', width: '300px' },
  sidebarBottom: { key: 'homePageSidebarBottom', height: '250px', width: '300px' },
};

const adConfig = computed(() => {
    const mapping = adPlacementMapping[placement.value];
    if (!mapping) {
        return { enabled: false, height: '0px', width: '0px' };
    }
    return {
        enabled: adSettings.value[mapping.key] || false,
        height: mapping.height,
        width: mapping.width,
    }
});

const adHtml = computed(() => getAdHtml(placement.value));

</script>

<style scoped>
.ad-placeholder {
  border: 1px dashed #ccc;
  border-radius: 4px;
}
</style> 