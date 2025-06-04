// directives/dynamic-resize.ts
export default {
    async mounted(el: HTMLImageElement) {
        const resizeImage = async () => {
            try {
                if (!el.complete) {
                    await new Promise((resolve, reject) => {
                        el.onload = () => resolve(true);
                        el.onerror = reject;
                    });
                }

                const width = el.clientWidth * window.devicePixelRatio;
                const height = el.clientHeight * window.devicePixelRatio;
                if (width < 1 || height < 1) return;

                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = el.src;

                await new Promise((res, rej) => {
                    img.onload = res;
                    img.onerror = rej;
                });

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(img, 0, 0, width, height);

                const resizedBase64 = canvas.toDataURL('image/webp', 0.85);
                el.src = resizedBase64;
            } catch (e) {
                console.warn('Erro ao redimensionar imagem:', e);
            }
        };

        await resizeImage();

        const observer = new ResizeObserver(() => {
            resizeImage();
        });

        observer.observe(el);
        el.__observer__ = observer;
    },

    unmounted(el: any) {
        el.__observer__?.disconnect();
    },

    getSSRProps() {
        return {};
    }
};
