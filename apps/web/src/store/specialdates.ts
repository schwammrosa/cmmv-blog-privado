import { defineStore } from 'pinia'

export const useSpecialDatesStore = defineStore('specialdates', {
    state: () => ({
        data: null as any,
        isLoaded: false
    }),
    actions: {
        setSpecialDates(data: any) {
            //console.log('[SpecialDatesStore] Setting data:', data ? 'data present' : 'no data', 
            //    typeof data === 'object' ? Object.keys(data) : 'not object');
            this.data = data;
            this.isLoaded = true;
        },
        
        forceRefresh() {
            //console.log('[SpecialDatesStore] Force refresh called');
            this.isLoaded = false;
        }
    },
    getters: {
        getSpecialDates: (state) => state.data,
        
        getActiveDates: (state) => {
            if (!state.data) {
                //console.log('[SpecialDatesStore] No data available');
                return [];
            }
            
            //console.log('[SpecialDatesStore] Raw data structure:', 
            //    typeof state.data === 'object' ? JSON.stringify(Object.keys(state.data)) : typeof state.data);
            
            // Extrai os dados da estrutura aninhada, se necessário
            let datesArray: any[] | null = null;
            
            // Tenta extrair os dados de todas as estruturas possíveis
            if (Array.isArray(state.data)) {
                //console.log('[SpecialDatesStore] Data is already an array');
                datesArray = state.data;
            } else if (state.data.data && Array.isArray(state.data.data)) {
                //console.log('[SpecialDatesStore] Found array in data.data');
                datesArray = state.data.data;
            } else if (state.data.data && state.data.data.value) {
                if (Array.isArray(state.data.data.value)) {
                    //console.log('[SpecialDatesStore] Found array in data.data.value');
                    datesArray = state.data.data.value;
                } else if (state.data.data.value.data && Array.isArray(state.data.data.value.data)) {
                    //console.log('[SpecialDatesStore] Found array in data.data.value.data');
                    datesArray = state.data.data.value.data;
                }
            } else if (state.data.result && Array.isArray(state.data.result)) {
                //console.log('[SpecialDatesStore] Found array in data.result');
                datesArray = state.data.result;
            }
            
            // Se não encontrou um array, verifica outras estruturas possíveis
            if (!datesArray) {
                // Log todos os caminhos para debug
                //console.log('[SpecialDatesStore] Exploring all paths in data');
                //if (state.data.data) console.log('- data.data:', typeof state.data.data, Array.isArray(state.data.data));
                //if (state.data.result) console.log('- data.result:', typeof state.data.result, Array.isArray(state.data.result));
                
                // Última tentativa
                if (typeof state.data === 'object') {
                    const keys = Object.keys(state.data);
                    for (const key of keys) {
                        if (Array.isArray(state.data[key])) {
                            console.log(`[SpecialDatesStore] Found array in data.${key}`);
                            datesArray = state.data[key];
                            break;
                        }
                    }
                }
            }
            
            // Garante que é um array antes de filtrar
            if (!datesArray) {
                //console.log('[SpecialDatesStore] No array found in any path');
                return [];
            }
            
            //console.log('[SpecialDatesStore] Found array with length:', datesArray.length);
            
            try {
                const activeDates = datesArray.filter((date: any) => date && date.active);
                //console.log('[SpecialDatesStore] Active dates:', activeDates.length);
                
                return activeDates;
            } catch (error) {
                //console.error('[SpecialDatesStore] Error filtering dates:', error);
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
