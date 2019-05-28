<template>
  <div class="reply_table" @click="removeDefaultClick">
      <Table @on-row-dblclick="dbClickParams" highlight-row border size="small" height="160" ref="currentRowTable" :columns="columns3" :data="replyParams"></Table>
  </div>
</template>
<script>
    import { deleteReplyConfigParams } from '@/api/baseInfo/replySettings'
    export default {
      props: {
        replyParams: {
          type: Array,
          default: []
        }
      },
        data () {
            return {
                columns3: [
                  {
                    type: 'index',
                    width: 50,
                    align: 'center'
                  },
                  {
                    title: '标签',
                    key: 'paramName'
                  },
                  {
                    title: '类型',
                    key: 'paramType'
                  },
                  {
                    title: '长度',
                    key: 'contentLength'
                  },
                  {
                    title: '数据来源',
                    key: 'dateSource'
                  },
                  {
                    title: '是否必填',
                    key: 'isRequired',
                    render(h,params){
                      return h('span',params.row.isRequired==0?'是':'否')
                    }
                  },
                  {
                    title: '操作',
                    key: 'action',
                    slot: 'action',
                    width:80,
                    fixed: 'right',
                    render: (h, params) => {
                      return h('div', [
                        h('Button', {
                          props: {
                            type: 'error',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              this.deleteParams(params.row.id)
                            }
                          }
                        }, '删除')
                      ]);
                    }
                  }
                ],
                data1: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
            }
        },
        methods: {
          dbClickParams(row,index){
            this.$emit('receiveParams',row)
          },
          removeDefaultClick(e){
            //现代浏览器阻止默认事件
            if ( e && e.preventDefault )
                e.preventDefault();
            //IE阻止默认事件
            else
                window.event.returnValue = false;
            return false;
          },
          deleteParams(id){
            this.$Modal.confirm({
              title: '提示',
              content: '<p>是否删除该条记录?</p>',
              onOk: () => {
                deleteReplyConfigParams({
                  id: id
                }).then(res=>{
                  if(res && res.success){
                    this.$Message.success(res.msg);
                    this.$emit('deleteState', true)
                  }else{
                    this.$Message.error(res.msg);
                  }
                })
              }
            });
          },
        }
    }
</script>
<style lang="less" scoped>
.reply_table{
  padding: 0 16px 16px
}
</style>
