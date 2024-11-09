<template>
    <div class="otp-input">
      <input
        v-for="(digit, index) in otpDigits"
        :key="index"
        v-model="otpDigits[index]"
        @input="handleInput(index)"
        @keydown="handleKeydown($event, index)"
        :ref="el => inputRefs[index] = el"
        :type="showcode ? 'text' : 'password'"
        maxlength="1"
        pattern="\d*"
        inputmode="numeric"
        class="otp-digit"
      />
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    name: 'OtpInput',
    emits: ['update:modelValue'],
    props: {
      modelValue: {
        type: String,
        default: '',
      },
      showcode:{
        type:Boolean,
        default:false
      }
    },
    setup(props, { emit,expose }) {
      const otpDigits = ref(['', '', '', '', '', '']);
      const inputRefs = ref([]);
  
      const handleInput = (index) => {
        if (otpDigits.value[index].length === 1 && index < 5) {
          inputRefs.value[index + 1].focus();
        }
        validateAndEmit();
      };
  
      const handleKeydown = (event, index) => {
        if (event.key === 'Backspace' && index > 0 && otpDigits.value[index] === '') {
          otpDigits.value[index - 1] = '';
          inputRefs.value[index - 1].focus();
        }
      };
  
      const validateAndEmit = () => {
        const otp = otpDigits.value.join('');
        if (otp.length === 6 && /^\d+$/.test(otp)) {
          emit('update:modelValue', otp);
        } else {
          emit('update:modelValue', '');
        }
      };
      const clearCode = () => {
        otpDigits.value = ['', '', '', '', '', ''];
        inputRefs.value[0].focus();
      };
      expose({
        clearCode
      })
  
      watch(() => props.modelValue, (newValue) => {
        if (newValue.length === 6 && /^\d+$/.test(newValue)) {
          otpDigits.value = newValue.split('');
        }
      });
  
      return {
        otpDigits,
        inputRefs,
        handleInput,
        handleKeydown,
        clearCode,
      };
    },
  };
  </script>
  
  <style scoped>
  .otp-input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .otp-input input {
    width: 40px;
    height: 5vh;
    /* height: 40px; */
    text-align: center;
    font-family: "Baloo Paaji 2", sans-serif;
    font-weight: 400;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .otp-digit:focus {
    outline: none;
  border: 2px solid #bc8f8f;
  }
  .otp-digit::-ms-reveal,
.otp-digit::-ms-clear {
  display: none;
}

.otp-digit::-webkit-contacts-auto-fill-button,
.otp-digit::-webkit-credentials-auto-fill-button {
  visibility: hidden;
  display: none !important;
  pointer-events: none;
  height: 0;
  width: 0;
  margin: 0;
}
  </style>