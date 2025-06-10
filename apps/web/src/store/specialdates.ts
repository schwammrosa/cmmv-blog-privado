import { defineStore } from 'pinia'

export const useSpecialDatesStore = defineStore('specialdates', {
    state: () => ({
        data: null as any,
        isLoaded: false
    }),
    actions: {
        setSpecialDates(data: any) {
            this.data = data;
            this.isLoaded = true;
        },

        forceRefresh() {
            this.isLoaded = false;
        }
    },
    getters: {
        getSpecialDates: (state) => state.data,

        getActiveDates: (state) => {
            if (!state.data) {
                return [];
            }

            let datesArray: any[] | null = null;

            if (Array.isArray(state.data)) {
                datesArray = state.data;
            } else if (state.data.data && Array.isArray(state.data.data)) {
                datesArray = state.data.data;
            } else if (state.data.data && state.data.data.value) {
                if (Array.isArray(state.data.data.value)) {
                    datesArray = state.data.data.value;
                } else if (state.data.data.value.data && Array.isArray(state.data.data.value.data)) {
                    datesArray = state.data.data.value.data;
                }
            } else if (state.data.result && Array.isArray(state.data.result)) {
                datesArray = state.data.result;
            }

            if (!datesArray) {
                if (typeof state.data === 'object') {
                    const keys = Object.keys(state.data);
                    for (const key of keys) {
                        if (Array.isArray(state.data[key])) {
                            datesArray = state.data[key];
                            break;
                        }
                    }
                }
            }

            if (!datesArray)
                return [];

            try {
                const activeDates = datesArray.filter((date: any) => date && date.active);
                return activeDates;
            } catch (error) {
                return [];
            }
        },

        hasValidData: (state) => {
            if (!state.data) return false;
            const activeDates = useSpecialDatesStore().getActiveDates;
            return activeDates.length > 0;
        },

        hasLoaded: (state) => state.isLoaded
    },
})
