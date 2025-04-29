import { ref } from 'vue';

interface Theme {
    name: string;
    active: boolean;
}

const themes = ref<Theme[]>([]);

export const useTheme = () => {
    const addTheme = (item: Theme) => {
        themes.value.push(item);
    }

    const getActiveTheme = () => {
        return themes.value.find(theme => theme.active);
    }

    return {
        themes,
        addTheme,
        getActiveTheme,
    };
}

export const themeStore = useTheme();
