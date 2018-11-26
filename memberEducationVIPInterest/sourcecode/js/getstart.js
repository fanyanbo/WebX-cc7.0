//通用全局变量：
var _Lindex= "";
var _userPoints = 0;
var _userLvIcons = [];
var _userLv = 1;

//从底层获取设备信息，需要的参数
var accountVersion = "";
var cAppVersion = "";
var _timeStamp = "";
var deviceInfo = null; // tobefix
//var macAddress = null;
//var TVmodel = null;
//var TVchip = null;
//var activityId = null;
var loginstatus = "false";
var tencentWay = null;
var access_token = "";
var login_type = null;
var vuserid = null;
var cOpenId = "";
var _brand = "";
var _cUDID;
//
var _appid="", _source, _model, _chip, _mac, _serviceid, _version, _type, _devicebarcode, _time, _accessToken = "";
var _size,_sdkVer, _resolution, _fmodel, _pattern, _appID, _appversion = "", cWebViewVersion="";
var cPkg = "com.tianci.movieplatform";

//从后台获取电视的视频源：
var _TVSource = "";//视频源

//后台接口： 获取用户会员信息（金币数、点数、等级信息），需要的参数：
//var _testurl = "http://172.20.132.206:7070/";//测试地址 
//var _clientId = "9F072A0ABF6E2B3D";//test ; 
//var _clientKey = "85bdfb9ef29b4776";//test

var _testurl = "https://member.coocaa.com/";//正式地址
var _clientId = "c7ea82d00b5a4aa3";//正式的
//var _clientKey = "fa1c9df1106c46fb";//正式的

//从后台获取产品源，需要的参数：
var _userFlag = 0; //0/1/2 未登录 /usertoken/openid(coocaa)
var _userId = "";  //如上；
var _qqtoken = "";//qq信息

//当前页面全局变量，存放从后台获取到的产品源信息：
var _sourceDetailsArray = new Array();
var _sourceSuperVIPInfo = null;

//错误标志
var _failIndex = "";//加载失败的标识

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
    	//进入时,先画一次默认页面内容:
    	app.pageInit();
    	
//		//以下是为在PC上调试方便所加，后续要删除 -start-
//  	getProductPackListsFake();
//		map = new coocaakeymap($(".coocaa_btn"), $(".coocaa_btn").eq(0), "btn-focus", function() {}, function(val) {}, function(obj) {});
//		app.registerKeyHandler();
//	    //以下是为在PC上调试方便所加，后续要删除 -end-
    
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
        navigator.app.exitApp();
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
		var firstFocus = $(".vipEntry").eq(0);//document.getElementsByClassName("coocaa_btn")[0];
		initPhoneMap(firstFocus);

		//注册事件监听
		app.registerEventHandler();
		//注册按键监听
		app.registerKeyHandler();
		//开始跟底层和后台交互的流程：
		getLocalDeviceInfo();
    },
    onResume: function() {
        console.log("in onResume");
        //从产品包购买页面返回后，重新获取产品源列表信息，以刷新有效期时间：
        getProductPackLists();
    },
    
    onPause: function() {
        console.log("in onPause");
    },
	
	receivedEvent: function(id) {
		console.log('Received Event: ' + id);
	},
	
	registerEventHandler: function() {
		console.log("registerEventHandler---");
		coocaaosapi.addUserChanggedListener(function(message) {
			console.log("用户登录状态改变..."+JSON.stringify(message));
			//当用户登录状态发生变化时,重绘页面,重新落焦,并重新获取用户金币等数据:
			updateOnUserStateChanged();
		});
	},
	
	//注册按键
	registerKeyHandler: function()	{
		console.log("---in registerKeyHandler-----");

		$(".coocaa_btn").bind("itemClick", function() {
			_Lindex = $(".coocaa_btn").index($(this));
			console.log("-click---" + _Lindex);
			processKey();
		});
		
		$(".coocaa_btn").bind("itemFocus", function() {
			_Lindex = $(".coocaa_btn").index($(this));
			console.log("-focus-----"+_Lindex);
			scrollPage();
		});
	},
	
    pageInit: function() {
    	console.log("in pageInit.");
		setTimeout("delayLoad()", 100);
    	console.log("out pageInit.");
    },
    
    triggleButton: function() {
        cordova.require("com.coocaaosapi");
        webPageShowLog("教育VIP权益");
	}
};

app.initialize();

function updateOnUserStateChanged() {
	console.log("updateOnUserStateChanged in..._TVSource:"+_TVSource);
	hasLogin((_TVSource == "tencent") ? true : false);
	
	console.log("updateOnUserStateChanged out...");
}

