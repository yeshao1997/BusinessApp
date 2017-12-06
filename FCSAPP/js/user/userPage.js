function openPage(page){
	if(page == "setting"){
		mui.openWindow({
		    url: 'userSetting/setting.html',
		    id: 'setting'
		});
	}else if(page == "myData"){
		userDataPage = plus.webview.getWebviewById('userData/userData.html');
		mui.fire(userDataPage,'refresh',{});
		mui.openWindow({
		    url: 'userData/userData.html',
		    id: 'userData'
		});
	}else if(page == "myAlbum"){
		userDataPage = plus.webview.getWebviewById('userWork/userAlbum.html');
		mui.fire(userDataPage,'refresh',{});
		mui.openWindow({
		    url: 'userWork/userAlbum.html',
		    id: 'userAlbum'
		});
	}else if(page == "myPurchase"){
		mui.openWindow({
		    url: 'userPurchase/userPurchase.html',
		    id: 'userPurchase'
		});
	}else if(page == "mySell"){
		mui.openWindow({
		    url: 'userSell/userSell.html',
		    id: 'userSell'
		});
	}else if(page == "myCollect"){
		mui.openWindow({
		    url: 'userCollect/userCollect.html',
		    id: 'userCollect'
		});
	}else if(page == "myComment"){
		mui.openWindow({
		    url: 'userComment/userComment.html',
		    id: 'userComment'
		});
	}else if(page == "myFollow"){
		mui.openWindow({
		    url: 'userFollow/userFollow.html',
		    id: 'userFollow'
		});
	}else if(page == "myFans"){
		mui.openWindow({
		    url: 'userFans/userFans.html',
		    id: 'userFans'
		});
	}
}

//监听刷新页面
window.addEventListener('getUnRead', function(e) {
    getUnRead();
})

$(document).ready(function(){
	userId = localStorage.getItem("userId");
	if(userId != "" && userId != null){
		$("#loginPage").css({'display':'none'});
		$("#tologin").css({'display':'none'});
		var IPPost = localStorage.getItem("IPPost");
 		var url = IPPost+'UserDataController/getUserPage';
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
						var IPPost = localStorage.getItem("IPPost");
						userPortrait = IPPost + 'image/' + userPortrait;
						$("#portrait").attr('src',userPortrait);
					}
					if(userType == "1"){
						$("#myAlbum").css({'display':'inline-block'});
						$("#mySell").css({'display':'inline-block'});
						getUnRead();
					}
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });
	}
}); 

function toLogin(){
	var wvs = plus.webview.all(); 
	var loginPage = plus.webview.getWebviewById("login");
	mui.fire(loginPage,'refresh',{});
	var self = plus.webview.currentWebview(); 
	for(var i = 0, len = wvs.length; i < len; i++) {
		if(wvs[i].id === loginPage.id || wvs[i].id === self.id || wvs[i].id === localStorage.homeWebId) {  　　  	  
　　　		continue;  
　　　	}else{  
　　　　　　	wvs[i].close('none');  
　　　	} 
　　	}
　　	self.close('slide-out-right');
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
	var IPPost = localStorage.getItem("IPPost");
 	var url = IPPost+'UserDataController/uploadImage';
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

function getUnRead(){
	var IPPost = localStorage.getItem("IPPost");
	var userId = localStorage.getItem("userId");
	var url = IPPost+'PurchaseController/getUnRead';
	mui.ajax(url, {
	    data: {
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("网络错误");
	    	console.log("获取设计师未读购买意愿失败");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				if(resultJson.obj > 0){
					$("#prompt").css("display","block");
				}else{
					$("#prompt").css("display","none");
				}
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}
