<template>
    <div class="edit-container">
        <a-avatar class="logo" shape="square" size="large" :src="logo"></a-avatar>
        <div class="title">
            {{ title }}
        </div>
        <a-form class="edit-form" @submit.prevent="edit">
            <a-form-item>
                <div>
                    User : {{ $route.params.id }}
                </div>
            </a-form-item>
            <a-form-item>
                <a-input v-model="name" prefix-icon="name" @change="onChangeName" placeholder="Name" class="input" />
            </a-form-item>
            <a-form-item>
                <a-input v-model="password" prefix-icon="lock" @change="onChangePassword" type="password"
                    placeholder="Password" class="input" />
            </a-form-item>
            <a-form-item>
                <div class="div-button">
                    <a-button type="primary" @click="$router.push('/chat')" class="button">Back</a-button>
                    <a-button type="primary" html-type="submit" class="button">Edit</a-button>
                </div>
            </a-form-item>
        </a-form>

    </div>
</template>

<script lang="ts">
import logo from "@/logo.png";
import { message } from "ant-design-vue";

const runTimeConfig = useRuntimeConfig();
export default {
    data() {
        return {
            title: "Edit User",
            name: "",
            username: "",
            password: "",
            logo: logo
        };
    },
    methods: {
        async edit() {
            // Call your edit API here

            useFetch(runTimeConfig.public.baseURL + "/api/v1/users/edit/" + this.$route.params.id, {
                method: "POST",
                body: JSON.stringify(
                    {
                        username: this.username,
                        password: this.password,
                        confirm_password: this.password,
                        name: this.name
                    }
                )
            }).then((res) => {

                console.log(res.data.value)
                if (res.data.value !== null) {
                    if (res.data.value.success) {

                        message.success("edit success")
                        this.$router.push("/login");
                        return;
                    } else {
                        message.error(res.data.value.message)
                        return;
                    }
                }

                message.error(res.error.value.response._data.message)

            })
        },


        onChangePassword(e: any) {
            this.password = e.target.value;
        },

        onChangeName(e: any) {
            this.name = e.target.value;
        }
    },
};
</script>

<style scoped>
.title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 16px;
}

.edit-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.logo {
    margin-bottom: 16px;
}

.input {
    height: 50px;
    width: 100%;
}

.edit-form {
    max-width: 300px;
    width: 100%;
}

.div-button {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
}

.button {
    height: 40px;
    width: 100%;

    font-size: 16px;
}
</style>
