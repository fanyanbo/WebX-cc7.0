var _Index1= "";
var _Lindex=0;
var　firstFocus="";
var _bPlayDisrupted = false;
var _tvPaiUrl = "http://tvpi.coocaa.com/?from=tvpitv";
var _udid = "";
var _accessToken = "";

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
        setTimeout("otherPageInit()", 100);
    },
    bindEvents: function() {
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
			console.log("----------initPhoneMap End11--------");
		}
		firstFocus = document.getElementsByClassName("coocaa_btn")[0];
		initPhoneMap(firstFocus);

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
	
	//注册按键
	registerKeyHandler: function()	{
		console.log("---in registerKeyHandler-----");
     
		$(".coocaa_btn").bind("itemFocus", function() {
			_Lindex = $(".coocaa_btn").index($(this));
			console.log("---focus:"+_Lindex);
			//$(".coocaa_btn")[_Lindex].style.color = "#cccccc";
			
			switchContent();
		});
	},
	 
    triggleButton: function() {
        cordova.require("com.coocaaosapi");
        getDeviceInfo();
	}
    
};

app.initialize();
 
//生成电视派二维码
function getTVPaiQrcode() {
	console.log("accesstoken:"+_accessToken+",cUid="+_udid);
	
//	var str = _tvPaiUrl;
//	if(_accessToken != null && _accessToken !="") {
//		str = _tvPaiUrl + "&accessToken="+_accessToken+"&cUid="+_udid;	
//	}
//	else if(_udid != null && _udid !="") {
//		str = _tvPaiUrl + "&accessToken=&cUid="+_udid;
//	}else {
//		str =_tvPaiUrl + "&accessToken=&cUid=";
//	}
	var str = _tvPaiUrl + "&accessToken="+_accessToken+"&cUid="+_udid;
	
	console.log("~~complete url:"+str);

	var qrcode = new QRCode(document.getElementById("qrImageId"), {
		width: 186,
		height: 186
	});
	
	qrcode.makeCode(str);
	$("#qrIcon").css("display", "block");
}

//获取设备信息
function getDeviceInfo() {
	coocaaosapi.getDeviceInfo(function(message) {
		console.log(JSON.stringify(message));
		_udid = message.activeid;
		
		coocaaosapi.getUserAccessToken(function(message) {
			console.log(JSON.stringify(message));
			_accessToken = message.accesstoken;
			getTVPaiQrcode();
		}, function(error) {
			console.log("获取用户accessToken异常.");
			getTVPaiQrcode();
		});
		
	}, function(error) {
		console.log("获取设备信息出现异常。");
		getTVPaiQrcode();
	});
}

//图片切换过渡效果
function switchContent() {
	var container = $("#container");
	var $window = $(window);
	
	container.css("transform", "translate3D(0, -" + (_Lindex) * $window.height() + "px, 0)");
	container.css({
		"transition": "all 0.5s",
		"-moz-transition": "all 0.5s",
		"-webkit-transition": "all 0.5s"
	});
}

function otherPageInit() {
	var pic1 = app.rel_html_imgpath(__uri("../img/content1.png"));
	var pic2 = app.rel_html_imgpath(__uri("../img/content2.png"));
	var pic3 = app.rel_html_imgpath(__uri("../img/content3.png"));
	var pic4 = app.rel_html_imgpath(__uri("../img/content4.png"));
//	console.log("==="+pic1+' '+pic2);
	$("#section0").css("background-image", "url("+pic1+")");
	$("#section1").css("background-image", "url("+pic2+")");
	$("#section2").css("background-image", "url("+pic3+")");
	$("#section3").css("background-image", "url("+pic4+")");
	
	$("body").css("background-image", "url(img/bg.webp)");
}