// 图书信息 新增/编辑的模态框
$('.right_col .getGoodsModal').click(function(){
    var isCreate=$(this).attr("data-action")==0
    var el='#goodsModal'
    var title=isCreate?'新建图书信息':'编辑图书信息'
    if(isCreate){
        var footer=getGoodsFooter(isCreate)
        var body=goodsBody('','','','','','','','',isCreate)
        showTips(el,title, body,footer)
    }else{
        var obj =JSON.parse($(this).attr("data-obj"))
        var footer=getGoodsFooter(isCreate,obj.Id)
        var body=goodsBody(obj.Author,obj.Name,obj.typeName,obj.BookPhoto,obj.Price,obj.Quantity,obj.Describe,obj.PublishCompany,isCreate)
        showTips(el,title, body,footer)
    }
    //上传图片
    $(el+' .uploadFile').change(function(){
        var that= $(this);
        var file = that.get(0).files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            that.parent().prev().find('img').attr("src", reader.result);
        }
    })
})
// goods body
function goodsBody(Author,Name,typeName,BookPhoto,Price,Quantity,Describe,PublishCompany,flag){
    var body=`<form class="form-horizontal" id="goodsDialog">
        <div class="form-group">
            <label class="col-sm-2 control-label">作者</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" name="Author" value="${Author}">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">图书类型</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" name="type" value="${typeName}" ${isDisabled(flag)}>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">图书名称</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" name="Name" value="${Name}">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">图书照片</label>
            <div class="col-sm-10">
                <div class="thumbnail" style="width: 200px; height: 150px;">
                    <img src="${BookPhoto}" alt="" style="width:100%;height:100%;"/>
                </div>
                <button type="button" class="btn btn-default uploadFileBox">
                    <span class="glyphicon glyphicon-question-sign"></span>${flag?'选择图片':'更改图片'}
                    <input type="file" accept="image/*" class="uploadFile" name="BookPhoto" value=""/>
                </button>
                <span>请选择图片</span>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">图书数量</label>
            <div class="col-sm-10">
            <input type="text" maxlength="6" onkeypress="return event.keyCode>=48&&event.keyCode<=57" name="Quantity" class="form-control" value="${Quantity}">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">图书价格</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" name="Price" value="${Price}" onkeyup="clearNoNum(this)">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">图书描述</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" name="Describe" value="${Describe}">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">出版社</label>
            <div class="col-sm-10">
            <input type="text" class="form-control" name="PublishCompany" value="${PublishCompany}">
            </div>
        </div>
    </form>`
    return body;
}
function clearNoNum(obj){
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是字符          
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个.清除多余的       
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}
// goods footer
function getGoodsFooter(flag,Id){
    return `<div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button type="button" class="btn btn-primary" onclick="${flag?'addGoods()':'editGoods('+Id+')'}">保存</button>
    </div>`
}
// 新增用户信息
function addGoods(){
    var params=arrayToJson($('#goodsDialog').serializeArray());
    if(isCorrectParams(params)){
        params.BookPhoto=$('#goodsDialog .uploadFile').parent().prev().find('img').attr('src')
        $.ajax({
            url: "/admin/goods",
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
// 编辑图书信息
function editGoods(id){
    var params=arrayToJson($('#goodsDialog').serializeArray());
    if(isCorrectParams(params)){
        params.Id=id
        params.BookPhoto=$('#goodsDialog .uploadFile').parent().prev().find('img').attr('src')
        $.ajax({
            url: "/admin/goods/"+id,
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
// 编辑图书信息
function editGoods(id){
    var params=arrayToJson($('#goodsDialog').serializeArray());
    if(isCorrectParams(params)){
        params.Id=id
        params.BookPhoto=$('#goodsDialog .uploadFile').parent().prev().find('img').attr('src')
        $.ajax({
            url: "/admin/goods/"+id,
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
        url: "/admin/goods/"+id,
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
function deleteGoods(id){
    var el='#goodsModal'
    var title='删除图书信息'
    var body='是否要删除这个图书？'
    var footer=`<div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button type="button" class="btn btn-primary" onclick="ToDelete(${id})">确认</button>
    </div>`
    showTips(el,title, body,footer)
}
// 搜索
function goodsSearch(that){
    var searchName=$(that).parent().prev().val()
    window.location.href="/admin/goods?searchName="+encodeURI(searchName)
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