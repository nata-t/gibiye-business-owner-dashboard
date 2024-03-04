<script setup>
import { ref, onBeforeMount } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { HTTP } from '@/service/axios';

import { useToast } from 'primevue/usetoast';
const toast = useToast();

const dt = ref();
const dates = ref();
const shop = ref();
const GameId = ref();
const GameType = ref();
const shops = ref([]);
const games = ref([{ name: 'All' }, { name: 'Keno' }, { name: 'Spin' }, { name: 'Dog' }, { name: 'Coin' }, { name: 'Red Keno' }]);

const loading = ref(false);

const columns = ref([]);
const gameResult = ref([]);
const filters1 = ref(null);
const loading1 = ref(null);

onBeforeMount(async () => {
    initFilters1();
    columns.value = [
        {
            field: 'shop',
            header: 'Shop'
        },
        {
            field: 'gameId',
            header: 'Game ID'
        },
        {
            field: 'game',
            header: 'Game'
        },

        {
            field: 'result',
            header: 'Result'
        }
    ];

    try {
        const fatchShops = await HTTP.post('users/shops', 'admin');

        if (fatchShops.data.err) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
        } else {
            shops.value = fatchShops.data;
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
    if (!shop.value) {
        invalidFields.push('shop');
    }

    if (invalidFields.length > 0) {
        toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill in all required fields.', life: 3000 });
        return;
    }
    loading.value = true;
    try {
        const tableData = await HTTP.post('data-reports/gameResult', {
            dates: dates.value,
            shop: shop.value.name,
            gameId: GameId.value,
            gameType: GameType.value.name
        });
        if (tableData.data.err) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
            loading.value = false;
        } else {
            gameResult.value = tableData.data.data;
            loading1.value = false;
            gameResult.value.forEach((tableTicket) => (tableTicket.date = new Date(tableTicket.date)));
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

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        shop: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        gameId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        game: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        result: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    };
};
const clearFilter1 = () => {
    initFilters1();
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
                    <h1 class="mb-2" style="font-size: 15px">Pick Date(*)</h1>
                    <Calendar v-model="dates" :manualInput="false" placeholder="pick date" class="w-full md:w-16rem" />
                </div>
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Select Shop(*)</h1>
                    <Dropdown v-model="shop" :options="shops" optionLabel="name" placeholder="choose..." class="w-full md:w-16rem" />
                </div>
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Game id</h1>
                    <InputNumber v-model="GameId" :useGrouping="false" placeholder="game id" />
                </div>
                <div class="flex flex-column mr-4 mb-4 w-full md:w-16rem">
                    <h1 class="mb-2" style="font-size: 15px">Game Type</h1>
                    <Dropdown v-model="GameType" :options="games" optionLabel="name" placeholder="select game type" class="w-full md:w-16rem" />
                </div>
            </div>
            <Button style="align-self: end" class="mt-4" label="Submit" icon="pi pi-upload" :loading="loading" @click="submit"></Button>
        </div>

        <div class="card">
            <h5>GAME RESULTS</h5>
            <DataTable
                :value="gameResult"
                tableStyle="min-width: 80rem"
                :paginator="true"
                :rows="10"
                :rowHover="true"
                v-model:filters="filters1"
                filterDisplay="menu"
                :loading="loading1"
                :filters="filters1"
                :globalFilterFields="['shop', 'gameId', 'game', 'result']"
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
