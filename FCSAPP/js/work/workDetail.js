var IPPost;
var userId;
var workId;
var workName;
var designerId;
var designerName;
var albumId;
var fabulousType = 1; //1为未点赞
var collectType = 1; //1未未收藏
var fabulousNumber = 0;

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
    workId = self.workId;
	getWorkData();
});

function getWorkData(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'WorkController/getWorkById';
	mui.ajax(url, {
	    data: {
	    	workId: workId,
	    	userId: userId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取轮播图失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				var carouse = resultJson.obj.carouse;
				
				buildCarousel(carouse);
				buildInfor(resultJson.obj1);
				var obj = resultJson.obj2;
				var recommedClothContent = document.getElementById("recommedClothTable");
				var recommedCostumeContent = document.getElementById("recommedCostumeTable");
				
				buildRecommend(recommedClothContent,obj.clothIdArray,obj.clothImageArray,obj.clothTitleArray,obj.clothAboutArray,obj.clothFabulousArray,"clo");
				buildRecommend(recommedCostumeContent,obj.costumeIdArray,obj.costumeImageArray,obj.costumeTitleArray,obj.costumeAboutArray,obj.costumeFabulousArray,"cos");
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

//构建轮播图
function buildCarousel(carouse){
	var orderArray = new Array(5,0,1,2,3,4,5,0);
	var carouselContent = document.getElementById('carousel-content');
	
	//构建轮播图 
	for(var i=0;i<orderArray.length;i++){
		var imageSrc = IPPost + "image1/" + carouse[orderArray[i]];
		var oneCarouse = "<div class='mui-slider-item mui-slider-item-duplicate'>"+
								"<a>"+
									"<img id='carouselImage' src="+imageSrc+">"+
								"</a>"+
							"</div>";
		carouselContent.insertAdjacentHTML('beforeend', oneCarouse);
	}
	
	//为轮播图添加自动滑动时间
	var slider = mui("#slider");
	slider.slider({
		interval: 5000
	});
}
function buildInfor(obj){
	workName = obj.workName;
	$("#workTitle").text(workName);
	$("#intrValue").text(obj.workIntro);
	$("#workType").text(obj.workType);
	$("#workStyle").text(obj.workStyle);
	$("#workComponent").text(obj.workComponent);
	$("#workModel").text(obj.workModel);
	$("#workColor").text(obj.workColor);
	
	$("#workAlbum").text(obj.workAlbum);
	albumId = obj.workAlbumId;
	designerName = obj.workDesigner;
	$("#workDesigner").text(designerName);
	designerId = obj.workDesignerId;
	
	fabulousNumber = obj.fabulousNumber
	$("#fabulousValue").text(fabulousNumber);
	$("#commentValue").text(obj.collectNumber);
	if(obj.collectType == "collect"){
		$("#collectImg").attr('src','../../img/work/collect.png');
		collectType = 0;
	}
	if(obj.fabulousType == "fabulous"){
		$("#fabulousImg").attr('src','../../img/work/fabulous.png');
		fabulousType = 0;
	}
}

function buildRecommend(recommedContent,idArray,imageArray,titleArray,aboutArray,fabulousArray,type){
	var recommedText = "";
	for(var i=0;i<idArray.length;i++){
		if(i == 0 && idArray[0]!=null){
			recommedText += "<tr>";
		}else if(i!=0 && i%2==0 && idArray[0]!=null){
			recommedText += "</tr>";
			recommedContent.insertAdjacentHTML('beforeEnd',recommedText);
			recommedText = "<tr>";
		}
		if(idArray[i] != null){
			var image = IPPost +'image1/'+imageArray[i];
			var idType = type+idArray[i];
			recommedText += "<td id='recommed'>"+
								"<a onclick=openPage('"+idType+"')>"+
									"<img id='recommed-image' src="+image+"/>"+
									"<p id='recommed-name'>"+titleArray[i]+"</p>"+
									"<p id='recommed-about'>"+aboutArray[i]+"</p>"+
									"<img id='recommed-fabulous' src='../../img/home/unfabulous.png'/>"+
									"<p id='recommed-fabulous-number'>"+fabulousArray[i]+"</p>"+
					  			"</a>"+
							"</td>";
		}
		if(i == idArray.length-1 && idArray[0]!=null){
			recommedText += "</tr>";
			recommedContent.insertAdjacentHTML('beforeEnd',recommedText);
		}
		if(i==0 && idArray[i] == null){
			mui.toast("推荐信息错误");
			break;
		}
	}
}

function collect(){
	if(userId == null){
		mui.toast("登录后才能收藏");
	}else if(userId == designerId){
		mui.toast("不能收藏自己的作品");
	}else{
		var IPPost = localStorage.getItem("IPPost");
		var url = IPPost+'CollectController/collect';
		mui.ajax(url, {
		    data: {
		    	informationId: workId,
		    	userId: userId,
		    	collectType: 4,
		    	FCType: collectType
		    },
		    type: "POST",
		    timeout: 3000,
		    traditional: true,
		    error: function(){
		    	mui.toast("收藏失败，网络错误");
		    },
		    success: function(data){
		    	var resultJson = JSON.parse(JSON.stringify( data ));
				if(resultJson.code == 1){
					if(collectType != 0){
						collectType = 0;
						$("#collectImg").attr('src','../../img/costume/collect.png');
						mui.toast("已收藏此作品");
					}else{
						collectType = 1;
						$("#collectImg").attr('src','../../img/costume/uncollect.png');
						mui.toast("已取消收藏此作品");
					}
				}else{
					mui.toast(resultJson.msg);
				}
		    }
		});	
	}
}

function fabulous(){
	if(userId == null){
		mui.toast("登录后才能点赞");
	}else if(userId == designerId){
		mui.toast("不能点赞自己的作品");
	}else{
		var IPPost = localStorage.getItem("IPPost");
		var url = IPPost+'FabulousController/fabulous';
		mui.ajax(url, {
		    data: {
		    	informationId: workId,
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
						$("#fabulousImg").attr('src','../../img/costume/fabulous.png');
						fabulousNumber++;
						$("#fabulousValue").text(fabulousNumber);
					}else{
						fabulousType = 1;
						$("#fabulousImg").attr('src','../../img/costume/unfabulous.png');
						fabulousNumber--;
						$("#fabulousValue").text(fabulousNumber);
					}
				}else{
					mui.toast(resultJson.msg);
				}
		    }
		});
	}
}

function openPage(page){
	if(page == "back"){
		mui.back();
	}else if(page == "album"){
		mui.openWindow({
		    url: '../home/designerDetailWork.html',
		    id: 'designerDetailWork',
		    extras:{
		        albumId: albumId
		    }
		});
	}else if(page == "designer"){
		mui.openWindow({
		    url: '../home/designerDetail.html',
		    id: 'designerDetail',
		    extras:{
		        designerId: designerId
		    }
		});
	}else if(page == "purchase"){
		if(userId == null){
			mui.toast("登录后才能购买");
		}else if(userId == designerId){
			mui.toast("不能购买自己的作品");
		}else{
			mui.openWindow({
			    url: 'workPurchase.html',
			    id: 'workPurchase',
			    extras:{
			        workId: workId,
			        designerId: designerId,
			        workName: workName,
			        designerName: designerName
			    }
			});
		}
	}else if(page.substring(0,3) == "cos"){
		page = page.substring(3,page.length);
		console.log("品牌服装："+page);
		mui.openWindow({
		    url: '../costume/costumeDetail.html',
		    id: 'costumeDetail',
		    extras:{
		        costumeId: page
		    },
		    createNew: true
		});
	}else if(page.substring(0,3) == "clo"){
		page = page.substring(3,page.length);
		console.log("布料辅料："+page);
		mui.openWindow({
		    url: '../cloth/clothDetail.html',
		    id: 'clothDetail',
		    extras:{
		        clothId: page
		    },
		    createNew: true
		});
	}
}