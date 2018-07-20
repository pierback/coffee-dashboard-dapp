
<template>
<!--  <div>
     <b-form @submit="onSubmit" style="width:450px; margin:auto; margin-top:120px; padding:50px; background-color:#efebeb">
    <h1 style="text-align:center; margin-bottom:20px">L☕️gin</h1>
      <b-form-group id="exampleInputGroup1">
        <b-form-input id="exampleInput1"
                      type="text" v-model="form.email" required
                      placeholder="Email"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="exampleInputGroup2">
        <b-form-input id="exampleInput2"
                      type="password" v-model="form.password" required
                      placeholder="Password"
        ></b-form-input>
      </b-form-group>

    
      <b-form-group id="exampleGroup4">
        <b-form-checkbox v-model="form.checked" id="exampleInput4">
          Check me out
        </b-form-checkbox>
        <router-link to="signup" style="float:right">signup?</router-link>
      </b-form-group>
      <b-button type="submit" variant="primary" style="width:50%">Submit</b-button>
      <b-button type="reset" variant="secondary" style="width:48%">Reset</b-button>
    </b-form>
    <div>{{ axiosResponse }}</div>
  </div> -->

  <div class="login-page">
  <div class="form">

    <form class="login-form" v-autofill-catch name="login" v-on:submit.prevent="login([form.email, form.password])">
      <input v-model="form.email" required type="text" name="email" placeholder="Email Address">
      <input v-model="form.password" required  type="password" placeholder="Password">
      <button type="submit">Login!</button>
      <p class="message">Not registered? <a href="/#/signup">Create an account</a></p>
	  </form>

    <!-- <form class="register-form">
      <input type="text" placeholder="name"/>
      <input type="password" placeholder="password"/>
      <input type="text" placeholder="email address"/>
      <button>create</button>
      <p class="message">Already registered? <a href="#">Sign In</a></p>
    </form> -->
    <!-- <form class="login-form" @submit='onSubmit'>
      <input type="text" v-model="form.email" placeholder="username"/>
      <input type="password" v-model="form.password" placeholder="password"/>
      <button type="submit">login</button>
      <p class="message">Not registered? <a href="#">Create an account</a></p>
    </form> -->
  </div> 
<div>{{ axiosResponse }}</div>
</div>

</template>

<script>
import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
/* const VueResource = require("vue-resource");
Vue.use(VueResource); */
Vue.use(Vuex);

import autofillCatch from "../directives/autofill-catch.js";
Vue.directive("autofill-catch", autofillCatch);

export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      axiosResponse: ""
    };
  },
  methods: {
    login(...args) {
      console.log('​login -> args', args);
      console.log("​onSubmit -> this.form", this.form);
      this.axiosResponse = this.form;

      axios
        .post(`http://192.168.178.31:3003/api/login`, this.form)
        .then(response => {
          // JSON responses are automatically parsed.
          this.axiosResponse = "response email" + response.data.user;
          this.form = response.data;
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("email", response.data.email);
          this.$store.commit("setCurrentUser", response.data.user);
          console.log("USER AFTER SETTING", this.$store.getters.user);

          //sessionStorage.setItem('email', response.data.email);
          //console.log('store', this.$store.getters.getUser)
          this.$router.push("/home");
        })
        .catch(e => {
          console.log(e);
        });
    },
    mounted() {
      const login = document.querySelector("#login");
      login.addEventListener(
        "touchstart",
        function(e) {
          console.log("onSubmit handler called"); // Won't show up
        },
        false
      );
    }
  }
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:300);

.login-page {
  width: 360px;
  padding: 8% 0 0;
  margin: auto;
}
.form {
  position: relative;
  z-index: 1;
  background: #ffffff;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}
.form input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}
.form button {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: #4caf50;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}
.form button:hover,
.form button:active,
.form button:focus {
  background: #43a047;
}
.form .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}
.form .message a {
  color: #4caf50;
  text-decoration: none;
}
.form .register-form {
  display: none;
}
.container {
  position: relative;
  z-index: 1;
  max-width: 300px;
  margin: 0 auto;
}
.container:before,
.container:after {
  content: "";
  display: block;
  clear: both;
}
.container .info {
  margin: 50px auto;
  text-align: center;
}
.container .info h1 {
  margin: 0 0 15px;
  padding: 0;
  font-size: 36px;
  font-weight: 300;
  color: #1a1a1a;
}
.container .info span {
  color: #4d4d4d;
  font-size: 12px;
}
.container .info span a {
  color: #000000;
  text-decoration: none;
}
.container .info span .fa {
  color: #ef3b3a;
}
body {
  background: #499324; /* fallback for old browsers */
  background: -webkit-linear-gradient(right, #499324, #8dc26f);
  background: -moz-linear-gradient(right, #499324, #8dc26f);
  background: -o-linear-gradient(right, #499324, #8dc26f);
  background: linear-gradient(to left, #499324, #8dc26f);
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  text-decoration: none;
}
.container {
  width: 400px;
}
</style>
