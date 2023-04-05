<template>
    <div class="chat-container">


        <div class="user-profile">
            <a-list bordered>
                <a-list-item>
                    <div>
                        <a-avatar size="large">
                            <UserOutlined />
                        </a-avatar>

                        <a-divider type="vertical" />

                    </div>
                </a-list-item>

                <div>
                    <a-button class="button">
                        <EditOutlined />
                        Edit Profile
                    </a-button>
                </div>


                <div>

                    <a-popconfirm title="Are you sure you want to log out?" ok-text="Yes" cancel-text="No"
                        placement="bottomRight">
                        <a-button type="danger" class="button">
                            <LogoutOutlined />
                            Logout
                        </a-button>
                    </a-popconfirm>

                </div>

            </a-list>
        </div>


        <div class="users-list-container">
            <a-list bordered class="users-list">
                <a-list-item v-for="user in users" :key="user.id">
                    <a-avatar size="large">
                        <UserOutlined />
                    </a-avatar>
                    {{ user.name }}
                </a-list-item>
            </a-list>
        </div>

        <div class="group-chats-container">
            <a-list bordered class="group-chat-list">
                <a-list-item v-for="g in groups" :key="g.id">
                    {{ g.name }}
                </a-list-item>
            </a-list>
        </div>
        <div class="chat-window">
            <a-card title="Group Chat" class="chat-window-data">
                <div class="data-message" ref="scroll">
                    <div v-for="(message, i) in messages" :key="message.id">
                        <a-divider v-if="i != 0" />
                        <a-avatar size="large">
                            <UserOutlined />
                        </a-avatar>
                        <p>{{ message.sender }}: {{ message.text }}</p>
                    </div>
                </div>
                <a-input ref="input" placeholder="Type a message..." v-model="newMessageText" @change="changeMessageText"
                    @press-enter="sendMessage" />
            </a-card>
        </div>
    </div>
</template>
  
<script lang="ts">
// import icon
import { UserOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons-vue';
const nuxtApp = useNuxtApp();




export default {

    components: {
        UserOutlined,
        EditOutlined,
        LogoutOutlined,

    },

    data() {
        return {
            users: [
                { id: 1, name: "User 1" },
                { id: 2, name: "User 2" },
                { id: 3, name: "User 3" },
                { id: 4, name: "User 4" }
            ],
            groups: [
                { id: 1, name: "Group 1" },
                { id: 2, name: "Group 2" },
                { id: 3, name: "Group 3" },
            ],
            messages: [
                { id: 1, sender: "User 1", text: "Hello" },
                { id: 2, sender: "User 2", text: "Hi" },
                { id: 3, sender: "User 1", text: "How are you?" },
            ],
            activeGroupId: null,
            newMessageText: "",
            offsetTop: 320,
        };
    },

    mounted() {
        this.scrollToBottom();
    },

    methods: {
        sendMessage() {
            if (this.newMessageText === "") {
                return;
            }
            let message = {
                id: this.messages.length + 1,
                sender: "User 1",
                text: this.newMessageText,
            }
            this.messages.push(message);
            console.log(message);

            nuxtApp.$io.emit('send_message', {message, group: 'group1', user: 'user1'});

            this.newMessageText = "";
            this.$refs.input.stateValue = '';
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        changeMessageText(e) {
            this.newMessageText = e.target.value;
        },
        scrollToBottom() {

            const msgContainer = this.$refs.scroll;
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }
    },

    watch: {
        messages() {
            this.scrollToBottom();
        }
    },

    created() {
        nuxtApp.$io.on('broadcast_message', (message : any) => {
            this.messages.push(message);
        });
    }


};
</script>
  
<style scoped>
.chat-container {
    display: grid;
    grid-template-columns: 1fr 1fr 3fr;
    grid-template-rows: 1fr 2fr 2fr;
    height: 100%;
}

.user-profile {
    grid-column: 1;
    grid-row: 1;

    padding: 20px;
    width: 300px;
}

.button {
    width: 100%;
}



.users-list-container {
    grid-column: 1;
    grid-row: 2 / 4;


    width: 300px;
    padding: 20px;

}

.users-list {
    height: 550px;
    overflow-y: scroll;
}

.group-chats-container {
    grid-column: 2;
    grid-row: 1 / 4;

    width: 300px;
    padding: 20px;
}

.group-chat-list {
    height: 720px;
    overflow-y: scroll;
    background-color: #f0f2f5;
}

.chat-window {
    grid-column: 3;
    grid-row: 1 / 4;
    padding: 20px;
}

.chat-window-data {
    background-color: #f0f2f5;
}

.data-message {
    height: 600px;
    overflow-y: scroll;
}
</style>
  