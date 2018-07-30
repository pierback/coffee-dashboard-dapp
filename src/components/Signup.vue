<template>
  <div class='login-page'>
  <div class='form'>
    <form class='login-form' v-autofill-catch name='login' v-on:submit.prevent='onSubmit'>
      <input v-model='form.email' required type='text' name='email' placeholder='Email Address'>
      <input v-model='form.password' required  type='password' placeholder='Password'>
      <input v-model="form.confirm_password" required type="password" placeholder="Confirm Password">
      <button type='submit'>Create Account</button>
	  </form>
  </div>
  <div id='overlay'>
  <div class="lds-ripple"><div></div><div></div></div>
  </div>
  <b-modal style="text-align:center" ref="modal" size="sm" hide-footer>
        <div style="color:#28a745; font-size:20px">
        <b>Registered Successfully!</b>
        </div>
  </b-modal>
</div>
</template>
  

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        email: "",
        username: "",
        password: "",
        confirm_password: ""
      }
    };
  },
  methods: {
    onSubmit(evt) {
      //console.log('Register', this.form, window.location);
      evt.preventDefault();
      const inputElements = document.querySelectorAll("input");
      const loginButton = document.querySelectorAll("button");
      const overlay = document.getElementById("overlay");
      overlay.style.display = "block";
      loginButton.disabled = true;
      inputElements.forEach(input => (input.disabled = true));

      axios
        .post(`http://137.250.39.239:3003/api/register`, this.form)
        .then(response => {
          // JSON responses are automatically parsed.
          //console.log('Register', window.location);
          this.form = response.data;
          this.$refs.modal.show();
          setTimeout(() => {
            this.$router.push("/login");
            loginButton.disabled = false;
            inputElements.forEach(input => (input.disabled = false));
            overlay.style.display = "none";
          }, 3000);
        })
        .catch(e => {
          console.log("error", e);
          loginButton.disabled = false;
          inputElements.forEach(input => (input.disabled = false));
          overlay.style.display = "none";
        });
    }
  }
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:300);

.login-page {
  max-width: 600px;
  min-width: 360px;
  padding: 8% 0 0;
  margin: auto;
}
.form {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  z-index: 1;
  background: #ffffff;
  max-width: 400px;
  min-width: 360px;
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

#overlay {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  /* position: absolute; */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
</style>
<style scoped>
/* a {
  text-decoration: none;
}
.container {
  width: 400px;
  margin-top: 100px;
} */
</style>
