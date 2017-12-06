function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

function uploadFeedBack(){
	var text = $("#feedbackMsg").val();
	if(text == ""){
		mui.toast("意见不能为空");
	}else{
		$("#msgContent").css("display","none");
		$("#successContent").css("display","block");
		mui.toast("意见提交成功");
	}
	
}
