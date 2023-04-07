<template>
    <div class="login-container">
        <a-avatar class="logo" shape="square" size="large" :src="logo"></a-avatar>

        <div class="title">
            {{ title }}
        </div>
        <a-form class="create-form" @submit.prevent="CreateGroup">
            <a-form-item>
                <a-input v-model="groupName" @change="changeGroupName" placeholder="group name" class="input" />
            </a-form-item>
            <a-form-item>
                <div class="div-button">
                    <a-button type="primary" @click="$router.push('/chat')" class="button">Back</a-button>
                    <a-button type="primary" html-type="submit" class="button">Create</a-button>
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
            title: "Create Group",
            groupName: "",
            logo: logo,
        };
    },
    methods: {
        async CreateGroup() {

            useFetch(`${runTimeConfig.baseURL}` + '/api/v1/group/create', {
                method: "POST",
                body: JSON.stringify(
                    {
                        group_name: this.groupName,
                    }),
            }).then((res) => {

                console.log(res.data.value)
                if (res.data.value !== null) {
                    if (res.data.value.success) {
                        message.success("Create Group Success")
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

        changeGroupName(e: any) {
            this.groupName = e.target.value;
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
  