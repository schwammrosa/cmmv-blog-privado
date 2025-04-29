//@ts-nocheck
import { RouteRecordRaw } from 'vue-router';

import { useNavbar } from '@cmmv/blog/admin/composable/useNavbar';
import AdminLayout from '@cmmv/blog/admin/layouts/AdminLayout.vue';
import ChannelsView from './views/ChannelsView.vue';
import RawView from './views/RawView.vue';
import ParserView from './views/ParserView.vue';

export const rssFeedRoutes: RouteRecordRaw[] = [
    {
        path: '/feed',
        component: AdminLayout,
        children: [
            { path: 'channels', component: ChannelsView },
            { path: 'raw', component: RawView },
            { path: 'parser', component: ParserView },
        ]
    },
] as RouteRecordRaw[]

useNavbar().addItems([
    {
        label: 'Channels',
        icon: 'M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z',
        to: '/feed/channels',
        group: 'Feeds'
    },
    {
        label: 'Parser',
        icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
        to: '/feed/parser',
        group: 'Feeds'
    },
    {
        label: 'Raw',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
        to: '/feed/raw',
        group: 'Feeds'
    }
])

