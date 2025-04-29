import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: null as any,
    }),
    actions: {
        setCategories(data: any) {
            this.categories = data
        }
    },
    getters: {
        getCategories: (state) => state.categories
    }
})
