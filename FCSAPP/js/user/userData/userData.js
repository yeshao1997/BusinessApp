var userMail,userPhone,userPassword,userId;

function openPage(page){
	if(page == "back"){
		mui.back();
	}
	if(page == "userMail"){
		mui.openWindow({
		    url:'changeMail.html',
		    id: 'changeMail',
		    extras:{
		        mail: userMail
		    }
		});
	}
	if(page == "userPhone"){
		mui.openWindow({
		    url:'changePhone.html',
		    id: 'changePhone',
		    extras:{
		        phone: userPhone,
		        userId: userId
		    }
		});
	}
	if(page == "userPassword"){
		mui.openWindow({
		    url: 'changePassword.html',
		    id: 'changePassword',
		    extras:{
		        userId: userId
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
		var IPPost = localStorage.getItem("IPPost");
 		var url = IPPost+'UserDataController/getUserDetail';
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