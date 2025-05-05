import { defineStore } from 'pinia'

export const useMostAccessedPostsStore = defineStore('mostaccessedposts', {
    state: () => ({
        data: null as any,
    }),
    actions: {
        setMostAccessedPosts(data: any) {
            this.data = data
        },
    },
    getters: {
        getMostAccessedPosts: (state) => state.data,
    },
})
