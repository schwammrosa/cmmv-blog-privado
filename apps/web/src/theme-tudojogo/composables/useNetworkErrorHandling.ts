import { onMounted } from 'vue';

export function useNetworkErrorHandling() {
    const setupNetworkErrorHandling = () => {
        if (typeof window === 'undefined') return;

        // List of ad-related domains and patterns to suppress
        const adDomains = [
            'googlesyndication.com',
            'googleadservices.com',
            'doubleclick.net',
            'google-analytics.com',
            'googletagmanager.com',
            'googleads.g.doubleclick.net',
            'pagead2.googlesyndication.com',
            'ade.googlesyndication.com',
            'securepubads.g.doubleclick.net',
            'www.googleadservices.com',
            'www.googletagmanager.com',
            'www.google-analytics.com',
            'taboola.com',
            'cdn.taboola.com',
            'api.taboola.com',
            'trc.taboola.com',
            'cdn.cxense.com',
            'api.cxense.com',
            'adsystem.com',
            'adtech.com',
            'adform.net',
            'criteo.com',
            'facebook.com',
            'connect.facebook.net',
            'pixel.facebook.com'
        ];

        const isAdDomain = (url: string): boolean => {
            try {
                const urlObj = new URL(url);
                return adDomains.some(domain => urlObj.hostname.includes(domain));
            } catch {
                return adDomains.some(domain => url.includes(domain));
            }
        };

        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const url = typeof args[0] === 'string' ? args[0] : args[0].url;
            
            if (isAdDomain(url)) {
                console.warn('[Suppressed Ad Network Request]:', url);
                // Return a mock successful response for ad requests
                return new Response('', { 
                    status: 200, 
                    statusText: 'OK',
                    headers: { 'Content-Type': 'text/plain' }
                });
            }

            try {
                return await originalFetch.apply(window, args);
            } catch (error) {
                if (isAdDomain(url) || error.message?.includes('ERR_CONNECTION_CLOSED')) {
                    console.warn('[Suppressed Network Error]:', error.message);
                    return new Response('', { 
                        status: 200, 
                        statusText: 'OK',
                        headers: { 'Content-Type': 'text/plain' }
                    });
                }
                throw error;
            }
        };

        // Intercept XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (isAdDomain(url)) {
                this._isAdRequest = true;
            }
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.send = function(...args) {
            if (this._isAdRequest) {
                console.warn('[Suppressed Ad XHR Request]');
                // Simulate successful response
                setTimeout(() => {
                    this.readyState = 4;
                    this.status = 200;
                    this.statusText = 'OK';
                    if (this.onload) {
                        this.onload(new Event('load'));
                    }
                    if (this.onreadystatechange) {
                        this.onreadystatechange(new Event('readystatechange'));
                    }
                }, 0);
                return;
            }
            return originalXHRSend.apply(this, args);
        };

        // Intercept image loading errors
        const originalImage = window.Image;
        window.Image = function(...args) {
            const img = new originalImage(...args);
            const originalOnError = img.onerror;
            
            img.onerror = function(event) {
                const src = img.src || '';
                if (isAdDomain(src)) {
                    console.warn('[Suppressed Ad Image Error]:', src);
                    return;
                }
                if (originalOnError) {
                    originalOnError.call(this, event);
                }
            };
            
            return img;
        };

        // Cleanup function
        return () => {
            window.fetch = originalFetch;
            XMLHttpRequest.prototype.open = originalXHROpen;
            XMLHttpRequest.prototype.send = originalXHRSend;
            window.Image = originalImage;
        };
    };

    onMounted(() => {
        const cleanup = setupNetworkErrorHandling();
        
        return () => {
            if (cleanup) cleanup();
        };
    });

    return {
        setupNetworkErrorHandling
    };
} 