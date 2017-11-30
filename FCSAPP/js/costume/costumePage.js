var page = 0;
var sortType = "fabulous";

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

document.addEventListener('plusready', function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	//实现下拉刷新轮播图和资讯列表
	_self = plus.webview.currentWebview();
	_self.setPullToRefresh({
		support: true,
		height: '50px',
		range: '200px',
		style: 'circle'
	}, function(){
		page = 0;
		getCostumeList();
		_self.endPullToRefresh();
	});
	
	//自动获取一次数据
	getCostumeList();
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
	var IPPost = localStorage.getItem("IPPost");
	var url = "";
	if(sortType == "fabulous"){
		url = IPPost+'CostumeController/getCostumeByFabulous';
	}else if(sortType == "comment"){
		url = IPPost+'CostumeController/getCostumeByComment';
	}
	
	mui.ajax(url, {
	    data: {
	    	page: page
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
				var idArray = resultJson.obj.id;
				var imageArray = resultJson.obj.image;
				var titleArray = resultJson.obj.title;
				var timeArray = resultJson.obj.time;
				var fabulousArray = resultJson.obj.fabulous;
				
				buildCostume(idArray,imageArray,titleArray,timeArray,fabulousArray);
				mui('#costumeContent').pullRefresh().endPullupToRefresh();
			}else{
				mui.toast(resultJson.msg);
				mui('#costumeContent').pullRefresh().endPullupToRefresh();
			}
	    }
	});
}

function buildCostume(idArray,imageArray,titleArray,timeArray,fabulousArray){
	if(page == 0){
		$("#costumeTable").empty();
	}
	page++;
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
			var IPPost = localStorage.getItem("IPPost");
			var image = IPPost +'image1/'+imageArray[i]
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
}

function openPage(costumeId){
	mui.openWindow({
	    url: 'costumeDetail.html',
	    id: 'costumeDetail',
	    extras:{
	        costumeId: costumeId
	    }
	});
}
