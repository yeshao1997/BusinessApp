var newInformation = null;
var oldInformation = null;

mui.init({
    pullRefresh : {
        container:"#information_list_content",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
        up : {
            height:50,// 可选.默认50.触发上拉加载拖动距离
            auto:false,// 可选,默认false.自动上拉加载一次
            contentrefresh : "正在加载...",// 可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',// 可选，请求完毕若没有更多数据时显示的提醒内容；
            callback : getOldInformation
        }
    }
});

document.addEventListener('plusready', function(){
	//实现下拉刷新轮播图和资讯列表
	_self = plus.webview.currentWebview();
	_self.setPullToRefresh({
		support: true,
		height: '50px',
		range: '200px',
		style: 'circle'
	}, function(){
		if(newInformation != null && newInformation != ""){
			getNewInformation();
			_self.endPullToRefresh();
		}else{
			getInforListData();
			_self.endPullToRefresh();
		}
		getCarouselData();
	});
	
	//自动获取一次数据
	getCarouselData();
	getInforListData();
});

//获取轮播图数据
function getCarouselData(){
	var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'InformationController/getTopInformation';
	mui.ajax(url, {
	    data: {},
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取轮播图失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				titleArray = resultJson.obj.title;
				imgArray = resultJson.obj.image;
				idArray = resultJson.obj.id;
				
				buildCarousel(titleArray,imgArray,idArray);
	    		mui.toast(resultJson.msg);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

//获取资讯列表数据
function getInforListData(){
	var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'InformationController/getInformationList';
	mui.ajax(url, {
	    data: {},
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取资讯失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				//倒序数组
				var informationImage = resultJson.obj.image.reverse();
				var informationTitle = resultJson.obj.title.reverse();
				var informationTime = resultJson.obj.time.reverse();
				var informationId = resultJson.obj.id.reverse();
				
				//保存最新资讯id
				newInformation = informationId[informationId.length-1];
				//保存最后的资讯id
				oldInformation = informationId[0];
				//构建资讯列表
				buildInformationList('afterBegin',informationId,informationImage,informationTitle,informationTime);
	    		mui.toast(resultJson.msg);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

//获取新的资讯
function getNewInformation(){
	var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'InformationController/getNewInformationList';
	mui.ajax(url, {
	    data: {
	    	'newInformation': newInformation
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取资讯失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				//倒序数组
				var informationImage = resultJson.obj.image.reverse();
				var informationTitle = resultJson.obj.title.reverse();;
				var informationTime = resultJson.obj.time.reverse();;
				var informationId = resultJson.obj.id.reverse();;
				
				//保存最新资讯id
				newInformation = informationId[informationId.length-1];
				
				buildInformationList('afterBegin',informationId,informationImage,informationTitle,informationTime);
	    		mui.toast(resultJson.msg);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});	
}

//获取旧的资讯
function getOldInformation(){
	if(oldInformation != null && oldInformation != ""){
		var IPPost = localStorage.getItem("IPPost");
		var url = IPPost+'InformationController/getOldInformationList';
		mui.ajax(url, {
		    data: {
		    	'oldInformation': oldInformation
		    },
		    type: "POST",
		    timeout: 3000,
		    traditional: true,
		    error: function(){
		    	mui.toast("获取资讯失败，网络错误");
		    	mui('#information_list_content').pullRefresh().endPullupToRefresh();
		    },
		    success: function(data){
		    	var resultJson = JSON.parse(JSON.stringify( data ));
				if(resultJson.code == 1){
					var informationImage = resultJson.obj.image;
					var informationTitle = resultJson.obj.title;
					var informationTime = resultJson.obj.time;
					var informationId = resultJson.obj.id;
					
					//保存最后的资讯id
					oldInformation = informationId[informationId.length-1];
					
					buildInformationList('beforeEnd',informationId,informationImage,informationTitle,informationTime);
		    		mui.toast(resultJson.msg);
		    		mui('#information_list_content').pullRefresh().endPullupToRefresh();
				}else{
					mui.toast(resultJson.msg);
		    		mui('#information_list_content').pullRefresh().endPullupToRefresh();
				}
		    }
		});
	}else{
		mui.toast("获取更多资讯失败");
	}
}

//构建轮播图
function buildCarousel(titleArray,imgArray,idArray){
	var orderArray = new Array(3,0,1,2,3,0);
	var carouselContent = document.getElementById('carousel-content');

	//构建轮播图 
	for(var i=0;i<orderArray.length;i++){
		var oneCarouse = "<div class='mui-slider-item mui-slider-item-duplicate'>"+
								"<a href="+'javascript:void(0);'+" onclick=openPage('"+idArray[orderArray[i]]+"')>"+
									"<img id='carouselImage' src="+imgArray[orderArray[i]]+">"+
									"<p class='mui-slider-title'>"+titleArray[orderArray[i]]+"</p>"+
								"</a>"+
							"</div>";
		carouselContent.insertAdjacentHTML('beforeend', oneCarouse);
	}
	
	//为轮播图添加自动滑动时间
	var slider = mui("#slider");
	slider.slider({
		interval: 5000
	});
}

//构建资讯列表
function buildInformationList(insertType,informationId,informationImage,informationTitle,informationTime){
	var informationList = document.getElementById('information_list');
	for(var i=0;i<informationId.length;i++){
		if("" != informationImage[i] && informationImage[i] != null){
			var oneInformation = "<li id='information' class='mui-table-view-cell' onclick=openPage('"+informationId[i]+"')>"+
								"<div id='img-content'>"+
									"<img id='information_image' src="+informationImage[i]+">"+
								"</div>"+
								"<div id='infor-content'>"+
									"<p id='information_title'>"+informationTitle[i]+"</p>"+
									"<p id='information_time'>"+informationTime[i]+"</p>"+
								"</div>"+
							"</li>";
			informationList.insertAdjacentHTML(insertType, oneInformation);
		}else{
			var oneInformation = "<li id='information' class='mui-table-view-cell' onclick=openPage('"+informationId[i]+"')>"+
								"<div id='img-content' style='display: none;'>"+
									"<img id='information_image'>"+
								"</div>"+
								"<div id='infor-content' style='left: 20px;'>"+
									"<p id='information_title'>"+informationTitle[i]+"</p>"+
									"<p id='information_time'>"+informationTime[i]+"</p>"+
								"</div>"+
							"</li>";
			informationList.insertAdjacentHTML(insertType, oneInformation); 
		}
		
	}
}

//打开详情页面
function openPage(informationId){
	mui.openWindow({
	    url: 'informationDetail.html',
	    id: 'informationDetail',
	    extras:{
	        informationId: informationId
	    }
	});
}