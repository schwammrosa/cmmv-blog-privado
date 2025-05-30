// Utilitários para melhorar o desempenho do site

// Diretiva para Lazy Loading baseada em Intersection Observer
export const vIntersect = {
  mounted(el: HTMLElement, binding: any) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          binding.value(el);
          observer.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    observer.observe(el);
  }
};

// Função para otimizar URLs de imagens
export const optimizeImageUrl = (url: string, width: number): string => {
  if (!url) return '';
  
  // Se já for uma URL de CDN ou já tiver parâmetros de otimização, retorne como está
  if (url.includes('imagecdn') || url.includes('width=')) {
    return url;
  }
  
  // Verificar se é uma URL absoluta
  if (url.startsWith('http')) {
    // Aqui você pode implementar um serviço de otimização de imagem
    // Por exemplo, usando um CDN de imagens como Cloudinary, Imgix, etc.
    // Exemplo básico usando um parâmetro de largura
    if (url.includes('?')) {
      return `${url}&width=${width}&format=webp`;
    } else {
      return `${url}?width=${width}&format=webp`;
    }
  }
  
  // Para URLs relativas
  return url;
};

// Função para adiar o carregamento de scripts
export const loadScriptAsync = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Falha ao carregar o script: ${src}`));
    
    document.head.appendChild(script);
  });
};

// Classe para gerenciar o carregamento progressivo de recursos
export class ProgressiveLoader {
  private loadedResources: Set<string> = new Set();
  
  // Carregar um recurso apenas uma vez
  loadOnce(id: string, loadFn: () => void): void {
    if (this.loadedResources.has(id)) return;
    
    this.loadedResources.add(id);
    loadFn();
  }
  
  // Verificar se um recurso já foi carregado
  isLoaded(id: string): boolean {
    return this.loadedResources.has(id);
  }
}

// Singleton para gerenciar recursos em toda a aplicação
export const resourceLoader = new ProgressiveLoader();
