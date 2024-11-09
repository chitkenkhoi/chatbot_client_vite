<template>
    <div class="password-check">
        <div class="password-check__item">
            <div class="password-check__item__label">8-20 kí tự</div>
            <div class="password-check__item__icon">
                <div :class="{'good': password.length >= 8 && password.length <= 20, 'bad': !(password.length >= 8 && password.length <= 20)}"></div>
            </div>
        </div>
        <div class="password-check__item">
            <div class="password-check__item__label">Có ít nhất một chữ cái in hoa và thường</div>
            <div class="password-check__item__icon">
                <i :class="{'good': /[A-Z]/.test(password) && /[a-z]/.test(password), 'bad': !(/[A-Z]/.test(password) && /[a-z]/.test(password))}"></i>
            </div>
        </div>
        <div class="password-check__item">
            <div class="password-check__item__label">Có ít nhất 1 số</div>
            <div class="password-check__item__icon">
                <i :class="{'good': /[0-9]/.test(password), 'bad': !/[0-9]/.test(password)}"></i>
            </div>
        </div>
    </div>
</template>

<script>

export default{
    props:{
        password:{
            type:String,
            required:true
        }
    },
    setup() {
        
    },
}
</script>
<style scoped>
    .password-check{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height:150px;
        box-sizing: border-box;
    }
    .password-check__item{
        width:100%;
        display: flex;
        justify-content: space-between;
    }
    .password-check__item__icon{
        height: 30px;
        width:30px;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .good{
        height: 10px;
        width:10px;
        border-radius:50%;
        color:#BC8F8F;
        background-color:#BC8F8F
    }
   .bad{
    height: 10px;
        width:10px;
        border-radius:50%;
       color:#77738a;
       background-color:#77738a;
    }
    .password-check__item__label{
        margin-left:10px;
    }
    
</style>
