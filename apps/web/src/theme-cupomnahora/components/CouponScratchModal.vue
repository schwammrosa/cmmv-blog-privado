<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" :class="visible ? 'opacity-100' : 'opacity-0 pointer-events-none'">
        <div class="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md relative transform transition-all duration-300 ease-in-out" :class="visible ? 'scale-100' : 'scale-95'">
            <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors z-30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div v-if="coupon" class="text-center">
                <div class="w-24 h-24 mx-auto mb-4 flex items-center justify-center border border-gray-200 rounded-md p-2">
                    <img v-if="coupon.campaignLogo" :src="coupon.campaignLogo" :alt="coupon.campaignName" class="max-w-full max-h-full object-contain">
                    <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center rounded-sm text-gray-400 text-sm">Sem logo</div>
                </div>
                <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ coupon.campaignName }}</h2>
                <p class="text-gray-600 mb-1 text-sm">Raspe para revelar o cupom:</p>
                <p class="text-lg font-bold text-indigo-600 mb-4 h-12 flex items-center justify-center">{{ coupon.title }}</p>

                <div class="relative w-full max-w-xs mx-auto h-24 rounded-md mb-4 cursor-grab active:cursor-grabbing select-none group">
                    <canvas 
                        ref="scratchCanvas"
                        class="absolute inset-0 w-full h-full bg-gray-300 rounded-md z-20"
                        @mousedown="startScratch"
                        @touchstart="startScratch"
                        @mousemove="scratch"
                        @touchmove="scratch"
                        @mouseup="stopScratch"
                        @mouseleave="stopScratch"
                        @touchend="stopScratch">
                    </canvas>
                    
                    <div 
                        class="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 rounded-md border border-dashed border-gray-400 z-0"
                        :class="{ 'opacity-0 pointer-events-none': isScratching || isRevealed, 'opacity-100': !isScratching && !isRevealed }">
                        <span class="text-gray-500 text-sm transition-opacity duration-300">
                            Arraste para raspar
                        </span>
                    </div>

                    <div 
                        v-if="isScratching && !isRevealed"
                        class="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded z-30">
                        {{ currentScratchPercentage }}% raspado
                    </div>

                     <div 
                        v-if="coupon.code && isRevealed"
                        class="absolute inset-0 w-full h-full flex items-center justify-center text-2xl font-bold text-gray-800 tracking-widest pointer-events-none select-text z-30 bg-yellow-300">
                        {{ coupon.code }}
                    </div>
                </div>

                <button 
                    @click="copyCode"
                    :disabled="!isRevealed || !coupon.code"
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                    {{ copyButtonText }}
                </button>
                <p v-if="showRevealHint && !isRevealed" class="text-xs text-gray-500 mt-2">Raspe ao menos 70% para ativar o botão de copiar.</p>
                <p v-if="coupon.linkRef" class="mt-4 text-sm">
                    <a :href="coupon.linkRef" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-700 hover:underline">Ir para a loja &rarr;</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
    visible: Boolean,
    coupon: Object as () => any | null
});

const emit = defineEmits(['close']);

const scratchCanvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref(false);
const isRevealed = ref(false);
const showRevealHint = ref(false);
const isScratching = ref(false);
const copyButtonText = ref('Copiar Código');
const SCRATCH_THRESHOLD = 0.7; // 70%
const currentScratchPercentage = ref(0); // Nova variável para armazenar a porcentagem atual

const initCanvas = () => {
    if (!scratchCanvas.value || !props.coupon || !props.coupon.code) {
        return;
    }
    
    const canvas = scratchCanvas.value;
    const canvasCtx = canvas.getContext('2d', { willReadFrequently: true });
    if (!canvasCtx) {
        return;
    }
    ctx.value = canvasCtx;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.value.fillStyle = '#cccccc';
    ctx.value.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.value.globalCompositeOperation = 'destination-out';
    isRevealed.value = false;
    showRevealHint.value = false;
    isScratching.value = false;
    copyButtonText.value = 'Copiar Código';
};

const getScratchPosition = (event: MouseEvent | TouchEvent) => {
    if (!scratchCanvas.value) return null;
    const rect = scratchCanvas.value.getBoundingClientRect();
    let x, y;
    if (event instanceof MouseEvent) {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    } else if (event.touches && event.touches[0]) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    } else {
        return null;
    }
    return { x, y };
};

