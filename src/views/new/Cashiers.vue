<script setup>
import { ref, onBeforeMount, reactive, computed } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { HTTP } from '@/service/axios';

import { useToast } from 'primevue/usetoast';
const toast = useToast();

const dt = ref();

const shop = ref();
const noCashiers = ref(1);
const password = ref();
const shops = ref([]);

const visible = ref(false);

const columns = ref([]);
const table = ref([]);
const filters1 = ref(null);
const loading1 = ref(null);
const statuses = reactive(['deactive', 'active']);

onBeforeMount(async () => {
    initFilters1();
    columns.value = [
        {
            field: 'username',
            header: 'Username'
        },
        {
            field: 'agent',
            header: 'Agent'
        },
        {
            field: 'masterAgent',
            header: 'Master Agent'
        },
        {
            field: 'status',
            header: 'Status'
        }
    ];
    try {
        const fatchShops = await HTTP.post('users/shops', 'admin');
        const fatchTable = await HTTP.post('user-accounts/cashier', 'admin');

        if (fatchShops.data.err || fatchTable.data.err) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
        } else {
            shops.value = fatchShops.data;
            table.value = fatchTable.data.data;
            table.value.forEach((tableTicket) => (tableTicket.date = new Date(tableTicket.date)));
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

const newCashier = () => {
    visible.value = true;
};

const submit = async () => {
    const invalidFields = [];

    if (!shop.value) {
        invalidFields.push('shop');
    }
    if (!noCashiers.value) {
        invalidFields.push('Number');
    }
    if (!password.value) {
        invalidFields.push('passwords');
    }

    if (invalidFields.length > 0) {
        toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill in all required fields.', life: 3000 });
        return;
    }
    try {
        const createCashier = await HTTP.post('user-accounts/createCashier', {
            password: password.value,
            noCashiers: noCashiers.value,
            shop: shop.value.name
        });
        if (createCashier.data.err) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'faild to create cashier', life: 3000, id: 'error' });
            visible.value = false;
        } else {
            toast.add({ severity: 'success', summary: 'Success Message', detail: 'Cashier Created Successfuly', life: 3000, id: 'error' });
            visible.value = false;
        }
    } catch (error) {
        let errorMessage = 'Unable to create Cashier';
        if (error.response) {
            errorMessage = error.response.data.message || 'Server error occurred';
        } else if (error.request) {
            errorMessage = 'No response from server';
        } else {
            errorMessage = error.message;
        }
        toast.add({ severity: 'error', summary: 'Error Message', detail: errorMessage, life: 3000, id: 'error' });
        visible.value = false;
    }
};

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        agent: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        masterAgent: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};
const clearFilter1 = () => {
    initFilters1();
};

const getStatusColor = (status) => {
    switch (status) {
        case 'deactive':
            return 'danger';
        case 'active':
            return 'success';
    }
};

const isLocked = ref(true);
const lockBtnLabel = computed(() => (isLocked.value ? 'Lock' : 'Unlock'));
const lockIcon = computed(() => (isLocked.value ? 'pi pi-lock' : 'pi pi-lock-open'));

const isDeactive = ref(true);
const deactiveBtnLabel = computed(() => (isDeactive.value ? 'Deactivate' : 'Activate'));
const deactiveIcon = computed(() => (isDeactive.value ? 'pi pi-ban' : 'pi pi-undo'));

const detailView = ref();
const viewVisible = ref(false);
const username = ref('');
const agent = ref('');
const agents = ref([]);
const cashLimit = ref();
const role = ref('');
const roles = ref([]);
const stake = ref();
const stakes = ref([{ name: 10 }, { name: 20 }, { name: 30 }, { name: 50 }]);

const selectedRow = ref();
const menu = ref();
const items = ref([
    {
        label: 'Actions',
        items: [
            {
                label: 'view',
                icon: 'pi pi-info-circle',
                command: () => {
                    view();
                }
            },
            {
                label: lockBtnLabel,
                icon: lockIcon,
                command: () => {
                    lock();
                }
            },
            {
                label: 'change password',
                icon: 'pi pi-key',
                command: () => {
                    changePassword();
                }
            },

            {
                label: deactiveBtnLabel,
                icon: deactiveIcon,
                command: () => {
                    deactive();
                }
            }
        ]
    }
]);

