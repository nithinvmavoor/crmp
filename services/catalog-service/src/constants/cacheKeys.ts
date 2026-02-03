export const cacheKeys = {
    menuAll: () => "menu:{all}",
    menuByCategory: (category: string) => `menu:category:${{ category }}`,
};
