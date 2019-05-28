<template>
  <div id="app">
    <router-view v-if="show"></router-view>
  </div>
</template>
<script>
// import ClipboardJS from 'clipboard';
import { getCookie } from "@/functions/function.js";
import { getorderSource, getAllType } from "@/api/orderManage/input";
import { Base64 } from "js-base64";
export default {
  components: {},
  data() {
    return {
      show: false,
      firstArray: []
    };
  },
  beforeMounted() {},
  mounted() {
    //获取工单来源
    this.getorderSource();
  },
  created() {
    let companyCode = getCookie("x-company-code") || "";
    let employeeCode = getCookie("x-employee-code") || "";
    let companyName = Base64.decode(getCookie("x-company-name") || "");
    let employeeName = Base64.decode(getCookie("x-employee-name") || "");
    this.$store.commit("setCompanyCode", companyCode);
    this.$store.commit("setEmployeeCode", employeeCode);
    this.show = true;
    _czc.push(["_trackEvent", companyCode, companyName, employeeName]);
  },
  beforeCreated() {},
  updated() {},
  methods: {
    //获取工单来源
    getorderSource() {
      getorderSource().then(res => {
        let sData = res.data;
        //					console.log(sData,'工单来源')
        this.$store.commit("saveOrderSource", sData);
        sessionStorage.setItem("saveOrderSource", JSON.stringify(sData));
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  width: 100%;
}

#nav {
  /*padding: 30px;*/
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>