//延迟加载图片
function delayLoad() {
	console.log("delayLoad in...");
	//用户头像
	var pic = app.rel_html_imgpath(__uri("../img/userIcon.png"));
	$("#userIcon").css("background-image", "url("+pic+")");
	//金币icon
	pic = app.rel_html_imgpath(__uri("../img/coin.png"));
	$("#coinIcon").css("background-image", "url("+pic+")");
	//教育icon
	pic = app.rel_html_imgpath(__uri("../img/iconEdu.png"));
	$(".vipEntryIcon").css("background-image", "url("+pic+")");
	
	//用户等级图标数组
	_userLvIcons[0] = app.rel_html_imgpath(__uri("../img/Lv1.png"));
	_userLvIcons[1] = app.rel_html_imgpath(__uri("../img/Lv2.png"));
	_userLvIcons[2] = app.rel_html_imgpath(__uri("../img/Lv3.png"));
	_userLvIcons[3] = app.rel_html_imgpath(__uri("../img/Lv4.png"));
	_userLvIcons[4] = app.rel_html_imgpath(__uri("../img/Lv5.png"));
	_userLvIcons[5] = app.rel_html_imgpath(__uri("../img/Lv6.png"));
	_userLvIcons[6] = app.rel_html_imgpath(__uri("../img/Lv7.png"));
	
	//VIP权益说明页
	$(".vipPrivilegeDetails").css("background-image", "url(img/EduVIPIqiyi.webp)");
	//页面加载失败提示页
	$(".failToast").css("background-image", "url(img/failToast.webp)");
	
	$("body").css("background-image", "url(img/bg.webp)");
}

//打开图标对应的产品包购买页面
function enterPurchasePage(){ //todo...
	var curEl = $(".coocaa_btn").eq(_Lindex);
	var index = $(".vipEntry").index(curEl);
	
	console.log("enterPurchasePage in...index:"+index);
	if(index == -1) {
		console.log("enterPurchasePage error, index -1");
		return;
	}
	
	var _sourceId = ""; //产品源ID
	var _businessType = 1; //业务线，非必填项，-1获取全部,0获取影视，1获取教育,2iptv，默认0	
	if(index == 0 && (_sourceSuperVIPInfo!= null)) {
		_sourceId = _sourceSuperVIPInfo.id;
		webBtnClickLog("教育VIP权益", "教育超级VIP");
	}else {
		webBtnClickLog("教育VIP权益", "教育分年龄VIP");
	}
	console.log("enterPurchasePage _sourceId:"+_sourceId);
	coocaaosapi.startMovieMemberCenter(_sourceId.toString(), _businessType.toString(),
			function(message){
			console.log(JSON.stringify(message));
		}, function(error){console.log(error);});
		
	console.log("enterPurchasePage out...");
}

//更新页面会员VIP内容及状态信息
function updateMemberVIPStates(data) {
	console.log("updateMemberVIPStates in...");
	
	//step1: 获取后台返回的产品源列表：
	var videoArray = data.data.sources;
	console.log("source length: "+videoArray.length);
	
	function getSourceDetails(item,index,arr) {
		var id = item.source_id;
		var name = item.source_name;
		var sign = item.source_sign;
		//需要先判断是否有description这个字段
		var des = item.description;
		var validway = item.valid_way;//string
		var validtype = item.valid_type;//int
		var validDate = 0;//
		if(validtype == 1) {
			if(item.valid_scope != undefined && item.valid_scope != null) {
				validDate = item.valid_scope.end;//
			}
		}
		console.log("source i:"+index+", id:"+id+", name:"+name+",des:"+des+",sign:"+sign+
				",validway:"+validway+"validtype:"+validtype+"validDate:"+validDate+"typeof validDate:"+typeof validDate);
		var sourceItem = {
			"id":id,
			"name":name,
			"des":des,
//			"validway":validway,
			"validType":validtype,
			"validDate":validDate
		}
		//教育页面只取超级vip的source_id
		if(sign.match(/supervip/i) != null){
			_sourceSuperVIPInfo = sourceItem;		
		}
	}
	videoArray.forEach(getSourceDetails);
	
	//debug：
//	function printInfo(item,index,arr) {
//		console.log("new array:"+index+" "+item.id+" "+item.name+" "+item.des+" "+item.validType + " "+item.validDate);
//	}
//	console.log("new array len:"+_sourceDetailsArray.length);
//	_sourceDetailsArray.forEach(printInfo);
	
	//step2:在页面的VIP类型区创建对应个数的div:
	drawVipEntryZone();
	
	console.log("updateMemberVIPStates out...");
}

