import { ref } from 'vue';

interface NavbarItem {
    label: string;
    icon: string;
    group?: string;
    to: string;
}

const items = ref<NavbarItem[]>([]);

export const useNavbar = () => {
    const addItem = (item: NavbarItem) => {
        items.value.push(item);
    }

    const addItems = (newItems: NavbarItem[]) => {
        items.value.push(...newItems);
    }

    const removeItem = (item: NavbarItem) => {
        items.value = items.value.filter(i => i !== item);
    }

    const removeItemByPath = (path: string) => {
        items.value = items.value.filter(i => i.to !== path);
    }

    const clearItems = () => {
        items.value = [];
    }

    const getItems = () => {
        const groupedItems: Record<string, NavbarItem[]> = {};
        const defaultGroup = 'ungrouped';

        items.value.forEach(item => {
            const group = item.group || defaultGroup;

            if (!groupedItems[group])
                groupedItems[group] = [];

            groupedItems[group].push(item);
        });

        return groupedItems;
    }

    const hasItem = (path: string) => {
        return items.value.some(item => item.to === path);
    }

    return {
        items,
        addItem,
        addItems,
        removeItem,
        removeItemByPath,
        clearItems,
        getItems,
        hasItem
    };
}

export const navbarStore = useNavbar();
