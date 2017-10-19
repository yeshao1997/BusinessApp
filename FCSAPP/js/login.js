function login(){
	var account = $("#account-input").val();
	var password = $("#password-input").val();
 	
 	var url = 'http://172.16.41.126:8080/AccountController/login';
      mui.ajax(url, {
        data: {
          'account': account,
          'password': password
        },
        type: "POST", 
        timeout:1000,
        success: function(data) {
          console.log("result:"+JSON.stringify(data));
        }, 
	    error:function(xhr,type,errorThrown){
			//异常处理；
			console.log(xhr.status);
			console.log(xhr.readyState);
			console.log("error:"+type);
			console.log(errorThrown);
			mui.toast("网络错误！！！");
		}
      });
}