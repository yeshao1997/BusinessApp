var page = 0;
var sortType = "fabulous";

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
		getClothList();
		_self.endPullToRefresh();
	});
	
	//自动获取一次数据
	getClothList();
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
	var IPPost = localStorage.getItem("IPPost");
	var url = "";
	if(sortType == "fabulous"){
		url = IPPost+'ClothController/getClothByFabulous';
	}else if(sortType == "comment"){
		url = IPPost+'ClothController/getClothByComment';
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
	    	mui('#clothContent').pullRefresh().endPullupToRefresh();
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				var idArray = resultJson.obj.id;
				var imageArray = resultJson.obj.image;
				var titleArray = resultJson.obj.title;
				var timeArray = resultJson.obj.time;
				var fabulousArray = resultJson.obj.fabulous;
				
				buildCloth(idArray,imageArray,titleArray,timeArray,fabulousArray);
				mui('#clothContent').pullRefresh().endPullupToRefresh();
			}else{
				mui.toast(resultJson.msg);
				mui('#clothContent').pullRefresh().endPullupToRefresh();
			}
	    }
	});
}

function buildCloth(idArray,imageArray,titleArray,timeArray,fabulousArray){
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
			var IPPost = localStorage.getItem("IPPost");
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

function openPage(clothId){
	mui.openWindow({
	    url: 'clothDetail.html',
	    id: 'clothDetail',
	    extras:{
	        clothId: clothId
	    }
	});
}