//教育vip页面目前只有2个入口块，文件都是固定写在页面的，不用动态更新； 只更新vip状态和有效期；
function drawVipEntryZone() {//todo...
	console.log("drawVipEntryZone in...:");
	if(_sourceSuperVIPInfo == null) {
		return;
	}
	var picOpen = app.rel_html_imgpath(__uri("../img/supOpen.png"));
	var picRenew = app.rel_html_imgpath(__uri("../img/supRenewEdu.png"));
	if (_sourceSuperVIPInfo.validType == 0 ){
		console.log("用户没有开通超级VIP，显示立即开通");
		$("#vipEntry1 .vipEntrySubscribe").text("立即开通");
		$("#vipEntry1 .vipEntrySubscribe").css("font-weight", "bold");
		$("#vipEntry1 .vipEntryValidity").css("background-image", "url("+picOpen+")");
		$("#vipEntry1 .vipEntryValidity").css("width", "138px");
		//默认已显示立即开通
	} else {
		console.log("用户已经开通超级VIP，显示立即续费和有效期");
		$("#vipEntry1 .vipEntrySubscribe").text("立即续费");
		$("#vipEntry1 .vipEntrySubscribe").css("font-weight", "normal");
		$("#vipEntry1 .vipEntryValidity").css("background-image", "url("+picRenew+")");
		$("#vipEntry1 .vipEntryValidity").css("width", "314px");
		if(_sourceSuperVIPInfo.validDate != 0){
			var d = new Date(_sourceSuperVIPInfo.validDate * 1000);
			var year = d.getFullYear();
			var month = d.getMonth()+1;
			var day = d.getDate();
			d = year+"."+(month < 10 ? ("0"+month) : month)+"."+((day<10?("0"+day):day)+"到期");
			console.log("validity....."+d);
			$("#vipEntry1 .vipEntryTimeTip").css("display", "inline-block");
			$("#vipEntry1 .vipEntryTimeTip").text(d);
		}
	}
	//更新分年龄段的角标背景：
	$("#vipEntry2 .vipEntryValidity").css("background-image", "url("+picOpen+")");
	console.log("drawVipEntryZone out...");
}

//ajax跨域，需要设置header，这种情况需要后台服务器配置Access-Control-Allow-Origin 
function getProductPackLists() {
	console.log("getProductPackLists in..._userFlag:"+_userFlag 
		+ "access_token:"+access_token + "openid:"+ cOpenId+" _qqtoken:	"+_qqtoken);
	
	switch(_userFlag) {
		case 1:
			_userId = access_token;
			break;
		case 2:	
			_userId = cOpenId;
			break;
	}

	//从后台获取产品源列表的测试接口
//	var myUrl = "http://172.20.132.182:8090/v3/source/getSourceList.html";
//	var myUrl = "http://172.20.132.182:8090/ABtest/v3/source/getSourceList.html";//测试接口
	var myUrl = "http://business.video.tc.skysrt.com/v3/source/getSourceList.html";//正式接口
	var data = {
			"user_flag": _userFlag,
			"user_id": _userId,
			"client_type": 4,//固定4
			"business_type": 1,//-1:all 0:movie 1:education
			"third_user_id": _qqtoken //腾讯的openid
	}
	data = encodeURIComponent(JSON.stringify(data));
	myUrl = myUrl + "?data=" + data;
	console.log("total url: "+ myUrl);

	var ajaxTimeoutOne = $.ajax({
		type: "GET",
		async: true,
		timeout : 10000, 
		dataType: 'json',
		url: myUrl,
		headers: {
//			"Accept-Encoding":"",
			"cUDID":_cUDID,
			"MAC": _mac,
			"cModel": _model,
			"cChip": _chip,
			"cSize": _size,
			"cResolution": _resolution, //哪里获取?
			'aSdk': _sdkVer,
			'cAppVersion': _appversion,
//			'cWebViewVersion': cWebViewVersion,
			'cPkg': cPkg,
			"cTcVersion": _version,
			"cFMode": _fmodel,
			"cPattern": _pattern,
			"cUserInfo": cOpenId, //用户信息：用户未登录，则填入空字符串；用户已登录，则将用户openId提交。
			'cEmmcCID': cEmmcCID,
//			"cBrand": _brand,
//			"cCreen": "",
			"vAcceptSources":"sky,voole,tencent,iqiyi",  
			"vAppID": _appID,
			"vAppVersion": _appversion,
		},
		success: function(data) {
			console.log("getProductPackLists   " + JSON.stringify(data));
			//todo:
			console.log("data.code:"+data.code + "data.msg:"+data.msg);
			if(data.code == 0) {
				console.log("vip info get ok, let's go...");
				updateMemberVIPStates(data);
			}
		},
		error: function(error) {
			console.log("getProductPackLists Error:"+JSON.stringify(error));
			showFailToast(true, "getProductPackListsFail");
		},
		complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
　　　	　	console.log("getProductPackLists complete. status:"+status+"XMLHttpRequest.resheader:"+XMLHttpRequest.getAllResponseHeaders());
			console.log("xmlhttp return : "+XMLHttpRequest.readyState +" status:"+XMLHttpRequest.status);
			if(status=='timeout'){
		 　　　　　 	ajaxTimeoutOne.abort();
	　　　　	}
	　　	}
	});	
	console.log("getProductPackLists out...");
}

