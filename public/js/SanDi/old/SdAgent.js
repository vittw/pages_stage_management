var SdAgent={
	topics:{},
	reconnect:false,
	url:"",
	userCode:"",
	userPwd:"",
	agtId:"",
	lastRunCmdTm:0,
	ctiId:"",
	verifyCode:""
};

SdAgent.run=function(cmd){
	//是否要限制发送命令的时间间隔
	//SdAgent.lastRunCmdTm=(new Date()).getTime();
	$.stream().send({"Act":cmd,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode});
};

//事件发布
SdAgent.event=function(id){
	var callbacks,topic = id && this.topics[id];
	if ( !topic ) {
	    callbacks = jQuery.Callbacks();
	    topic = {
	        publish: callbacks.fire,
	        subscribe: callbacks.add,
	        unsubscribe: callbacks.remove
	    };
	    if (id) {
	        this.topics[id] = topic;
	    }
	}
	return topic;
};

SdAgent.execConnect=function(url,userCode,userPwd,force,closeFlag){
    if($.stream()!=null) $($.stream()).empty();
	$.stream.setup({enableXDR: true});
	if(url.substr(-1)!="/") url=url+"/";
	SdAgent.reconnect=force=="1"?true:false;
	SdAgent.url=url;
	SdAgent.userCode=userCode;
	SdAgent.userPwd=userPwd;
	$.stream(url+"SandiAgent?ForceConnect="+force+"&UserCode="+userCode+"&UserPwd="+userPwd, {
		type: "http",
		dataType: "json",
		reconnect:false,
		closeFlag:closeFlag,
		open: function(event, stream) {
			if(stream.id=="") return;
			
			var strArr = stream.id.split("-");
			if(strArr.length>1){
				SdAgent.ctiId = strArr[0];
				SdAgent.agtId = strArr[1];
				if(strArr.length>2)SdAgent.verifyCode = strArr[2];
			}else{
				SdAgent.agtId=stream.id;
			}
			//连接成功后自动连接CTI
			SdAgent.run("connect");
		},
		message: function(event) {
			if(event.data==null) return;
			SdAgent.agtEvt(event.data.CMD,event.data.DATA);
		},
		error: function() {
		},
		close: function(event) {
			if(SdAgent.reconnect==true){
				SdAgent.reconnect=false;
				//延迟连接，否则有时会出现不停连接服务器的情况
				setTimeout(function(){
					SdAgent.connect(SdAgent.url,SdAgent.userCode,SdAgent.userPwd,"0");
				},300);
			}
		}
	});
};

SdAgent.connect=function(url,userCode,userPwd,force){
    if($.browser.msie){
        if($.browser.version == '8.0'){
            var objxdr=new XDomainRequest();
            objxdr.onload=function(){
                SdAgent.execConnect(url,userCode,userPwd,force,objxdr.responseText);
            };
            var d=new Date();
            if(url.substr(-1)!="/") url=url+"/";
            objxdr.open("GET",url+"CheckConnectServlet?UserCode="+userCode+"&UserPwd="+userPwd+"&jsid="+d.getTime());
            objxdr.send();
            return;
        }
    }
    
    SdAgent.execConnect(url,userCode,userPwd,force,0);
};

SdAgent.disconnect=function(){
	this.run("disconnect");
};

SdAgent.alive=function(){
	this.run("Alive");
};

