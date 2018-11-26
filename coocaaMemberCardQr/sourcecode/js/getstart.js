//正式配置:
var _relServerUrl = "https://wx.coocaa.com/cors/qrcode/getTmpQrcode";
var _relAppId = "wx5a6d3bdcd05fb501";

//测试临时配置,正式发布时需要改为正式配置:
//var _relServerUrl = "https://beta-wx.coocaa.com/cors/qrcode/getTmpQrcode";
//var _relAppId = "wxee96df3337b09cb5";

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
	},
	
	//注册按键
	registerKeyHandler: function()	{
		console.log("---in registerKeyHandler-----");
	},
	
    triggleButton: function() {
        cordova.require("com.coocaaosapi");
        setTimeout("delayLoad()", 5);
	}
    
};

app.initialize();

function delayLoad(){
	$("body").css("background-image", "url(img/bg.webp)");
    getDeviceInfo();
}

function getDeviceInfo() {
		var _brand = "";
		var _appid, _source, _model, _chip, _mac, _serviceid, _version, _type, _devicebarcode, _time, _accessToken = "";
		var _size, _resolution, _appVersion, _fmodel, _pattern, _appID, _appversion = "";

		//appId
		_appid = _relAppId;//_testAppId;//"wx5a6d3bdcd05fb501";//正式环境下
		//deviceBarcode
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
			var _message = JSON.stringify(message);
			console.log(_message);
			
			_model = message.model;
			_chip = message.chip;
			_mac = message.mac;
			_size = message.panel;
			_serviceid = message.activeid;
			_version = message.version.replace(/\./g, "");
			_brand = message.brand;
			
			console.log("brand.."+_brand);
        	console.log("_appid.."+_appid);

			coocaaosapi.hasCoocaaUserLogin(function(message) {
	            if (message.haslogin == "true") {
	            	coocaaosapi.getUserAccessToken(function(message) {
		        		console.log("usertoken " + message.accesstoken);
		        		_accessToken = message.accesstoken;
		        		getTvSource(_mac, _model, _chip, _size, _resolution, _version, _fmodel, _pattern, _appID, _appversion, _appid, _source, _serviceid, _type, _devicebarcode, _time,_accessToken);
		        	},function(error) { console.log(error); useDefaultQrcode();});
	            }else{
	        		console.log("user not login...");
	            	_accessToken = "";
					getTvSource(_mac, _model, _chip, _size, _resolution, _version, _fmodel, _pattern, _appID, _appversion, _appid, _source, _serviceid, _type, _devicebarcode, _time,_accessToken);
	            }
			},function(error) {
				console.log(error);
				useDefaultQrcode();
			});
		}, function(error) {
			console.log(error);
			useDefaultQrcode();
		});
}

