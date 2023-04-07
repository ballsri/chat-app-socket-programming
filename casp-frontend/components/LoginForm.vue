<template>
    <div class="login-container">
        <a-avatar class="logo" shape="square" size="large" :src="logo"></a-avatar>

        <div class="title">
            {{ title }}
        </div>
        <a-form class="login-form" @submit.prevent="login">
            <a-form-item>
                <a-input v-model="username" @change="changeUsername" prefix-icon="user" placeholder="username"
                    class="input" />
            </a-form-item>
            <a-form-item>
                <a-input v-model="password" @change="changePassword" prefix-icon="lock" type="password"
                    placeholder="Password" class="input" />
            </a-form-item>
            <a-form-item>
                <div class="div-button">
                    <a-button type="primary" @click="$router.push('/')" class="button">Back</a-button>
                    <a-button type="primary" html-type="submit" class="button">Log in</a-button>
                </div>
            </a-form-item>
        </a-form>
    </div>
</template>
  
<script lang="ts">
import logo from "@/logo.png";
import { message } from "ant-design-vue";
import jwtDecode from "jwt-decode";
import { useNuxtApp } from "nuxt/app";

const nuxtApp = useNuxtApp();
const runTimeConfig = useRuntimeConfig();



export default {
    data() {
        return {
            title: "Login",
            username: "",
            password: "",
            logo: logo,
        };
    },
    mounted() {
        const token = localStorage.getItem('jwt')
        if (token) {
            try {
                const decoded = jwtDecode(token)
                console.log(decoded)
                // this.user = decoded
            } catch (err) {
                // Handle invalid token
            }
        }
    },
    methods: {
        async login() {
            // Call your login API here
            console.log({
                username: this.username,
                password: this.password,
            })

            useFetch(`${runTimeConfig.baseURL}` + '/api/v1/auth/login', {
                method: "POST",
                body: JSON.stringify(
                    {
                        username: this.username,
                        password: this.password,
                    }),
            }).then((res) => {

                console.log(res.data.value)
                if (res.data.value !== null) {
                    if (res.data.value.success) {
                        localStorage.setItem("jwt", res.data.value.data.token)
                        message.success("Login success")
                        this.$router.push("/chat");
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

        changeUsername(e: any) {
            this.username = e.target.value;
        },

        changePassword(e: any) {
            this.password = e.target.value;
        },
    },
};
</script>
  
<style scoped>
.title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 16px;
}

.login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.logo {
    margin-bottom: 16px;
}

.login-form {
    margin-top: 25px;
    max-width: 300px;
    width: 100%;
}

.input {
    height: 50px;
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
  