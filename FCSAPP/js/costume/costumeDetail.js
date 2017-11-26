var costumeId;
var IPPost;
var userId;
var fabulousType = 1; //1为未点赞
var collectType = 1; //1未未收藏
var fabulousNumber = 0;

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	costumeId = self.costumeId;
	getCostumeData();
});

//获取服装信息
function getCostumeData(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'CostumeController/getCostumeById';
	mui.ajax(url, {
	    data: {
	    	costumeId:costumeId,
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
				var recommedWorkContent = document.getElementById("recommedWorkTable");
				var recommedClothContent = document.getElementById("recommedClothTable");
				
				
				buildRecommend(recommedWorkContent,obj.workIdArray,obj.workImageArray,obj.workTitleArray,obj.workAboutArray,obj.workFabulousArray,"wor");
				buildRecommend(recommedClothContent,obj.clothIdArray,obj.clothImageArray,obj.clothTitleArray,obj.clothAboutArray,obj.clothFabulousArray,"clo");
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

//构建轮播图
function buildCarousel(carouse){
	var orderArray = new Array(3,0,1,2,3,0);
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

//构建服装信息
function buildInfor(obj){
	$("#costumeTitle").text(obj.costumeName);
	$("#typeValue").text(obj.costumeType);
	$("#costumeNo").text(obj.costumeNo);
	$("#costumeAge").text(obj.costumeAge);
	$("#costumeModel").text(obj.costumeModel);
	$("#costumeSeason").text(obj.costumeSeason);
	$("#costumeStyle").text(obj.costumeStyle);
	$("#costumeColor").text(obj.costumeColor);
	$("#costumeComponent").text(obj.costumeComponent);
	$("#costumeWeave").text(obj.costumeWeave);
	$("#costumeIntrValue").text(obj.costumeIntr);
	fabulousNumber = obj.fabulousNumber
	$("#fabulousValue").text(fabulousNumber);
	$("#commentValue").text(obj.collectNumber);
	if(obj.collectType == "collect"){
		$("#collectImg").attr('src','../../img/costume/collect.png');
		collectType = 0;
	}
	if(obj.fabulousType == "fabulous"){
		$("#fabulousImg").attr('src','../../img/costume/fabulous.png');
		fabulousType = 0;
	}
}

//构建推荐
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
	if(userId != null){
		var IPPost = localStorage.getItem("IPPost");
		var url = IPPost+'CollectController/collect';
		mui.ajax(url, {
		    data: {
		    	informationId: costumeId,
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
						mui.toast("已收藏此服装");
					}else{
						collectType = 1;
						$("#collectImg").attr('src','../../img/costume/uncollect.png');
						mui.toast("已取消收藏此服装");
					}
				}else{
					mui.toast(resultJson.msg);
				}
		    }
		});	
	}else{
		mui.toast("登录后才能进行收藏");
	}
}

function fabulous(){
	if(userId != null){
		var IPPost = localStorage.getItem("IPPost");
		var url = IPPost+'FabulousController/fabulous';
		mui.ajax(url, {
		    data: {
		    	informationId: costumeId,
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
	}else{
		mui.toast("登录后才能点赞");
	}
}

function openPage(page){
	if(page == "back"){
		mui.back();
	}
	if(page.substring(0,3) == "wor"){
		page = page.substring(3,page.length);
		console.log("设计作品："+page);
		mui.openWindow({
		    url: '../work/workDetail.html',
		    id: 'workDetail',
		    extras:{
		        workId: page
		    },
		    createNew: true
		});
	}
	if(page.substring(0,3) == "clo"){
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
