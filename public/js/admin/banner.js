function bannerSearch(that){
    var searchName=$(that).parent().prev().val()
    window.location.href="/admin/banner?searchName="+encodeURI(searchName)
}
$(function(){
    $('.right_col .getBannerModal').click(function(){
        var isCreate=$(this).attr("data-action")==0
        var el='#bannerModal'
        var title=isCreate?'新建轮播图':'编辑轮播图'
        if(isCreate){
            var footer=getUsersFooter(isCreate)
            var body=userBody('','','',isCreate)
            showTips(el,title, body,footer)
        }else{
            var obj =JSON.parse($(this).attr("data-obj"))
            var footer=getUsersFooter(isCreate,obj.Id)
            var body=userBody(obj.Title,obj.Describe,obj.Picture,isCreate)
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
                    var result = reader.result
                    checkImgPX(that,result)
                }
            }else{
                alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
            }
        })
    })
})
// 判断图片大小
function checkImgPX(that,result) {
    var width=675
    var height=240
    var img = new Image();
    img.src=result
    img.onload=function(){
        if(img.width >= width && img.height >= height) {
            that.parent().prev().find('img').attr("src", result);
            return;
        }
        alert("图的尺寸应该是大于宽度" + width + "和宽度"+ height);
    };
}
// users body
function userBody(Title,Describe,Avatar,flag){
    var body=`<form class="form-horizontal" id="bannerDialog">
        <div class="form-group">
            <label class="col-sm-2 control-label">标题</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" name="Title" value="${Title}">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">描述</label>
            <div class="col-sm-10">
            <input type="textarea" class="form-control" name="Describe" value="${Describe}">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">轮播图片</label>
            <div class="col-sm-10">
                <div class="thumbnail" style="width: 100%; height: 240px;">
                    <img src="${Avatar}" alt="" style="width:100%;height:100%;"/>
                </div>
                <button type="button" class="btn btn-default uploadFileBox">
                    <span class="glyphicon glyphicon-question-sign"></span>${flag?'选择图片':'更改图片'}
                    <input type="file" accept="image/*" class="uploadFile" name="Avatar" value=""/>
                </button>
                <span>&nbsp;请选择图片大于 675 * 240 的分辨率</span>
            </div>
        </div>
    </form>`
    return body;
}
// users footer
function getUsersFooter(flag,Id){
    return `<div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button type="button" class="btn btn-primary" onclick="${flag?'addBanner()':'editBanner('+Id+')'}">保存</button>
    </div>`
}
// 新增轮播图
function addBanner(){
    var params=arrayToJson($('#bannerDialog').serializeArray());
    var Avatar=$('#bannerDialog .uploadFile').parent().prev().find('img').attr('src')
    params.Avatar=Avatar
    if(isCorrectParams(params)){
        $.ajax({
            url: "/admin/banner",
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
// 编辑轮播图
function editBanner(id){
    var params=arrayToJson($('#bannerDialog').serializeArray());
    var Avatar=$('#bannerDialog .uploadFile').parent().prev().find('img').attr('src')
    params.Avatar=Avatar
    params.Id=id
    if(isCorrectParams(params)){
        $.ajax({
            url: "/admin/banner/"+id,
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
// 删除轮播图
function ToDelete(id){
    if(confirm('确认要删除这轮播图吗？')){
        $.ajax({
            url: "/admin/banner/"+id,
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