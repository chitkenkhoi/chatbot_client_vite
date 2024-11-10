<template>
  <button class="login-button" :class="{'-disabled':disabled}" @click="handleClick" :disabled="disabled">
    {{ buttonText }}
  </button>
</template>
  
  <script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AnimatedLoginButton",
  props: {
    buttonText: {
      type: String,
      default: "Login",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const handleClick = () => {
      emit("clicked");
    };

    return {
      handleClick,
    };
  },
});
</script>
  
  <style scoped>
.login-button {
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
  background-color: 	#D2B48C;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  transition: all 0.2s ease;
}

.login-button:hover {
  transform: translateY(-3px);
  background-color: #BC8F8F;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-button:active {
  transform: translateY(-1px);
}
.login-button.-disabled {
  background-color: grey;
  box-shadow: none;
  cursor: not-allowed;
}
.login-button.-disabled:hover {
  transform: none;
  background-color: grey;
  box-shadow: none;
  cursor: not-allowed;
}
</style>