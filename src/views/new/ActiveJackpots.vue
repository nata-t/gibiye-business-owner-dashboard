<script setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { HTTP } from '@/service/axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const columns = ref([]);
const topWinnings = ref([]);
const filters1 = ref(null);
const loading1 = ref(null);
const statuses = reactive(['paid', 'unpaid']);

onBeforeMount(() => {
    api();
    initFilters1();
});
const api = async () => {
    try {
        const response = await HTTP.post('dbdata');
        if (response.data.err) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
            setTimeout(tryAgain, 4000);
        } else {
            columns.value = response.data.res.columns;
            topWinnings.value = response.data.res.data;
            loading1.value = false;
            topWinnings.value.forEach((topWinning) => (topWinning.date = new Date(topWinning.date)));
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
        setTimeout(tryAgain, 4000);
    }
};
const tryAgain = () => {
    toast.remove('error');
    api();
};

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        stake: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        ticket: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        shop: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        winning: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};
const clearFilter1 = () => {
    initFilters1();
};

const getStatusColor = (status) => {
    switch (status) {
        case 'paid':
            return 'null';
        case 'unpaid':
            return 'warning';
        case 'active':
            return 'info';
        case 'deactive':
            return 'info';
        case 'unclaimed':
            return 'info';
        case 'locked':
            return 'info';
        case 'redeemed':
            return 'info';
    }
};
const navigateToNewShop = () => {
    router.push('/user-accounts/new-shop');
};

const currentYear = ref(new Date().getFullYear());
</script>
<template>
    <div class="card">
        <h5>ACTIVE JACKPOTS</h5>
        <DataTable
            :value="topWinnings"
            tableStyle="min-width: 50rem"
            :paginator="true"
            :rows="10"
            :rowHover="true"
            v-model:filters="filters1"
            filterDisplay="menu"
            :loading="loading1"
            :filters="filters1"
            :globalFilterFields="['no', 'ticketNo', 'shop', 'winningNumber', 'status']"
            showGridlines
        >
            <template #header>
                <div class="flex justify-content-between flex-column sm:flex-row">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" class="mb-2" outlined @click="clearFilter1()" />
                    <div>
                        <span class="p-input-icon-left mb-2 mr-2">
                            <i class="pi pi-search" />
                            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                        </span>
                        <Button type="button" icon="pi pi-plus" label="Add New Shop" class="mb-2" @click="navigateToNewShop" />
                    </div>
                </div>
            </template>
            <template #empty> No ticket found. </template>
            <template #loading> Loading top winning no. Please wait. </template>
            <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" style="min-width: 12rem">
                <template v-if="col.field === 'status'" #body="{ data }">
                    <Tag :severity="getStatusColor(data.status)">{{ data.status.toUpperCase() }}</Tag>
                </template>
                <template v-if="col.field === 'status'" #filter="{ filterModel }">
                    <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" :showClear="true">
                        <template #value="slotProps">
                            <Tag :severity="getStatusColor(slotProps.value)" v-if="slotProps.value">{{ slotProps.value }} </Tag>
                            <span v-else>{{ slotProps.placeholder }}</span>
                        </template>
                        <template #option="slotProps">
                            <Tag :severity="getStatusColor(slotProps.option)">{{ slotProps.option.toUpperCase() }}</Tag>
                        </template>
                    </Dropdown>
                </template>
                <template v-else #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search" />
                </template>
            </Column>
        </DataTable>
    </div>
    <div class="flex flex-wrap align-items-left pb-8 px-4">
        <h6 class="font-medium text-300" style="margin-top: 40px; line-height: 17px">alpha virtuals Ⓒ {{ currentYear }}</h6>
    </div>
</template>
