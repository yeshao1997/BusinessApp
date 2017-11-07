document.addEventListener('plusready', function(){
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
	plus.navigator.setStatusBarBackground("#000000");
});

mui.init();

//实现双击退出引用，不返回上一页面
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
	if(page == "homePage"){
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