<script setup>
import { ref } from 'vue';
import { HTTP } from '@/service/axios';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

const toast = useToast();

const serviceName = ref('');
const serviceDescription = ref('');
const price = ref(0);
const picture = ref(null);

const onUpload = (event) => {
    picture.value = event.target.files[0];
};

const createService = async () => {
    if (!serviceName.value || !serviceDescription.value || !price.value || !picture.value) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all fields', life: 3000 });
        return;
    }

    const formData = new FormData();
    formData.append('serviceName', serviceName.value);
    formData.append('description', serviceDescription.value);
    formData.append('price', price.value);
    formData.append('picture', picture.value);

    try {
        const response = await HTTP.post('manage_services/createService', formData);
        if (response.status == 200) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Service created successfully', life: 3000 });
            // Clear form after successful submission
            serviceName.value = '';
            serviceDescription.value = '';
            price.value = 0;
            picture.value = null;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.message || 'Error during service creation', life: 3000 });
    }
};
</script>

<template>
    <Toast />
    <div class="card">
        <h3>Create Service</h3>
        <form @submit.prevent="createService" class="flex flex-column">
            <div class="p-fluid">
                <div class="flex flex-column gap-2">
                    <div class="field">
                        <label for="name1">Service Name</label>
                        <InputText v-model="serviceName" placeholder="Enter service name" />
                    </div>
                    <div class="field">
                        <label for="name1">Service description</label>
                        <Textarea v-model="serviceDescription" rows="4" placeholder="Enter service description" />
                    </div>
                    <div class="field">
                        <label for="name1">Price</label>
                        <InputNumber v-model="price" suffix=" birr" placeholder="Enter service price" />
                    </div>
                    <div class="field">
                        <label for="name1">Upload Picture</label>
                        <input type="file" accept="image/*" @change="onUpload" />
                    </div>
                </div>
            </div>
            <Button style="align-self: end" class="mt-4 w-13rem" label="Create Service" type="submit"></Button>
        </form>
    </div>
</template>
