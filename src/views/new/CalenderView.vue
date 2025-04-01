<script setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { HTTP } from '@/service/axios';
import { format } from 'date-fns';

import { useToast } from 'primevue/usetoast';
const toast = useToast();

const dt = ref();
const columns = ref([
    { field: 'id', header: 'ID' },
    { field: 'customer', header: 'Customer' },
    { field: 'service', header: 'Service' },
    { field: 'scheduleTime', header: 'Scheduled For' },
    { field: 'createdAt', header: 'Appointed At' },
    { field: 'status', header: 'Status' }
]);
const newBookings = ref([]);
const filters1 = ref(null);
const loading1 = ref(null);

const statuses = reactive(['pending', 'scheduled', 'completed', 'canceled']);

onBeforeMount(async () => {
    await dashboardData();
    initFilters1();
});
const dashboardData = async () => {
    try {
        const tableData = await HTTP.post('manage_bookings/getBookingSchedule');
        if (tableData.status != 200) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
            setTimeout(tryAgain, 10000);
        } else {
            const data = {
                data: tableData.data.map((row) => ({
                    id: row.id,
                    customer: row.user.firstName + ' ' + row.user.lastName,
                    service: row.service.serviceName,
                    scheduleTime: format(new Date(row.scheduledTime), 'PPpp'),
                    createdAt: format(new Date(row.createdAt), 'PPpp'),
                    status: row.status
                }))
            };

            newBookings.value = data.data;
            loading1.value = false;
            newBookings.value.forEach((newBooking) => (newBooking.date = new Date(newBooking.date)));
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
        id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        service: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        customer: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        scheduleTime: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        createdAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    };
};
const clearFilter1 = () => {
    initFilters1();
};

const getStatusColor = (status) => {
    switch (status) {
        case 'PENDING':
            return 'warning';
        case 'CANCELED':
            return 'danger';
        case 'SCHEDULED':
            return 'info';
        case 'COMPLETED':
            return 'success';
    }
};

const complete = async (data) => {
    try {
        const response = await HTTP.post('manage_bookings/completeBooking', { bookingId: data.id });
        if (response.status == 200) {
            await dashboardData();
            toast.add({ severity: 'success', summary: 'Success Message', detail: 'Booking Completed Successfully', life: 3000, id: 'success' });
            setTimeout(tryAgain, 10000);
        }
    } catch (error) {
        let errorMessage = 'Unable to complete booking';
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

const exportCSV = () => {
    dt.value.exportCSV();
};

const currentYear = ref(new Date().getFullYear());
</script>

<template>
    <Toast />
    <div class="card mt-6">
        <h5>CALENDER VIEW</h5>
        <DataTable
            :value="newBookings"
            tableStyle="min-width: 50rem"
            :paginator="true"
            :rows="15"
            :rowHover="true"
            v-model:filters="filters1"
            filterDisplay="menu"
            :loading="loading1"
            :filters="filters1"
            :globalFilterFields="['id', 'service', 'customer', 'scheduleTime', 'status', 'createdAt']"
            showGridlines
        >
            <template #header>
                <div class="flex flex-column md:justify-content-between md:flex-row">
                    <div class="">
                        <span class="p-input-icon-left mb-2 md:mb-0 w-full">
                            <i class="pi pi-search" />
                            <InputText placeholder="Keyword Search" style="width: 100%" />
                        </span>
                    </div>
                    <div class="flex flex-row justify-content-between">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" class="mr-4" outlined @click="clearFilter1()" />
                        <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    </div>
                </div>
            </template>
            <template #empty> No Bookings found. </template>
            <template #loading> Loading Recent Bookings. Please wait. </template>
            <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header">
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
                    <Button label="complete" outlined @click="complete(data)" text />
                </template>
            </Column>
        </DataTable>
    </div>
    <div class="flex flex-wrap align-items-left pb-8 px-4">
        <h6 class="font-medium text-300" style="margin-top: 40px; line-height: 17px">gibiye bashboard Ⓒ {{ currentYear }}</h6>
    </div>
</template>
