<template></template>
<script>
export default {
  beforeCreate() {
    console.log("storage localstorage", !!localStorage.getItem("token"));
    console.log("localStorage", localStorage.getItem("token"));
    !!localStorage.getItem("token")
      ? this.$router.push("/home")
      : this.$router.push("/login");
  }
};
</script>

