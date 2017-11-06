var userMail,userPhone,userPassword;

function openPage(page){
	if(page == "back"){
		mui.back();
	}
	if(page == "userMail"){
		mui.openWindow({
		    url:'changeMail.html',
		    extras:{
		        mail: userMail
		    }
		});
	}
}

//监听刷新页面
window.addEventListener('refresh', function(e) {
    location.reload();
})

$(document).ready(function(){
	userId = localStorage.getItem("userId");
	if(userId != "" && userId != null){
		var url = 'http://172.16.41.126:8080/UserDataController/getUserDetail';
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
					userName = resultJson.obj.userName;
					userMail = resultJson.obj.userMail;
					userPhone = resultJson.obj.userPhone;
					
					if(userName != null && userName!=""){
						$("#userName").text(userName);
					}
					if(userMail != null && userMail != ""){
						$("#userMail").text(userMail);
					}
					if(userPhone != null && userPhone!=""){
						$("#userPhone").text(userPhone);
					}
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });
	}
}); 