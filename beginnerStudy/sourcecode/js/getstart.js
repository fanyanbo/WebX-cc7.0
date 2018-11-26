var _Index1= "";
var　firstFocus="";
var _bPlayDisrupted = false;
var _bBgColorTransparent = false;

var _videoInfos = [
	 { des: "如何使用遥控器", name: "1-remote", duration: "02:57", img: "img/1.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/7789c9d45285890783126962554/v.f240.m3u8?t=6198a5c6&exper=0&sign=033b301fd791463b85cbecfcc3a7acbb"}
	,{ des: "如何挑选想看的节目", name: "2-pick", duration: "03:49", img: "img/2.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/778a4d515285890783126963325/v.f240.m3u8?t=6198a5c6&exper=0&sign=5af7a79476f1227f258cce8d4e9243d1"}
	,{ des: "在播放中会用到", name: "3-play", duration: "02:34", img: "img/3.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/771f67d15285890783126906517/v.f240.m3u8?t=6198a5c6&exper=0&sign=46f4eb610324d989ad0854cfeaa9a242"}
	,{ des: "看过的节目去哪里找", name: "4-history", duration: "01:57", img: "img/4.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/771febd05285890783126907326/v.f240.m3u8?t=6198a5c6&exper=0&sign=08725d427cccb9d2d3214b085fa025e5"}
	,{ des: "如何购买会员和登录", name: "5-vip", duration: "03:16", img: "img/5.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/778b66785285890783126965357/v.f240.m3u8?t=6198a5c6&exper=0&sign=8a3d63fc2c50f79fc77ec331f904357e"}
	,{ des: "怎么看电视台", name: "6-cctv", duration: "01:25", img: "img/6.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/778b7b7a5285890783126965836/v.f240.m3u8?t=6198a5c6&exper=0&sign=778fb6067aadde097efd7cbf1287af0e"}
	,{ des: "试试和电视说话", name: "7-AI", duration: "03:08", img: "img/7.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/77208d955285890783126908834/v.f240.m3u8?t=6198a5c6&exper=0&sign=159768f0094b7d39fcfebd17a85624e6"}
	,{ des: "如何在电视上看手机上的视频和照片", duration: "02:51", name: "8-cast", img: "img/8.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/7558d2bb5285890783126882596/v.f240.m3u8?t=6198a5c6&exper=0&sign=02348bfab3db952c2d25bf14a5657ef7"}
	,{ des: "还能用电视做什么", name: "9-education", duration: "03:19", img: "img/9.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/7559514c5285890783126883211/v.f240.m3u8?t=6198a5c6&exper=0&sign=5f1ddf2231c82b99dec97393b1ee3a70"}
	,{ des: "有问题或想了解更多功能怎么办", name: "10-help", duration: "02:08", img: "img/10.webp", url: "http://gm-vd.coocaa.com/edb2878fvodtransgzp1253922718/778cfe345285890783126968008/v.f240.m3u8?t=6198a5c6&exper=0&sign=94b2fed3632f498132242b1e320cae9c"}
];

