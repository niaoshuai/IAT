(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[22],{"+0IA":function(e,t,a){"use strict";var r=a("g09b"),n=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("IzEo");var l=r(a("bx4M"));a("g9YV");var s=r(a("wCAj"));a("+L6B");var u=r(a("2/Rp"));a("Pwec");var d=r(a("CtXQ"));a("P2fV");var i=r(a("NJEC"));a("/zsF");var o=r(a("PArb"));a("Awhp");var f=r(a("KrTs"));a("2qtc");var c=r(a("kLXV"));a("giR+");var m=r(a("fyUT")),p=r(a("2Taf")),k=r(a("vZ4D")),h=r(a("l4Ni")),v=r(a("ujKo")),y=r(a("MhPg"));a("y8nQ");var E,T,g,b,P=r(a("Vl3Y")),x=n(a("q1tI")),C=a("yP6+"),I=a("MuoO"),A=r(a("zHco")),q=P.default.create({name:"form_in_modal"})((E=function(e){function t(){var e,a;(0,p.default)(this,t);for(var r=arguments.length,n=new Array(r),l=0;l<r;l++)n[l]=arguments[l];return a=(0,h.default)(this,(e=(0,v.default)(t)).call.apply(e,[this].concat(n))),a.state={data:[]},a.handleFormChange=function(){var e=a.props.form,t=e.getFieldValue("rps"),r=e.getFieldValue("time"),n=e.getFieldValue("up");if(void 0!=t&&void 0!=r&&void 0!=n){for(var l=[],s=0;s<r;s++){var u={minutes:""+s,value:parseInt(t*n/100*(s+1))};l[s]=u}var d={minutes:""+r,value:parseInt(t*n/100*r)};l[r]=d,a.setState({data:l})}},a}return(0,y.default)(t,e),(0,k.default)(t,[{key:"render",value:function(){var e=this.props,t=e.visible,a=e.onCancel,r=e.onCreate,n=e.form,l=n.getFieldDecorator,s={minutes:{range:[0,1]}};return x.default.createElement(c.default,{visible:t,title:"\u538b\u6d4b\u914d\u7f6e",okText:"\u542f\u52a8\u538b\u6d4b",onCancel:a,onOk:r},x.default.createElement(P.default,{layout:"vertical",onChange:this.handleFormChange},x.default.createElement(P.default.Item,{label:"\u538b\u529b\u673a\u4e2a\u6570"},l("ins_count",{rules:[{required:!0,message:"\u538b\u529b\u673a\u4e2a\u6570"}]})(x.default.createElement(m.default,{formatter:function(e){return"".concat(e)},min:1,max:100}))),x.default.createElement(P.default.Item,{label:"\u9009\u62e9\u8f93\u5165RPS(\u6bcf\u79d2\u8bf7\u6c42\u6570)"},l("rps",{rules:[{required:!0,message:"\u9009\u62e9\u8f93\u5165RPS"}]})(x.default.createElement(m.default,{min:1,step:1e3,autoFocus:!0}))),x.default.createElement(P.default.Item,{label:"\u9009\u62e9\u8f93\u5165\u603b\u538b\u6d4b\u65f6\u957f(\u5355\u4f4d\u5206\u949f)"},l("time",{rules:[{required:!0,message:"\u9009\u62e9\u8f93\u5165\u603b\u538b\u6d4b\u65f6\u957f"}]})(x.default.createElement(m.default,{min:1}))),x.default.createElement(P.default.Item,{label:"\u6bcf\u5206\u949f\u9012\u589e(\u5355\u4f4d %)"},l("up",{rules:[{required:!0,message:"\u6bcf\u5206\u949f\u9012\u589e"}]})(x.default.createElement(m.default,{formatter:function(e){return"".concat(e,"%")},min:1,max:100}))),x.default.createElement(P.default.Item,{label:"\u538b\u529b\u9884\u4f30\u56fe"},x.default.createElement(C.Chart,{height:250,data:this.state.data,scale:s,forceFit:!0},x.default.createElement(C.Axis,{name:"minutes"}),x.default.createElement(C.Axis,{name:"value"}),x.default.createElement(C.Tooltip,{crosshairs:{type:"y"}}),x.default.createElement(C.Geom,{type:"line",position:"minutes*value",size:2,shape:"hv"}))),"\u6ce8\u610f: \u9ed8\u8ba4\u4f7f\u7528500\u4e2a\u865a\u62df\u7528\u6237\u6765\u5b8c\u6210\u4e0a\u9762\u7684\u603bRPS\u538b\u6d4b"))}}]),t}(x.default.Component),E)),F=(T=(0,I.connect)(function(e){var t=e.system,a=e.task,r=e.loading;return{system:t,task:a,loading:r.effects["task/queryTaskList"]}}),T((b=function(e){function t(){var e,a;(0,p.default)(this,t);for(var r=arguments.length,n=new Array(r),l=0;l<r;l++)n[l]=arguments[l];return a=(0,h.default)(this,(e=(0,v.default)(t)).call.apply(e,[this].concat(n))),a.state={taskList:[],addPressureTaskVisible:!1},a.queryTaskList=function(){var e=a.props.dispatch;e({type:"task/queryTaskList",payload:{taskType:1}}).then(function(){var e=a.props.task;a.setState({taskList:e.taskList})})},a.handleGoAdd=function(){var e=a.props.dispatch;e({type:"task/goAddPage"})},a.handleRunTask=function(e){var t=a.props.dispatch;t({type:"task/queryTaskExcute",payload:{id:e}}).then(function(){a.queryTaskList(),a.timer=setInterval(function(){return a.queryTaskList()},1e4)})},a.handleDelTask=function(e){var t=a.props.dispatch;t({type:"task/queryTaskDelete",payload:{id:e}}).then(function(){a.queryTaskList()})},a.handleAddPressureTask=function(e){a.setState({addPressureTaskVisible:!0,taskId:e})},a.handleCancelPressureTask=function(){a.setState({addPressureTaskVisible:!1})},a.handleAddPressureTaskForm=function(e){var t=a.formRef.props.form,r=a.state.taskId,n=a.props.dispatch;e.preventDefault(),t.validateFields(function(e,l){e||n({type:"task/queryAddPressureTask",payload:{taskId:r,info:l}}).then(function(){t.resetFields(),a.setState({addPressureTaskVisible:!1})})})},a.handleAddPressureTaskFormRef=function(e){a.formRef=e},a.renderStatus=function(e){var t;switch(e){case 1:t=x.default.createElement(f.default,{status:"processing",text:"\u83b7\u53d6\u4efb\u52a1\u4fe1\u606f"});break;case 2:t=x.default.createElement(f.default,{status:"processing",text:"\u751f\u6210\u6d4b\u8bd5\u811a\u672c"});break;case 3:t=x.default.createElement(f.default,{status:"success",text:"\u6267\u884c\u5b8c\u6210"});break;case 4:t=x.default.createElement(f.default,{status:"error",text:"\u83b7\u53d6\u4efb\u52a1\u4fe1\u606f\u5931\u8d25"});break;case 5:t=x.default.createElement(f.default,{status:"error",text:"\u6267\u884c\u4efb\u52a1\u5931\u8d25"});break;default:t=x.default.createElement(f.default,{status:"default",text:"\u65b0\u4efb\u52a1"})}return t},a}return(0,y.default)(t,e),(0,k.default)(t,[{key:"componentWillMount",value:function(){this.queryTaskList()}},{key:"componentWillUnMount",value:function(){clearInterval(this.timer)}},{key:"render",value:function(){var e=this,t=this.state,a=t.taskList,r=t.addPressureTaskVisible,n=this.props.loading,f=[{title:"\u4efb\u52a1\u540d\u79f0",dataIndex:"name",key:"name",render:function(e,t){return x.default.createElement("a",{href:"#/task/immediate/detail?".concat(t.id),style:{color:"#2e86de",fontWeight:"bold"}},e)}},{title:"\u4efb\u52a1\u63cf\u8ff0",dataIndex:"taskDesc",key:"taskDesc"},{title:"\u65b0\u5efa\u4eba",dataIndex:"add_user",key:"add_user"},{title:"\u65b0\u5efa\u65f6\u95f4",dataIndex:"add_time",key:"add_time"},{title:"\u4efb\u52a1\u72b6\u6001",dataIndex:"status",key:"status",render:function(t,a){return e.renderStatus(a.status)}},{title:"\u64cd\u4f5c",dataIndex:"action",key:"action",render:function(t,a){return x.default.createElement("div",null,0===a.status&&x.default.createElement("a",{onClick:function(){return e.handleRunTask(a.id)}},"\u5f00\u59cb\u6267\u884c"),3===a.status&&x.default.createElement("a",{style:{color:"#2e86de",fontWeight:"bold"},href:"#/task/immediate/report?".concat(a.id)},"\u67e5\u770b\u62a5\u544a"),[0,3].indexOf(a.status)>-1&&x.default.createElement(o.default,{type:"vertical"}),!([1,2].indexOf(a.status)>-1)&&x.default.createElement(i.default,{title:"\u662f\u5426\u8981\u5220\u9664\u6b64\u884c\uff1f",onConfirm:function(){return e.handleDelTask(a.id)}},x.default.createElement("a",{style:{color:"#eb2f06"}},"\u5220\u9664")),x.default.createElement(o.default,{type:"vertical"}),x.default.createElement("a",{onClick:function(){return e.handleAddPressureTask(a.id)},style:{color:"red",fontWeight:"bold"}},"\u53d1\u8d77\u538b\u6d4b"))}}];return x.default.createElement(A.default,null,x.default.createElement(q,{wrappedComponentRef:this.handleAddPressureTaskFormRef,visible:r,onCancel:this.handleCancelPressureTask,onCreate:this.handleAddPressureTaskForm}),x.default.createElement(l.default,{bordered:!1},x.default.createElement("div",{style:{marginBottom:16}},x.default.createElement(u.default,{type:"primary",onClick:function(){return e.handleGoAdd()}},x.default.createElement(d.default,{type:"plus"}),"\u65b0\u5efa\u4efb\u52a1")),x.default.createElement(s.default,{rowKey:function(e){return e.id},dataSource:a,columns:f,loading:n})))}}]),t}(x.PureComponent),g=b))||g),w=F;t.default=w}}]);