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
		getDeviceInfo();
	}
};

app.initialize();

function getDeviceInfo() {
	coocaaosapi.getDeviceInfo(function(message) {
		console.log("设备信息" + JSON.stringify(message));
		_mac = message.mac;
		_chip = message.chip;
		_model = message.model;
		_activeid = message.activeid;
		drawQrcode(_chip,_model,_mac,_activeid,"fbQrcode",260);
		drawQrcode(_chip,_model,_mac,_activeid,"otherQrcode",390);
	}, function(error) {
		console.log("获取设备信息出现异常。");
	});
}
function drawQrcode(chip,model,mac,activeid,id,width){
	var qrcode = new QRCode(document.getElementById(id), {
		width: width,
		height: width
	});
	qrcode.makeCode("https://webapp.skysrt.com/cc7.0/guide2/dist/?chip=" + chip + "&model=" + model + "&mac=" + mac + "&activeid=" + activeid);
}
function backButtonFunc(){
	if(document.getElementById("thirdPage").style.display == "block"){
		$("#thirdPage").css("display","none");
		$('.fbdialog').siblings().css('display', 'none');
		clearTimeout(tt1);
		clearTimeout(tt2);
		clearTimeout(tt3);
		map = new coocaakeymap($(".coocaa_btn2"), document.getElementById("fbSubmit"), "btn-focus", function() {}, function(val) {}, function(obj) {});
	}else{
		if(document.getElementById("secondPage").style.display == "block"){
			if (document.getElementById("conAnsPage").style.display == "block") {
				console.log(_toSecondPage);
				$("#conAnsBox").stop(true, true).animate({top: 0}, {duration: 0,easing: "swing"});
				if (_toSecondPage == 0) {
					console.log("-------------------->4");
					$("#conAnsPage").css("display","none");
					$("#secondPage").css("display","none");
					$("#mainPage").css("display","block");
					map = new coocaakeymap($(".coocaa_btn"), document.getElementsByClassName("comQuesItem")[_curQuesNum], "btn-focus", function() {}, function(val) {}, function(obj) {});
				} else{
					console.log("-------------------->5");
					$("#conAnsPage").css("display","none");
					$("#allQuesPage").css("display","block");
					map = new coocaakeymap($(".coocaa_btn3"), document.getElementsByClassName("allQueItem")[_curQuesNum], "btn-focus", function() {}, function(val) {}, function(obj) {});
				}
			} else{
				console.log("-------------------->6");
				if (document.getElementById("allQuesPage").style.display == "block") {
					console.log("-------------------->6");
					$(".none").siblings().css("display","none");
					$("#secondPage").css("display","none");
					$("#mainPage").css("display","block");
					map = new coocaakeymap($(".coocaa_btn"), document.getElementsByClassName("allQues")[_partNum], "btn-focus", function() {}, function(val) {}, function(obj) {});
				}
				if (document.getElementById("feedBackPage").style.display == "block") {
					console.log("-------------------->7");
					if(document.getElementById("keyBox").style.display == "block"){
						console.log("-------------------->9");
						$("#keyBox").css("display","none");
						map = new coocaakeymap($(".coocaa_btn2"), document.getElementById("phoneOrQQ"), "btn-focus", function() {}, function(val) {}, function(obj) {});
					}else{
						_fbItemClick = 0;
						console.log("-------------------->8");
						$(".none").siblings().css("display","none");
						$("#secondPage").css("display","none");
						$("#mainPage").css("display","block");
						console.log(_curFbCategory);
						map = new coocaakeymap($(".coocaa_btn"), document.getElementsByClassName("feedBacks")[_curFbCategory], "btn-focus", function() {}, function(val) {}, function(obj) {});
						$(".feedBacks:eq("+_curFbCategory+")").trigger("focus");
					}
				}
				if (document.getElementById("otherFeedBackPage").style.display == "block") {
					console.log("-------------------->6");
					$(".none").siblings().css("display","none");
					$("#secondPage").css("display","none");
					$("#mainPage").css("display","block");
					map = new coocaakeymap($(".coocaa_btn"), document.getElementById("feedBack6"), "btn-focus", function() {}, function(val) {}, function(obj) {});
				}
			}
		}else{
			console.log("-------------------->7");
			navigator.app.exitApp();
		}
	}
}
