function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

function existLogin(){
	localStorage.removeItem("userId");
	
	loginPage = plus.webview.getWebviewById('../sign/login.html');
	mui.fire(loginPage,'refresh',{});
	mui.openWindow({
	    url:'../sign/login.html'
	}); 
	//关闭base界面
    plus.webview.getWebviewById('../base/base.html').close();
}
