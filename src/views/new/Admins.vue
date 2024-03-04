<script setup>
import { ref, onBeforeMount, reactive, computed } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { TopWinningsService } from '@/service/TopWinningsService';
import { SearchDropDownOptionsService } from '@/service/SearchDropDownOptionsService';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const toast = useToast();
const confirm = useConfirm();

const dt = ref();
const columns = ref([]);
const topWinnings = ref([]);
const filters1 = ref(null);
const loading1 = ref(null);
const statuses = reactive(['paid', 'unpaid']);

const expandedRows = ref([]);
const MasterAgent = ref();
const MasterAgents = ref();
const roles = ref([{ name: 'Master Agent' }, { name: 'Agent' }, { name: 'Admin' }]);
const name = ref();
const OddTypes = ref([{ name: 'kiron' }, { name: 'mohio' }, { name: 'mohio2' }, { name: 'promo' }, { name: 'type1' }, { name: 'type2' }, { name: 'promo1' }, { name: 'promo2' }, { name: 'promo3' }, { name: 'promo4' }, { name: 'promo5' }]);

const isLocked = ref(true);
const lockBtnLabel = computed(() => (isLocked.value ? 'Lock' : 'Unlock'));
const lockIcon = computed(() => (isLocked.value ? 'pi pi-lock' : 'pi pi-lock-open'));

const isDeactive = ref(true);
const deactiveBtnLabel = computed(() => (isDeactive.value ? 'Deactivate' : 'Activate'));
const deactiveIcon = computed(() => (isDeactive.value ? 'pi pi-ban' : 'pi pi-undo'));
const deactiveseverity = computed(() => (isDeactive.value ? 'danger' : 'success'));

const visible = ref(false);

const topWinningsService = new TopWinningsService();
const searchDropDownOptionsService = new SearchDropDownOptionsService();

onBeforeMount(() => {
    topWinningsService.getTopWinnings().then((data) => {
        columns.value = data.columns;
        topWinnings.value = data.data;
        loading1.value = false;
        topWinnings.value.forEach((topWinning) => (topWinning.date = new Date(topWinning.date)));
    });

    searchDropDownOptionsService.getSearchDropDownOptions().then((data) => {
        MasterAgents.value = data.MasterAgent;
    });

    initFilters1();
});

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

const lock = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Are you sure want to proceed?',
        accept: () => {
            isLocked.value = !isLocked.value;
            const status = isLocked.value ? 'Unlocked!' : 'Locked!';
            const svt = isLocked.value ? 'info' : 'error';
            toast.add({ severity: svt, summary: 'Message', detail: 'Item successfully  ' + status, life: 3000 });
        }
    });
};
const Deactive = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Are you sure want to proceed?',
        accept: () => {
            isDeactive.value = !isDeactive.value;
            const status = isDeactive.value ? 'activated!' : 'Deactivated!';
            const svt = isDeactive.value ? 'info' : 'error';
            toast.add({ severity: svt, summary: 'Message', detail: 'Item successfully  ' + status, life: 3000 });
        }
    });
};

const savaChange = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Are you sure want to proceed?',
        accept: () => {
            toast.add({ severity: 'success', summary: 'Message', detail: 'Changes saved successfully.', life: 3000 });
        }
    });
};

