var moveConfirm = false;

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

//滑动发送邮箱验证码
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
		var mail = $("#forget-mail-input").val();
		
		if(mail == ""){
			mui.toast("邮箱不能为空");
			removeFn(false);
		}else{
			var url = 'http://172.16.41.126:8080/AccountController/sendMail';
	      	mui.ajax(url, {
		        data: {
		          'mail': mail
		        },
		        type: "POST",
		        timeout: 3000,
		        error: function(){
		        	mui.toast("验证失败，网络错误");
					removeFn(false);
		        },
		        success: function(data){
		        	var resultJson = JSON.parse(JSON.stringify( data ));
					var loginCode = resultJson.code;
					if(loginCode == 1){
						removeFn(true);
						mui.toast(resultJson.msg);
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
			progress.innerText = '发送成功';
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

function forgetConfirm(){
	var code = $("#forget-vercation-input").val();
	if(!moveConfirm){
        mui.toast("验证未完成，请重新验证信息");
	}else if(code == ""){
		mui.toast("验证码不能为空");
	}else{
		var mail = $("#forget-mail-input").val();
		var url = 'http://172.16.41.126:8080/CodeController/confirmMailCode';
	    mui.ajax(url, {
	        data: {
	          'mail':mail,
	          'code': code,
	          'type': 2
	        },
	        type: "POST", 
	        timeout:3000,
	        beforeSend: function(){
	        	$("#submit").attr('disabled',"true");
	        },complete: function () {
				$("#submit").removeAttr("disabled");
		    },
	        error: function(){
	        	mui.toast("验证失败，网络错误");
	        },
	        success: function(data){
	        	var resultJson = JSON.parse(JSON.stringify( data ));
				var userId = resultJson.obj;
				if(resultJson.code == 1){
					mui.openWindow({
					    url:'forget2.html',
					    extras:{
					        userId:userId
					    }
					});
				}else{
					mui.toast(resultJson.msg);
				}
	        }
	    });
	}
	
}