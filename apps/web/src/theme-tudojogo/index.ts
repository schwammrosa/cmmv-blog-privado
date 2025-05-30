import { App } from 'vue';
import { createRouter } from './router';
import { vIntersect } from './utils/performance';
import { initJavaScriptOptimizations } from './utils/jsBundleOptimizer';
import { initCodeSplitting } from './utils/codeSplitter';
import './critical.css'; // Importa o CSS crítico para carregamento prioritário
import './style.css';

// Registra a diretiva v-intersect para lazy loading
export const setupTheme = (app: App) => {
  // Registra a diretiva v-intersect para o lazy loading
  app.directive('intersect', vIntersect);
  
  // Configura outras inicializações específicas do tema aqui
  
  // Retorna o router do tema
  const router = createRouter();
  
  // Inicializa as otimizações de JavaScript
  if (typeof window !== 'undefined') {
    // Inicializa o sistema de divisão de código
    initCodeSplitting(router);
    
    // Inicializar as otimizações de JavaScript após a renderização inicial
    setTimeout(() => {
      initJavaScriptOptimizations();
    }, 1000);
    
    // Implementar carregamento lazy para scripts pesados
    window.addEventListener('load', () => {
      // Postergar execução de código não crítico
      setTimeout(() => {
        // Remover polyfills desnecessários
        const userAgent = window.navigator.userAgent;
        const isModernBrowser = 
          'IntersectionObserver' in window &&
          'requestIdleCallback' in window &&
          'customElements' in window;
        
        if (isModernBrowser) {
          // Remover polyfills para navegadores modernos
          document.querySelectorAll('script[src*="polyfill"]').forEach(script => {
            script.remove();
          });
        }
      }, 2000);
    });
  }
  
  return {
    router
  };
};

// Exporta o router para ser usado pela aplicação principal
export { createRouter };
