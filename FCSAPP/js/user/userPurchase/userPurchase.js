var IPPost;
var userId;

mui.init({
    gestureConfig:{
    	longtap: true
  	}
});

//监听刷新页面
window.addEventListener('refresh', function(e) {
    location.reload();
})

document.addEventListener('plusready', function(){
	getPurchaseList();
});

function openPage(page,value){
	if(page == "back"){
		mui.back();
	}else if(page == "purchaseDetail"){
		mui.openWindow({
		    url: 'userPurchaseDeatil.html',
		    id: 'userPurchaseDeatil',
		    extras:{
		        purchaseId: value
		    }
		});
	}
}

function getPurchaseList(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'PurchaseController/getUserBuy';
	mui.ajax(url, {
	    data: {
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取购买记录失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				buildPurchaseList(resultJson.obj);
				mui('body').on('longtap','a',function(){
					var id = this.getAttribute("value");
					var title = this.getAttribute("value2");
					setPurchase(id,title);
				},false);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function buildPurchaseList(obj){
	var idArray = obj.id;
	var imageArray = obj.image;
	var titleArray = obj.title;
	var designerArray = obj.designer;
	var timeArray = obj.time;
	if(idArray.length == 0){
		$("#notMessage").css("display","block");
	}else{
		var purchaseContent = document.getElementById('purchaseList');
		for(var i=0;i<idArray.length;i++){
			var imageDefult = IPPost + "image1/" + imageArray[i];
			var purchase = "<li id='purchase'>"+
					            "<a id='clickA' value="+idArray[i]+" value2="+titleArray[i]+" onclick=openPage("+'"purchaseDetail"'+",'"+idArray[i]+"')>"+
					                "<img id='image' src="+imageDefult+">"+
					                "<div id='purchaseInfo' class='mui-media-body mui-pull-left'>"+
					                	"<p id='workName'>"+titleArray[i]+"</p>"+
					                	"<p id='workDesigner'>"+designerArray[i]+"</p>"+
					                    "<p id='purchaseTime'>"+timeArray[i]+"</p>"+
					               	"</div>"+
					               	"<p id='rightIcon' class='mui-icon-forward mui-icon'></p>"+
					            "</a>"+
					        "</li>";
			purchaseContent.insertAdjacentHTML('beforeend', purchase);
		}
	}
	
}

function setPurchase(value,title){
	if (mui.os.plus) { 
		var a = [{title: "删除记录"}]; 
		plus.nativeUI.actionSheet({ 
			title: title, 
			cancel: "取消",
			buttons: a 
		}, function(b) { 
　　　		if(b.index-1 == 0){
				var btnArray = ['否', '是'];
				mui.confirm('确认删除此记录？', '删除记录', btnArray, function(e) {
					if (e.index == 1) {
						deleteAPurchase(value);
					}
				})
			}
		}) 
	} 
}

function deleteAPurchase(purchaseId){
	var url = IPPost+'PurchaseController/deleteAPurchase';
	mui.ajax(url, {
	    data: {
	    	purchaseId: purchaseId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("删除记录失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				location.reload();
				mui.toast(resultJson.msg);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function deleteAllPurchse(){
	var btnArray = ['否', '是'];
	mui.confirm('确认清除所有记录？', '删除记录', btnArray, function(e) {
		if (e.index == 1) {
			var url = IPPost+'PurchaseController/deleteAllPurchase';
			mui.ajax(url, {
			    data: {
			    	userId: userId
			    },
			    type: "POST",
			    timeout: 3000,
			    traditional: true,
			    error: function(){
			    	mui.toast("删除记录失败，网络错误");
			    },
			    success: function(data){
			    	var resultJson = JSON.parse(JSON.stringify( data ));
					if(resultJson.code == 1){
						location.reload();
						mui.toast(resultJson.msg);
					}else{
						mui.toast(resultJson.msg);
					}
			    }
			});
		}
	})
}
