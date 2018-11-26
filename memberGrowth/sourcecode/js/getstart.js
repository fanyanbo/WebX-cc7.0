var _Lindex= "";
var _userPoints = 0;
var _userLv = 1;
var _userLvIcons = [];
var _coinsLv = [0, 120, 800, 2840, 6920, 15080, 30040];
var _memberLevelPrivilegeLineNums = 7;//页面会员等级权益的行数
var _memberLevelPrivilegeColNums = 7; //页面会员等级权益的列数

//获取用户会员信息（金币数、成长点数、会员等级）
//var _testurl = "http://172.20.132.206:7070/"; //测试地址
//var _clientId = "9F072A0ABF6E2B3D";//test ; 
//var _clientKey = "85bdfb9ef29b4776";//test

var _testurl = "https://member.coocaa.com/";//正式地址
var _clientId = "c7ea82d00b5a4aa3";//正式的
//var _clientKey = "fa1c9df1106c46fb";//正式的


var _timeStamp = "";

var _userInfoUrl = "http://beta.passport.coocaa.com//api/user/info";

var accountVersion = "";
var cAppVersion = "";
var deviceInfo = null; // tobefix
var macAddress = null;
var TVmodel = null;
var TVchip = null;
var activityId = null;
var loginstatus = null;
var tencentWay = null;
var user_flag = null;
var access_token = null;
var login_type = null;
var vuserid = null;
var _TVSource = "";//视频源
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
		var firstFocus = document.getElementsByClassName("coocaa_btn")[0];
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
		svgShowGrowCurve(true);
		setTimeout("delayLoad()", 100);
    	console.log("out pageInit.");
    },
    
    triggleButton: function() {
        cordova.require("com.coocaaosapi");
        webPageShowLog("成长秘籍");
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
	
	//用户等级图标数组
	_userLvIcons[0] = app.rel_html_imgpath(__uri("../img/Lv1.png"));
	_userLvIcons[1] = app.rel_html_imgpath(__uri("../img/Lv2.png"));
	_userLvIcons[2] = app.rel_html_imgpath(__uri("../img/Lv3.png"));
	_userLvIcons[3] = app.rel_html_imgpath(__uri("../img/Lv4.png"));
	_userLvIcons[4] = app.rel_html_imgpath(__uri("../img/Lv5.png"));
	_userLvIcons[5] = app.rel_html_imgpath(__uri("../img/Lv6.png"));
	_userLvIcons[6] = app.rel_html_imgpath(__uri("../img/Lv7.png"));
	
	//页面加载失败提示页
	$(".failToast").css("background-image", "url(img/failToast.webp)");
	
	$("body").css("background-image", "url(img/bg.webp)");
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
		case "getUserCoinsInfoFail":
			getUserCoinsInfo();
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
	switch(elId) {
		case "notLoginId":
			console.log("user start login, TVSource:"+_TVSource);
			webBtnClickLog("成长秘籍","立即登录顶部");
			startLogin(false);//成长秘籍页不分视频源
		break;
		case "btnEnterTask":
			webBtnClickLog("成长秘籍","做任务赚金币底部");
			coocaaosapi.startTaskPage(function(message) {
				console.log(JSON.stringify(message));
			}, function(error) {
				console.log(error);
			});
			console.log("enter page do task......");
		break;
	}
	console.log("processKey out..");	
}

