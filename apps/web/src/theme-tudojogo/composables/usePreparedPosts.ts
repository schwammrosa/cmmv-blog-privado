import { stripHtml } from '../../composables/useUtils.js';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  [key: string]: any;
}

const DEFAULT_EXCERPT_LENGTH = 150;

/**
 * Prepara um único post, garantindo que ele tenha um resumo (excerpt).
 * Se o post não tiver um resumo, ele será gerado a partir do conteúdo.
 * 
 * @param post - O objeto do post a ser preparado.
 * @returns O post com o resumo garantido.
 */
export function preparePost(post: Post): Post {
  if (post.excerpt && post.excerpt.length > 0) {
    return post;
  }

  const newExcerpt = stripHtml(post.content).substring(0, DEFAULT_EXCERPT_LENGTH) + '...';
  
  return {
    ...post,
    excerpt: newExcerpt,
  };
}

/**
 * Prepara uma lista de posts, garantindo que cada um tenha um resumo.
 * 
 * @param posts - A lista de posts a serem preparados.
 * @returns A lista de posts com resumos garantidos.
 */
export function preparePosts(posts: Post[]): Post[] {
  if (!Array.isArray(posts)) {
    return [];
  }
  return posts.map(preparePost);
}

/**
 * Hook composable para preparar posts.
 * Atualmente, ele apenas expõe as funções de preparação.
 * Pode ser estendido no futuro para manter estado, se necessário.
 */
export function usePreparedPosts() {
  return {
    preparePost,
    preparePosts,
  };
} 