var userId;
var selectTag = new Array();
var selected = 0;
var page = 0;

mui.init({
    pullRefresh : {
        container:"#designerListContent",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
        up : {
            height:50,// 可选.默认50.触发上拉加载拖动距离
            auto:false,// 可选,默认false.自动上拉加载一次
            contentrefresh : "正在加载...",// 可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore:'没有更多数据了',// 可选，请求完毕若没有更多数据时显示的提醒内容；
            callback : getDesignerList
        }
    }
});

//监听刷新页面
window.addEventListener('refresh', function(e) {
    chooseSelectType();
})

document.addEventListener('plusready', function(){
	//实现下拉刷新轮播图和资讯列表
	_self = plus.webview.currentWebview();
	_self.setPullToRefresh({
		support: true,
		height: '50px',
		range: '200px',
		style: 'circle'
	}, function(){
		chooseSelectType();
		_self.endPullToRefresh();
	});
	
	//自动获取一次数据
	getTagData();
	getDesignerList();
});

//获取标签
function getTagData(){
	var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'DictDataController/getSelectTagList';
	mui.ajax(url, {
	    data: {},
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取标签失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				var tagArray = resultJson.obj.tag;
				var valueArray = resultJson.obj.value;
				buildTag(tagArray,valueArray);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

//获取所有设计师列表
function getDesignerList(){
	//清空原有设计师列表
	if(page == 0){
		$("#designer_list").empty();
	}
	
	var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'DesignerController/getDesignerList';
	userId= localStorage.getItem("userId");
	mui.ajax(url, {
	    data: {
	    	userId: userId,
	    	page: page
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取设计师列表失败，网络错误");
	    	mui('#designerListContent').pullRefresh().endPullupToRefresh();
	    	mui('#designerListContent').pullRefresh().disablePullupToRefresh();
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				var idArray = resultJson.obj.id;
				var nameArray = resultJson.obj.name;
				var portraitArray = resultJson.obj.portrait;
				var workNumber = resultJson.obj.number;
				var followType = resultJson.obj.follow;
				
				page++;
				//构建设计师列表
				mui('#designerListContent').pullRefresh().endPullupToRefresh();
				if(idArray.length<6){
					mui('#designerListContent').pullRefresh().disablePullupToRefresh();
				}
				buildDesignerList('beforeEnd',idArray,nameArray,portraitArray,workNumber,followType);
			}else{
				mui.toast(resultJson.msg);
				mui('#designerListContent').pullRefresh().endPullupToRefresh();
				mui('#designerListContent').pullRefresh().disablePullupToRefresh();
			}
	    }
	});
}

//根据选择的标签来查询设计师列表
function getDesignerListByTag(tag){
	//清空原有设计师列表
	$("#designer_list").empty();
	
    var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'DesignerController/getDesignerListByTag';
	userId= localStorage.getItem("userId");
	mui.ajax(url, {
	    data: {
	    	userId: userId,
	    	tag: tag
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取设计师列表失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				var idArray = resultJson.obj.id;
				var nameArray = resultJson.obj.name;
				var portraitArray = resultJson.obj.portrait;
				var workNumber = resultJson.obj.number;
				var followType = resultJson.obj.follow;
				
				//构建资讯列表
				buildDesignerList('beforeEnd',idArray,nameArray,portraitArray,workNumber,followType);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

//构建标签
function buildTag(tagArray,valueArray){
	$("#lineOne").empty();
	$("#lineTwo").empty();
	var tagContent = document.getElementById('lineOne');
	for(var i=0;i<tagArray.length;i++){
		var tag = "<button class='mui-btn mui-btn-block mui-btn-primary mui-icon iconfont icon-tag'"
				+" id="+'button'+valueArray[i]+" value="+valueArray[i]+" onclick=addSelect("+valueArray[i]+")>"
				+tagArray[i]+"</button>";
		if(i>0 && i%6 == 0){
			tagContent = document.getElementById('lineTwo');
		}
		tagContent.insertAdjacentHTML('beforeend', tag);
	}
}

//构建设计师列表
function buildDesignerList(insertType,idArray,nameArray,portraitArray,workNumber,followType){
	var designerList = document.getElementById('designer_list');
	for(var i=0;i<idArray.length;i++){
		var IPPost = localStorage.getItem("IPPost");
		portraitArray[i] = IPPost + 'image/' + portraitArray[i];
		var oneDesigner = "<li id='designer'>"+
						        "<a id='designer-content' onclick=openPage('"+idArray[i]+"')>"+
						        	"<img id='designer-img' src="+portraitArray[i]+"/>"+
						        	"<div id='designer-info'>"+
						        		"<p id='designer-name'>"+nameArray[i]+"</p>"+
						        		"<div id='work-number-content'>"+
						        			"<p id='work-number-text'>作品数量：</p>"+
						        			"<p id='work-number'>"+workNumber[i]+"</p>"+
						        		"</div>"+
						        	"</div>"+
						        "</a>";
		
		if(followType[i] == "followed" && userId != null && idArray[i] != userId){
			oneDesigner += 		"<button value="+idArray[i]+" onclick=follow(this) style='background-color: white; color: gray; border-color: gray;'>取消关注</button></li>";
		}else if(followType[i] == "unfollow" && userId != null && idArray[i] != userId){
			oneDesigner += 		"<button value="+idArray[i]+" onclick=follow(this)>关注</button></li>";
		}else{
			oneDesigner += "</li>";
		}
		designerList.insertAdjacentHTML(insertType, oneDesigner);
	}
}

//选择标签事件
function addSelect(i){
	var clickButton = $("#button"+i);
	var clickValue = $("#button"+i).val();
	
     if(clickValue>0 && selected<3){
     	selected++;
     	selectTag.push(clickValue);
     	clickButton.css({'background-color':'#93cefb','color':'white','border-color':'#93cefb'});
     	clickButton.val(-clickValue);
     }else if(clickValue<0){
     	selected--;
     	var p=0;
     	selectTagTemp = new Array();
     	for(var i=0;i<selectTag.length;i++){
     		if(selectTag[i] == -clickValue){
     			continue;
     		}else{
     			selectTagTemp[p] = selectTag[i];
     			p++;
     		}
     	}
     	selectTag = selectTagTemp;
     	clickButton.css({'background-color':'white','color':'gray','border-color':'gray'});
		clickButton.val(-clickValue);
     }
     
    chooseSelectType();
}

//选择根据选择的设计师类别进行查询
function chooseSelectType(){
	var tag = "";
     if(selectTag.length != 0 ){
		for(var i=0;i<selectTag.length;i++){
			tag += ";" + selectTag[i];
		}
     }
     if(tag == ""){
     	//将最后的设计师id重置为null;
     	page = 0;
		mui('#designerListContent').pullRefresh().enablePullupToRefresh();
     	getDesignerList();
     }else{
		mui('#designerListContent').pullRefresh().disablePullupToRefresh();
	    getDesignerListByTag(tag);
     }
}

//关注与取消关注
function follow(button){
	var concernId = button.value;
	
	var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'FollowController/setFollow';
	mui.ajax(url, {
	    data: {
	    	userId: userId,
	    	concernId: concernId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("关注失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				if(button.style.backgroundColor != "white"){
					button.style.backgroundColor = "white";
					button.style.color = "gray";
					button.style.borderColor = "gray";
					button.innerHTML = "取消关注";
					mui.toast("已关注设计师");
				}else{
					button.style.backgroundColor = "#93cefb";
					button.style.color = "white";
					button.style.borderColor = "#93cefb";
					button.innerHTML = "关注";
					mui.toast("已取消关注设计师");
				}
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});	
}

//打开设计详情界面
function openPage(designerId){
	mui.openWindow({
	    url: 'designerDetail.html',
	    id: 'designerDetail',
	    extras:{
	        designerId: designerId
	    }
	});
}