//页面部分的逻辑
var app = {
    canonical_uri: function(src, base_path) {
        var root_page = /^[^?#]*\//.exec(location.href)[0],
            root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
            absolute_regex = /^\w+\:\/\//;
        // is `src` is protocol-relative (begins with // or ///), prepend protocol  
        if (/^\/\/\/?/.test(src)) {
            src = location.protocol + src;
        }
        // is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /)  
        else if (!absolute_regex.test(src) && src.charAt(0) != "/") {
            // prepend `base_path`, if any  
            src = (base_path || "") + src;
        }
        // make sure to return `src` as absolute  
        return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src);
    },

    rel_html_imgpath: function(iconurl) {
        // console.log(app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1')));
        return app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1'));
    },

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
    	setBgColorTransparent();
    	app.showStudyVideos();
    	
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', this.onBackButton, false);
        document.addEventListener('backbuttondown', this.onBackButtonDown, false);
        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('pause', this.onPause, false);
    },
    onBackButton: function() {
        console.log("in onBackButton");
        //navigator.app.exitApp();
    },
    onBackButtonDown: function() {
        console.log("in handleBackButtonDown");
        //
        var playbackPageOn = $("#playbackPage").css("display");
        console.log("return btn, playback page status:"+playbackPageOn);
        if(playbackPageOn == "block") {
        	replayOrReturn(false);
        }else {
	        navigator.app.exitApp();
        }
    },
    onDeviceReady: function() {
        console.log("in onDeviceReady");
		app.receivedEvent('deviceready');
		app.triggleButton();

		//初始落焦
        var initPhoneMap = function(obj) {
			map = new coocaakeymap($(".coocaa_btn"), obj, "btn-focus", function() {}, function(val) {}, function(obj) {});
			console.log("----------initPhoneMap End---------");
		}
		firstFocus = document.getElementsByClassName("coocaa_btn")[0];
		initPhoneMap(firstFocus);

		//注册事件监听
		app.registerEventHandler();
		//注册按键监听
		app.registerKeyHandler();
    },
    onResume: function() {
        console.log("in onResume");
    },
    
    onPause: function() {
        console.log("in onPause");
    },
	
	receivedEvent: function(id) {
		console.log('Received Event: ' + id);
	},
	
	registerEventHandler: function() {
		console.log("registerEventHandler---");
		coocaaosapi.addCommonListener(function(message) {
			console.log("--------------->commonListen==" + message.web_player_event);
			if(message.web_player_event == "on_start") {
				$("#homeTitleDivId").css("display", "none");
				$("#homtContentDivId").css("display", "none");
			}else if(message.web_player_event == "on_complete") {
				$("#playbackPage").css("display","block");
				map = new coocaakeymap($(".coocaa_btn2"), $(".coocaa_btn2")[_Index1], null, function() {}, function(val) {}, function(obj) {});
			}else if(message.web_player_event == "on_interrupt") {
				$("#homeTitleDivId").css("display", "block");
				$("#homtContentDivId").css("display", "block");
				map = new coocaakeymap($(".coocaa_btn"), $(".coocaa_btn")[_Index1], "btn-focus", function() {}, function(val) {}, function(obj) {});
			}
		});		
	},
	
	//注册按键
	registerKeyHandler: function()	{
		console.log("---in registerKeyHandler-----");
		$(".coocaa_btn").bind("itemClick", function() {
				_Index1 = $(".coocaa_btn").index($(this));
				console.log("itemClick _Index1 = " + _Index1);
				//播放前先检测网络状态
				preparePlayVideo();
		});
		
		$(".coocaa_btn").bind("itemFocus", function() {
			_Lindex = $(".coocaa_btn").index($(this));
			console.log("----------focus-----"+_Lindex);
			focusShift(_Lindex);
		});
		
		$(".coocaa_btn2").bind("itemClick", function() {
			//_Index1 = $(".coocaa_btn2").index($(this));
			console.log("------coocaa_btn2 itemClick _Index2 = " + $(".coocaa_btn2").index($(this)));
			
			//响应用户选择（重播或返回)
			replayOrReturn(true);
		});
		
		$(".coocaa_btnF").bind("itemClick", function() {
			//_Index1 = $(".coocaa_btnF").index($(this));
			console.log("------coocaa_btnF itemClick _Index2 = " + $(".coocaa_btnF").index($(this)));
			//去联网
			startConnectNet();
		});
	},
	
    showStudyVideos: function() {
    	console.log("in showStudyVideos.");
		var len = _videoInfos.length;
		console.log("server data len:"+len);
		var i = 0;
		var tmpId;
		
		//插入图像
		for(i=0; i<len; i++) {
			tmpId = "videoDivId"+i;
			console.log("now i:"+tmpId);
			$("#"+tmpId+" .pTitleClass").text(_videoInfos[i].des);
			$("#"+tmpId+" .pDurationClass").text(_videoInfos[i].duration);					
		}
		delayLoad();
		console.log("out showStudyVideos.");
	},
    
    triggleButton: function() {
        cordova.require("com.coocaaosapi");
	}
    
};

app.initialize();