//是否显示错误提示页面
function showFailToast(bShow, failFlag) {
	console.log("showFailToast in..bShow:"+bShow+",failFlag:"+failFlag);
	//错误提示页面显示时,要获取焦点
	if(bShow == true) {
		$(".failToast").css("display", "block");
		_failIndex = failFlag;
	}else {
		$(".failToast").css("display", "none");
		_failIndex = "";
	}
}

//页面加载失败处理函数,从失败的地方重新加载
function failToastProcess(){
	console.log("failToastProcess in..._failIndex:	" +_failIndex);
	switch(_failIndex) {
//		case "getUserInfoFail":
//			hasLogin((_TVSource == "tencent") ? true : false);
//			break;	
		case "getUserCoinsInfoFail":
			getUserCoinsInfo();
			break;
		case "getProductPackListsFail":
			getProductPackLists();
			break;
		case "getTvSourceFail":
    		getTvSource(_mac, _model, _chip, _size, _resolution, _version, _fmodel, _pattern, _appID, _appversion, _appid, _source, _serviceid, _type, _devicebarcode, _time,_accessToken);
			break;
		default:
			break;
	}
	showFailToast(false);
	console.log("failToastProcess out...");	
}

//处理用户按键
function processKey() {
	console.log("processKey in");
	
	//错误提示页面存在时,用户按下"确认",重新加载本页面:
	//这样会有一个bug: 用户按方向键时,焦点其实还在后台动;只是页面不响应,后续优化!
	if($(".failToast").css("display") != "none") {
		console.log("failToast page showing...");
		failToastProcess();
		return;
	}
	
	var el = $(".coocaa_btn").eq(_Lindex);
	var elId = el.attr("id");
	console.log("cur focus id: ===="+elId);
	if (elId =="notLoginId") {
		console.log("user start login, TVSource:"+_TVSource);
		webBtnClickLog("教育VIP权益", "立即登录顶部");
		startLogin(false);//教育不需要qq/weixin //startLogin((_TVSource == "tencent") ? true : false);
	}else if(el.hasClass("vipEntry")) {
		console.log("user start purchase");
		//测试进入购买页面：
		enterPurchasePage();
	}
	console.log("processKey out..");	
}

//用户操作上下键时移动页面,包括焦点的切换:(先用虚拟焦点的方式实现上下翻页效果再说)
function scrollPage() {
	console.log("scrollPage in");	
	
	//错误提示页面存在时,不响应页面滚动:
	if($(".failToast").css("display") != "none") {
		console.log("failToast page showing...");
		return;
	}
	
	var curEl = $(".coocaa_btn").eq(_Lindex);

	var mytop = 0;	
//	var containerHeight = $(".innerContainer").height();
//	var $window = $(window);
//	var windowHeight = $window.height();
//	var headerHeight = $(".header").height();
//	var mytopMax = containerHeight - $window.height() + headerHeight;
//
//	console.log("scrollPage..cur id:"+ curEl.attr("id")+
//		" containerHeight"+containerHeight + " headerHeight"+headerHeight+" mytopMax"+mytopMax);
	
	//上下移动时:
	switch(curEl.attr("id")) {
		case "vipPrivilegeId":
			mytop = curEl.position().top;
			break;
		case "vf1":
			mytop = curEl.position().top;
			break;
		default:
			mytop = 0;
			break;
	}
	console.log("scrollPage ..cur el:"+curEl.attr("id")+"..mytop:"+mytop);
	var container = $(".innerContainer");
	container.css("transform", "translateY(-" + mytop + "px)");
	container.css({
		"transition": "all 0.5s",
		"-moz-transition": "all 0.5s",
		"-webkit-transition": "all 0.5s"
	});

	//vipbar区超过4个图标,需要左右移动时:
	if(curEl.hasClass("vipEntry") && ($(".vipEntry").length > 4)) {
		var curIndex = $(".vipEntry").index(curEl);
		var offsetH = 0;
		if(curIndex > 3) {
			var offsetDelta = curEl.outerWidth(true);
			offsetH = (curIndex - 3) * offsetDelta;
		}
		console.log("H index: "+curIndex);
		var vipBarZone = $(".vipEntryZone");
		vipBarZone.css("transform", "translateX(-"+offsetH+"px)");
		vipBarZone.css({
			"transition": "all 0.5s",
			"-moz-transition": "all 0.5s",
			"-webkit-transition": "all 0.5s"
		});
	}
	console.log("scrollPage out");		
}

