//@ts-nocheck
import { RouteRecordRaw } from 'vue-router';
import { useNavbar } from './composable/useNavbar';

import AdminLayout from './layouts/AdminLayout.vue';
import HomeView from './views/HomeView.vue';
import PostsView from './views/PostsView.vue';
import PagesView from './views/PagesView.vue';
import SettingsView from './views/SettingsView.vue';
import CategoriesView from './views/CategoriesView.vue';
import TagsView from './views/TagsView.vue';
import ProfileView from './views/ProfileView.vue';
import AuthorsView from './views/AuthorsView.vue';
import MediasView from './views/MediasView.vue';
import MembersView from './views/MembersView.vue';
import CommentsView from './views/CommentsView.vue';
import ImportsView from './views/ImportsView.vue';
import ImagesToolView from './views/ImagesToolView.vue';
import ThemesView from './views/ThemesView.vue';
import CoverView from './views/CoverView.vue';
import WhitelabelView from './views/WhitelabelView.vue';
import WhitelabelAccessView from './views/WhitelabelAccessView.vue';

import SetupView from './views/SetupView.vue';
import PostView from './views/PostView.vue';
import PageView from './views/PageView.vue';

export const blogAdminRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        component: AdminLayout,
        children: [
            { path: '', component: HomeView },
            { path: '/posts', component: PostsView },
            { path: '/pages', component: PagesView },
            { path: '/settings', component: SettingsView },
            { path: '/categories', component: CategoriesView },
            { path: '/tags', component: TagsView },
            { path: '/profile', component: ProfileView },
            { path: '/authors', component: AuthorsView },
            { path: '/medias', component: MediasView },
            { path: '/members', component: MembersView },
            { path: '/comments', component: CommentsView },
            { path: '/imports', component: ImportsView },
            { path: '/themes', component: ThemesView },
            { path: '/cover', component: CoverView },
            { path: '/whitelabel', component: WhitelabelView },
            { path: '/whitelabel-access', component: WhitelabelAccessView }
        ]
    },
    {
        path: '/setup',
        name: 'setup',
        component: SetupView
    },
    {
        path: '/post/:id',
        name: 'editPost',
        component: PostView
    },
    {
        path: '/post',
        name: 'newPost',
        component: PostView,
    },
    {
        path: '/page/:id',
        name: 'editPage',
        component: PageView
    },
    {
        path: '/page',
        name: 'newPage',
        component: PageView
    },
] as RouteRecordRaw[];

useNavbar().addItems([
    {
        label: 'Dashboard',
        icon: 'fas fa-home',
        to: '/'
    },
    {
        label: 'Posts',
        icon: 'fas fa-file-alt',
        to: '/posts',
        group: 'Blog'
    },
    {
        label: 'Pages',
        icon: 'fas fa-copy',
        to: '/pages',
        group: 'Blog'
    },
    {
        label: 'Comments',
        icon: 'fas fa-comments',
        to: '/comments',
        group: 'Blog'
    },
    {
        label: 'Medias',
        icon: 'fas fa-images',
        to: '/medias',
        group: 'Blog'
    },
    {
        label: 'Categories',
        icon: 'fas fa-folder',
        to: '/categories',
        group: 'Blog'
    },
    {
        label: 'Tags',
        icon: 'fas fa-tags',
        to: '/tags',
        group: 'Blog'
    },
    {
        label: 'Authors',
        icon: 'fas fa-user-edit',
        to: '/authors',
        group: 'Blog'
    },
    {
        label: 'Members',
        icon: 'fas fa-users',
        to: '/members',
        group: 'Blog'
    },
    {
        label: 'Settings',
        icon: 'fas fa-cog',
        to: '/settings',
        group: 'Blog'
    },
    {
        label: 'Imports',
        icon: 'fas fa-file-import',
        to: '/imports',
        group: 'Blog'
    },
    {
        label: 'Themes',
        icon: 'fas fa-palette',
        to: '/themes',
        group: 'Blog'
    },
    {
        label: 'Cover',
        icon: 'fas fa-image',
        to: '/cover',
        group: 'Blog'
    },
    {
        label: 'Whitelabels',
        icon: 'fas fa-globe',
        to: '/whitelabel',
        group: 'Whitelabel'
    },
    {
        label: 'Access',
        icon: 'fas fa-key',
        to: '/whitelabel-access',
        group: 'Whitelabel'
    },
])

