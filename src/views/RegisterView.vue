<template>
  <LoadingSpinner v-if="state.isLoading" 
    :size="50"
    color="#ff4081"
    text="Loading..."
    :fullscreen="true"
  />
  <div class="login" v-if="!state.isLoading">
    <div class="leftbox">
      <img class="logo" alt="logo" src="../assets/logonew.png" />
      <!-- <img class = "company" alt="logo" src="../assets/company.png"> -->
      <img alt="login" src="../assets/register.png" />
    </div>
    <div class="rightbox">
      <div class="login-container">
        <h1>Chào mừng đến với NewG!👋</h1>
        <div class = "notification"> {{state.otpSent? "Mã xác thực đã được gởi đến email" :"Hãy sử dụng email của bạn để tạo một tài khoản"}}<div v-if="state.otpSent" class="notiemail">{{ state.email }}</div></div>
        

        <form @submit.prevent="login">
          <div class="form-group" v-if="!state.otpSent">
            <label for="email" :class="{ 'is-focused': state.isEmailFocused }"
              >Email</label
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
          <div class = "form-group"  v-if="state.otpSent">
            <div class = "label-with-eye"><label
              for="otp"
              class ="tittle"
              :class="{ 'is-focused': state.isOtpFocused }"
              >Mã xác thực
              <div class = "refreshcontainer"><span class="material-symbols-outlined" id ="refresh" @click="resendOtp">
refresh
</span></div>
              </label
            > <i id = "eye" @click="toggleShowPassword" :class = "state.showcode? 'fas fa-eye':'fas fa-eye-slash'"></i></div>
            
          <OtpInput class = "OtpInput" v-model="state.otp" :showcode ="state.showcode" @update:modelValue="getCode" />
          </div>
          <div class = "errorMessage" v-if="state.isError">
            Email không tồn tại hoặc đã được sử dụng
          </div>
          <div class = "errorMessage" v-if="state.isOtpError">
           {{state.otpError}}
          </div>
          <!-- <div class="form-group" v-if="state.otpSent">
            <label
              for="password"
              :class="{ 'is-focused': state.isOtpFocused }"
              >Mã xác thực</label
            >
            <div class="password-input">
              <input
                type="password"
                id="password"
                v-model="state.otp"
                @focus="state.isOtpFocused = true"
                @blur="state.isOtpFocused = false"
              />
              <button type="button" class="toggle-password">
                <i class="fas fa-eye-slash"></i>
              </button>
            </div>
          </div> -->

          <!-- <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="state.rememberMe" />
                <span>Nhớ trình duyệt này</span>
              </label>
              <a href="#" class="forgot-password">Quên mật khẩu?</a>
            </div> -->
          <AnimatedLoginButton
            :buttonText="state.otpSent ? state.isSubmitting ? 'Đang xác thực...' : 'Xác thực' : state.isSendingOtp ? 'Đang gởi...' : 'Gởi mã xác thực'"
            @clicked="handleRegister"
            :disabled = "state.isSendingOtp || state.isSubmitting ||(!isValidEmail(state.email)&&!state.otpSent)"
          />
          <!-- <button type="submit" class="login-button">Đăng nhập</button> -->
        </form>

        <p class="create-account">
          Đã có tài khoản? <a href="#" @click="this.$router.push('/login')">Đăng nhập</a>
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
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AnimatedLoginButton from "../components/Button.vue";
import OtpInput from '@/components/OtpInput.vue';
import { useRouter } from 'vue-router';
import { onBeforeMount } from 'vue'
export default {
  components: {
    AnimatedLoginButton,
    OtpInput,
    LoadingSpinner,
  },
  setup() {
    const router = useRouter();
  const sleep = (ms)=>{
    return new Promise(resolve=>setTimeout(resolve,ms))
  }
    const state = reactive({
      showcode:false,
      email: "",
      otp: "",
      otpSent: false,
      otpError:"",
      isError:false,
      isOtpError:false,
      isSubmitting:false,
      isEmailFocused: false,
      isOtpFocused: false,
      isSendingOtp: false,
      isLoading:true,
    });
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const errorMessages = {
  'otp has been expired': 'Mã xác thực đã hết hạn, vui lòng gởi mã mới',
  'otp is incorrect': 'Mã xác thực không chính xác',
  // Add more error mappings here
};
    const handleRegister = async () => {
      state.isError = false
      state.isOtpError = false
      if (state.otpSent) {
        if (state.otp ==''){
          console.log("bad")
          return
        } 
        console.log("Registering with OTP", state.email, state.otp);
        state.isSubmitting = true
        try{
          const formData = new URLSearchParams();
          formData.append('email',state.email)
          formData.append('otp',state.otp)
          const response = await axiosInstance.post('/verify_register_OTP', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          console.log(response.data)
          localStorage.setItem('userEmail',state.email)
        router.push('/registerAccount')
        } catch(e){
          console.log(e)
          state.isOtpError = true
          state.otpError = errorMessages[e.response.data.error] || 'Lỗi hệ thống vui lòng thử lại sau'
        } finally{
          state.isSubmitting = false
        }      //API xác thực
        
        
      } else {
        console.log("Sending OTP to", state.email);
        state.isSendingOtp = true
        state.otp=''
        try{
          const formData = new URLSearchParams();
          formData.append('email',state.email)
          const response = await axiosInstance.post('/registerEmail', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          if (response.data.message === "success"){
            state.otpSent = true;
          }
        }catch(e){
          state.isError = true
          console.log(e)
        }finally{
          state.isSendingOtp = false
        }   
        
      }
    };
    const toggleShowPassword = ()=>{
      state.showcode = !state.showcode
      console.log(state.showcode)
    }
    const getCode = (code)=>{
      state.otp = code
      console.log(code)
    }
    const resendOtp = async () =>{
      if (state.isSendingOtp) {
        console.log("bad")
        return
      }
      state.otp=''
      try{
        state.isSendingOtp = true
        
        
          const formData = new URLSearchParams();
          formData.append('email',state.email)
          const response = await axiosInstance.post('/registerEmail', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          if (response.data.message === "success"){
            state.otpSent = true;
          }
        }catch(e){
          console.log(e)
        }finally{
          state.isSendingOtp = false
        }   
    }
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
    })
    return {
      state,
      handleRegister,
      toggleShowPassword,
      getCode,
      isValidEmail,
      resendOtp
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
  width: 400px;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.notification {
  /* display:flex;
  flex-direction: row; */
  color: #666;
  margin-bottom: 40px;
}
.notiemail{
  position:absolute;
  top: 40%;
  color: #bc8f8f;
}
.form-group {
  margin-bottom: 20px;
}
.label-with-eye{
  display:flex;
  justify-content: space-between;
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
.errorMessage{
  position: absolute;
  top:53%;
  /* left: 0;
  top: 100%;
  width: 100%; */
  color: #BC8F8F;
  margin-top: 4px;
  transition: opacity 0.9s ease;
  font-size:12px;
  
}
.OtpInput{
  /* font-optical-sizing: auto; */
  width: 100%;
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

.toggle-password {
  position: absolute;
  /* right: 5px; */
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}
input[type="checkbox"] {
  margin-right: 5px;
  cursor: pointer;
  height: 8%;
  width: 8%;
}
.refreshcontainer{
  display:flex;
  justify-content: center;
  align-items: center;
}
.tittle{
  display:flex;
  width:30%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
#refresh{
  cursor: pointer;
  font-size: 20px;
}
#refresh:hover{
  color: #bc8f8f;
}
#eye{
  cursor: pointer;
}
.forgot-password {
  color: #bc8f8f;
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
</style>
  