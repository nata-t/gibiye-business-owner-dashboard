<script setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { HTTP } from '@/service/axios';

import { useToast } from 'primevue/usetoast';
const toast = useToast();

const dt = ref();
const columns = ref([]);
const topWinnings = ref([]);
const filters1 = ref(null);
const loading1 = ref(null);
const payin = ref({ amount: 0, info: '' });
const payout = ref({ amount: 0, info: '' });
const unclaimed = ref({ amount: 0, info: '' });
const net = ref({ amount: 0, info: '' });
const shops = ref({ amount: 0, info: '' });
const rtp = ref({ amount: 0, info: '' });
const statuses = reactive(['paid', 'unpaid']);

onBeforeMount(() => {
    dashboardData();
    initFilters1();
});
const dashboardData = async () => {
    try {
        const response = await HTTP.post('dashboard/analysis', 'admin');
        const tableData = await HTTP.post('dashboard/topWinnings', 'admin');
        if (response.data.err || tableData.data.err) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
            setTimeout(tryAgain, 10000);
        } else {
            payin.value = response.data.payIn;
            payout.value = response.data.payOut;
            unclaimed.value = response.data.unclaimed;
            net.value = response.data.net;
            shops.value = response.data.shops;
            rtp.value = response.data.rtp;

            columns.value = tableData.data.columns;
            topWinnings.value = tableData.data.data;
            loading1.value = false;
            topWinnings.value.forEach((topWinning) => (topWinning.date = new Date(topWinning.date)));
        }
    } catch (error) {
        let errorMessage = 'Unable to load content';
        if (error.response) {
            errorMessage = error.response.data.message || 'Server error occurred';
        } else if (error.request) {
            errorMessage = 'No response from server';
        } else {
            errorMessage = error.message;
        }
        toast.add({ severity: 'error', summary: 'Error Message', detail: errorMessage, life: 3000, id: 'error' });
        setTimeout(tryAgain, 10000);
    }
};
const tryAgain = () => {
    toast.remove('error');
    dashboardData();
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

const exportCSV = () => {
    dt.value.exportCSV();
};

const currentYear = ref(new Date().getFullYear());
</script>
<template>
    <div>
        <Toast />
        <div class="col-12">
            <div class="grid p-2" style="margin: -1rem">
                <div class="col-12 sm:col p-3">
                    <div class="card surface-card text-500 flex justify-content-between pt-4 h-full" style="min-width: 18rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-500">PAYIN</h6>
                            <h1 class="m-0 text-500">Br {{ payin.amount.toLocaleString() }}</h1>
                            <h6 class="m-0 mb-1 font-medium text-sm text-300">{{ payin.info.toLocaleString() }} Tickets</h6>
                        </div>
                        <i class="pi pi-dollar text-3xl"></i>
                    </div>
                </div>
                <div class="col-12 sm:col p-3">
                    <div class="card text-0 flex justify-content-between pt-4 h-full" style="background-color: var(--primary-color); min-width: 18rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-0">PAYOUT</h6>
                            <h1 class="m-0 text-0">Br {{ payout.amount.toLocaleString() }}</h1>
                            <h6 class="m-0 mb-1 font-medium text-sm text-50">{{ payout.info.toLocaleString() }} Tickets</h6>
                        </div>
                        <i class="pi pi-wallet text-3xl"></i>
                    </div>
                </div>
                <div class="col-12 sm:col p-3">
                    <div class="card bg-gray-400 text-white flex justify-content-between pt-4 h-full" style="min-width: 18rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-white">UNCLAIMED</h6>
                            <h1 class="m-0 text-white">Br {{ unclaimed.amount.toLocaleString() }}</h1>
                            <h6 class="m-0 mb-1 font-medium text-sm text-50">{{ unclaimed.info.toLocaleString() }} Tickets</h6>
                        </div>
                        <i class="pi pi-dollar text-3xl"></i>
                    </div>
                </div>
                <div class="col-12 sm:col p-3">
                    <div class="card bg-gray-600 text-white flex justify-content-between pt-4 h-full" style="min-width: 18rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-white">NET</h6>
                            <h1 class="m-0 text-white">Br {{ net.amount.toLocaleString() }}</h1>
                            <h6 class="m-0 mb-1 font-medium text-sm text-50">{{ net.info.toLocaleString() }} Tickets</h6>
                        </div>
                        <i class="pi pi-wallet text-3xl"></i>
                    </div>
                </div>
                <div class="col-12 sm:col p-3">
                    <div class="card text-white flex justify-content-between pt-4 h-full" style="background: linear-gradient(90deg, #ffb340 0%, #ffa740 100%); min-width: 18rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-white">SHOPS/AGENTS</h6>
                            <h1 class="m-0 text-white">{{ shops.amount.toLocaleString() }}</h1>
                            <h6 class="m-0 mb-1 font-medium text-sm text-50"><i class="pi pi-chart-line text-1xl" style="margin-right: 5px"></i>{{ shops.info.toLocaleString() }} active today</h6>
                        </div>
                        <i class="pi pi-box text-3xl"></i>
                    </div>
                </div>
                <div class="col-12 sm:col p-3">
                    <div class="card text-white flex justify-content-between pt-4 h-full" style="background-color: var(--primary-color); min-width: 18rem">
                        <div class="overview-info">
                            <h6 class="m-0 mb-1 text-white">SRTP/MARGIN <i class="pi pi-info-circle text-1xl" style="margin-left: 5px"></i></h6>
                            <h1 class="m-0 text-white">Av {{ rtp.amount }}%</h1>
                            <h6 class="m-0 mb-1 font-medium text-sm text-50"><i class="pi pi-chart-line text-1xl" style="margin-right: 5px"></i>{{ rtp.info }} now</h6>
                        </div>
                        <i class="pi pi-box text-3xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <h5>Top Winnings</h5>
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
                <div class="flex flex-column md:justify-content-between md:flex-row">
                    <div class="">
                        <span class="p-input-icon-left mb-2 md:mb-0 w-full">
                            <i class="pi pi-search" />
                            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                        </span>
                    </div>
                    <div class="flex flex-row justify-content-between">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" class="mr-4" outlined @click="clearFilter1()" />
                        <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
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
