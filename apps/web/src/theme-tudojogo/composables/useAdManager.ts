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

export function useAdManager() {
    const settingsStore = useSettingsStore();
    const settings = computed(() => settingsStore.getSettings || {});

    const adSettings = computed(() => {
        const rawSettings = settings.value;
        const result = {
            enableAds: isTruthy(rawSettings['blog.enableAds']),
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
            articlePageAfterTitle: isTruthy(rawSettings['blog.articlePageAfterTitle']),
            articlePageInContent: rawSettings['blog.articlePageInContent'] === undefined ? true : isTruthy(rawSettings['blog.articlePageInContent']),
            articlePageAfterContent: rawSettings['blog.articlePageAfterContent'] === undefined ? true : isTruthy(rawSettings['blog.articlePageAfterContent']),
            articlePageFooter: isTruthy(rawSettings['blog.articlePageFooter']),
            
            // AdSense settings
            enableAdSense: isTruthy(rawSettings['blog.enableAdSense']),
            adSensePublisherId: rawSettings['blog.adSensePublisherId'] || '',
            adSenseAutoAdsCode: rawSettings['blog.adSenseAutoAdsCode'] || '',
            enableAdSenseAutoAds: isTruthy(rawSettings['blog.enableAdSenseAutoAds']),
            adSenseHeaderBanner: rawSettings['blog.adSenseHeaderBanner'] || '',
            adSenseSidebarTop: rawSettings['blog.adSenseSidebarTop'] || '',
            adSenseSidebarMid: rawSettings['blog.adSenseSidebarMid'] || '',
            adSenseSidebarBottom: rawSettings['blog.adSenseSidebarBottom'] || '',
            adSenseSidebarLeft: rawSettings['blog.adSenseSidebarLeft'] || '',
            adSenseAfterCover: rawSettings['blog.adSenseAfterCover'] || '',
            adSenseAfterTitle: rawSettings['blog.adSenseAfterTitle'] || '',
            adSenseInArticle: rawSettings['blog.adSenseInArticle'] || '',
            adSenseBelowContent: rawSettings['blog.adSenseBelowContent'] || '',
            
            // Custom Ads
            enableCustomAds: isTruthy(rawSettings['blog.enableCustomAds']),
            customHeaderBanner: rawSettings['blog.customHeaderBanner'] || '',
            customSidebarTop: rawSettings['blog.customSidebarTop'] || '',
            customSidebarBottom: rawSettings['blog.customSidebarBottom'] || '',
            customInArticle: rawSettings['blog.customInArticle'] || '',
            customBelowContent: rawSettings['blog.customBelowContent'] || '',
            
            // Amazon Affiliate
            enableAmazonAds: isTruthy(rawSettings['blog.enableAmazonAds']),
            amazonAssociateId: rawSettings['blog.amazonAssociateId'] || '',
            amazonSidebarAd: rawSettings['blog.amazonSidebarAd'] || '',
            amazonInContentAd: rawSettings['blog.amazonInContentAd'] || '',
            amazonBelowContentAd: rawSettings['blog.amazonBelowContentAd'] || '',
            
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
        if (!adSettings.value.enableAds) return '';

        // Check if position is enabled for the current page type
        const positionKey = `homePage${position.charAt(0).toUpperCase() + position.slice(1)}`;
        if (adSettings.value[positionKey] === false) {
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
                    inContent: 'InArticle',
                    belowContent: 'BelowContent',
                }
            },
            {
                enabled: adSettings.value.enableCustomAds,
                prefix: 'custom',
                map: {
                    header: 'HeaderBanner',
                    sidebarTop: 'SidebarTop',
                    sidebarBottom: 'SidebarBottom',
                    inContent: 'InArticle',
                    belowContent: 'BelowContent',
                }
            },
            {
                enabled: adSettings.value.enableAmazonAds,
                prefix: 'amazon',
                map: {
                    sidebarTop: 'SidebarAd',
                    inContent: 'InContentAd',
                    belowContent: 'BelowContentAd',
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
                            head.appendChild(script);
                        }
                    } catch (e) {
                        console.error("Error loading AdSense auto-ads script:", e);
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
                        console.error("Error loading AdSense manual ads:", e);
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
                            document.head.appendChild(scriptElement);
                        }
                    }
                } catch (e) {
                    console.error("Error loading Taboola script:", e);
                }
            }
        }
    };

    return { adSettings, getAdHtml, loadAdScripts, settings };
} 