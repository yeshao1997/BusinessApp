function openPage(page){
	if(page == "back"){
		mui.back();
	}else if(page == "information"){
		mui.openWindow({
		    url: 'userCollectDetail.html',
		    id: 'userCollectDetail',
		    extras:{
		        type: 1
		    }
		});
	}else if(page == "work"){
		mui.openWindow({
		    url: 'userCollectDetail.html',
		    id: 'userCollectDetail',
		    extras:{
		        type: 2
		    }
		});
	}else if(page == "cloth"){
		mui.openWindow({
		    url: 'userCollectDetail.html',
		    id: 'userCollectDetail',
		    extras:{
		        type: 3
		    }
		});
	}else if(page == "costume"){
		mui.openWindow({
		    url: 'userCollectDetail.html',
		    id: 'userCollectDetail',
		    extras:{
		        type: 4
		    }
		});
	}
}