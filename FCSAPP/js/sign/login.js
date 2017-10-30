function openPage(page){
	if(page == "register"){
		mui.openWindow({
		    url:'register.html'
		});
	}else if(page == "forget"){
		mui.openWindow({
		    url:'forget.html'
		});
	}else if(page == "homePage"){
		mui.openWindow({
		    url:'../base/base.html'
		});
	}
}

//执行登录前数据格式检测
function formatConfirm(){
	var account = $("#account-input").val();
	var password = $("#password-input").val();
	
	if(account == ""){
		mui.toast("请输入账号");
	}else if(password == ""){
		mui.toast("请输入密码");
	}else{
		login();
	}
}

//执行登录
function login(){
	var account = $("#account-input").val();
	var password = $("#password-input").val();

 	var url = 'http://172.16.41.126:8080/AccountController/login';
      mui.ajax(url, {
        data: {
          'account': account,
          'password': password
        },
        type: "POST", 
        timeout:3000,
        beforeSend: function(){
        	$("#submit").attr('disabled',"true");
        },
        success: succFunction,
        complete: function () {
			$("#submit").removeAttr("disabled");
	    },
        error: function(){
        	mui.toast("登录失败，网络错误");
        }
      });
}

//登录错误时执行方法    
function erryFunction(xhr,type,errorThrown){
	//异常处理；
	mui.toast("登录失败，网络错误");
}

//登录成功时执行方法
function succFunction(data){
	var resultJson = JSON.parse(JSON.stringify( data ));
	var loginCode = resultJson.code;
	if(loginCode == 1){
		mui.openWindow({
			url:'../base/base.html',
			extras:{
				userId: resultJson.obj
			}
		})
	}else{
		mui.toast(resultJson.msg);
	}

}
