import { createServer, loadEnv } from 'vite';
import { transformHtmlTemplate } from '@unhead/vue/server';
import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as zlib from 'node:zlib';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'VITE');
const cache = new Map<string, { html: string, expires: number }>();
let themeStyle = ""
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_CONTROL_MAX_AGE = 900;

const compressHtml = (html: string, acceptEncoding: string = ''): { data: Buffer | string, encoding: string | null } => {
    if (acceptEncoding.includes('br')) {
        return {
            data: zlib.brotliCompressSync(html),
            encoding: 'br'
        };
    } else if (acceptEncoding.includes('gzip')) {
        return {
            data: zlib.gzipSync(html),
            encoding: 'gzip'
        };
    }

    return {
        data: html,
        encoding: null
    };
};

async function bootstrap() {
    const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom'
    });

    const serve = serveStatic(path.resolve('dist'), {
        index: false,
        etag: true,
        setHeaders: (res, path) => {
            res.setHeader('Cache-Control', 'public, max-age=315360000');
        }
    });

    const server = http.createServer(async (req, res) => {
        const url = req.url || '/';
        const acceptEncoding = req.headers['accept-encoding'] || '';

        if (process.env.NODE_ENV === 'production' && url.startsWith('/assets'))
            return serve(req, res, finalhandler(req, res));

        let template = '';
        let render: (url: string) => Promise<any>;

        if (process.env.NODE_ENV === 'production') {
            template = fs.readFileSync(path.resolve('dist/index.html'), 'utf-8');
            const mod = await (new Function('return import("./entry-server.js")')());
            render = mod.render;
        } else {
            template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
            const { render: devRender } = await vite.ssrLoadModule('/src/entry-server.ts');
            render = devRender;
        }



        vite.middlewares(req, res, async () => {
            try {
                if (/\.\w+$/.test(url)) {
                    res.statusCode = 404;
                    return res.end(`Not found: ${url}`);
                }

                const cached = cache.get(url);
                const now = Date.now();

                /*if (cached && cached.expires > now) {
                    res.setHeader('Content-Type', 'text/html');
                    res.setHeader('Cache-Control', `public, max-age=${CACHE_CONTROL_MAX_AGE}`);

                    const compressed = compressHtml(cached.html, acceptEncoding as string);

                    if (compressed.encoding)
                        res.setHeader('Content-Encoding', compressed.encoding);

                    return res.end(compressed.data);
                }*/

                template = await vite.transformIndexHtml(url, template);

                const {
                    html: appHtml, head, metadata, redirect,
                    piniaState, settings, posts, prefetchCache
                } = await render(url);

                const piniaScript = `\n<script>window.__PINIA__ = ${JSON.stringify(piniaState).replace(/</g, '\\u003c')}</script>`;

                if (redirect) {
                    res.writeHead(301, { Location: redirect });
                    return res.end();
                }

                globalThis.__SSR_DATA__ = { ...globalThis.__SSR_DATA__, posts };

                const ssrData = { ...globalThis.__SSR_DATA__, prefetchCache };
                const serializedData = JSON.stringify(ssrData).replace(/</g, '\\u003c');
                const dataScript = `${piniaScript}`;
                //const dataScript = `<script>window.__CMMV_DATA__ = ${serializedData};</script>${piniaScript}`;

                template = await transformHtmlTemplate(head, template.replace(`<div id="app"></div>`, `
                    <div id="app">${appHtml}</div>
                    ${dataScript}
                `));


                if(!themeStyle) {
                    const { useSettingsStore } = await import('./src/store/settings.js');
                    const settingsStore = useSettingsStore();
                    let theme = settingsStore.getSetting('blog.theme', env.VITE_DEFAULT_THEME);
                    const routerModules = path.resolve(`./src/theme-${theme}/style.css`);

                    if(fs.existsSync(routerModules))
                        themeStyle = fs.readFileSync(routerModules, 'utf-8');
                }

                //if(themeStyle)
                //    template = template.replace("</head>", `<style>${themeStyle}</style>` + "</head>");

                template = template.replace(/<script type="module" src="\/@vite\/client"><\/script>\s*/g, '');
                template = template.replace("<analytics />", settings["blog.analyticsCode"] || "").replace("<analytics>", settings["blog.analyticsCode"] || "");
                template = template.replace("<custom-js />", settings["blog.customJs"] || "").replace("<custom-js>", settings["blog.customJs"] || "");
                template = template.replace("<custom-css />", settings["blog.customCss"] || "").replace("<custom-css>", settings["blog.customCss"] || "");

                for(const key in metadata)
                    template = template.replace(`{${key}}`, metadata[key]);

                //cache.set(url, { html: template, expires: now + CACHE_TTL_MS });

                res.setHeader('Content-Type', 'text/html');
                res.setHeader('Cache-Control', `public, max-age=${CACHE_CONTROL_MAX_AGE}`);

                const compressed = compressHtml(template, acceptEncoding as string);

                if (compressed.encoding)
                    res.setHeader('Content-Encoding', compressed.encoding);

                res.end(compressed.data);
            } catch (e) {
                vite.ssrFixStacktrace(e as Error);
                res.statusCode = 500;
                res.end((e as Error).message);
            }
        });
    });

    const port = env.VITE_SSR_PORT || 5001;

    server.listen(port, () => {
        console.log(`🚀 SSR server running at http://localhost:${port}`);
    });
}

setTimeout(bootstrap, 4000);