//用户操作上下键时移动页面,包括焦点的切换:(先用虚拟焦点的方式实现上下翻页效果再说)
function scrollPage() {
	console.log("scrollPage in...");
	
	//错误提示页面存在时,不响应页面滚动:
	if($(".failToast").css("display") != "none") {
		console.log("failToast page showing...");
		return;
	}

	var curEl = $(".coocaa_btn").eq(_Lindex);
	var mytop = 0;	
	var containerHeight = $(".innerContainer").height();
	var $window = $(window);
	var windowHeight = $window.height();
	var headerHeight = $(".header").height();
	var mytopMax = containerHeight - $window.height() + headerHeight;

	console.log("scrollPage..cur id:"+ curEl.attr("id")+
		" containerHeight"+containerHeight + " headerHeight"+headerHeight+" mytopMax"+mytopMax);
	
	if(curEl.hasClass("VirtualFocus1") == true) {
		mytop = 0;
	} else if(curEl.hasClass("VirtualFocus2")== true) {
		mytop = $(".curveDivClass").height() + parseInt($(".rankPrivilege").css("top"))/2; 
	} else if(curEl.hasClass("VirtualFocus3")== true) {
		mytop = $(".curveDivClass").height() + $(".rankPrivilege").height() + 
				parseInt($(".rankPrivilege").css("top")) + parseInt($(".coinsIntro").css("top"))/2;
	} else {
		return;
	}
	console.log("scrollPage ....mytop:"+mytop + " "+containerHeight);

	var container = $(".innerContainer");
	container.css("transform", "translateY(-" + mytop + "px)");
	container.css({
		"transition": "all 0.5s",
		"-moz-transition": "all 0.5s",
		"-webkit-transition": "all 0.5s"
	});
}

//填充等级特权表格的内容
function fillRankTable() {
	var i = 0;
	//去除默认Lv1的高亮:
//	$("th").eq(1).removeClass("selectedTableEffect");
//	for(i=0;i<_memberLevelPrivilegeLineNums;i++) {
//		$("td").eq(i*_memberLevelPrivilegeColNums).removeClass("selectedTableEffect");
//	}
	//高亮当前等级权益:
	var index = (_userLv <= 0) ? 1 : ((_userLv>=7) ? 7 : _userLv); 
	console.log("lv index:"+index);
	$("th").eq(index).addClass("selectedTableEffect");
	for(i=0;i<_memberLevelPrivilegeLineNums;i++) {
		$("td").eq((index-1)+i*_memberLevelPrivilegeColNums).addClass("selectedTableEffect");
	}
}

//根据用户状态变化,更新对应的变化内容: 
//参数为true时表示首次绘制页面, 为false时表示更新页面变化的信息
function svgShowGrowCurve(isInit) {
	calCurPointsLocation(isInit);
}

function updateUserInfos(bLogin) {
	updateUserLoginState(bLogin);
	fillRankTable();
}

