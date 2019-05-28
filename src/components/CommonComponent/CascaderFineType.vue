
<template>
  <Cascader
    :data="Data"
    clearable
    loading="loading"
    placeholder="请选择罚款类型"
    @on-change="handleChange"
    change-on-select
    style="style"
  ></Cascader>
</template>
<script>
import { FineType } from "@/api/BaseManager/FineType";
export default {
  name: "CascaderFineType",
  data() {
    return {
      loading: false,
      Value: [],
      Data: [],
      Grade: 3
    };
  },
  props: {
    style: String
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      let fineType = new FineType();
      fineType.GetAllFineType().then(res => {
        if (res.success) {
          this.DataProcessing(res.data);
        }
      });
    },
    handleChange(values, checkeds) {
      this.Value = checkeds;
    },
    /**
     *数据处理
     */
    GetChildrenByParentid(data, parentId) {
      if (data && Array.isArray(data)) {
        let dataList = [...data];
        let list = dataList
          .filter((v, i, a) => {
            if (parentId) {
              return v.parentId == parentId;
            } else {
              return !v.parentId;
            }
          })
          .map(t => {
            let result = { value: t.id, label: t.name };
            if (dataList.filter(e => e.parentId == t.id)) {
              result.children = this.GetChildrenByParentid(dataList, t.id);
            }
            return result;
          });
        return list;
      }
    },
    DataProcessing(data) {
      var result = this.GetChildrenByParentid(data);
      this.Data = result;
    }
  },
  watch: {
    Value: function(newValue, oldValue) {
      this.currentValue = newValue;
      this.$emit("input", newValue);
    }
  }
};
</script>
