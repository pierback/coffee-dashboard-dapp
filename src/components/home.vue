<template>
<div v-if="loggedIn">
  <div>
		<h1 style="text-align:center; margin-top:200px; font-size:100px"><b>Hello there you are logged in!</b></h1>
	<form @submit="logout" >
		<!-- <button type="submit" style="width:450px; margin:auto; margin-top:120px; padding:50px; background-color:#efebeb">logout</button> -->
     <div style="width: 50%;margin: auto;text-align: center; margin-top: 100px;">
     <b-button type="submit" variant="primary" style="width: 50%">Logout</b-button>
     </div>
	</form>
	</div>
</div>
<div v-else>
  <h1 style="text-align:center; margin-top:200px; font-size:100px"><b>Forbidden!</b></h1>
</div>
</template>


<script>
export default {
  loggedIn: false,
  methods: {
    logout(evt) {
      evt.preventDefault();
      console.log('logout clicked', sessionStorage);
      sessionStorage.clear();
      this.$router.push('/');
    },
    mounted() {
      console.log('onMount', sessionStorage);
    }
  },
  beforeCreate() {
    console.log('Nothing gets called before me!', sessionStorage.length);
    this.loggedIn = sessionStorage.length > 0 ? true : false;
  }
};
</script>