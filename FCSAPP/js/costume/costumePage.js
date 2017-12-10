var page = 0;
var sortType = "fabulous";
var IPPost;
var typeArray;
var screenType = -1;
var displayType = 0;
var changeDisplay = 0;

function openPage(costumeId){
	mui.openWindow({
	    url: 'costumeDetail.html',
	    id: 'costumeDetail',
	    extras:{
	        costumeId: costumeId
	    }
	});
}

mui('body').on('tap','#search',function(){
	mui.openWindow("../other/search.html");
},false);

mui.init({
    pullRefresh : {
        container:"#costumeContent",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
        up : {
            height:50,// 可选.默认50.触发上拉加载拖动距离
            auto:false,// 可选,默认false.自动上拉加载一次
            contentrefresh : "正在加载...",// 可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',// 可选，请求完毕若没有更多数据时显示的提醒内容；
            callback : getCostumeList
        }
    }
});

mui.plusReady(function() { 
	//自动获取一次数据
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	getCostumeList();
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
		getCostumeList();
	}
}

function getCostumeList(){
	IPPost = localStorage.getItem("IPPost");
	var url = "";
	if(sortType == "fabulous"){
		url = IPPost+'CostumeController/getCostumeByFabulous';
	}else if(sortType == "comment"){
		url = IPPost+'CostumeController/getCostumeByComment';
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
	    	mui('#costumeContent').pullRefresh().endPullupToRefresh();
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				mui('#costumeContent').pullRefresh().endPullupToRefresh();
				var idArray = resultJson.obj.id;
				var imageArray = resultJson.obj.image;
				var titleArray = resultJson.obj.title;
				var timeArray = resultJson.obj.time;
				var fabulousArray = resultJson.obj.fabulous;
				
				for(var i=0;i<idArray.length;i++){
					if(idArray[i] == null){
						mui('#costumeContent').pullRefresh().disablePullupToRefresh();
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
					buildCostumeTable(idArray,imageArray,titleArray,timeArray,fabulousArray);
				}else{
					buildCostumeList(idArray,imageArray,titleArray,timeArray,fabulousArray);
				}
			}else{
				mui.toast(resultJson.msg);
				mui('#costumeContent').pullRefresh().endPullupToRefresh();
			}
	    }
	});
}

function buildCostumeTable(idArray,imageArray,titleArray,timeArray,fabulousArray){
	if(page == 0){
		$("#costumeTable").empty();
	}
	var costumeContent = document.getElementById("costumeTable");
	var costumeText = "";
	for(var i=0;i<idArray.length;i++){
		if(i == 0 && idArray[0]!=null){
			costumeText += "<tr>";
		}else if(i!=0 && i%2==0 && idArray[0]!=null){
			costumeText += "</tr>";
			costumeContent.insertAdjacentHTML('beforeEnd',costumeText);
			costumeText = "<tr>";
		}
		if(idArray[i] != null){
			var image = IPPost +'image1/'+imageArray[i];
			costumeText += "<td id='costume'>"+
								"<a onclick=openPage('"+idArray[i]+"')>"+
									"<img id='costume-image' src="+image+"/>"+
									"<p id='costume-name'>"+titleArray[i]+"</p>"+
									"<p id='costume-time'>"+timeArray[i]+"</p>"+
									"<img id='costume-fabulous' src='../../img/home/unfabulous.png'/>"+
									"<p id='costume-fabulous-number'>"+fabulousArray[i]+"</p>"+
					  			"</a>"+
							"</td>";
		}
		if(i == idArray.length-1 && idArray[0]!=null){
			costumeText += "</tr>";
			costumeContent.insertAdjacentHTML('beforeEnd',costumeText);
		}
		if(i==0 && idArray[i] == null){
			mui.toast("已无更多数据");
			break;
		}
	}
	page++;
}

function buildCostumeList(idArray,imageArray,titleArray,timeArray,fabulousArray){
	if(page == 0){
		$("#costumeList").empty();
	}
	var costumeContent = document.getElementById("costumeList");
	for(var i=0;i<idArray.length;i++){
		if(i==0 && idArray[i] == null){
			mui.toast("已无更多数据");
		}
		if(idArray[i] == null){
			break;
		}
		var image = IPPost +'image1/'+imageArray[i];
		var costumeText = "<li id='costumeL'>"+
								"<a id='constumeLA' onclick=openPage('"+idArray[i]+"')>"+
									"<img id='costumeImageL' src="+image+"/>"+
									"<p id='costumeNameL'>"+titleArray[i]+"</p>"+
									"<p id='costumeTime'>"+timeArray[i]+"</p>"+
									"<img id='costumeFabulousL' src='../../img/home/unfabulous.png'/>"+
									"<p id='costumeFabulousNumberL'>"+fabulousArray[i]+"</p>"+
								"</a>"+
							"</li>";
		costumeContent.insertAdjacentHTML('beforeEnd',costumeText);
	}
	page++;
}

function _getParam(obj, param) {
	return obj[param] || '';
}

function getScreen(){
	var url = IPPost+'DictDataController/getScreenCostumeType';
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
				typeArray = resultJson.obj;
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
			var typePicker = new $.PopPicker({ layer: 3 });
			
			var showTypePickerButton = doc.getElementById('screen');
			
			typePicker.setData(typeArray);
			
			showTypePickerButton.addEventListener('tap', function(event) {
				typePicker.show(function(items) {
					workType = _getParam(items[2], 'value');
					getCostumeByType(workType);
				});
			}, false);
		});
	})(mui, document);
}

function getCostumeByType(value){
	screenType = value;
	page = 0;
	mui('#costumeContent').pullRefresh().enablePullupToRefresh();
	getCostumeList();
}

mui('body').on('tap','#displayType',function(){
	if(displayType == 0){
		page = 0;
		$("#costumeTable").css("display","none");
		$("#costumeList").css("display","block");
		changeDisplay = 1;
		getCostumeList();
	}else{
		page = 0;
		$("#costumeList").css("display","none");
		$("#costumeTable").css("display","block");
		changeDisplay = 1;
		getCostumeList();
	}
},false);