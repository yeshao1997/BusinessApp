var moveConfirm = false;
var ws = null;

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

function confirmCode(){
	var code = $("#register-vercation-input").val();
	var mail = $("#register-mail-input").val();
	var url = 'http://172.16.41.126:8080/CodeController/confirmMailCode';
  	mui.ajax(url, {
        data: {
          'mail':mail,
          'code': code,
          'type': 1
        },
        type: "POST",
        timeout: 3000,
        beforeSend: function(){
        	$("#submit").attr('disabled',"true");
        },complete: function () {
			$("#submit").removeAttr("disabled");
	    },
        error: function(){
        	mui.toast("注册失败，网络错误");
        },
        success: function(data){
        	var resultJson = JSON.parse(JSON.stringify( data ));
			var registerCode = resultJson.code;
			if(registerCode == 1){
				register();
			}else{
				mui.toast(resultJson.msg);
			}
        }
    });
}

//判断用户类型进行注册
function register(){
	var register_type = $("input[name='register-type']:checked").val();
	var account = $("#register-account-input").val();
	var password = $("#register-password-input").val();
	var mail = $("#register-mail-input").val();
	if(register_type == 1 && moveConfirm){
		var url = 'http://172.16.41.126:8080/AccountController/registerUser';
      	mui.ajax(url, {
	        data: {
	          'account': account,
	          'password': password,
	          'mail': mail,
	          'type': 1
	        },
	        type: "POST",
	        timeout: 3000,
	        beforeSend: function(){
	        	$("#submit").attr('disabled',"true");
	        },complete: function () {
				$("#submit").removeAttr("disabled");
		    },
	        error: function(){
	        	mui.toast("注册失败，网络错误");
	        },
	        success: function(data){
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				var registerCode = resultJson.code;
				if(registerCode == 1){
					mui.openWindow({
						url:'register3.html'
			   		});
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });
	}else if(register_type == 2 && moveConfirm){
   		mui.openWindow({
		    url:'register2.html',
		    extras:{
		        account:account,
		        password:password,
		        mail:mail
		    }
		});
	}else{
		mui.toast("验证未完成，请重新验证信息");
	}
}

//滑动验证
function moveCode(code){
	var fn = {codeVluae : code};
	var box = document.querySelector("#code-box"),
			progress = box.querySelector("p"),
			codeInput = box.querySelector('.code-input'),
			evenBox = box.querySelector("span");

	//默认事件
	var boxEven = ['mousedown','mousemove','mouseup'];
	//改变手机端与pc事件类型
	if(typeof document.ontouchstart == 'object'){
		boxEven = ['touchstart','touchmove','touchend'];
	}

	var goX,offsetLeft,deviation,evenWidth,endX;
	//获取元素距离页面边缘的距离
	function getOffset(box,direction){
		var setDirection =  (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
		var offset =  box[setDirection];
		var parentBox = box.offsetParent;
		
		while(parentBox){
			offset+=parentBox[setDirection];
			parentBox = parentBox.offsetParent;
		}
		parentBox = null;
		return parseInt(offset);
	}
	
	//注册信息验证
	function messageConfirm(){
		moveConfirm = false;
		var account = $("#register-account-input").val();
		var password = $("#register-password-input").val();
		var password_confirm = $("#register-password-confirm-input").val();
		var mail = $("#register-mail-input").val();
		
		if(account == ""){
			mui.toast("用户名不能为空");
			removeFn(false);
		}else if(account.length < 3){
			mui.toast("用户名长度不能小于2");
			removeFn(false);
		}else if(password == ""){
			mui.toast("密码不能为空");
			removeFn(false);
		}else if(password.length < 6){
			mui.toast("密码长度不能小于6");
			removeFn(false);
		}else if(password_confirm == ""){
			mui.toast("请确认密码");
			removeFn(false);
		}else if(password != password_confirm){
			mui.toast("两次输入密码不相同");
			removeFn(false);
		}else if(mail ==""){
			mui.toast("邮箱地址不能为空");
			removeFn(false);
		}
		else{
			var url = 'http://172.16.41.126:8080/AccountController/registerConfirm';
	      	mui.ajax(url, {
		        data: {
		          'account': account,
		          'mail':mail
		        },
		        type: "POST",
		        timeout: 3000,
		        error: function(){
		        	mui.toast("验证失败，网络错误");
					removeFn(false);
		        },
		        success: function(data){
		        	var resultJson = JSON.parse(JSON.stringify( data ));
					var registerCode = resultJson.code;
					if(registerCode == 1){
						mui.toast(resultJson.msg);
						removeFn(true);
					}else{
						mui.toast(resultJson.msg);
						removeFn(false);
					}
		        }
		    });
		}
	}

	function moveFn(e){
		e.preventDefault();
		e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;		
		endX = e.clientX - goX;
		endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;
	
		if(endX > evenWidth * 0.7){			
			progress.innerText = '正在验证';
			progress.style.backgroundColor = "#f9913e";
		}else{
			progress.innerText = '';
			progress.style.backgroundColor = "#FFFF99";
		}
		
		progress.style.width = endX+deviation+'px';
		evenBox.style.left = endX+'px';
	}

	function removeFn(confirm) {
		document.removeEventListener(boxEven['2'],removeFn,false);
		document.removeEventListener(boxEven['1'],moveFn,false);

		if(endX > evenWidth * 0.7 && confirm){			
			progress.innerText = '验证成功';
			progress.style.width = evenWidth+deviation+'px';
			evenBox.style.left = evenWidth+'px';
			evenBox.onmousedown = null;
			moveConfirm = true;
		}else{
			progress.style.width = '0px';
			evenBox.style.left = '0px';
			moveConfirm = false;
		}
	}

	evenBox.addEventListener(boxEven['0'], function(e) {
		e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
			goX = e.clientX,
				offsetLeft = getOffset(box,'left'),
				deviation = this.clientWidth,
				evenWidth = box.clientWidth - deviation,
				endX;

		evenBox.addEventListener(boxEven['1'],moveFn,false);
		evenBox.addEventListener(boxEven['2'],messageConfirm,false);
	},false);
	
	fn.setCode = function(code){
		if(code)
			fn.codeVluae = code;
	}

	fn.getCode = function(){
		return fn.codeVluae;
	}

	fn.resetCode = function(){
		evenBox.removeAttribute('style');
		progress.removeAttribute('style');
		codeInput.value = '';
	};

	return fn;
}
