var page = 0;
var sortType = "fabulous";
var IPPost;
var componentArray;
var screenType = -1;
var displayType = 0;
var changeDisplay = 0;

function openPage(clothId){
	mui.openWindow({
	    url: 'clothDetail.html',
	    id: 'clothDetail',
	    extras:{
	        clothId: clothId
	    }
	});
}

mui('body').on('tap','#search',function(){
	mui.openWindow("../other/search.html");
},false);

mui.init({
    pullRefresh : {
        container:"#clothContent",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
        up : {
            height:50,// 可选.默认50.触发上拉加载拖动距离
            auto:false,// 可选,默认false.自动上拉加载一次
            contentrefresh : "正在加载...",// 可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',// 可选，请求完毕若没有更多数据时显示的提醒内容；
            callback : getClothList
        }
    }
});

mui.plusReady(function() { 
	//自动获取一次数据
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	getClothList();
	getScreen();
});

function setSortType(type){
	if(sortType != type){
		if(type == "fabulous"){
			$("#selectByComment img").css({'display':'none'});
			$("#selectByFabulous img").css({'display':'block'});
		}else if(type == "comment"){
			$("#selectByFabulous img").css({'display':'none'});
			$("#selectByComment img").css({'display':'block'});
		}
		sortType = type;
		page = 0;
		getClothList();
	}
}

function getClothList(){
	IPPost = localStorage.getItem("IPPost");
	var url = "";
	if(sortType == "fabulous"){
		url = IPPost+'ClothController/getClothByFabulous';
	}else if(sortType == "comment"){
		url = IPPost+'ClothController/getClothByComment';
	}
	
	mui.ajax(url, {
	    data: {
	    	page: page,
	    	screen: screenType
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("网络错误");
	    	mui('#clothContent').pullRefresh().endPullupToRefresh();
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				mui('#clothContent').pullRefresh().endPullupToRefresh();
				var idArray = resultJson.obj.id;
				var imageArray = resultJson.obj.image;
				var titleArray = resultJson.obj.title;
				var timeArray = resultJson.obj.time;
				var fabulousArray = resultJson.obj.fabulous;
				
				for(var i=0;i<idArray.length;i++){
					if(idArray[i] == null){
						mui('#clothContent').pullRefresh().disablePullupToRefresh();
						break;
					}
				}
				if(changeDisplay == 1){
					if(displayType == 1){
						displayType = 0;
					}else{
						displayType = 1;
					}
					changeDisplay = 0;
				}
				if(displayType == 0){
					buildClothTable(idArray,imageArray,titleArray,timeArray,fabulousArray);
				}else{
					buildClothList(idArray,imageArray,titleArray,timeArray,fabulousArray);
				}
			}else{
				mui.toast(resultJson.msg);
				mui('#clothContent').pullRefresh().endPullupToRefresh();
			}
	    }
	});
}

function buildClothTable(idArray,imageArray,titleArray,timeArray,fabulousArray){
	if(page == 0){
		$("#clothTable").empty();
	}
	page++;
	var clothContent = document.getElementById("clothTable");
	var clothText = "";
	for(var i=0;i<idArray.length;i++){
		if(i == 0 && idArray[0]!=null){
			clothText += "<tr>";
		}else if(i!=0 && i%2==0 && idArray[0]!=null){
			clothText += "</tr>";
			clothContent.insertAdjacentHTML('beforeEnd',clothText);
			clothText = "<tr>";
		}
		if(idArray[i] != null){
			var image = IPPost +'image1/'+imageArray[i]
			clothText += "<td id='cloth'>"+
								"<a onclick=openPage('"+idArray[i]+"')>"+
									"<img id='cloth-image' src="+image+"/>"+
									"<p id='cloth-name'>"+titleArray[i]+"</p>"+
									"<p id='cloth-time'>"+timeArray[i]+"</p>"+
									"<img id='cloth-fabulous' src='../../img/home/unfabulous.png'/>"+
									"<p id='cloth-fabulous-number'>"+fabulousArray[i]+"</p>"+
					  			"</a>"+
							"</td>";
		}
		if(i == idArray.length-1 && idArray[0]!=null){
			clothText += "</tr>";
			clothContent.insertAdjacentHTML('beforeEnd',clothText);
		}
		if(i==0 && idArray[i] == null){
			mui.toast("已无更多数据");
			break;
		}
	}
}

function buildClothList(idArray,imageArray,titleArray,timeArray,fabulousArray){
	if(page == 0){
		$("#clothList").empty();
	}
	var clothContent = document.getElementById("clothList");
	for(var i=0;i<idArray.length;i++){
		if(i==0 && idArray[i] == null){
			mui.toast("已无更多数据");
		}
		if(idArray[i] == null){
			break;
		}
		var image = IPPost +'image1/'+imageArray[i];
		var clothText = "<li id='clothL'>"+
								"<a id='clothLA' onclick=openPage('"+idArray[i]+"')>"+
									"<img id='clothImageL' src="+image+"/>"+
									"<p id='clothNameL'>"+titleArray[i]+"</p>"+
									"<p id='clothTime'>"+timeArray[i]+"</p>"+
									"<img id='clothFabulousL' src='../../img/home/unfabulous.png'/>"+
									"<p id='clothFabulousNumberL'>"+fabulousArray[i]+"</p>"+
								"</a>"+
							"</li>";
		clothContent.insertAdjacentHTML('beforeEnd',clothText);
	}
	page++;
}

function _getParam(obj, param) {
	return obj[param] || '';
}

function getScreen(){
	var url = IPPost+'DictDataController/getScreenComponent';
	mui.ajax(url, {
	    data: {},
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取数据失败，网络错误");
	    	console.log("获取数据失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				componentArray = resultJson.obj;
				setScreen();
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function setScreen(){
	(function($, doc) {
		$.init();
		$.ready(function() {
			var componentPicker = new $.PopPicker({ layer: 2 });
			
			var showComponentPickerButton = doc.getElementById('screen');
			
			componentPicker.setData(componentArray);
			
			showComponentPickerButton.addEventListener('tap', function(event) {
				componentPicker.show(function(items) {
					clothcComponent = _getParam(items[1], 'value');
					getClothByComponent(clothcComponent);
				});
			}, false);
		});
	})(mui, document);
}

function getClothByComponent(value){
	screenType = value;
	page = 0;
	mui('#clothContent').pullRefresh().enablePullupToRefresh();
	getClothList();
}

mui('body').on('tap','#displayType',function(){
	if(displayType == 0){
		page = 0;
		$("#clothTable").css("display","none");
		$("#clothList").css("display","block");
		changeDisplay = 1;
		getClothList();
	}else{
		page = 0;
		$("#clothList").css("display","none");
		$("#clothTable").css("display","block");
		changeDisplay = 1;
		getClothList();
	}
},false);