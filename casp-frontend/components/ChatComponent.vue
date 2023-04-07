<template>
    <div class="chat-container">


        <div class="user-profile">
            <a-list bordered class="user-profile-list">
                <a-list-item class="profile-item">
                    <div class="user-card-container">
                        <div class="user-card">

                            <a-avatar size="large">
                                <UserOutlined />
                            </a-avatar>
                            <p class="user-name"> {{ activeName }}</p>
                        </div>
                        <a-divider type="vertical" />

                    </div>
                </a-list-item>


                <div class="profile-item">
                    <a-button class="button">
                        <EditOutlined />
                        Edit Profile
                    </a-button>
                </div>




                <div class="profile-item">

                    <a-popconfirm title="Are you sure you want to log out?" ok-text="Yes" cancel-text="No"
                        placement="bottomRight" @confirm="confirm">
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
                <div class="user-online">
                    <p> Current Online User: {{ numberOfUsers }} / {{ users.length+1 }}</p>
                </div>
                <a-list-item class="user-item" v-for="user in users" :key="user.id" :id="user.id" :name="user.name"
                    @click="selectUserChat">
                    <a-avatar size="large">
                        <UserOutlined />
                    </a-avatar>
                    {{ user.name }}
                </a-list-item>
            </a-list>
        </div>

        <div class="group-chats-container">
            <a-list bordered class="group-chat-list">
                <div class="group-item-container">
                    <a-button class="group-item" @click="createGroup">
                        <PlusOutlined />
                        Create Group
                    </a-button>
                </div>

                <a-list-item v-for="(g, i) in groups" :key="g.id" class="group-item-container">

                    <div class="group-item" @click="changeGroup" :value="g.id">

                        {{ g.name }}
                    </div>

                </a-list-item>
            </a-list>
        </div>
        <div class="chat-window">
            <a-card class="chat-window-container" :title="title">
                <div class="chat-window-list" ref="scroll">
                    <div v-if="activeGroupId != null" v-for="(message, i) in messages" :key="message.id" class="chat-data">
                        <a-divider v-if="i != 0" />
                        <div v-if="activeUserId != message.user_id">
                            <div class="chat-data-message">

                                <a-avatar size="large">
                                    <UserOutlined />
                                </a-avatar>
                                <p>{{ message.name }}: {{ message.text }}</p>
                                <p>{{ new Date(message.sent_at).toLocaleString() }}</p>
                            </div>
                        </div>
                        <div v-else>
                            <div class="chat-data-message-self">

                                <a-avatar size="large">
                                    <UserOutlined />
                                </a-avatar>
                                <p>{{ message.name }}: {{ message.text }}</p>
                                <p>{{ new Date(message.sent_at).toLocaleString() }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-window-input">

                    <a-input class="input" v-if="activeGroupId != null" ref="input" placeholder="Type a message..."
                        v-model="newMessageText" @change="changeMessageText" @press-enter="sendMessage" type="text" />
                </div>
            </a-card>
        </div>
    </div>
</template>
  
<script lang="ts">
// import icon
import { UserOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import jwtDecode from 'jwt-decode';
const nuxtApp: any = useNuxtApp();


const runTimeConfig = useRuntimeConfig();


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

            ],
            groups: [

            ],
            messages: [
            ],
            numberOfUsers: 0,
            numberOfUsersPerGroup: {},
            title: "Select a group to start chatting",
            activeGroupId: null,
            activeUserId: null,
            activeUsername: null,
            activeName: null,
            newMessageText: "",
            offsetTop: 320,
            confirm: confirm,
        };
    },

    async mounted() {
        // get user from local storage
        let token: string | null = localStorage.getItem("jwt");
        if (token) {
            const user: any = jwtDecode(token);
            this.activeUserId = user.id;
            this.activeUsername = user.username;
            this.activeName = user.name;
        }


        let data: any;
        let pending: any;
        // fetch all users
        ({ data, pending } = await useFetch(`${runTimeConfig.baseURL}` + '/api/v1/users'))
        if (pending) {
            this.users = [];
        }
        if (data) {
            // remove self from users list
            this.users = data.value.data.filter((user: any) => user.id != this.activeUserId);

        }

        // fetch all groups
        ({ data, pending } = await useFetch(`${runTimeConfig.baseURL}` + '/api/v1/groups'))
        if (pending) {
            this.groups = [];
        }
        if (data) {

            this.groups = data.value.data;
        }



    },

    methods: {
        sendMessage() {

            if (this.newMessageText === "") {
                return;
            }
            let message: any = {
                id: this.messages.length + 1,
                text: this.newMessageText,
                sent_at: new Date(),
                user_id: this.activeUserId,
                name: this.activeName
            }
            let payload: any = {
                message,
                group: this.activeGroupId,

            }
            this.messages.push(payload.message);
            nuxtApp.$io.emit('send_message', payload);

            this.newMessageText = "";
            (this.$refs as any).input.stateValue = '';

        },
        changeMessageText(e: any) {
            this.newMessageText = e.target.value;
        },
        scrollToBottom() {
            const msgContainer: any = this.$refs.scroll;
            msgContainer.scrollTop = msgContainer.scrollHeight;
        },
        changeGroup(e: any) {

            this.leaveGroupChat(e)
            this.activeGroupId = e.target.attributes.value.value;
            this.title = e.target.innerText;
            e.target.classList.add('active');
            this.changeMessageFromGroupId(this.activeGroupId);
            nuxtApp.$io.emit('joinRoom', this.activeGroupId)
        },
        async changeMessageFromGroupId(id: string) {
            const { data, pending }: any = await useFetch(`${runTimeConfig.baseURL}` + '/api/v1/messages/' + id)
            if (pending) {
                this.messages = [];
            }
            if (data) {
                this.messages = data.value.data;
                this.messages.sort((a: any, b: any) => {
                    return new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime();
                });
            }
        },
        async changeMessageFromUserChatId(id: string) {
            const { data, pending }: any = await useFetch(`${runTimeConfig.baseURL}` + '/api/v1/messages/' + id)
            if (pending) {
                this.messages = [];
            }
            if (data) {
                this.messages = data.value.data;
                this.messages.sort((a: any, b: any) => {
                    return new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime();
                });
            }
        },
        leaveGroupChat(e: any) {

            this.title = "Select a group to start chatting";
            nuxtApp.$io.emit('leaveRoom', this.activeGroupId);
            this.clearSelection();
        },

        clearSelection() {
            const active = document.getElementsByClassName('active');
            for (let i = 0; i < active.length; i++) {
                active[i].classList.remove('active');
            }


        },
        async selectUserChat(e: any) {
            this.clearSelection();
            this.title = e.target.attributes.name.value;
            const chatId = this.getUserChatId(e.target.attributes.id.value)
            this.activeGroupId = chatId;
            e.target.classList.add('active');
            await this.changeMessageFromUserChatId(chatId);
            nuxtApp.$io.emit('joinRoom', this.activeGroupId)
        },
        getUserChatId(id: string) {
            let chatId: string = "";
            if (this.activeUserId < id) {
                chatId = this.activeUserId + id;
            } else {
                chatId = id + this.activeUserId;
            }
            return chatId;
        },
        createGroup() {
            this.$router.push('/create-group');
        },

        


    },

    created() {
        nuxtApp.$io.on('broadcast_message', (message: any) => {
            console.log("receive", message);
            if (message.group === this.activeGroupId && message.message.user_id !== this.activeUserId) {
                this.messages.push(message.message);


            }
        });
        nuxtApp.$io.on('joinedRoom', (group: any) => {
            this.activeGroupId = group;
        });

        nuxtApp.$io.on('leftRoom', () => {

            this.activeGroupId = null;
        });

        nuxtApp.$io.on('numberOfUsers', (data: any) => {
            this.numberOfUsers = data.numberOfUsers;
            this.numberOfUsersPerGroup = data.numberOfUsersPerGroup;
        });


    },

    watch: {
        messages: function () {
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        }
    }


};
</script>
  
<style scoped>
@import '~/public/css/chat.css';
</style>
  