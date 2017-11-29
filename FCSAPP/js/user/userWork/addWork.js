var workId;
var albumId;
var workName;
var workColor;
var workType;
var workComponent;
var workStyle;
var workModel;
var workIntro;
var workImageArray = new Array();

var workImageSelected = 0;

var typeArray;
var componentArray;
var styleArray;
var modelArray;

var IPPost = localStorage.getItem("IPPost");
var userId = localStorage.getItem("userId");

//返回上一个界面时，刷新界面
mui.init({
    beforeback: function() { 
	    var opener = plus.webview.currentWebview().opener();  
	    mui.fire(opener, 'refresh');  
	    return true;  
    }  
}); 

function openPage(page){
	if(page == "back"){
		mui.back();
	}
}

mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	albumId = self.albumId;
	workId = null;
	var pageType = self.pageType;
	if(pageType == "add"){
		$("#title").text("新建作品");
	}else{
		$("#title").text("修改作品");
		workId = self.workId;
		getWorkData();
	}
	getPickerData();
});

function _getParam(obj, param) {
	return obj[param] || '';
}

function getWorkData(){
	var url = IPPost+'WorkController/getWorkToUpdate';
	mui.ajax(url, {
	    data: {
	    	workId: workId
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取作品信息失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				updataUI(resultJson.obj);				
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function getPickerData(){
	var url = IPPost+'DictDataController/getWorkPickerData';
	mui.ajax(url, {
	    data: {},
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("获取数据失败，网络错误");
	    	console.log("获取数据失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				typeArray = resultJson.obj;
				componentArray = resultJson.obj1;
				styleArray = resultJson.obj2;
				modelArray = resultJson.obj3;
				setData();
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function updataUI(obj){
	$("#workNameInput").val(obj.workName);
	$("#workColorInput").val(obj.workColor);
	$("#workIntro").val(obj.workIntro);
	
	$("#workTypeBig").text(obj.costumeTypeBig);
	$("#workTypeMid").text(obj.costumeTypeMid);
	$("#workTypeMal").text(obj.costumeTypeMal);
	
	$("#workComponentBig").text(obj.componentBig);
	$("#workComponentMal").text(obj.componentMal);
	
	$("#workStyle").text(obj.workStyle);
	$("#workModel").text(obj.workModel);
	
	workType = obj.costumeTypeMalValue;
	workComponent = obj.componentMalValue;
	workStyle = obj.workStyleValue;
	workModel = obj.workModelValue;
	
	image1.src = IPPost + "image1/" +obj.workPicture1;
	image2.src = IPPost + "image1/" +obj.workPicture2;
	image3.src = IPPost + "image1/" +obj.workPicture3;
	image4.src = IPPost + "image1/" +obj.workPicture4;
	image5.src = IPPost + "image1/" +obj.workPicture5;
	image6.src = IPPost + "image1/" +obj.workPicture6;
	
	workImageArray[0] = obj.workPicture1;
	workImageArray[1] = obj.workPicture2;
	workImageArray[2] = obj.workPicture3;
	workImageArray[3] = obj.workPicture4;
	workImageArray[4] = obj.workPicture5;
	workImageArray[5] = obj.workPicture6;
	
	workImageSelected = 6;
}

function setData(){
	(function($, doc) {
		$.init();
		$.ready(function() {
			var typePicker = new $.PopPicker({ layer: 3 });
			var componentPicker = new $.PopPicker({ layer: 2 });
			var stylePicker = new $.PopPicker();
			var modelPicker = new $.PopPicker();
			
			var showTypePickerButton = doc.getElementById('workTypeSelect');
			var showComponentPickerButton = doc.getElementById('workComponentSelect');
			var showStylePickerButton = doc.getElementById('workStyleSelect');
			var showModlePickerButton = doc.getElementById('workModelSelect');
			var image1 = document.getElementById('image1');
			var image2 = document.getElementById('image2');
			var image3 = document.getElementById('image3');
			var image4 = document.getElementById('image4');
			var image5 = document.getElementById('image5');
			var image6 = document.getElementById('image6');
			
			typePicker.setData(typeArray);
			componentPicker.setData(componentArray);
			stylePicker.setData(styleArray);
			modelPicker.setData(modelArray);
			
			showTypePickerButton.addEventListener('tap', function(event) {
				typePicker.show(function(items) {
					jQuery("#workTypeBig").text(_getParam(items[0], 'text'));
					jQuery("#workTypeMid").text(_getParam(items[1], 'text'));
					jQuery("#workTypeMal").text(_getParam(items[2], 'text'));
					workType = _getParam(items[2], 'value');
				});
			}, false);
			showComponentPickerButton.addEventListener('tap', function(event) {
				componentPicker.show(function(items) {
					jQuery("#workComponentBig").text(_getParam(items[0], 'text'));
					jQuery("#workComponentMal").text(_getParam(items[1], 'text'));
					workComponent = _getParam(items[1], 'value');
				});
			}, false);
			showStylePickerButton.addEventListener('tap', function(event) {
				stylePicker.show(function(items) {
					jQuery("#workStyle").text(_getParam(items[0], 'text'));
					workStyle = _getParam(items[0], 'value');
				});
			}, false);
			showModlePickerButton.addEventListener('tap', function(event) {
				modelPicker.show(function(items) {
					jQuery("#workModel").text(_getParam(items[0], 'text'));
					workModel = _getParam(items[0], 'value');
				});
			}, false);
		});
	})(mui, document);
}

function upload(){
	workImageArray[0] = getBase64Image(image1);
	workImageArray[1] = getBase64Image(image2);
	workImageArray[2] = getBase64Image(image3);
	workImageArray[3] = getBase64Image(image4);
	workImageArray[4] = getBase64Image(image5);
	workImageArray[5] = getBase64Image(image6);
	workName = $("#workNameInput").val();
	workColor = $("#workColorInput").val();
	workIntro = $("#workIntro").val();
	if(workName == null || workName == ""){
		mui.toast("作品名不能为空");
	}else if(workColor == null || workColor == ""){
		mui.toast("作品颜色不能为空");
	}else if(workType == null || workType == ""){
		mui.toast("作品分类不能为空");
	}else if(workComponent == null || workComponent == ""){
		mui.toast("作品面料不能为空");
	}else if(workStyle == null || workStyle == ""){
		mui.toast("作品风格不能为空");
	}else if(workModel == null || workModel == ""){
		mui.toast("作品款式不能为空");
	}else if(workImageSelected != 6){
		mui.toast("需要6张图片，已添加"+workImageSelected+"图片");
	}else if(workIntro == null || workIntro == ""){
		mui.toast("作品简介不能为空");
	}else{
		if(workId != null){
			upLoadUpdateWork();
		}else{
			upLoadAddWork();
		}
		
	}
}


function upLoadAddWork(){
	var url = IPPost+'WorkController/addWork';
	mui.ajax(url, {
	    data: {
	    	albumId: albumId,
	    	designerId: userId,
	    	workName: workName,
	    	workColor: workColor,
	    	workType: workType,
	    	workComponent: workComponent,
	    	workStyle: workStyle,
	    	workModel: workModel,
	    	workIntro: workIntro,
	    	workImage: workImageArray
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("上传数据失败，网络错误");
	    	console.log("上传数据失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				console.log("上传成功");
				openPage('back');
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function upLoadUpdateWork(){
	var url = IPPost+'WorkController/updateWork';
	mui.ajax(url, {
	    data: {
	    	workId: workId,
	    	albumId: albumId,
	    	designerId: userId,
	    	workName: workName,
	    	workColor: workColor,
	    	workType: workType,
	    	workComponent: workComponent,
	    	workStyle: workStyle,
	    	workModel: workModel,
	    	workIntro: workIntro,
	    	workImage: workImageArray
	    },
	    type: "POST",
	    timeout: 3000,
	    traditional: true,
	    error: function(){
	    	mui.toast("更新数据失败，网络错误");
	    	console.log("更新数据失败，网络错误");
	    },
	    success: function(data){
	    	var resultJson = JSON.parse(JSON.stringify( data ));
			if(resultJson.code == 1){
				console.log("更新数据成功");
				openPage('back');
			}else{
				mui.toast(resultJson.msg);
			}
	    }
	});
}

function getBase64Image(img){
    var canvas=document.createElement("canvas");
    var width=img.width;
    var height=img.height;

    canvas.width=width;
    canvas.height=height;
    var ctx=canvas.getContext('2d');
    ctx.drawImage(img,0,0,width,height);

    var dataUrl=canvas.toDataURL('image/png',0.8);
    return dataUrl.replace('data:image/png:base64,','');
}

image1.addEventListener('tap', function() {
	plus.gallery.pick(
        function(path) {
        	if(workImageArray[0] == null){
        		workImageSelected++;
        	}
            image1.src = path;
        }
    );
});
image2.addEventListener('tap', function() {
	plus.gallery.pick(
        function(path) {
        	if(workImageArray[1] == null){
        		workImageSelected++;
        	}
            image2.src = path;
        }
    );
});
image3.addEventListener('tap', function() {
	plus.gallery.pick(
        function(path) {
        	if(workImageArray[2] == null){
        		workImageSelected++;
        	}
            image3.src = path;
        }
    );
});
image4.addEventListener('tap', function() {
	plus.gallery.pick(
        function(path) {
        	if(workImageArray[3] == null){
        		workImageSelected++;
        	}
            image4.src = path;
        }
    );
});
image5.addEventListener('tap', function() {
	plus.gallery.pick(
        function(path) {
        	if(workImageArray[4] == null){
        		workImageSelected++;
        	}
            image5.src = path;
        }
    );
});
image6.addEventListener('tap', function() {
	plus.gallery.pick(
        function(path) {
        	if(workImageArray[5] == null){
        		workImageSelected++;
        	}
            image6.src = path;
        }
    );
});