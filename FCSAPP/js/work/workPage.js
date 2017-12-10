var page = 0;
var sortType = "fabulous";
var typeArray;
var IPPost;
var screenType = -1;
var displayType = 0;
var changeDisplay = 0;

function openPage(workId){
	mui.openWindow({
	    url: 'workDetail.html',
	    id: 'workDetail',
	    extras:{
	        workId: workId
	    }
	});
}

mui('body').on('tap','#search',function(){
	mui.openWindow("../other/search.html");
},false);

mui.init({
    pullRefresh : {
        container:"#workContent",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
        up : {
            height:50,// 可选.默认50.触发上拉加载拖动距离
            auto:false,// 可选,默认false.自动上拉加载一次
            contentrefresh : "正在加载...",// 可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',// 可选，请求完毕若没有更多数据时显示的提醒内容；
            callback : getWorkList
        }
    }
});

mui.plusReady(function() { 
	//自动获取一次数据
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	getWorkList();
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
		getWorkList();
	}
}

function getWorkList(){
	IPPost = localStorage.getItem("IPPost");
	var url = "";
	if(sortType == "fabulous"){
		url = IPPost+'WorkController/getWorkByFabulous';
	}else if(sortType == "comment"){
		url = IPPost+'WorkController/getWorkByComment';
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
	    	mui('#workContent').pullRefresh().endPullupToRefresh();
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				mui('#workContent').pullRefresh().endPullupToRefresh();
				var idArray = resultJson.obj.id;
				var imageArray = resultJson.obj.image;
				var titleArray = resultJson.obj.title;
				var designerArray = resultJson.obj.designer;
				var fabulousArray = resultJson.obj.fabulous;
				
				for(var i=0;i<idArray.length;i++){
					if(idArray[i] == null){
						mui('#workContent').pullRefresh().disablePullupToRefresh();
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
					buildWorkTable(idArray,imageArray,titleArray,designerArray,fabulousArray);
				}else{
					buildWorkList(idArray,imageArray,titleArray,designerArray,fabulousArray);
				}
			}else{
				mui.toast(resultJson.msg);
				mui('#workContent').pullRefresh().endPullupToRefresh();
			}
	    }
	});
}

function buildWorkTable(idArray,imageArray,titleArray,designerArray,fabulousArray){
	if(page == 0){
		$("#workTable").empty();
	}
	page++;
	var workContent = document.getElementById("workTable");
	var workText = "";
	for(var i=0;i<idArray.length;i++){
		if(i == 0 && idArray[0]!=null){
			workText += "<tr>";
		}else if(i!=0 && i%2==0 && idArray[0]!=null){
			workText += "</tr>";
			workContent.insertAdjacentHTML('beforeEnd',workText);
			workText = "<tr>";
		}
		if(idArray[i] != null){
			var image = IPPost +'image1/'+imageArray[i]
			workText += "<td id='work'>"+
								"<a onclick=openPage('"+idArray[i]+"')>"+
									"<img id='work-image' src="+image+"/>"+
									"<p id='work-name'>"+titleArray[i]+"</p>"+
									"<p id='work-designer'>"+designerArray[i]+"</p>"+
									"<img id='work-fabulous' src='../../img/home/unfabulous.png'/>"+
									"<p id='work-fabulous-number'>"+fabulousArray[i]+"</p>"+
					  			"</a>"+
							"</td>";
		}
		if(i == idArray.length-1 && idArray[0]!=null){
			workText += "</tr>";
			workContent.insertAdjacentHTML('beforeEnd',workText);
		}
		if(i==0 && idArray[i] == null){
			mui.toast("已无更多数据");
			break;
		}
	}
}

function buildWorkList(idArray,imageArray,titleArray,designerArray,fabulousArray){
	if(page == 0){
		$("#workList").empty();
	}
	var workContent = document.getElementById("workList");
	for(var i=0;i<idArray.length;i++){
		if(i==0 && idArray[i] == null){
			mui.toast("已无更多数据");
		}
		if(idArray[i] == null){
			break;
		}
		var image = IPPost +'image1/'+imageArray[i];
		var workText = "<li id='workL'>"+
								"<a id='workLA' onclick=openPage('"+idArray[i]+"')>"+
									"<img id='workImageL' src="+image+"/>"+
									"<p id='workNameL'>"+titleArray[i]+"</p>"+
									"<p id='workDesignerL'>"+designerArray[i]+"</p>"+
									"<img id='workFabulousL' src='../../img/home/unfabulous.png'/>"+
									"<p id='workFabulousNumberL'>"+fabulousArray[i]+"</p>"+
								"</a>"+
							"</li>";
		workContent.insertAdjacentHTML('beforeEnd',workText);
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
					getWorkByType(workType);
				});
			}, false);
		});
	})(mui, document);
}

function getWorkByType(value){
	screenType = value;
	page = 0;
	mui('#workContent').pullRefresh().enablePullupToRefresh();
	getWorkList();
}

mui('body').on('tap','#displayType',function(){
	if(displayType == 0){
		page = 0;
		$("#workTable").css("display","none");
		$("#workList").css("display","block");
		changeDisplay = 1;
		getWorkList();
	}else{
		page = 0;
		$("#workList").css("display","none");
		$("#workTable").css("display","block");
		changeDisplay = 1;
		getWorkList();
	}
},false);