var IPPost;
var userId;
var albumId;

//返回上一个界面时，刷新界面
mui.init({
    beforeback: function() { 
	    var opener = plus.webview.currentWebview().opener();  
	    mui.fire(opener, 'refresh');  
	    return true;  
    },
    gestureConfig:{
    	longtap: true
  	}
});

//监听刷新页面
window.addEventListener('refresh', function(e) {
    location.reload();
})

mui.plusReady(function () {
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
    var self = plus.webview.currentWebview();
	albumId = self.albumId;
	getWorkList();
});

function openPage(page){
	if(page == "back"){
		mui.back();
	}else if(page == "addWork"){
		mui.openWindow({
		    url: 'addWork.html',
		    id: 'addWork',
		    extras:{
		        albumId: albumId,
		        pageType: "add"
		    }
		});
	}else{
		mui.openWindow({
		    url: '../../work/workDetail.html',
		    id: 'workDetail',
		    extras:{
		        workId: page
		    }
		});
	}
}

function getWorkList(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'WorkController/getWorkList';
	mui.ajax(url, {
	    data: {
	    	albumId: albumId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
				if(resultJson.code == 1){
					buildWorkList(resultJson.obj);
					
					$("#title").text(resultJson.obj1);
					mui('body').on('longtap','li',function(){
						var id = this.getAttribute("value");
						var title = this.getAttribute("value2");
						setWork(id,title);
					},false);
					mui('body').on('tap','li',function(){
						var id = this.getAttribute("value");
						openPage(id);
					},false);
				}else{
					mui.toast(resultJson.msg);
				}
	    }
	});
}

function buildWorkList(obj){
	var idArray = obj.id;
	if(idArray.length == 0){
		$("#notMessage").css("display","block");
	}else{
		var imgArray = obj.img;
		var titleArray = obj.title;
		var timeArray = obj.time;
		var fabulousArray = obj.fabulous;
		var commentArray = obj.comment;
		
		var workContnet = document.getElementById('workList');
		for(var i=0;i<idArray.length;i++){
			var imagePath = IPPost + "image1/" + imgArray[i];
			var workText = "<li id='work' value="+idArray[i]+" value2="+titleArray[i]+">"+
								"<img id='workImg' src="+imagePath+" />"+
								"<p id='workTitle'>"+titleArray[i]+"</p>"+
								"<p id='workTime'>"+timeArray[i]+"</p>"+
								"<div id='workFCContent'>"+
										"<img id='fabulousImg' src='../../../img/user/unfabulous.png'/>"+
										"<p id='fabulousNumber'>"+fabulousArray[i]+"</p>"+
										"<img id='commentImg' src='../../../img/user/comment.png' />"+
										"<p id='commentNumber'>"+commentArray[i]+"</p>"+
									"</div>"+
							"</li>";
			workContnet.insertAdjacentHTML('beforeEnd', workText);
		}
	}
}

function setWork(value,title){
	if (mui.os.plus) { 
		var a = [{title: "修改作品"}, {title: "删除作品"}]; 
		plus.nativeUI.actionSheet({ 
			title: title, 
			cancel: "取消",
			buttons: a 
		}, function(b) { 
　　　	if(b.index-1 == 0){
				updateWork(value);
			}else if(b.index-1 == 1){
				var btnArray = ['否', '是'];
				mui.confirm('您将删除此作品，确认？', '删除作品', btnArray, function(e) {
					if (e.index == 1) {
						deleteWork(value);
					}
				})
			}
		}) 
	} 
}

function deleteWork(workId){
	var url = IPPost+'WorkController/deleteWork';
	mui.ajax(url, {
	    data: {
	    	workId: workId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				location.reload();
				mui.toast(resultJson.msg);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function updateWork(value){
	mui.openWindow({
	    url: 'addWork.html',
	    id: 'addWork',
	    extras:{
	        albumId: albumId,
	        workId: value,
	        pageType: "update"
	    }
	});
}
