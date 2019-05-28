<template lang="html">
  <Table border highlight-row :loading="loading" :columns="columns" :data="gridData" :height="200" size="small"></Table>
</template>

<script>
import { getTrail } from '@/api/callCenter/callCenter.js'
export default {
  props:{
    billCode: {
      type: String,
      default: '',
    },
    isChange: {
      type: Boolean,
    }
  },
  data(){
    return{
      loading: false,
      gridData:[],
      columns: [
        {
          title: '扫描时间',
          key: 'scanDate',
          minWidth:150
        },
        {
          title: '扫描网点',
          key: 'uploadSiteName',
          minWidth:150
        },
        {
          title: '类型',
          key: 'scanType',
          minWidth:80
        },
        {
          title: '跟踪记录',
          key: 'memo',
          minWidth:240
        },
        {
          title: '扫描员',
          key: 'employeeName',
          minWidth:100
        },
        {
          title: '包号',
          key: 'packageNo',
          minWidth:100
        },
        {
          title: '重量',
          key: 'weight',
          minWidth:100
        },
        {
          title: '班次',
          key: 'banCi',
          minWidth:100
        },
        {
          title: '车签号',
          key: 'carSignCode',
          minWidth:150
        },
        {
          title: '上传时间',
          key: 'uploadDate',
          minWidth:200
        },
        {
          title: '巴枪ID',
          key: 'PdaSn',
          minWidth:200
        },
        {
          title: '其他',
          key: 'Remark',
          minWidth:200
        }
      ],
    }
  },
  created(){
    this.getInforTrail()
  },
  watch: {
    isChange(){
      this.getInforTrail()
    }
  },
  methods: {
    getInforTrail(){
      this.loading = true;
      getTrail({
        billCode: this.billCode
      }).then((res)=>{
        this.loading = false;
        if(res && res.success){
          this.gridData = res.data
        }else{
          this.gridData = []
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
</style>
