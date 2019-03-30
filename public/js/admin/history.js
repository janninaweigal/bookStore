
// 搜索
function historySearch(that){
    var searchName=$(that).parent().prev().val()
    window.location.href="/admin/history?searchName="+encodeURI(searchName)
}