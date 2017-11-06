var issend=true;  
var oldMail,newMail;

document.addEventListener('plusready', function(){
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
	plus.navigator.setStatusBarBackground("#000000");
});

mui.init();

//获取上个界面传递的值
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	oldMail = self.mail;
}) 

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

function senMail(t){
	newMail = $("#mail-input").val();
	if(newMail == ""){
		mui.toast("请输入邮箱地址");
	}else if(newMail == oldMail){
		mui.toast("新邮箱不能与旧邮箱相同");
	}else if(issend){
	    var url = 'http://172.16.41.126:8080/CodeController/sendMail';
	    mui.ajax(url, {
	        data: {
	          'mail': newMail,
	          'type': 1
	        },
	        type: "POST",
	        timeout: 3000,
	        error: function(){
	        	mui.toast("验证失败，网络错误");
	        },
	        success: function(data){
	    		issend=false; 
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				var registerCode = resultJson.code;
				if(registerCode == 1){
					mui.toast(resultJson.msg);
				    for(i=1;i<=t;i++) { 
			            window.setTimeout("update_a(" + i + ","+t+")", i * 1000);   
			        } 
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });  
	}  
}

function update_a(num,t) {   
    var get_code=document.getElementById('confirmMail');  
    if(num == t) {   
        get_code.innerHTML =" 重新发送 ";   
        issend=true;
    }   
    else {   
       var printnr = t-num;   
        get_code.innerHTML =printnr +" 秒后重发";   
    }   
}

function confirmCode(){
	var code = $("#code-input").val();
	if(newMail == ""){
		mui.toast("请输入邮箱地址");
	}else if(code == ""){
		mui.toast("请输入验证码");
	}else if(code.length != 4){
		mui.toast("请输入4位数验证码");
	}else{
		var url = 'http://172.16.41.126:8080/CodeController/confirmMailCode';
	    mui.ajax(url, {
	        data: {
	          'mail': newMail,
	          'code': code,
	          'type': 1
	        },
	        type: "POST",
	        timeout: 3000,
	        error: function(){
	        	mui.toast("验证失败，网络错误");
	        },
	        success: function(data){
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				var registerCode = resultJson.code;
				if(registerCode == 1){
					updateMial();
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });    
	}
}

function updateMial(){
	var url = 'http://172.16.41.126:8080/UserDataController/updateMail';
	mui.ajax(url, {
	        data: {
	        
	          'oldMail': oldMail,
	          'newMail': newMail
	        },
	        type: "POST",
	        timeout: 3000,
	        error: function(){
	        	mui.toast("验证失败，网络错误");
	        },
	        success: function(data){
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				var registerCode = resultJson.code;
				if(registerCode == 1){
					mui.openWindow({
						url: "changeMailSuccess.html"
					});
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    }); 
}
