<template>
    <footer class="gamer-footer text-white">
        <div class="max-w-[1200px] mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-lg font-bold mb-4 relative pb-3">
                        Sobre o TudoJogo
                        <span class="absolute bottom-0 left-0 w-10 h-1 bg-gradient-to-r from-[#6600cc] to-[#00ccff]"></span>
                    </h3>
                    <p class="text-gray-300 text-sm mb-8">
                        Portal especializado em notícias, reviews e conteúdo sobre o mundo dos games.
                        Trazendo as informações mais atualizadas do universo gamer.
                    </p>
                    <div class="flex space-x-3 flex-wrap gap-2">
                        <a v-if="settings && settings['blog.facebook']" :href="`https://facebook.com/${settings['blog.facebook']}`" target="_blank" class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a v-if="settings && settings['blog.twitter']" :href="`https://twitter.com/${settings['blog.twitter']}`" target="_blank" class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                        <a v-if="settings && settings['blog.instagram']" :href="`https://instagram.com/${settings['blog.instagram']}`" target="_blank" class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                            </svg>
                        </a>
                        <a v-if="settings && settings['blog.youtube']" :href="`https://youtube.com/${settings['blog.youtube']}`" target="_blank" class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110" aria-label="Youtube">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                        </a>
                        <a v-if="settings && settings['blog.whatsapp']" :href="`https://chat.whatsapp.com/${settings['blog.whatsapp']}`" target="_blank" class="bg-green-500 hover:bg-green-600 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors" aria-label="WhatsApp">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 448 512" fill="currentColor">
                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                            </svg>
                        </a>
                        <a v-if="settings && settings['blog.telegram']" :href="`https://t.me/${settings['blog.telegram']}`" target="_blank" class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110" aria-label="Telegram">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                        </a>
                        <a v-if="settings && settings['blog.discord']" :href="`https://discord.gg/${settings['blog.discord']}`" target="_blank" class="gamer-button w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110" aria-label="Discord">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <!-- Links Rápidos -->  
                <div>
                    <h3 class="text-lg font-bold mb-4 relative pb-3">
                        Links Rápidos
                        <span class="absolute bottom-0 left-0 w-10 h-1 bg-gradient-to-r from-[#6600cc] to-[#00ccff]"></span>
                    </h3>
                    <ul class="space-y-2">
                        <li><a href="/contact" class="text-gray-300 gamer-link">Contato</a></li>
                        <li><a href="/tags" class="text-gray-300 gamer-link">Todas as Tags</a></li>
                        <li><a href="/terms-of-service" class="text-gray-300 gamer-link">Termos de Uso</a></li>
                        <li><a href="/terms-of-privacy" class="text-gray-300 gamer-link">Política de Privacidade</a></li>
                    </ul>
                </div>
                
                <!-- Newsletter -->  
                <div>
                    <h3 class="text-lg font-bold mb-4 relative pb-3">
                        Newsletter
                        <span class="absolute bottom-0 left-0 w-10 h-1 bg-gradient-to-r from-[#6600cc] to-[#00ccff]"></span>
                    </h3>
                    <p class="text-gray-300 text-sm mb-4">
                        Receba as melhores notícias e artigos sobre games diretamente no seu email.
                    </p>
                    <form @submit.prevent="subscribeNewsletter" class="flex flex-col sm:flex-row gap-2">
                        <input
                            v-model="newsletterEmail"
                            type="email"
                            placeholder="Seu melhor email"
                            class="flex-grow px-3 py-2 rounded-md bg-[#2a2a52] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#ffcc00] transition"
                            required
                            :disabled="isSubscribing"
                        />
                        <button type="submit" class="bg-gradient-to-r from-[#6600cc] to-[#00ccff] hover:from-[#00ccff] hover:to-[#6600cc] text-white font-bold py-2 px-4 rounded-md transition-all transform hover:scale-105" :disabled="isSubscribing">
                            <span v-if="!isSubscribing">Inscrever-se</span>
                            <span v-else>Aguarde...</span>
                        </button>
                    </form>
                    <p v-if="newsletterMessage" class="mt-3 text-sm" :class="newsletterError ? 'text-red-400' : 'text-green-400'">
                        {{ newsletterMessage }}
                    </p>
                </div>
            </div>
            <div class="mt-12 pt-8 border-t gamer-footer-border text-center text-gray-400 text-sm">
                <p>&copy; {{ new Date().getFullYear() }} tudojogo.com.br. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSettingsStore } from '../../store/settings';

const settingsStore = useSettingsStore();
const settings = computed(() => settingsStore.getSettings);

const newsletterEmail = ref('');
const newsletterMessage = ref('');
const newsletterError = ref(false);
const isSubscribing = ref(false);

const subscribeNewsletter = async () => {
    if (!newsletterEmail.value) {
        newsletterMessage.value = 'Por favor, informe um e-mail válido.';
        newsletterError.value = true;
        return;
    }

    try {
        isSubscribing.value = true;
        newsletterMessage.value = '';
        newsletterError.value = false;

        const response = await fetch('/api/newsletter/subscribers/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: newsletterEmail.value, source: 'footer' })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            newsletterMessage.value = result.message || 'Inscrição realizada com sucesso!';
            newsletterEmail.value = '';
        } else {
            throw new Error(result.message || 'Falha na inscrição.');
        }
    } catch (error: any) {
        newsletterMessage.value = error.message;
        newsletterError.value = true;
    } finally {
        isSubscribing.value = false;
    }
};
</script>

<style scoped>
.gamer-footer {
    background-color: #0d0d2b;
    border-top: 3px solid #ffcc00;
}
.gamer-footer-border {
    border-color: rgba(255, 204, 0, 0.2);
}
.gamer-link {
    position: relative;
    transition: color 0.3s;
}
.gamer-link::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: #ffcc00;
    transition: width 0.3s;
}
.gamer-link:hover {
    color: #ffcc00;
}
.gamer-link:hover::before {
    width: 100%;
}
</style> 