<template>
    <div class="register-container">
        <a-avatar class="logo" shape="square" size="large"
            :src="logo"></a-avatar>
        <div class="title">
            {{ title }}
        </div>
        <a-form class="register-form" @submit.prevent="register">
            <a-form-item>
                <a-input v-model="name" prefix-icon="name" placeholder="Name" class="input"/>
            </a-form-item>
            <a-form-item>
                <a-input v-model="username" prefix-icon="username" placeholder="Username" class="input"/>
            </a-form-item>
            <a-form-item>
                <a-input v-model="password" prefix-icon="lock" type="password" placeholder="Password" class="input"/>
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
export default {
    data() {
        return {
            title: "Register",
            name: "",
            username: "",
            password: "",
            logo : logo
        };
    },
    methods: {
        async register() {
            // Call your register API here
            try {
                const response = await this.$axios.post("/api/register", {
                    name: this.name,
                    email: this.username,
                    password: this.password,
                });
                // Redirect to login page
                this.$router.push("/login");
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
