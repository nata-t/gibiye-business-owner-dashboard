<script setup>
import { onBeforeMount, ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import Cookies from 'js-cookie';

const businessModel = ref();
onBeforeMount(async () => {
    const loggedBusiness = await Cookies.get('loggedUser');
    if (loggedBusiness) {
        const business = JSON.parse(loggedBusiness);
        businessModel.value = business.businessModel;
    }
});

const serviceItems_1 = ref({
    label: 'Service Management',
    icon: 'pi pi-database',
    items: [
        {
            label: 'Service',
            icon: 'pi pi-fw pi-shopping-bag',
            to: '/service-management/service'
        },
        {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            to: '/service-management/new'
        }
    ]
});
const serviceItems_2 = ref({
    label: 'Scheduling',
    icon: 'pi pi-database',
    items: [
        {
            label: 'Appointment',
            icon: 'pi pi-fw pi-calendar-plus',
            to: '/scheduling/appointment'
        },
        {
            label: 'Calendar View',
            icon: 'pi pi-fw pi-desktop',
            to: '/scheduling/calendar'
        }
    ]
});

const stockItems_1 = ref({
    label: 'Stock Management',
    icon: 'pi pi-database',
    items: [
        {
            label: 'Stock',
            icon: 'pi pi-fw pi-file-excel',
            to: '/pages/empty'
        },
        {
            label: 'New',
            icon: 'pi pi-fw pi-slack',
            to: '/pages/empty'
        }
    ]
});

const stockItems_2 = ref({
    label: 'Purchasings',
    icon: 'pi pi-database',
    items: [
        {
            label: 'Delivery Scheduling',
            icon: 'pi pi-fw pi-file-excel',
            to: '/pages/empty'
        },
        {
            label: 'schedule View',
            icon: 'pi pi-fw pi-slack',
            to: '/game/results'
        }
    ]
});

const menuItems_1 = ref({
    label: 'Menu Management',
    icon: 'pi pi-database',
    items: [
        {
            label: 'menu',
            icon: 'pi pi-fw pi-file-excel',
            to: '/pages/empty'
        },
        {
            label: 'New',
            icon: 'pi pi-fw pi-slack',
            to: '/game/results'
        }
    ]
});

const menuItems_2 = ref({
    label: 'Orders',
    icon: 'pi pi-database',
    items: [
        {
            label: 'Queue',
            icon: 'pi pi-fw pi-file-excel',
            to: '/pages/empty'
        },
        {
            label: 'View',
            icon: 'pi pi-fw pi-slack',
            to: '/game/results'
        }
    ]
});

const getSidebarItems_1 = () => {
    switch (businessModel.value) {
        case 'SERVICE':
            return serviceItems_1.value;
        case 'STOCK':
            return stockItems_1.value;
        case 'MENU':
            return menuItems_1.value;
        default:
            return serviceItems_1.value;
    }
};

const getSidebarItems_2 = () => {
    switch (businessModel.value) {
        case 'SERVICE':
            return serviceItems_2.value;
        case 'STOCK':
            return stockItems_2.value;
        case 'MENU':
            return menuItems_2.value;
        default:
            return serviceItems_2.value;
    }
};

const model = ref([
    {
        label: 'Dashboards',
        icon: 'pi pi-chart-line',
        items: [
            {
                label: 'Analysis',
                icon: 'pi pi-fw pi-chart-bar',
                to: '/'
            }
        ]
    },
    getSidebarItems_1(),
    getSidebarItems_2(),
    {
        label: 'Profile Management',
        icon: 'pi pi-users',
        items: [
            {
                label: 'Post And Comment',
                icon: 'pi pi-fw pi-comments',
                to: '/profile-management/posts-comments'
            },
            {
                label: 'compose',
                icon: 'pi pi-fw pi-plus',
                to: '/profile-management/compose'
            },
            {
                label: 'Edit Profile',
                icon: 'pi pi-fw pi-user-edit',
                to: '/pages/empty'
            }
        ]
    },
    {
        label: 'Customer Management',
        icon: 'pi pi-users',
        items: [
            {
                label: 'Customer Profile',
                icon: 'pi pi-fw pi-users',
                to: '/pages/empty'
            },
            {
                label: 'Customer Feedback',
                icon: 'pi pi-fw pi-envelope',
                to: '/pages/empty'
            },
            {
                label: 'Loyalty Program',
                icon: 'pi pi-fw pi-star',
                to: '/pages/empty'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <AppMenuItem :item="item" root :index="i" />

            <li class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
