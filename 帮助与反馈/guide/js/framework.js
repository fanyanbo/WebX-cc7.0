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
		//_czc.push(["页面曝光","","",1,1,1]);
		console.log("---------------->deviceready");
//		map = new coocaakeymap($(".coocaa_btn"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
	},
	receivedEvent: function(id) {
		console.log(id);
	},
	handleBackButtonDown: function() {
		console.log("-------------->handleBackButtonDown");
		backButtonFunc();
		//navigator.app.exitApp();
	},
	triggleButton: function() {
		cordova.require("com.coocaaosapi");
	}
};

app.initialize();

function backButtonFunc(){
	if (document.getElementById("secondPage").style.display == "block") {
		$("#mainPage").css("display","block");
		$("#secondPage").css("display","none");
		console.log(_curQuesNum);
		map = new coocaakeymap($(".coocaa_btn"), document.getElementsByClassName("optionenum")[_curQuesNum], "btn-focus", function() {}, function(val) {}, function(obj) {});
	} else{
		navigator.app.exitApp();
	}
}
