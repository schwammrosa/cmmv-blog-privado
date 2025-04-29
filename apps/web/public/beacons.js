window.addEventListener('load', () => {
    const url = new URL(window.location.href);
    const data = new URLSearchParams({
        path: url.pathname,
        t: Date.now().toString(),
        r: Math.random().toString()
    });

    navigator.sendBeacon(`/api/analytics/access?t=${new Date().getTime()}`, data);
});

window.addEventListener('beforeunload', () => {
    const url = new URL(window.location.href);
    const data = new URLSearchParams({
        path: url.pathname,
        t: Date.now().toString(),
        r: Math.random().toString()
    });

    navigator.sendBeacon(`/api/analytics/unload?t=${new Date().getTime()}`, data);
});