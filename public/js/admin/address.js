// 搜索
function addressSearch(that){
    var searchName=$(that).parent().prev().val()
    window.location.href="/admin/address?searchName="+encodeURI(searchName)
}
function deleteAddress(id){
    $.ajax({
        url: "/admin/address/"+id,
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