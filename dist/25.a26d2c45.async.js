(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[25],{"09zn":function(e,t,a){"use strict";var n=a("g09b"),r=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("2qtc");var d=n(a("kLXV"));a("5NDa");var u=n(a("5rEg"));a("IzEo");var l=n(a("bx4M"));a("g9YV");var o=n(a("wCAj"));a("+L6B");var i=n(a("2/Rp"));a("Pwec");var s,c,f,m=n(a("CtXQ")),p=n(a("2Taf")),y=n(a("vZ4D")),h=n(a("l4Ni")),v=n(a("ujKo")),j=n(a("MhPg")),w=r(a("q1tI")),S=a("MuoO"),q=(s=(0,S.connect)(function(e){var t=e.jmeter,a=e.loading;return{jmeter:t,loading:a.effects["jmeter/queryJmeterList"]}}),s((f=function(e){function t(){var e,a;(0,p.default)(this,t);for(var n=arguments.length,r=new Array(n),d=0;d<n;d++)r[d]=arguments[d];return a=(0,h.default)(this,(e=(0,v.default)(t)).call.apply(e,[this].concat(r))),a.state={showAddModal:!1,jmeterList:[],name:""},a.showAddModal=function(){a.setState({showAddModal:!0})},a.handleAdd=function(){var e=a.state.name,t=a.props.dispatch;e&&t({type:"system/queryAddProject",payload:{name:e}}).then(function(){a.queryJmeterList(),a.handleCancel()})},a.queryJmeterList=function(){var e=a.props.dispatch;e({type:"jmeter/queryJmeterList",payload:{status:""}}).then(function(){var e=a.props.jmeter;a.setState({jmeterList:e.jmeterList})})},a.handleCancel=function(){a.setState({showAddModal:!1,name:""})},a.querySetProjectStatus=function(e,t){var n=a.props.dispatch;n({type:"system/querySetProjectStatus",payload:{id:e,status:t}}).then(function(){a.queryJmeterList()})},a.handleSetClassStatus=function(e){1===e.status?a.querySetProjectStatus(e.id,0):a.querySetProjectStatus(e.id,1)},a}return(0,j.default)(t,e),(0,y.default)(t,[{key:"componentWillMount",value:function(){this.queryJmeterList()}},{key:"render",value:function(){var e=this,t=this.state,a=t.jmeterList,n=t.showAddModal,r=t.name,s=this.props.loading,c=[{title:"\u9879\u76ee\u540d\u79f0",dataIndex:"name",key:"name"},{title:"\u7528\u4f8b\u6570\u91cf",dataIndex:"count",key:"count"},{title:"\u521b\u5efa\u4eba",dataIndex:"add_user",key:"add_user"},{title:"\u521b\u5efa\u65f6\u95f4",dataIndex:"add_time",key:"add_time"},{title:"\u64cd\u4f5c",dataIndex:"action",key:"action"}];return w.default.createElement("div",null,w.default.createElement(l.default,{bordered:!1},w.default.createElement("div",{style:{marginBottom:16}},w.default.createElement(i.default,{type:"primary",onClick:this.showAddModal},w.default.createElement(m.default,{type:"plus"}),"\u65b0\u589e\u9879\u76ee")),w.default.createElement(o.default,{rowKey:function(e){return e.id},loading:s,dataSource:a,columns:c,size:"small"})),w.default.createElement(d.default,{visible:n,title:"\u65b0\u589e\u9879\u76ee",onOk:function(){return e.handleAdd()},onCancel:function(){return e.handleCancel()}},w.default.createElement(u.default,{placeholder:"\u8f93\u5165\u9879\u76ee\u540d\u79f0",autoFocus:!0,value:r,onChange:function(t){return e.setState({name:t.target.value})}})))}}]),t}(w.PureComponent),c=f))||c),g=q;t.default=g}}]);