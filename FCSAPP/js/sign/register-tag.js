var account;
var password;
var mail;
var tagArray;
var selectTag = new Array();
var selected = 0;

document.addEventListener('plusready', function(){
	//console.log("所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。"
	plus.navigator.setStatusBarBackground("#000000");
});

mui.init();

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

//获取上个界面传递的值
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	account = self.account;
	password = self.password;
	mail = self.mail;
})

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

//开始构建标签
$(document).ready(function () {
	var tagContent = document.getElementById('tagContent');
	var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'DictDataController/getTagList';
	mui.ajax(url, {
	    data: {},
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取标签失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				tagArray = resultJson.obj;
				var i = 0;
				for(var key in tagArray){
					var tag = "<button class='mui-btn mui-btn-block mui-btn-primary mui-icon iconfont icon-tag'" 
								+" id="+'button'+tagArray[key]+" value="+tagArray[key]+" onclick=addSelect("+tagArray[key]+")>"
								+"&nbsp&nbsp"+key+"</button>";
					if(i>0 && i%2 == 0){
						tagContent.insertAdjacentHTML('beforeend', '');
					} 
					tagContent.insertAdjacentHTML('beforeend', tag);
					i++;
				}
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}); 

function addSelect(value){
	var clickButton = $("#button"+value);
	var clickValue = $("#button"+value).val();
	
     if(clickValue>0 && selected<3){
     	selected++;
     	selectTag.push(clickValue);
     	clickButton.css({'background-color':'#9299a0'});
     	clickButton.val(-clickValue);
     }else if(clickValue<0){
     	selected--;
     	var p=0;
     	selectTagTemp = new Array();
     	for(var i=0;i<selectTag.length;i++){
     		if(selectTag[i] == -clickValue){
     			continue;
     		}else{
     			selectTagTemp[p] = selectTag[i];
     			p++;
     		}
     	}
     	selectTag = selectTagTemp;
		clickButton.css({'background-color':'#2f3337'});
		clickButton.val(-clickValue);
     }
}

//注册设计师
function registerDesigner(){
	if(selectTag.length>0){
		//将数组转化为字符串上传
		var tag = "";
		for(var i=0;i<selectTag.length;i++){
			tag += ";" + selectTag[i];
		}
		var IPPost = localStorage.getItem("IPPost");
 		var url = IPPost+'AccountController/registerDesigner';
		mui.ajax(url, {
		    data: {
		      'account': account,
		      'password': password,
		      'mail': mail,
		      'type': 1,
		      'tag': tag
		    },
		    type: "POST",
		    timeout: 3000,
		    traditional: true,
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
						url: 'register-success.html',
						id: 'register-success'
			   		});
				}else{
					mui.toast(resultJson.msg);
				}
		    }
		});
	}else{
		mui.toast("请选择标签");
	}
}
