<template>
  <b-row class="vh-100 vw-100 row-login">
    <b-col sm="5" class="d-flex justify-content-center align-items-center left-login" >
      <div class="col-8">
        <h2 class="text-center mb-5 title-login">Faça Login</h2>
        <b-form>
          <b-form-group
            label="E-mail"
            label-for="email"
          >
          <b-form-input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            required
            v-model.trim="$v.form.email.$model" 
            :state="getValidation('email')"

          ></b-form-input>
          </b-form-group>

          <b-form-group
            label-for="password"
          >
          <label class="d-flex justify-content-between" >
            Senha
            <small><a href="#">Esqueceu a senha?</a></small>
          </label>

          <b-form-input
            id="password"
            type="password"
            placeholder="Digite a sua senha"
            required
            v-model.trim="$v.form.password.$model"
            :state="getValidation('password')"
          ></b-form-input>
          </b-form-group>

          <b-button
            type="button"
            variant="primary"
            block
            @click="login"
          ><i class="fas fa-sign-in-alt" ></i></b-button>
          
          <hr>

          <b-button
            type="button"
            variant="outline-secondary"
            block
            @click="register" 
          >
            <i class="fa fa-user-plus" ></i>
            Não tenho conta
          </b-button>
        </b-form>
      </div>
    </b-col>
    <b-col sm="7" class="d-flex justify-content-center align-items-center " >
      <img src="../assets/images/login.svg" class="img-login" alt="">
    </b-col>
  </b-row>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators"
  export default {
    data() {
      return {
        form: {
          email: "",
          password: ""
        }
      }
    },

    methods: {
      login() { 
        this.$v.$touch();
        if(this.$v.$error) {
          return;
        }
      },
      register() {},

      getValidation(field) {
          if(this.$v.form.$dirty === false) {
            return null;
          }
      
          return !this.$v.form[field].$error;
      }
    },

    validations: {
      form: {
        email:{
          required,
          email
        },
        password:{
          required,
          minLength: minLength(6)
        }
      }
    },
  }
</script>

<style scoped>
*,
*::after
*::before{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}

.row-login{
  margin-left: 0;
}

.left-login{
  background-color: #f2F2F2;
}

.title-login {
  font-weight: bold;
}

.img-login {
  width: 600px;
  height: 600px;
}
</style>