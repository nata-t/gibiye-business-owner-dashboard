<script setup>
import { ref, nextTick, onMounted } from 'vue';
import ChatBox from './ChatBox.vue';
import ChatSidebar from './ChatSidebar.vue';
import io from 'socket.io-client';

const activeUserId = ref(1);
const users = ref([]);

// const message = ref('');
const socket = io('http://localhost:9000');

onMounted(async () => {
    users.value = await getUserData();
    scrollToLastMessage();
});

const getUserData = async () => {
    return new Promise((resolve) => {
        const username = 'alpha_1';
        socket.emit('join', username);

        socket.on('chatHistory', (history) => {
            resolve(history);
        });
    });
};

const changeActiveUser = (user) => {
    activeUserId.value = user.id;
    scrollToLastMessage();
};

const sendMessage = async (message) => {
    const activeUser = findActiveUser();
    activeUser.messages.push(message);
    const data = {
        sender: 'alpha_1',
        receiver: activeUser.userName,
        message: message.text,
        owner: message.owner
    };
    socket.emit('sendMessage', data, (ack) => {
        console.log('the message was ' + ack + '!');
    });
    scrollToLastMessage();
};

const findActiveUser = () => {
    return users.value.find((user) => user.id === activeUserId.value) || {};
};

const scrollToLastMessage = async () => {
    const element = document.querySelector('.user-message-container');

    await nextTick(() => {
        element.scroll({ top: element.scrollHeight });
    });
};
</script>

<template>
    <div class="flex flex-column md:flex-row gap-5" style="min-height: 81vh">
        <div class="md:w-25rem card p-0">
            <ChatSidebar @change:active:user="changeActiveUser" :users="users"></ChatSidebar>
        </div>
        <div class="flex-1 card p-0">
            <ChatBox @send:message="sendMessage" :user="findActiveUser()"></ChatBox>
        </div>
    </div>
</template>
