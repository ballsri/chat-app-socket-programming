<template>
    <div class="login-container">
        <a-avatar class="logo" shape="square" size="large"
            :src="logo"></a-avatar>

        <div class="title">
            {{ title }}
        </div>
        <a-form class="login-form" @submit.prevent="login">
            <a-form-item>
                <a-input v-model="email" prefix-icon="user" placeholder="Email" class="input" />
            </a-form-item>
            <a-form-item>
                <a-input v-model="password" prefix-icon="lock" type="password" placeholder="Password" class="input" />
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
export default {
    data() {
        return {
            title: "Login",
            email: "",
            password: "",
            logo: logo,
        };
    },
    methods: {
        async login() {
            // Call your login API here
            try {
                const response = await this.$axios.post("/api/login", {
                    email: this.email,
                    password: this.password,
                });
                // Redirect to home page
                this.$router.push("/");
            } catch (error) {
                console.error(error);
            }
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
  