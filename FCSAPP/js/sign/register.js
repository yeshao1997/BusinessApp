//返回登录界面时，刷新登录界面
mui.init({  
    beforeback: function() { 
	    var list = plus.webview.currentWebview().opener();  
	    mui.fire(list, 'refresh');  
	    return true;  
    }  
}); 

//防止键盘挤压背景图片
var originalHeight=document.documentElement.clientHeight || document.body.clientHeight;
window.onresize=function(){
    //软键盘弹起与隐藏  都会引起窗口的高度发生变化
    var  resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
    //resizeHeight<originalHeight证明窗口被挤压了
    if(resizeHeight*1<originalHeight*1){
        plus.webview.currentWebview().setStyle({
            height:originalHeight
        });
    }
}

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

//注册信息验证
function next(){
	var account = $("#register-account-input").val();
	var password = $("#register-password-input").val();
	var password_confirm = $("#register-password-confirm-input").val();
	var register_type = $("input[name='register-type']:checked").val();
	
	if(account == ""){
		mui.toast("用户名不能为空");
	}else if(account.length < 3){
		mui.toast("用户名长度不能小于2");
	}else if(password == ""){
		mui.toast("密码不能为空");
	}else if(password.length < 6){
		mui.toast("密码长度不能小于6");
	}else if(password_confirm == ""){
		mui.toast("请确认密码");
	}else if(password != password_confirm){
		mui.toast("两次输入密码不相同");
	}else{
		var IPPost = localStorage.getItem("IPPost");
 		var url = IPPost+'AccountController/registerConfirm';
      	mui.ajax(url, {
	        data: {
	          'account': account
	        },
	        type: "POST",
	        timeout: 3000,
	        error: function(){
	        	mui.toast("验证失败，网络错误");
	        },
	        success: function(data){
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				var registerCode = resultJson.code;
				if(registerCode == 1){
					mui.openWindow({
					    url: 'register-mail.html',
					    id: 'register-mail',
					    extras:{
					        account: account,
					        password: password,
					        type: register_type
					    }
					});
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });
	}
}