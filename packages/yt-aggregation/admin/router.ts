//@ts-nocheck
import { RouteRecordRaw } from 'vue-router';

import { useNavbar } from '@cmmv/blog/admin/composable/useNavbar';
import AdminLayout from '@cmmv/blog/admin/layouts/AdminLayout.vue';
import ChannelsView from './views/ChannelsView.vue';
import VideosView from './views/VideosView.vue';

export const ytFeedRoutes: RouteRecordRaw[] = [
    {
        path: '/ytfeed',
        component: AdminLayout,
        children: [
            {
                path: 'channels',
                component: ChannelsView,
                name: 'yt-feed-channels'
            },
            {
                path: 'videos',
                component: VideosView,
                name: 'yt-feed-videos'
            }
        ]
    },
] as RouteRecordRaw[]

useNavbar().addItems([
    {
        label: 'Channels',
        icon: 'M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z',
        to: '/ytfeed/channels',
        group: 'Youtube'
    },
    {
        label: 'Videos',
        icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM5 4h7a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
        to: '/ytfeed/videos',
        group: 'Youtube'
    }
])

