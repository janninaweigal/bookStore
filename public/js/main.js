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
                showTips('用户注册','密码和确认密码不一致！！')
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
                    showTips('用户注册',res.msg)
                },
                fail: function (res) {
                    showTips('用户注册',res.msg)
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
                    showTips('用户登录',res.msg)
                },
                fail: function (res) {
                    showTips('用户登录',res.msg)
                }
            })
        }else{
            showTips('用户登录','请填写好信息！！')
        }
    });
    $('.bookList .bookTypeLink').click(function(){
        var that=$(this);
        var id=that.attr('data-id');
        $.ajax({
            url: "/home?type="+id,
            type: 'POST',
            cache: false,
            success: function (res) {
                if(res.flag){
                    var data=res.Data
                    if(data){
                        var str=''
                        for(var i=0;i<data.length;i++){
                            var itemSelf=data[i]
                            str+=`<div class="col-sm-6 col-md-3">
                                <div class="thumbnail">
                                    <img src="${itemSelf.BookPhoto}" title="${itemSelf.BookName}" alt="${itemSelf.BookName}" width="100%">
                                    <div class="caption">
                                        <p>单价：${itemSelf.Price}&nbsp;&nbsp;&nbsp;数量：${itemSelf.Quantity}<br/>出版社：${itemSelf.PublishCompany}<br/>出版时间：${itemSelf.PublishTime}<br/>${itemSelf.IsToCart==1?'热门商品':'普通商品'}<br/>${itemSelf.Describe}</p>
                                        <a href="/goodsDetail?id=${itemSelf.Id}" class="btn btn-primary" role="button">${itemSelf.Name}<span class="glyphicon glyphicon-leaf"></span></a>
                                    </div>
                                </div>
                            </div>`
                        }
                        $('.bookList .bookTypeLink').attr("style","")
                        that.css("color","red")
                        $('.bookList .col-sm-6').remove();
                        $('.bookList').append(str)
                    }
                }else{
                    showTips('tab切换','加载失败')
                }
            }
        })
    })
    // 公用方法
    function showTips(title, msg) {
        var el='#myModalCommon'
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
    // 评论
    $("#comment .sendComment").click(function(){
        var that=$(this);
        // 评论的文字
        var comment=that.parent().prev().val();
        if(comment.length==0){
            showTips('用户评论', '请填写评论哟~')
        }else{
            var bookId=getQueryString("id");
            $.ajax({
				url: "/comment",
                type: 'POST',
                data:{
                    comment,
                    bookId
                },
				cache: false,
				success: function (res) {
                    // code："no-login" 用户没登陆    "success" 成功
                    if(res.code=="success"){
                        var data=res.data;
                        var str=''
                        for(var i=0;i<data.length;i++){
                            var item=data[i]
                            str+=`<div class="media">
                                <div class="media-left">
                                    <img class="media-object" alt="${item.Username}" src="images/${item.Avatar}" style="width: 64px; height: 64px;">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">${item.Username}</h4>
                                    <p>${item.Content}</p>
                                    <div class="text-right">发表于：${item.UpdateTime}</div>
                                </div>
                            </div>`
                            if (data.length-1!=i){
                                str+="<hr/>"
                            }
                        }
                        // 先清空原有数据
                        that.parent().nextAll().remove();
                        showTips('用户评论','评论成功~')
                        // 添加新数据
                        that.parent().after(str)
                    }else if(res.code=="no-login"){
                        showTips('用户评论','请先登录后评论！！')
                    }else{
                        showTips('用户评论','评论失败')
                    }
                },
                fail: function () {
                    showTips('用户评论','评论失败')
                }
            })
        }
    })
    $("#shopcarts .table input[type='number']").bind("input propertychange",function(target){
        getTotalPrice()
    });
    
    // 购物车的总和
    function getTotalPrice(){
        var that=$('#shopcarts .table tbody tr')
        var sum=0;
        for(var i=0;i<that.length-1;i++){
            var price=parseFloat(that.eq(i).children().eq(3).text());
            var quantity=parseInt(that.eq(i).children().eq(4).find('input').val())||0;
            sum+=(price*quantity)
        }
        $('.shopcartTotal').text(sum)
    }
    // 增加
    $(".addQuantity").click(function(){
        // 输入框的内容
        var that=getResult($(this),0)
        // 默认
        var num=getResult($(this),1)
        if(num){
            num=parseInt(num)+1
        }else{
            num=1
        }
        that.val(num);
        $('.totalPrice').text(parseFloat($('.Price').text())*num)
        getTotalPrice()
    })
    // 减少
    $(".reduceQuantity").click(function(){
        // 输入框的内容
        var that=getResult($(this),0)
        // 默认
        var num=getResult($(this),1)
        if(num&&num>0){
            num=parseInt(num)-1
        }else{
            num=0
        }
        that.val(num);
        $('.totalPrice').text(parseFloat($('.Price').text())*num)
        getTotalPrice()
    })
    // 加入购物车addShopCarts
    $('.addShopCarts').click(function (){
        var bookId=getQueryString("id");
        if(bookId){
            var quantity=$(this).parent().prevAll().eq(3).find("input[type='number']").val()||0;
            var totalPrice=$('.totalPrice').text()||0;
            $.ajax({
                url: "/addShopCarts",
                type: 'POST',
                data:{
                    bookId,
                    quantity,
                    totalPrice
                },
                cache: false,
                success: function (res) {
                    if(res.code=="success"){
                        showTips('购物车','加入购物车成功')
                    }else{
                        showTips('购物车','请先登录！')
                    }
                },
                fail: function () {
                    showTips('购物车','请先登录！')
                }
            })
        }else{
            showTips('购物车','地址栏参数错误')
        }
    })
    // 增加和减少的通用方法
    function getResult(that,flag){
        // 输入框的内容
        var el=that.parent();
        // 判断是在购物车页面还是商品详情页面
        if(el.hasClass("form-group")){
            el=el.find('.form-control');
        }else{
            el=el.prev()
        }

        if(flag==0){
            return el;
        }else{
            var num=el.val();
            return num;
        }
    }
    // 搜索的下拉框
    $('.searchName').click(function(){
        $(this).parent().parent().prev('.dropdown-toggle').html($(this).text()+'&nbsp;<span class="caret"></span>')
        $('.searchResult').attr('data-typeId',$(this).attr('data-typeId'))
    })
    // 搜索按钮
    $('.searchResult').click(function(){
        var searchName=$(this).prev('.form-group').find('.form-control').val()
        var typeId=$(this).attr('data-typeId')
        window.location.href=['/search?typeId=',typeId,'&searchName=',encodeURI(searchName)].join('')
    })
    // 公用开启和关闭
    function showModalOpen(str){
        $(str).modal('show');
    }
    function showModalHide(str){
        $(str).modal('hide');
    }
    // 获取地址栏的参数
    function getQueryString(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null; 
    } 
});