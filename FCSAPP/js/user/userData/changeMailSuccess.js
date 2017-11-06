document.addEventListener('plusready', function(){
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
	plus.navigator.setStatusBarBackground("#000000");
});

mui.init();

function openPage(page){
	if(page == "myData"){
		var userPage = plus.webview.getWebviewById("userData/userData.html");
		var changeMail = plus.webview.getWebviewById("changeMail.html");
		var confirmMail = plus.webview.getWebviewById("confirmMail.html");
		var thisPage = plus.webview.currentWebview();
		mui.fire(userPage,'refresh',{});
		changeMail.close('none');
		confirmMail.close('none');
		thisPage.close('none');
	}
}

mui.back=function () {
	var userPage = plus.webview.getWebviewById("userData/userData.html");
	var changeMail = plus.webview.getWebviewById("changeMail.html");
	var confirmMail = plus.webview.getWebviewById("confirmMail.html");
	var thisPage = plus.webview.currentWebview();
	mui.fire(userPage,'refresh',{});
	changeMail.close('none');
	confirmMail.close('none');
	thisPage.close('none');
}