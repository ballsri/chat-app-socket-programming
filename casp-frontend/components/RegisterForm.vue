<template>
    <div class="register-container">
        <a-avatar class="logo" shape="square" size="large" :src="logo"></a-avatar>
        <div class="title">
            {{ title }}
        </div>
        <a-form class="register-form" @submit.prevent="register">
            <a-form-item>
                <a-input v-model="name" prefix-icon="name" @change="onChangeName" placeholder="Name" class="input" />
            </a-form-item>
            <a-form-item>
                <a-input v-model="username" prefix-icon="username" @change="onChangeUsername" placeholder="Username"
                    class="input" />
            </a-form-item>
            <a-form-item>
                <a-input v-model="password" prefix-icon="lock" @change="onChangePassword" type="password"
                    placeholder="Password" class="input" />
            </a-form-item>
            <a-form-item>
                <a-input v-model="confirm_password" @change="onChangeConfirmPassword" prefix-icon="lock" type="password"
                    placeholder="Confirm Password" class="input" />
            </a-form-item>
            <a-form-item>
                <div class="div-button">
                    <a-button type="primary" @click="$router.push('/')" class="button">Back</a-button>
                    <a-button type="primary" html-type="submit" class="button">Register</a-button>
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
            title: "Register",
            name: "",
            username: "",
            password: "",
            confirm_password: "",
            logo: logo
        };
    },
    methods: {
        async register() {
            // Call your register API here

            useFetch(runTimeConfig.public.baseURL + "/api/v1/auth/register", {
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

                        message.success("Register success")
                        this.$router.push("/login");
                        return;
                    } else {
                        message.error(res.data.value.message)
                        return;
                    }
                }

                for (let i = 0; i < res.error.value.response._data.message.length; i++) {
                    message.error(res.error.value.response._data.message[i])
                }
            })
        },
        onChangeUsername(e: any) {
            this.username = e.target.value;
        },

        onChangePassword(e: any) {
            this.password = e.target.value;
        },

        onChangeConfirmPassword(e: any) {
            this.confirm_password = e.target.value;
        },

        onChangeName(e: any) {
            console.log(e)
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

.register-container {
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

.register-form {
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
