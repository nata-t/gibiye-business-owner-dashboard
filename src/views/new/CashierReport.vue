<script setup>
import { ref, onBeforeMount, reactive, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { HTTP } from '@/service/axios';

import { useToast } from 'primevue/usetoast';
const toast = useToast();

const dt = ref();
const dates = ref();
const span = ref();
const cashier = ref('');
const shop = ref('');
const masterAgent = ref('');
const region = ref('');
const admin = ref('');
const spans = ref([{ name: 'Today' }, { name: 'Yesterday' }, { name: 'This week' }, { name: 'Last week' }, { name: 'This month' }, { name: 'Last month' }]);
const cashiers = ref([]);
const shops = ref([]);
const masterAgents = ref([]);
const regions = ref([]);
const admins = ref([]);

const loading = ref(false);

const columns = ref([]);
const table = ref([]);
const filters1 = ref(null);
const loading1 = ref(null);
const statuses = reactive(['paid', 'unpaid']);

const filter = ref();

onBeforeMount(async () => {
    initFilters1();
    columns.value = [
        {
            field: 'cashier',
            header: 'Cashier'
        },
        {
            field: 'shop',
            header: 'Shop'
        },
        {
            field: 'bets',
            header: 'Bets'
        },
        {
            field: 'slipCount',
            header: 'Slip Count'
        },
        {
            field: 'payOut',
            header: 'Pay Out'
        },
        {
            field: 'unclaimed',
            header: 'Unclaimed'
        },
        {
            field: 'ggr',
            header: 'GGR'
        },
        {
            field: 'rtp',
            header: 'RTP'
        },
        {
            field: 'net',
            header: 'NET/NGR'
        },
        {
            field: 'share',
            header: 'Share'
        },
        {
            field: 'shopNet',
            header: 'Shop Net'
        },
        {
            field: 'companyNet',
            header: 'Company Net'
        }
    ];

    try {
        const fatchShops = await HTTP.post('users/shops', 'admin');
        const fatchCashiers = await HTTP.post('users/cashiers', 'admin');
        const fatchMasterAgents = await HTTP.post('users/masterAgent', 'admin');
        const fatchRegions = await HTTP.post('users/region', 'admin');
        const fatchAdmins = await HTTP.post('users/admin', 'admin');

        if (fatchShops.data.err) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
        } else {
            shops.value = fatchShops.data;
            cashiers.value = fatchCashiers.data;
            masterAgents.value = fatchMasterAgents.data;
            regions.value = fatchRegions.data;
            admins.value = fatchAdmins.data;
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
    }
});

const submit = async () => {
    const invalidFields = [];

    if (!dates.value || dates.value.length === 0) {
        invalidFields.push('dates');
    }
    if (invalidFields.length > 0) {
        toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill in all required fields.', life: 3000 });
        return;
    }
    loading.value = true;
    try {
        const tableData = await HTTP.post('cash-reports/cashierReport', {
            date: dates.value,
            cashier: cashier.value,
            shop: shop.value,
            masterAgent: masterAgent.value,
            region: region.value,
            admin: admin.value
        });
        if (tableData.data.err) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
            loading.value = false;
        } else {
            table.value = tableData.data.data;
            loading1.value = false;
            table.value.forEach((tableTicket) => (tableTicket.date = new Date(tableTicket.date)));
            loading.value = false;
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
        loading.value = false;
    }
};
const updateFilterDropDown = () => {};

watch(filter, updateFilterDropDown);

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cashier: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        shop: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        bets: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        slipCount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        payOut: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        unclaimed: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        ggr: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        rtp: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        net: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        share: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        shopNet: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        companyNet: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
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
    <Toast />
    <div class="">
        <div class="card flex flex-column p-4">
            <div class="flex flex-wrap w-full">
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Select Span</h1>
                    <Dropdown v-model="span" :options="spans" optionLabel="name" placeholder="choose..." class="w-full md:w-16rem" />
                </div>
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Pick Date(*)</h1>
                    <Calendar v-model="dates" :manualInput="false" placeholder="pick date" class="w-full md:w-16rem" />
                </div>
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Select Cashiers</h1>
                    <MultiSelect v-model="cashier" display="chip" :options="cashiers" optionLabel="name" placeholder="select ticket type" class="w-full md:w-16rem" />
                </div>
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Select Shops</h1>
                    <MultiSelect v-model="shop" display="chip" :options="shops" optionLabel="name" placeholder="select ticket type" class="w-full md:w-16rem" />
                </div>
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Select Master Agents</h1>
                    <MultiSelect v-model="masterAgent" display="chip" :options="masterAgents" optionLabel="name" placeholder="select ticket type" class="w-full md:w-16rem" />
                </div>
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Select Region</h1>
                    <MultiSelect v-model="region" display="chip" :options="regions" optionLabel="name" placeholder="select ticket type" class="w-full md:w-16rem" />
                </div>
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Select Admin</h1>
                    <MultiSelect v-model="admin" display="chip" :options="admins" optionLabel="name" placeholder="select ticket type" class="w-full md:w-16rem" />
                </div>
            </div>
            <Button style="align-self: end" class="mt-4" label="Submit" icon="pi pi-upload" :loading="loading" @click="submit"></Button>
        </div>

        <div class="card">
            <h5>CASHIER REPORT</h5>
            <DataTable
                :value="table"
                tableStyle="min-width: 80rem"
                :paginator="true"
                :rows="10"
                :rowHover="true"
                v-model:filters="filters1"
                filterDisplay="menu"
                :loading="loading1"
                :filters="filters1"
                :globalFilterFields="['cashier', 'shop', 'bets', 'slipCount', 'payOut', 'unclaimed', 'ggr', 'rtp', 'net', 'share', 'shopNet', 'companyNet']"
                ref="dt"
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
    </div>

    <div class="flex flex-wrap align-items-left pb-8 px-4">
        <h6 class="font-medium text-300" style="margin-top: 40px; line-height: 17px">alpha virtuals Ⓒ {{ currentYear }}</h6>
    </div>
</template>
