var sellId;
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
	sellId = self.sellId;
	getSellDetail();
});

function openPage(page){
	if(page == "back"){
		mui.back();
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

function getSellDetail(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'PurchaseController/getSellDetail';
	mui.ajax(url, {
	    data: {
	    	sellId: sellId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取购买意向详情失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				workId = resultJson.obj.workId;
				
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

function deleteASell(){
	var btnArray = ['否', '是'];
	mui.confirm('确认删除此意向？', '删除意向', btnArray, function(e) {
		if (e.index == 1) {
			var url = IPPost+'PurchaseController/deleteASell';
			mui.ajax(url, {
			    data: {
			    	sellId: sellId
			    },
			    type: "POST",
			    timeout: 3000,
			    traditional: true,
			    error: function(){
			    	mui.toast("删除意向失败，网络错误");
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
