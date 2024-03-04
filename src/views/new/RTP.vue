<script setup>
import { ref, watch } from 'vue';

const maxToLose = ref();
const rtp = ref();
const sequence = ref();
const shop = ref();
const selectedShop = ref();
const filters = ref([
    { name: 'Addis Ababa' },
    { name: 'Adama' },
    { name: 'Hawassa' },
    { name: 'Dire Dawa' },
    { name: 'Mekelle' },
    { name: 'Bahir Dar' },
    { name: 'Jimma' },
    { name: 'Axum' },
    { name: 'Lalibela' },
    { name: 'Gondar' },
    { name: 'Debre Tabor' },
    { name: 'Woldia' },
    { name: 'Harar' },
    { name: 'Jijiga' },
    { name: 'Nekemte' },
    { name: 'Gedeo' },
    { name: 'Wondo Genet' },
    { name: 'Hosanna' },
    { name: 'Asela' },
    { name: 'Shashamane' }
]);

const shopInfo = () => {
    selectedShop.value = shop.value;

    maxToLose.value = 23222;
    rtp.value = 34;
    sequence.value = 'Addis Ababa';
};

watch(shop, shopInfo);
</script>

<template>
    <div class="card flex flex-column">
        <h3>RTP</h3>
        <div class="flex flex-wrap mt-2">
            <div class="flex flex-column mr-4">
                <h1 class="mb-2" style="font-size: 15px">Select shop</h1>
                <Dropdown v-model="shop" :options="filters" optionLabel="name" placeholder="choose..." class="w-16rem" />
            </div>
        </div>
        <div class="card p-fluid">
            <div class="flex flex-column gap-2">
                <h3>{{ selectedShop && selectedShop.name }}</h3>
                <div class="field">
                    <label for="name1">Max to lose</label>
                    <InputNumber v-model="maxToLose" inputId="withoutgrouping" :useGrouping="false" />
                </div>
                <div class="field">
                    <label for="email1">RTP</label>
                    <InputNumber v-model="rtp" inputId="minmaxfraction" :min="0" :max="100" />
                </div>
                <div class="field">
                    <label for="age1">Sequence</label>
                    <Dropdown v-model="sequence" :options="filters" optionLabel="name" placeholder="choose..." />
                </div>
            </div>
        </div>
        <Button style="align-self: end" class="mt-4 w-13rem" label="Save change"></Button>
    </div>
</template>