function getTvSource(smac, smodel, schip, ssize, sresolution, sversion, sfmodel, spattern, sappID, sappversion, qappid, qsource, qserviceid, qtype, qdevicebarcode, qtime,qaccessToken) {
	console.log("获取视频源传的参数---" + "MAC="+smac+"&cModel="+smodel+"&cChip="+schip+"&cSize="+ssize+"&cResolution="+sresolution+"&cTcVersion="+sversion+"&cFMode="+sfmodel+"&cPattern="+spattern+"&vAppID="+sappID+"&vAppVersion="+sappversion);
	var myUrl = "";
	myUrl = "http://movie.tc.skysrt.com/v2/getPolicyByDeviceInfoTypeJsonp";
	var ajaxTimeoutOne = $.ajax({
		type: "GET", // get post 方法都是一样的
		async: true,
		timeout : 5000, 
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
			console.log("~~~data.source:"+data.source);
			qsource = data.source;
			if(qsource == "yinhe") {
				console.log("视频源：" + qsource);
				console.log("获取二维码传的参数" + "qappid=" + qappid + ";qsource=" + qsource + ";smodel=" + smodel + ";schip=" + schip + ";smac=" + smac + ";qserviceid=" + qserviceid + ";qtype=" + qtype + ";qdevicebarcode=" + qdevicebarcode + ";qtime=" + qtime);
				getQrcodeUrl(qappid, qsource, smodel, schip, smac, qserviceid, qtype, qdevicebarcode, qtime, qaccessToken);
			} else if(qsource == "tencent") {
				console.log("视频源：" + qsource);
				console.log("获取二维码传的参数" + "qappid=" + qappid + ";qsource=" + qsource + ";smodel=" + smodel + ";schip=" + schip + ";smac=" + smac + ";qserviceid=" + qserviceid + ";qtype=" + qtype + ";qdevicebarcode=" + qdevicebarcode + ";qtime=" + qtime);
				getQrcodeUrl(qappid, qsource, smodel, schip, smac, qserviceid, qtype, qdevicebarcode, qtime, qaccessToken);
			} else {//todo: 还需要处理视频源是优朋的情况:
				console.log("视频源既不是爱奇艺又不是腾讯--" + qsource);
				useDefaultQrcode();
//				qsource == "yinhe";
//				document.getElementById("bgImga").style.display = "block";
//				console.log("获取二维码传的参数" + "qappid=" + qappid + ";qsource=" + qsource + ";smodel=" + smodel + ";schip=" + schip + ";smac=" + smac + ";qserviceid=" + qserviceid + ";qtype=" + qtype + ";qdevicebarcode=" + qdevicebarcode + ";qtime=" + qtime);
//				getQrcodeUrl(qappid, qsource, smodel, schip, smac, qserviceid, qtype, qdevicebarcode, qtime, qaccessToken);
			}
		},
		error: function() {
			console.log('获取视频源失败');
			useDefaultQrcode();
		},
		complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
	　　　　	console.log("-------------complete------------------"+status);
			if(status=='timeout'){
	 　　　　　 	ajaxTimeoutOne.abort();
	　　　　	}
	　　	}
	});
}

function getQrcodeUrl(appid, source, model, chip, mac, serviceid, type, devicebarcode, time, accessToken) {
	console.log("appid=" + appid + ",source=" + source + ",model=" + model + ",chip=" + chip + ",mac=" + mac + ",serviceid=" + serviceid + ",type=" + type + ",devicebarcode=" + devicebarcode + ",time=" + time);
	console.log("accessToken="+accessToken);
	var needDataObj = {
		"appId": appid,
		"source": source,
		"deviceModel": model,
		"deviceChip": chip,
		"deviceMac": mac,
		"serviceId": serviceid,
		"type": type,
		"token": accessToken,
		"deviceBarcode": devicebarcode,
		"time": time
	};
	var needDataString = JSON.stringify(needDataObj);
	console.log(needDataString);
	
	var myUrl2 = _relServerUrl; //"";_testServerUrl; //
	var ajaxTimeoutTwo = $.ajax({
		type: "GET", // get post 方法都是一样的
		async: true,
		timeout : 5000, 
		url: myUrl2,
		data: {
			"param": needDataString
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			console.log(typeof(data));
			console.log(data.result);
			if(data.result){
				console.log("绘制二维码;url="+ data.data);
				
				var str = data.data;
				var qrcode = new QRCode(document.getElementById("qrDiv"), {
					width : 336,
					height : 336
				});
				qrcode.makeCode(str);
			}else{
				console.log("获取二维码信息出错");
				console.log(JSON.stringify(data));
				useDefaultQrcode();
			}
		},
		error: function() {
			console.log('fail');
			useDefaultQrcode();
		},
		complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
	　　　　	console.log("-------------complete------------------"+status);
			if(status=='timeout'){
	 　　　　　 	ajaxTimeoutTwo.abort();
	　　　　	}
	　　	}
	});
}

function useDefaultQrcode() {
	var qrImageUrl = app.rel_html_imgpath(__uri("../img/qrImageBak.png"));
	console.log("something error, use default QR image:"+qrImageUrl)
	$("#qrDiv").css("background-image", "url("+qrImageUrl+")");
}
