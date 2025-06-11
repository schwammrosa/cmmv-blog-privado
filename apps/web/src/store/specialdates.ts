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
            this.data = null;
            this.isLoaded = false;
            console.log('Store force refreshed - data and isLoaded reset');
        },

        reset() {
            this.data = null;
            this.isLoaded = false;
            console.log('Store reset completed');
        }
    },
    getters: {
        getSpecialDates: (state) => state.data,

        getActiveDates: (state) => {
            if (!state.data) {
                return [];
            }

            let datesArray: any[] | null = null;
            let sourceInfo = '';

            // Primeira tentativa: dados diretos como array
            if (Array.isArray(state.data)) {
                datesArray = state.data;
                sourceInfo = 'direct array';
            } 
            // Segunda tentativa: estrutura com .data (formato API client-side)
            else if (state.data.data && Array.isArray(state.data.data)) {
                datesArray = state.data.data;
                sourceInfo = 'data.data array';
            }
            // Terceira tentativa: estrutura de resposta completa da API  
            else if (state.data.result && Array.isArray(state.data.result)) {
                datesArray = state.data.result;
                sourceInfo = 'data.result array';
            }
            // Quarta tentativa: verificar se é uma resposta de status HTTP
            else if (typeof state.data === 'object' && state.data.status === 200) {
                sourceInfo = 'HTTP response format';
                // Formato: {status: 200, processingTime: 1, result: {...}}
                if (state.data.result && Array.isArray(state.data.result)) {
                    datesArray = state.data.result;
                    sourceInfo += ' - result array';
                } else if (state.data.result && state.data.result.data && Array.isArray(state.data.result.data)) {
                    datesArray = state.data.result.data;
                    sourceInfo += ' - result.data array';
                }
            }
            // Quinta tentativa: estruturas aninhadas com .value
            else if (state.data.data && state.data.data.value) {
                if (Array.isArray(state.data.data.value)) {
                    datesArray = state.data.data.value;
                    sourceInfo = 'data.data.value array';
                } else if (state.data.data.value.data && Array.isArray(state.data.data.value.data)) {
                    datesArray = state.data.data.value.data;
                    sourceInfo = 'data.data.value.data array';
                }
            }

            // Fallback: procurar qualquer array no objeto
            if (!datesArray && typeof state.data === 'object') {
                const keys = Object.keys(state.data);
                for (const key of keys) {
                    if (Array.isArray(state.data[key])) {
                        datesArray = state.data[key];
                        sourceInfo = `fallback key: ${key}`;
                        break;
                    }
                }
            }

            console.log('🔍 getActiveDates debug:', {
                sourceInfo,
                found: !!datesArray,
                length: datesArray?.length || 0,
                dataKeys: typeof state.data === 'object' ? Object.keys(state.data) : 'not object'
            });

            if (!datesArray) {
                return [];
            }

            try {
                const activeDates = datesArray.filter((date: any) => {
                    if (!date) {
                        return false;
                    }
                    
                    // Verificar diferentes formatos do campo active
                    const isActive = date.active === true || date.active === 1 || date.active === '1' || date.active === 'true';
                    return isActive;
                });
                
                console.log(`✅ Found ${activeDates.length} active dates from ${sourceInfo}`);
                return activeDates;
            } catch (error) {
                console.error('Error filtering dates:', error);
                return [];
            }
        },

        hasValidData: (state) => {
            if (!state.data) return false;
            
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

            if (!datesArray) return false;

            try {
                const activeDates = datesArray.filter((date: any) => date && date.active);
                return activeDates.length > 0;
            } catch (error) {
                return false;
            }
        },

        hasLoaded: (state) => state.isLoaded
    },
})
