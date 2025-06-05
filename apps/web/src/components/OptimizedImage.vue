<template>
    <div class="relative w-full h-full" v-cloak>
        <!-- Optimized Image -->
        <img
            v-if="src && isHydrated"
            ref="imageElement"
            :src="src"
            :srcset="computedSrcset"
            :sizes="sizes"
            :alt="alt || 'Image'"
            :class="imageClasses"
            :width="width"
            :height="height"
            :loading="loading"
            :fetchpriority="priority"
            :title="title"
            :aria-label="ariaLabel"
            @load="onImageLoad"
            @error="onImageError"
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

interface OptimizedImageProps {
    src?: string;
    srcset?: string;
    sizes?: string;
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
    autoSrcset?: boolean;
    srcsetSizes?: number[];
}

const isHydrated = ref(false);
const imageElement = ref<HTMLImageElement | null>(null);
const isLoaded = ref(false);

const props = withDefaults(defineProps<OptimizedImageProps>(), {
    loading: 'lazy',
    priority: 'auto',
    classes: '',
    fallbackClasses: '',
    iconSize: 'md',
    objectFit: 'cover',
    hover: false,
    transition: true,
    autoSrcset: true,
    srcsetSizes: () => [320, 640, 960, 1280, 2560],
    sizes: '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, (max-width: 1280px) 1280px, 2560px'
});

const emit = defineEmits<{
    load: [event: Event];
    error: [event: Event];
}>();

const generateCloudflareImageUrl = (originalUrl: string, width: number, fit: string = 'contain'): string => {
    // Check if it's already a Cloudflare Image URL
    if (originalUrl.includes('/cdn-cgi/image/')) {
        return originalUrl;
    }

    // Check if it's a relative path or absolute URL
    if (originalUrl.startsWith('/') || originalUrl.startsWith('http')) {
        return `/cdn-cgi/image/fit=${fit},width=${width}${originalUrl.startsWith('/') ? '' : '/'}${originalUrl}`;
    }

    return `/cdn-cgi/image/fit=${fit},width=${width}/${originalUrl}`;
};

const generateImgixUrl = (originalUrl: string, width: number): string => {
    // Check if URL already has imgix parameters
    if (originalUrl.includes('?')) {
        return `${originalUrl}&w=${width}&auto=format,compress&q=85`;
    }
    return `${originalUrl}?w=${width}&auto=format,compress&q=85`;
};

const generateSrcset = (src: string, sizes: number[]): string => {
    if (!src) return '';

    const fit = props.objectFit === 'contain' ? 'contain' : 'cover';

    return sizes.map(size => {
        let resizedUrl = '';

        // Detect URL type and generate appropriate srcset
        if (src.includes('imgix') || src.includes('?')) {
            // Imgix or URL with parameters
            resizedUrl = generateImgixUrl(src, size);
        } else {
            // Use Cloudflare Image Resizing
            resizedUrl = generateCloudflareImageUrl(src, size, fit);
        }

        return `${resizedUrl} ${size}w`;
    }).join(', ');
};

const computedSrcset = computed(() => {
    // Use custom srcset if provided
    if (props.srcset) {
        return props.srcset;
    }

    // Auto-generate srcset if enabled and src is available
    if (props.autoSrcset && props.src) {
        return generateSrcset(props.src, props.srcsetSizes);
    }

    return undefined;
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

const onImageLoad = (event: Event) => {
    if (isLoaded.value) return; // Prevent multiple executions

    isLoaded.value = true;
    emit('load', event);
};

const onImageError = (event: Event) => {
    emit('error', event);
};

onMounted(() => {
    isHydrated.value = true;
});

onUnmounted(() => {
    // Cleanup if needed
    isLoaded.value = false;
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
