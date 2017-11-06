document.addEventListener('plusready', function(){
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
	plus.navigator.setStatusBarBackground("#000000");
});
mui.init();

//监听刷新页面
window.addEventListener('refresh', function(e) {
    location.reload();
})

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
		localStorage.removeItem("userId");
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

//登录成功时执行方法
function succFunction(data){
	var resultJson = JSON.parse(JSON.stringify( data ));
	var loginCode = resultJson.code;
	if(loginCode == 1){
		localStorage.setItem("userId",resultJson.obj);
		mui.openWindow({
			url:'../base/base.html'
		})
	}else{
		mui.toast(resultJson.msg);
	}

}


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

//实现双击退出引用，不返还登录界面
mui.oldback = mui.back;
var clickNum = 0;
mui.back = function(event){
   clickNum++;
   if(clickNum > 1){
       plus.runtime.quit();
   }else{
       mui.toast("再按一次退出应用");
   }
   setTimeout(function(){
       clickNum = 0
   },1000);
        return false;
}
