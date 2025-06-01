import { defineStore } from 'pinia'

export const useCouponsStore = defineStore('coupons', {
    state: () => ({
        featuredCoupons: [] as any[],
        top25Coupons: [] as any[],
    }),
    actions: {
        setFeaturedCoupons(data: any[]) {
            this.featuredCoupons = data || []
        },
        setTop25Coupons(data: any[]) {
            this.top25Coupons = data || []
        }
    },
    getters: {
        getFeaturedCoupons: (state) => state.featuredCoupons,
        getTop25Coupons: (state) => state.top25Coupons,
    }
}) 