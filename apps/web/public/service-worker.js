importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");
const {registerRoute: registerRoute, setCatchHandler: setCatchHandler} = workbox.routing
  , {CacheFirst: CacheFirst, NetworkFirst: NetworkFirst, StaleWhileRevalidate: StaleWhileRevalidate} = workbox.strategies
  , {ExpirationPlugin: ExpirationPlugin} = workbox.expiration
  , {CacheableResponsePlugin: CacheableResponsePlugin} = workbox.cacheableResponse
  , {BackgroundSyncPlugin: BackgroundSyncPlugin} = workbox.backgroundSync
  , {skipWaiting: skipWaiting, clientsClaim: clientsClaim} = workbox.core;
self.addEventListener("install", e => {
    e.waitUntil(self.skipWaiting())
}
),
clientsClaim();
const VERSION = "v0.0.3"
  , CACHE_NAMES = {
    ASSETS: "assets-cache-v0.0.3",
    STATIC: "static-cache-v0.0.3",
    LAST_VISITED: "last-visited-v0.0.3",
    COUPONS: `coupons-pages-v0.0.3-${(new Date).toLocaleDateString("pt-BR").replace(/\//g, "")}`,
    OFFLINE_QUEUE: "offline-queue-v0.0.3"
}
  , ROUTE_REGEX = {
    IMAGES: /.*(static|cdn).*\.(?:png|jpg|jpeg|svg|gif|webp)/,
    ASSETS: /.*(?:static|ajax.googleapis.com|cloudfront.net).*(?:\.css|\.js|\.woff2|\.jquery)/,
    COUPONS: /(?:\?|&)c=(\d+)(?:&|#|$)/,
    LAST_VISITED: /.*(?:static\.com\.br\/widget\/lastvisitedstores)/,
}
  , assetsMatchFunction = ({url: e, event: t}) => -1 == e.href.indexOf("sw.js") && ROUTE_REGEX.ASSETS.test(e.href)
  , assetsExpirationPlugin = new ExpirationPlugin({
    maxEntries: 60,
    maxAgeSeconds: 15552e3,
    purgeOnQuotaError: !0
})
  , lastVisitedStoresExpirationPlugin = new ExpirationPlugin({
    maxAgeSeconds: 60,
    maxEntries: 8,
    purgeOnQuotaError: !0
})
  , couponsExpirationPlugin = new ExpirationPlugin({
    maxAgeSeconds: 1800,
    maxEntries: 40,
    purgeOnQuotaError: !0
})
  , strategies = {
    default: new StaleWhileRevalidate({
        cacheName: CACHE_NAMES.STATIC,
        plugins: [new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 15552e3
        }), new CacheableResponsePlugin({
            statuses: [200]
        })]
    }),
    networkFirst: new NetworkFirst({
        cacheName: "network-first-cache",
        networkTimeoutSeconds: 3,
        plugins: [new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 86400
        })]
    })
};
registerRoute(ROUTE_REGEX.IMAGES, strategies.default),
registerRoute(ROUTE_REGEX.COUPONS, new CacheFirst({
    cacheName: CACHE_NAMES.COUPONS,
    plugins: [new BackgroundSyncPlugin(CACHE_NAMES.OFFLINE_QUEUE,{
        maxRetentionTime: 1440
    }), couponsExpirationPlugin]
})),
workbox.routing.registerRoute(assetsMatchFunction, new CacheFirst({
    cacheName: CACHE_NAMES.ASSETS,
    plugins: [assetsExpirationPlugin]
})),
registerRoute(ROUTE_REGEX.LAST_VISITED, new CacheFirst({
    cacheName: CACHE_NAMES.LAST_VISITED,
    plugins: [lastVisitedStoresExpirationPlugin]
})),
self.addEventListener("message", e => {
    "clear_coupons" === e.data && couponsExpirationPlugin.deleteCacheAndMetadata().finally( () => {
        e.source.postMessage("coupons_cleared")
    }
    ),
    "clear_assets" === e.data && assetsExpirationPlugin.deleteCacheAndMetadata().finally( () => {
        e.source.postMessage("assets_cleared")
    }
    ),
    "logout" === e.data && lastVisitedStoresExpirationPlugin.deleteCacheAndMetadata().finally( () => {
        e.source.postMessage("last_visited_cleared")
    }
    ),
    "force_update" === e.data.type && (self.skipWaiting(),
    clients.claim())
}
);
