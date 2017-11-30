function openPage(page,value){
	if(page == "back"){
		mui.back();
	}
}

document.addEventListener('plusready', function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	var self = plus.webview.currentWebview();
	$("#commentContent").text(self.commentContent);
	
});