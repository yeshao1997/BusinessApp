var purchaseId;
var designerId;
var workId;
var IPPost;
var userId;

//返回上一个界面时，刷新界面
mui.init({
    beforeback: function() { 
	    var opener = plus.webview.currentWebview().opener();  
	    mui.fire(opener, 'refresh');  
	    return true;  
    }
});

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	purchaseId = self.purchaseId;
	getPurchaseDetail();
});

function openPage(page){
	if(page == "back"){
		mui.back();
	}else if(page == "designer"){
		if(designerId != ""){
			mui.openWindow({
			    url: '../../home/designerDetail.html',
			    id: 'designerDetail',
			    extras:{
			        designerId: designerId
			    }
			});
		}else{
			mui.toast("用户不存在");
		}
	}else if(page == 'work'){
		if(workId != ""){
			mui.openWindow({
			    url: '../../work/workDetail.html',
			    id: 'workDetail',
			    extras:{
			        workId: workId
			    }
			});
		}else{
			mui.toast("作品已不存在");
		}
	}
}

function getPurchaseDetail(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'PurchaseController/getPurchaseDetail';
	mui.ajax(url, {
	    data: {
	    	purchaseId: purchaseId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取购买详情失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				workId = resultJson.obj.workId;
				designerId = resultJson.obj.designerId;
				
				$("#designer").text(resultJson.obj.designerName)
				$("#work").text(resultJson.obj.workName);
				$("#purchaseRequest").text(resultJson.obj.purchaseRequest);
				$("#buyerName").text(resultJson.obj.buyerName);
				$("#buyerPhone").text(resultJson.obj.buyerPhone);
				$("#buyerMail").text(resultJson.obj.buyerMail);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function deletePurchase(){
	var btnArray = ['否', '是'];
	mui.confirm('确认删除此记录？', '删除记录', btnArray, function(e) {
		if (e.index == 1) {
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
						mui.back();
						mui.toast(resultJson.msg);
					}else{
						mui.toast(resultJson.msg);
					}
			    }
			});
		}
	})
}
