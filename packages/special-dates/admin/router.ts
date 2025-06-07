//@ts-nocheck
import { RouteRecordRaw } from 'vue-router';

import { useNavbar } from '@cmmv/blog/admin/composable/useNavbar';
import AdminLayout from '@cmmv/blog/admin/layouts/AdminLayout.vue';
import SpecialDatesView from './views/SpecialDatesView.vue';

export const specialDatesRoutes: RouteRecordRaw[] = [
    {
        path: '/special-dates',
        component: AdminLayout,
        children: [
            {
                path: '',
                component: SpecialDatesView,
                name: 'special-dates'
            }
        ]
    },
] as RouteRecordRaw[]

useNavbar().addItems([
    {
        label: 'Special Dates',
        icon: 'fas fa-calendar-alt',
        to: '/special-dates',
        group: 'Content'
    }
]) 