const startScratch = (event: MouseEvent | TouchEvent) => {
    if (!ctx.value || isRevealed.value) return;
    if (event.cancelable) {
        event.preventDefault();
    }
    isDrawing.value = true;
    isScratching.value = true; 
    showRevealHint.value = true; 
    const pos = getScratchPosition(event);
    if (pos) {
        ctx.value.beginPath();
        ctx.value.moveTo(pos.x, pos.y);
    }
};

const scratch = (event: MouseEvent | TouchEvent) => {
    if (!isDrawing.value || !ctx.value || isRevealed.value) return;
    if (event.cancelable) {
        event.preventDefault();
    }
    const pos = getScratchPosition(event);
    if (pos) {
        ctx.value.lineWidth = 20; 
        ctx.value.lineCap = 'round';
        ctx.value.lineJoin = 'round';
        ctx.value.lineTo(pos.x, pos.y);
        ctx.value.stroke();
    }
};

const stopScratch = (event: Event) => {
    if (!isDrawing.value || isRevealed.value) {
        return;
    }
    isDrawing.value = false;
    if (ctx.value) {
         ctx.value.closePath(); 
    }
    checkRevealPercentage();
};

const checkRevealPercentage = () => {
    if (!ctx.value || !scratchCanvas.value || isRevealed.value) return;

    const canvas = scratchCanvas.value;
    const currentCtx = canvas.getContext('2d', { willReadFrequently: true });
    if (!currentCtx) {
        return;
    }

    const imageData = currentCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
            transparentPixels++;
        }
    }

    const totalPixels = canvas.width * canvas.height;
    const revealedPercentage = transparentPixels / totalPixels;
    
    currentScratchPercentage.value = Math.round(revealedPercentage * 100);

    if (revealedPercentage >= SCRATCH_THRESHOLD) {
        revealFullCode();
    }
};

const revealFullCode = () => {
    if (scratchCanvas.value && !isRevealed.value) {
        const canvas = scratchCanvas.value;
        const currentCtx = canvas.getContext('2d');
        if (currentCtx) {
            currentCtx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    isRevealed.value = true;
    copyButtonText.value = 'Copiar Código';
};

const closeModal = () => {
    emit('close');
};

const copyCode = async () => {
    if (!props.coupon || !props.coupon.code || !isRevealed.value) return;
    try {
        await navigator.clipboard.writeText(props.coupon.code);
        copyButtonText.value = 'Copiado!';
        setTimeout(() => {
            copyButtonText.value = 'Copiar Código';
        }, 2000);
    } catch (err) {
        console.error('Falha ao copiar o código: ', err);
        copyButtonText.value = 'Falhou!';
         setTimeout(() => {
            copyButtonText.value = 'Copiar Código';
        }, 2000);
    }
};

watch(() => props.visible, (newVal) => {
    if (newVal && props.coupon && props.coupon.code) {
        nextTick(() => { 
             setTimeout(() => {
                initCanvas();
            }, 100); 
        });
    } else if (!newVal) {
        if (ctx.value && scratchCanvas.value) {
             ctx.value.clearRect(0, 0, scratchCanvas.value.width, scratchCanvas.value.height);
        }
        isRevealed.value = false;
        showRevealHint.value = false;
        isScratching.value = false;
        isDrawing.value = false;
        currentScratchPercentage.value = 0;
        copyButtonText.value = 'Copiar Código';
    }
});

watch(() => props.coupon, (newCoupon) => {
    if (props.visible && newCoupon && newCoupon.code) {
        nextTick(() => {
            setTimeout(() => {
                initCanvas();
            }, 100);
        });
    }
}, { deep: true });

onMounted(() => {
    if (props.visible && props.coupon && props.coupon.code) {
       nextTick(() => {
            setTimeout(() => {
                initCanvas();
            }, 100);
       });
    }
});

</script>

<style scoped>
/* Adicionando um pouco de estilo para o cursor e feedback visual */
.cursor-grab {
    cursor: grab;
}
.active\:cursor-grabbing:active { /* Assegura que o estilo active seja aplicado */
    cursor: grabbing;
}

/* Para evitar seleção de texto acidental no código do cupom enquanto raspa */
.select-none {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.select-text {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}
</style> 