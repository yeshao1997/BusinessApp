function openPage(page){
	if(page == "setting"){
		mui.openWindow({
		    url:'setting.html'
		});
	}
	if(page == "myData"){
		userDataPage = plus.webview.getWebviewById('userData/userData.html');
		mui.fire(userDataPage,'refresh',{});
		mui.openWindow({
		    url:'userData/userData.html'
		});
	}
}

$(document).ready(function(){
	userId = localStorage.getItem("userId");
	if(userId != "" && userId != null){
		$("#loginPage").css({'display':'none'});
		$("#tologin").css({'display':'none'});
		var url = 'http://172.16.41.126:8080/UserDataController/getUserPage';
	  	mui.ajax(url, {
	        data: {
	          'userId': userId
	        },
	        type: "POST",
	        timeout: 3000,
	        error: function(){
	        	mui.toast("网络错误");
	        },
	        success: function(data){
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				if(resultJson.code == 1){
					var userName = resultJson.obj.userName;
					var userType = resultJson.obj.userType;
					var userPortrait = resultJson.obj.userPortrait;
					
					if(userName != null && userName!=""){
						$("#userName").text(userName);
					}
					if(userPortrait != null && userPortrait != ""){
						userPortrait = "http://172.16.41.126:8080/image/" + userPortrait;
						$("#portrait").attr('src',userPortrait);
					}
					if(userType == "1"){
						$("#myAlbum").css({'display':'inline-block'});
						$("#mySell").css({'display':'inline-block'});
					}
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });
	}
}); 

function toLogin(){
	loginPage = plus.webview.getWebviewById('../sign/login.html');
	mui.fire(loginPage,'refresh',{});
	mui.openWindow({
	    url:'../sign/login.html'
	}); 
	//关闭base界面
    plus.webview.getWebviewById('../base/base.html').close();
}

//点击添加图片 
var portrait = document.getElementById('portrait');
portrait.addEventListener('tap', function() {
	plus.gallery.pick(
        function(path) {
            portrait.src = path;
            portrait.onload = function() {
                var data = getBase64Image(portrait);    //base64编码
                uploadimg(data);
            }
        },
        function(e) {
        });
});
      	
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


function uploadimg(data) {
	var url = 'http://172.16.41.126:8080/UserDataController/uploadImage';
	userId = localStorage.getItem("userId");
    mui.ajax(url, {
        data: {
        	userId: userId,
            image: data 
        },
        type: 'post',
        timeout: 10000,
        dataType: 'json',
        error: function(){
        	mui.toast("上传失败，网络错误");
        	return false;
        },
        success: function(data){
        	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				mui.toast(resultJson.msg);
			}else{
				mui.toast(resultJson.msg);
			}
			return true;
        }
    });
}