//从后台获取用户金币/点数等信息
function getUserCoinsInfo() {
	console.log("getUserCoinsInfo in...");

	//time
	var timestamp = Date.parse(new Date());
	var tmpstring = timestamp.toString();
	var tmpnum = tmpstring.substr(0, 10);
	_timeStamp = tmpnum;

	var ajaxTimeoutTwo = $.ajax({
		type: "GET",
		async: true,
		timeout: 10000,
		dataType: 'jsonp',
		jsonp: "callback",
		url: _testurl + "/v4/public/query-pointsCoinsLevelInfo-byToken",
		data: {
			"clientId": _clientId,
			"accessToken": access_token,
			"currentTimestamp": _timeStamp,
			"callback": "myCallbackFunc"
		},
		
		success: function(data) {
			console.log("getUserCoinsInfo success:"+JSON.stringify(data));
			if(data.success == true) {
				_userLv = data.data.level.gradeLevel;
				_userPoints = data.data.points;
//				$("#userLv").text("Lv"+_userLv);
				_userLv = (_userLv < 1) ? 1 : _userLv;
				_userLv = (_userLv > 7) ? 7 : _userLv;
				$("#userLv").css("background-image", "url("+_userLvIcons[_userLv-1]+")");				
				$("#coinNum").text((data.data.coins).toFixed(1));
			}
		},
		error: function(data) {
			console.log("getUserCoinsInfo error: "+JSON.stringify(data));
			showFailToast(true, "getUserCoinsInfoFail");
		},
		complete: function(XMLHttpRequest, status) {　　　　
			console.log("getUserCoinsInfo complete--" + status);
			if(status == 'timeout') {　　　　　
				ajaxTimeoutTwo.abort();　　　　
			}
		}
	});	
	console.log("getUserCoinsInfo out...");
}

//显示用户登录或没有登录的信息:
//初始时都不显示,等获取用户登录状态（成功或失败)后,再显示
function updateUserLoginState(bLogin) {
	console.log("updateUserLoginState bLogin:"+bLogin);
	if(bLogin == false) {
		//状态为未登录
		$("#userinfo").css("display", "none");
		$(".notLogin").css("display", "block");
		$(".notLogin").addClass("coocaa_btn");
	}else {
		//已获取用户登录信息
		$(".notLogin").css("display", "none");
		$(".notLogin").removeClass("coocaa_btn");
		$("#userinfo").css("display", "block");
	}
	//更新右上角后,刷新下焦点
    var initPhoneMap = function(obj) {
		map = new coocaakeymap($(".coocaa_btn"), obj, "btn-focus", function() {}, function(val) {}, function(obj) {});
		console.log("----------initPhoneMap End---------");
	}
	var firstFocus = $(".vipEntry").eq(0);//document.getElementsByClassName("coocaa_btn")[0];
	initPhoneMap(firstFocus);
	
	//对coocaa_btn增减后,必须谨慎处理:
	//1.按键也需要重新绑定,否则新增的焦点不会响应按键; 
	//2.另外已经存在的焦点不能bind 2次,否则会接到底层上抛的2次按键响应:
	$(".coocaa_btn").unbind();
	app.registerKeyHandler();
}


