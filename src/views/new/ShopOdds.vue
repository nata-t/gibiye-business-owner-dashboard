<script setup>
import { ref, onBeforeMount, reactive, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { TopWinningsService } from '@/service/TopWinningsService';
import { SearchDropDownOptionsService } from '@/service/SearchDropDownOptionsService';

const dt = ref();

const filter = ref();
const filterDropDown = ref();
const searchHeader = ref();
const filters = ref([{ name: 'Region' }, { name: 'Master Agent' }, { name: 'Agent' }, { name: 'Cashier' }]);

const columns = ref([]);
const topWinnings = ref([]);
const filters1 = ref(null);
const loading1 = ref(null);
const statuses = reactive(['paid', 'unpaid']);

const topWinningsService = new TopWinningsService();
const searchDropDownOptionsService = new SearchDropDownOptionsService();

onBeforeMount(() => {
    topWinningsService.getTopWinnings().then((data) => {
        columns.value = data.columns;
        topWinnings.value = data.data;
        loading1.value = false;
        topWinnings.value.forEach((topWinning) => (topWinning.date = new Date(topWinning.date)));
    });
    initFilters1();
});

const updateFilterDropDown = () => {
    searchHeader.value = filter.value.name;
    if (filter.value.name === 'Region') {
        searchDropDownOptionsService.getSearchDropDownOptions().then((data) => {
            filterDropDown.value = data.Region;
        });
    } else if (filter.value.name === 'Master Agent') {
        searchDropDownOptionsService.getSearchDropDownOptions().then((data) => {
            filterDropDown.value = data.MasterAgent;
        });
    } else if (filter.value.name === 'Agent') {
        searchDropDownOptionsService.getSearchDropDownOptions().then((data) => {
            filterDropDown.value = data.Agent;
        });
    } else if (filter.value.name === 'Cashier') {
        searchDropDownOptionsService.getSearchDropDownOptions().then((data) => {
            filterDropDown.value = data.Cashier;
        });
    } else {
        filterDropDown.value.name = null;
    }
};

watch(filter, updateFilterDropDown);

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        no: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        ticketNo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        shop: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        winningNumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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
    <div class="">
        <div class="card flex flex-column">
            <div class="flex flex-wrap">
                
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">Search by</h1>
                    <Dropdown v-model="filter" :options="filters" optionLabel="name" placeholder="Search by" class="w-16rem" />
                </div>
            </div>
            <Button style="align-self: end" class="mt-4 w-13rem" label="Submit"></Button>
        </div>

        <div class="card">
            <h5>Shop Odds</h5>
            <DataTable
                :value="topWinnings"
                tableStyle="min-width: 80rem"
                :paginator="true"
                :rows="10"
                :rowHover="true"
                v-model:filters="filters1"
                filterDisplay="menu"
                :loading="loading1"
                :filters="filters1"
                :globalFilterFields="['no', 'ticketNo', 'shop', 'winningNumber', 'status']"
                ref="dt"
                showGridlines
            >
                <template #header>
                    <div class="flex justify-content-between sm:flex-row">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" class="mb-2" outlined @click="clearFilter1()" />
                        <div class="flex">
                            <div class="mr-4">
                                <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                            </div>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </span>
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
