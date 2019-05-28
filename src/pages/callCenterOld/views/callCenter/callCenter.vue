<!--
  新老工单区别
  1、初始化链接 参数不同    并且 初次链接 必须为 “0” —— 非强制
  2、分组获取返回参数不同
  3、电话位置接口不一样
  4、杭州总部station 需要穿传段ipAddress - 不然会验证无效站点
  5、有接听和挂断按钮
  6、
 -->

<template>
  <div class="call_warper">
    <div class="call_left">
      <Collapse>
        <Panel>
            设置
            <p slot="content">
              <Select v-model = 'register.active' multiple>
                <Option v-for="item in register.list" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Button type="primary" style="width:100%; margin-top: 8px" v-if="registerState==1" @click="SdRegister">注册</Button>
              <Button style="width:80px; margin-top: 8px; margin-right:6px" v-if="registerState==2 || registerState==3" @click="SdLogOff">注销</Button>
              <Button style="width:80px; margin-top: 8px" v-if="registerState==2" @click="SdPause">暂停</Button>
              <Button style="width:80px; margin-top: 8px" v-if="registerState==3" @click="SdRestore">空闲</Button>
              <Input v-model = 'callCenter.phoneNumber' placeholder="请输入呼叫号码" clearable type="tel" style="margin-top: 8px" v-if="registerState==2"/>
              <Button type="primary" style="width:100%; margin-top: 8px" v-if="registerState==2" @click="SdCallOut">呼叫</Button>
            </p>
        </Panel>
        <Panel>
            当前通话
            <p slot="content" class="call_current off_line" v-if="registerState==0 || registerState==1">
              <span>您的当前状态</span> <br>
              <span class="state"><Icon type="md-call" /> 离线</span>
            </p>
            <p slot="content" class="call_current on_rest" v-if="registerState==2">
              <span>您的当前状态</span> <br>
              <span class="state"><Icon type="md-call" /> 空闲</span>
              <span class="call_info time" v-if="callCenter.timeRecord.state">{{formatDateTime(callCenter.timeRecord.showTime)}}</span>
            </p>
            <p slot="content" class="call_current on_rest" v-if="registerState==3">
              <span>您的当前状态</span> <br>
              <span class="state"><Icon type="md-call" /> 休息</span>
              <span class="call_info time" v-if="callCenter.timeRecord.state">{{formatDateTime(callCenter.timeRecord.showTime)}}</span>
            </p>
            <p slot="content" class="call_current" v-if="registerState==4">
              <span v-if="callCenter.queueNumber != 0">排队中 {{callCenter.queueNumber}} 人</span> <br>
              <span>您的当前状态</span> <br>
              <span class="state"><Icon type="md-call" /> 来电中</span>
              <span class="call_info">{{callCenter.ringArea}}</span>
              <span class="call_info">{{callCenter.ringNumber}}</span>
              <Button type="primary" style="width:100%;" @click="offHook">接听</Button>
            </p>
            <p slot="content" class="call_current on_rest" v-if="registerState==5">
              <span v-if="callCenter.queueNumber != 0">排队中 {{callCenter.queueNumber}} 人</span> <br>
              <span>您的当前状态</span> <br>
              <span class="state"><Icon type="md-call" /> 通话中</span>
              <span class="call_info">{{callCenter.ringArea}}</span>
              <span class="call_info">{{callCenter.ringNumber}}</span>
              <span class="call_info time" v-if="callCenter.timeRecord.state">{{formatDateTime(callCenter.timeRecord.showTime)}}</span>
              <Button type="primary" style="width:100%;" @click="onHook">挂断</Button>
            </p>
            <p slot="content" class="call_current on_rest" v-if="registerState==6">
              <span v-if="callCenter.queueNumber != 0">排队中 {{callCenter.queueNumber}} 人</span> <br>
              <span>您的当前状态</span> <br>
              <span class="state"><Icon type="md-call" /> 处理中</span>
              <span class="call_info time" v-if="callCenter.timeRecord.state">{{formatDateTime(callCenter.timeRecord.showTime)}}</span>
            </p>
            <p slot="content" class="call_current on_rest" v-if="registerState==7">
              <span v-if="callCenter.queueNumber != 0">排队中 {{callCenter.queueNumber}} 人</span> <br>
              <span>您的当前状态</span> <br>
              <span class="state"><Icon type="md-call" /> 呼出中</span>
              <span class="call_info">{{callCenter.ringArea}}</span>
              <span class="call_info">{{callCenter.phoneNumber}}</span>
              <Button type="primary" style="width:100%;" @click="offHook">接听</Button>
            </p>
            <p slot="content" class="call_current on_rest" v-if="registerState==8">
              <span v-if="callCenter.queueNumber != 0">排队中 {{callCenter.queueNumber}} 人</span> <br>
              <span>您的当前状态</span> <br>
              <span class="state"><Icon type="md-call" /> 保持中</span>
            </p>
        </Panel>
        <Panel>
            未接来电
            <p slot="content"></p>
        </Panel>
        <Panel>
            处理完成
            <p slot="content"></p>
        </Panel>
    </Collapse>
    </div>
    <div class="call_right">
      <CallInput :callPhone = 'callCenter.ringNumber' @submitOver="submitOver"></CallInput>
    </div>
  </div>
