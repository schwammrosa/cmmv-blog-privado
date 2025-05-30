import { App } from 'vue';
import { createRouter } from './router';
import { vIntersect } from './utils/performance';
import './critical.css'; // Importa o CSS crítico para carregamento prioritário
import './style.css';

// Registra a diretiva v-intersect para lazy loading
export const setupTheme = (app: App) => {
  // Registra a diretiva v-intersect para o lazy loading
  app.directive('intersect', vIntersect);
  
  // Configura outras inicializações específicas do tema aqui
  
  // Retorna o router do tema
  const router = createRouter();
  
  return {
    router
  };
};

// Exporta o router para ser usado pela aplicação principal
export { createRouter };
