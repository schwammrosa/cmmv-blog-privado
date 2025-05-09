import { computed } from 'vue';

// Declare adsbygoogle for TypeScript
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
    return false;
};

export const useAds = (settings: any, page = 'generic') => {
    const adSettings = computed(() => {
        const rawSettings = settings || {};

        const result: Record<string, any> = {
            // Convert potential string values to proper booleans
            enableAds: rawSettings['enableAds'],
            showAdsLoggedIn: isTruthy(rawSettings['showAdsLoggedIn']),

            // Default ad position settings by page type
            [`${page}PageHeader`]: true,
            [`${page}PageSidebarTop`]: true,
            [`${page}PageSidebarMid`]: true,
            [`${page}PageSidebarBottom`]: true,
            [`${page}PageInContent`]: true,
            [`${page}PageAfterContent`]: true,
            [`${page}PageAfterTitle`]: true,
            [`${page}PageAfterCover`]: true,

            // AdSense settings
            enableAdSense: rawSettings['enableAdSense'],
            adSensePublisherId: rawSettings['adSensePublisherId'] || '',
            adSenseAutoAdsCode: rawSettings['adSenseAutoAdsCode'] || '',
            enableAdSenseAutoAds: rawSettings['enableAdSenseAutoAds'],
            adSenseHeaderBanner: rawSettings['adSenseHeaderBanner'] || '',
            adSenseSidebarTop: rawSettings['adSenseSidebarTop'] || '',
            adSenseSidebarMid: rawSettings['adSenseSidebarMid'] || '',
            adSenseSidebarBottom: rawSettings['adSenseSidebarBottom'] || '',
            adSenseSidebarLeft: rawSettings['adSenseSidebarLeft'] || '',
            adSenseAfterCover: rawSettings['adSenseAfterCover'] || '',
            adSenseAfterTitle: rawSettings['adSenseAfterTitle'] || '',
            adSenseInArticle: rawSettings['adSenseInArticle'] || '',
            adSenseBelowContent: rawSettings['adSenseBelowContent'] || '',

            // Custom Ads
            enableCustomAds: rawSettings['enableCustomAds'],
            customHeaderBanner: rawSettings['customHeaderBanner'] || '',
            customSidebarTop: rawSettings['customSidebarTop'] || '',
            customSidebarBottom: rawSettings['customSidebarBottom'] || '',
            customInArticle: rawSettings['customInArticle'] || '',
            customBelowContent: rawSettings['customBelowContent'] || '',
            customAfterTitle: rawSettings['customAfterTitle'] || '',
            customAfterCover: rawSettings['customAfterCover'] || '',

            // Amazon Affiliate
            enableAmazonAds: rawSettings['enableAmazonAds'],
            amazonAssociateId: rawSettings['amazonAssociateId'] || '',
            amazonSidebarAd: rawSettings['amazonSidebarAd'] || '',
            amazonInContentAd: rawSettings['amazonInContentAd'] || '',
            amazonBelowContentAd: rawSettings['amazonBelowContentAd'] || '',

            // Taboola Ads
            enableTaboolaAds: rawSettings['enableTaboolaAds'],
            taboolaPublisherId: rawSettings['taboolaPublisherId'] || '',
            taboolaBelowArticle: rawSettings['taboolaBelowArticle'] || '',
            taboolaRightRail: rawSettings['taboolaRightRail'] || '',
            taboolaFooter: rawSettings['taboolaFooter'] || '',
            taboolaJsCode: rawSettings['taboolaJsCode'] || '',
        };

        return result;
    });

    // Helper to get appropriate ad HTML based on position
    const getAdHtml = (position: string): string => {
        if (!adSettings.value.enableAds) return '';

        // Check if position is enabled
        const positionSetting = `${page}Page${position.charAt(0).toUpperCase() + position.slice(1)}`;
        if (positionSetting in adSettings.value && !adSettings.value[positionSetting]) {
            return '';
        }

        if (adSettings.value.enableAdSense) {
            // Map position to the correct AdSense setting key
            let adSenseSetting = '';
            switch (position) {
                case 'header':
                    adSenseSetting = 'adSenseHeaderBanner';
                    break;
                case 'sidebarTop':
                    adSenseSetting = 'adSenseSidebarTop';
                    break;
                case 'sidebarMid':
                    adSenseSetting = 'adSenseSidebarMid';
                    break;
                case 'sidebarBottom':
                    adSenseSetting = 'adSenseSidebarBottom';
                    break;
                case 'sidebarLeft':
                    adSenseSetting = 'adSenseSidebarLeft';
                    break;
                case 'inContent':
                    adSenseSetting = 'adSenseInArticle';
                    break;
                case 'belowContent':
                    adSenseSetting = 'adSenseBelowContent';
                    break;
                case 'afterTitle':
                    adSenseSetting = 'adSenseAfterTitle';
                    break;
                case 'afterCover':
                    adSenseSetting = 'adSenseAfterCover';
                    break;
                default:
                    return '';
            }

            if (adSenseSetting in adSettings.value && adSettings.value[adSenseSetting]) {
                return adSettings.value[adSenseSetting];
            }
        }

        if (adSettings.value.enableCustomAds) {
            // Map position to the correct custom ad setting key
            let customSetting = '';
            switch (position) {
                case 'header':
                    customSetting = 'customHeaderBanner';
                    break;
                case 'sidebarTop':
                    customSetting = 'customSidebarTop';
                    break;
                case 'sidebarBottom':
                    customSetting = 'customSidebarBottom';
                    break;
                case 'inContent':
                    customSetting = 'customInArticle';
                    break;
                case 'belowContent':
                    customSetting = 'customBelowContent';
                    break;
                case 'afterTitle':
                    customSetting = 'customAfterTitle';
                    break;
                case 'afterCover':
                    customSetting = 'customAfterCover';
                    break;
                default:
                    return '';
            }

            if (customSetting in adSettings.value && adSettings.value[customSetting]) {
                return adSettings.value[customSetting];
            }
        }

        if (adSettings.value.enableAmazonAds) {
            switch (position) {
                case 'sidebarTop':
                    if (adSettings.value.amazonSidebarAd) return adSettings.value.amazonSidebarAd;
                    break;
                case 'inContent':
                    if (adSettings.value.amazonInContentAd) return adSettings.value.amazonInContentAd;
                    break;
                case 'belowContent':
                    if (adSettings.value.amazonBelowContentAd) return adSettings.value.amazonBelowContentAd;
                    break;
            }
        }

        if (adSettings.value.enableTaboolaAds) {
            switch (position) {
                case 'belowContent':
                    if (adSettings.value.taboolaBelowArticle) return adSettings.value.taboolaBelowArticle;
                    break;
                case 'sidebarTop':
                    if (adSettings.value.taboolaRightRail) return adSettings.value.taboolaRightRail;
                    break;
                case 'footer':
                    if (adSettings.value.taboolaFooter) return adSettings.value.taboolaFooter;
                    break;
            }
        }

        return '';
    };

    // Load the AdSense script if enabled
    const loadAdScripts = () => {
        if (adSettings.value.enableAds) {
            // Load AdSense if enabled
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
                        } else {
                            console.error('Could not extract AdSense script URL from:', adSettings.value.adSenseAutoAdsCode);
                        }
                    } catch (e) {
                        console.error('Error parsing AdSense code:', e);
                    }
                }
            }

            // Initialize AdSense ad units
            if (adSettings.value.enableAdSense && window.adsbygoogle) {
                setTimeout(() => {
                    try {
                        document.querySelectorAll('.adsbygoogle').forEach((ad) => {
                            if (!ad.hasAttribute('data-adsbygoogle-status')) {
                                (window.adsbygoogle = window.adsbygoogle || []).push({});
                            }
                        });
                    } catch (e) {
                        console.error('AdSense initialization error:', e);
                    }
                }, 300);
            }
        }
    };

    // Load sidebar left ad directly into DOM
    const loadSidebarLeftAd = (containerRef: HTMLElement | null) => {
        if (!adSettings.value.enableAds || !containerRef) return;

        // Insert sidebar left ad code directly into DOM
        if (adSettings.value.adSenseSidebarLeft && containerRef) {
            try {
                // Wait a bit for the DOM to be ready
                setTimeout(() => {
                    // Check if the reference is still valid
                    if (!containerRef) {
                        return;
                    }

                    // Create a temporary div to parse the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = adSettings.value.adSenseSidebarLeft;

                    // Get the ins element
                    const insElement = tempDiv.querySelector('ins');
                    if (insElement && containerRef) {
                        containerRef.appendChild(insElement);

                        // Initialize AdSense for this specific ad
                        if (window.adsbygoogle) {
                            try {
                                window.adsbygoogle.push({});
                            } catch (e) {
                                console.error('Error initializing left sidebar ad:', e);
                            }
                        }
                    } else {
                        console.error('Could not find ins element in adSenseSidebarLeft HTML or container is no longer available');
                    }
                }, 500);
            } catch (e) {
                console.error('Error inserting left sidebar ad:', e);
            }
        }
    };

    return {
        adSettings,
        getAdHtml,
        loadAdScripts,
        loadSidebarLeftAd
    };
};
