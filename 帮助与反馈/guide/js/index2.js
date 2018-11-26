var _partNum = 0;//第几个Tab
var _curQuesNum = 0;//当前第几个问题
var _curQuesId = "";//当前点击问题的id
var _curFbCategory = 0;//当前点击的第几个类别
var _feedBackArr = new Array();
var _fbItemClick = 0;//问题反馈勾选的个数
var _phone = "";
var _allDataObj=null;
var _toSecondPage = 0;//0表示从常见问题页进具体问题解答页、1表示从全部问题进具体解答页
//var _datadbUrl = "http://172.20.133.47:3010";
var _datadbUrl = "https://webx.coocaa.com/hfdplatform";
var _chip = "";
var _model = "";
var _mac = "";
var _activeid = "";
var categoryArr = ["影视播放","会员支付","酷开账号","应用下载与安装","系统设置"];
var tt1 = "";
var tt2 = "";
var tt3 = "";

$(function() {
//	localStorage.clear();
	getJsonData();
	buttonInit();
	$("#conItem1").css("display","block");
	$(".line:eq(0)").css("display","block");
	$("#commonQuesTab").css("color","#007FF0");
});

function buttonInit(){
	$(".tabItem").unbind("focus").bind("focus", function() {
		var _fIndex = $(".tabItem").index($(this));
		$(".conItems").siblings().css("display","none");
		$(".conItems:eq("+_fIndex+")").css("display","block");
		$(".tabItem").siblings().css("background-color","transparent");
		$(".tabItem:eq("+_fIndex+")").css("background-color","#007FF0");
		$(".tabItem:eq("+_fIndex+")").css("color","#FFFFFF");
		$(".line").css("display","none");
	});
	$(".tabItem").unbind("blur").bind("blur", function() {
		var _fIndex = $(".tabItem").index($(this));
		$(".line:eq("+_fIndex+")").css("display","block");
		$(".tabItem:eq("+_fIndex+")").css("color","#999999");
	});
	$(".allQues").unbind("focus").bind("focus", function() {
		$("#allQuesTab").css("background-color","transparent");
		$("#allQuesTab").css("color","#007FF0");
		var _fIndex = $(".allQues").index($(this));
		console.log(_fIndex);
		var myScrollTopValue = _fIndex * 440*(-1);
		console.log(_fIndex+";"+myScrollTopValue);
		if (_fIndex<2) {
			$("#conItem2Box").stop(true, true).animate({left: myScrollTopValue}, {duration: 0,easing: "swing"});
		}
	});
	$(".allQues").unbind("itemClick").bind("itemClick", function() {
		var _fIndex = $(".allQues").index($(this));
		_partNum = _fIndex;
		$("#quesListTitle").html($(".allText1")[_fIndex].innerHTML);
		allQuesPageShow(_fIndex,_allDataObj[1].category2[_fIndex]);
	});
	$(".feedBacks").unbind("focus").bind("focus", function() {
		$("#feedBackTab").css("background-color","transparent");
		$("#feedBackTab").css("color","#007FF0");
		$("#line3").css("display","block");
	});
	$(".feedBacks").unbind("itemClick").bind("itemClick", function() {
		var _fIndex = $(".feedBacks").index($(this));
		console.log(_fIndex);
		_curFbCategory = _fIndex;
		if (_fIndex == 5) {
			secondPageShow("#otherFeedBackPage");
		} else{
			feedBackPageShow(_allDataObj[2].data[_fIndex]);
		}
	});
	$("#submitItem2,#submitItem3").unbind("itemClick").bind("itemClick", function() {
		console.log("问题已解决。"+_partNum+"--"+_curQuesNum+"--"+_curQuesId);
		var categoryName = "";
		console.log(document.getElementById("conItem2").style.display);
		if (document.getElementById("conItem2").style.display == "block") {
			categoryName = categoryArr[_partNum];
		} else{
			categoryName = "常见问题";
		}
		var otext = document.getElementById("conAnsTitle").innerHTML;
		var mmmm = $(this).attr("id");
		console.log(mmmm);
		if (mmmm == "submitItem2") {
			howToSendData(_curQuesId,categoryName,otext,1);
		} else{
			howToSendData(_curQuesId,categoryName,otext,0);
		}
	});
	$("#otherQuesFeed,#submitItem7").unbind("itemClick").bind("itemClick", function() {
		$("#mainPage").css("display","block");
		$("#secondPage").css("display","none");
		$("#allQuesPage").css("display","none");
		$("#conAnsPage").css("display","none");
		$("#line1").css("display","none");
		$("#line2").css("display","none");
		$("#commonQuesTab").css("color","#cccccc");
		$("#allQuesTab").css("color","#cccccc");
		$("#feedBackTab").trigger("focus");
		map = new coocaakeymap($(".coocaa_btn"), document.getElementById("feedBack1"), "btn-focus", function() {}, function(val) {}, function(obj) {});
		$("#feedBack1").trigger("focus");
	});
	$("#phoneOrQQ").unbind("itemClick").bind("itemClick", function() {
		$("#keyBox").css("display","block");
		$("#feedBackBox").stop(true, true).animate({scrollTop: 520}, {duration: 0,easing: "swing"});
		map = new coocaakeymap($(".coocaa_btn2"), document.getElementById("phoneOrQQ"), "btn-focus", function() {}, function(val) {}, function(obj) {});
	});
	$("#fbSubmit").unbind("itemClick").bind("itemClick", function() {
		console.log(_fbItemClick);
		if (_fbItemClick <1) {
			console.log("未选择具体问题时的提交");
			document.getElementById("errorInfo").style.display = "block";
			setTimeout("document.getElementById('errorInfo').style.display = 'none';",3000);
		}else{
			console.log("选择了具体问题时的提交");
			var nowTime = new Date().getTime();
		    var clickTime = $(this).attr("ctime");
		    if( clickTime != 'undefined' && (nowTime - clickTime < 10000)){
		        console.log('操作过于频繁，稍后再试');
		        return false;
		    }else{
		        $(this).attr("ctime",nowTime);
		        $("#thirdPage").css("display","block");
				$('.fbdialog').siblings().css('display', 'none');
				var _title = "";
				for (var i=0;i<$(".labelText").length;i++) {
					if ($(".labelText")[i].style.display == "block") {
						console.log($(".fbQuetext")[i].innerHTML);
						_title += $(".fbQuetext")[i].innerHTML+";";
					}
				}
				var _contact = document.getElementById("phoneOrQQ").value;
				console.log(_curFbCategory+"--"+_contact);
				console.log(_title);
				sendDetailData(_curFbCategory,_title,_contact);
		    }
		}
	});
	$("#keyBox .coocaa_btn2:not(#sub_mobile)").bind("itemClick", function() {
        var txt = $(this).html();
        console.log(txt);
        _phone = $("#phoneOrQQ").val();
        var tphone = _phone;
        if (txt == "删除" && tphone.length >= 0) {
            tphone = tphone.substring(0, tphone.length - 1);
        } else {
            if(tphone.length<11){
        		tphone = tphone + txt;
        	}else{
        		console.log("提示超出位数");
        		tphone = tphone;
        	}
        }
        $("#phoneOrQQ").val(tphone);
    });
    $("#sub_mobile").bind('itemClick', function(event) {
       	$("#keyBox").hide();
       	map = new coocaakeymap($(".coocaa_btn2"), document.getElementById("phoneOrQQ"), "btn-focus", function() {}, function(val) {}, function(obj) {});
    });
    $("#submitItem5").bind('itemClick', function(event) {
    	var arr1 = $("#submitItem5").attr("arr1");
    	var arr2 = $("#submitItem5").attr("arr2");
    	showThumbStatus(_allDataObj[1].category2[arr1][arr2].quesId);
    	conAnsPageShow(_allDataObj[1].category2[arr1][arr2]);
    });
    $("#submitItem6").bind('itemClick', function(event) {
    	var arr1 = $("#submitItem6").attr("arr1");
    	var arr2 = $("#submitItem6").attr("arr2");
    	showThumbStatus(_allDataObj[1].category2[arr1][arr2].quesId);
    	conAnsPageShow(_allDataObj[1].category2[arr1][arr2]);
    });
    $("#fbResultSuccess").bind('itemClick', function(event) {
    	$("#fbResultSuccess").css("display","none");
    	$("#thirdPage").css("display","none");
    	map = new coocaakeymap($(".coocaa_btn2"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
    });
    $("#fbResultFail").bind('itemClick', function(event) {
    	$("#fbResultFail").css("display","none");
    	$("#thirdPage").css("display","none");
    	map = new coocaakeymap($(".coocaa_btn2"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
    });
    $("#otherQrcodeBox").bind('itemClick', function(event) {
    	$("#otherFeedBackPage").css("display","none");
    	$("#secondPage").css("display","none");
		$("#mainPage").css("display","block");
    	map = new coocaakeymap($(".coocaa_btn"), document.getElementById("feedBack6"), "btn-focus", function() {}, function(val) {}, function(obj) {});
    });
}

function buttonInitAfter(){
	$(".conAnsItem").unbind("focus").bind("focus", function() {
		var _fIndex = $(".conAnsItem").index($(this));
		var _offsetTop = $(".conAnsItem")[_fIndex].offsetTop;
		var _offsetHeight = document.getElementById("conAnsBox").offsetHeight - 1080;
		console.log(_fIndex+"--"+_offsetTop+";"+_offsetHeight);
		var myScrollTopValue = 0;
		if (_fIndex == 0) {
			myScrollTopValue = 0;
			$("#conAnsPoint").css("display","block");
		} else{
			if (_offsetTop<_offsetHeight) {
				myScrollTopValue = _offsetTop;
				$("#conAnsPoint").css("display","block");
			} else{
				myScrollTopValue = _offsetHeight;
				$("#conAnsPoint").css("display","none");
			}
		}
		$("#conAnsBox").stop(true, true).animate({top: myScrollTopValue*(-1)}, {duration: 0,easing: "swing"});
	});
	$(".comQuesItem").unbind("focus").bind("focus", function() {
		$("#commonQuesTab").css("background-color","transparent");
		$("#commonQuesTab").css("color","#007FF0");
		var _fIndex = $(".comQuesItem").index($(this));
		var _eachheight = $(".comQuesItem")[_fIndex].offsetHeight;
		var myScrollTopValue = _fIndex * _eachheight;
		console.log(_fIndex+"---"+_eachheight+"--"+myScrollTopValue);
		$("#conItem1").stop(true, true).animate({scrollTop: myScrollTopValue}, {duration: 0,easing: "swing"});
	});
	$(".comQuesItem").unbind("itemClick").bind("itemClick", function() {
		_toSecondPage = 0;
		var _fIndex = $(".comQuesItem").index($(this));
		_curQuesNum = _fIndex;
		_curQuesId = $(".comQuesItem:eq("+_fIndex+")").attr("id");
		console.log(_curQuesNum+"--"+_curQuesId);
		$("#secondPage").css("display","block");
		$("#mainPage").css("display","none");
		$("#conAnsPage").css("display","block");
		showThumbStatus(_allDataObj[0].data[_fIndex].quesId);
		conAnsPageShow(_allDataObj[0].data[_fIndex]);
	});
	$(".allQueItem").unbind("focus").bind("focus", function() {
		var _fIndex = $(".allQueItem").index($(this));
		var _eachheight = $(".allQueItem")[_fIndex].offsetHeight;
		var myScrollTopValue = _fIndex * _eachheight;
		console.log(_fIndex+"---"+_eachheight+"--"+myScrollTopValue);
		$("#quesListBox").stop(true, true).animate({scrollTop: myScrollTopValue}, {duration: 0,easing: "swing"});
	});
	$(".allQueItem").unbind("itemClick").bind("itemClick", function() {
		_toSecondPage = 1;
		var _fIndex = $(".allQueItem").index($(this));
		_curQuesNum = _fIndex;
		var _arr1 = $(this).attr("arr1");
		console.log(_arr1+"--"+_fIndex);
		$("#conAnsPage").css("display","block");
		$("#allQuesPage").css("display","none");
		map = new coocaakeymap($(".coocaa_btn3"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
		console.log(_allDataObj[1].category2[_arr1][_fIndex]);
		showThumbStatus(_allDataObj[1].category2[_arr1][_fIndex].quesId);
		conAnsPageShow(_allDataObj[1].category2[_arr1][_fIndex]);
	});
	$(".fbQueItem").unbind("focus").bind("focus", function() {
		var _fIndex = $(".fbQueItem").index($(this));
		var _eachheight = $(".fbQueItem")[_fIndex].offsetHeight;
		var myScrollTopValue = _fIndex * _eachheight;
		console.log(_fIndex+"---"+_eachheight+"--"+myScrollTopValue);
		$("#feedBackListBox").stop(true, true).animate({scrollTop: myScrollTopValue}, {duration: 0,easing: "swing"});
	});
	$(".fbQueItem").unbind("itemClick").bind("itemClick", function() {
		var _fIndex = $(".fbQueItem").index($(this));
		console.log($(".labelText")[_fIndex].style.display);
		if ($(".labelText")[_fIndex].style.display == "block") {
			$(".labelText")[_fIndex].style.display = "none";
			_fbItemClick--;
		} else{
			$(".labelText")[_fIndex].style.display = "block";
			_fbItemClick++;
		}
	});
}
//获取json数据
function getJsonData(){
	$.getJSON('js/data2.json',function(data){
		console.log(data);
		_allDataObj = data;
		commonQuesList(_allDataObj[0].data);
	});
}
function commonQuesList(arr){
	console.log(arr);
	document.getElementById("conItem1").innerHTML = "";
	for (var i=0;i<arr.length;i++) {
		var _div = null;
		if (i==0) {
			_div = '<div id="'+arr[i].quesId+'" class="coocaa_btn comQuesItem ellipsis" upTarget="#commonQuesTab" leftTarget="#'+arr[i].quesId+'" rightTarget="#'+arr[i].quesId+'">'+arr[0].name+'</div>';
		}else{
			_div = '<div id="'+arr[i].quesId+'" class="coocaa_btn comQuesItem ellipsis" leftTarget="#'+arr[i].quesId+'" rightTarget="#'+arr[i].quesId+'">'+arr[i].name+'</div>';
		}
		$("#conItem1").append(_div);
	}
	buttonInitAfter();
	map = new coocaakeymap($(".coocaa_btn"), document.getElementById("B6"), "btn-focus", function() {}, function(val) {}, function(obj) {});
	$("#B6").trigger("focus");
}
function conAnsPageShow(obj){
	console.log(JSON.stringify(obj));
	$("#conAnsBox").stop(true, true).animate({top: 0}, {duration: 0,easing: "swing"});
	document.getElementById("changeBox1").innerHTML = "";
	$("#conAnsTitle").html(obj.name);
	for (var i=0;i<obj.answer.length;i++) {
		var insertChild = '<div class="quesPoint coocaa_btn3 conAnsItem">'+obj.answer[i].detail+'</div><img class="conAnsImg" src="'+obj.answer[i].img+'"/>';
		$("#changeBox1").append(insertChild);
	}
	var arr1 = obj.related[0][0];
	var arr2 = obj.related[0][1];
	var arr3 = obj.related[1][0];
	var arr4 = obj.related[1][1];
	$("#submitItem5").html(_allDataObj[1].category2[arr1][arr2].name);
	$("#submitItem6").html(_allDataObj[1].category2[arr3][arr4].name);
	$("#submitItem5").attr("arr1",arr1);
	$("#submitItem5").attr("arr2",arr2);
	$("#submitItem6").attr("arr1",arr3);
	$("#submitItem6").attr("arr2",arr4);
	
	buttonInitAfter();
	map = new coocaakeymap($(".coocaa_btn3"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
}

function allQuesPageShow(index,arr){
	console.log(arr);
	$("#secondPage").css("display","block");
	$("#mainPage").css("display","none");
	$("#allQuesPage").css("display","block");
	document.getElementById("quesListBox").innerHTML = "";
	for (var i=0; i<arr.length; i++) {
		var _div = null;
		if (i==0) {
			_div = '<div id="'+arr[i].quesId+'" arr1="'+index+'" class="coocaa_btn3 allQueItem ellipsis" upTarget="#'+arr[i].quesId+'"+ leftTarget="#'+arr[i].quesId+'" rightTarget="#'+arr[i].quesId+'">'+arr[0].name+'</div>';
		} else{
			_div = '<div id="'+arr[i].quesId+'" arr1="'+index+'" class="coocaa_btn3 allQueItem ellipsis" leftTarget="#'+arr[i].quesId+'" rightTarget="#'+arr[i].quesId+'">'+arr[i].name+'</div>';
		}
		$("#quesListBox").append(_div);
	}
	buttonInitAfter();
	map = new coocaakeymap($(".coocaa_btn3"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
	$("#quesListBox").stop(true, true).animate({scrollTop: 0}, {duration: 0,easing: "swing"});
}

function feedBackPageShow(obj){
	$("#secondPage").css("display","block");
	$("#mainPage").css("display","none");
	$("#feedBackPage").css("display","block");
	document.getElementById("feedBackListBox").innerHTML = "";
	console.log(obj.situation);
	$("#feedBackTitle").html(obj.name);
	$("#feedBackTitle2").html(obj.title);
	for (var i=0; i<obj.situation.length; i++) {
		var _div = null;
		if (i==0) {
			_div = '<div id="fbQues'+i+'" class="coocaa_btn2 fbQueItem" leftTarget="#fbQues'+i+'" rightTarget="#fbQues'+i+'"><div class="fbQuetext ellipsis">'+obj.situation[i]+'</div><div class="labelBox"><div class="labelText"></div></div></div>';
		} else{
			_div = '<div id="fbQues'+i+'" class="coocaa_btn2 fbQueItem" leftTarget="#fbQues'+i+'" rightTarget="#fbQues'+i+'"><div class="fbQuetext ellipsis">'+obj.situation[i]+'</div><div class="labelBox"><div class="labelText"></div></div></div>';
		}
		$("#feedBackListBox").append(_div);
	}
	buttonInitAfter();
	map = new coocaakeymap($(".coocaa_btn2"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
	$("#fbQues0").trigger("focus");
	
}
function dialogHide(){
	$("#thirdPage").css("display","none");
	map = new coocaakeymap($(".coocaa_btn2"), document.getElementById("fbSubmit"), "btn-focus", function() {}, function(val) {}, function(obj) {});
}
function secondPageShow(obj){
	$("#secondPage").css("display","block");
	$("#mainPage").css("display","none");
	$(obj).css("display","block");
	map = new coocaakeymap($(".coocaa_btn2"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
}

function sendDetailData(ocategory,otitle,ocontact){
	console.log(_chip+"--"+_model+"--"+_mac+"--"+_activeid);
	console.log(ocategory+"--"+otitle+"--"+ocontact);
	var ajaxTimeoutOne = $.ajax({
		type: "post",
		async: true,
		timeout: 5000,
		dataType: 'json',
		url: _datadbUrl + "/help/addFeedback",
		data: {
			"chip": _chip,
			"model": _model,
			"mac": _mac,
			"activeid": _activeid,
			"category": ocategory,
			"title": otitle,
			"content": "",
			"contact": ocontact
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			var sendResult = data.errcode;
			if (sendResult == 0) {
				console.log("提交成功");
				$("#fbResultSuccess").css("display","block");
				map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("fbResultFail"), "btn-focus", function() {}, function(val) {}, function(obj) {});
				tt1 = setTimeout(dialogHide,5000);
			} else{
				console.log("提交失败");
				$("#fbResultFail").css("display","block");
				map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("fbResultFail"), "btn-focus", function() {}, function(val) {}, function(obj) {});
				tt2 = setTimeout(dialogHide,20000);
			}
		},
		error: function() {
			console.log('获取数据失败');
			$("#fbResultFail").css("display","block");
			map = new coocaakeymap($(".coocaa_btn3"), document.getElementById("fbResultFail"), "btn-focus", function() {}, function(val) {}, function(obj) {});
			tt3 = setTimeout(dialogHide,20000);
		},
		complete: function(XMLHttpRequest, status) {
			console.log("-------------complete------------------" + status);
			if(status == 'timeout') {　　　　　
				ajaxTimeoutOne.abort();　　　　
			}
		}
	});
}

function howToSendData(quesid,categoryName,otext,state){
	var _id = quesid + state;
	console.log(_id);
	if(state == 1){
		console.log("点击的是已解决");
		//判断是否是可以被点击
		var isFirst1 = localStorage.getItem(_id);
		var id2 = _id.substr(0, _id.length - 1) + 0;
		var isFirst2 = localStorage.getItem(id2);
		console.log(_id+"--"+id2);
		console.log(isFirst1+"--"+isFirst2);
		if(isFirst1 == null&&isFirst2==null){
			console.log("第一次加载的时候点击了已解决");
			addData(categoryName,otext,1,0);
			localStorage.setItem(_id, "1");
			localStorage.setItem(id2, "0");
			$("#thumbone").attr("src","images/help/2-3.png");
			$("#thumbtwo").attr("src","images/help/2-2.png");
		}else{
			if(isFirst1 == 1&&isFirst2!=1){
				console.log("点击了已解决的情况下点击了已解决");
				updataData(categoryName,otext,0,0);
				localStorage.setItem(_id, "0");
				localStorage.setItem(id2, "0");
				$("#thumbone").attr("src","images/help/2-4.png");
				$("#thumbtwo").attr("src","images/help/2-2.png");
			}else if(isFirst1 != 1){
				console.log("点击未解决的情况下点击了已解决");
				updataData(categoryName,otext,1,0);
				localStorage.setItem(_id, "1");
				localStorage.setItem(id2, "0");
				$("#thumbone").attr("src","images/help/2-3.png");
				$("#thumbtwo").attr("src","images/help/2-2.png");
			}
		}
	}else{
		console.log("点击的是未解决");
		//判断是否是可以被点击
		var isFirst1 = localStorage.getItem(_id);
		var id2 = _id.substr(0, _id.length - 1) + 1;
		var isFirst2 = localStorage.getItem(id2);
		console.log(isFirst1+"--"+isFirst2);
		if(isFirst1 == null&&isFirst2==null){
			console.log("第一次加载的时候点击了未解决");
			addData(categoryName,otext,0,1);
			localStorage.setItem(_id, "1");
			localStorage.setItem(id2, "0");
			$("#thumbone").attr("src","images/help/2-4.png");
			$("#thumbtwo").attr("src","images/help/2-1.png");
		}else{
			if(isFirst1 == 1&&isFirst2!=1){
				console.log("点击了未解决的情况下点击了未解决");
				updataData(categoryName,otext,0,0);
				localStorage.setItem(_id, "0");
				localStorage.setItem(id2, "0");
				$("#thumbone").attr("src","images/help/2-4.png");
				$("#thumbtwo").attr("src","images/help/2-2.png");
			}else if(isFirst1 != 1){
				console.log("点击了已解决的情况下点击了未解决");
				updataData(categoryName,otext,0,1);
				localStorage.setItem(_id, "1");
				localStorage.setItem(id2, "0");
				$("#thumbone").attr("src","images/help/2-4.png");
				$("#thumbtwo").attr("src","images/help/2-1.png");
			}
		}
	}
}
function addData(ocategory,otext,state1,state2){
	console.log(_chip+"--"+_model+"--"+_mac+"--"+_activeid);
	console.log(ocategory+"--"+otext+"---"+state1+"---"+state2);
	var ajaxTimeoutOne = $.ajax({
		type: "post",
		async: true,
		timeout: 5000,
		dataType: 'json',
		url: _datadbUrl + "/help/addIssue",
		data: {
			"chip": _chip,
			"model": _model,
			"mac": _mac,
			"activeid": _activeid,
			"category": ocategory,
			"title": otext,
			"likeCount": state1,
			"dislikeCount": state2
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			
		},
		error: function() {
			console.log('获取数据失败');
		},
		complete: function(XMLHttpRequest, status) {
			console.log("-------------complete------------------" + status);
			if(status == 'timeout') {　　　　　
				ajaxTimeoutOne.abort();　　　　
			}
		}
	});
}
function updataData(ocategory,otext,state1,state2){
	console.log(_chip+"--"+_model+"--"+_mac+"--"+_activeid);
	console.log(ocategory+"--"+otext+"---"+state1+"---"+state2);
	var ajaxTimeoutOne = $.ajax({
		type: "post",
		async: true,
		timeout: 5000,
		dataType: 'json',
		url: _datadbUrl + "/help/updateIssue",
		data: {
			"chip": _chip,
			"model": _model,
			"mac": _mac,
			"activeid": _activeid,
			"category": ocategory,
			"title": otext,
			"likeCount": state1,
			"dislikeCount": state2
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			
		},
		error: function() {
			console.log('获取数据失败');
		},
		complete: function(XMLHttpRequest, status) {
			console.log("-------------complete------------------" + status);
			if(status == 'timeout') {　　　　　
				ajaxTimeoutOne.abort();　　　　
			}
		}
	});
}

function showThumbStatus(quesid){
	console.log(quesid);
	var _id = quesid + 1;
	var id2 = quesid + 0;
	var isFirst1 = localStorage.getItem(_id);
	var isFirst2 = localStorage.getItem(id2);
	console.log(isFirst1+"---"+isFirst2);
	if(isFirst1 == null&&isFirst2==null){
		console.log("都未被点击");
		$("#thumbone").attr("src","images/help/2-4.png");
		$("#thumbtwo").attr("src","images/help/2-2.png");
	}else{
		if(isFirst1 == 1){
			$("#thumbone").attr("src","images/help/2-3.png");
			$("#thumbtwo").attr("src","images/help/2-2.png");
		}
		if(isFirst2 == 1){
			$("#thumbone").attr("src","images/help/2-4.png");
			$("#thumbtwo").attr("src","images/help/2-1.png");
		}
	}
}
