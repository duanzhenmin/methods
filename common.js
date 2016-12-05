// !!!注!!!：
// 1.此文件引入之前必须要引入jquery.js
// 2.如果使用function getCheckParams ( userId, returnType )这个方法，之前必须引入jquery-md5.js
/**
 * H5页面适配
 * size/40=rem;通过rem转换
 */
	var docEl = document.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function() {
	    //设置根字体大小
	    docEl.style.fontSize = 20 * (docEl.clientWidth / 375) + 'px';
	};
	//绑定浏览器缩放与加载时间
	window.addEventListener(resizeEvt, recalc, false);
	document.addEventListener('DOMContentLoaded', recalc, false);

	


/**
 * 获取当前页面的参数
 * @param String name 请求中参数的key值
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
// HTML页面：通用信息配置
var config = {
	//"appServerUrl": "http://we.app.solarbao.com", // h5页面的正式环境
	//"apiServerUrl": "http://api.app.solarbao.com", //api后台接口的正式环境
	//"cdzServerUrl": "", // 充电庄需求：后台接口的正式环境
		
	"appServerUrl": "http://dev.we.app.solarbao.com", // h5页面的开发环境
	"cdzServerUrl": "http://101.200.78.100:1049", // 充电庄需求：后台接口的开发环境
		
	//"appServerUrl": "http://test.we.app.solarbao.com", // h5页面的测试环境
	"apiServerUrl": "http://101.200.144.60:81", //api后台接口测试环境
	//"cdzServerUrl": "http://101.200.144.60:90", // 充电庄需求：后台接口的测试环境
	"getOpenIdUrl":"http://dev.we.app.solarbao.com/pile/m/openid.php",
	"usCodeKey": "userCodeUC",  //加密使用，h5本地存储用户登录成功后的标识
	
	"interfaceVersion": "0.0.0", // 后台接口版本的控制，每个请求都必须要有这个参数：version=config.interfaceVersion

	"place": false  // 防止上面配置时，缺少','分隔，此为占位配置，无具体使用含义
};
//HTML页面：初始化参数
var initParams = {
	// 页面fr参数值，此配置说明显示H5自定义header的参数值汇总。配置如："spick,spi,test"
	"showMyHeader": "",
    // 手机分辨率：宽度
    "phoneWidth": window.screen.width,
    // 手机分辨率：高度
    "phoneHeight": window.screen.height,
    // 浏览器窗口的宽度
    "clientWidth": document.documentElement.clientWidth,
    // 浏览器窗口的高度
    "clientHeight": document.documentElement.clientHeight,
    // 手机操作系统
    "phoneAllSys": ["android", "ios"],
    // 当前手机操作系统
    "currentPhoneSys": "" 
};
//判断手机类型
var browser = {
    versions: function() {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息 
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
}
function judgePhoneSysType() {
    if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
        return "ios";
    }
    else if (browser.versions.android) {
        return "android";
    } else {
        return "";
    }
// document.writeln(" 是否为移动终端: " + browser.versions.mobile);
// document.writeln(" ios终端: " + browser.versions.ios);
// document.writeln(" android终端: " + browser.versions.android);
// document.writeln(" 是否为iPhone: " + browser.versions.iPhone);
// document.writeln(" 是否iPad: " + browser.versions.iPad);
// document.writeln(navigator.userAgent);
}
// 初始化定义手机类型
initParams.currentPhoneSys = judgePhoneSysType();

/**
 * GET请求+JSONP格式的异步AJAX请求
 * @param {Object} reqrUrl 请求的url，注此参数不能为空！！！
 * @param {Object} params 请求的参数，格式为key1=val1&key2=val2或{key1: val1, key2: val2}
 * @param {Object} successCallback 请求成功回调函数，参数为请求返回的参数function(data)
 * @param {Object} errorCallback 请求出错回调函数，参数为function(a, b, c)
 * @param {Object} timeoutCallback 请求出错回调函数，参数为function(jqAjaxReqr, status)。jqAjaxReqr请求的标识；status请求的状态：timeout、success、error
 * 例：
 * jqueryAjaxGetJsonp(
 * 		"http://www.baidu.com", //不能为空
 * 		"key=value", //可空，或不传此参
 * 		function(data) {alert("success");}, //可空，或不传此参
 * 		function(a,b,c) {alert("error");}, //可空，或不传此参
 * 		function(jqAjaxReqr, status) {jqAjaxReqr.abort();} //可空，或不传此参
 *  );
 */
