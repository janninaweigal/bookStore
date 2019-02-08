
// 搜索
function shopcartSearch(that){
    var searchName=$(that).parent().prev().val()
    window.location.href="/admin/shopcarts?searchName="+encodeURI(searchName)
}
function deleteShopcart(id){
    $.ajax({
        url: "/admin/shopcarts/"+id,
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