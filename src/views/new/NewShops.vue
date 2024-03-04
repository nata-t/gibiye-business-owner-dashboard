<script setup>
import { ref, onBeforeMount } from 'vue';
import { SearchDropDownOptionsService } from '@/service/SearchDropDownOptionsService';

const searchDropDownOptionsService = new SearchDropDownOptionsService();
onBeforeMount(() => {
    searchDropDownOptionsService.getSearchDropDownOptions().then((data) => {
        DropOptions.value = data.MasterAgent;
    });
});

const active = ref(0);

//step 1
const AgentName = ref();
const mobile = ref();
const address = ref();

//step 2
const share = ref(50);
const cashier = ref(4);
const MasterAgent = ref();
const DropOptions = ref();

//step 3
const username = ref();
const OddType = ref();
const margin = ref(18);
const OddTypes = ref([{ name: 'kiron' }, { name: 'mohio' }, { name: 'mohio2' }, { name: 'promo' }, { name: 'type1' }, { name: 'type2' }, { name: 'promo1' }, { name: 'promo2' }, { name: 'promo3' }, { name: 'promo4' }, { name: 'promo5' }]);

const items = ref([
    {
        label: 'Personal Information',
        to: '/user-accounts/new-shop/',
        command: () => {
            active.value = 0;
        }
    },
    {
        label: 'Companies offer',
        to: '/user-accounts/new-shop/',
        command: () => {
            active.value = 1;
        }
    },
    {
        label: 'System setup',
        to: '/user-accounts/new-shop/',
        command: () => {
            active.value = 2;
        }
    }
]);

const next = () => {
    if (active.value < items.value.length - 1) {
        active.value += 1;
    }
};

const previous = () => {
    if (active.value > 0) {
        active.value -= 1;
    }
};
</script>

<template>
    <div>
        <div class="card">
            <Steps :model="items" v-model:activeStep="active" :readonly="false" />
        </div>
        <div v-if="active === 0" class="card flex flex-column">
            <div class="flex flex-column">
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">Agent Name</h1>
                    <InputText v-model="AgentName" type="text" size="medium" placeholder="Your agent name" />
                </div>
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">Mobile</h1>
                    <InputNumber v-model="mobile" placeholder="Mobile number" />
                </div>
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">Address</h1>
                    <InputText v-model="address" type="text" size="medium" placeholder="Agents address" />
                </div>
            </div>
            <div class="flex justify-content-between">
                <Button class="mt-4 w-13rem" outlined label="Cancel"></Button>
                <Button class="mt-4 w-13rem" label="Next" @click="next()"></Button>
            </div>
        </div>
        <div v-if="active === 1" class="card flex flex-column">
            <div class="flex flex-column">
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">Share</h1>
                    <InputNumber v-model="share" inputId="percent" suffix="%" />
                </div>
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">Cashiers</h1>
                    <InputNumber v-model="cashier" />
                </div>
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">Master Agent</h1>
                    <Dropdown v-model="MasterAgent" :options="DropOptions" optionLabel="name" placeholder="choose..." class="w-16rem" />
                </div>
            </div>
            <div class="flex justify-content-between">
                <Button class="mt-4 w-13rem" outlined label="Previous" @click="previous()"></Button>
                <Button class="mt-4 w-13rem" label="Next" @click="next()"></Button>
            </div>
        </div>
        <div v-if="active === 2" class="card flex flex-column">
            <div class="flex flex-column">
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">Username</h1>
                    <InputText v-model="username" type="text" size="medium" placeholder="A unique username" />
                </div>
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">Odd Type</h1>
                    <Dropdown v-model="OddType" :options="OddTypes" optionLabel="name" placeholder="choose..." class="w-16rem" />
                </div>
                <div class="flex flex-column mr-4 mb-4">
                    <h1 class="mb-2" style="font-size: 15px">RTP/Margin</h1>
                    <InputNumber v-model="margin" inputId="percent" suffix="%" />
                </div>
            </div>
            <div class="flex justify-content-between">
                <Button class="mt-4 w-13rem" outlined label="Previous" @click="previous()"></Button>
                <Button class="mt-4 w-13rem" label="Save"></Button>
            </div>
        </div>
    </div>
</template>
