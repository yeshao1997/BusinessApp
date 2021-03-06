var designerId;
var follow;
var userId;
var IPPost;

mui.init({
    beforeback: function() { 
	    var list = plus.webview.currentWebview().opener();  
	    mui.fire(list, 'refresh');  
	    return true;  
    }  
});

//获取上个界面传递的值
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	designerId = self.designerId;
});

function openPage(page,value){
	if(page == "back"){
		mui.back();
	}else if(page == "album"){
		mui.openWindow({
		    url: 'designerDetailWork.html',
		    id: 'designerDetailWork',
		    extras:{
		        albumId: value
		    }
		});
	}else if(page == "designerFollow"){
		mui.openWindow({
		    url: 'designerFollow.html',
		    id: 'designerFollow',
		    extras:{
		        designerId: designerId
		    },
		    createNew: true
		});
	}
}

document.addEventListener('plusready', function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'DesignerController/getDesigner';
	mui.ajax(url, {
	    data: {
	    	designerId: designerId,
	    	userId: userId
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
				var designerName = resultJson.obj.designerName;
				var designerPortrait = resultJson.obj.designerPortrait;
				var designerFollow = resultJson.obj.designerFollow;
				var designerFans = resultJson.obj.designerFans;
				var followType = resultJson.obj.followType;
				var albumMsg = resultJson.obj1;
				
				buildPage(designerName,designerPortrait,designerFollow,designerFans,followType);
				buildAlbum(albumMsg);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
});

function buildPage(designerName,designerPortrait,designerFollow,designerFans,followType){
	//用户名
	$("#designerName").text(designerName);
	//用户头像
	if(designerPortrait != null){
		var IPPost = localStorage.getItem("IPPost");
		designerPortrait = IPPost + 'image/' + designerPortrait;
		document.getElementById('portrait').src = designerPortrait;
	}
	//关注数
	$("#followNumber").text(designerFollow);
	//粉丝数
	$("#fansNumber").text(designerFans);
	if(userId != null && designerId != userId ){
		if(followType == "followed"){
			follow = 0;
			$("#followImg").attr('src','../../img/home/follow.png');
		}else{
			follow = 1;
			$("#followImg").attr('src','../../img/home/unfollow.png');
		}
	}else{
		$("#followImg").css("display","none");
	}
	
}

function buildAlbum(albumMsg){
	var albumId = albumMsg.albumId;
	var albumPortrait = albumMsg.albumPortrait;
	var albumName = albumMsg.albumName;
	var workNumber = albumMsg.workNumber;
	
	var albumContent = document.getElementById('album-table');
	var text="";
	for(var i=0;i<albumId.length;i++){
		if(i==0){
			text += "<tr>";
		}else if(i%2 == 0 && i!=0){
			text += "</tr><tr>";
		}
		
		var defultPortrait;
		if(albumPortrait[i] != "null" && albumPortrait[i] != ""){
			defultPortrait = IPPost + "image1/" + albumPortrait[i];
		}else{
			defultPortrait = "../../img/home/defultPortrait.png";
		}
		text += "<td id='album'>"+
					"<a onclick=openPage("+'"album"'+",'"+albumId[i]+"')>"+
						"<div id='album-img-content'>"+	
							"<img id='album-img' src="+defultPortrait+" />"+
				        "</div>"+
				        "<div id='album-info'>"+
				        	"<p id='album-name'>"+albumName[i]+"</p>"+
				        	"<img id='album-work-img' src='../../img/home/floder.png' />"+
				        	"<p id='album-work-number'>"+workNumber[i]+"</p>"+
				        "</div>"+
				    "</a>"+
				"</td>";
		
		if(i==albumId.length-1){
			text += "</tr>";
		albumContent.insertAdjacentHTML('beforeEnd',text);
		}
	}
}

function setFollow(){
	var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'FollowController/setFollow';
	mui.ajax(url, {
	    data: {
	    	userId: userId,
	    	concernId: designerId
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
				if(follow != 0){
					follow = 0;
					$("#followImg").attr('src','../../img/home/follow.png');
					mui.toast("已关注设计师");
				}else{
					follow = 1;
					$("#followImg").attr('src','../../img/home/unfollow.png');
					mui.toast("已取消关注设计师");
				}
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});	
}
