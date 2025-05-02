//@ts-nocheck
import { RouteRecordRaw } from 'vue-router';

import { useNavbar } from '@cmmv/blog/admin/composable/useNavbar';
import AdminLayout from '@cmmv/blog/admin/layouts/AdminLayout.vue';
import NetworkView from './views/NetworkView.vue';

export const affiliateRoutes: RouteRecordRaw[] = [
    {
        path: '/affiliate',
        component: AdminLayout,
        children: [
            {
                path: 'networks',
                component: NetworkView,
                name: 'affiliate.networks'
            }
        ]
    },
] as RouteRecordRaw[]

useNavbar().addItems([
    {
        label: 'Campaigns',
        icon: 'fas fa-bullhorn',
        to: '/affiliate/campaigns',
        group: 'Affiliate'
    },
    {
        label: 'Coupons',
        icon: 'fas fa-ticket-alt',
        to: '/affiliate/coupons',
        group: 'Affiliate'
    },
    {
        label: 'Networks',
        icon: 'fas fa-network-wired',
        to: '/affiliate/networks',
        group: 'Affiliate'
    }
])