function jqueryAjaxGetJsonp(reqrUrl, params, successCallback, errorCallback, timeoutCallback) {
	if(!params) params="";
	if( reqrUrl.indexOf("jsonp")==-1&&params.indexOf("jsonp")==-1) {params += "&jsonp=1";}
	var jqAjaxReqr = $.ajax({
		// timeout : 5000, //超时时间设置，单位毫秒
		type: "GET",
		url: reqrUrl,
		data: params,
		dataType: "jsonp",
		success: function(data) {
			if( successCallback && typeof successCallback=="function" ) {
				successCallback(data);
			}
		},
		complete: function(XMLHttpRequest, status) {
			if( timeoutCallback && typeof timeoutCallback=="function" ) {
				timeoutCallback(jqAjaxReqr, status);
			} else {
				if(status=='timeout'){//超时,status还有success,error等值的情况
					jqAjaxReqr.abort();
					// alert("请求访问超时");
				}
			}
		},
		error: function(a, b, c) {
			if( errorCallback && typeof errorCallback=="function" ) {
				errorCallback(a, b, c);
			}
		}
	});
}

/**
 * 根据 用户加密后的id + 当前时间的long数值 + 随机数 前台生成签名，后台进行校验请求的有效性
 * @param userId 加密后的用户id
 * @param returnType 返回的类型：
 * 		paramsStr--请求参数类型："userId="+userId+"&ts="+ts+"&random="+random+"&sign="+sig
 * 		其他参数返回对象：{"userId": userId, "ts": ts, "random": random, "sign": sign}
 * add by: CUIGC
 * add time: 2016-03-31
 */
function getCheckParams ( userId, returnType ) {
	var ts = new Date().getTime();
	var random = Math.floor( Math.random() * 10000 );  // random必须保证是4位
	if( random==0 ) { 
		random=5555;
	} else {
		var randomStr = random.toString();
		if( randomStr.length==3 ) {
			random = random*10;
		} else if( randomStr.length==2 ) {
			random = random*100;
		} else if( randomStr.length==1 ) {
			random = random*1000;
		}
	}
	var cnt = ""+userId+ts+random;
	var sign = $.md5( cnt );
	if( returnType=="paramsStr" ) {
		return "userId="+userId+"&ts="+ts+"&random="+random+"&sign="+sign;
	} else {
		return {"userId": userId, "ts": ts, "random": random, "sign": sign};
	}
}
/**
 * 后台PHP封装微信token，前端调API接口获取token相关数据，然后配置需要访问哪些微信的API接口
 * @param callWXApiList 需要使用访问的微信API接口名称。例：["checkJsApi", "getLocation", "onMenuShareTimeline"]
 */
function getWXJSTicket( callWXApiList ) {
	var currentUrl = location.href;
	if( currentUrl.indexOf("#")>-1 ) {
		currentUrl = currentUrl.substr(0, currentUrl.indexOf("#"));
	}
	currentUrl = encodeURIComponent(currentUrl);
	if( !callWXApiList ) return false;
	$.ajax({
		async: false,
		url: config.cdzServerUrl+"/wx/jstoken?url="+currentUrl,
		type: "get",
		success: function(result) {
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: result.data.appId, // 必填，公众号的唯一标识
			    timestamp: result.data.timestamp, // 必填，生成签名的时间戳
			    nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
			    signature: result.data.signature,// 必填，签名，见附录1
			    jsApiList: callWXApiList  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		}
	});
}
//H5页面返回上一个页面
function goBack() {
	window.history.go(-1);
}
/**
 * 调手机打电话功能。如果是在APP中展示H5，那么就调APP中的打电话功能
 * @param telNum 电话号码。格式为：tel:010-12345678
 */
function telphone( obj, telNum ) {
	if( !telNum ) return false;
	if( telNum.indexOf("tel:")==-1 ) telNum = "tel:"+telNum;
	if( typeof(callAppPhone)=="function" ) {
		callAppPhone( telNum );
	} else {
		$( obj ).attr("href", telNum);
	}
}
/**
 * 判断H5页面中是否显示自定义的header标题栏
 * 注：此方法需要在页面元素加载完成后调用。建议调用时机：$(function() { judgeMyHeader(); });
 * @param frParam 表示H5页面在什么地方展示。访问H5页面的地址参数为：fr=xxx
 */
function judgeMyHeader( frParam ) {
	frParam = frParam?frParam:getQueryString("fr");
	
	var $headerBar = $(".header-bar");
	if( initParams["showMyHeader"].indexOf(frParam)==-1 ) {
		$headerBar.addClass("uhide");
	}
	
	var headerBarHide = $headerBar.is(":hidden"); // 头部的标题栏是否隐藏，值为true或false
	var $content = $(".has-header-bar");
	if( headerBarHide ) {
		$content.removeClass("has-header-bar");
	} else {
//		$("html, body").height( initParams["clientHeight"] - $(".header-bar").height() );
//		if( initParams.currentPhoneSys==initParams.phoneAllSys[1] ) {
//			// ios手机不支持fixed属性，所以单独处理
//			$(window).scroll(function() {
//				//$headerBar.css({top: window.scrollY });
//				$content.addClass("iphone-nofixed");
//				$content.height( window.innerHeight - $headerBar.height() );
//				$("html,body").height(window.innerHeight);
//				$("#numtest").val(window.innerHeight+","+initParams["clientHeight"] +","+ $headerBar.outerHeight()+","+$content.height());
//			});
//		}
	}
}

