function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

function existLogin(){
	localStorage.removeItem("userId");
	localStorage.removeItem("account");
	localStorage.removeItem("password");
	
	loginPage = plus.webview.getWebviewById('login');
	mui.fire(loginPage,'refresh',{});
	mui.openWindow({
	    url: '../sign/login.html',
	    id: 'login'
	}); 
	//关闭base界面
	plus.webview.getWebviewById('base').close('none');
}
