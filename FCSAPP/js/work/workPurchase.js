var workId;
var designerId;
var workName;
var designerName;
var userId;
var IPPost;

var purchaseMsg;
var buyerName;
var buyerPhone;
var buyerMail;

var type = 0;

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    workId = self.workId;
    designerId = self.designerId;
    workName = self.workName;
    designerName = self.designerName;
    
    userId = localStorage.getItem("userId");
    IPPost = localStorage.getItem("IPPost");

	$("#designer").text(designerName)
	$("#work").text(workName);
	getUserData();
});

function getUserData(){
	var url = IPPost+'UserDataController/getUserDataToPurchase';
	mui.ajax(url, {
	    data: {
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取个人信息出错，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				buyerName = resultJson.obj.userName;
				buyerPhone = resultJson.obj.userPhone;
				buyerMail = resultJson.obj.userMail;
			
				$("#buyerName").text(buyerName);
				$("#buyerPhone").text(buyerPhone);
				$("#buyerMail").text(buyerMail);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function changeInfo(){
	$("#changeBuyerInfo").css("display","none");
	$("#buyerName").css("display","none");
	$("#buyerPhone").css("display","none");
	$("#buyerMail").css("display","none");
	$("#changeBuyerInfoOver").css("display","block");
	$("#buyerNameInput").css("display","block");
	$("#buyerPhoneInput").css("display","block");
	$("#buyerMailInput").css("display","block");
	
	$("#buyerNameInput").val(buyerName);
	$("#buyerPhoneInput").val(buyerPhone);
	$("#buyerMailInput").val(buyerMail);
	
	var type = 1;
}

function changeInfoOver(){
	buyerName = $("#buyerNameInput").val();
	buyerPhone = $("#buyerPhoneInput").val();
	buyerMail = $("#buyerMailInput").val();
	if(buyerName == ""){
		mui.toast("请输入您的姓名");
	}else if(buyerPhone == "" && buyerMail == ""){
		mui.toast("邮箱与电话不能全为空");
	}else{
		$("#changeBuyerInfo").css("display","block");
		$("#buyerName").css("display","block");
		$("#buyerPhone").css("display","block");
		$("#buyerMail").css("display","block");
		$("#changeBuyerInfoOver").css("display","none");
		$("#buyerNameInput").css("display","none");
		$("#buyerPhoneInput").css("display","none");
		$("#buyerMailInput").css("display","none");
		
		$("#buyerName").text(buyerName);
		$("#buyerPhone").text(buyerPhone);
		$("#buyerMail").text(buyerMail);
		type = 0;
	}
}

function beforeSubmit(){
	purchaseMsg = $("#purchaseMsg").val();
	if(type == 1){
		changeInfoOver();
	}else if(buyerName == ""){
		mui.toast("请输入您的姓名");
	}else if(buyerPhone == "" && buyerMail == ""){
		mui.toast("邮箱与电话不能全为空");
	}else if(purchaseMsg == ""){
		mui.toast("请输入购买请求");
	}else{
		submitPurchase();
	}
}

function submitPurchase(){
	var url = IPPost+'PurchaseController/addPurchase';
	mui.ajax(url, {
	    data: {
	    	userId: userId,
	    	workId: workId,
	    	designerId: designerId,
	    	purchaseRequest: purchaseMsg,
	    	purchaseName: buyerName,
	    	purchasePhone: buyerPhone,
	    	purchaseMail: buyerMail
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("提交信息出错，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				mui.toast(resultJson.msg);
				openPage('back');
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}