<template>
  <Select
    filterable
    remote
    clearable
    placeholder="请输入网点名称"
    v-model="SiteCode"
    :remote-method="SearchSite"
    :loading="Loading"
  >
    <Option v-for="(option, index) in Options" :value="option.Key" :key="index">{{option.Value}}</Option>
  </Select>
</template>
<script>
import SearchSite from "@/api/BaseManager/SearchSite";
export default {
  name: "SelectSite",
  data() {
    return {
      Loading: false,
      SiteCode: "",
      SiteName: "",
      Options: []
    };
  },
  props: {
    SelectType: String
  },
  methods: {
    SearchSite(query) {
      if (!query || query.indexOf("|") > -1) {
        return;
      }
      let searchSite = new SearchSite();
      this.loading = true;
      var getData;
      if (this.SelectType === "All") {
        getData = searchSite.GetAllSite({ key: query });
      } else if (this.SelectType === "children") {
        getData = searchSite.GetSubordinateSite({ key: query });
      }
      if (getData) {
        getData.then(res => {
          if (query !== "") {
            this.loading = false;
            if (res && res.success) {
              this.Options = res.data;
            } else {
              this.Options = [];
            }
          } else {
            this.Options = [];
          }
        });
      }
    }
  },
  watch: {
    SiteCode: function(newValue, oldValue) {
      this.currentValue = newValue;
      this.$emit("input", newValue);
    }
  }
};
</script>