//新维智能的公共组件
var xwznUtility = xwznUtility || {};
$.extend(xwznUtility, {
	//获取url中的openId或user_id
	getOpenOrUserId: function () {
		//接口参数
		var returnStr = '';
		var openId = getQueryString("openId");
		var user_id = getQueryString("user_id"); // 未加密123455
		var userId = getQueryString("userId"); // 加密ax123cwzs
		if(openId){
			returnStr = 'openId=' + openId;
		}else if(user_id || userId){
			returnStr = 'user_id=' + user_id+"&userId="+userId;
		}
		return returnStr;
	},
	//项目申请：微信去掉“合作申请”
	hideHeader: function(){
		//创客接入
		var user_id = getQueryString("user_id");
		if(user_id){
			$("body").append('<script type="text/javascript" src="../../static/js/outside_func.js"></script>');
			setAppTitle($("title").text());
		}
	},
	//正则匹配
	regExp: {
		mobile: /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,//电话号码
		number: /^[1-9]\d*$/,
		float: /^(0|([1-9]\d*))(\.\d{1,2})?$/,
		year: /^[1-9]\d{0,3}$/,
		num: /^[0-9]*$/		//只能是数字
	},
	//倒计时:seconds--倒计时秒数，$obj--显示秒数的jquery对象
	countTime: function(seconds,$obj){
		if(seconds && "number" === typeof seconds){
			$obj.text(seconds + 's');
			fun();
		}
		function fun(){
			var thisFun = arguments.callee;
			if(seconds > 0){
				setTimeout(function(){
					seconds--;
					$obj.text(seconds + 's');
					thisFun();
				},1000);
			}else{
				$obj.text("重发").prop("disabled",false);
			}
		}
	},
	//发送手机验证码:$btnSend--发送按钮,$btnCheck--验证按钮
	sendSms: function($btnSend){
		var that = this;
		if($btnSend){
			$btnSend.prop("disabled",true);
			var $mobile = $("#mobile");
			var mobile = $mobile.val();
			if(mobile){
				if(xwznUtility.regExp.mobile.test(mobile)){
					jqueryAjaxGetJsonp(config.apiServerUrl + '/common/sendcode.json','v=2.0.0&mobile=' + mobile,function(result){
						if(2000 == result.code){
							that.countTime(60,$btnSend);
						}else{
							$btnSend.text("重发");
							that.hideTip(decodeURI(result.msg));
							$btnSend.prop("disabled",false);
						}
					},function(){
						$btnSend.text("重发");
						that.hideTip("发送失败");
						$btnSend.prop("disabled",false);
					});
				}else{
					$mobile.focus();
					that.hideTip("手机号码格式不对");
					$btnSend.prop("disabled",false);
				}
			}else{
				$mobile.focus();
				that.hideTip("请填写手机号码");
				$btnSend.prop("disabled",false);
			}
		}
	},
	//提示信息
	hideTip: function (data) {
		var $loading = $(".loading");
		if(!$loading.length){
			$loading = $('<div class="loading"></div>');
			$("body").append($loading);
		}
		$loading.css("display", "block");
		$loading.html(data);
		setTimeout(function () {
			$loading.css("display", "none");
		}, 2000);
	},
	//微信分享
	weixinShare: function(callback){
		var callbackFunction = eval(callback);
		if(getQueryString('openId')){
			$.getScript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js').done(function(){
				var hrefUrl = window.location.href;
				hrefUrl = hrefUrl.split('#')[0];
				jqueryAjaxGetJsonp(config.xwServerUrl + '/index.php','r=api/wechat/getJssdk&wxId=' + config.mpWxId + '&userId=p5tvi9dst26u4&hrefUrl='+  encodeURIComponent(hrefUrl),function(data){
					if( data.code == 2000 ){
						wx.config({
							debug: false,
							appId: data.data.appId,
							timestamp: data.data.timestamp,
							nonceStr:  data.data.nonceStr,
							signature: data.data.signature,
							jsApiList: [
								// 所有要调用的 API 都要加到这个列表中
								'onMenuShareTimeline',
								'onMenuShareAppMessage',
								'onMenuShareQQ',
								'onMenuShareQZone'
							]
						});
					}
				});
				if($.isFunction(callbackFunction)){
					callbackFunction();
				}
			});
		}
	}
});