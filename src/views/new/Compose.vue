<script setup>
import { ref } from 'vue';
import { HTTP } from '@/service/axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const postHeadline = ref('');
const postContent = ref('');
const picture = ref(null);

const onUpload = (event) => {
    picture.value = event.target.files[0];
};

const createPost = async () => {
    if (!postHeadline.value || !postContent.value || !picture.value) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all fields', life: 3000 });
        return;
    }

    const formData = new FormData();
    formData.append('headline', postHeadline.value);
    formData.append('content', postContent.value);
    formData.append('picture', picture.value);

    try {
        const response = await HTTP.post('posts/createPost', formData);
        if (response.status == 200) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Post created successfully', life: 3000 });
            // Clear form after successful submission
            postHeadline.value = '';
            postContent.value = '';
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.message || 'Error during post creation', life: 3000 });
    }
};
</script>

<template>
    <Toast />
    <div class="card">
        <h3>New Post</h3>
        <form @submit.prevent="createPost" class="flex flex-column">
            <div class="p-fluid">
                <div class="flex flex-column gap-2">
                    <div class="field">
                        <label for="name1">Post Headline</label>
                        <InputText v-model="postHeadline" placeholder="Enter post headline" />
                    </div>
                    <div class="field">
                        <label for="name1">Post Content</label>
                        <Textarea v-model="postContent" rows="6" placeholder="Enter service description" />
                    </div>
                    <div class="field">
                        <label for="name1">Upload Picture</label>
                        <input type="file" accept="image/*" @change="onUpload" />
                    </div>
                </div>
            </div>
            <Button style="align-self: end" class="mt-4 w-13rem" label="Create Post" type="submit"></Button>
        </form>
    </div>
</template>
