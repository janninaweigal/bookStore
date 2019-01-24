$(function(){
    // 是否管理员
    $('.isAdmin').bootstrapSwitch({  
        onText:"管理员",  
        offText:"普通用户",  
        onColor:"success",  
        offColor:"info",
        size:"normal",  
        onSwitchChange:function(event,state){
            var IsAdmin=state?1:0
            var that=$(this)
            var id=that.attr('data-id')
            $.ajax({
                url: "/admin/users/isAdmin/"+id,
                type: 'PUT',
                data:{
                    IsAdmin:IsAdmin
                },
                cache: false,
                success: function (res) {
                    if(res){
                        alert('设置成功~')
                    }else{
                        alert('设置失败~')
                        that.bootstrapSwitch('setState', !state);
                    }
                },
                fail: function () {
                    alert('请求失败!!')
                    that.bootstrapSwitch('setState', !state);
                }
            })
        }
     })
    $('.right_col .getUserModal').click(function(){
        var isCreate=$(this).attr("data-action")==0
        var el='#userModal'
        var title=isCreate?'新建用户信息':'编辑用户信息'
        if(isCreate){
            var footer=getUsersFooter(isCreate)
            var body=userBody('','','','','',isCreate)
            showTips(el,title, body,footer)
        }else{
            var obj =JSON.parse($(this).attr("data-obj"))
            var footer=getUsersFooter(isCreate,obj.Id)
            var body=userBody(obj.Username,obj.Avatar,obj.Email,obj.IsAdmin,obj.Password,isCreate)
            showTips(el,title, body,footer)
        }
        //上传图片
        $(el+' .uploadFile').change(function(){
            var that= $(this);
            var file = that.get(0).files[0];
            if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)){
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function () {
                    that.parent().prev().find('img').attr("src", reader.result);
                }
            }else{
                alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
            }
        })
        $('#isAdmin').bootstrapSwitch({  
            onText:"开",  
            offText:"关",  
            onColor:"success",  
            offColor:"info",  
            size:"normal",  
            onSwitchChange:function(event,state){
                if(state==true){  
                    console.log('已打开');
                }else{
                    console.log('已关闭');
                }  
            }
         })
    })
})
// users body
function userBody(Username,Avatar,Email,IsAdmin,Password,flag){
    var body=`<form class="form-horizontal" id="userDialog">
        <div class="form-group">
            <label class="col-sm-2 control-label">用户名</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" name="Username" placeHolder="默认密码（123456）" value="${Username}">
            </div>
        </div>
        ${flag?'':`<div class="form-group">
        <label class="col-sm-2 control-label">密码</label>
        <div class="col-sm-10">
        <input type="text" class="form-control" name="Password" data-password="${Password}" placeHolder="非必填项（填写则更改密码）" value="">
        </div>
    </div>`}
        <div class="form-group">
            <label class="col-sm-2 control-label">用户头像</label>
            <div class="col-sm-10">
                <div class="thumbnail" style="width: 200px; height: 150px;">
                    <img src="${Avatar}" alt="" style="width:100%;height:100%;"/>
                </div>
                <button type="button" class="btn btn-default uploadFileBox">
                    <span class="glyphicon glyphicon-question-sign"></span>${flag?'选择图片':'更改图片'}
                    <input type="file" accept="image/*" class="uploadFile" name="Avatar" value=""/>
                </button>
                <span>请选择图片</span>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">邮箱</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" name="Email" value="${Email}">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">是否管理员</label>
            <div class="col-sm-10">
                <input id="isAdmin" type="checkbox" ${IsAdmin?'checked':''}>
            </div>
        </div>
    </form>`
    return body;
}
// users footer
function getUsersFooter(flag,Id){
    return `<div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button type="button" class="btn btn-primary" onclick="${flag?'addUser()':'editUser('+Id+')'}">保存</button>
    </div>`
}
// 新增用户信息
function addUser(){
    var params=arrayToJson($('#userDialog').serializeArray());
    if(isCorrectParams(params)){
        var Avatar=$('#userDialog .uploadFile').parent().prev().find('img').attr('src')
        params.Avatar=Avatar?Avatar:'/images/default.jpg'
        params.IsAdmin=$("#isAdmin").is(':checked')?1:0
        $.ajax({
            url: "/admin/users",
            type: 'POST',
            data:params,
            cache: false,
            success: function (res) {
                if(res){
                    alert('保存成功~')
                    location.replace(location)
                }else{
                    alert('保存失败~')
                }
            },
            fail: function () {
                alert('请求失败!!')
            }
        })
    }else{
        alert('请填写好信息！！')
    }
}
// 编辑用户信息
function editUser(id){
    var params=arrayToJson($('#userDialog').serializeArray());
    var pass=params.Password
    params.Password=pass?pass:$("#userDialog input[name='Password']").attr('data-password')
    if(isCorrectParams(params)){
        params.Id=id
        params.BookPhoto=$('#userDialog .uploadFile').parent().prev().find('img').attr('src')
        params.IsAdmin=$("#isAdmin").is(':checked')?1:0
        $.ajax({
            url: "/admin/users/"+id,
            type: 'PUT',
            data:params,
            cache: false,
            success: function (res) {
                if(res){
                    alert('保存成功~')
                    location.replace(location)
                }else{
                    alert('保存失败~')
                }
            },
            fail: function () {
                alert('请求失败!!')
            }
        })
    }else{
        alert('请填写好信息！！')
    }
}
// 删除图书信息
function ToDelete(id){
    $.ajax({
        url: "/admin/users/"+id,
        type: 'DELETE',
        cache: false,
        success: function (res) {
            if(res){
                alert('删除成功~')
                location.replace(location)
            }else{
                alert('删除失败~')
            }
        },
        fail: function () {
            alert('删除失败!!')
        }
    })
}
function deleteUser(id){
    var el='#userModal'
    var title='删除用户信息'
    var body='是否要删除这个用户？'
    var footer=`<div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button type="button" class="btn btn-primary" onclick="ToDelete(${id})">确认</button>
    </div>`
    showTips(el,title, body,footer)
}
// 搜索
function goodsSearch(that){
    var searchName=$(that).parent().prev().val()
    window.location.href="/admin/user?searchName="+encodeURI(searchName)
}
// 判断信息填写完毕
function isCorrectParams(obj){
    var flag=true;
    $.each(obj, function (index,item) {
        if(item==''){
            flag=false;
            return flag;
        }
    })
    return flag
}
function isDisabled(flag){
    return flag?'':'disabled';
}
// json数组转对象
function arrayToJson(array){
    var json={}
    $.each(array, function (index,item) {
        json[item.name]=item.value
    })
    return json
}
// 弹窗的内容加载
function showTips(el,title, body,footer) {
    showModalOpen(el);
    $(el+' .modal-title').text(title);
    $(el+' .modal-body').html(body);
    $(el+' .modal-body').nextAll().remove();
    $(el+' .modal-body').after(footer);
}
// 公用开启和关闭
function showModalOpen(str){
    $(str).modal('show');
}
function showModalHide(str){
    $(str).modal('hide');
}