//画出等级曲线,并画当前金币在曲线上所处的位置(top,left)
function calCurPointsLocation(isInit) {
	console.log("calCurPointsLocation in, isInit:"+isInit+",cur coins:" + _userPoints);
	var i = 0;
	var len = _coinsLv.length;

	//1. 获取SVG区域宽高
//	var svgDiv = document.getElementById("svgZone");
//	var svgWidth = svgDiv.getAttribute("width");
//	var svgHeight = svgDiv.getAttribute("height");
	
	var svgWidth = 1742;//$(".curveDivClass").height();
	var svgHeight = 453;//$(".curveDivClass").offsetHeight;
	
	svgEllipseHeight = Math.round(svgHeight*5/6);
	console.log("------svgWidth:"+svgWidth+"-svgEllipseHeight:"+svgEllipseHeight);	
	
	//2.计算每个等级占用的空间宽度
	var lvWidth = svgWidth / (len-1);

	//初始化时只显示页面静态元素
	if (isInit == true) {
		//画最上面的markline:
//		var pathMarkCoordinates = {
//			A: {x:svgWidth, y:0},
//			B: {x:svgWidth, y:0},
//			C: {x:svgWidth, y:0},
//			D: {x:0, y:svgEllipseHeight},
//			R: {x:svgWidth, y:svgEllipseHeight}
//		};
//		var markLine = document.getElementById("markLine");
//		drawSVGPath(pathMarkCoordinates, markLine);	
		
		//画背景的X轴等级标记和对应的point数,1个div保存1组X轴上的所有标记
		//创建跟等级数一致的xAxisMark div(已经存在一个了)
		for(i=0; i<len-1; i++) {
			$(".xAxisMark:last").after($(".xAxisMark:last").clone(true));
		}
		
		//给所有XAxisMark div定位: 第一列不动,最后一列靠最右边,其它列依次排开:
		for(i=1;i<len-1;i++){
			document.getElementsByClassName("xAxisMark") [i].style.left = lvWidth*i+"px";
		}
		document.getElementsByClassName("xAxisMark") [len-1].style.left = svgWidth-75+"px";
		
		//让所有div内的元素居中,除了第一列居左,最后一列居右
		$(".xAxisMark:first div").css("transform", "none");
		$(".xAxisMark:last div").css("right", "0px");
		$(".xAxisMark:last div").css("transform", "none");
		
		//设置x坐标和椭圆曲线上的标记值
		for(i=0;i<len;i++){
			document.getElementsByClassName("xAxisEllipseMark") [i].style.top = calEllipseCoordinateY(lvWidth*i, svgWidth, svgEllipseHeight) + (i+1)*5 +"px";//有个间隔
			document.getElementsByClassName("xAxisEllipseMark") [i].innerHTML = _coinsLv[i];
			//小于用户等级的标注字体变为红色（设计要求）：
			if(i < _userLv) {
				document.getElementsByClassName("xAxisEllipseMark") [i].style.color = "rgba(253,78,0,1)";
			}else {
				document.getElementsByClassName("xAxisEllipseMark") [i].style.color = "rgba(250,202,104,0.4)";
			}
	//		document.getElementsByClassName("xAxisCoordinate") [i].style.top = svgHeight-35+"px";
			document.getElementsByClassName("xAxisCoordinate") [i].innerHTML = "Lv"+(i+1);
		}
		//最后一项高度需要再往下移:
		document.getElementsByClassName("xAxisEllipseMark") [len-1].style.top = (calEllipseCoordinateY(lvWidth*(len-1), svgWidth, svgEllipseHeight) + 65) +"px";//有个间隔
		console.log("calCurPointsLocation out. init phase, only draw static elements, not draw dynamic elements.");
		//return;
	}
	
	if(_userPoints > _coinsLv[_coinsLv.length-1]) {
		console.log("points too much, _userPoints:	"+_userPoints);
		_userPoints = _coinsLv[_coinsLv.length-1];
	}else if(_userPoints < 0) {
		console.log("points error. set to 0");
		_userPoints = 0;
	}
			
	//非初始化时（或获取到用户信息、或用默认值），绘制动态元素：
	for (i=0; i<len; i++) {
		if(_userPoints <= _coinsLv[i]) {
			console.log("lt " + _coinsLv[i] + "i:"+i);
			break;
		}
	}
	//确保当拥有金币数为0或1时(初始值),当前点可以正常显示:
	if(i==0) {i=1};

	//3.计算当前点数占用的空间宽度和高度,当为0时为计算方便,改为1;
	var curLeft = Math.floor((i-1)*lvWidth);
	var deltaWidth = Math.floor(lvWidth * ((_userPoints <= 1 ? 1 : _userPoints) - _coinsLv[i-1]) / (_coinsLv[i] - _coinsLv[i-1]));
	curLeft += deltaWidth;
	console.log("---lvWidth:"+lvWidth+"---deltaWidth:"+deltaWidth+"-curLeft:"+curLeft);
	
	var curTop = calEllipseCoordinateY(curLeft, svgWidth, svgEllipseHeight);
	console.log("------curTop:"+curTop);

	//画当前点的位置圆圈,对最大最小值的边界值有做处理(x/y方向都最小保留5px):
//	var markPoint = document.getElementById("markPoint");
	//ver0:用svg画了一个最简单的圆，与设计不符
//	markPoint.setAttribute("cy", (curTop < 5 ? 5 : (curTop)) +"px");
//	markPoint.setAttribute("cx", (curLeft < (svgWidth - 5) ? (curLeft > 5 ? curLeft : 5) : (svgWidth - 5))+"px");
//	markPoint.setAttribute("r", "5");
	//yuanbotest
	//ver1: 用svg circle画渐变圆的版本,效果放大后边缘有毛刺：
//	markPoint.setAttribute("cy", curTop +"px");
//	markPoint.setAttribute("cx", curLeft +"px");
//	markPoint.setAttribute("r", "15");	
	//ver2: 用svg image直接放图：
	//<image x="20" y="100" width="32" height="32" xlink:href="https://beta.webapp.skysrt.com/yuanbo/memberGrowth/img/point_ea65028.png"/>
//	markPoint.setAttribute("y", (curTop-16)+"");
//	markPoint.setAttribute("x", (curLeft-16)+"");
//	markPoint.setAttribute("width", "32");
//	markPoint.setAttribute("height", "32");
//	var pic=app.rel_html_imgpath(__uri("../img/point.png"));
//	markPoint.href.baseVal = pic;//ok2
//	markPoint.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",pic); //ok
	var markPoint = $("#markPoint");
	markPoint.css("top", (curTop-16)+"px");
	markPoint.css("left", (curLeft-16)+"px");
	markPoint.css("width", "32px");
	markPoint.css("height", "32px");
	
	//画当前点的值,对最大最小值的边界值有做处理:
	var markPointTip = $("#markPointTip");
	markPointTip.css({
		"top": (curTop>60 ? (curTop-60) : curTop) +"px",
		"left":(curLeft < (svgWidth - 120) ? (curLeft) : (svgWidth - 120))+"px", 
		"transform": "translateX(-50%)",
		"-webkit-transform":"translateX(-50%)" 
	});
	markPointTip.text(_userPoints);
	
	$(".curveProgress").css("width", curLeft+"px");
	
//SVG画曲线及曲线投影面积的方法，因为更换浏览器内核（切换为千家跃浏览器，裁剪了svg功能，所有不能用以下方法）：	
	//计算左边区域的A B C D坐标
//	var pathGotCoordinates = {
//		A: {x:0, y:svgHeight},
//		B: {x:curLeft, y:svgHeight},
//		C: {x:curLeft, y:curTop},
//		D: {x:0, y:svgEllipseHeight},
//		R: {x:svgWidth, y:svgEllipseHeight}
//	};
//	
//	var gotPath = document.getElementById("gotCoinsPath");
//	drawSVGPath(pathGotCoordinates, gotPath);
	
	//计算右边区域的A B C D坐标
//	var pathRemainCoordinates = {
//		A: {x:curLeft, y:svgHeight},
//		B: {x:svgWidth, y:svgHeight},
//		C: {x:svgWidth, y:0},
//		D: {x:curLeft, y:curTop},
//		R: {x:svgWidth, y:svgEllipseHeight}
//	};
//	
//	var remainPath = document.getElementById("remainCoinsPath");
//	drawSVGPath(pathRemainCoordinates, remainPath);
	console.log("calCurPointsLocation out...");
}

