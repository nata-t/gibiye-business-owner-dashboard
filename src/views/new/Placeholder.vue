<script setup>
import { onBeforeMount, ref } from 'vue';
import Cookies from 'js-cookie';
import MenuAnalysis from './MenuAnalysis.vue';
import ServiceAnalysis from './ServiceAnalysis.vue';
import StockAnalysis from './StockAnalysis.vue';

const model = ref('');

onBeforeMount(() => {
    manageHomeRoute();
});

const manageHomeRoute = () => {
    const loggedUser = Cookies.get('loggedUser');
    if (!loggedUser) return;

    try {
        const parsedUser = JSON.parse(loggedUser);
        switch (parsedUser.businessModel) {
            case 'SERVICE':
                model.value = 'Service';
                break;
            case 'STOCK':
                model.value = 'Stock';
                break;
            case 'MENU':
                model.value = 'Menu';
                break;
            default:
                console.warn('Unknown business model:', parsedUser.businessModel);
        }
    } catch (error) {
        console.error('Error parsing loggedUser cookie:', error);
    }
};
</script>

<template>
    <MenuAnalysis v-if="model === 'Menu'" />
    <ServiceAnalysis v-if="model === 'Service'" />
    <StockAnalysis v-if="model === 'Stock'" />
</template>
