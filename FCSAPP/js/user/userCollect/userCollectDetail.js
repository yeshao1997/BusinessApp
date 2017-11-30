var type;
var sort = "desc";
var userId;
var IPPost;

function openPage(page){
	if(page == "back"){
		mui.back();
	}else if(type == 1){
		mui.openWindow({
		    url: '../../home/informationDetail.html',
		    id: 'informationDetail',
		    extras:{
		        informationId: page
		    }
		});
	}else if(type == 2){
		mui.openWindow({
		    url: '../../work/workDetail.html',
		    id: 'workDetail',
		    extras:{
		        workId: page
		    }
		});
	}else if(type == 3){
		mui.openWindow({
		    url: '../../cloth/clothDetail.html',
		    id: 'clothDetail',
		    extras:{
		        clothId: page
		    }
		});
	}else if(type == 4){
		mui.openWindow({
		    url: '../../costume/costumeDetail.html',
		    id: 'costumeDetail',
		    extras:{
		        costumeId: page
		    }
		});
	}
}

//监听刷新页面
window.addEventListener('refreshCollect', function(e) {
    location.reload();
})

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	type = self.type;
	if(type == 1){
		$("#title").text("资讯信息");
		getData();
	}else if(type == 2){
		$("#title").text("设计作品");
		getData();
	}else if(type == 3){
		$("#title").text("布料辅料");
		getData();
	}else if(type == 4){
		$("#title").text("品牌服装");
		getData();
	}
});

function setSortType(sortType){
	if(sort != sortType){
		if(sortType == "desc"){
			$("#selectByAsc img").css({'display':'none'});
			$("#selectByDesc img").css({'display':'block'});
		}else if(sortType == "asc"){
			$("#selectByDesc img").css({'display':'none'});
			$("#selectByAsc img").css({'display':'block'});
		}
		sort = sortType;
		getData();
	}
}

function getData(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'CollectController/getCollect';
	mui.ajax(url, {
	    data: {
	    	type: type,
	    	sort: sort,
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取收藏数据失败，网络错误");
	    	console.log("获取收藏数据失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				var idArray = resultJson.obj.id;
				var imageArray = resultJson.obj.image;
				var titleArray = resultJson.obj.title;
				var timeArray = resultJson.obj.time;
				if(idArray.length > 0){
					$("#notMessage").css("display","none");
					buildList(idArray,imageArray,titleArray,timeArray);
				}
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function buildList(idArray,imageArray,titleArray,timeArray){
	var collectContent = document.getElementById("collectList");
	$("#collectList").empty();
	for(var i=0;i<idArray.length;i++){
		if(idArray[i] != ""){
			var imagePath = IPPost + "image1/" + imageArray[i];
			var collectText = "<li id='collect'>"+
								"<a onclick=openPage('"+idArray[i]+"')>"+
									"<img id='collectImg' src="+imagePath+"/>"+
									"<p id='collectText'>"+titleArray[i]+"</p>"+
									"<p id='collectTime'>"+timeArray[i]+"</p>"+
								"</a>"+
							"</li>";
			collectContent.insertAdjacentHTML('beforeEnd', collectText);
		}
	}
	
	
}