//画出等级曲线:
function drawSVGPath(el, pathId) {
//	d="M0,500 L1738,500 L1738,0 a1738,378 0 0,1 -1738,378 Z"
	var pathD = "M"+el.A.x+","+el.A.y+ 
				" L"+el.B.x+","+el.B.y+ 
				" L"+el.C.x+","+el.C.y+ 
				" A"+el.R.x+","+el.R.y+" 0 0,1 "+el.D.x+","+el.D.y+"";
	console.log("total path is...:"+pathD);
	console.log("total path is...:"+pathId.getAttribute("d"));
	pathId.setAttribute("d", pathD);	
	console.log("total path is...:"+pathId.getAttribute("d"));
}

//知道椭圆某点坐标x,计算坐标y
//成长曲线的算法是椭圆上四象限的一段弧线，
//椭圆rx=2226,ry=1012,原点的x坐标为0=弧线的起始坐标0，
//因为页面上弧线的区域长宽只有（1742,453），所以计算出来的y坐标=原点的y坐标 - （1012-453+72）
function calEllipseCoordinateY(x, rx, ry){
	var rx = 2226, ry = 1012;
	var deltaY = 631;
	
	var ySquare = (1-(x*x/(rx*rx))) * ry * ry;
	var y = Math.round(Math.sqrt(ySquare));
	
	y = y - deltaY;
	
	return y;
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
				//更新用户当前点位:
            	updateUserInfos(true);
				svgShowGrowCurve(false);
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
//		$(".notLogin").addClass("coocaa_btn");
	}else {
		//已获取用户登录信息
		$(".notLogin").css("display", "none");
//		$(".notLogin").removeClass("coocaa_btn");
		$("#userinfo").css("display", "block");
	}
	//更新右上角后,刷新下焦点
	map = new coocaakeymap($(".coocaa_btn"), $(".coocaa_btn").eq(0), "btn-focus", function() {}, function(val) {}, function(obj) {});
