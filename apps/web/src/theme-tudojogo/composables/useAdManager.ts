import { computed } from 'vue';
import { useSettingsStore } from '../../store/settings.js';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

// Helper function to handle boolean settings (could be 1, true, etc)
const isTruthy = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        return value === '1' || value.toLowerCase() === 'true';
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    return false;
};

// Helper function to check if we're in development environment
const isDevelopment = (): boolean => {
    if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('localhost');
    }
    return process.env.NODE_ENV === 'development';
};

// Error handler for vignette/interstitial API errors
const setupErrorHandling = () => {
    if (typeof window !== 'undefined') {
        // Override console.error to filter out vignette errors
        const originalConsoleError = console.error;
        console.error = (...args) => {
            const errorMessage = args.join(' ');
            if (errorMessage.includes('vignette: no interstitial API') || 
                errorMessage.includes('express_html_inpage_rendering_lib')) {
                // Suppress this specific error
                return;
            }
            originalConsoleError.apply(console, args);
        };

        // Add global error handler for uncaught errors
        window.addEventListener('error', (event) => {
            if (event.error && event.error.message && 
                (event.error.message.includes('vignette: no interstitial API') ||
                 event.error.message.includes('express_html_inpage_rendering_lib'))) {
                event.preventDefault();
                return false;
            }
        });

        // Add unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.message && 
                (event.reason.message.includes('vignette: no interstitial API') ||
                 event.reason.message.includes('express_html_inpage_rendering_lib'))) {
                event.preventDefault();
                return false;
            }
        });
    }
};

