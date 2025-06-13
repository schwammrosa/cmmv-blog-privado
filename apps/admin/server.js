import cmmv, { serverStatic } from '@cmmv/server';
import { createProxyMiddleware } from 'http-proxy-middleware';
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

        app.use(pattern, createProxyMiddleware({
            target: url,
            changeOrigin: true,
            secure: false,
            pathRewrite: (path) => {
                return path.replace(new RegExp(`^${pattern}`), '');
            },
            onProxyReq: (proxyReq, req) => {
                // Forward refresh token
                const refreshToken = req.headers['refresh-token'];
                if (refreshToken) {
                    proxyReq.setHeader('refresh-token', refreshToken);
                }

                // Forward whitelabel ID
                const whitelabelId = req.headers['x-whitelabel-id'];
                if (whitelabelId) {
                    proxyReq.setHeader('x-whitelabel-id', whitelabelId);
                }

                console.log(`Proxying ${req.method} ${req.url} to ${url}`);
            },
            onError: (err, req, res) => {
                console.error(`Proxy error for ${pattern}:`, err.message);
                res.status(502).json({
                    error: 'Proxy Error',
                    message: 'Failed to proxy request to whitelabel service',
                    whitelabelId: id
                });
            }
        }));
    });
};

/**
 * Sets up main API proxy
 */
const setupMainApiProxy = (app) => {
    console.log(`🔧 Setting up main API proxy: /api -> ${serverConfig.apiUrl}`);

    const proxyOptions = {
        target: serverConfig.apiUrl,
        changeOrigin: serverConfig.proxy.changeOrigin,
        secure: serverConfig.proxy.secure,
        timeout: serverConfig.proxy.timeout,
        proxyTimeout: serverConfig.proxy.proxyTimeout,
        onProxyReq: (proxyReq, req) => {
            // Forward authentication headers
            const refreshToken = req.headers['refresh-token'];
            if (refreshToken) {
                proxyReq.setHeader('refresh-token', refreshToken);
            }

            const whitelabelId = req.headers['x-whitelabel-id'];
            if (whitelabelId) {
                proxyReq.setHeader('x-whitelabel-id', whitelabelId);
            }

            const authorization = req.headers['authorization'];
            if (authorization) {
                proxyReq.setHeader('authorization', authorization);
            }

            console.log(`🔄 Proxying ${req.method} ${req.url} to main API`);
        },
        onError: (err, req, res) => {
            console.error('❌ Main API proxy error:', err.message);
            if (!res.headersSent) {
                res.status(502).json({
                    error: 'API Proxy Error',
                    message: 'Failed to proxy request to main API',
                    timestamp: new Date().toISOString()
                });
            }
        }
    };

    // Main API proxy
    app.use('/api', createProxyMiddleware({
        ...proxyOptions,
        pathRewrite: { '^/api': '' }
    }));

    // Admin API proxy (more specific route)
    app.use('/api/admin', createProxyMiddleware({
        ...proxyOptions,
        pathRewrite: { '^/api/admin': '' },
        onError: (err, req, res) => {
            console.error('❌ Admin API proxy error:', err.message);
            if (!res.headersSent) {
                res.status(502).json({
                    error: 'Admin API Proxy Error',
                    message: 'Failed to proxy request to admin API',
                    timestamp: new Date().toISOString()
                });
            }
        }
    }));

    // Images proxy
    app.use('/images', createProxyMiddleware({
        ...proxyOptions,
        onError: (err, req, res) => {
            console.error('❌ Images proxy error:', err.message);
            if (!res.headersSent) {
                res.status(404).json({
                    error: 'Image Proxy Error',
                    message: 'Failed to proxy image request',
                    timestamp: new Date().toISOString()
                });
            }
        }
    }));
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

    // Health check endpoint
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

    // Whitelabel info endpoint
    app.get('/whitelabels', (req, res) => {
        res.json({
            count: Object.keys(whitelabelApiUrls).length,
            whitelabels: whitelabelApiUrls,
            timestamp: new Date().toISOString()
        });
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
