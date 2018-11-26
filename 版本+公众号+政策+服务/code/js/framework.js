var _mac = "";
var _chip = "";
var _model = "";
var _udid = "";
var _cVersion = "";
var _cSize = "";
var _cSdk = "";
var _emmcCID = "";
var _cBrand= "";
var _country = "";
var _customId = "";
var _language = "zh";
var _fModel = "Default";
var _resolution = "1280x720";
var _pattern = "normal";
var _channel="Coocaa"; 
var _headerVersion="7";
var _openid = "";
var _webViewVersion = "";

var _updataUrl1 = "";
var _updataUrl2 = "";
var _updataUrl3 = "";
var _curAppVersion = "";
var _movieVcode = "";
var _storeVcode = "";
var _mallVcode = "";

var _curParentIndex = 0;
var _testurl = "http://172.20.132.216:8081";
//var _testurl = "http://172.20.139.135:8080";

var app = {
	canonical_uri: function(src, base_path) {
		var root_page = /^[^?#]*\//.exec(location.href)[0],
			root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
			absolute_regex = /^\w+\:\/\//;
		if(/^\/\/\/?/.test(src)) {
			src = location.protocol + src;
		} else if(!absolute_regex.test(src) && src.charAt(0) != "/") {
			src = (base_path || "") + src;
		}
		return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src);
	},

	rel_html_imgpath: function(iconurl) {
		return app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1'));
	},

	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("backbutton", this.handleBackButton, false);
		document.addEventListener("backbuttondown", this.handleBackButtonDown, false);
		document.addEventListener('resume', this.onResume, false);
	},
	handleBackButton: function() {
		console.log("-------------->handleBackButton");
	},
	onResume: function() {
		console.log("-------------->onResume");
	},
	onDeviceReady: function() {
		app.receivedEvent("deviceready");
		app.triggleButton();
		map = new coocaakeymap($(".coocaa_btn"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
	},
	receivedEvent: function(id) {
		console.log(id);
	},
	handleBackButtonDown: function() {
		console.log("-------------->handleBackButtonDown");
		backButtonFunc();
	},
	triggleButton: function() {
		cordova.require("com.coocaaosapi");
		
		coocaaosapi.addAppTaskListener(function(message) {
		    console.log("taskinfo " + JSON.stringify(message));
		    console.log("msg.status ==" + message.status + "======url======" + message.url);
		    if (message.status == "ON_DOWNLOADING") {
		    	console.log("下载中");
		    } else if (message.status == "ON_COMPLETE") {
		        console.log("下载完成");
		    } else if (message.status == "ON_STOPPED") {
		        console.log("下载失败");
		    } else if (message.status == "ON_REMOVED") {
		    	console.log("安装完成");
		    };
		    console.log(message.url);
		    console.log(_updataUrl1);
		    console.log(_updataUrl2);
		    console.log(_updataUrl2);
		    if (message.status == "ON_REMOVED" && message.url == _updataUrl1) {
		       	console.log("安装完成一");
				$("#partInfo1").html("当前已是最新版本");
				$("#partInfo1").css("color","#999999");
				$("#comQues0").attr("status","0");//1-有更新、0-已是最新
		    }
		    if (message.status == "ON_REMOVED" && message.url == _updataUrl2) {
		       	console.log("安装完成二");
		       	$("#partInfo2").html("当前已是最新版本");
				$("#partInfo2").css("color","#999999");
				$("#comQues1").attr("status","0");//1-有更新、0-已是最新
		    }
		    if (message.status == "ON_REMOVED" && message.url == _updataUrl3) {
		       	console.log("安装完成三");
		       	$("#partInfo3").html("当前已是最新版本");
				$("#partInfo3").css("color","#999999");
				$("#comQues2").attr("status","0");//1-有更新、0-已是最新
		    }
		});
		buttonInit();
		getEveryProp();
		getCurVersion();
		getDeviceInfo();
	}
};

app.initialize();

function buttonInit(){
	$(".comQuesItem").unbind("itemClick").bind("itemClick", function() {
		var _fIndex = $(".comQuesItem").index($(this));
		_curParentIndex = _fIndex;
		var _curStatus = $(".comQuesItem:eq("+_fIndex+")").attr("status");
		console.log(_curStatus);
		if (_curStatus == 1) {
			var _curappId = $(".comQuesItem:eq("+_fIndex+")").attr("appid");
			var _curapkUrl = $(".comQuesItem:eq("+_fIndex+")").attr("urlEx");
			var _curMd5 = $(".comQuesItem:eq("+_fIndex+")").attr("MD5");
			if (_fIndex == 0) {
				download(_curapkUrl,_curMd5,"com.tianci.movieplatform","酷开系统",_curappId);
			} else if(_fIndex == 1){
				download(_curapkUrl,_curMd5,"com.tianci.appstore","应用圈",_curappId);
			} else if(_fIndex == 2){
				download(_curapkUrl,_curMd5,"com.coocaa.mall","购物商城",_curappId);
			}
		} else{
			$("#firstPage").css("display","none");
			$("#secondPage").css("display","block");
			if (_fIndex == 0) {
				$("#coocaa").css("display","block");
			} else if(_fIndex == 1){
				$("#appstore").css("display","block");
			} else if(_fIndex == 2){
				$("#mall").css("display","block");
			}
		}
	});
}

function download(url,md5,apkName,name,id) {
	console.log(url+"--"+md5+"--"+apkName+"--"+name+"--"+id);
    coocaaosapi.createDownloadTask(url, md5, name, apkName, id, "", "",function(message) {console.log(message);},function(error) {console.log(error);});
}

function backButtonFunc(){
	if(document.getElementById("secondPage").style.display == "block"){
		$("#secondPage").css("display","none");
		$(".none").siblings().css("display","none");
		$("#firstPage").css("display","block");
	}else{
		navigator.app.exitApp();
	}
}
function getCurVersion(){
	var a = '{ "pkgList": ["com.tianci.movieplatform"] }';
	var b = '{ "pkgList": ["com.tianci.appstore"] }';
	var c = '{ "pkgList": ["com.coocaa.mall"] }';
    coocaaosapi.getAppInfo(a, function(message) {
        console.log("getAppInfo====" + message);
        var b1 = "com.tianci.movieplatform";
        movieVersion = JSON.parse(message)[b1].versionName;
        _movieVcode = JSON.parse(message)[b1].versionCode;
        $("#partVersion1").html("当前版本：V"+movieVersion);
        $("#asVersion").html("版本号：V"+movieVersion);
    }, function(error) {console.log(error)});
    coocaaosapi.getAppInfo(b, function(message) {
        console.log("getAppInfo====" + message);
        var b2 = "com.tianci.appstore";
        storeVersion = JSON.parse(message)[b2].versionName;
        _storeVcode = JSON.parse(message)[b2].versionCode;
        $("#partVersion2").html("当前版本：V"+storeVersion);
        $("#asVersion2").html("版本号：V"+storeVersion);
    }, function(error) {console.log(error)});
    coocaaosapi.getAppInfo(c, function(message) {
        console.log("getAppInfo====" + message);
        var b3 = "com.coocaa.mall";
        mallVersion = JSON.parse(message)[b3].versionName;
        _mallVcode = JSON.parse(message)[b3].versionCode;
        $("#partVersion3").html("当前版本：V"+mallVersion);
        $("#asVersion3").html("版本号：V"+mallVersion);
    }, function(error) {console.log(error)});
}
function getDeviceInfo() {
	coocaaosapi.getDeviceInfo(function(message) {
		console.log("设备信息" + JSON.stringify(message));
		_mac = message.mac;
		_chip = message.chip;
		_model = message.model;
		if(message.emmcid == "" || message.emmcid == null) {
			_emmcCID = "123456";
		} else {
			_emmcCID = message.emmcid;
		}
		_udid = message.activeid;
		_version = message.version;
		_cVersion = message.version.replace(/\./g, "");
		_cSize = message.panel;
		_cSdk = message.androidsdk;
		_cBrand = message.brand;
		
		getAppstoreInfo(1,0,"com.tianci.movieplatform",_movieVcode);
		getAppstoreInfo(2,7,"com.tianci.appstore",_storeVcode);
		getAppstoreInfo(3,10,"com.coocaa.mall",_mallVcode);
	}, function(error) {
		console.log("获取设备信息出现异常。");
	});
}
function getEveryProp(){
	coocaaosapi.getPropertiesValue("persist.sys.country",function(message) {
		_country = message.propertiesValue;
		console.log(_country);
	}, function(error) {console.log(error);});
	coocaaosapi.getPropertiesValue("persist.sys.custom_id",function(message) {
		console.log(JSON.stringify(message));
		_customId = message.propertiesValue;
		console.log(_customId);
	}, function(error) {console.log(error);});
	coocaaosapi.getPropertiesValue("persist.sys.language",function(message) {
		console.log(JSON.stringify(message));
		_language = message.propertiesValue;
		console.log(_language);
	}, function(error) {console.log(error);});
	coocaaosapi.getWebViewSDKInfo(function(message) {
		_webViewVersion = message.versionCode;
		console.log(_webViewVersion);
    },function(error) { console.log(error);})
}
function getAppstoreInfo(num,appid,pkgname,cappversion){
	var tokenStr = appid+_model+_chip+cappversion+pkgname;
	var _tokenMd5 = md5(tokenStr);
	console.log(_model+"--"+_chip+"--"+_mac+"--"+_udid+"--"+_cVersion);
	console.log(_cSize+"--"+_cSdk+"--"+_cBrand+"--"+_emmcCID+"--"+cappversion);
	console.log(_language+"--"+_country+"--"+_customId+"--"+_cAppVersion+"--"+pkgname);
	console.log(_tokenMd5);
	var header = {
		"cModel" : _model,
		"cChip" : _chip,
		"MAC" : _mac,
		"cUDID" : _udid,
		"cTcVersion" : _cVersion,
		"cSize" : _cSize,
		"aSdk" : _cSdk,
		"cBrand" : _cBrand,
		"cEmmcCID" : _emmcCID,
		"language" : _language,
		"country" : _country,
		"cCustomId" : _customId,
		"cAppVersion" : cappversion,
		"cFMode" : "Default",
		"Resolution" : "1280x720",
		"cPattern" : "normal",
		"aChannel" : "Coocaa",
		"headerVersion" : "7",
		"cPkg" : pkgname,
		"token" : _tokenMd5
	};
	$.ajax({
		url : _testurl+ "/uums/web/"+appid+"/getUpdateInfo",
		type : "get",
		dataType : 'json',
		data : header,
		success : function(data) {
			console.log(num);
			console.log(JSON.stringify(data));
			if (data.result == 1) {
				var _icon = data.data.icon;
				var _info = data.data.updateInfo;
				var _policyId = data.data.policyId;
				var _apkId = data.data.apkId;
				console.log(_icon+"--"+_policyId+"--"+_apkId);
				getUpdataInfo(num,_icon,_info,_apkId,_policyId);
			}
		}
	});
}
function getUpdataInfo(num,icon,info,apkid,policyid){
	$.ajax({
		url : _testurl+ "/uums/web/getDownloadInfo?apkId="+apkid+"&policyId="+policyid,
		type : "get",
		dataType : 'json',
		success : function(data) {
			console.log(JSON.stringify(data));
			if (data.result == 1) {
				if (num == 1) {
					_updataUrl1 = data.data.urlEx;
					$("#firstIcon1").attr("src",icon);
					$("#asIcon1").attr("src",icon);
					$("#partInfo1").html("有新的版本待升级");
					$("#transInfo").html(info);
					$("#partInfo1").css("color","#FD4E00");
					$("#comQues0").attr("status","1");//1-有更新
					$("#comQues0").attr("appid",data.data.id);
					$("#comQues0").attr("urlEx",data.data.urlEx);
					$("#comQues0").attr("MD5",data.data.MD5);
				} else if(num == 2){
					_updataUrl2 = data.data.urlEx;
					$("#firstIcon2").attr("src",icon);
					$("#asIcon2").attr("src",icon);
					$("#partInfo2").html("有新的版本待升级");
					$("#transInfo2").html(info);
					$("#partInfo2").css("color","#FD4E00");
					$("#comQues1").attr("status","1");//1-有更新
					$("#comQues1").attr("appid",data.data.id);
					$("#comQues1").attr("urlEx",data.data.urlEx);
					$("#comQues1").attr("MD5",data.data.MD5);
				}else if(num == 3){
					_updataUrl3 = data.data.urlEx;
					$("#firstIcon3").attr("src",icon);
					$("#asIcon3").attr("src",icon);
					$("#partInfo3").html("有新的版本待升级");
					$("#transInfo3").html(info);
					$("#partInfo3").css("color","#FD4E00");
					$("#comQues2").attr("status","1");//1-有更新
					$("#comQues2").attr("appid",data.data.id);
					$("#comQues2").attr("urlEx",data.data.urlEx);
					$("#comQues2").attr("MD5",data.data.MD5);
				}
			}
		}
	});
}
function md5(string) {
	function md5_RotateLeft(lValue, iShiftBits) {
		return(lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	}
	function md5_AddUnsigned(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if(lX4 & lY4) {
			return(lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if(lX4 | lY4) {
			if(lResult & 0x40000000) {
				return(lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return(lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return(lResult ^ lX8 ^ lY8);
		}
	}

	function md5_F(x, y, z) {
		return(x & y) | ((~x) & z);
	}

	function md5_G(x, y, z) {
		return(x & z) | (y & (~z));
	}

	function md5_H(x, y, z) {
		return(x ^ y ^ z);
	}

	function md5_I(x, y, z) {
		return(y ^ (x | (~z)));
	}

	function md5_FF(a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
		return md5_AddUnsigned(md5_RotateLeft(a, s), b);
	};

	function md5_GG(a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
		return md5_AddUnsigned(md5_RotateLeft(a, s), b);
	};

	function md5_HH(a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
		return md5_AddUnsigned(md5_RotateLeft(a, s), b);
	};

	function md5_II(a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
		return md5_AddUnsigned(md5_RotateLeft(a, s), b);
	};

	function md5_ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while(lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	function md5_WordToHex(lValue) {
		var WordToHexValue = "",
			WordToHexValue_temp = "",
			lByte, lCount;
		for(lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
		}
		return WordToHexValue;
	};

	function md5_Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for(var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if(c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	};
	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7,
		S12 = 12,
		S13 = 17,
		S14 = 22;
	var S21 = 5,
		S22 = 9,
		S23 = 14,
		S24 = 20;
	var S31 = 4,
		S32 = 11,
		S33 = 16,
		S34 = 23;
	var S41 = 6,
		S42 = 10,
		S43 = 15,
		S44 = 21;
	string = md5_Utf8Encode(string);
	x = md5_ConvertToWordArray(string);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;
	for(k = 0; k < x.length; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = md5_AddUnsigned(a, AA);
		b = md5_AddUnsigned(b, BB);
		c = md5_AddUnsigned(c, CC);
		d = md5_AddUnsigned(d, DD);
	}
	return(md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
}