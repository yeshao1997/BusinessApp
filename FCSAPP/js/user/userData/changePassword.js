var userId;

document.addEventListener('plusready', function(){
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
	plus.navigator.setStatusBarBackground("#000000");
});

mui.init();

//获取上个界面传递的值
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	userId = self.userId;
})

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

function confirmPassword(){
	var oldPassword = $("#oldPassword-input").val();
	var newPassword = $("#password-input").val();
	var confirmPassword = $("#confirmPassword-input").val();
	if(oldPassword == ""){
		mui.toast("请输入原密码");
	}else if(newPassword == ""){
		mui.toast("请输入新密码");
	}else if(confirmPassword == ""){
		mui.toast("请确认新密码");
	}else if(newPassword != confirmPassword){
		mui.toast("两次输入新密码不同");
	}else{
		var IPPost = localStorage.getItem("IPPost");
 		var url = IPPost+'AccountController/updatePasswordByOldPassword';
	    mui.ajax(url, {
	        data: {
	          'userId': userId,
	          'oldPassword': oldPassword,
	          'newPassword': newPassword
	        },
	        type: "POST",
	        timeout: 3000,
	        error: function(){
	        	mui.toast("修改密码失败，网络错误");
	        },
	        success: function(data){
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				var registerCode = resultJson.code;
				if(registerCode == 1){
					mui.openWindow({
						url: "changePasswordSuccess.html",
						id: 'changePasswordSuccess'
					});
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });    
	}
}