<template>
    <div class="relative w-full h-full" v-cloak>
        <img
            v-if="src"
            ref="imageElement"
            :src="src"
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';

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

const imageElement = ref<HTMLImageElement | null>(null);

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

const emit = defineEmits<{
    load: [event: Event];
    error: [event: Event];
}>();

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

const resizeImage = async () => {
    if (typeof window === 'undefined' || !imageElement.value) return;

    try {
        const el = imageElement.value;

        if (!el.complete) {
            await new Promise((resolve, reject) => {
                el.onload = () => resolve(true);
                el.onerror = reject;
            });
        }

        let width: number;
        let height: number;

        const attrWidth = el.getAttribute('width');
        const attrHeight = el.getAttribute('height');

        if (attrWidth && attrHeight && !isNaN(parseInt(attrWidth, 10)) && !isNaN(parseInt(attrHeight, 10))) {
            width = parseInt(attrWidth, 10);
            height = parseInt(attrHeight, 10);
        } else {
            width = el.clientWidth * window.devicePixelRatio;
            height = el.clientHeight * window.devicePixelRatio;
        }

        if (width < 1 || height < 1) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = el.src;

        await new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
        });

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedBase64 = canvas.toDataURL('image/webp', 0.85);
        el.src = resizedBase64;
    } catch (e) {
        console.warn('Erro ao redimensionar imagem:', e);
    }
};


const onImageLoad = async (event: Event) => {
    emit('load', event);

    await nextTick();
    await resizeImage();
};

const onImageError = (event: Event) => {
    emit('error', event);
};
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