function getLocalDeviceInfo() {
	console.log("getLocalDeviceInfo in...");
		_devicebarcode = "";
		//time
		var timestamp = Date.parse(new Date());
		var tmpstring = timestamp.toString();
		var tmpnum = tmpstring.substr(0, 10);
		_time = tmpnum;

		//type
		_type = "20";//20 新会员体系--关注绑定酷开账号

		_source = "";
		
		_resolution = "1920*1080"; //同谢金融
		_appversion = cAppVersion;//0;
		_fmodel = "Default";
		_pattern = "normal";
		_appID = 0;
		
		console.log("_appversion="+_appversion);
		
		coocaaosapi.getDeviceInfo(function(message) {
			console.log("getDeviceInfo success:	"+ JSON.stringify(message));
			
			deviceInfo = message;
			_cUDID = message.activeid;
			_model = message.model;
			_chip = message.chip;
			_mac = message.mac;
			_size = message.panel;
			_serviceid = message.activeid;
			cEmmcCID = message.emmcid;
			_version = message.version.replace(/\./g, "");
			_brand = message.brand;
			_sdkVer = message.androidsdk;
			
			console.log("_version.."+_version);
        	console.log("_cUDID.."+_cUDID);
//      	
    		getTvSource(_mac, _model, _chip, _size, _resolution, _version, _fmodel, _pattern, _appID, _appversion, _appid, _source, _serviceid, _type, _devicebarcode, _time,_accessToken);

//			coocaaosapi.hasCoocaaUserLogin(function(message) {
//	            if (message.haslogin == "true") {
//	            	coocaaosapi.getUserAccessToken(function(message) {
//		        		console.log(JSON.stringify(message));
//		        		_accessToken = message.accesstoken;
//		        		_userFlag = 1;
//		        		getTvSource(_mac, _model, _chip, _size, _resolution, _version, _fmodel, _pattern, _appID, _appversion, _appid, _source, _serviceid, _type, _devicebarcode, _time,_accessToken);
//		        	},function(error) { console.log(error); useDefaultQrcode();});
//	            }else{
//	        		console.log("user not login...");
//	            	_accessToken = "";
//					getTvSource(_mac, _model, _chip, _size, _resolution, _version, _fmodel, _pattern, _appID, _appversion, _appid, _source, _serviceid, _type, _devicebarcode, _time,_accessToken);
//	            }
//			},function(error) {
//				console.log(error);
//			});
		}, function(error) {
			console.log(error);
		});
		
		console.log("getLocalDeviceInfo out...");
}

function getTvSource(smac, smodel, schip, ssize, sresolution, sversion, sfmodel, spattern, sappID, sappversion, qappid, qsource, qserviceid, qtype, qdevicebarcode, qtime,qaccessToken) {
	console.log("getTvSource in 获取视频源传的参数---" + "MAC="+smac+"&cModel="+smodel+"&cChip="+schip+"&cSize="+ssize+"&cResolution="+sresolution+"&cTcVersion="+sversion+"&cFMode="+sfmodel+"&cPattern="+spattern+"&vAppID="+sappID+"&vAppVersion="+sappversion);
	var myUrl = "";
	myUrl = "http://movie.tc.skysrt.com/v2/getPolicyByDeviceInfoTypeJsonp";
	var ajaxTimeoutOne = $.ajax({
		type: "GET", // get post 方法都是一样的
		async: true,
		timeout : 10000, 
		dataType: 'jsonp',
		jsonp: "callback",
		url: myUrl,
		data: {
			"MAC": smac,
			"cModel": smodel,
			"cChip": schip,
			"cSize": ssize,
			"cResolution": sresolution,
			"cTcVersion": sversion,
			"cFMode": sfmodel,
			"cPattern": spattern,
			"vAppID": sappID,
			"vAppVersion": sappversion
		},
		success: function(data) {
			console.log("getTvSource success..."+JSON.stringify(data));
			_TVSource = data.source;
			if(_TVSource == "tencent") {
				console.log("视频源：" + _TVSource);
				//检测用户是否登录,腾讯源需要验证qq/wechat
				hasLogin(true);
			}else{ //if(_TVSource == "yinhe") 
				console.log("默认视频源：" + _TVSource);
				//检测用户是否登录,爱奇艺源不需要验证qq/wechat
				hasLogin(false);
			} 
		},
		error: function(error) {
			console.log("getTvSource error..."+error);
			showFailToast(true, "getTvSourceFail");
		},
		complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
	　　　　	console.log("getTVSource complete--"+status);
			if(status=='timeout'){
	 　　　　　 		ajaxTimeoutOne.abort();
	　　　　	}
	　　	}
	});
	console.log("getTvSource out...");
}

