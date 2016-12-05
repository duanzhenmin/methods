/**
 * (c) Copyright 2016 duanzhenmin. All Rights Reserved.
 */ 

/**
 * H5页面适配
 * size/100=rem;通过rem转换
 */
	var docEl = document.documentElement,
		userWidth = parseInt(docEl.getAttribute('data-user-width')),
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
	userWidth = userWidth.toString() === 'NaN' ? 750 : userWidth;
	function recalc() {
		//设置根字体大小
		docEl.style.fontSize = 100 * (docEl.clientWidth / userWidth) + 'px';
	};
	window.addEventListener(resizeEvt, recalc, false);
	document.addEventListener('DOMContentLoaded', recalc, false);

/**
 * @param {Object} fn ==> DomReady完成后的回调函数
 */
	function domReady(fn) {
		if(document.addEventListener) {
			document.addEventListener('DOMContentLoaded', function() {
				fn && fn();
			}, false);
		} else {
			document.attachEvent('onreadystatechange', function() {
				fn && fn();
			});
		}
	}

/**
 * phoneParams获取设备参数
 */
	//判断手机类型
	var browser = {
		versions: function() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return { //移动终端浏览器版本信息 
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
		}()
	}
	//获取手机参数
	phoneParams = {
		// 手机分辨率：宽度
		"phoneWidth": window.screen.width,
		// 手机分辨率：高度
		"phoneHeight": window.screen.height,
		// 浏览器窗口的宽度
		"clientWidth": document.documentElement.clientWidth,
		// 浏览器窗口的高度
		"clientHeight": document.documentElement.clientHeight,
		// 当前手机操作系统
		"currentPhoneSys": ''
	};
	!function() {
		if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
			phoneParams.currentPhoneSys = "ios";
		} else if(browser.versions.android) {
			phoneParams.currentPhoneSys = "android";
		}
	}();

/**
 * @param {Object} fn ==> 页面滚动到底部后的回调函数
 */
	domReady(function(){
		function loadMore(fn) {
			var oBody=document.querySelector('body');
			function scrollBottom() {
				if(oBody.scrollHeight < (scrollY + phoneParams.clientHeight + 2)) {
					fn && fn(scrollY + phoneParams.clientHeight);
				}
			}
			if(document.addEventListener) {
				document.addEventListener('scroll', scrollBottom, false);
			} else {
				document.attachEvent('onscroll',scrollBottom);
			}
		}
	});
	