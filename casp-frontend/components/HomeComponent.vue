<template>
    <div class="home-container">
        <img class="img" :src="logo" alt="logo" />
        <div class="button-group">
            <a-button class="home-button" type="primary" @click="$router.push('/login')">Log In</a-button>
            <a-button class="home-button" type="primary" @click="$router.push('/register')">Register</a-button>
        </div>
    </div>
</template>
  
<script lang="ts">
import logo from "@/logo.png";
export default {
    name: "HomeComponent",
    data() {
        return {
            logo: logo
        }
    }
}

</script>

  
<style scoped>
.home-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;

}

.img {
    height: 350px;
    width: 650px;
    margin-bottom: 50px;
}

.title {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 32px;
    text-align: center;
}

.button-group {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.home-button {
    margin: 0 8px;
    height: 50px;
    width: 150px;

    font-size: large;
}


@media screen and (max-width: 750px) {
    .img {
        height: 300px;
        width: 500px;
        margin-bottom: 50px;
    }

}

@media screen and (max-width: 550px) {
    .img {
        height: 200px;
        width: 350px;
        margin-bottom: 50px;
    }

    .home-button {
        margin: 0 8px;
        height: 40px;
        width: 100px;

        font-size: large;
    }

}
</style>
  