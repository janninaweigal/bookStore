function commentsSearch(that){
    var searchName=$(that).parent().prev().val()
    window.location.href="/admin/comment?searchName="+encodeURI(searchName)
}
// 删除图书信息
function ToDelete(id){
    if(confirm('确认要删除这条评论吗？')){
        $.ajax({
            url: "/admin/comment/"+id,
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