</template>

<script>
import { Modal } from 'iview';
import CallInput from './callInput.vue';
import { getSdCallInfo  } from '@/api/callCenter/callCenter.js'
export default {
  components: {
    CallInput, Modal
  },
  data(){
    return {
      testData: '',
      register: {
        active: [],  //groupid
        list: []
      },
      callCenter:{
        webServiceUrl: '',                // http://192.168.0.106:8080     ---http://116.236.98.26:9801
        url: "",                          // http://192.168.4.84:9802      ---http://192.168.4.6:9820/AgentService
      	agtId: "",                        // 80523                         ---8604@sto.cn
      	agtPwd: "",                       // 123456                        ---86048604
        station: "",
        aliveClock: 0,
        lastAliveTm: 0,
        lastCall: {
          callId: 0,
          subId: 0,
          areaCode: "",
          ani: "",
          groupId: "",
          ivrList: "",
          offHookTime: ""
        },
        isFirst: true,    //注册、空闲参数都为8 通过是不是第一次打开
        phoneNumber: '',  //拨打号码
        ringArea: '',
        ringNumber: '',
        callStatus: -1,
        occupy: -1, //后处理标识
        queueNumber: 0,
        isRingOrCall: 0,   //如果是响铃 1  播出 1
        timeRecord: {
          state: false,
          showTime: 0 ,
          interVal: 0
        }
      },
      registerState: 0, // 0-连接前  1-连接后  2-注册后-默认空闲   3-暂停  4-震铃铛  5-通话中   6-处理中（通话结束后处理） 7-呼出中  8-保持中
    }
  },
  watch: {
    registerState(newVal,oldVal){
      this.callCenter.timeRecord.state = false
      clearInterval(this.callCenter.timeRecord.interVal);
      switch(newVal){
        case 0:
          break;
        case 1:
          break;
        case 2:
          this.callCenter.timeRecord.state = true
          this.callCenter.timeRecord.showTime = new Date().setHours(0,0,0)
          this.callCenter.timeRecord.interVal = setInterval( ()=>{
            this.callCenter.timeRecord.showTime = this.callCenter.timeRecord.showTime + 1000
          },1000)
          break;
        case 3:
          this.callCenter.timeRecord.state = true
          this.callCenter.timeRecord.showTime = new Date().setHours(0,0,0)
          this.callCenter.timeRecord.interVal = setInterval( ()=>{
            this.callCenter.timeRecord.showTime = this.callCenter.timeRecord.showTime + 1000
          },1000)
          break;
        case 4:
          this.callCenter.isRingOrCall = 0
          break;
        case 5:
          console.log('进入通话中')
          this.callCenter.timeRecord.state = true
          this.callCenter.timeRecord.showTime = new Date().setHours(0,0,0)
          this.callCenter.timeRecord.interVal = setInterval( ()=>{
            this.callCenter.timeRecord.showTime = this.callCenter.timeRecord.showTime + 1000
          },1000)
          console.log('开始设置后处理----')
          this.SdAgtWorkAfterCall()
          console.log('结束设置后处理-----')
          break;
        case 6:
          if(this.callCenter.isRingOrCall == 1){
            this.callCenter.ringNumber = this.callCenter.phoneNumber
          }
          this.callCenter.timeRecord.state = true
          this.callCenter.timeRecord.showTime = new Date().setHours(0,0,0)
          this.callCenter.timeRecord.interVal = setInterval( ()=>{
            this.callCenter.timeRecord.showTime = this.callCenter.timeRecord.showTime + 1000
          },1000)
          break;
        case 7:
          this.callCenter.isRingOrCall = 1
          this.callCenter.ringNumber = this.callCenter.phoneNumber
          this.getArea(this.callCenter.ringNumber)
          break;
        case 8:
          break;
        default:
          break;
      }
    }
  },
  created(){
    //连接事件
    this.sdOnConnect()
    //座席改变监听
    this.SdOnAgtReqReturn()
    //--todo--断开强连接
    this.SdASConnected()
    //获取座席数据
    this.SdGetAgtGroups()
    //来电震铃监听
    this.SdOnRing()
    //心跳检测事件
    this.SdOnAlive()
    //断开连接
    this.SdOnDisconnect()
    //强制连接事件返回
    this.SdOnForceConnect()
    //座席状态变化事件
    this.SdOnRunAgtInfo()
    //座席详细信息
    this.SdOnAgtDetailInfo()
    //拨号完成
    this.SdOnRunDialDialed()
    //排队中的人数
    this.SdOnQueueInfo()

    //初始化连接
    this.getSdCall()

  },
  beforeDestroy(){
    this.SdLogOff()
  },
  methods:{
    getSdCall(type) {
      getSdCallInfo().then(res => {
        // console.log('res',res);
        if(res && res.success){
          this.callCenter.url = res.data.agentHost
          this.callCenter.webServiceUrl = res.data.agetServerHost
          this.callCenter.agtId = res.data.userCode
          this.callCenter.agtPwd = res.data.userPwd
          this.callCenter.station = res.data.ipAddress
          this.SdInitConnect("0")
        }else{
          this.$Message.error(res.msg);
        }
      })
    },

    /************三地监听***********/
    //连接事件-返回
    sdOnConnect(){
      SdAgent.event("onConnect").subscribe( (result, desc) => {
        console.log("连接返回",result,"desc",desc);
        if (result == 1 || result == 2) {
          this.$Message.success("连接状态：已连接");
          this.registerState = 1
          this.callCenter.lastAliveTm = (new Date()).getTime();
          if (this.callCenter.aliveClock > 0) {
              clearInterval(this.callCenter.aliveClock);
          }
          this.callCenter.aliveClock = setInterval( () => {
              var currentTime = (new Date()).getTime();
              if ((currentTime - this.callCenter.lastAliveTm) / 1000 > 120) {
                this.callCenter.lastAliveTm = currentTime;
                this.registerState = 1
                this.$Message.error("您的网络有异常，已断开与服务器的连接，即将从新连接!");
                this.SdInitConnect()
              }
          }, 10000);
          //调用分组信息 获取分组信息
          setTimeout( () => { SdAgent.getAgtGroups() }, 50);
        }
        else {
          this.$Message.error(desc);
        }
      })
    },

    //获取座席数据-返回
    SdGetAgtGroups(){
      SdAgent.event("onGetAgtGroups").subscribe( (data) => {
        console.log('分组数据',data);
        // this.register.list = data.agtGroups.map( item => {
        //   return {
        //     value: item.groupId,
        //     label: item.groupName
        //   }
        // })
        // ---------修改新旧区别-------------
        this.register.list = data.map( item => {
          return {
            value: item.groupId,
            label: item.groupName
          }
        })
      });
    },

    //座席动作返回
    SdOnAgtReqReturn(){
      SdAgent.event("onAgtReqReturn").subscribe( (cmd, ret,desc) => {
        if(ret==0){
          switch(cmd){
            case 0:		//保持通话
              this.registerState = 2
              break;
            case 3:   //注销
              this.$Message.success("注销成功");
              this.registerState = 1
              break;
            case 4:   //注册
              this.$Message.success("注册成功");
              this.registerState = 2
              this.callCenter.isFirst = false
              break;
            case 5:		//逻辑摘机
              break;
            case 6://逻辑挂机
              // this.registerState = 6
              break;
            case 7:		//暂停
              this.$Message.success("暂停成功");
              this.registerState = 3
              break;
            case 8:		//恢复
              if(!this.callCenter.isFirst) {
                this.$Message.success("设置空闲成功");
                this.registerState = 2
              }
              break;
            default:
              break;
          }
        }else{
          this.$Message.error(desc);
        }
      });
    },

    //已连接事件，可利用此事件进行强制连接操作 - 断开强制连接
    SdASConnected(){
      SdAgent.event("onASConnected").subscribe( () => {
          this.SdInitConnect("1");
      });

    },

    //来电震铃监听
    SdOnRing(){
      SdAgent.event("onRing").subscribe( (callId, subId, area, ani, grpId, srcAgt, ivrList) => {
          this.registerState = 4
          this.callCenter.ringNumber = ani
          this.getArea(ani)
          // this.SdAgtWorkAfterCall()
      });
    },

    //服务器每30s检测是否存活 如果超过90s断开连接
    SdOnAlive(){
      SdAgent.event("onAlive").subscribe( () => {
        SdAgent.alive();
        this.callCenter.lastAliveTm = (new Date()).getTime();
      });
    },

    //断开链接
    SdOnDisconnect(){
      SdAgent.event("onDisconnect").subscribe( () => {
        if (this.callCenter.aliveClock > 0) {
          clearInterval(this.callCenter.aliveClock)
        }
        this.registerState = 0
        this.$Message.error('断开连接')
      });
    },

    //强制连接事件返回   ----当一个座席工号在其他机器或同一机器不同内核浏览器下被人强制登录时则返回此事件。
    SdOnForceConnect(){
      SdAgent.event("onForceConnect").subscribe( () => {
          this.registerState = 1
          SdAgent.logout();
      });
    },

    // 座席状态变化事件 todo + 计时  加事件轮训
    SdOnRunAgtInfo(){
      SdAgent.event("onRunAgtInfo").subscribe((status, hook, occupy) => {
        console.log("座席状态变化",status,hook,occupy);
        this.callCenter.callStatus = status
        this.callCenter.occupy = occupy
        switch (status) {
          case 0:
            if (this.callCenter.occupy == 0) {		//空闲
              this.registerState = 2
            } else {					//忙
              this.registerState = 6
            }
            break;
          case 1:					//振铃
            console.log("来电开始");
            this.registerState = 4
            break;
          case 2:					//通话
            console.log("通话开始");
            this.registerState = 5
            break;
          case 3:					//外拨
            this.registerState = 7
            break;
          case 5:					//保持
            this.registerState = 8
            break;
          case 8:			//加入通话
          case 10:		//三方外拨中
          case 11:		//三方会议外拨接通
            // CallCenter.setMeeting11();
            break;
          case 12:		//三方会议中
            // CallCenter.setMeeting12();
            break;
          case 14:
            break;
          case 15:		//三方呼入摘机
            // CallCenter.setTalkingOffHook();
            break;
          case 16:
            // CallCenter.setMeeting16();
            break;
          case 20:		//拨座席
            this.registerState = 7
            break;
          case 21:		//播放工号
            break;
          case 28:		//动态分配连接话机中
            break;
          case 29:		//呼叫座席组
            this.registerState = 7
            break;
          default:
            break;
        }
          // CallCenter.event("onRunAgtInfo").publish(status, hook, occupy);
      });
    },

    //座席详细信息 todo -当意外断线后 获取到上次的信息
    SdOnAgtDetailInfo(){
      SdAgent.event("onAgtDetailInfo").subscribe((agtId, name, agtStatus, callStatus, hook, occupy, lastCall, webServiceUrl) => {
          console.log('webServiceUrl', agtId, name, agtStatus, callStatus, hook, occupy, lastCall, webServiceUrl);
          // CallCenter.setAgtDetailInfo(agtId, name, agtStatus, callStatus, hook, occupy, lastCall);
      });
    },

    //拨号完成
    SdOnRunDialDialed(){
      SdAgent.event("onRunDialDialed").subscribe((callid, subid, area, dnis) => {
        this.registerState = 7
        // this.SdAgtWorkAfterCall()
      });
    },

    //排队中的人数
    SdOnQueueInfo(){
      SdAgent.event("onQueueInfo").subscribe((grpId, waitCall) => {
          this.callCenter.queueNumber = waitCall
      })
    },


    /************触发三地***********/
    //连接服务器
    SdInitConnect (force) {
      //连接服务器(非强制连接)  force- false-非强制连接 true-强制连接
    	// SdAgent.connect( this.callCenter.agtId, this.callCenter.agtPwd, force, this.callCenter.url)
    	// ---------修改新旧区别-------------
    	SdAgent.connect( this.callCenter.url, this.callCenter.agtId, this.callCenter.agtPwd, force)
    },

    //注册事件
    SdRegister () {
      if(this.register.active == ''){
        this.$Modal.warning({
          title: '提示',
          content: '请选择一个座席组'
        });
      } else {
        SdAgent.logon(this.register.active.join(''), this.callCenter.station);
      }
    },

    //注销
    SdLogOff () {
      SdAgent.logout();
      //--todo--清空上一次的相关信息
    },

    //暂停
    SdPause () {
      SdAgent.pause();
    },

    //空闲
    SdRestore () {
      SdAgent.restore();
    },

    //呼叫
    SdCallOut () {
      if(!this.callCenter.phoneNumber){
        this.$Message.error('外拨号码不能为空');
      }
      if (this.callCenter.phoneNumber != undefined) {
          this.callCenter.phoneNumber = this.callCenter.phoneNumber.replace(new RegExp("-", "g"), '').replace(new RegExp(" ", "g"), '');
      }
      SdAgent.dialout (this.callCenter.phoneNumber, 'X',0);
    },

    //后处理开始
    SdAgtWorkAfterCall(){
      SdAgent.agtWorkAfterCall()
    },

    //后处理结束
    SdAagtWorkAfterCallOver(){
      SdAgent.agtWorkAfterCallOver()
    },

    //时间格式化
    formatDateTime (date){
      var date = new Date(date)
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      var seconds = date.getSeconds();
      seconds = seconds < 10 ? ('0' + seconds) : seconds;
      return h+':'+minute+':'+seconds;
    },

    //获取地区
    getArea(ani){
      $.ajax({
        url: this.callCenter.webServiceUrl + "/webservice/cc/rest/agent/getPhoneArea/" + ani,
        type: "post",
        async: false,
        timeout: 3000,
        contentType: "application/json",
        success: (data) => {
          if (data == null || data == "") {
              this.callCenter.ringArea = "未知地区";
          } else {
              this.callCenter.ringArea = data.REGIONNAME + "-" + data.PROVINCENAME + "-" + data.CITYNAME;
          }
        },
        error: (a, b, c) => {
          this.callCenter.ringArea = "未知地区";
        }
      });

      // this.$axios.post(`${this.callCenter.webServiceUrl}/ecall/agent/getPhoneArea/${ani}`)
      // .then((data) => {
      //   if (data == null || data == "") {
      //     this.callCenter.ringArea = "未知地区";
      //   } else {
      //     this.callCenter.ringArea = data.REGIONNAME + "-" + data.PROVINCENAME + "-" + data.CITYNAME;
      //   }
      // })
      // .catch((error) => {
      //   this.callCenter.ringArea = "未知地区";
      // });
    },

    //来电接听摘机
    offHook(){
      SdAgent.offHook();
    },

    //挂断
    onHook(){
      SdAgent.onHook();
    },

    //处理结束改变状态
    submitOver(){
      this.SdAagtWorkAfterCallOver()
    }
  },
}
</script>

<style lang="less" scoped>
.call_warper{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  background: #f5f5f5;
  .call_left{
    width: 200px;
    min-height: 100%;
    background: #ffffff;
    .call_current{
      width: 100%;
      text-align: center;
      display: block;
      .state{
        font-size: 28px;
        color: #ed6900;
        margin: 16px 0;
        display: block;
        i {
          display: inline-block;
          margin-top: -6px
        }
      }
      .call_info{
        display: block;
        font-size: 24px;
      }
      .time{
        display: block;
        font-size: 20px;
        color: #333333;
        margin-top: 16px;
      }
    }
    .call_current.off_line{
      .state{
        color: #888888;
      }
    }
    .call_current.on_rest{
      .state{
        color: #333333;
      }
    }
  }
  .call_right {
    flex: 1;
    height: auto;
    overflow-y: auto;
  }
}

</style>