function hasLogin(needQQ) {
	console.log("hasLogin in...");
    coocaaosapi.hasCoocaaUserLogin(function(message) {
        console.log("hasCoocaaUserLogin: " + JSON.stringify(message));
        loginstatus = message.haslogin;
        if (loginstatus == "false") {
            if (cAppVersion >= 3190030) {
                tencentWay = "both";
            } else {
                tencentWay = "qq";
            }
            _userFlag = 0;
            access_token = "";
            //右上角显示"立即登录":
            console.log("user login false1, show 'login now'..");
        	updateUserLoginState(false);
            //用户没有登录,也要能获取产品包列表:
            getProductPackLists();
        } else {
            coocaaosapi.getUserInfo(function(message) {
                console.log("getUserInfo==" + JSON.stringify(message) + "typeof message: "+typeof message);
                userInfo = message;
                cOpenId = message.open_id;
                exterInfo = message.external_info;
                mobile = message.mobile;
                if (mobile == undefined) {
                    mobile = "";
                }
                nick_name = message.nick_name;
                
                //更新用户头像:
                var avatars = JSON.parse(message.avatars);
				$("#userIcon").css("background-image", "url("+avatars.f_50+")");

                coocaaosapi.getUserAccessToken(function(message) {
                	console.log("getUserAccessToken==" + JSON.stringify(message))
                    access_token = message.accesstoken;
                    _userFlag = 1;
                    
                    //然后判断是否真正登录:
                    if (exterInfo == "[]") {
                        exterInfo = '[{}]';
                    } else {}
                    if (needQQ) {
                        qqinfo = JSON.parse(exterInfo);
                        if (qqinfo.length == 1) {
                            if (cAppVersion >= 3190030) {
                                if (JSON.stringify(qqinfo[0]) == "{}" || qqinfo[0].external_flag == "jscn") {
                                    tencentWay = "both";
                                } else {
                                    tencentWay = qqinfo[0].external_flag;
                                }
                            } else {
                                tencentWay = "qq";
                            }

                            if (qqinfo != "" && qqinfo != null && qqinfo[0].login && qqinfo[0].external_flag != "jscn") {
                                _qqtoken = qqinfo[0].external_id;
                                if (qqinfo[0].external_flag == "qq") {
                                    login_type = 1;
                                } else {
                                    login_type = 2;
                                    vuserid = qqinfo[0].vuserid;
                                    if (vuserid == undefined) {
                                        vuserid = JSON.parse(qqinfo[0].refreshToken).vuserid
                                    }
                                    if (cAppVersion < 3190030) {
                                        loginstatus = "false";
                                    }
                                }
                            } else {
                                tencentWay = "both";
                                loginstatus = "false";
                            }
                        } else {
                            var needSelectNum = 0;
                            for (var b = 0; b < qqinfo.length; b++) {
                                needSelectNum = needSelectNum + 1;
                                if (qqinfo[b].login && qqinfo[b].external_flag != "jscn") {
                                    _qqtoken = qqinfo[b].external_id;
                                    if (qqinfo[b].external_flag == "qq") {
                                        login_type = 1;
                                    } else {
                                        login_type = 2;
                                        vuserid = qqinfo[b].vuserid;
                                        if (vuserid == undefined) {
                                            vuserid = JSON.parse(qqinfo[b].refreshToken).vuserid
                                        }
                                        if (cAppVersion < 3190030) {
                                            loginstatus = "false";
                                            tencentWay = "qq";
                                        }
                                    }
                                    break
                                }
                                if (needSelectNum == qqinfo.length) {
                                    tencentWay = "both";
                                    loginstatus = "false";
                                }
                            }
                        }
                    } else {
                        qqinfo = JSON.parse(exterInfo);
                        for (var b = 0; b < qqinfo.length; b++) {
                            if (qqinfo[b].login) {
                                _qqtoken = qqinfo[b].external_id;
                                if (qqinfo[b].external_flag == "qq") {
                                    login_type = 1;
                                } else if (qqinfo[b].external_flag == "weixin") {
                                    login_type = 2;
                                    vuserid = qqinfo[b].vuserid;
                                    if (vuserid == undefined) {
                                        vuserid = JSON.parse(qqinfo[b].refreshToken).vuserid
                                    }
                                }
                                break;
                            } else {
                                _qqtoken = "";
                            }
                        }
                    }
                    
                    console.log("~~~~~~loginstatus:"+loginstatus+" tencentWay:"+tencentWay);
                    if(loginstatus == "true") {
                    	console.log("user (qq/weixin) login true, update user icon.....");
                    }else {
                    	console.log("user login false(qq/weixin need)..");
                    }
                    //在这里用户只要酷开账号登录成功,就更新页面右上角会员信息,并要获取产品包列表:
                    updateUserLoginState(true);
					getUserCoinsInfo();
                    getProductPackLists();
                }, function(error) { console.log(error); })
            }, function(error) { console.log(error); });
        }

    }, function(error) { console.log(error); });
	console.log("hasLogin out...");
}

