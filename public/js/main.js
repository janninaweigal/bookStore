$(function () {
    //验证变量
    var flag=false;
    //返回顶部
    $('#xiangshang').hide();
    $(window).scroll(function() {
        if($(document).scrollTop()>0)
        {
            $('#xiangshang').show();
        }else
        {
            $('#xiangshang').hide();
        }
    });
    $('#xiangshang').click(function () {
        $("html, body").animate({
            "scroll-top":0
        },"fast");
    });
    //登录
    $('#login').click(function () {
        showModalOpen('#loginModal');
    });
    //注册
    $('#register').click(function () {
        showModalOpen('#registerModal');
    });
    
    //用户名验证
    $('#uname1').keyup(function(){
    	$(this).parent().nextAll().remove();
    	var reg = /^[A-Za-z]+/; // 判断输入的是不是以字母开头
    	if(!reg.test($(this).val())){
            flag=false;
            addDisabled('#register1')
    		$(this).parent().after('<div class="alert alert-danger help-block">用户名必须以英文字母开始</div>');
        }
        if($(this).val().length<5){
            flag=false;
            addDisabled('#register1')
    		$(this).parent().after('<div class="alert alert-danger help-block">用户名长度不能小于5位</div>');
        }
        if($(this).val().length>10){
            flag=false;
            addDisabled('#register1')
        	$(this).parent().after('<div class="alert alert-danger help-block">用户名长度不能超过10位</div>');
        }else{
        	flag=true;
        }
    });
    //密码验证
    $('#upass1').keyup(function(){
    	$(this).parent().nextAll().remove();
        if($(this).val().length<5){
            flag=false;
            addDisabled('#register1')
    		$(this).parent().after('<div class="alert alert-danger help-block">密码长度不能小于5位</div>');
        }
        if($(this).val().length>10){
            flag=false;
            addDisabled('#register1')
        	$(this).parent().after('<div class="alert alert-danger help-block">密码长度不能超过10位</div>');
        }else{
            flag=true;
        }
    });
    //确认密码验证
    $('#passConfirm').keyup(function(){
    	$(this).parent().nextAll().remove();
        if($(this).val()!=$('#upass1').val()){
            flag=false;
            addDisabled('#register1')
    		$(this).parent().after('<div class="alert alert-danger help-block">密码和确认密码不一致</div>');
        }else{
        	flag=true;
        }
    });
    //邮箱验证
    $('#email').keyup(function(){
    	$(this).parent().nextAll().remove();
    	var reg =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if(!reg.test($('#email').val())){
            flag=false;
            addDisabled('#register1')
    		$(this).parent().after('<div class="alert alert-danger help-block">邮箱格式不正确</div>');
        }else{
        	flag=true;
        }
        if(flag){
    		$('#register1').removeAttr("disabled");
    	}
    });
    //点击注册按钮
    $('#register1').click(function () {
        var username=$('#uname1').val();
        var password=$('#upass1').val();
        var passConfirm=$('#passConfirm').val();
        var email=$('#email').val();
    	if(username&&password&&email){
            if(password!=passConfirm){
                showTips('#myModalCommon','用户注册','密码和确认密码不一致！！')
                return;
            }
            $.ajax({
                url: "/register",
                type: 'POST',
                data:{
                    username,
                    password,
                    email
                },
                cache: false,
                success: function (res) {
                    if(res.flag){
                        showModalHide('#registerModal');
                        location.replace(location)
                    }
                    showTips('#myModalCommon','用户注册',res.msg)
                },
                fail: function (res) {
                    showTips('#myModalCommon','用户注册',res.msg)
                }
            })
        }else{
            showTips('用户注册','请填写好信息！！')
        }
    });
    //密码验证
    $('#upass').keyup(function(){
    	if($('#uname').val()!=null&&$('#upass').val()!=null){
    		$('#login1').removeAttr("disabled");
    	}else{
            addDisabled('#login1')
        }
    });
    //点击登陆按钮
    $('#login1').click(function () {
        var username=$('#uname').val();
        var password=$('#upass').val();
        if(username&&password){
            $.ajax({
				url: "/login",
                type: 'POST',
                data:{
                    username,
                    password
                },
				cache: false,
				success: function (res) {
                    if(res.flag){
                        showModalHide('#loginModal');
                        location.replace(location)
                    }
                    showTips('#myModalCommon','用户登录',res.msg)
                },
                fail: function (res) {
                    showTips('#myModalCommon','用户登录',res.msg)
                }
            })
        }else{
            showTips('#myModalCommon','用户登录','请填写好信息！！')
        }
    });
    // 公用方法
    function showTips(el,title, msg) {
        showModalOpen(el);
        $(el+' .modal-title').text(title);
        $(el+' .modal-body').text(msg);
        //2秒后消失提示框
        setTimeout(
            function () {
                showModalHide(el);
            }, 2000
        );
    }
    function addDisabled(el) {
        $(el).attr("disabled",'disabled');
    }
    // 公用开启和关闭
    function showModalOpen(str){
        $(str).modal('show');
    }
    function showModalHide(str){
        $(str).modal('hide');
    }
});