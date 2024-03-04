<script setup>
import UserCard from './UserCard.vue';
import { ref, watch } from 'vue';

const props = defineProps({
    users: {
        type: Array,
        default: () => []
    }
});

const filteredUsers = ref([]);
const searchedUser = ref('');
const emit = defineEmits(['change:active:user']);

watch(
    () => props.users,
    (newUsers) => {
        filteredUsers.value = newUsers;
    },
    { immediate: true }
);

const onChangeActiveUser = (user) => {
    emit('change:active:user', user);
};

const filter = async () => {
    if (searchedUser.value === '') {
        filteredUsers.value = props.users;

        return;
    }

    const filteredArr = filteredUsers.value.filter((user) => user.name.toLowerCase().includes(searchedUser.value.toLowerCase()));

    filteredUsers.value = [...filteredArr];
};
</script>
<template>
    <div class="flex flex-column align-items-center border-bottom-1 surface-border p-6">
        <Avatar label="A" v-badge="4" class="mr-2" size="xlarge" />
        <span class="text-900 text-xl font-semibold mt-4">Alpha virtuals</span>
    </div>
    <div class="w-full flex row-gap-4 flex-column surface-border p-4">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search"></i>
            <InputText id="search" type="text" placeholder="Search" class="w-full" v-model="searchedUser" @input="filter" />
        </span>
        <div class="flex flex-row gap-4 md:flex-column overflow-auto">
            <UserCard v-for="user in filteredUsers" :key="user" :user="user" @click="onChangeActiveUser(user)"></UserCard>
        </div>
    </div>
</template>
