/**
 * Utilitário para otimização avançada de imagens
 * 
 * Este módulo fornece funções para otimizar o carregamento e renderização de imagens,
 * com foco em melhorar o LCP (Largest Contentful Paint) e reduzir o tamanho das imagens.
 */

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png' | 'original';
  priority?: boolean;
}

const defaultOptions: ImageOptimizationOptions = {
  width: 800,
  quality: 80,
  format: 'webp',
  priority: false
};

/**
 * Otimiza URL de imagem para CDN ou serviço de otimização
 */
export function optimizeImageUrl(url: string, options: Partial<ImageOptimizationOptions> = {}): string {
  if (!url) return '';
  
  // Se a URL já inclui parâmetros de otimização, retorne como está
  if (url.includes('imagecdn') || url.includes('width=')) {
    return url;
  }
  
  const opts = { ...defaultOptions, ...options };
  
  // Se é uma URL absoluta, adicione parâmetros de otimização
  if (url.startsWith('http')) {
    // Verifique se a URL já tem parâmetros
    const separator = url.includes('?') ? '&' : '?';
    
    let params = `width=${opts.width}`;
    if (opts.height) params += `&height=${opts.height}`;
    if (opts.quality) params += `&quality=${opts.quality}`;
    if (opts.format !== 'original') params += `&format=${opts.format}`;
    
    return `${url}${separator}${params}`;
  }
  
  // Para URLs relativas
  return url;
}

/**
 * Cria marcação de imagem otimizada com srcset
 */
export function createOptimizedImageMarkup(url: string, alt: string = '', options: Partial<ImageOptimizationOptions> = {}): string {
  const opts = { ...defaultOptions, ...options };
  
  // Gera variações de tamanho para srcset
  const sizes = [320, 640, 960, 1280];
  const srcSet = sizes
    .map(size => `${optimizeImageUrl(url, { ...opts, width: size })} ${size}w`)
    .join(', ');
  
  // Determina os atributos de carregamento
  const loadingAttr = opts.priority ? 'eager' : 'lazy';
  const fetchPriorityAttr = opts.priority ? 'high' : 'auto';
  
  return `<img 
    src="${optimizeImageUrl(url, opts)}" 
    srcset="${srcSet}" 
    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw" 
    alt="${alt}" 
    loading="${loadingAttr}" 
    fetchpriority="${fetchPriorityAttr}"
    width="${opts.width}" 
    height="${opts.height || Math.round(opts.width! * 0.66)}"
    class="w-full h-full object-cover"
  />`;
}

/**
 * Pré-carrega a imagem principal para melhorar o LCP
 */
export function preloadLCPImage(url: string, options: Partial<ImageOptimizationOptions> = {}): void {
  if (!url || typeof window === 'undefined') return;
  
  const opts = { ...defaultOptions, ...options };
  const optimizedUrl = optimizeImageUrl(url, opts);
  
  // Criar link de pré-carregamento
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = optimizedUrl;
  link.type = opts.format === 'webp' ? 'image/webp' : opts.format === 'avif' ? 'image/avif' : 'image/jpeg';
  
  document.head.appendChild(link);
}

/**
 * Otimiza todas as imagens na página para melhorar o desempenho
 */
export function optimizeAllImages(): void {
  if (typeof window === 'undefined') return;
  
  // Encontre a imagem LCP provável (maior imagem visível acima da dobra)
  const findLCPImage = () => {
    const images = Array.from(document.querySelectorAll('img'));
    if (!images.length) return null;
    
    // Ordenar por área visível
    const viewportImages = images
      .filter(img => {
        const rect = img.getBoundingClientRect();
        return (
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth &&
          rect.bottom > 0 &&
          rect.right > 0
        );
      })
      .sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        const aArea = aRect.width * aRect.height;
        const bArea = bRect.width * bRect.height;
        return bArea - aArea; // Maior primeiro
      });
    
    return viewportImages[0] || null;
  };
  
  // Pré-carregar a imagem LCP
  const lcpImage = findLCPImage();
  if (lcpImage && lcpImage.src) {
    preloadLCPImage(lcpImage.src, { priority: true });
    lcpImage.setAttribute('fetchpriority', 'high');
    lcpImage.setAttribute('loading', 'eager');
  }
  
  // Otimizar outras imagens
  const otherImages = Array.from(document.querySelectorAll('img:not([loading])'));
  otherImages.forEach(img => {
    if (img !== lcpImage) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    }
  });
}
