var albumId;
var albumName;
var IPPost = localStorage.getItem("IPPost");
var portrait = document.getElementById('albumPortrait');

//返回上一个界面时，刷新界面
mui.init({
    beforeback: function() { 
	    var opener = plus.webview.currentWebview().opener();  
	    mui.fire(opener, 'refresh');  
	    return true;  
    }  
}); 

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	albumId = self.albumId;
	if(albumId != "null"){
		getAlbum();
		$("#title").text("修改专辑");
	}
});

function getAlbum(){
	var url = IPPost+'AlbumController/getAlbum';
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
				$("#albumNameInput").val(resultJson.obj.albumName);
				portrait.src = IPPost + "image/" + resultJson.obj.albumImage;
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

portrait.addEventListener('tap', function() {
	plus.gallery.pick(
        function(path) {
            portrait.src = path;
        }
    );
});

function upload(){
	albumName = $("#albumNameInput").val();
	if(albumName != ""){
		var data = getBase64Image(portrait);
	 	var url = IPPost+'AlbumController/addAlbum';
		userId = localStorage.getItem("userId");
	    mui.ajax(url, {
	        data: {
	        	userId: userId,
	        	albumId: albumId,
	            image: data,
	            albumName: albumName
	        },
	        type: 'post',
	        timeout: 10000,
	        dataType: 'json',
	        error: function(){
	        	mui.toast("上传失败，网络错误");
	        },
	        success: function(data){
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				if(resultJson.code == 1){
					openPage('back');
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });
	}else{
		mui.toast("专辑名称不能为空");
	}  
}

function getBase64Image(img){
    var canvas=document.createElement("canvas");
    var width=img.width;
    var height=img.height;

    canvas.width=width;
    canvas.height=height;
    var ctx=canvas.getContext('2d');
    ctx.drawImage(img,0,0,width,height);

    var dataUrl=canvas.toDataURL('image/png',0.8);
    return dataUrl.replace('data:image/png:base64,','');
}
