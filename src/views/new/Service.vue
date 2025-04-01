<script setup>
import { ref, onBeforeMount } from 'vue';
import { HTTP } from '@/service/axios';
import Cookies from 'js-cookie';

import { useToast } from 'primevue/usetoast';
const toast = useToast();

const BASE_URL = 'http://localhost:3000';
const BASE_DIR = '/home/natnael/Desktop/final-year/gibiye-back';

function convertToUrl(filePath) {
    if (filePath == null) {
        return BASE_URL + '/uploads/_placeholders/placeholder-1.jpg';
    } else {
        return BASE_URL + filePath.replace(BASE_DIR, '');
    }
}

const services = ref([]);
onBeforeMount(async () => {
    await getServices();
});

const getServices = async () => {
    const loggedUser = await Cookies.get('loggedUser');
    const businessId = parseInt(JSON.parse(loggedUser).businessId);
    try {
        const response = await HTTP.post('manage_services/getServicesByBusinessId', { businessId });
        if (response.status != 200) {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Unable To Load Content', life: 3000, id: 'error' });
        } else {
            services.value = response.data;
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

const deleteService = async (id) => {
    try {
        const response = await HTTP.post('manage_services/deleteService', { serviceId: id });
        if (response.status == 200) {
            await getServices();
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
</script>

<template>
    <Toast />
    <div class="card">
        <div v-for="service in services" :key="service.id">
            <div class="mb-8">
                <div class="flex justify-content-between">
                    <div class="flex gap-5 mt-3 ml-4 mb-5">
                        <img style="object-fit: cover" class="w-16rem h-10rem border-round mt-3" :src="convertToUrl(service.picture)" alt="" />
                        <div class="mt-0 flex flex-column justify-content-start">
                            <span class="mt-0 font-bold text-900 text-4xl white-space-nowrap">{{ service.serviceName }}</span>
                            <div class="w-25rem" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis">
                                <h6 class="mt-3 font-bold text-600">
                                    {{ service.description }}
                                </h6>
                            </div>
                            <div class="w-full mt-0 flex justify-content-between" style="align-self: flex-end">
                                <div class="flex gap-3 mr-3" style="align-self: flex-end">
                                    <span class="flex align-items-center text-900 cursor-pointer">
                                        <i class="pi pi-bookmark mr-2"></i>
                                        <span class="font-semibold">{{ service.favoritedBy.length }}</span>
                                    </span>
                                    <span class="flex align-items-center text-900 cursor-pointer">
                                        <i class="pi pi-comment mr-2"></i>
                                        <span class="font-semibold">{{ service.comments.length }}</span>
                                    </span>
                                    <span class="flex align-items-center text-900 cursor-pointer">
                                        <i class="pi pi-heart mr-2"></i>
                                        <span class="font-semibold">{{ service.likedBy.length }}</span>
                                    </span>
                                </div>
                            </div>

                            <div class="flex gap-2 mt-3">
                                <span class="text-l font-bold text-primary cursor-pointer">See comments</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-column justify-content-center w-3 mr-7 mb-4">
                        <h1 class="text-center m-0 mr-3 mb-3 text-5xl text-primary font-bold">{{ service.price }}</h1>
                        <div class="flex gap-2">
                            <Button outlined class="font-bold text-l text-center p-1 px-2" @click="deleteService(service.id)" label="Remove Service"></Button>
                            <Button outlined class="font-bold text-l text-center p-1 px-2" label="Sespende Service"></Button>
                        </div>
                    </div>
                </div>
                <Divider />
            </div>
        </div>
    </div>
</template>
