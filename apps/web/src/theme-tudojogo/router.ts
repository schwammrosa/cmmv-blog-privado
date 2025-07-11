import {
    createMemoryHistory, createWebHistory,
    createRouter as _createRouter
} from 'vue-router';

// Agrupamento de rotas para melhor organização
const mainRoutes = [
    { path: '', component: () => import('./views/PageHome.vue') },
    { path: '/post/:slug', component: () => import('./views/PagePost.vue') },
    { path: '/preview/:id', component: () => import('./views/PagePost.vue') },
    { path: '/preview-page/:id', component: () => import('./views/PagePage.vue') },
];

const taxonomyRoutes = [
    { path: '/category/:slug', component: () => import('./views/PageCategory.vue') },
    { path: '/tag/:slug', component: () => import('./views/PageTag.vue') },
    { path: '/tags', component: () => import('./views/PageAllTags.vue') },
    { path: '/author/:slug', component: () => import('./views/PageAuthor.vue') },
];

const legalRoutes = [
    { path: '/terms-of-service', component: () => import('./views/TermsOfService.vue') },
    { path: '/terms-of-privacy', component: () => import('./views/TermsOfPrivacy.vue') },
    { path: '/contact', component: () => import('./views/Contact.vue') }
];

/**
 * Cria e configura o router para o tema TudoJogo
 * @returns Instância configurada do Vue Router
 */
export function createRouter() {
    return _createRouter({
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        routes: [
            {
                path: '/',
                component: () => import('./templates/TemplateDefault.vue'),
                children: [...mainRoutes, ...taxonomyRoutes, ...legalRoutes]
            }
        ]
    });
}