SdAgent.logon=function(groupid,station){
	var data = {"Act":"logon","AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	if(groupid!=undefined && groupid!="") data.groups=groupid;
	if(station!=undefined && station!="") data.station=station;
	$.stream().send(data);
};

SdAgent.logout=function(){
	this.run("logout");
};

SdAgent.pause=function(){
	this.run("pause");
};

SdAgent.restore=function(){
	this.run("restore");
};

SdAgent.offHook=function(){
	this.run("offHook");
};

SdAgent.onHook=function(){
	this.run("onHook");
};

SdAgent.agtWorkAfterCall=function(){
	this.run("agtWorkAfterCall");
};

SdAgent.agtWorkAfterCallOver=function(){
	this.run("agtWorkAfterCallOver");
};

SdAgent.agtHold=function(){
	this.run("agtHold");
};

SdAgent.agtRetrieve=function(){
	this.run("agtRetrieve");
};

SdAgent.dialout=function(dnis,type,grpId){
	var data = {"Act":"dial","dnis":dnis,"dialType":type,"grpId":grpId,"extDnis":dnis,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.dialTrans=function(){
	this.run("dialTrans");
};

SdAgent.talkingDialJoin=function(){
	this.run("talkingDialJoin");
};

SdAgent.agtGetAgtInfo=function(agentid){
	var data = {"Act":"agtGetAgtInfo","destAgt":agentid,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.getAllAgtInfo=function(orgIds){
	if(orgIds==null || orgIds==undefined || $.trim(orgIds)==""){
		this.run("getAllAgtInfo");
	}else{
		var data = {"Act":"getAllAgtInfo","orgIds":orgIds,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
		$.stream().send(data);
	}
};

SdAgent.dialTransIVR=function(callid, agentid, grpid, ivrstr){
	var data = {"Act":"agtReturnIVR","ivrRet":1,"callId":callid,"array": agentid +","+grpid+",,,," +ivrstr,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.agtReturnIVR=function(ivrRet,callId,ivrList){
	var data = {"Act":"agtReturnIVR","ivrRet":ivrRet,"callId":callId,"array":ivrList,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.getOrgTreeJson=function(){
	this.run("getOrgTreeJson");
};

SdAgent.logoutAgent=function(agentId){
	var data = {"Act":"logoutAgent","destAgt":agentId,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.agtListen=function(destAgt){
	var data = {"Act":"agtListen","destAgt":destAgt,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.agtUnListen=function(){
	this.run("agtUnListen");	
};

SdAgent.agtDisconnectCall=function(destAgt,callId){
	var data = {"Act":"agtDisconnectCall","destAgt":destAgt,"callId":callId,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.agtIntercept=function(destAgt,callId){
	var data = {"Act":"agtIntercept","destAgt":destAgt,"callId":callId,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.agtJoinTalk=function(destAgt,callId){
	var data = {"Act":"agtJoinTalk","destAgt":destAgt,"callId":callId,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.agtExitTalk=function(){
	this.run("agtExitTalk");	
};

SdAgent.agtReqAgtCallAct=function(destAgt,actType,content){
	var data = {"Act":"agtReqAgtCallAct","destAgt":destAgt,"actType":actType,"content":content,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.acceptAgtReq=function(destAgt){
	var data = {"Act":"acceptAgtReq","destAgt":destAgt,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.getOrgAgtgrps=function(orgIds){
	if(orgIds==null || orgIds==undefined || $.trim(orgIds)==""){
		this.run("getOrgAgtgrps");
	}else{
		var data = {"Act":"getOrgAgtgrps","orgIds":orgIds,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
		$.stream().send(data);
	}
};

SdAgent.getAgentRights=function(){
	this.run("getAgentRights");
};

SdAgent.getAgtGroups=function(){
	this.run("getAgtGroups");
};

SdAgent.sendDTMF=function(dtmf){
	var data = {"Act":"sendDTMF","dtmf":dtmf,"AgentId":SdAgent.agtId,"CTIID":SdAgent.ctiId,"VerifyCode":SdAgent.verifyCode};
	$.stream().send(data);
};

SdAgent.agtEvt=function(cmd,data){
	var json;
	if(data!=null && data!="" && data!=undefined){
		if(typeof(data)=="object"){
			json=data;
		}else{
			try{json=eval("(" + data + ")");}catch(e){}
		}
	}
	switch(cmd){
		case "onConnect":
			this.event(cmd).publish(json.result,json.description);
			break;
		case "onDisconnect":
			this.event(cmd).publish();
			break;
		case "onAgtReqReturn":
			this.event(cmd).publish(json.cmdItem,json.retCode,json.description);
			break;
		case "onAlive":
			this.event(cmd).publish();
			break;
		case "onRing":
			this.event(cmd).publish(json.callId,json.subId,json.area,json.ani,json.grpId,json.srcAgt,json.ivrList);
			break;
		case "onRunAGTINFO":
			this.event("onRunAgtInfo").publish(json.status,json.hook,json.occupy);
			break;
		case "onStopRing":
			this.event(cmd).publish();
			break;
		case "onRingStop":
			this.event(cmd).publish();
			break;
		case "onRunDIAL_DIALED":
			this.event("onRunDialDialed").publish(json.callId,json.subId,json.area,json.dnis);
			break;
		case "onRunDIAL_OVER":	
			this.event("onRunDialOver").publish(json.rlt,json.rltDesc);
			break;
		case "onQueueInfo":
			this.event(cmd).publish(json.grpId,json.waitCall);
			break;
		case "onRunTALKINGDIAL_CALLIN":
			this.event("onRunTalkingDialCallIn").publish(json.callerId,json.callId,json.subId,json.area,json.ani,json.grpId,json.description);
			break;
		case "onAgtInfo":
			this.event(cmd).publish(json.ret,json.agtId,json.info,json.errMsg);
			break;
		case "onAgtDetailInfo":
			this.event(cmd).publish(json.agtId,json.name,json.agtStatus,json.callStatus,json.hook,json.occupy,json.lastCall,json.webServiceUrl);
			break;
		case "onAllAgtInfo":
			this.event(cmd).publish(json.ret,json.errMsg,json.allAgtInfo,json.cnt);
			break;
		case "onASConnected":
			this.event(cmd).publish();
			break;
		case "onForceConnect":
			this.event(cmd).publish();
			break;
		case "onRunLOGON":
			this.event("onAgtReqReturn").publish(4,1,json.description);
		case "onTreeJsonInfo":
			this.event(cmd).publish(data);
			break;
		case "onCallerHangup":
			this.event(cmd).publish(data);
			break;
		case "onIntercept":
			this.event(cmd).publish(json.ret,json.callId,json.subId,json.area,json.ani,json.grpId,json.srcAgt,json.errMsg,json.ivrList);
			break;
		case "onIntercepted":
			this.event(cmd).publish(json.agtId,json.agtName,json.callId);
			break;
		case "onCallDisconnected":
			this.event(cmd).publish(json.agtId,json.agtName);
			break;
		case "onReqAgtCallAct":
			this.event(cmd).publish(json.srcAgtId,json.srcAgtName,json.tmTime,json.actType,json.callId,json.content);
			break;
		case "onAcceptAgtReq":
			this.event(cmd).publish();
			break;
		case "onGetOrgAgtgrps":
			this.event(cmd).publish(json);
			break;
		case "onGetAgentRights":
			this.event(cmd).publish(json);
			break;
		case "onGetAgtGroups":
			this.event(cmd).publish(json);
			break;
		default:
			break;
	}
};

function callbackTest(data){
	alert(data);
}