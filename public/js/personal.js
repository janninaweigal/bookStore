$(function(){
    // 个人信息
    $('.personInfo .profile .uploadFile').change(function(){
        var that= $(this);
        var file = that.get(0).files[0];
        if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)){
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                var result = reader.result
                that.prev('img').attr("src", result);
            }
        }else{
            alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
        }
    })
    // 保存更改
    $('.personInfo .profile .btn-primary').click(function(){
        var that = $(this)
        var avatar=that.parent().find('img').attr('src')
        $.ajax({
            url: "/personal/updateImg",
            type: 'PUT',
            data:{
                avatar
            },
            cache: false,
            success: function (res) {
                alert(res.msg)
            },
            fail: function () {
                alert('错误,请刷新页面！')
            }
        })
    })
})