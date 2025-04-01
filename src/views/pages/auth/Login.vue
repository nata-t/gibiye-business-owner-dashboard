<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { HTTP } from '@/service/axios';
import Cookies from 'js-cookie';
import { useToast } from 'primevue/usetoast';
import AppConfig from '@/layout/AppConfig.vue';

const toast = useToast();
const name = ref('');
const password = ref('');
const router = useRouter();
const loading = ref(false);
const errorMessage = ref(null);

const loginUser = async () => {
    loading.value = true;
    errorMessage.value = null;
    if (!name.value.trim() || !password.value.trim()) {
        loading.value = false;
        errorMessage.value = 'Please fill in all fields.';
        toast.add({ severity: 'warn', summary: 'Error', detail: errorMessage.value, life: 3000 });
        loading.value = false;
        return;
    }
    const data = {
        name: name.value,
        password: password.value
    };
    try {
        const response = await HTTP.post('auth/loginToDashboard', data);

        if (response.status == 200) {
            const loggedUser = {
                name: response.data.name,
                businessId: response.data.businessId,
                businessModel: response.data.BusinessModel,
                profilePicture: response.data.profilePicture,
                token: response.data.token
            };
            await Cookies.set('loggedUser', JSON.stringify(loggedUser), { expires: 1 / 8 });

            errorMessage.value = null;
            loading.value = false;
            router.push('/');
        }
    } catch (error) {
        console(error);
        if (error.response.status == 500) {
            errorMessage.value = error.response.data.error;
            toast.add({ severity: 'error', summary: error.response.data.message, detail: errorMessage.value, life: 3000 });
            loading.value = false;
        } else if (error.request) {
            errorMessage.value = 'Check your connection or try agian.';
            toast.add({ severity: 'error', summary: 'Network error', detail: errorMessage.value, life: 3000 });
            loading.value = false;
        } else {
            errorMessage.value = 'Error during login. Please try again.';
            toast.add({ severity: 'error', summary: 'Unkown error', detail: errorMessage.value, life: 3000 });
            loading.value = false;
        }
    }
};

const currentYear = ref(new Date().getFullYear());
</script>
<template>
    <div class="surface-0">
        <div class="flex align-items-center justify-content-between flex-column h-screen">
            <div class="flex flex-column align-items-center justify-content-center w-full md:w-4 h-full text-center py-6 px-4">
                <a class="mb-2" style="cursor: pointer">
                    <img class="mb-6" style="height: 50px; width: auto; margin-top: 50px" src="/gibiye-logo.png" alt="Your Company" />
                </a>
                <div class="flex flex-column">
                    <span class="p-input-icon-left w-full mb-4">
                        <i class="pi pi-user"></i>
                        <InputText id="name" v-model="name" type="text" class="w-full md:w-25rem text-color-secondary surface-50 border-200" placeholder="Business Name" />
                    </span>
                    <span class="p-input-icon-left w-full mb-4">
                        <i class="pi pi-lock z-2"></i>
                        <Password id="password" v-model="password" placeholder="Password" class="w-full" :inputStyle="{ paddingLeft: '2.5rem' }" inputClass="w-full md:w-25rem text-color-secondary surface-50 border-200" toggleMask></Password>
                    </span>

                    <Button label="Sign In" class="w-full mb-4" @click="loginUser" :loading="loading"></Button>
                    <a href="#" class="font-medium text-sm text-300">forget password?</a>
                </div>
            </div>
            <div class="flex flex-wrap align-items-center pb-8 px-4">
                <h4 class="m-0 mr-5" style="line-height: 22px">gibiye</h4>
                <h6 class="m-0 font-medium text-300" style="line-height: 17px">Copyright Ⓒ {{ currentYear }}</h6>
            </div>
        </div>
    </div>
    <Toast />

    <AppConfig />
</template>
