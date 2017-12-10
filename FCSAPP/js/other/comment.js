var informationId;
var informationType;
var IPPost;

mui.init({
    beforeback: function() { 
	    var opener = plus.webview.currentWebview().opener();  
	    mui.fire(opener, 'refreshComment');  
	    return true;  
    }
});

function openPage(page,value){
	if(page == "back"){
		mui.back();
	}else if(page == "commentDetail"){
		mui.openWindow({
		    url: 'commentDetail.html',
		    id: 'commentDetail',
		    extras:{
		        commentContent: value
		    }
		});
	}
}

document.addEventListener('plusready', function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	var self = plus.webview.currentWebview();
	informationId = self.informationId;
	informationType = self.informationType;
	getCommentData();
});

function getCommentData(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'CommentController/getCommentList';
	mui.ajax(url, {
	    data: {
	    	informationId: informationId,
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取评论失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				buildCommentList(resultJson.obj);
				
				mui('body').on('tap','img',function(){
						var commentaryId = this.getAttribute("value");
						var FCType = this.getAttribute("value2");
						fabulous(commentaryId,FCType);
					},false);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function buildCommentList(obj){
	var idArray = obj.id;
	var commentArray = obj.comment;
	var commentorArray = obj.commentor;
	var timeArray = obj.time;
	var fabulousNumber = obj.number;
	var fabulousType = obj.type;
	
	var commentContent = document.getElementById('commentList');
	for(var i=0;i<idArray.length;i++){
		var floor = "#"+(i+1);
		if(fabulousType[i] == "fabulous"){
			var imageText = "<img id='commentFabulous' src='../../img/other/fabulous.png' value="+idArray[i]+" value2="+0+"></img>"
		}else{
			var imageText = "<img id='commentFabulous' src='../../img/other/unfabulous.png' value="+idArray[i]+" value2="+1+"></img>"
		}
		var commentText = "<li id='comment' onclick=openPage("+'"commentDetail"'+",'"+commentArray[i]+"')>"+
								"<p id='commentFloor'>"+floor+"</p>"+
								"<p id='commentor'>"+commentorArray[i]+"</p>"+
								"<p id='commentText'>"+commentArray[i]+"</p>"+
								"<p id='commentTime'>"+timeArray[i]+"</p>"+
								imageText+
								"<p id='commentFabulousNumber'>"+fabulousNumber[i]+"</p>"+
							"</li>";
		commentContent.insertAdjacentHTML('beforeend', commentText);
	}
}

function publishComment(){
	var comment = $("#publishInput").val();
	if(userId == ""){
		mui.toast("登录后才能评论")
	}else if(comment == ""){
		mui.toast("评论内容不能为空");
	}else{
		var url = IPPost+'CommentController/publishComment';
		mui.ajax(url, {
		    data: {
		    	userId: userId,
		    	comment: comment,
		    	informationId: informationId,
		    	informationType: informationType
		    },
		    type: "POST",
		    timeout: 3000,
		    traditional: true,
		    error: function(){
		    	mui.toast("获取发表评论失败，网络错误");
		    },
		    success: function(data){
		    	var resultJson = JSON.parse(JSON.stringify( data ));
				if(resultJson.code == 1){
					location.reload();
				}else{
					mui.toast(resultJson.msg);
				}
		    }
		});
	}
}

function fabulous(commentaryId,FCType){
	var userId = localStorage.getItem("userId");
	if(userId != ""){
		var url = IPPost+'FabulousController/fabulous';
		mui.ajax(url, {
		    data: {
		    	informationId: commentaryId,
		    	userId: userId,
		    	FCType: FCType
		    },
		    type: "POST",
		    timeout: 3000,
		    traditional: true,
		    error: function(){
		    	mui.toast("点赞失败，网络错误");
		    },
		    success: function(data){
		    	var resultJson = JSON.parse(JSON.stringify( data ));
				if(resultJson.code == 1){
					location.reload();
				}else{
					mui.toast(resultJson.msg);
				}
		    }
		});
	}else{
		mui.toast("登录后才能进行此操作");
	}
}