<script setup>
import { ref, onBeforeMount } from 'vue';
import { HTTP } from '@/service/axios';
import { useToast } from 'primevue/usetoast';
import Cookies from 'js-cookie';

const toast = useToast();

const posts = ref([]);
onBeforeMount(async () => {
    //fetch posts
    await getPosts();
});

const getPosts = async () => {
    try {
        const loggedUser = Cookies.get('loggedUser');
        const businessId = parseInt(JSON.parse(loggedUser).businessId);
        const response = await HTTP.post('posts/getPostsByBusinessId', { businessId: businessId });
        if (response.status == 200) {
            posts.value = response.data;
        }
    } catch (error) {
        let errorMessage = error.response.data.message;
        if (error.response.status == 400) {
            errorMessage.value = error.response.data.message;
            toast.add({ severity: 'error', summary: error.response.data.error, detail: error.response.data.message, life: 3000 });
        } else if (error.request) {
            errorMessage.value = 'Check your connection or try agian.';
            toast.add({ severity: 'error', summary: 'Network error', detail: errorMessage.value, life: 3000 });
        } else {
            errorMessage.value = 'Error while liking the post. Please try again.';
            toast.add({ severity: 'error', summary: 'Unkown error', detail: errorMessage.value, life: 3000 });
        }
    }
};

// check if user has liked the post
const likedByUser = (post) => {
    const loggedUser = Cookies.get('loggedUser');
    const userId = parseInt(JSON.parse(loggedUser).id);
    return post.likedBy.some((like) => like.userId === userId);
};

const getLikeIcon = (post) => {
    return likedByUser(post) ? 'pi pi-heart-fill' : 'pi pi-heart';
};

const commentVisibility = ref({});

const toggleCommentVisibility = (postId) => {
    commentVisibility.value[postId] = !commentVisibility.value[postId];
};

const label = (postId) => {
    return commentVisibility.value[postId] ? 'Hide Comments' : 'Show Comments';
};

const BASE_URL = 'http://localhost:3000';
const BASE_DIR = '/home/natnael/Desktop/final-year/gibiye-back';

function convertToUrl(filePath) {
    if (filePath == null) {
        return BASE_URL + '/uploads/_placeholders/placeholder-1.jpg';
    } else {
        return BASE_URL + filePath.replace(BASE_DIR, '');
    }
}
</script>

<template>
    <Toast />
    <div v-for="post in posts" :key="post.id" class="mt-4">
        <div class="flex gap-6 flex-wrap mb-4">
            <div class="sm:w-full md:w-full lg:w-25rem">
                <img style="width: 100%; height: 250px; object-fit: cover" class="border-round" :src="convertToUrl(post.picture)" alt="" />
            </div>
            <div class="flex flex-column" style="width: 45rem; height: 320px">
                <div class="text-2xl text-900 mb-4 font-semibold">{{ post.headline }}</div>
                <div style="max-height: 200px" class="overflow-scroll overflow-x-hidden">
                    <p class="line-height-3 text-lg mb-4">
                        {{ post.content }}
                    </p>
                </div>

                <div class="w-full mt-5 mb-2 flex justify-content-end" style="align-self: flex-end">
                    <div class="flex gap-3 mr-3" style="align-self: flex-end">
                        <div>
                            <span class="text-l font-bold text-primary cursor-pointer" @click="toggleCommentVisibility(post.id)">{{ label(post.id) }}</span>
                        </div>
                        <span class="flex align-items-center text-900">
                            <i class="pi pi-comment mr-2"></i>
                            <span class="font-semibold">{{ post.comments.length }}</span>
                        </span>
                        <span class="flex align-items-center text-900">
                            <i :class="getLikeIcon(post)" class="mr-2"></i>
                            <span class="font-semibold">{{ post.likedBy.length }}</span>
                        </span>
                        <span class="flex align-items-center text-900">
                            <i class="pi pi-clock mr-2"></i>
                            <span class="font-semibold mr-1">19</span>
                            <span class="font-semibold">May</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="commentVisibility[post.id]">
            <div class="flex align-items-center mb-4 font-bold">
                <span class="text-xl text-900 mr-4">Comments</span>
                <span class="inline-flex align-items-center justify-content-center w-2rem h-2rem border-1 surface-border border-round">{{ post.comments.length }}</span>
            </div>
            <ul class="list-none p-0 m-0 mb-6">
                <li v-for="comment in post.comments" :key="comment.id" class="flex p-3 mb-3 border-1 surface-border border-round">
                    <img :src="convertToUrl(comment.user.profilePicture)" class="w-3rem h-3rem mr-3 flex-shrink-0" style="border-radius: 50%; object-fit: cover" :alt="'Image' + i" />
                    <div>
                        <span class="font-semibold text-900">{{ comment.user.firstName + ' ' + comment.user.lastName }}</span>
                        <p class="font-semibold text-600 m-0 text-sm">{{ comment.createdAt }}</p>
                        <p class="line-height-3 mb-0 my-3">{{ comment.content }}</p>
                    </div>
                </li>
            </ul>
            <!-- Comments content here -->
        </div>
        <Divider />
    </div>
</template>
<style scoped>
::-webkit-scrollbar {
    width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #888;
    border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #000;
    border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