function startLogin(needQQ) {
    console.log("startLogin in: tencentWay:" + tencentWay);
    if (needQQ) {
        if (accountVersion > 4030000) {
            if (tencentWay == "qq") {
                coocaaosapi.startWeixinOrQQ2("LOGIN_QQ", function(message) { console.log(message); }, function(error) { console.log(error); });
            } else if (tencentWay == "weixin") {
                coocaaosapi.startWeixinOrQQ2("LOGIN_WEIXIN", function(message) { console.log(message); }, function(error) { console.log(error); });
            } else if (tencentWay == "both") {
                coocaaosapi.startWeixinOrQQ2("TENCENT", function(message) { console.log(message); }, function(error) { console.log(error); });
            }
        } else {
            coocaaosapi.startThirdQQAccount(function(message) { console.log(message); }, function(error) { console.log(error); });
        }
    } else {
        if (deviceInfo.version.replace(/\./g, "") < 550000000 && accountVersion > 4030000) {
            coocaaosapi.startUserSettingAndFinish2(function(message) { console.log(message); }, function(error) { console.log(error); });
        } else {
            coocaaosapi.startUserSettingAndFinish(function(message) { console.log(message); }, function(error) { console.log(error); });
        }
    }
    console.log("startLogin out...");
}

//test only, fake date:可以在PC chrome上得到结果
function getProductPackListsFake() {
	console.log("getProductPackLists in..._userFlag:"+_userFlag + "access_token:"+access_token + "openid:"+ cOpenId);
	
	switch(_userFlag) {
		case 1:
			_userId = access_token;
			break;
		case 2:	
			_userId = cOpenId;
			break;
	}
	//测试接口
//	var myUrl = "http://172.20.132.182:8090/v3/source/getSourceList.html";
//	var myUrl = "http://172.20.132.182:8090/ABtest/v3/source/getSourceList.html";//测试接口
	var myUrl = "http://business.video.tc.skysrt.com/v3/source/getSourceList.html";//正式接口
	var data = {
			"user_flag": 1,//_userFlag,
			"user_id": "2.4020ff964d0d4708a5eaa40fe59fd33c",//_userId,
			"client_type": 4
			,"business_type": 1  //-1:all 0:movie 1:education
			,"third_user_id": "o-G_Ut1fckL5fBMyygPT1eE5-grM"   //cOpenId //腾讯的openid
	}
	data = encodeURIComponent(JSON.stringify(data));
	myUrl = myUrl + "?data=" + data;
	console.log("total url: "+ myUrl);

	var ajaxTimeoutOne = $.ajax({
		type: "GET", // get post 方法都是一样的
		async: true,
		timeout : 10000, 
		dataType: 'json',
		url: myUrl,
		headers: {//是否必须用beforeSend函数来传参数？ 试下3
//			"Accept-Encoding":"",
			"cUDID":"16706858",
			"MAC": "001a9a000000",
			"cModel": "Q4A",
			"cChip": "9S52",
			"cSize": "65",
			"cResolution": "1920*1080",	
			'aSdk': "23",
			"cTcVersion": "620180417",
			'cAppVersion': "3190001",
//			'cWebViewVersion': "",
			'cPkg': cPkg,
			'cOpenId': "1266ec9cd2b811e8a09700505687790a",
			'cEmmcCID': "1101003030384737300017c1438f6400",
			"supportSource": "4k",
			"cFMode": "Default",
			"cPattern": "normal",
			"cUserInfo": "1266ec9cd2b811e8a09700505687790a", //openid
//			"cBrand": _brand,
//			"cCreen": "",
			"vAcceptSources":"tencent,iqiyi,voole,sky", //?how
			"vAppID": "0",
			"vAppVersion": "3190001" //要大于3180001			
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			//todo:
			console.log("data.code:"+data.code + "data.msg:"+data.msg);
			if(data.code == 0) {
				console.log("vip info get ok, let's go...");
				updateMemberVIPStates(data);
			}
			
		},
		error: function(error) {
			console.log('Error'+JSON.stringify(error));
		},
		complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
			console.log("xmlhttp return : "+XMLHttpRequest.readyState +" status:"+XMLHttpRequest.status);
　　　	　	console.log("-------------getProductPackLists complete-status:"+status+"XMLHttpRequest.resheader:"+XMLHttpRequest.getAllResponseHeaders());
			if(status=='timeout'){
	 　　　　　 		ajaxTimeoutOne.abort();
	　　　　	}
	　　	}
	});	
	console.log("getProductPackLists out...");
}

function webBtnClickLog(page_name, button_name) {
	var _dateObj = {
		"page_name": page_name,
		"module_name": button_name
	}
	var _dataString = JSON.stringify(_dateObj);
	console.log(_dataString);
	coocaaosapi.notifyJSLogInfo("education_interest_module_click", _dataString, function(message) {
		console.log(message);
	}, function(error) {
		console.log(error);
	});
}

function webPageShowLog(page_name) {
	var _dateObj = {
		"page_name": page_name
	}
	var _dataString = JSON.stringify(_dateObj);
	console.log(_dataString);
	coocaaosapi.notifyJSLogInfo("education_interest_show", _dataString, function(message) {
		console.log(message);
	}, function(error) {
		console.log(error);
	});
}