document.addEventListener('plusready', function(){
	getFansList();
});

function openPage(page,value){
	if(page == "back"){
		mui.back();
	}
}

function getFansList(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'FollowController/getUserFans';
	mui.ajax(url, {
	    data: {
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取粉丝列表失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				buildFansList(resultJson.obj);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function buildFansList(obj){
	var designerIdArray = obj.designerId;
	var portraitArray = obj.portrait;
	var designerNameArray = obj.designerName;
	if(designerIdArray.length == 0){
		$("#notMessage").css("display","block");
	}else{
		var fansContent = document.getElementById('fansList');
		for(var i=0;i<designerIdArray.length;i++){
			if(designerIdArray[i] != ""){
				var imageDefult = IPPost + "image/" + portraitArray[i];
				var follow = "<li id='fans'>"+
					    		"<a id='clickA'>"+
					    			"<img id='portrait' src="+imageDefult+" />"+
					    			"<p id='designerName'>"+designerNameArray[i]+"</p>"+
					    		"</a>"+
					    	"</li>";
				fansContent.insertAdjacentHTML('beforeend', follow);
			}
		}
	}
	
}