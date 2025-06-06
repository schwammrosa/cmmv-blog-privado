import { defineStore } from 'pinia'

interface SettingsState {
  data: Record<string, any> | null;
}

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => ({
        data: null,
    }),
    actions: {
        setSettings(data: any) {
            this.data = data
        },
    },
    getters: {
        getSettings: (state): any => state.data,
        getSetting: (state) => (key: string, defaultValue: any) => state.data?.[key] || defaultValue,

        searchMetaTags: (state) => {
            const getSetting = (key: string, defaultValue: any = null) =>
                state.data?.[`blog.${key}`] || defaultValue;

            const metaTags: Array<{ name: string; content: string }> = [];

            // Google Site Verification
            const googleVerification = getSetting('googleSiteVerification');
            if (googleVerification) {
                metaTags.push({
                    name: 'google-site-verification',
                    content: googleVerification
                });
            }

            // Bing Site Verification
            const bingVerification = getSetting('bingSiteVerification');
            if (bingVerification) {
                metaTags.push({
                    name: 'msvalidate.01',
                    content: bingVerification
                });
            }

            // Yandex Site Verification
            const yandexVerification = getSetting('yandexSiteVerification');
            if (yandexVerification) {
                metaTags.push({
                    name: 'yandex-verification',
                    content: yandexVerification
                });
            }

            // Baidu Site Verification
            const baiduVerification = getSetting('baiduSiteVerification');
            if (baiduVerification) {
                metaTags.push({
                    name: 'baidu-site-verification',
                    content: baiduVerification
                });
            }

            return metaTags;
        },

        additionalMetaTags: (state) => {
            const customMetaTags = state.data?.['blog.additionalMetaTags'];
            if (!customMetaTags) return [];

            try {
                if (typeof window === 'undefined') return [];

                const parser = new DOMParser();
                const doc = parser.parseFromString(`<div>${customMetaTags}</div>`, 'text/html');
                const metaTags = doc.querySelectorAll('meta');

                return Array.from(metaTags).map(tag => {
                    const attributes: Record<string, string> = {};
                    Array.from(tag.attributes).forEach(attr => {
                        attributes[attr.name] = attr.value;
                    });
                    return attributes;
                });
            } catch (e) {
                console.error('Error parsing custom meta tags:', e);
                return [];
            }
        },

        allMetaTags(state): any[] {
            const searchMetaTags = this.searchMetaTags;
            const additionalMetaTags = this.additionalMetaTags;

            const getSetting = (key: string, defaultValue: any = null) =>
                state.data?.[`blog.${key}`] || defaultValue;

            const baseTags = [
                { name: 'description', content: getSetting('metaDescription', '') },
                { name: 'keywords', content: getSetting('metaKeywords', '') },
            ];

            return [...baseTags, ...searchMetaTags, ...additionalMetaTags];
        },

        googleAnalyticsScripts: (state) => {
            const gaId = state.data?.['blog.googleAnalyticsId'];
            if (!gaId) return [];

            // Implementação otimizada para carregar o Google Tag Manager sob demanda
            // Reduzindo o impacto inicial na performance com carregamento diferido
            return [
                {
                    children: `
                        // Carregamento diferido do Google Tag Manager
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}

                        // Configuração inicial
                        gtag('js', new Date());
                        gtag('config', '${gaId}', { 'send_page_view': false });
                        
                        // Função para carregar o script GTM apenas quando o usuário interage com a página
                        function loadGtm() {
                            // Verificar se o script já foi carregado
                            if (window.gtmLoaded) return;
                            window.gtmLoaded = true;
                            
                            // Carregar o script GTM de forma assíncrona
                            const script = document.createElement('script');
                            script.src = 'https://www.googletagmanager.com/gtag/js?id=${gaId}';
                            script.async = true;
                            script.defer = true;
                            document.head.appendChild(script);
                            
                            // Enviar pageview após o carregamento
                            script.onload = function() {
                                gtag('event', 'page_view');
                            };
                        }
                        
                        // Adicionar eventos para detectar interação do usuário
                        if (document.readyState === 'complete') {
                            setTimeout(loadGtm, 3000); // Carregar após 3 segundos se a página já estiver carregada
                        } else {
                            window.addEventListener('load', () => {
                                setTimeout(loadGtm, 3000); // Carregar após 3 segundos depois que a página carregou
                            });
                        }
                        
                        // Eventos de interação que acionam o carregamento imediato
                        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
                            document.addEventListener(event, loadGtm, { once: true, passive: true });
                        });
                    `,
                    type: 'text/javascript'
                }
            ];
        },

        faviconUrl: (state) => {
            return state.data?.['blog.favicon'] || '/src/theme-default/favicon.ico';
        }
    },
})