const changePassword = () => {
    visible.value = true;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const currentYear = ref(new Date().getFullYear());
</script>
<template>
    <div class="">
        <div class="card">
            <h5>CASHIER REPORT</h5>
            <DataTable
                :value="topWinnings"
                v-model:expandedRows="expandedRows"
                dataKey="id"
                tableStyle="min-width: 80rem"
                :paginator="true"
                :rows="10"
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
                <Column expander style="width: 5rem" />
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
                <template #expansion="slotProps">
                    <div class="flex flex-column">
                        <div class="ml-8 mr-6 flex flex-wrap">
                            <div class="flex flex-column mr-4 mb-4" style="min-width: 30%">
                                <h1 class="mb-2" style="font-size: 15px">Master Agents</h1>
                                <Dropdown v-model="MasterAgent" :options="MasterAgents" optionLabel="name" :placeholder="slotProps.data.expansion.Magent" class="w-full" />
                            </div>
                            <div class="flex flex-column mr-4 mb-4" style="min-width: 30%">
                                <h1 class="mb-2" style="font-size: 15px">Name</h1>
                                <InputText type="text" v-model="name" :placeholder="slotProps.data.expansion.name" class="w-full" />
                            </div>
                            <div class="flex flex-column mr-4 mb-4" style="min-width: 30%">
                                <h1 class="mb-2" style="font-size: 15px">Address</h1>
                                <InputText type="text" v-model="name" :placeholder="slotProps.data.expansion.address" class="w-full" />
                            </div>
                            <div class="flex flex-column mr-4 mb-4" style="min-width: 30%">
                                <h1 class="mb-2" style="font-size: 15px">Mobile</h1>
                                <InputNumber v-model="mobile" :placeholder="slotProps.data.expansion.mobile" class="w-full" />
                            </div>
                            <div class="flex flex-column mr-4 mb-4" style="min-width: 30%">
                                <h1 class="mb-2" style="font-size: 15px">%Share</h1>
                                <InputNumber v-model="share" inputId="percent" suffix="%" :placeholder="slotProps.data.expansion.share" class="w-full" />
                            </div>
                            <div class="flex flex-column mr-4 mb-4" style="min-width: 30%">
                                <h1 class="mb-2" style="font-size: 15px">Role</h1>
                                <Dropdown v-model="role" :options="roles" optionLabel="name" :placeholder="slotProps.data.expansion.role" class="w-full" />
                            </div>
                            <div class="flex flex-column mr-4 mb-4" style="min-width: 30%">
                                <h1 class="mb-2" style="font-size: 15px">Odd Type</h1>
                                <Dropdown v-model="OddType" :options="OddTypes" optionLabel="name" :placeholder="slotProps.data.expansion.oddType" class="w-full" />
                            </div>
                            <div class="flex flex-column mr-4 mb-4" style="min-width: 30%">
                                <h1 class="mb-2" style="font-size: 15px">RTP/Margin</h1>
                                <InputNumber v-model="margin" inputId="percent" suffix="%" :placeholder="slotProps.data.expansion.rtp" class="w-full" />
                            </div>
                        </div>
                        <div style="align-self: flex-start" class="mb-4 mt-2">
                            <Button icon="pi pi-verified" label="Save Change" @click="savaChange($event)" text raised class="mr-5" />
                            <Button icon="pi pi-key" label="Change Password" severity="warning" @click="changePassword()" text raised class="mr-5" />
                            <Button :icon="lockIcon" :label="lockBtnLabel" severity="secondary" @click="lock($event)" text raised class="mr-5" />
                            <Button :icon="deactiveIcon" :label="deactiveBtnLabel" :severity="deactiveseverity" @click="Deactive($event)" text raised class="mr-5" />
                        </div>
                        <ConfirmPopup> </ConfirmPopup>
                        <Dialog v-model:visible="visible" header="Change Password" :style="{ width: '30rem' }" position="top" :modal="true" :draggable="false">
                            <div class="flex justify-content-center">
                                <div class="flex flex-column gap-5 mt-4 mb-2">
                                    <span class="p-float-label">
                                        <Password inputId="password" :feedback="false" toggleMask />
                                        <label for="password">New password</label>
                                    </span>
                                    <span class="p-float-label">
                                        <Password inputId="password" :feedback="false" toggleMask />
                                        <label for="password">Confirm password</label>
                                    </span>
                                </div>
                            </div>
                            <template #footer>
                                <Button label="Cancle" icon="pi pi-times" @click="visible = false" text />
                                <Button label="Continue" icon="pi pi-check" @click="visible = false" autofocus />
                            </template>
                        </Dialog>
                    </div>
                </template>
            </DataTable>
            <Toast />
        </div>
    </div>

    <div class="flex flex-wrap align-items-left pb-8 px-4">
        <h6 class="font-medium text-300" style="margin-top: 40px; line-height: 17px">alpha virtuals Ⓒ {{ currentYear }}</h6>
    </div>
</template>
