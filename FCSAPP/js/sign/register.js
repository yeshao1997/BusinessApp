function back_login(){
	mui.back();
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
	function registerConfirm(){
		var account = $("#register-account-input").val();
		var password = $("#register-password-input").val();
		var password_confirm = $("#register-password-confirm-input").val();
		
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
		}else{
			var url = 'http://172.16.41.126:8080/AccountController/existUsername';
	      	mui.ajax(url, {
		        data: {
		          'account': account
		        },
		        type: "POST",
		        timeout: 3000,
		        error: function(){
		        	mui.toast("验证失败，网络错误");
					removeFn(false);
		        },
		        success: function(data){
		        	var resultJson = JSON.parse(JSON.stringify( data ));
					var loginResult = resultJson.obj;
					if(loginResult){
						removeFn(true);
					}else{
						mui.toast("用户名已存在");
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
			codeInput.value = fn.codeVluae;
			evenBox.onmousedown = null;
		}else{
			progress.style.width = '0px';
			evenBox.style.left = '0px';
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
		evenBox.addEventListener(boxEven['2'],registerConfirm,false);
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