//	app.registerKeyHandler();
}

function getLocalDeviceInfo() {
		console.log("getLocalDeviceInfo in...");

		var _brand = "";
		var _appid="", _source, _model, _chip, _mac, _serviceid, _version, _type, _devicebarcode, _time, _accessToken = "";
		var _size, _resolution, _appVersion, _fmodel, _pattern, _appID, _appversion = "";
		_devicebarcode = "";

		//time
		var timestamp = Date.parse(new Date());
		var tmpstring = timestamp.toString();
		var tmpnum = tmpstring.substr(0, 10);
		_time = tmpnum;

		//type
		_type = "20";//20 新会员体系--关注绑定酷开账号

		_source = "";
		
		_resolution = "";
		_appVersion = 0;
		_fmodel = "Default";
		_pattern = "normal";
		_appID = 0;
		
		console.log("_appversion="+_appversion);
		
		coocaaosapi.getDeviceInfo(function(message) {
			console.log("getDeviceInfo success:	"+ JSON.stringify(message));
			
			deviceInfo = message;
			_model = message.model;
			_chip = message.chip;
			_mac = message.mac;
			_size = message.panel;
			_serviceid = message.activeid;
			_version = message.version.replace(/\./g, "");
			_brand = message.brand;
			
			console.log("brand.."+_brand);
        	console.log("_appid.."+_appid);

			getTvSource(_mac, _model, _chip, _size, _resolution, _version, _fmodel, _pattern, _appID, _appversion, _appid, _source, _serviceid, _type, _devicebarcode, _time,_accessToken);
		
		}, function(error) {
			console.log(error);
		});
}

function getTvSource(smac, smodel, schip, ssize, sresolution, sversion, sfmodel, spattern, sappID, sappversion, qappid, qsource, qserviceid, qtype, qdevicebarcode, qtime,qaccessToken) {
	console.log("getTvSource in. 获取视频源传的参数---" + "MAC="+smac+"&cModel="+smodel+"&cChip="+schip+"&cSize="+ssize+"&cResolution="+sresolution+"&cTcVersion="+sversion+"&cFMode="+sfmodel+"&cPattern="+spattern+"&vAppID="+sappID+"&vAppVersion="+sappversion);
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
            user_flag = 0;
            access_token = "";
            
            //用户没有登录,更新页面为没有登录的状态:
            updateUserInfos(false);
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
                    //然后判断是否真正登录:
                    if (exterInfo == "[]") {
                        exterInfo = '[{}]';
                    } else {}
                    user_flag = 1;
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
                                qqtoken = qqinfo[0].external_id;
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
                                    qqtoken = qqinfo[b].external_id;
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
                                qqtoken = qqinfo[b].external_id;
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
                                qqtoken = "";
                            }
                        }
                    }
                    
                    console.log("~~~~~~loginstatus:"+loginstatus+" tencentWay:"+tencentWay);
                    if(loginstatus == "true") {
                    	console.log("user (qq/weixin) login true, update user icon.....");
                    }else {
                    	console.log("user login false(qq/weixin need)..");
                    }
                    //在这里用户只要酷开账号登录成功,就更新页面右上角会员信息:
					getUserCoinsInfo();
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


function webBtnClickLog(page_name, button_name) {
	var _dateObj = {
		"page_name": page_name,
		"button_name": button_name
	}
	var _dataString = JSON.stringify(_dateObj);
	console.log(_dataString);
	coocaaosapi.notifyJSLogInfo("button_click", _dataString, function(message) {
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
	coocaaosapi.notifyJSLogInfo("growth_show", _dataString, function(message) {
		console.log(message);
	}, function(error) {
		console.log(error);
	});
}