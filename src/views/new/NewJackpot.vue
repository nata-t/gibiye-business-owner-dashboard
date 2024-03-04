<script setup>
import { ref } from 'vue';

const shop = ref();
const MinBetAmount = ref();
const JackpotStart = ref();
const GameType = ref();

const shops = [
    { name: 'Adama1' },
    { name: 'Adama2' },
    { name: 'Mekelle1' },
    { name: 'Mekelle2' },
    { name: 'AddisAbaba1' },
    { name: 'AddisAbaba2' },
    { name: 'DireDawa1' },
    { name: 'DireDawa2' },
    { name: 'BahirDar1' },
    { name: 'BahirDar2' },
    { name: 'Hawassa1' },
    { name: 'Hawassa2' },
    { name: 'Gondar1' },
    { name: 'Gondar2' },
    { name: 'Jimma1' },
    { name: 'Jimma2' },
    { name: 'DebreMarkos1' },
    { name: 'DebreMarkos2' },
    { name: 'Axum1' },
    { name: 'Axum2' },
    { name: 'Harar1' },
    { name: 'Harar2' },
    { name: 'Nekemte1' },
    { name: 'Nekemte2' },
    { name: 'Dessie1' },
    { name: 'Dessie2' },
    { name: 'Shashamane1' },
    { name: 'Shashamane2' },
    { name: 'ArbaMinch1' },
    { name: 'ArbaMinch2' },
    { name: 'Jijiga1' },
    { name: 'Jijiga2' },
    { name: 'Gambela1' },
    { name: 'Gambela2' },
    { name: 'Asosa1' },
    { name: 'Asosa2' }
];
const games = ref([{ name: 'All' }, { name: 'Keno' }, { name: 'Spin' }, { name: 'Dog' }, { name: 'Coin' }, { name: 'Red Keno' }]);

const currentYear = ref(new Date().getFullYear());
</script>
<template>
    <div class="card flex flex-column">
        <div class="flex flex-column justify-content-center">
            <div class="flex flex-column mr-4 mb-4">
                <h1 class="mb-2" style="font-size: 15px">Select Shop(*)</h1>
                <MultiSelect v-model="shop" display="chip" :options="shops" optionLabel="name" placeholder="select..." />
            </div>
            <div class="flex flex-column mr-4 mb-4">
                <h1 class="mb-2" style="font-size: 15px">Min Bet Amount</h1>
                <InputMask id="basic" v-model="MinBetAmount" mask="99999999" />
            </div>
            <div class="flex flex-column mr-4 mb-4">
                <h1 class="mb-2" style="font-size: 15px">Jackpot Starts At / Falling at</h1>
                <InputMask id="basic" v-model="JackpotStart" mask="99999999" />
            </div>
            <div class="flex flex-column mr-4 mb-4">
                <h1 class="mb-2" style="font-size: 15px">Game Type</h1>
                <Dropdown v-model="GameType" :options="games" optionLabel="name" placeholder="select game type" class="w-16rem" />
            </div>
        </div>
        <Button style="align-self: end" class="mt-4 w-13rem" label="Submit"></Button>
    </div>
    <div class="flex flex-wrap align-items-left pb-8 px-4">
        <h6 class="font-medium text-300" style="margin-top: 40px; line-height: 17px">alpha virtuals Ⓒ {{ currentYear }}</h6>
    </div>
</template>
