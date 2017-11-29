var IPPost;
var userId;

mui.init({
  gestureConfig:{
    longtap: true
  }
});

function openPage(page){
	if(page == "back"){
		mui.back();
	}else if(page == "addAlbum"){
		mui.openWindow({
		    url: 'addAlbum.html',
		    id: 'addAlbum',
		    extras:{
		        albumId: "null"
		    }
		});
	}else{
		mui.openWindow({
		    url: 'userWork.html',
		    id: 'userWork',
		    extras:{
		        albumId: page
		    }
		});
	}
}

//监听刷新页面
window.addEventListener('refresh', function(e) {
    location.reload();
})

document.addEventListener('plusready', function(){
	getMyAlbum();
});

function getMyAlbum(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'AlbumController/getAlbumList';
	mui.ajax(url, {
	    data: {
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
					buildAlbum(resultJson.obj);
					
					mui('body').on('longtap','a',function(){
						var value = this.getAttribute("value");
						var title = this.getAttribute("value2");
						setAlbum(value,title);
					},false);
				}else{
					mui.toast(resultJson.msg);
				}
	    }
	});
}

function buildAlbum(obj){
	var albumId = obj.albumId;
	var albumPortrait = obj.albumPortrait;
	var albumName = obj.albumName;
	var workNumber = obj.workNumber;
	
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
			defultPortrait = "../../../img/user/defultPortrait.png";
		}
		var defultId;
		if(albumName[i] == "默认专辑"){
			defultId = "-1";
		}else{
			defultId = albumId[i];
		}
		
		text += "<td id='album'>"+
							"<a id='albumClick' value="+defultId+" value2="+albumName[i]+" onclick=openPage('"+albumId[i]+"')>"+
								"<div id='album-img-content'>"+	
									"<img id='album-img' src="+defultPortrait+" />"+
						        "</div>"+
						        "<div id='album-info'>"+
						        	"<p id='album-name'>"+albumName[i]+"</p>"+
						        	"<img id='album-work-img' src='../../../img/user/floder.png' />"+
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

function setAlbum(value,title){
	if(value != "-1"){
		if (mui.os.plus) { 
			var a = [{title: "修改专辑"}, {title: "删除专辑"}]; 
			plus.nativeUI.actionSheet({ 
				title: title, 
				cancel: "取消",
				buttons: a 
			}, function(b) { 
	　　　	if(b.index-1 == 0){
					updateAlbum(value);
				}else if(b.index-1 == 1){
					var btnArray = ['否', '是'];
					mui.confirm('您将删除此专辑，确认？', '删除专辑', btnArray, function(e) {
						if (e.index == 1) {
							deleteAlbum(value)
						}
					})
				}
			}) 
	　} 
	}
}

function deleteAlbum(albumId){
	var url = IPPost+'AlbumController/deleteAlbum';
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
					location.reload();
					mui.toast(resultJson.msg);
				}else{
					mui.toast(resultJson.msg);
				}
	    }
	});
}

function updateAlbum(albumId){
	mui.openWindow({
		    url: 'addAlbum.html',
		    id: 'addAlbum',
		    extras:{
		        albumId: albumId
		    }
		});
}
