var IPPost = localStorage.getItem("IPPost");
var userId = localStorage.getItem("userId");

mui.init({
    gestureConfig:{
    	longtap: true
  	},
  	beforeback: function() { 
	    var opener = plus.webview.currentWebview().opener();  
	    mui.fire(opener, 'getUnRead');  
	    return true;  
    }
});

//监听刷新页面
window.addEventListener('refresh', function(e) {
    location.reload();
})

document.addEventListener('plusready', function(){
	getSellList();
});

function openPage(page,value){
	if(page == "back"){
		mui.back();
	}else if(page == "sellDetail"){
		setReaded(value);
		mui.openWindow({
		    url: 'userSellDetail.html',
		    id: 'userSellDetail',
		    extras:{
		        sellId: value
		    }
		});
	}
}

function getSellList(){
	var url = IPPost+'PurchaseController/getUserSell';
	mui.ajax(url, {
	    data: {
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取购买意向失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				buildSellList(resultJson.obj);
				mui('body').on('longtap','a',function(){
					var id = this.getAttribute("value");
					var title = this.getAttribute("value2");
					setSell(id,title);
				},false);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function buildSellList(obj){
	var idArray = obj.id;
	var titleArray = obj.title;
	var buyerArray = obj.buyer;
	var timeArray = obj.time;
	var statusArray = obj.status;
	if(idArray.length == 0){
		$("#notMessage").css("display","block");
	}else{
		var sellContent = document.getElementById('sellList');
		for(var i=0;i<idArray.length;i++){
			if(statusArray[i] == 0){
				sell = "<li id='sell' class='mui-table-view-cell mui-media'>"+
				            "<a id='clickA' value="+idArray[i]+" value2="+titleArray[i]+" onclick=openPage("+'"sellDetail"'+",'"+idArray[i]+"')>"+
				                "<span id='prompt' class='mui-badge-red'></span>"+
				                "<p id='workName'>"+titleArray[i]+"</p>"+
				                "<p id='time'>"+timeArray[i]+"</p>"+
				                "<p id='buyerName'>"+buyerArray[i]+"</p>"+
				                "<p id='rightIcon' class='mui-icon-forward mui-icon'>"+
				            "</a>"+
				        "</li>";
			}else{
				sell = "<li id='sell' class='mui-table-view-cell mui-media'>"+
				            "<a id='clickA' value="+idArray[i]+" value2="+titleArray[i]+" onclick=openPage("+'"sellDetail"'+",'"+idArray[i]+"')>"+
				                "<span id='prompt' class='mui-badge-red' style='"+'display: none;'+"'></span>"+
				                "<p id='workName'>"+titleArray[i]+"</p>"+
				                "<p id='time'>"+timeArray[i]+"</p>"+
				                "<p id='buyerName'>"+buyerArray[i]+"</p>"+
				                "<p id='rightIcon' class='mui-icon-forward mui-icon'>"+
				            "</a>"+
				        "</li>";
			}
			sellContent.insertAdjacentHTML('beforeend', sell);
		}
	}
	
}

function setSell(value,title){
	if (mui.os.plus) { 
		var a = [{title: "删除意向"}]; 
		plus.nativeUI.actionSheet({ 
			title: title, 
			cancel: "取消",
			buttons: a 
		}, function(b) { 
　　　		if(b.index-1 == 0){
				var btnArray = ['否', '是'];
				mui.confirm('确认删除此购买意向？', '删除记录', btnArray, function(e) {
					if (e.index == 1) {
						deleteASell(value);
					}
				})
			}
		}) 
	} 
}

function deleteASell(sellId){
	var url = IPPost+'PurchaseController/deleteASell';
	mui.ajax(url, {
	    data: {
	    	purchaseId: sellId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("删除购买意向失败，网络错误");
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

function deleteAllSell(){
	var btnArray = ['否', '是'];
	mui.confirm('确认清除所有购买意向？', '删除购买意向', btnArray, function(e) {
		if (e.index == 1) {
			var url = IPPost+'PurchaseController/deleteAllSell';
			mui.ajax(url, {
			    data: {
			    	userId: userId
			    },
			    type: "POST",
			    timeout: 3000,
			    traditional: true,
			    error: function(){
			    	mui.toast("删除购买意向失败，网络错误");
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

function setReaded(sellId){
	var url = IPPost+'PurchaseController/setReaded';
	mui.ajax(url, {
    data: {
    	purchaseId: sellId
    },
    type: "POST",
    timeout: 3000,
    traditional: true,
    error: function(){
    	mui.toast("设置已读时错误，网络错误");
    },
    success: function(data){
    	var resultJson = JSON.parse(JSON.stringify( data ));
		if(resultJson.code != 1){
			
		}
    }
});
}
