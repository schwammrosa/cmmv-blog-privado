/**
 * Utilitário para otimização de bundles JavaScript
 * Reduz o tamanho e melhora o carregamento de código JavaScript
 */

// Mapeia componentes para carregar sob demanda
const lazyComponentMap: Record<string, () => Promise<any>> = {};

/**
 * Registra um componente para carregamento lazy
 */
export function registerLazyComponent(name: string, importFn: () => Promise<any>): void {
  lazyComponentMap[name] = importFn;
}

/**
 * Obtém um componente para carregamento lazy
 */
export function getLazyComponent(name: string): (() => Promise<any>) | null {
  return lazyComponentMap[name] || null;
}

/**
 * Carrega scripts de terceiros apenas quando necessário
 */
export function loadThirdPartyScript(src: string, attributes: Record<string, string> = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    // Verificar se o script já está carregado
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      return resolve();
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    // Adicionar atributos
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
    
    script.onload = () => resolve();
    script.onerror = (err) => reject(new Error(`Falha ao carregar script: ${src}`));
    
    // Adicionar ao final do body para não bloquear renderização
    document.body.appendChild(script);
  });
}

/**
 * Adia a execução de código não crítico
 */
export function deferNonCriticalCode(fn: () => void): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      fn();
    });
  } else {
    setTimeout(fn, 1000);
  }
}

/**
 * Remove bibliotecas não utilizadas com base na URL atual
 */
export function removeUnusedLibraries(): void {
  // Esta função avalia a página atual e remove scripts desnecessários
  const currentPath = window.location.pathname;
  
  // Funções para remover scripts específicos
  const cleanupFunctions: Record<string, () => void> = {
    // Remover bibliotecas de galeria quando não estiver em páginas de post
    removeGalleryLibs: () => {
      if (!currentPath.includes('/post/')) {
        document.querySelectorAll('script[src*="lightbox"], script[src*="gallery"]').forEach(script => {
          script.remove();
        });
      }
    },
    
    // Remover bibliotecas de comentários quando não necessário
    removeCommentLibs: () => {
      if (!currentPath.includes('/post/')) {
        document.querySelectorAll('script[src*="comment"], script[src*="disqus"]').forEach(script => {
          script.remove();
        });
      }
    },
    
    // Remover bibliotecas de compartilhamento social quando não necessário
    removeSocialLibs: () => {
      if (currentPath === '/' || currentPath.includes('/category/')) {
        document.querySelectorAll('script[src*="social"], script[src*="share"]').forEach(script => {
          script.remove();
        });
      }
    }
  };
  
  // Executar todas as funções de limpeza
  Object.values(cleanupFunctions).forEach(fn => {
    deferNonCriticalCode(fn);
  });
}

/**
 * Otimiza os manipuladores de eventos para reduzir o consumo de memória
 */
export function optimizeEventListeners(): void {
  // Usar delegação de eventos para reduzir o número de listeners
  const eventDelegation = () => {
    // Remover listeners individuais de elementos semelhantes
    const delegatedEvents: Record<string, (e: Event) => void> = {};
    
    // Delegar cliques em links do menu
    delegatedEvents['menu-click'] = (e: Event) => {
      const target = e.target as HTMLElement;
      const menuItem = target.closest('[data-menu-item]');
      if (menuItem) {
        // Processar o clique no menu
        const action = menuItem.getAttribute('data-menu-action');
        if (action) {
          e.preventDefault();
          // Executar a ação correspondente
        }
      }
    };
    
    // Delegar cliques em botões de compartilhamento
    delegatedEvents['share-click'] = (e: Event) => {
      const target = e.target as HTMLElement;
      const shareBtn = target.closest('[data-share-platform]');
      if (shareBtn) {
        e.preventDefault();
        const platform = shareBtn.getAttribute('data-share-platform');
        const url = shareBtn.getAttribute('data-share-url') || window.location.href;
        const title = shareBtn.getAttribute('data-share-title') || document.title;
        
        // Compartilhar baseado na plataforma
        if (platform === 'twitter') {
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        } else if (platform === 'facebook') {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        }
      }
    };
    
    // Adicionar delegação de eventos ao documento
    Object.entries(delegatedEvents).forEach(([name, handler]) => {
      document.addEventListener('click', handler);
    });
  };
  
  // Executar após a renderização da página
  deferNonCriticalCode(eventDelegation);
}

/**
 * Função para inicializar todas as otimizações de JavaScript
 */
export function initJavaScriptOptimizations(): void {
  // Remover bibliotecas não utilizadas
  removeUnusedLibraries();
  
  // Otimizar manipuladores de eventos
  optimizeEventListeners();
  
  // Outras otimizações podem ser adicionadas aqui
}
