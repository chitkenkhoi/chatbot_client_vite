<template>
  <LoadingSpinner v-if="state.isLoading" 
    :size="50"
    color="#ff4081"
    text="Loading..."
    :fullscreen="true"
  />
  <div class="login" v-if="!state.isLoading">
    
    <div class="leftbox">
      <img class = "logo" alt="logo" src="../assets/logonew.png">
      <!-- <img class = "company" alt="logo" src="../assets/company.png"> -->
      <img alt="login" src="../assets/login.png">
    </div>
    <div class="rightbox">
      <div class="login-container">
        <h1>Chào mừng đến với NewG!👋</h1>
        <p>Hãy đăng nhập vào tài khoản của bạn để bắt đầu sử dụng</p>

        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email" :class="{ 'is-focused': state.isEmailFocused }"
              >Email hoặc tên đăng nhập</label
            >
            <input
              type="text"
              id="email"
              v-model="state.email"
              placeholder="ten.ho@hcmut.edu.vn"
              @focus="state.isEmailFocused = true"
              @blur="state.isEmailFocused = false"
            />
          </div>

          <div class="form-group">
            <label
              for="password"
              :class="{ 'is-focused': state.isPasswordFocused }"
              >Mật khẩu</label
            >
            <div class="password-input">
              <input
                type="password"
                id="password"
                v-model="state.password"
                @focus="state.isPasswordFocused = true"
                @blur="state.isPasswordFocused = false"
              />
              <button type="button" class="toggle-password">
                <!-- <i class="fas fa-eye-slash"></i> -->
              </button>
            </div>
          </div>
          <div class="warning-text" v-if="state.showPasswordWarning">
    Mật khẩu hoặc email không đúng. Vui lòng thử lại.
  </div>
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="state.rememberMe" />
              <span>Nhớ trình duyệt này</span>
            </label>
            <a href="#" class="forgot-password">Quên mật khẩu?</a>
          </div>
          <AnimatedLoginButton 
      buttonText="Đăng nhập" 
      @clicked="handleLogin"
    />
          <!-- <button type="submit" class="login-button">Đăng nhập</button> -->
        </form>

        <p class="create-account">
          Chưa có tài khoản? <a href="#" @click.prevent="goToRegister">Đăng ký tài khoản</a>
        </p>

        <div class="social-login">
          <p></p>
          <div class="social-icons">
            <a href="#" class="social-icon facebook"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a href="#" class="social-icon twitter"
              ><i class="fab fa-twitter"></i
            ></a>
            <a href="#" class="social-icon github"
              ><i class="fab fa-github"></i
            ></a>
            <a href="#" class="social-icon google"
              ><i class="fab fa-google"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive } from "vue";
import axiosInstance from '@/api/axios';
import AnimatedLoginButton from '../components/Button.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { useRouter } from 'vue-router';
import { onBeforeMount } from 'vue'
export default {
  components: {
    AnimatedLoginButton,
    LoadingSpinner,
  },
  setup() {
    const router = useRouter();
    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    const state = reactive({
      email: "",
      password: "",
      rememberMe: false,
      isEmailFocused: false,
      isPasswordFocused: false,
      showPasswordWarning: false,
      isLoading:true,
    });
    const handleLogin = async () => {
      state.showPasswordWarning = false;
      console.log("Email:", state.email);
      console.log("Password:", state.password);
      try {
        const response = await axiosInstance.post("/login", {
          email: state.email,
          password: state.password,
        });
        console.log(response.data);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userName", response.data.userName);
        localStorage.setItem("userEmail", response.data.userEmail);
        router.push("/new");
      } catch (error) {
        console.error(error);
        state.showPasswordWarning = true;
      }
    };
    const goToRegister = () => {
      router.push("/register");
    };
    const checkAuthStatus = async () => {
      await sleep(1000)
      try {
        const response = await axiosInstance.get('/ping')
        if (response.data.message === "pong") {
          // User is already logged in
          router.push('/new') // or wherever you want to redirect
          return true
        }
      } catch (err) {
        // Token is invalid or doesn't exist - that's okay, user needs to login
        return false
      } finally {
        await sleep(10)
        state.isLoading = false
      }
    }
    onBeforeMount(async () => {
      await checkAuthStatus()
      await sleep(1000)
    })
    return {
      state,
      handleLogin,
      goToRegister
    };
  },
};
</script>
<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f1f1f1;
  font-family: "Baloo Paaji 2", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}
.leftbox {
  width: 65%;
  height: 100%;
  background-color: 			#D2B48C;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  width: 120px;
  height: 120px;
  position: absolute;
            top: 10px;
            left: 10px;
            padding: 5px;
}
.company {
  width: 120px;
  height: 120px;
  position: absolute;
            top: 80px;
            left: 10px;
            padding: 5px;
}
.rightbox {
  width: 35%;
  height: 100%;
  background-color: #fff;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
  text-align: left;
}
.login-container {
  width: 400px;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}
label.is-focused {
  color: #BC8F8F;
}
input[type="text"],
input[type="password"] {
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 15px;
  /* font-optical-sizing: auto; */
  font-weight: 100;
  font-style: normal;
  width: 100%;
  height: 5vh;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}
input:hover {
  border: 1px solid #77738a;
}
input:focus {
  outline: none;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border: 2px solid 	#BC8F8F;
}
input:focus + label {
  color: #7367f0;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  /* right: 5px; */
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}
.warning-text {
  position: absolute;
  top:54%;
  /* left: 0;
  top: 100%;
  width: 100%; */
  color: #BC8F8F;
  margin-top: 4px;
  transition: opacity 0.9s ease;
}
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  margin-top:10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
input[type="checkbox"] {
  margin-right: 5px;
  cursor: pointer;
  height:8%;
  width:8%;
}

.forgot-password {
  color: #BC8F8F;
  text-decoration: none;
}

/* .login-button {
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 15px;
  font-weight: 100;
  font-style: normal;
  height: 5vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #7367f0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.login-button:hover {
  background-color: #5c50e6;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
} */

.create-account {
  text-align: center;
  margin-top: 20px;
}

.create-account a {
  color: #BC8F8F;
  text-decoration: none;
}

.social-login {
  margin-top: 20px;
  text-align: center;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.social-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f9;
  color: #BC8F8F;
  text-decoration: none;
}
</style>
