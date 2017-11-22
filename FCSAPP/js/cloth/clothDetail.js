var clothId;
var IPPost;
var userId;
var fabulousType = 1; //1为未点赞
var collectType = 1; //1未未收藏
var fabulousNumber = 0;

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	clothId = self.clothId;
	getClothData();
});

//获取布料信息
function getClothData(){
	IPPost = localStorage.getItem("IPPost");
	userId = localStorage.getItem("userId");
	var url = IPPost+'ClothController/getClothById';
	mui.ajax(url, {
	    data: {
	    	clothId:clothId,
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
				var recommedCostumeContent = document.getElementById("recommedCostumeTable");
				
				
				buildRecommend(recommedWorkContent,obj.workIdArray,obj.workImageArray,obj.workTitleArray,obj.workAboutArray,obj.workFabulousArray);
				buildRecommend(recommedCostumeContent,obj.costumeIdArray,obj.costumeImageArray,obj.costumeTitleArray,obj.costumeAboutArray,obj.costumeFabulousArray);
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

function buildInfor(obj){
	$("#clothTitle").text(obj.clothName);
	$("#priceValue").text(obj.clothPrice);
	$("#clothNo").text(obj.clothNo);
	$("#clothMoq").text(obj.clothMoq);
	$("#clothComponent").text(obj.clothComponent);
	$("#clothPurpose").text(obj.clothPurpose);
	$("#clothWeave").text(obj.clothWeave);
	$("#clothMake").text(obj.clothMake);
	$("#clothElastic").text(obj.clothElastic);
	$("#clothTcx").text(obj.clothTcx);
	$("#clothTpx").text(obj.clothTpx);
	$("#clothSupplierValue").text(obj.clothSupplier);
	
	fabulousNumber = obj.fabulousNumber
	$("#fabulousValue").text(fabulousNumber);
	$("#commentValue").text(obj.collectNumber);
	if(obj.collectType == "collect"){
		$("#collectImg").attr('src','../../img/cloth/collect.png');
		collectType = 0;
	}
	if(obj.fabulousType == "fabulous"){
		$("#fabulousImg").attr('src','../../img/cloth/fabulous.png');
		fabulousType = 0;
	}
}

//构建推荐
function buildRecommend(recommedContent,idArray,imageArray,titleArray,aboutArray,fabulousArray){
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
			var image = IPPost +'image1/'+imageArray[i]
			recommedText += "<td id='recommed'>"+
								"<a onclick=openPage('"+idArray[i]+"')>"+
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
		    	informationId: clothId,
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
						mui.toast("已收藏此布料");
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
		    	informationId: clothId,
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
	console.log(page);
}