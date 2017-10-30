var account;
var password;
var mail;
var selectTag = new Array();
var tagArray;
var selected = 0;

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
$(document).ready(
	buildTag()
); 

//构建标签
function buildTag(){
	tagArray = new Array("女装设计","男装设计",
								"童装设计","内衣设计",
								"休闲设计","牛仔设计",
								"家纺设计","配饰设计",
								"婚纱设计","箱包设计",
								"皮草设计","陈列设计");
	var tagContent = document.getElementById('tagContent');
	for(var i=0;i<tagArray.length;i++){
		var value = i+1;
		var tag = "<button class='mui-btn mui-btn-block mui-btn-primary mui-icon iconfont icon-tag'" 
					+" id="+'button'+i+" value="+value+">"
					+"&nbsp&nbsp"+tagArray[i]+"</button>";
		if(i>0 && i%2 == 0){
			tagContent.insertAdjacentHTML('beforeend', '');
		} 
		tagContent.insertAdjacentHTML('beforeend', tag);
	}
}

//标签点击事件
$('#tagContent button').on('click', function() {  // 这里等同于click()方法
     var b_val = $(this).val();
     if(b_val>0 && selected<3){
     	selected++;
     	selectTag.push(b_val);
     	$(this).css({'background-color':'#9299a0'});
     	$(this).val(-b_val);
     }else if(b_val<0){
     	selected--;
     	var p=0;
     	selectTagTemp = new Array();
     	for(var i=0;i<selectTag.length;i++){
     		if(selectTag[i] == -b_val){
     			continue;
     		}else{
     			selectTagTemp[p] = selectTag[i];
     			p++;
     		}
     	}
     	selectTag = selectTagTemp;
		$(this).css({'background-color':'#2f3337'});
		$(this).val(-b_val);
     }
});

//注册设计师
function registerDesigner(){
	if(selectTag.length>0){
		//将数组转化为字符串上传
		var tag = "";
		for(var i=0;i<selectTag.length;i++){
			tag += ";" + tagArray[selectTag[i]-1];
		}
		var url = 'http://172.16.41.126:8080/AccountController/registerDesigner';
		mui.ajax(url, {
		    data: {
		      'account': account,
		      'password': password,
		      'mail': mail,
		      'type': 2,
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
						url:'register3.html'
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
