<template>
  <Form :model="formData" ref="formData" :rules="validate">
    <div class="demo-split">
      <Split v-model="Split">
        <div slot="left" class="demo-split-pane">
          <Row :gutter="32">
            <Col span="32">
              <FormItem label="工单来源名称" label-position="top" prop="dataSourceId">
                <Select v-model="formData.dataSourceId" placeholder="请选择来源名称" clearable>
                  <Option
                    v-if="nameList && nameList.length != 0"
                    v-for="item in nameList"
                    :value="item.dataSourceId"
                    :key="item.dataSourceId"
                  >{{ item.dataSourceName }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="32">
              <FormItem label="处理人员" label-position="top" prop="user">
                <Select
                  ref="querySelect"
                  v-model="formData.user"
                  multiple
                  filterable
                  remote
                  :remote-method="handleRemote"
                  :loading="assignUsers.loading"
                >
                  <Option
                    v-for="(option, index) in assignUsers.options"
                    :value="option.Key"
                    :key="index"
                  >{{option.Value}}</Option>
                </Select>
                <!-- @on-change = "changeRemoteName"
                :label-in-value = "true"-->
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32" v-if="isRoot">
            <Col span="32">
              <FormItem label="专家座席" label-position="top">
                <Select
                  ref="querySelect"
                  v-model="formData.expert"
                  multiple
                  filterable
                  remote
                  :remote-method="handleRemoteExperts"
                  :loading="assignExperts.loading"
                >
                  <Option
                    v-for="(option, index) in assignExperts.options"
                    :value="option.Key"
                    :key="index"
                  >{{option.Value}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div slot="right" class="demo-split-pane">
          <Col span="12">
            <FormItem label="工单类型" label-position="top" prop="source">
              <!-- <Cascader v-model="formData.source" :data="sourceTypeData" placeholder="请选择工单类型"></Cascader> -->
            </FormItem>
            <Tree ref="source" :data="sourceTypeData" show-checkbox></Tree>
          </Col>
        </div>
      </Split>
    </div>
  </Form>
</template>

<script>
import { addSourceData } from "@/api/baseInfo/sourceSettings";
import {
  getUserByOrganize,
  addAssignOrExpert
} from "@/api/baseInfo/assignSettings";
import { GetEnableType } from "@/api/baseInfo/typeSettings";
export default {
  //判断是不是总部登入来确定有没有专家座席
  props: {
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  beforeCreate() {
    //获取所有未删除的工单类型
    GetEnableType().then(res => {
      if (res.success) {
        this.sourceList = res.data;
      }
    });
  },
  computed: {
    nameList() {
      return this.$parent.$parent.nameList;
    },
    sourceTypeData() {
      var converData = function(array = []) {
        let result = [];
        array.forEach((v, i, a) => {
          let resultItem = {
            title: v.label,
            value: v.value
          };
          if (v.children && v.children.length > 0) {
            let childrens = [...converData(v.children)];
            if (childrens.length > 0) {
              resultItem.children = childrens;
            }
          }
          result.push(resultItem);
        });
        return result;
      };
      const sourceTypeData = [...this.sourceList];
      var result = converData(sourceTypeData);
      return result;
    }
  },
  data() {
    return {
      Split: 0.6,
      assignUsers: {
        loading: false,
        options: []
      },
      assignExperts: {
        loading: false,
        options: []
      },
      formData: {
        dataSourceId: "", //工单来源名称
        source: [], //工单来源类型
        user: [], // 处理人
        expert: [] // 专家
      },
      sourceList: [],
      validate: {
        //工单来源名称
        dataSourceId: [
          {
            required: true,
            message: "工单来源名称不能为空",
            trigger: "blur"
          }
        ],
        //来源类型
        source: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "工单来源不能为空",
            trigger: "change"
          }
        ],
        //是否启用
        user: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "处理人员不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    handleRemote(query) {
      if (query !== "") {
        this.assignUsers.loading = true;
        getUserByOrganize({
          key: query
        }).then(res => {
          this.assignUsers.loading = false;
          if (res && res.success) {
            this.assignUsers.options = res.data;
          } else {
            this.assignUsers.options = [];
          }
        });
      } else {
        this.assignUsers.options = [];
      }
    },
    handleRemoteExperts(query) {
      if (query !== "") {
        this.assignExperts.loading = true;
        getUserByOrganize({
          key: query
        }).then(res => {
          this.assignExperts.loading = false;
          if (res && res.success) {
            this.assignExperts.options = res.data;
          } else {
            this.assignExperts.options = [];
          }
        });
      } else {
        this.assignExperts.options = [];
      }
    },
    // changeRemoteName(){
    //   // if(options){
    //   //   this.formData.users = this.$refs.querySelect.values.map(item=>{
    //   //     return {
    //   //       UserId: item.value,
    //   //       UserName: item.label.split('|')[0]
    //   //     }
    //   //   })
    //   // }else{
    //   //   this.formData.users = []
    //   // }
    // },
    handleSubmitAdd(name) {
      this.formData.source = [...this.$refs.source.getCheckedNodes()]
        .filter((v, i, a) => {
          if (v.children && v.children.length > 0) {
            return false;
          }
          return true;
        })
        .map((v, i, a) => {
          return v.value;
        });
      this.$refs[name].validate(valid => {
        if (valid) {
          addAssignOrExpert({
            dataSourceId: this.formData.dataSourceId,
            threeCodes: this.formData.source,
            users: this.formData.user.map(item => {
              return { UserId: item };
            }),
            expertSeats: this.formData.expert.map(item => {
              return { ExpertSeatsId: item };
            })
          }).then(res => {
            if (res && res.success) {
              this.$emit("isSuccess", true);
              this.$Message.success(res.msg);
            } else {
              this.$Message.error(res.msg);
            }
          });
        } else {
          this.$Message.error("请输入必填项!");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-radio-group {
  width: 100%;
}
.demo-split {
  height: 600px;
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  padding: 10px;
}
</style>