const view = async () => {
    try {
        const fatchView = await HTTP.post('user-accounts/view', selectedRow.value);

        if (fatchView.data.err) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
        } else {
            detailView.value = fatchView.data;
            username.value = fatchView.data.username;
            agent.value = fatchView.data.agent;
            agents.value = fatchView.data.agents;
            cashLimit.value = fatchView.data.cashLimit;
            role.value = fatchView.data.role;
            roles.value = fatchView.data.roles;
            stake.value = fatchView.data.stake;
            viewVisible.value = true;
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
};

const lock = () => {
    isLocked.value = true;
};

const changePassword = () => {};

const deactive = () => {
    isDeactive.value = true;
};

const toggle = (event, rowData) => {
    selectedRow.value = rowData;
    menu.value.toggle(event);
};

const currentYear = ref(new Date().getFullYear());
</script>
<template>
    <Toast />
    <div class="">
        <div class="card">
            <h5>CASHIERS</h5>
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
                :globalFilterFields="['username', 'agent', 'masterAgent', 'status']"
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
                            <Button icon="pi pi-plus" label="New Cashier" @click="newCashier" />
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
                <Column field="action" header="Action">
                    <template #body="{ data }">
                        <Button type="button" icon="pi pi-ellipsis-v" class="p-text-secondary" @click="(event) => toggle(event, data)" text />
                        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
                    </template>
                </Column>
            </DataTable>
        </div>
        <Dialog v-model:visible="visible" modal header="New Cashier" :style="{ width: '25rem' }">
            <div class="flex flex-column mr-4 mb-4 w-full">
                <h1 class="mb-2" style="font-size: 15px">Select Shop</h1>
                <Dropdown v-model="shop" :options="shops" optionLabel="name" placeholder="select game type" class="w-full" />
            </div>
            <div class="flex flex-column mr-4 mb-4 w-full">
                <h1 class="mb-2" style="font-size: 15px">Number of new cashiers to add</h1>
                <InputNumber :useGrouping="false" inputId="withoutgrouping" v-model="noCashiers" class="w-full" />
            </div>
            <div class="flex flex-column mr-4 mb-4 w-full">
                <h1 class="mb-2" style="font-size: 15px">Password</h1>
                <Password v-model="password" :feedback="false" toggleMask class="w-full" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Submit" @click="submit"></Button>
            </div>
        </Dialog>
        <Dialog v-model:visible="viewVisible" modal header="New Cashier" :style="{ width: '30rem' }">
            <span class="p-text-secondary block mb-2">username</span>
            <span class="p-text-secondary block mb-2">{{ username }}</span>
            <Divider />
            <div class="flex flex-column mr-4 mb-4 w-full">
                <h1 class="mb-2" style="font-size: 15px">Agent</h1>
                <Dropdown v-model="agent" :options="agents" optionLabel="name" :placeholder="agent" class="w-full" />
            </div>
            <div class="flex flex-column mr-4 mb-4 w-full">
                <h1 class="mb-2" style="font-size: 15px">cash limit</h1>
                <InputNumber :useGrouping="false" inputId="withoutgrouping" v-model="cashLimit" class="w-full" />
            </div>
            <div class="flex flex-column mr-4 mb-4 w-full">
                <h1 class="mb-2" style="font-size: 15px">Role</h1>
                <Dropdown v-model="role" :options="roles" optionLabel="name" :placeholder="role" class="w-full" />
            </div>
            <div class="flex flex-column mr-4 mb-4 w-full">
                <h1 class="mb-2" style="font-size: 15px">Default Minimum stake</h1>
                <Dropdown v-model="stake" :options="stakes" optionLabel="name" :placeholder="stake.toString()" class="w-full" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Go back" severity="secondary" @click="viewVisible = false"></Button>
                <Button type="button" label="Save changes" @click="submit"></Button>
            </div>
        </Dialog>
    </div>

    <div class="flex flex-wrap align-items-left pb-8 px-4">
        <h6 class="font-medium text-300" style="margin-top: 40px; line-height: 17px">alpha virtuals Ⓒ {{ currentYear }}</h6>
    </div>
</template>
