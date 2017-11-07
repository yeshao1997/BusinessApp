var phone,userId;

document.addEventListener('plusready', function(){
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
	plus.navigator.setStatusBarBackground("#000000");
});

mui.init();

//获取上个界面传递的值
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	phone = self.phone;
	userId = self.userId;
	$('#phone').text(phone);
}) 

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

function confirmPhone(){
	var newPhone = $("#newPhone-input").val();
	if(newPhone == ""){
		mui.toast("请输入新的电话号码");
	}else if(newPhone.length != 11){
		mui.toast("请输入11位数手机号码");
	}else{
		var IPPost = localStorage.getItem("IPPost");
 		var url = IPPost+'UserDataController/updatePhone';
	    mui.ajax(url, {
	        data: {
	          'userId': userId,
	          'newPhone': newPhone
	        },
	        type: "POST",
	        timeout: 3000,
	        error: function(){
	        	mui.toast("修改失败，网络错误");
	        },
	        success: function(data){
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				var registerCode = resultJson.code;
				if(registerCode == 1){
					mui.openWindow({
						url: "changePhoneSuccess.html",
						id: 'changePhoneSuccess'
					});
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });    
	}
}