var _theme = "";
var app = {
	canonical_uri: function(src, base_path) {
		var root_page = /^[^?#]*\//.exec(location.href)[0],
			root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
			absolute_regex = /^\w+\:\/\//;
		if(/^\/\/\/?/.test(src)) {
			src = location.protocol + src;
		}
		else if(!absolute_regex.test(src) && src.charAt(0) != "/") {
			src = (base_path || "") + src;
		}
		return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src);
	},

	rel_html_imgpath: function(iconurl) {
		console.log(app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1')));
		return app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1'));
	},

	initialize: function() {
		this.bindEvents();
		_theme = getQueryString("theme");
		console.log(_theme);
		if (_theme == "light") {
			$("#mainPage").css("color","#505050");
			$("#maintitle").css("color","#333333");
		} else{
			$("#mainPage").css("color","#999999");
			$("#maintitle").css("color","#CCCCCC");
		}
		map = new coocaakeymap($(".coocaa_btn"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("backbutton", this.handleBackButton, false);
    	document.addEventListener("backbuttondown", this.handleBackButtonDown, false);
		document.addEventListener('resume', this.onResume, false);
	},
	handleBackButton: function() {
		console.log("Back Button Pressed!");
	},
	handleBackButtonDown: function() {
		console.log("Back Button Pressed!");
		navigator.app.exitApp();
	},
	onResume: function(){
	  	console.log("Page onResume!");
	},
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
		app.triggleButton();
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
		console.log('Received Event: ' + id);
	},
	triggleButton: function() {
		cordova.require("com.coocaaosapi");
				
	}
};

app.initialize();

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}