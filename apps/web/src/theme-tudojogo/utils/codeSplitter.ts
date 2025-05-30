/**
 * Utilitário para dividir o código JavaScript e reduzir o bundle inicial
 * Implementa técnicas de code splitting e carregamento sob demanda
 */

// Define os componentes que podem ser carregados de forma assíncrona
export interface AsyncComponentMap {
  [key: string]: () => Promise<any>;
}

/**
 * Registra componentes para carregamento assíncrono
 */
export function registerAsyncComponents(components: AsyncComponentMap) {
  return components;
}

/**
 * Carrega um módulo apenas quando necessário
 */
export function loadModuleOnDemand<T>(
  importFn: () => Promise<T>,
  condition: () => boolean
): Promise<T | null> {
  return new Promise((resolve) => {
    if (condition()) {
      importFn().then(resolve).catch(() => resolve(null));
    } else {
      resolve(null);
    }
  });
}

/**
 * Carrega componentes apenas quando estiverem visíveis na viewport
 */
export function loadComponentWhenVisible(
  elementSelector: string,
  importFn: () => Promise<any>
): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        importFn().then(() => {
          observer.disconnect();
        }).catch(error => {
          console.error('Erro ao carregar componente:', error);
        });
      }
    });
  }, { rootMargin: '200px' });

  // Observar o elemento alvo
  const element = document.querySelector(elementSelector);
  if (element) {
    observer.observe(element);
  }
}

/**
 * Função para carregar scripts de terceiros sob demanda
 */
export function loadThirdPartyScriptOnDemand(
  scriptUrl: string,
  selector: string,
  options: { async?: boolean; defer?: boolean; attributes?: Record<string, string> } = {}
): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        
        if (options.async) script.async = true;
        if (options.defer) script.defer = true;
        
        // Adicionar atributos adicionais
        if (options.attributes) {
          Object.entries(options.attributes).forEach(([key, value]) => {
            script.setAttribute(key, value);
          });
        }
        
        document.body.appendChild(script);
        observer.disconnect();
      }
    });
  }, { rootMargin: '200px' });

  // Observar o elemento alvo
  const element = document.querySelector(selector);
  if (element) {
    observer.observe(element);
  }
}

/**
 * Remove scripts não utilizados com base na rota atual
 */
export function cleanupUnusedScripts(routePath: string): void {
  // Scripts específicos para cada tipo de página
  const scriptPatterns: Record<string, string[]> = {
    home: ['carousel', 'slider', 'featured'],
    post: ['comments', 'social-share', 'related-posts'],
    category: ['category-filter', 'pagination'],
    search: ['search-results', 'filter'],
    page: ['page-content']
  };

  // Determinar página atual
  let currentPageType = 'other';
  if (routePath === '/' || routePath === '') {
    currentPageType = 'home';
  } else if (routePath.includes('/post/')) {
    currentPageType = 'post';
  } else if (routePath.includes('/category/')) {
    currentPageType = 'category';
  } else if (routePath.includes('/search')) {
    currentPageType = 'search';
  } else if (routePath.includes('/page/')) {
    currentPageType = 'page';
  }

  // Coletar todos os scripts que não pertencem à página atual
  const scriptsToRemove: string[] = [];
  
  Object.entries(scriptPatterns).forEach(([pageType, patterns]) => {
    if (pageType !== currentPageType) {
      scriptsToRemove.push(...patterns);
    }
  });

  // Remover scripts não utilizados
  if (typeof document !== 'undefined') {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src') || '';
      if (scriptsToRemove.some(pattern => src.includes(pattern))) {
        script.remove();
      }
    });
  }
}

/**
 * Inicializa o sistema de divisão de código
 */
export function initCodeSplitting(router: any): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Limpar scripts não utilizados em cada mudança de rota
  router.afterEach((to: any) => {
    // Executar limpeza de scripts com um pequeno atraso
    setTimeout(() => {
      cleanupUnusedScripts(to.path);
    }, 100);
  });
}
