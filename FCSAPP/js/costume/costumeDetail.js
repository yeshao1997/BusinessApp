$(document).ready(function () {
	getCarouselData();
});

function getCarouselData(){
	var IPPost = localStorage.getItem("IPPost");
	var url = IPPost+'InformationController/getTopInformation';
	mui.ajax(url, {
	    data: {},
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取轮播图失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				imgArray = resultJson.obj.image;
				idArray = resultJson.obj.id;
				
				buildCarousel(imgArray,idArray);
	    		mui.toast(resultJson.msg);
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

//构建轮播图
function buildCarousel(imgArray,idArray){
	var orderArray = new Array(3,0,1,2,3,0);
	var carouselContent = document.getElementById('carousel-content');

	//构建轮播图 
	for(var i=0;i<orderArray.length;i++){
		var oneCarouse = "<div class='mui-slider-item mui-slider-item-duplicate'>"+
								"<a href="+'javascript:void(0);'+" onclick=openPage('"+idArray[orderArray[i]]+"')>"+
									"<img id='carouselImage' src="+imgArray[orderArray[i]]+">"+
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

function openPage(page){
	if(page == "back"){
		mui.back();
	}
	console.log(page);
}
