<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppConfig from '@/layout/AppConfig.vue';
import { HTTP } from '@/service/axios';
import Cookies from 'js-cookie';
import Checkbox from 'primevue/checkbox';

const router = useRouter();
let username = '';
let password = '';
const errorMessage = ref(null);

const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
        errorMessage.value = 'Please fill in all fields.';
        return;
    }

    const data = {
        username: username,
        password: password,
        role: 'admin'
    };

    try {
        const response = await HTTP.post('signIn', data);

        if (response.data.res.err) {
            errorMessage.value = `Error during login. Please try again.`;
        } else {
            const token = response.data.res.token;

            Cookies.set('token', token, { expires: 1 / 8 });

            errorMessage.value = null;
            router.push('/');
        }
    } catch (error) {
        if (error.response) {
            errorMessage.value = `Server error: ${error.response.status}`;
        } else if (error.request) {
            errorMessage.value = 'Network error. Please check your connection.';
        } else {
            errorMessage.value = 'Error during login. Please try again.';
        }
    }
};

const checked = ref(false);

const currentYear = ref(new Date().getFullYear());
</script>
<template>
    <div class="surface-0">
        <div class="flex align-items-center justify-content-between flex-column h-screen">
            <div class="flex flex-column align-items-center justify-content-center w-full md:w-4 h-full text-center py-6 px-4">
                <img class="mb-6" style="height: 120px; width: auto; margin-top: 30px" src="@/assets/alpha_logo_2.png" alt="Your Company" />

                <form @submit.prevent="handleSubmit" class="flex flex-column w-full">
                    <span class="p-input-icon-left w-full mb-4">
                        <i class="pi pi-user"></i>
                        <InputText id="email" type="text" class="w-full text-color-secondary surface-50 border-200" v-model="username" placeholder="Username" />
                    </span>
                    <span class="p-input-icon-left w-full mb-4">
                        <i class="pi pi-lock"></i>
                        <InputText id="password" type="password" class="w-full text-color-secondary surface-50 border-200" v-model="password" placeholder="Password" />
                    </span>

                    <Button type="submit" label="Sign In" class="w-full mb-4"></Button>

                    <InlineMessage style="margin-bottom: 20px" v-if="errorMessage" severity="error">{{ errorMessage }}</InlineMessage>
                    <div class="flex justify-content-center">
                        <Checkbox v-model="checked" :binary="true" inputId="remember-me" />
                        <label style="cursor: pointer" for="remember-me" class="ml-2 mt-1 font-medium text-sm text-300"> Remember me </label>
                    </div>
                </form>
            </div>
            <div class="flex flex-wrap align-items-center pb-8 px-4">
                <h4 class="m-0 mr-5" style="line-height: 22px">alpha virtuals</h4>
                <h6 class="m-0 font-medium text-300" style="line-height: 17px">Copyright Ⓒ {{ currentYear }}</h6>
            </div>
        </div>
    </div>

    <AppConfig simple />
</template>