//计算焦点移动时,父Div的滚动条滚动距离
function focusShift(pos) {
	console.log("focusShift-111--pos="+pos);
	
	//如果需要翻页,开始滚动父Div滚动条
	if (pos > 5){
		var focusDivHeight = $(".baseDivComponent")[0].offsetHeight;
		focusDivHeight += 30; //margin_top + bottom;
		console.log("--- content page move...focusDivHeight:"+focusDivHeight);
	
		var myScrollTop = 0;
		//计算滚动距离,当前位置除以2(因为1行放2个视频)
		var relativePos = Math.round((pos - 5 )/2);
		myScrollTop = relativePos * focusDivHeight;
		console.log("cur focus12:"+ pos + ", relativePos:"+relativePos+", myScrollTop=" + myScrollTop);
		
		//chrome的animate scrollTop只支持html 不支持其它元素?
//		$("html,body").stop(true,true).animate({
//			scrollTop: myScrollTop
//		}, {
//			duration: 0,
//			easing: "linear",
//			complete: function() {}
//		});
		$(".baseDivComponent").stop(true,true).animate({
			top: -myScrollTop
		}, {
			duration: 0,
			easing: "linear",
			complete: function() {}
		});

	}else if (pos == 5 || pos == 4) {
		//回到首页
		console.log("---return home page");
		$(".baseDivComponent").stop(true,true).animate({
			top: 0
		}, {
			duration: 0,
			easing: "linear",
			complete: function() {}
		});
	}
}


//准备启动播放
function preparePlayVideo() {
	//播放前先检查网络是否连接
	coocaaosapi.isNetConnected(function(message){
			console.log("isNetConnected success:"+JSON.stringify(message));
			if(message.isnetworking == "true") {
				//启动播放
				playVideo();			
			}else {
				//网络未连接:
				showFailToast();		
			}
		}, function(error){console.log("isNetConnected error:"+JSON.stringify(error));});
}
//显示网络失败提示:
function showFailToast() {
	console.log("showFailToast in..");
	$("#failToast").css("display", "block");
	//获取按键:
	map = new coocaakeymap($(".coocaa_btnF"), document.getElementsByClassName("coocaa_btnF")[0], null, function() {}, function(val) {}, function(obj) {});
}

//进入设置网络页面:
function startConnectNet() {
	console.log("startConnectNet in...");
	//隐藏失败提示页,并恢复主页按键:
	$("#failToast").css("display", "none");
	map = new coocaakeymap($(".coocaa_btn"), $(".coocaa_btn")[_Index1], "btn-focus", function() {}, function(val) {}, function(obj) {});
	coocaaosapi.startNetSetting(function(message){
		console.log("startNetSetting success:"+JSON.stringify(message));
	}, function(error){console.log("startNetSetting error:"+JSON.stringify(error));});
}

//启动播放,不能控制快进快退 暂停继续;
function playVideo() {
		console.log("playVideo -start--_startPlaying:true-_Index1:"+_Index1);
//		_czc.push(["_trackEvent",category,action,label,value,nodeid]);
		//开始播放时,设置flag; 只有正常播完才会被设为false
//		_bPlayDisrupted = true;
		
		var _cName = _videoInfos[_Index1].des;
		var _cUrl = _videoInfos[_Index1].url;
		console.log("playing:"+_cName+"--"+_cUrl);

		coocaaosapi.startCommonWebview("qxhd", _cUrl, _cName, "1080", "1920", "", "新手学习", "", function(message) {
			console.log(message);
		}, function(error) {
			console.log("commonTask----error");
		});

		console.log("playVideo -end---");
}

//重播或返回
function replayOrReturn(index)	{
	console.log("replayOrReturn---index-"+index);
	if(index == true) {
		console.log("replay---");
		$("#playbackPage").css("display","none");
		playVideo();
	}else if(index == false){
		console.log("return---");
		//返回首页
		$("#playbackPage").css("display","none");
		$("#homeTitleDivId").css("display", "block");
		$("#homtContentDivId").css("display", "block");
		map = new coocaakeymap($(".coocaa_btn"), $(".coocaa_btn")[_Index1], "btn-focus", function() {}, function(val) {}, function(obj) {});
	}
}

function delayLoad() {
	if(_bBgColorTransparent != "true") {//没有设置背景为透明,才设置背景图片
		$("body").css("background-image", "url(img/bg.webp)");
	}
	
	$("#failToast").css("background-image", "url(img/failToast.webp)")
}

function setBgColorTransparent() {
    _bBgColorTransparent = getQueryString("bgtrans");
	console.log("bgcolor set:"+ _bBgColorTransparent + "typeof bgcolor:"+ typeof _bBgColorTransparent);
	if(_bBgColorTransparent == "true") {//背景透明
		$("body").css("background-color", "rgba(0,0,0,0)");
	}
}

//获取url中的参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
