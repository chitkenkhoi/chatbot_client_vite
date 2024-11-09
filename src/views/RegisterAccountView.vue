<template>
  <div class="login">
    <div class="leftbox">
      <img class="logo" alt="logo" src="../assets/logonew.png" />
      <!-- <img class = "company" alt="logo" src="../assets/company.png"> -->
      <img alt="login" src="../assets/registeraccount.png" />
    </div>
    <div class="rightbox">
      <div class="login-container">
        <h1>Xác thực email thành công👋</h1>
        <p>Hãy điền các thông tin cần thiết dưới đây</p>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label
              for="username"
              :class="{ 'is-focused': state.isUsernameFocused }"
              >Tên hiển thị</label
            >
            <input
              type="text"
              id="username"
              v-model="state.username"
              @focus="state.isUsernameFocused = true"
              @blur="state.isUsernameFocused = false"
            />
          </div>
          <!-- <PasswordCheck :password="state.password" v-if="!(state.password.length >= 8 && state.password.length <= 20 && /[A-Z]/.test(state.password) && /[a-z]/.test(state.password) && /[0-9]/.test(state.password))"/> -->
          <div class="form-group">
            <div class ="label">
              <label
              for="password"
              :class="{ 'is-focused': state.isPasswordFocused }"
              >Mật khẩu</label
            >
            <i class = "eye" @click="toggleShowPassword(1)" :class = "state.isShowPassword1? 'fas fa-eye-slash':'fas fa-eye'"></i>
            </div>
            
            <div class="password-input">
              <input
                :type="state.isShowPassword1? 'text':'password'"
                id="password"
                v-model="state.password"
                @focus="state.isPasswordFocused = true"
                @blur="state.isPasswordFocused = false"
                @change="checkPassword"
                class="passwordinput"
              />
              <PasswordCheck
                class="table-container"
                :password="state.password"
                v-if="
                  !(
                    state.password.length >= 8 &&
                    state.password.length <= 20 &&
                    /[A-Z]/.test(state.password) &&
                    /[a-z]/.test(state.password) &&
                    /[0-9]/.test(state.password)
                  ) && state.isPasswordFocused
                "
              />
            </div>
          </div>
          <div class="form-group">
            <div class ="label">
              <label
              for="password"
              :class="{ 'is-focused': state.isPasswordAgainFocused }"
              >Nhập lại mật khẩu</label
            >
            <i class = "eye" @click="toggleShowPassword(2)" :class = "state.isShowPassword2? 'fas fa-eye-slash':'fas fa-eye'"></i>
            </div>
            
            <div class="password-input">
              <input
                :type="state.isShowPassword2? 'text':'password'"
                v-model="state.passwordAgain"
                @focus="state.isPasswordAgainFocused = true"
                @blur="state.isPasswordAgainFocused = false"
                class="passwordinput"
              />
            </div>
          </div>
          <div class="warning-text" v-if="state.showPasswordWarning">
            Mật khẩu không đúng. Vui lòng thử lại.
          </div>
          <!-- <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="state.rememberMe" />
                <span>Nhớ trình duyệt này</span>
              </label>
              <a href="#" class="forgot-password">Quên mật khẩu?</a>
            </div> -->
          <AnimatedLoginButton class="button-submit" :buttonText="state.isSumitting? 'Đang đăng ký...':'Đăng ký'" @clicked="handleSubmit" :disabled = "state.isSumitting || !(state.password.length >= 8 &&
                    state.password.length <= 20 &&
                    /[A-Z]/.test(state.password) &&
                    /[a-z]/.test(state.password) &&
                    /[0-9]/.test(state.password)) || !state.username || state.password != state.passwordAgain"/>
          <!-- <button type="submit" class="login-button">Đăng nhập</button> -->
        </form>

        <p class="create-account">
          Đã có tài khoản?
          <a href="#" @click="this.$router.push('/login')">Đăng nhập</a>
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
import AnimatedLoginButton from "../components/Button.vue";
import PasswordCheck from "../components/PasswordCheck.vue";
import { useRouter } from "vue-router";
import axiosInstance from '@/api/axios';
export default {
  components: {
    AnimatedLoginButton,
    PasswordCheck,
  },
  setup() {
    const errorMessages = {
  'please verify your email first': 'Vui lòng xác thực email trước',
  'username, email, and password are required': 'Tên hiển thị, email và mật khẩu là bắt buộc',
  // Add more error mappings here
};
    // const sleep = (ms) => {
    //   return new Promise((resolve) => setTimeout(resolve, ms));
    // };
    const router = useRouter();
    const state = reactive({
      username: "",
      password: "",
      passwordAgain: "",
      isPasswordAgainFocused: false,
      isShowPassword1:false,
      isShowPassword2:false,
      isUsernameFocused: false,
      isPasswordFocused: false,
      showPasswordWarning: false,
      errorMessage:'',
      isSumitting: false,
    });
    const handleSubmit = async () => {
      state.isSumitting = true;
      state.showPasswordWarning = false;
      try{
        const response = await  axiosInstance.post("/register", {
        username: state.username,
        password: state.password,
        email: localStorage.getItem("userEmail"),
      });
      if (response.status == 200){
        state.isSumitting = false;
        localStorage.setItem("userName", state.username);
        router.push("/new")
      }
      }catch(e){
        state.showPasswordWarning = true;
        state.errorMessage = errorMessages[e.response.data.error];
        state.isSumitting = false;
        console.log(e)
      }
      

      
    };
    const goToRegister = () => {
      router.push("/register");
    };
    const toggleShowPassword = (id)=>{
      if (id == 1){
        state.isShowPassword1 = !state.isShowPassword1
      }else{
        state.isShowPassword2 = !state.isShowPassword2
      }
    }
    return {
      state,
      handleSubmit,
      goToRegister,
      toggleShowPassword,
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
  background-color: #d2b48c;
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
  width: 60%;
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
  color: #bc8f8f;
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
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border: 2px solid #bc8f8f;
}
input:focus + label {
  color: #7367f0;
}

.password-input {
  position: relative;
}
.table-container {
  z-index: 1;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  /* border: 1px solid #ccc; */
  border-top: none;
  border-radius: 0 0 4px 4px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
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
.eye{
  
  transform: translateY(-50%);
  cursor: pointer;
}
.label{
  display:flex;
  flex-direction: row ;
  justify-content: space-between;
  align-items: center;
}
.warning-text {
  position: absolute;
  top: 54%;
  /* left: 0;
    top: 100%;
    width: 100%; */
  color: #bc8f8f;
  margin-top: 4px;
  transition: opacity 0.9s ease;
}
input[type="checkbox"] {
  margin-right: 5px;
  cursor: pointer;
  height: 8%;
  width: 8%;
}
.button-submit {
  position: relative;
  top: 15px;
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
  position:relative;
  top:3vh;
}

.create-account a {
  color: #bc8f8f;
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
  color: #bc8f8f;
  text-decoration: none;
}
.passwordinput::-ms-reveal,
.passwordinput::-ms-clear {
  display: none;
}

.passwordinput::-webkit-contacts-auto-fill-button,
.passwordinput::-webkit-credentials-auto-fill-button {
  visibility: hidden;
  display: none !important;
  pointer-events: none;
  height: 0;
  width: 0;
  margin: 0;
}
</style>
  