var IPPost;
var userId;

mui.init({
    gestureConfig:{
    	longtap: true
  	}
});

function openPage(page,value,extra){
	if(page == "back"){
		mui.back();
	}else if(page == "userCommentDetail"){
		mui.openWindow({
		    url: 'userCommentDetail.html',
		    id: 'userCommentDetail',
		    extras:{
		        commentContent: value
		    }
		});
	}else if(page == "informationDetail"){
		if(extra == "1"){
			mui.openWindow({
			    url: '../../home/informationDetail.html',
			    id: 'informationDetail',
			    extras:{
			        informationId: value
			    }
			});
		}else if(extra == "2"){
			mui.openWindow({
			    url: '../../work/workDetail.html',
			    id: 'workDetail',
			    extras:{
			        workId: value
			    }
			});
		}else if(extra == "3"){
			mui.openWindow({
			    url: '../../cloth/clothDetail.html',
			    id: 'clothDetail',
			    extras:{
			        clothId: value
			    }
			});
		}else if(extra == "4"){
			console.log(value);
			mui.openWindow({
			    url: '../../costume/costumeDetail.html',
			    id: 'costumeDetail',
			    extras:{
			        costumeId: value
			    }
			});
		}
	}
}

document.addEventListener('plusready', function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});;
	getUserCommentData();
});

function getUserCommentData(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'CommentController/getUserCommentList';
	mui.ajax(url, {
	    data: {
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取我的评论失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				buildUserCommentList(resultJson.obj);
				
				mui('body').on('longtap','li',function(){
					var id = this.getAttribute("value");
					setComment(id);
				},false);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function buildUserCommentList(obj){
	var idArray = obj.id;
	var commentArray = obj.comment;
	var timeArray = obj.time;
	var informationArray = obj.information;
	var informationTitleArray = obj.informationTitle;
	var informationType = obj.informationType;
	
	var commentContent = document.getElementById('commentList');
	for(var i=0;i<idArray.length;i++){
		var commentText = "<li id='comment' value="+idArray[i]+">"+
								"<div id='commentTextContent' onclick=openPage("+'"userCommentDetail"'+",'"+commentArray[i]+"')>"+
					    			"<p id='commentText'>"+commentArray[i]+"</p>"+
									"<p id='commentTime'>"+timeArray[i]+"</p>"+
								"</div>"+
					    		"<hr/>"+
					    		"<div id='informationContent' onclick=openPage("+'"informationDetail"'+",'"+informationArray[i]+"','"+informationType[i]+"')>"+
					    			"<p id='informationTitle'>"+informationTitleArray[i]+"</p>"+
					    		"</div>"+
					    	"</li>";
		commentContent.insertAdjacentHTML('beforeend', commentText);
	}
}

function setComment(value){
	if (mui.os.plus) { 
		var a = [{title: "删除评论"}]; 
		plus.nativeUI.actionSheet({ 
			title: "我的评论", 
			cancel: "取消",
			buttons: a 
		}, function(b) { 
　　　	if(b.index-1 == 0){
				var btnArray = ['否', '是'];
				mui.confirm('您将删除此作品，确认？', '删除作品', btnArray, function(e) {
					if (e.index == 1) {
						deleteComment(value);
					}
				})
			}
		}) 
	} 
}

function deleteComment(commentId){
	var url = IPPost+'CommentController/deleteComment';
	mui.ajax(url, {
	    data: {
	    	commentId: commentId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("删除评论失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				mui.toast(resultJson.msg);
				location.reload();
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function deleteAllComment(){
	var btnArray = ['否', '是'];
	mui.confirm('确认清除所有评论？', '清空评论', btnArray, function(e) {
		if (e.index == 1) {
			var url = IPPost+'CommentController/deleteAllComment';
			mui.ajax(url, {
			    data: {
			    	userId: userId
			    },
			    type: "POST",
			    timeout: 3000,
			    traditional: true,
			    error: function(){
			    	mui.toast("删除评论失败，网络错误");
			    },
			    success: function(data){
			    	var resultJson = JSON.parse(JSON.stringify( data ));
					if(resultJson.code == 1){
						mui.toast(resultJson.msg);
						location.reload();
					}else{
						mui.toast(resultJson.msg);
					}
			    }
			});
		}
	})
}
