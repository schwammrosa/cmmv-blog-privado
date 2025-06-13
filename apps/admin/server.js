import path from 'node:path';
import fs from 'node:fs';
import cmmv, { serverStatic } from '@cmmv/server';

import { proxy } from '@cmmv/proxy';

import serverConfig from './server.config.js';

const whitelabelApiUrls = {};

/**
 * Fetches whitelabel API URLs with retry logic and exponential backoff
 */
const fetchWhitelabelApiUrls = async (retryCount = 0) => {
    const { maxRetries, timeout, baseDelay, maxDelay, backoffMultiplier } = serverConfig.whitelabel;

    if (Object.keys(whitelabelApiUrls).length > 0) {
        return true;
    }

    try {
        if (typeof fetch === 'undefined') {
            console.warn('Fetch is not available, skipping whitelabel fetch');
            return false;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        console.log(`Fetching whitelabel data from: ${serverConfig.apiUrl}/whitelabel/admin (attempt ${retryCount + 1}/${maxRetries + 1})`);

        const response = await fetch(`${serverConfig.apiUrl}/whitelabel/admin`, {
            signal: controller.signal,
            headers: serverConfig.proxy.headers
        }).catch(error => {
            console.warn('Fetch error:', error.message);
            return null;
        });

        clearTimeout(timeoutId);

        if (!response) {
            console.warn('No response received from whitelabel API');
            return false;
        }

        if (response.ok) {
            const whitelabels = await response.json();
            let count = 0;

            if (whitelabels?.result?.data) {
                whitelabels.result.data.forEach((whitelabel) => {
                    if (whitelabel.id && whitelabel.apiUrl) {
                        whitelabelApiUrls[whitelabel.id] = whitelabel.apiUrl;
                        count++;
                        console.log(`✅ Added whitelabel: ${whitelabel.id} -> ${whitelabel.apiUrl}`);
                    }
                });

                console.log(`🎉 Successfully loaded ${count} whitelabel configurations`);
                return true;
            } else {
                console.warn('⚠️  Invalid response format from whitelabel API');
                return false;
            }
        } else {
            console.warn(`⚠️  Whitelabel API responded with status: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.warn(`❌ Error fetching whitelabel data (attempt ${retryCount + 1}):`, error.message);
        return false;
    } finally {
        if (retryCount < maxRetries) {
            const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, retryCount), maxDelay);
            console.log(`🔄 Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWhitelabelApiUrls(retryCount + 1);
        } else {
            console.warn(`🚫 Max retries (${maxRetries}) reached for whitelabel API`);
            return false;
        }
    }
};

/**
 * Sets up proxy middleware for whitelabel routes
 */
const setupWhitelabelProxies = (app) => {
    Object.entries(whitelabelApiUrls).forEach(([id, url]) => {
        const pattern = `/${id}`;

        console.log(`Setting up proxy: ${pattern} -> ${url}`);

        // Setup proxy for all HTTP methods
        const proxyHandler = proxy({
            target: url,
            changeOrigin: true,
            pathRewrite: {
                [`^${pattern}`]: ''
            },
            timeout: serverConfig.proxy.timeout || 30000,
            headers: {
                ...serverConfig.proxy.headers
            }
        });

        // Define routes for all HTTP methods
        app.get(`${pattern}/*`, proxyHandler);
        app.post(`${pattern}/*`, proxyHandler);
        app.put(`${pattern}/*`, proxyHandler);
        app.delete(`${pattern}/*`, proxyHandler);
        app.patch(`${pattern}/*`, proxyHandler);
        app.options(`${pattern}/*`, proxyHandler);

        // Also handle the exact pattern without /*
        app.get(pattern, proxyHandler);
        app.post(pattern, proxyHandler);
        app.put(pattern, proxyHandler);
        app.delete(pattern, proxyHandler);
        app.patch(pattern, proxyHandler);
        app.options(pattern, proxyHandler);
    });
};

/**
 * Sets up main API proxy
 */
const setupMainApiProxy = (app) => {
    console.log(`🔧 Setting up main API proxy: /api -> ${serverConfig.apiUrl}`);

    const baseProxyOptions = {
        target: serverConfig.apiUrl,
        changeOrigin: serverConfig.proxy.changeOrigin,
        timeout: serverConfig.proxy.timeout || 30000,
        headers: {
            ...serverConfig.proxy.headers
        }
    };

    // Main API proxy
    const mainApiProxy = proxy({
        ...baseProxyOptions,
        pathRewrite: { '^/api': '' }
    });

    // Admin API proxy (more specific route)
    const adminApiProxy = proxy({
        ...baseProxyOptions,
        pathRewrite: { '^/api/admin': '' }
    });

    // Images proxy
    const imagesProxy = proxy({
        ...baseProxyOptions
    });

    // Define routes for main API
    app.get('/api/*', mainApiProxy);
    app.post('/api/*', mainApiProxy);
    app.put('/api/*', mainApiProxy);
    app.delete('/api/*', mainApiProxy);
    app.patch('/api/*', mainApiProxy);
    app.options('/api/*', mainApiProxy);

    // Define routes for admin API
    app.get('/api/admin/*', adminApiProxy);
    app.post('/api/admin/*', adminApiProxy);
    app.put('/api/admin/*', adminApiProxy);
    app.delete('/api/admin/*', adminApiProxy);
    app.patch('/api/admin/*', adminApiProxy);
    app.options('/api/admin/*', adminApiProxy);

    // Define routes for images
    app.get('/images/*', imagesProxy);
    app.post('/images/*', imagesProxy);
    app.put('/images/*', imagesProxy);
    app.delete('/images/*', imagesProxy);
    app.patch('/images/*', imagesProxy);
    app.options('/images/*', imagesProxy);

    console.log('✅ Main API proxy routes configured');
};

/**
 * Initialize the server
 */
const initServer = async () => {
    console.log('🚀 Starting CMMV Admin Server...');
    console.log(`🌍 Environment: ${serverConfig.mode}`);
    console.log(`🔗 API URL: ${serverConfig.apiUrl}`);
    console.log(`🏠 Allowed Hosts: ${serverConfig.allowedHosts}`);
    console.log(`📁 Static Directory: ${serverConfig.staticDir}`);

    const app = cmmv.default();

    // Setup main API proxies first
    setupMainApiProxy(app);

    // Try to fetch whitelabel configurations
    console.log('🔍 Fetching whitelabel configurations...');
    const success = await fetchWhitelabelApiUrls();

    if (success && Object.keys(whitelabelApiUrls).length > 0) {
        console.log('🔧 Setting up whitelabel proxies...');
        setupWhitelabelProxies(app);
    } else {
        console.warn('⚠️  No whitelabel configurations found, continuing without whitelabel proxies');
    }

    app.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: serverConfig.mode,
            whitelabels: {
                count: Object.keys(whitelabelApiUrls).length,
                configured: Object.keys(whitelabelApiUrls)
            },
            apiUrl: serverConfig.apiUrl,
            version: process.env.npm_package_version || '1.0.0'
        });
    });

    app.get('/whitelabels', (req, res) => {
        res.json({
            count: Object.keys(whitelabelApiUrls).length,
            whitelabels: whitelabelApiUrls,
            timestamp: new Date().toISOString()
        });
    });

    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(fs.readFileSync(path.resolve(serverConfig.staticDir, 'index.html'), 'utf8'));
    });

    // Serve static files (this should be last)
    app.use(serverStatic(serverConfig.staticDir));

    // Start the server
    app.listen({ host: serverConfig.host, port: serverConfig.port })
    .then(server => {
        const addr = server.address();
        console.log(`\n✅ Server started successfully!`);
        console.log(`📡 Listening on: http://${addr.address}:${addr.port}`);
        console.log(`🔗 API Proxy: ${serverConfig.apiUrl}`);
        console.log(`🏷️  Whitelabels: ${Object.keys(whitelabelApiUrls).length} configured`);

        if (Object.keys(whitelabelApiUrls).length > 0) {
            console.log(`\n📋 Whitelabel Routes:`);
            Object.entries(whitelabelApiUrls).forEach(([id, url]) => {
                console.log(`   /${id} -> ${url}`);
            });
        }

        console.log(`\n🔍 Health check: http://${addr.address}:${addr.port}/health`);
        console.log(`📊 Whitelabels info: http://${addr.address}:${addr.port}/whitelabels`);
        console.log(`\n🎉 Server is ready for requests!`);
    })
    .catch(err => {
        console.error('❌ Failed to start server:', err.message);
        throw Error(err.message);
    });
};

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

// Start the server
initServer().catch(err => {
    console.error('💥 Failed to initialize server:', err);
    process.exit(1);
});
