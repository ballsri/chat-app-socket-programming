<template>
    <div class="chat-container">

        <div class="user-profile">
            <a-list bordered>
                <a-list-item>
                    <div>
                        <a-avatar size="large" >
                            <UserOutlined />
                        </a-avatar>
                        
                        <a-divider type="vertical" />

                    </div>
                </a-list-item>
                <a-list-item>
                    <div>
                        <a-button >
                            <EditOutlined />
                            Edit Profile
                        </a-button>
                    </div>
                </a-list-item>
                <a-list-item>
                    <div>

                        <a-popconfirm title="Are you sure you want to log out?" ok-text="Yes" cancel-text="No">
                            <a-button type="danger"  >
                                <LogoutOutlined />
                                Logout
                            </a-button>
                        </a-popconfirm>
                        
                    </div>
                </a-list-item>
            </a-list>
        </div>
        <div class="users-list">
            <a-list bordered>
                <a-list-item v-for="user in users" :key="user.id">
                    <a-avatar size="large">
                        <UserOutlined />
                    </a-avatar> 
                    {{ user.name }}
                </a-list-item>
            </a-list>
        </div>
        <div class="group-chats-list">
            <a-list bordered>
                <a-list-item v-for="g in groups" :key="g.id">
                    {{ g.name }}
                </a-list-item>
            </a-list>
        </div>
        <div class="chat-window">
            <a-card title="Group Chat">
                <div v-for="message in messages" :key="message.id">
                    <p>{{ message.sender }}: {{ message.text }}</p>
                </div>
                <a-input ref="input" placeholder="Type a message..." v-model="newMessageText" @change=" changeMessageText" @press-enter="sendMessage" />
            </a-card>
        </div>
    </div>
</template>
  
<script>
// import icon
import { UserOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons-vue';


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
                { id: 4, name: "User 4"}
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

            newMessageText: "",
        };
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

            this.newMessageText = "";
            this.$refs.input.stateValue = '';
        },
        changeMessageText(e) {
            this.newMessageText = e.target.value;
        }
    },
    

};
</script>
  
<style scoped>
.chat-container {
    display: grid;
    grid-template-columns: 1fr 1fr 3fr;
    grid-template-rows: 1fr 1fr;
    height: 100%;
}

.user-profile {
    grid-column: 1;
    grid-row: 1;
    
    max-width: 300px;
    padding: 20px;
}

.users-list {
    grid-column: 1;
    grid-row: 2 / -1;
    
    max-width: 300px;
    padding: 20px;
}
.group-chats-list {
    grid-column: 2;
    grid-row: 1 /  3;
    
    max-width: 300px;
    padding: 20px;
}

.chat-window {
    grid-column: 3;
    grid-row: 1 /  3;
    padding: 20px;
}
</style>
  