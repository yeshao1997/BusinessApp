var IPPost;
var userId;
var albumId

//返回上一个界面时，刷新界面
mui.init({
    beforeback: function() { 
	    var opener = plus.webview.currentWebview().opener();  
	    mui.fire(opener, 'refresh');  
	    return true;  
    }  
});

//监听刷新页面
window.addEventListener('refresh', function(e) {
    location.reload();
})

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	albumId = self.albumId;
	getWorkList();
});

function openPage(page){
	if(page == "back"){
		mui.back();
	}
	if(page == "addWork"){
		mui.openWindow({
		    url: 'addWork.html',
		    id: 'addWork',
		    extras:{
		        albumId: albumId,
		        pageType: "add"
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
//					mui('body').on('longtap','a',function(){
//						var value = this.getAttribute("value");
//						setAlbum(value);
//					},false);
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
			var workText = "<li id='work' class='mui-table-view-cell'>"+
								"<img id='workImg' src="+imagePath+" />"+
								"<p id='workTitle'>"+titleArray[i]+"</p>"+
								"<p id='workTime'>"+timeArray[i]+"</p>"+
								"<div id='workFCContent'>"+
									"	<img id='fabulousImg' src='../../../img/user/unfabulous.png'/>"+
										"<p id='fabulousNumber'>"+fabulousArray[i]+"</p>"+
										"<img id='commentImg' src='../../../img/user/comment.png' />"+
										"<p id='commentNumber'>"+commentArray[i]+"</p>"+
									"</div>"+
							"</li>";
			workContnet.insertAdjacentHTML('beforeEnd', workText);
		}
	}
}
