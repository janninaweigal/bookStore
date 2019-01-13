import {menus} from './dictionary.js'
/**
 * 
 * @param {*} main_menu 主menu名称
 * @param {*} child_menu 子menu的href
 */
export function getMenu(main_menu,child_menu) {
    let menuArray=arrDeepCopy(menus)
    if(main_menu&&child_menu){
        menuArray.forEach(function(value) {
            if(value.name==main_menu){
                value.active=true
                value.child_menu.forEach(function(item) {
                    if(item.href==child_menu){
                        return item.active=true
                    }
                })
            }
        });
    }
    return menuArray;
}
function arrDeepCopy(source){
    var sourceCopy = [];
    for (var item in source) sourceCopy[item] = typeof source[item] === 'object' ? arrDeepCopy(source[item]) : source[item];
    return sourceCopy;
}