export function useAdManager() {
    const settingsStore = useSettingsStore();
    const settings = computed(() => settingsStore.getSettings || {});

    // Setup error handling when the composable is first used
    setupErrorHandling();

    const adSettings = computed(() => {
        const rawSettings = settings.value;
        const isDev = isDevelopment();
        
        const result = {
            enableAds: isTruthy(rawSettings['blog.enableAds']), // Permite anúncios em desenvolvimento
            showAdsLoggedIn: isTruthy(rawSettings['blog.showAdsLoggedIn']),
            
            // Home page ad positions
            homePageHeader: rawSettings['blog.homePageHeader'] === undefined ? true : isTruthy(rawSettings['blog.homePageHeader']),
            homePageSidebarTop: rawSettings['blog.homePageSidebarTop'] === undefined ? true : isTruthy(rawSettings['blog.homePageSidebarTop']),
            homePageSidebarMid: rawSettings['blog.homePageSidebarMid'] === undefined ? true : isTruthy(rawSettings['blog.homePageSidebarMid']),
            homePageSidebarBottom: rawSettings['blog.homePageSidebarBottom'] === undefined ? true : isTruthy(rawSettings['blog.homePageSidebarBottom']),
            homePageInContent: rawSettings['blog.homePageInContent'] === undefined ? true : isTruthy(rawSettings['blog.homePageInContent']),
            homePageAfterPosts: rawSettings['blog.homePageAfterPosts'] === undefined ? true : isTruthy(rawSettings['blog.homePageAfterPosts']),
            homePageFooter: rawSettings['blog.homePageFooter'] === undefined ? false : isTruthy(rawSettings['blog.homePageFooter']),
            
            // Article page ad positions
            articlePageHeader: rawSettings['blog.articlePageHeader'] === undefined ? true : isTruthy(rawSettings['blog.articlePageHeader']),
            articlePageSidebarTop: rawSettings['blog.articlePageSidebarTop'] === undefined ? true : isTruthy(rawSettings['blog.articlePageSidebarTop']),
            articlePageSidebarBottom: rawSettings['blog.articlePageSidebarBottom'] === undefined ? true : isTruthy(rawSettings['blog.articlePageSidebarBottom']),
            articlePageAfterTitle: rawSettings['blog.articlePageAfterTitle'] === undefined ? true : isTruthy(rawSettings['blog.articlePageAfterTitle']),
            articlePageInContent: rawSettings['blog.articlePageInContent'] === undefined ? true : isTruthy(rawSettings['blog.articlePageInContent']),
            articlePageAfterContent: rawSettings['blog.articlePageAfterContent'] === undefined ? true : isTruthy(rawSettings['blog.articlePageAfterContent']),
            articlePageRelatedPosts: rawSettings['blog.articlePageRelatedPosts'] === undefined ? true : isTruthy(rawSettings['blog.articlePageRelatedPosts']),
            articlePageFooter: rawSettings['blog.articlePageFooter'] === undefined ? false : isTruthy(rawSettings['blog.articlePageFooter']),
            
            // AdSense settings
            enableAdSense: isDev ? false : isTruthy(rawSettings['blog.enableAdSense']), // Desabilita AdSense em desenvolvimento
            adSensePublisherId: rawSettings['blog.adSensePublisherId'] || '',
            adSenseAutoAdsCode: rawSettings['blog.adSenseAutoAdsCode'] || '',
            enableAdSenseAutoAds: isDev ? false : isTruthy(rawSettings['blog.enableAdSenseAutoAds']), // Desabilita Auto Ads em desenvolvimento
            adSenseHeaderBanner: rawSettings['blog.adSenseHeaderBanner'] || '',
            adSenseSidebarTop: rawSettings['blog.adSenseSidebarTop'] || '',
            adSenseSidebarMid: rawSettings['blog.adSenseSidebarMid'] || '',
            adSenseSidebarBottom: rawSettings['blog.adSenseSidebarBottom'] || '',
            adSenseSidebarLeft: rawSettings['blog.adSenseSidebarLeft'] || '',
            adSenseAfterCover: rawSettings['blog.adSenseAfterCover'] || '',
            adSenseAfterTitle: rawSettings['blog.adSenseAfterTitle'] || '',
            adSenseInArticle: rawSettings['blog.adSenseInArticle'] || '',
            adSenseInContent: rawSettings['blog.adSenseInContent'] || '',
            adSenseBelowContent: rawSettings['blog.adSenseBelowContent'] || '',
            adSenseRelatedPosts: rawSettings['blog.adSenseRelatedPosts'] || '',
            
            // Custom Ads
            enableCustomAds: isTruthy(rawSettings['blog.enableCustomAds']),
            customHeaderBanner: rawSettings['blog.customHeaderBanner'] || '',
            customSidebarTop: rawSettings['blog.customSidebarTop'] || '',
            customSidebarBottom: rawSettings['blog.customSidebarBottom'] || '',
            customInArticle: rawSettings['blog.customInArticle'] || '',
            customInContent: rawSettings['blog.customInContent'] || '',
            customBelowContent: rawSettings['blog.customBelowContent'] || '',
            customRelatedPosts: rawSettings['blog.customRelatedPosts'] || '',
            
            // Amazon Affiliate
            enableAmazonAds: isTruthy(rawSettings['blog.enableAmazonAds']),
            amazonAssociateId: rawSettings['blog.amazonAssociateId'] || '',
            amazonSidebarAd: rawSettings['blog.amazonSidebarAd'] || '',
            amazonInContentAd: rawSettings['blog.amazonInContentAd'] || '',
            amazonBelowContentAd: rawSettings['blog.amazonBelowContentAd'] || '',
            amazonRelatedPostsAd: rawSettings['blog.amazonRelatedPostsAd'] || '',
            
            // Taboola Ads
            enableTaboolaAds: isTruthy(rawSettings['blog.enableTaboolaAds']),
            taboolaPublisherId: rawSettings['blog.taboolaPublisherId'] || '',
            taboolaBelowArticle: rawSettings['blog.taboolaBelowArticle'] || '',
            taboolaRightRail: rawSettings['blog.taboolaRightRail'] || '',
            taboolaFooter: rawSettings['blog.taboolaFooter'] || '',
            taboolaJsCode: rawSettings['blog.taboolaJsCode'] || '',
        };

        return result;
    });

    const getAdHtml = (position: string) => {
        if (!adSettings.value.enableAds) {
            return '';
        }

        // Check if position is enabled for the current page type
        // Try both home page and article page configurations
        const homePageKey = `homePage${position.charAt(0).toUpperCase() + position.slice(1)}`;
        const articlePageKey = `articlePage${position.charAt(0).toUpperCase() + position.slice(1)}`;
        
        // Check if the position is enabled for either page type
        const isHomePageEnabled = adSettings.value[homePageKey] !== false; // Default to true if undefined
        const isArticlePageEnabled = adSettings.value[articlePageKey] !== false; // Default to true if undefined
        
        // If both are explicitly disabled, return empty
        if (adSettings.value[homePageKey] === false && adSettings.value[articlePageKey] === false) {
            return '';
        }

        const providers = [
            {
                enabled: adSettings.value.enableAdSense,
                prefix: 'adSense',
                map: {
                    header: 'HeaderBanner',
                    afterTitle: 'AfterTitle',
                    sidebarTop: 'SidebarTop',
                    sidebarMid: 'SidebarMid',
                    sidebarBottom: 'SidebarBottom',
                    sidebarLeft: 'SidebarLeft',
                    inContent: 'InContent',
                    belowContent: 'BelowContent',
                    relatedPosts: 'RelatedPosts',
                }
            },
            {
                enabled: adSettings.value.enableCustomAds,
                prefix: 'custom',
                map: {
                    header: 'HeaderBanner',
                    sidebarTop: 'SidebarTop',
                    sidebarBottom: 'SidebarBottom',
                    inContent: 'InContent',
                    belowContent: 'BelowContent',
                    relatedPosts: 'RelatedPosts',
                }
            },
            {
                enabled: adSettings.value.enableAmazonAds,
                prefix: 'amazon',
                map: {
                    sidebarTop: 'SidebarAd',
                    inContent: 'InContentAd',
                    belowContent: 'BelowContentAd',
                    relatedPosts: 'RelatedPostsAd',
                }
            },
            {
                enabled: adSettings.value.enableTaboolaAds,
                prefix: 'taboola',
                map: {
                    belowContent: 'BelowArticle',
                    sidebarTop: 'RightRail',
                    footer: 'Footer',
                }
            }
        ];

        for (const provider of providers) {
            if (provider.enabled) {
                const settingKey = provider.map[position];
                if (settingKey) {
                    const fullSettingKey = `${provider.prefix}${settingKey}`;
                    if (adSettings.value[fullSettingKey]) {
                        return adSettings.value[fullSettingKey];
                    }
                }
            }
        }

        return '';
    };

    const loadAdScripts = () => {
        if (adSettings.value.enableAds) {
            // Load AdSense Auto Ads
            if (adSettings.value.enableAdSense && adSettings.value.enableAdSenseAutoAds && adSettings.value.adSenseAutoAdsCode) {
                const existingScript = document.getElementById('adsense-script');
                if (!existingScript) {
                    try {
                        const srcRegex = /src="([^"]+)"/;
                        const match = adSettings.value.adSenseAutoAdsCode.match(srcRegex);

                        if (match && match[1]) {
                            const scriptSrc = match[1];
                            const head = document.head;
                            const script = document.createElement('script');
                            script.id = 'adsense-script';
                            script.async = true;
                            script.src = scriptSrc;
                            script.crossOrigin = "anonymous";
                            
                            // Add error handling for script loading
                            script.onerror = (event) => {
                                console.warn('AdSense script failed to load, but continuing...');
                            };
                            
                            head.appendChild(script);
                        }
                    } catch (e) {
                        console.warn("Error loading AdSense auto-ads script:", e);
                    }
                }
            }

            // Load AdSense manual ads
            if (adSettings.value.enableAdSense && window.adsbygoogle) {
                setTimeout(() => {
                    try {
                        document.querySelectorAll('.adsbygoogle').forEach((ad) => {
                            if (!ad.hasAttribute('data-adsbygoogle-status')) {
                                (window.adsbygoogle = window.adsbygoogle || []).push({});
                            }
                        });
                    } catch (e) {
                        console.warn("Error loading AdSense manual ads:", e);
                    }
                }, 300);
            }

            // Load Taboola JS code
            if (adSettings.value.enableTaboolaAds && adSettings.value.taboolaJsCode) {
                try {
                    const existingTaboolaScript = document.getElementById('taboola-script');
                    if (!existingTaboolaScript) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = adSettings.value.taboolaJsCode;
                        const scriptElement = tempDiv.querySelector('script');
                        if (scriptElement) {
                            scriptElement.id = 'taboola-script';
                            
                            // Add error handling for Taboola script
                            scriptElement.onerror = (event) => {
                                console.warn('Taboola script failed to load, but continuing...');
                            };
                            
                            document.head.appendChild(scriptElement);
                        }
                    }
                } catch (e) {
                    console.warn("Error loading Taboola script:", e);
                }
            }
        }
    };

    return { adSettings, getAdHtml, loadAdScripts, settings };
} 