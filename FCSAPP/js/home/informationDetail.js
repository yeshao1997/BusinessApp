var informationId;
var IPPost;
var fabulousType = 1;//默认未点赞
var collectType = 1;//默认未收藏
var fabulousNumber = 0;

mui.init({
    beforeback: function() { 
	    var opener = plus.webview.currentWebview().opener();  
	    mui.fire(opener, 'refreshCollect');  
	    return true;  
    }
});

//监听刷新页面
window.addEventListener('refreshComment', function(e) {
	getCommentNumber();
})

//获取上个界面传递的值
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	informationId = self.informationId;
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	IPPost = localStorage.getItem("IPPost");
	var userId = localStorage.getItem("userId");
	var url = IPPost+'InformationController/getInformation';
	mui.ajax(url, {
	    data: {
	    	informationId: informationId,
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				var informationTopic = resultJson.obj.informationTopic;
				var informationAuthor = resultJson.obj.informationAuthor;
				var informationReltime = resultJson.obj.informationReltime;
				var informationFabulous = resultJson.obj.informationFabulous;
				var informationContent = resultJson.obj1;
				var otherContent = resultJson.obj2;
				
				buildPage(informationTopic,informationAuthor,informationReltime,informationFabulous);
				buildContent(informationContent);
				buildOther(otherContent);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
	getCommentNumber();
});

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

//构建资讯标题等
function buildPage(informationTopic,informationAuthor,informationReltime,informationFabulous){
	$("#topic").text(informationTopic);
	$("#author").text(informationAuthor);
	$("#time").text(informationReltime);
}

//构建资讯内容
function buildContent(informationContent){
	var sort = informationContent.sort;
	var pI = 0;
	var imgI = 0;
	var imgIntrI = 0;
	var p = informationContent.p;
	var img = informationContent.img;
	var imgIntr = informationContent.imgIntr;
	
	var informationContent = document.getElementById('informationContent');
	var text = "";
	for(var i=0;i<sort.length;i++){
		if(sort[i] == "0"){
			text = "<p id='p'>&emsp;&emsp;"+p[pI]+"</p>";
			pI++;
		}else if(sort[i] == "1"){
			text = "<img id='img' src='"+img[imgI]+"'/>";
			imgI++;
		}else if(sort[i] == "2"){
			text = "<p id='imgIntr'>"+imgIntr[imgIntrI]+"</p>";
			imgIntrI++;
		}
		informationContent.insertAdjacentHTML("beforeend",text);
	}
}

//构建点赞等信息
function buildOther(otherContent){
	var otherArray = otherContent.other;
	//0为已点赞
	if(otherArray[0] == 0){ 
		fabulousType = 0;
		$("#fabulousImg").attr('src','../../img/home/fabulous .png');
	}else{
		fabulousType = 1;
		$("#fabulousImg").attr('src','../../img/home/unfabulous.png');
	}
	//点赞数量
	$("#fabulousNumber").text(otherArray[1]);
	fabulousNumber = otherArray[1];
	//评论数量
	$("#commentNumber").text(otherArray[2]);
	//0为已收藏
	if(otherArray[3] == 0){
		collectType = 0;
		$("#collectImg").attr('src','../../img/home/collect .png'); 
	}else{
		collectType = 1;
		$("#collectImg").attr('src','../../img/home/uncollect.png'); 
	}
}

//点赞与取消点赞
function fabulous(){
	var userId = localStorage.getItem("userId");	
	if(userId != null && userId != ""){
		var IPPost = localStorage.getItem("IPPost");
		var url = IPPost+'FabulousController/fabulous';
		mui.ajax(url, {
		    data: {
		    	informationId: informationId,
		    	userId: userId,
		    	FCType: fabulousType
		    },
		    type: "POST",
		    timeout: 3000,
		    traditional: true,
		    error: function(){
		    	mui.toast("网络错误");
		    },
		    success: function(data){
		    	var resultJson = JSON.parse(JSON.stringify( data ));
				if(resultJson.code == 1){
					if(fabulousType == 1){
						fabulousType = 0;
						$("#fabulousImg").attr('src','../../img/home/fabulous .png');
						fabulousNumber++;
						$("#fabulousNumber").text(fabulousNumber);
					}else{
						fabulousType = 1;
						$("#fabulousImg").attr('src','../../img/home/unfabulous.png');
						fabulousNumber--;
						$("#fabulousNumber").text(fabulousNumber);
					}
				}else{
					mui.toast(resultJson.msg);
				}
		    }
		});
	}else{
		mui.toast("登录后才能进行此操作");
	}
}

//收藏与取消收藏
function collect(){
	var userId = localStorage.getItem("userId");
	if(userId != null && userId != ""){
		var IPPost = localStorage.getItem("IPPost");
		var url = IPPost+'CollectController/collect';
		mui.ajax(url, {
		    data: {
		    	informationId: informationId,
		    	userId: userId,
		    	collectType: 1,
		    	FCType: collectType
		    },
		    type: "POST",
		    timeout: 3000,
		    traditional: true,
		    error: function(){
		    	mui.toast("网络错误");
		    },
		    success: function(data){
		    	var resultJson = JSON.parse(JSON.stringify( data ));
				if(resultJson.code == 1){
					if(collectType == 1){
						collectType = 0;
						$("#collectImg").attr('src','../../img/home/collect .png');
						mui.toast(resultJson.msg);
					}else{
						collectType = 1;
						$("#collectImg").attr('src','../../img/home/uncollect.png');
						mui.toast(resultJson.msg);
					}
				}else{
					mui.toast(resultJson.msg);
				}
		    }
		});
	}else{
		mui.toast("登录后才能收藏");
	}
}

function comment(){
	mui.openWindow({
	    url: '../other/comment.html',
	    id: 'comment',
	    extras:{
	        informationId: informationId,
	        informationType: 1
	    }
	});
}

function getCommentNumber(){
	var url = IPPost+'CommentController/getCommentNumber';
	mui.ajax(url, {
	    data: {
	    	informationId: informationId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取评论数量失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				$("#commentNumber").text(resultJson.obj);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}
