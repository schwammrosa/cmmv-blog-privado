import { onMounted } from 'vue';

export function useErrorHandling() {
    const setupGlobalErrorHandling = () => {
        if (typeof window === 'undefined') return;

        // Store original error handlers
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;

        // Filter out specific external script errors
        const shouldSuppressError = (message: string): boolean => {
            const suppressedErrors = [
                'vignette: no interstitial API',
                'express_html_inpage_rendering_lib',
                'interstitial API',
                'vignette API',
                'adsbygoogle',
                'taboola',
                'advertisement',
                'advertising',
                'googlesyndication',
                'ade.googlesyndication.com',
                'ERR_CONNECTION_CLOSED',
                'net::ERR_CONNECTION_CLOSED',
                'dc_oe=',
                'lk.reportEvents',
                'express_html_inpage',
                'ddm/activity',
                'googleadservices',
                'doubleclick',
                'google-analytics',
                'gtag',
                'googleads',
                'adwords',
                'adtech',
                'adform',
                'criteo',
                'facebook',
                'fbq',
                'pixel'
            ];

            return suppressedErrors.some(error => 
                message.toLowerCase().includes(error.toLowerCase())
            );
        };

        // Override console.error
        console.error = (...args) => {
            const errorMessage = args.join(' ');
            if (shouldSuppressError(errorMessage)) {
                // Suppress the error but log it as a warning for debugging
                console.warn('[Suppressed Error]:', ...args);
                return;
            }
            originalConsoleError.apply(console, args);
        };

        // Override console.warn for additional filtering
        console.warn = (...args) => {
            const warningMessage = args.join(' ');
            if (shouldSuppressError(warningMessage)) {
                // Suppress the warning
                return;
            }
            originalConsoleWarn.apply(console, args);
        };

        // Global error handler
        const handleGlobalError = (event: ErrorEvent) => {
            if (event.error && event.error.message && shouldSuppressError(event.error.message)) {
                event.preventDefault();
                console.warn('[Suppressed Global Error]:', event.error.message);
                return false;
            }
        };

        // Unhandled promise rejection handler
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            if (event.reason && event.reason.message && shouldSuppressError(event.reason.message)) {
                event.preventDefault();
                console.warn('[Suppressed Promise Rejection]:', event.reason.message);
                return false;
            }
        };

        // Add event listeners
        window.addEventListener('error', handleGlobalError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        // Intercept fetch requests to suppress ad-related network errors
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const url = typeof args[0] === 'string' ? args[0] : args[0].url;
                if (shouldSuppressError(url)) {
                    // For ad-related URLs, return a mock response to prevent errors
                    return new Response('', { status: 200, statusText: 'OK' });
                }
                return await originalFetch.apply(window, args);
            } catch (error) {
                if (shouldSuppressError(error.message || error.toString())) {
                    console.warn('[Suppressed Fetch Error]:', error.message);
                    return new Response('', { status: 200, statusText: 'OK' });
                }
                throw error;
            }
        };

        // Intercept XMLHttpRequest to suppress ad-related network errors
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (shouldSuppressError(url)) {
                // Store the URL to check in send method
                this._suppressAdErrors = true;
            }
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.send = function(...args) {
            if (this._suppressAdErrors) {
                // For ad-related requests, simulate success
                setTimeout(() => {
                    if (this.onload) {
                        this.onload(new Event('load'));
                    }
                }, 0);
                return;
            }
            return originalXHRSend.apply(this, args);
        };

        // Cleanup function
        return () => {
            console.error = originalConsoleError;
            console.warn = originalConsoleWarn;
            window.fetch = originalFetch;
            XMLHttpRequest.prototype.open = originalXHROpen;
            XMLHttpRequest.prototype.send = originalXHRSend;
            window.removeEventListener('error', handleGlobalError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    };

    onMounted(() => {
        const cleanup = setupGlobalErrorHandling();
        
        // Cleanup on component unmount
        return () => {
            if (cleanup) cleanup();
        };
    });

    return {
        setupGlobalErrorHandling
    };
} 