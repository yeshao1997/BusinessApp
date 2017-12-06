
//监听刷新页面
window.addEventListener('refresh', function(e) {
    location.reload();
});

document.addEventListener('plusready', function(){
	getFollowList();
});

function openPage(page,value){
	if(page == "back"){
		mui.back();
	}else if(page == "designerDetail"){
		mui.openWindow({
		    url: '../../home/designerDetail.html',
		    id: 'designerDetail',
		    extras:{
		        designerId: value
		    }
		});
	}
}

function getFollowList(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'FollowController/getUserFollow';
	mui.ajax(url, {
	    data: {
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取关注列表失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				buildFollowList(resultJson.obj);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function buildFollowList(obj){
	var designerIdArray = obj.designerId;
	var portraitArray = obj.portrait;
	var designerNameArray = obj.designerName;
	if(designerIdArray.length == 0){
		$("#notMessage").css("display","block");
	}else{
		var followContent = document.getElementById('followList');
		for(var i=0;i<designerIdArray.length;i++){
			if(designerIdArray[i] != ""){
				var imageDefult = IPPost + "image/" + portraitArray[i];
				var follow = "<li id='follow' onclick=openPage("+'"designerDetail"'+",'"+designerIdArray[i]+"')>"+
					    		"<a id='clickA'>"+
					    			"<img id='portrait' src="+imageDefult+" />"+
					    			"<p id='designerName'>"+designerNameArray[i]+"</p>"+
					    		"</a>"+
					    	"</li>";
				followContent.insertAdjacentHTML('beforeend', follow);
			}
		}
	}
	
}