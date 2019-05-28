<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import { getCookie } from "@/functions/function.js";
import { Base64 } from "js-base64";
export default {
  created() {
    let companyCode = getCookie("x-company-code") || "";
    let companyName = Base64.decode(getCookie("x-company-name") || "");
    let employeeName = Base64.decode(getCookie("x-employee-name") || "");
    _czc.push(["_trackEvent", companyCode, companyName, employeeName]);
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  text-align: left;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
