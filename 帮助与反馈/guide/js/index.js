var _btnLine = 0;
var _curQuesNum = 0;//当前第几个问题
var _curLength = 0;//当前问题有几条子项
var _curClickbtn = "";//当前被点击的提交数据的按钮
var arrLength = ["2","3","2","2","2","2","2"];
var arrName = ["#ansBox0","#ansBox1","#ansBox2","#ansBox3","#ansBox4","#ansBox5","#ansBox6"];
var myScrollTopValue = 0;
var _parentIndex = 0;
//var _datadbUrl = "http://172.20.133.47:3010";
var _datadbUrl = "https://webx.coocaa.com/hfdplatform";

$(function() {
	console.log("--------------------loading");
	map = new coocaakeymap($(".coocaa_btn"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
	buttonInit();
	dataSearchResult();
	localDataRead();
});

function buttonInit(){
	$(".optionenum").unbind("itemClick").bind("itemClick", function() {
		$(".listItem:visible:eq(0)").css("opacity","1");
		$(".upIcon").css("display","none");
		var _cIndex = $(".optionenum").index($(this));
		_curLength = arrLength[_cIndex];
		_curQuesNum = _cIndex;
		console.log(_cIndex);
		$("#mainPage").css("display","none");
		$("#secondPage").css("display","block");
		$(".partPages").siblings().css("display","none");
		$(".partPages:eq("+_cIndex+")").css("display","block");
		map = new coocaakeymap($(".coocaa_btn2"), null, "btn-focus", function() {}, function(val) {}, function(obj) {});
		$(".coocaa_btn2:visible:eq(0)").trigger("focus");
	});
	$(".eachYONBtns").bind("focus", function(event){
		var _FocusIndex = $(".eachYONBtns:visible").index($(this));
		var _thisParentClassname = $(".eachYONBtns:visible")[_FocusIndex].parentNode.className;
       	var _grandFather = $(".eachYONBtns:visible")[_FocusIndex].parentNode.parentNode.id;
       	console.log(_FocusIndex+"---"+_grandFather+"---"+_thisParentClassname);
       	var _obj = "#"+_grandFather+" .divPart";
        var _thisParentIndex = $("."+_thisParentClassname).index($(".eachYONBtns")[_FocusIndex].parentNode);
        console.log(_obj+"---"+_thisParentIndex+"---"+$(_obj)[0].offsetHeight);
       	$(".listItem").siblings().css("opacity","0.2");
       	$(".listItem:visible:eq("+_thisParentIndex+")").css("opacity","1");
       	console.log(Math.floor(_FocusIndex/2)+"--"+$(".eachYONBtns:visible").length/2);
       	if (_FocusIndex < 2) {
       		$(".upIcon").css("display","none");
       		$(".downIcon").css("display","block");
       	} else{
       		$(".upIcon").css("display","block");
       		if (Math.floor(_FocusIndex/2)== ($(".eachYONBtns:visible").length/2-1)) {
       			$(".downIcon").css("display","none");
       		} else{
       			$(".downIcon").css("display","block");
       		}
       	}
       	for (var i=0; i<_thisParentIndex; i++) {
        	myScrollTopValue += $(_obj)[i].offsetHeight;
        }
        if (_thisParentIndex != _parentIndex) {
        	$("#"+_grandFather).css("transform", "translate3D(0, -" + (_FocusIndex/2)*1080 + "px, 0)");
        }
        _parentIndex = _thisParentIndex;
        myScrollTopValue = 0;
	});
	$(".eachYONBtns").unbind("itemClick").bind("itemClick", function() {
		var _fIndex2 = $(".eachYONBtns:visible").index($(this));
		var _fLine = Math.floor(_fIndex2/2);
		var _fBtnId = $(this).attr("id");
		_curClickbtn = _fBtnId;
		console.log(_fBtnId);
		yesOrNoClick(_fBtnId,_curQuesNum,_fLine,_fIndex2);
	});
}
function yesOrNoClick(id,ques,seq,opt){
	console.log("第"+(ques+1)+"个问题的第"+(seq+1)+"列的第"+(opt%2+1)+"选项");
	if(opt%2 == 0){
		console.log("点击的是：是");
		var isFirst1 = localStorage.getItem(id);
		var id2 = id.substr(0, id.length - 1) + 2;
		var isFirst2 = localStorage.getItem(id2);
		console.log(isFirst1+"--"+isFirst2);
		if(isFirst1 != 1&&isFirst2!=1){
			console.log("都未被点击情况下点击了是");
			yesOrNo(ques,seq,1,1);//第三个参数1表示处理"是"0表示处理"否"  第四个参数1表示+1;0表示撤销+1
			localStorage.setItem(id, "1");
			$("#"+id+" .thumb .imgStatus").attr("src","images/explore/2-3.png");
		}else if(isFirst1 == 1&&isFirst2!=1){
			console.log("是被点击否未被点击情况下点击了是");
			yesOrNo(ques,seq,1,0);//第三个参数1表示处理"是"0表示处理"否"  第四个参数1表示+1;0表示撤销+1
			localStorage.setItem(id, "0");
			$("#"+id+" .thumb .imgStatus").attr("src","images/explore/2-4.png");
		}else if(isFirst1 != 1&&isFirst2==1){
			console.log("是未被点击否被点击情况下点击了是");
			yesOrNo(ques,seq,1,1);//第三个参数1表示处理"是"0表示处理"否"  第四个参数1表示+1;0表示撤销+1
			yesOrNo(ques,seq,0,0);//第三个参数1表示处理"是"0表示处理"否"  第四个参数1表示+1;0表示撤销+1
			localStorage.setItem(id, "1");
			localStorage.setItem(id2, "0");
			$("#"+id+" .thumb .imgStatus").attr("src","images/explore/2-3.png");
			$("#"+id2+" .thumb2 .imgStatus").attr("src","images/explore/2-2.png");
		}
	}else{
		console.log("点击的是否");
		//判断是否是可以被点击
		var isFirst1 = localStorage.getItem(id);
		var id2 = id.substr(0, id.length - 1) + 1;
		var isFirst2 = localStorage.getItem(id2);
		console.log(isFirst1+"--"+isFirst2);
		if(isFirst1 != 1&&isFirst2!=1){
			console.log("都未被点击情况下点击了否");
			yesOrNo(ques,seq,0,1);//第三个参数1表示处理"是"0表示处理"否"  第四个参数1表示+1;0表示撤销+1
			localStorage.setItem(id, "1");
			$("#"+id+" .thumb2 .imgStatus").attr("src","images/explore/2-1.png");
		}else if(isFirst1 == 1&&isFirst2!=1){
			console.log("否被点击是未被点击情况下点击了否");
			yesOrNo(ques,seq,0,0);//第三个参数1表示处理"是"0表示处理"否"  第四个参数1表示+1;0表示撤销+1
			localStorage.setItem(id, "0");
			$("#"+id+" .thumb2 .imgStatus").attr("src","images/explore/2-2.png");
		}else if(isFirst1 != 1&&isFirst2==1){
			console.log("否未被点击是被点击情况下点击了否");
			yesOrNo(ques,seq,0,1);//第三个参数1表示处理"是"0表示处理"否"  第四个参数1表示+1;0表示撤销+1
			yesOrNo(ques,seq,1,0);//第三个参数1表示处理"是"0表示处理"否"  第四个参数1表示+1;0表示撤销+1
			localStorage.setItem(id, "1");
			localStorage.setItem(id2, "0");
			$("#"+id+" .thumb2 .imgStatus").attr("src","images/explore/2-1.png");
			$("#"+id2+" .thumb .imgStatus").attr("src","images/explore/2-4.png");
		}
	}
}

function dataSearchResult(){
	var ajaxTimeoutOne = $.ajax({
		type: "post",
		async: true,
		timeout: 5000,
		dataType: 'json',
		url: _datadbUrl + "/help/queryDiscovery",
		success: function(data) {
			console.log(JSON.stringify(data));
			console.log(data.data.length);
			for (var i=0;i<data.data.length;i++) {
				$(".partPages:eq("+data.data[i].category_id+") .fullScreen2 .divPart:eq("+data.data[i].title_id+") .aaaa").html("是&nbsp;" + data.data[i].likeCount);
			}
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

function yesOrNo(num1,num2,num3,num4){
	var ajaxTimeoutOne = $.ajax({
		type: "post",
		async: true,
		timeout: 5000,
		dataType: 'json',
		url: _datadbUrl + "/help/updateDiscovery",
		data: {
			"categoryId": num1,
			"titleId": num2,
			"likeFlag": num3,
			"countFlag": num4
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
			dataSearchResult();
		}
	});
}

function localDataRead(){
	console.log($(".eachYONBtns").length);
	for (var i=0; i<$(".eachYONBtns").length;i++) {
		var _id = $(".eachYONBtns")[i].id;
		var _clickStatus = localStorage.getItem(_id);
		console.log(_id+"--"+_clickStatus);
		if (_clickStatus == 1) {
			console.log(i);
			if (i%2 == 0) {
				$(".imgStatus:eq("+i+")").attr("src","images/explore/2-3.png");
			} else{
				$(".imgStatus:eq("+i+")").attr("src","images/explore/2-1.png");
			}
		}
	}
}
