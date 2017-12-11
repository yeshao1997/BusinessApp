var IPPost;
var searchType;
var searchText;
var page;

function openPage(page,value){
	if(page == "back"){
		mui.back();
	}else if(page == "information"){
		mui.openWindow({
		    url: '../home/informationDetail.html',
		    id: 'informationDetail',
		    extras:{
		        informationId: value
		    }
		});
	}else if(page == "designer"){
		mui.openWindow({
		    url: '../home/designerDetail.html',
		    id: 'designerDetail',
		    extras:{
		        designerId: value
		    }
		});
	}else if(page == "work"){
		mui.openWindow({
		    url: '../work/workDetail.html',
		    id: 'workDetail',
		    extras:{
		        workId: value
		    }
		});
	}else if(page == "costume"){
		mui.openWindow({
		    url: '../costume/costumeDetail.html',
		    id: 'costumeDetail',
		    extras:{
		        costumeId: value
		    }
		});
	}else if(page == "cloth"){
		mui.openWindow({
		    url: '../cloth/clothDetail.html',
		    id: 'clothDetail',
		    extras:{
		        clothId: value
		    }
		});
	}
}

mui.init({
    pullRefresh : {
        container:"#searchResultContent",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
        up : {
            height:150,// 可选.默认50.触发上拉加载拖动距离
            auto:false,// 可选,默认false.自动上拉加载一次
            contentrefresh : "正在加载...",// 可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',// 可选，请求完毕若没有更多数据时显示的提醒内容；
            callback : getResult
        }
    }
});

mui.plusReady(function() {
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
});

function getSearchMsg(){
	IPPost = localStorage.getItem("IPPost");
	searchType = $("#searchSelect").val();
	searchText = $("#searchInput").val();
	page = 0;
	mui('#searchResultContent').pullRefresh().enablePullupToRefresh();
	$("#resultList").empty();
	
	if(searchText.trim() == ""){
		mui.toast("搜索内容不能为空");
	}else{
		getResult();
	}
}

function getResult(){
	var url;
	if (searchType == "information"){
		url = IPPost+'InformationController/searchInformation';
	}else if(searchType == "designer"){
		url = IPPost+'DesignerController/searchDesigner';
	}else if(searchType == "work"){
		url = IPPost+'WorkController/searchWork';
	}else if(searchType == "costume"){
		url = IPPost+'CostumeController/searchCostume';
	}else if(searchType == "cloth"){
		url = IPPost+'ClothController/searchCloth';
	}else{
		return;
	}
	mui.ajax(url, {
	    data: {
	    	searchText: searchText,
	    	page: page
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("网络错误");
	    	mui('#searchResultContent').pullRefresh().endPullupToRefresh();
	    },
	    success: function(data){
	    	mui('#searchResultContent').pullRefresh().endPullupToRefresh();
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				buildSearch(resultJson.obj);
				mui('body').on('tap','li',function(){
					var id = this.getAttribute("value");
					openPage(searchType,id);
				},false);
				page++;
			}else{
	    		mui.toast(resultJson.msg);
			}
	    }
	});
}

function buildSearch(obj){
	var idArray = obj.id;
	var imageArray = obj.image;
	var titleArray = obj.title;
	var timeArray = obj.time;
	
	if(idArray.length == 0 && page == 0){
		$("#notMessage").css("display","block");
		return;
	}else if(idArray.length == 0){
		mui.toast("没有更多信息了");
		mui('#searchResultContent').pullRefresh().disablePullupToRefresh();
	}else{
		$("#notMessage").css("display","none");
		var resultContent = document.getElementById('resultList');
		for(var i=0;i<idArray.length;i++){
			var image;
			if(searchType == "information"){
				image = imageArray[i];
			}else if(searchType == "designer"){
				image = IPPost + "image/" + imageArray[i];
			}else{
				image = IPPost + "image1/" + imageArray[i];
			}
			var result = "<li id='result' value="+idArray[i]+">"+
			    			"<a>"+
			    				"<img id='resultImg' src="+image+" />"+
			    				"<p id='resultText'>"+titleArray[i]+"</p>"+
			    				"<p id='resultTime'>"+timeArray[i]+"</p>"+
			    			"</a>"+
			    		"</li>";
			resultContent.insertAdjacentHTML('beforeend', result);
		}
	}
}
