<template>
    <div class="relative w-full h-full">
        <!-- Optimized Image -->
        <img
            v-dynamic-resize
            v-if="src && isHydrated"
            :src="src"
            :alt="alt || 'Image'"
            :class="imageClasses"
            :width="width"
            :height="height"
            :loading="loading"
            :fetchpriority="priority"
            :title="title"
            :aria-label="ariaLabel"
            @load="$emit('load', $event)"
            @error="$emit('error', $event)"
        />

        <!-- Fallback/Placeholder -->
        <div
            v-else
            :class="fallbackClasses"
            class="w-full h-full bg-gray-200 flex items-center justify-center"
        >
            <slot name="fallback">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    :class="fallbackIconSize"
                    class="text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, type Ref, onMounted } from 'vue';

// Props interface
interface OptimizedImageProps {
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    loading?: 'lazy' | 'eager';
    priority?: 'high' | 'low' | 'auto';
    title?: string;
    ariaLabel?: string;
    classes?: string;
    fallbackClasses?: string;
    iconSize?: 'sm' | 'md' | 'lg' | 'xl';
    objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    hover?: boolean;
    transition?: boolean;
}

const isHydrated = ref(false);

const props = withDefaults(defineProps<OptimizedImageProps>(), {
    loading: 'lazy',
    priority: 'auto',
    classes: '',
    fallbackClasses: '',
    iconSize: 'md',
    objectFit: 'cover',
    hover: false,
    transition: true
});

const imageClasses = computed(() => {
    const baseClasses = [
        'w-full h-full',
        `object-${props.objectFit}`,
        'imgix-lazy'
    ];

    if (props.transition) {
        baseClasses.push('transition-transform duration-300');
    }

    if (props.hover) {
        baseClasses.push('hover:scale-105');
    }

    if (props.classes) {
        baseClasses.push(props.classes);
    }

    return baseClasses.join(' ');
});

const fallbackIconSize = computed(() => {
    const sizeMap = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
        xl: 'h-20 w-20'
    };
    return sizeMap[props.iconSize];
});

onMounted(() => {
    isHydrated.value = true;
});
</script>

<style scoped>
/* Component-specific styles */
.imgix-lazy {
    transition: opacity 0.3s ease;
}

.imgix-lazy.imgix-loaded {
    opacity: 1;
}

.imgix-lazy.imgix-error {
    opacity: 0.5;
    filter: grayscale(100%);
}
</style>
