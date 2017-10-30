function openPage(page){
	if(page == "homePage"){
		var wvs = plus.webview.all(); 
		var launch = plus.webview.getLaunchWebview();
		var self = plus.webview.currentWebview(); 
		for(var i = 0, len = wvs.length; i < len; i++) {
			if(wvs[i].id === launch.id || wvs[i].id === self.id || wvs[i].id === localStorage.homeWebId) {  　　  	  
	　　　		continue;  
	　　　	}else{  
	　　　　　　	wvs[i].close('none');  
	　　　	}  
	　　	}
	　　	self.close('slide-out-right');
	}  
}