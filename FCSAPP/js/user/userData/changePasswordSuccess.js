document.addEventListener('plusready', function(){
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
	plus.navigator.setStatusBarBackground("#000000");
});

mui.init();

localStorage.removeItem("userId");
localStorage.removeItem("account");
localStorage.removeItem("password");

function openPage(page){
	if(page == "myData"){
		var wvs = plus.webview.all(); 
		var loginPage = plus.webview.getWebviewById("login");
		mui.fire(loginPage,'refresh',{});
		var self = plus.webview.currentWebview(); 
		for(var i = 0, len = wvs.length; i < len; i++) {
			if(wvs[i].id === loginPage.id || wvs[i].id === self.id || wvs[i].id === localStorage.homeWebId) {  　　  	  
	　　　		continue;  
	　　　	}else{  
	　　　　　　	wvs[i].close('none');  
	　　　	}  
	　　	}
	　　	self.close('slide-out-right');
	}
}

mui.back=function () {
	var wvs = plus.webview.all(); 
	var loginPage = plus.webview.getWebviewById("login");
	mui.fire(loginPage,'refresh',{});
	var self = plus.webview.currentWebview(); 
	for(var i = 0, len = wvs.length; i < len; i++) {
		if(wvs[i].id === loginPage.id || wvs[i].id === self.id || wvs[i].id === localStorage.homeWebId) {  　　  	  
　　　		continue;  
　　　	}else{  
　　　　　　	wvs[i].close('none');  
　　　	}  
　　	}
　　	self.close('slide-out-right');
}