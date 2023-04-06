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
                        placement="bottomRight" @confirm="confirm" @cancel="cancel">
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

                <a-list-item v-for="(g, i) in groups" :key="g.id" :value="g.id">

                    <div class="group-item" @click="changeGroup">

                        {{ g.name }}
                    </div>

                </a-list-item>
            </a-list>
        </div>
        <div class="chat-window">
            <a-card title="Group Chat" class="chat-window-data">
                <div class="data-message" ref="scroll">
                    <div v-for="(message, i) in messages" :key="message.message.id">
                        <a-divider v-if="i != 0" />
                        <a-avatar size="large">
                            <UserOutlined />
                        </a-avatar>
                        <p>{{ message.message.sender }}: {{ message.message.text }}</p>
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
import { message } from 'ant-design-vue';
import jwtDecode from 'jwt-decode';
const nuxtApp = useNuxtApp();

const confirm = () => {
    localStorage.removeItem('jwt');
    nuxtApp.$router.push('/login');
    message.error('Logged out successfully');
};



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
                { message: { id: 1, sender: "User 1", text: "Hello" }, group: 1, user: 'user1' },
                { message: { id: 2, sender: "User 2", text: "Hi" }, group: 1, user: 'user1' },
                { message: { id: 3, sender: "User 1", text: "How are you?" }, group: 1, user: 'user1' },

            ],
            activeGroupId: null,
            activeUserId: null,
            activeUsername: null,
            newMessageText: "",
            offsetTop: 320,
            confirm: confirm,
        };
    },

    mounted() {
        // get user from local storage
        let token: string | null = localStorage.getItem("jwt");
        if (token) {
            const user: any = jwtDecode(token);
            this.activeUserId = user.sub;
            this.activeUsername = user.username;
        }
    },

    methods: {
        sendMessage() {
            if (this.newMessageText === "") {
                return;
            }
            let message: any = {
                id: this.messages.length + 1,
                sender: this.activeUserId,
                text: this.newMessageText,
            }
            let payload: any = {
                message,
                group: this.activeGroupId,
                user: this.activeUserId
            }
            this.messages.push(payload);
            console.log(payload);

            nuxtApp.$io.emit('send_message', payload);

            this.newMessageText = "";
            this.$refs.input.stateValue = '';
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        changeMessageText(e: any) {
            this.newMessageText = e.target.value;
        },
        scrollToBottom() {

            const msgContainer: any = this.$refs.scroll;
            msgContainer.scrollTop = msgContainer.scrollHeight;
        },
        changeGroup(e: any) {
            nuxtApp.$io.emit('leaveRoom', this.activeGroupId);

            for (let i = 0; (i < e.target.parentNode.parentNode.children.length); i++) {
                let element = e.target.parentNode.parentNode.children[i].children[0];
                if (element !== e.target) {
                    element.classList.remove('active');
                    element.removeEventListener('click', this.changeGroup, true);

                }
            }
            this.activeGroupId = e.target.parentNode.value;
            e.target.classList.add('active');




            nuxtApp.$io.emit('joinRoom', this.activeGroupId);
        },
    },

    created() {
        nuxtApp.$io.on('broadcast_message', (message: any) => {
            console.log(message);
            if (message.group === this.activeGroupId && message.user !== this.activeUserId) {
                this.messages.push(message);
                this.$nextTick(() => {
                    this.scrollToBottom();
                });

            }
        });
        nuxtApp.$io.on('joinedRoom', (group: any) => {
            this.activeGroupId = group;
        });

        nuxtApp.$io.on('leftRoom', () => {
            this.activeGroupId = null;
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

    display: flex;
    justify-content: center;

}

.group-item {
    padding: 10px;
    border-radius: 5px;
    border: #f0f2f5;
    cursor: pointer;
    width: 250px;
    display: flex;
    justify-content: center;

    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;


    background-color: #fff;
}

.group-item:hover {
    background-color: #cfcfcf;
}

.group-item.active {
    background-color: #cfcfcf;
    pointer-events: none;
    cursor: none;

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
  