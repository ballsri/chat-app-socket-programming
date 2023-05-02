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
                    <a-button class="button" @click="editProfile">
                        <EditOutlined />
                        Edit Profile
                    </a-button>
                </div>




                <div class="profile-item">
                    <a-popconfirm title="Are you sure you want to log out?" ok-text="Yes" cancel-text="No"
                        placement="bottomRight" @confirm="logout">
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
                    <p> Current Online Guests: {{ numberOfUsers }}</p>
                </div>
                <a-list-item class="user-item" v-for="user in users" :key="user.id" :id="user.id" :name="user.name"
                    @click="selectUserChat($event ,user.name, user.id)">
                    <a-avatar size="large">
                        <UserOutlined />
                    </a-avatar>
                    <p>{{ user.name }}</p>
                    <!-- if the user name is not in this.favorite, display plus circle outlined -->
                    <!-- else display minus circle outlined -->
                    <div style="display: flex; gap: 3ea; font-size: 15px;">
                        <plus-circle-outlined v-if="!favorite.includes(user.name)" v-on:click.stop="addFavorite(user.name)"/>
                        <minus-circle-outlined v-else type="minus-circle-outlined" v-on:click.stop="removeFavorite(user.name)"/>
                    </div>

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
                            <div class="chat-data-message-container">

                                <div class="chat-data-message">
                                    <a-avatar size="large" class="chat-data-message-logo">
                                        <UserOutlined />
                                    </a-avatar>
                                    <p class="chat-data-message-username">{{ message.name }}</p>
                                    <p class="chat-data-message-text"> {{ message.text }}</p>
                                    <a-divider class="chat-data-message-line" type="vertical" />
                                    <p class="chat-data-message-date">{{ new Date(message.sent_at).toLocaleString() }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="chat-data-message-container-self">

                                <div class="chat-data-message-self">
                                    <a-avatar class="chat-data-message-self-logo" size="large">
                                        <UserOutlined />
                                    </a-avatar>
                                    <p class="chat-data-message-self-username">{{ message.name }}</p>
                                    <p class="chat-data-message-self-text"> {{ message.text }}</p>
                                    <a-divider class="chat-data-message-self-line" type="vertical" />
                                    <p class="chat-data-message-self-date">{{ new Date(message.sent_at).toLocaleString() }}
                                    </p>
                                </div>
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
import { UserOutlined, EditOutlined, LogoutOutlined, CiCircleFilled } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import jwtDecode from 'jwt-decode';

const nuxtApp: any = useNuxtApp();
const runTimeConfig = useRuntimeConfig();


const logout = () => {
    localStorage.removeItem('jwt');
    nuxtApp.$io.emit('leaveChat');
    nuxtApp.$router.push('/login');
    message.error('Logged out successfully');
};






export default {

    components: {
    UserOutlined,
    EditOutlined,
    LogoutOutlined,
    CiCircleFilled
},

    data() {
        return {
            favorite: [],
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
            logout: logout,
        };
    },

    async mounted() {

        nuxtApp.$io.emit('numberOfUsers');

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
            let activeUser = data.value.data.find((user: any) => user.id == this.activeUserId);
            console.log(activeUser.favorite);
            this.favorite = activeUser.favorite;
            // this.users.sort((a: any, b: any) => a.name.localeCompare(b.name));
            this.sortUsers();

        }

        // fetch all groups
        ({ data, pending } = await useFetch(`${runTimeConfig.baseURL}` + '/api/v1/groups'))
        if (pending) {
            this.groups = [];
        }
        if (data) {

            this.groups = data.value.data;
            this.groups.sort((a: any, b: any) => a.name.localeCompare(b.name));
        }



    },

    methods: {
        sortUsers(){
            // favorite users first (identify by favorite array which contains user name)
            // if both users are favorite, sort by name
            this.users.sort((a: any, b: any) => {
                if (this.favorite.includes(a.name) && this.favorite.includes(b.name)) {
                    return a.name.localeCompare(b.name);
                }
                else if (this.favorite.includes(a.name)) {
                    return -1;
                }
                else if (this.favorite.includes(b.name)) {
                    return 1;
                }
                else {
                    return a.name.localeCompare(b.name);
                }
            });
        },
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

            this.leaveGroupChat();
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
        leaveGroupChat() {

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
        async selectUserChat(e:any, uname: string, uid: string) {
            // console.log("clicked")
            this.clearSelection();
            this.title = uname
            const chatId = this.getUserChatId(uid)
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
            this.leaveGroupChat();
            this.$router.push('/create-group');
        },
        editProfile() {

            this.leaveGroupChat();
            this.$router.push('/user/' + this.activeUserId);
        },
        async addFavorite(name: string) {
            // console.log(name)
            // create new array to avoid vue reactivity issue
            let newFavorite = [...this.favorite];
            newFavorite.push(name);
            await this.editFavoriteCommit(newFavorite)
            // console.log(this.favorite, 'caller')
        },
        async removeFavorite(name: string) {
            // console.log(name)
            // create new array to avoid vue reactivity issue
            let newFavorite = [...this.favorite];
            newFavorite = newFavorite.filter((item) => item !== name);
            await this.editFavoriteCommit(newFavorite)
            // console.log(this.favorite, 'caller')
        },
        async editFavoriteCommit(fav_list: Array<string>) {
            // console.log(this.favorite, "before edit")
            useFetch(runTimeConfig.public.baseURL + "/api/v1/users/edit/" + this.activeUserId + "/favorite", {
                method: "PUT",
                body: JSON.stringify(
                    {
                        favorite: fav_list
                    }
                )
            }).then((res) => {

                console.log(res.data.value)
                if (res.data.value !== null) {
                    if (res.data.value?.success) {
                        // console.log(res.data)
                        this.favorite = res.data.value?.data.favorite;
                        this.sortUsers();
                        message.success("edit user's favorite success")
                        // console.log(this.favorite, "favorite")
                        return;
                    } else {
                        message.error(res.data.value?.message)
                        return;
                    }
                }

                message.error(res.error.value?.response?._data.message)

            })
        }
        





    },

    watch: {
        messages: function () {
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        }
    },

    created() {
        nuxtApp.$io.on('broadcast_message', (message: any) => {
            console.log("receive", message);
            if (message.group === this.activeGroupId && message.message.user_id !== this.activeUserId) {
                this.messages.push(message.message);
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

        nuxtApp.$io.on('numberOfUsers', (data: any) => {
            this.numberOfUsers = data.numberOfUsers;
            this.numberOfUsersPerGroup = data.numberOfUsersPerGroup;
        });

    }


};
</script>
  
<style scoped>
@import '~/public/css/chat.css';
</style>
  