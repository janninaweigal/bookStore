

//import { create } from 'domain';

var mysql = require('mysql');
var config = require('../config/default.js')
var userModel = require('../lib/mysql');
//建立数据库连接池
var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

let query = function(sql, values) {
    return new Promise((resolve, reject)=>{
        pool.getConnection(function (err,connection) {
            if(err){
                reject(err);
            }else{
                connection.query(sql,values,(err,rows)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(rows);
                    }
                    connection.release(); //为每一个请求都建立一个connection使用完后调用connection.release(); 直接释放资源。
                                          //query用来操作数据库表
                })
            }
         
    })
    })
}
// 用户表
// var Users = `create table if not exists Users(
//     Id INT(11) NOT NULL AUTO_INCREMENT,
//     UserName VARCHAR(100) NOT NULL COMMENT '用户名',
//     Password VARCHAR(40) NOT NULL COMMENT '密码',
//     Avator VARCHAR(100) DEFAULT 'default.jpg' COMMENT '用户头像',
//     CreateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT '创建时间',
//     UpdateTime TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP  COMMENT '更新时间',
//     PRIMARY KEY (Id)
// );`
// let createTable = function(sql){
//     return query(sql, []);
// }
// //建表
// createTable(Users);

// 注册用户
let insertUser = function(value){
    let _sql = "insert into Users(Username,Password,Email) values(?,?,?);"
    return query(_sql,value);
}
// 查询用户信息
let selectUser = function(value){
    let _sql = "select Username,Password from Users where Username=? and Password=?"
    return query(_sql,value);
}
// 通过用户名查询用户信息
let findUserByName = function(username){
    let _sql = `select Id,Username,Avatar,IsAdmin,Email from Users where Username='${username}'`
    return query(_sql);
}
// 通过用户id查询用户信息
let findUserById = function(id){
    let _sql = `select Id,Username,Avatar,IsAdmin,Email from Users where Id='${id}'`
    return query(_sql);
}
// 更新用户信息
let updateUser = function(value){
    let _sql = "update Users set UserName=? where Id=?"
    return query(_sql,value);
}
// 查询所有用户
let selectUserInfo = function(globalName,pageNo,pageSize){
    let _sql = `select u.Id,u.Username,u.Password,u.Avatar,u.Email,u.IsAdmin from Users u
    where u.Username like '%${globalName}%' or u.Email like '%${globalName}%' 
    limit ${pageNo},${pageSize}`
    return query(_sql);
}
let selectUserInfoLength = function(){
    let _sql = "select count(1) as count from Users u"
    return query(_sql);
}
// 插入用户信息
let insertUserInfo = function(value){
    let _sql = "insert into Users(Username,Avatar,Email,IsAdmin) values(?,?,?,?);"
    return query(_sql,value);
}
// 更新用户信息 // 与旧头像不同
let updateUserInfo = function(value){
    let _sql = "update Users u set u.Username=?,u.Password=?,u.Avatar=?,u.Email=?,u.IsAdmin=? where u.Id=?"
    return query(_sql,value);
}
// 更新用户信息 // 与旧头像相同
let updateUserInfoNoAvatar = function(value){
    let _sql = "update Users u set u.Username=?,u.Password=?,u.Email=?,u.IsAdmin=? where u.Id=?"
    return query(_sql,value);
}
// 查找收藏的商品
let selectCollectionGoods = function(UserId){
    let _sql = `select b.Id as BookId,b.BookPhoto,b.Name as BookName,b.Price,b.Quantity from Books_Collection c left join Books b on c.BookId=b.Id where UserId=${UserId} and CollectionFlag=1`
    return query(_sql);
}
// 查询所有的历史订单
let selectAllOrderHistory = function(globalName,pageNo,pageSize) {
    let _sql=`select a.Trade_No,u.Username,b.Name as BookName,ad.Name as receiver,ad.Address as receiverAddress,b.BookPhoto,a.Quantity,a.Total_Amount from books_alipay a left join books b on b.id=a.BookId LEFT join users u on u.id=a.UserId left join users_address ad on ad.id=a.UserAddressId where u.Username like '%${globalName}%' or a.Trade_No like '%${globalName}%' or b.Name like '%${globalName}%'
    limit ${pageNo},${pageSize}`
    return query(_sql)
}
let selectAllOrderHistoryLength =function(globalName){
    let _sql=`select count(1) as count from books_alipay a left join books b on b.id=a.BookId LEFT join users u on u.id=a.UserId left join users_address ad on ad.id=a.UserAddressId where u.Username like '%${globalName}%' or a.Trade_No like '%${globalName}%' or b.Name like '%${globalName}%'`
    return query(_sql);
}
// 查询用户的所有历史订单
let selectOrderHistoryByUserId = function(userId) {
    let _sql="select a.Trade_No,b.Name as BookName,ad.Name as receiver,ad.Address as receiverAddress,b.BookPhoto,a.Quantity,a.Total_Amount from books_alipay a left join books b on b.id=a.BookId left join users_address ad on ad.id=a.UserAddressId where a.id="+userId
    return query(_sql)
}
// 更改头像
let updateUserImg = function(avatar,id){
    let _sql = `update Users u set u.Avatar='${avatar}' where u.Id=${id}`
    return query(_sql);
}
// 更改用户权限
let updateUserAdmin = function(value){
    let _sql = "update Users u set u.IsAdmin=? where u.Id=?"
    return query(_sql,value);
}
// 删除用户信息
let deleteUserInfo = function(id){
    let _sql = `delete from Users where Id=${id}`
    return query(_sql);
}

// 插入用户地址
let insertUserAddress = function(value){
    let _sql = "insert into Users_Address(UserId,Name,Phone,Address,IsDefault) values(?,?,?,?,?);"
    return query(_sql,value);
}
// 更新用户地址
let updateUserAddress = function(value){
    let _sql = "update Users_Address u set u.Name=?,u.Phone=?,u.Address=?,u.IsDefault=? where u.Id=?"
    return query(_sql,value);
}
// 删除用户地址
let deleteUserAddress = function(id){
    let _sql = `delete from Users_Address where Id=${id}`
    return query(_sql);
}
let selectAllUserAddress = function(globalName,pageNo,pageSize){
    let _sql = `select ua.Id,ua.Name,u.Username,ua.UserId,ua.Phone,ua.Address,ua.IsDefault from Users_Address ua left join Users u on ua.UserId=u.Id
    where ua.Name like '%${globalName}%' or ua.Phone like '%${globalName}%' or ua.Address like '%${globalName}%' 
     limit ${pageNo},${pageSize}`
    return query(_sql);
}
let selectAllUserAddressLength = function(globalName){
    let _sql = `select count(1) as count from Users_Address ua 
    where ua.Name like '%${globalName}%' or ua.Phone like '%${globalName}%' or ua.Address like '%${globalName}%'`
    return query(_sql);
}
// 查询用户地址
let selectUserAddress = function(id){
    let _sql = "select ua.Id,ua.Name,u.Username,ua.UserId,ua.Phone,ua.Address,ua.IsDefault from Users_Address ua left join Users u on ua.UserId=u.Id"
    if(id){_sql+=` where ua.UserId=${id}`}
    return query(_sql);
}
// 查询是否已经存在默认地址
let selectUserDefaultAddress = function(UserId){
    let _sql = `select ua.Id from Users_Address ua where ua.UserId=${UserId} and ua.IsDefault=1`
    return query(_sql);
}
// 更改默认地址
let updateUserDefaultAddress = function(Id,IsDefault){
    let _sql = `update Users_Address ua set ua.IsDefault=${IsDefault} where ua.Id=${Id}`
    return query(_sql);
}

// 查询所有图书类型的id
let selectBookType = function(){
    let _sql = "select Id,Name from Books_Type"
    return query(_sql);
}
// 添加图书类型
let insertBookType = function(name){
    let _sql = `insert into Books_Type(Books_Type.Name) values('${name}');`
    return query(_sql);
}
// 更新销售量
let updateBookSaleNum = function(num,quantity,id){
    let _sql = `update Books set SaleNum=${num},Quantity=${quantity} where id=${id}`
    return query(_sql);
}
// 更新收藏量
let updateBookCollectionNum = function(num,id){
    let _sql = `update Books set CollectionNum=${num} where id=${id}`
    return query(_sql);
}
// 通过Id查图书信息
let selectBookById = function(Id){
    let _sql = `select b.Id as BookId,bt.Name,b.Name as BookName,b.Isbn,b.Author,b.BookPhoto,b.Price,b.Quantity,b.Describe,DATE_FORMAT(b.PublishTime,'%Y年%m月%d日') as PublishTime,b.PublishCompany,b.IsMember,b.IsHot from Books b left join Books_Type bt on bt.Id=b.BookTypeId where b.Id in (${Id})`
    return query(_sql);
}
// 添加图书信息
let insertBookInfo = function(value){
    let _sql = `insert into Books(BookTypeId,Author,Books.Name,BookPhoto,Price,Quantity,Books.Describe,PublishCompany) values(?,?,?,?,?,?,?,?);`
    return query(_sql,value);
}
// 编辑图书信息1 图片更新
let updateBookInfo = function(value){
    let _sql = `update Books b set Author=?,b.Name=?,b.BookPhoto=?,b.Price=?,b.Quantity=?,b.Describe=?,b.PublishCompany=? where b.Id=?`
    return query(_sql,value);
}
// 编辑图书信息2 图片不更新
let updateBookInfoNoPhoto = function(value){
    let _sql = `update Books b set Author=?,b.Name=?,b.Price=?,b.Quantity=?,b.Describe=?,b.PublishCompany=? where b.Id=?`
    return query(_sql,value);
}
// 删除图书信息
let deleteBookInfo = function(id){
    let _sql = `delete from Books where Id=${id}`
    return query(_sql);
}
// 通过TypeId查所有图书信息
let selectBooksByTypeId = function(BookTypeId,FieldName){
    let _sql = `select b.Id as BookId,bt.Name,b.Name as BookName,b.BookPhoto,b.Price,b.Quantity,b.Describe,DATE_FORMAT(b.PublishTime,'%Y年%m月%d日') as PublishTime,b.PublishCompany,b.IsHot from Books b left join Books_Type bt on bt.Id=b.BookTypeId where b.BookTypeId=${BookTypeId} `
    if(FieldName){
        _sql+=FieldName;
    }else{
        // 默认销售量排行
        _sql+=' ORDER BY SaleNum ASC';
    }
    return query(_sql);
}
// 所有图书信息
let selectBookList = function(globalName,pageNo,pageSize){
    let _sql = `select b.Id,b.Author,b.Name,bt.Name as typeName,b.Quantity,b.Price,b.Describe,b.Isbn,b.BookPhoto,b.PublishCompany,DATE_FORMAT(b.PublishTime,'%Y年%m月%d日') as PublishTime from Books b
     LEFT JOIN Books_Type bt on b.BookTypeId=bt.Id 
     where b.Name like '%${globalName}%' or b.Author like '%${globalName}%' or b.PublishCompany like '%${globalName}%' 
     limit ${pageNo},${pageSize}`
    return query(_sql);
}
// 所有图书信息长度
let selectBookListLength = function(globalName){
    let _sql = `select count(1) as count from Books b LEFT JOIN Books_Type bt on b.BookTypeId=bt.Id where b.Name like '%${globalName}%' or b.Author like '%${globalName}%' or b.PublishCompany like '%${globalName}%'`
    return query(_sql);
}
// 搜索分页
let selectBooksPageByTypeId = function(BookTypeId,pageNo,pageSize,searchName){
    let _sql = "select bt.Name,bt.Id as TypeId,b.Id as BookId,b.Name as BookName,b.BookPhoto,b.Price,b.Quantity,b.Describe,DATE_FORMAT(b.PublishTime,'%Y年%m月%d日') as PublishTime,b.PublishCompany,b.IsHot from Books b left join Books_Type bt on bt.Id=b.BookTypeId where "
    if(BookTypeId!=-1){
        _sql+=`b.BookTypeId=${BookTypeId} and `
    }
    _sql+=`b.Name like '%${searchName}%' limit ${pageNo},${pageSize}`
    return query(_sql);
}
// 搜索的总数目
let selectBooksCountByTypeId = function(BookTypeId,searchName){
    let _sql = "select count(1) as count from Books b where "
    if(BookTypeId!=-1){
        _sql+=`b.BookTypeId=${BookTypeId} and `
    }
    _sql+=`b.Name like '%${searchName}%'`
    return query(_sql);
}
// 年排名
let selectYearRank = function(){
    let _sql ="select b.Id,b.Name from Books b where year(b.PublishTime) = year(curdate()) order by b.Rank limit 7"
    return query(_sql);
}
// 月排名
let selectMonthRank = function(){
    let _sql ="select b.Id,b.Name from Books b where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(b.PublishTime) order by b.Rank limit 7"
    return query(_sql);
}
// 周排名
let selectWeekRank = function(){
    let _sql ="select b.Id,b.Name from Books b where DATE_SUB(curdate(), INTERVAL 7 DAY) <= date(b.PublishTime) order by b.Rank limit 7"
    return query(_sql);
}
// 寻找热门商品和会员商品
let getGoodList= function(IsHot,IsMember,pageNo,pageSize){
    let _sql ="select b.Id as BookId,b.Name as BookName,b.BookPhoto,b.Price,b.Quantity,b.Describe,DATE_FORMAT(b.PublishTime,'%Y年%m月%d日') as PublishTime,b.PublishCompany from Books b where 1=1 "
    if(IsHot){
        _sql+="and b.IsHot="+IsHot;
    }else if(IsMember){
        _sql+=" and b.IsMember="+IsMember;
    }
    _sql+=` limit ${pageNo},${pageSize}`
    return query(_sql);
}
// 寻找热门商品和会员商品长度
let getGoodListLength= function(IsHot,IsMember){
    let _sql ="select count(1) as count from Books b where 1=1 "
    if(IsHot){
        _sql+="and b.IsHot="+IsHot;
    }else if(IsMember){
        _sql+=" and b.IsMember="+IsMember;
    }
    return query(_sql);
}
// 轮播图
let findAllCarousel = function(){
    let _sql = "select c.Title,c.Describe,c.Picture from Carousel c"
    return query(_sql);
}
let findCarouselById = function(id){
    let _sql = `select c.Title,c.Describe,c.Picture from Carousel c where c.Id=${id}`
    return query(_sql);
}
// 插入轮播图
let insertCarouselInfo =function(value){
    let _sql ="insert into Carousel(Title,Picture,Carousel.Describe) values(?,?,?);"
    return query(_sql,value);
}
// 更新轮播图
let updateCarouselInfo =function(value){
    let _sql =`update Carousel c set c.Title=?,c.Picture=?,c.Describe=? where c.Id=?`
    return query(_sql,value);
}
// 删除轮播图
let deleteCarouselInfo =function(id){
    let _sql =`delete from Carousel where Id=${id}`
    return query(_sql);
}
// 后台轮播图
let selectCarouselInfo =function(globalName,pageNo,pageSize){
    let _sql =`select c.Id,c.Title,c.Describe,c.Picture,DATE_FORMAT(c.UpdateTime,'%Y年%m月%d日 %T') as UpdateTime from Carousel c where c.Title like '%${globalName}%' or c.Describe like '%${globalName}%' limit ${pageNo},${pageSize}`
    return query(_sql);
}
// 后台轮播图总长度
let selectCarouselInfoLength =function(globalName){
    let _sql =`select count(1) as count from Carousel c where c.Title like '%${globalName}%' or c.Describe like '%${globalName}%'`
    return query(_sql);
}
// 找出对应的图书id的评论
let selectCommentByBookId =function(BoodId){
    let _sql =`select u.Username,c.Content,u.Avatar,DATE_FORMAT(c.UpdateTime,'%Y年%m月%d日 %T') as UpdateTime from Books_Comments c left join Users u on u.Id=c.UserId where c.BookId=${BoodId}`
    return query(_sql);
}
// 插入评论
let insertComment =function(value){
    let _sql ="insert into Books_Comments(UserId,BookId,Content) values(?,?,?);"
    return query(_sql,value);
}
// 后台的商品评论
let selectCommentInfo =function(globalName,pageNo,pageSize){
    let _sql =`select c.Id,u.Username,b.Name as BookName,b.BookPhoto,c.Content,DATE_FORMAT(c.UpdateTime,'%Y年%m月%d日 %T') as UpdateTime from Books_Comments c left join Users u on c.UserId=u.Id left join Books b on c.BookId=b.Id  where b.Name like '%${globalName}%' or c.Content like '%${globalName}%' or u.Username like '%${globalName}%' limit ${pageNo},${pageSize}`
    return query(_sql);
}
// 后台的商品评论总长度
let selectCommentInfoLength =function(globalName){
    let _sql =`select count(1) as count from Books_Comments c left join Users u on c.UserId=u.Id left join Books b on c.BookId=b.Id  where b.Name like '%${globalName}%' or c.Content like '%${globalName}%' or u.Username like '%${globalName}%'`
    return query(_sql);
}
// 删除评论
let deleteCommentInfo =function(id){
    let _sql =`delete from Books_Comments where Id=${id}`
    return query(_sql);
}
// 查找商品最大的数量
let findMaxQuantity =function(cartId){
    let _sql=`select b.Quantity as maxQuantity from Shopcarts s left JOIN Books b on s.BookId=b.Id where s.Id=${cartId}`
    return query(_sql);
}
// 是否已经加入购物车
let isAddShopcart =function(value){
    let _sql ="select Id from Shopcarts s where s.BookId=? and s.UserId=?;"
    return query(_sql,value);
}
// 查找收藏
let selectCollection =function(value){
    let _sql ="select c.Id,c.CollectionFlag from Books_Collection c where c.UserId=? and c.BookId=?;"
    return query(_sql,value);
}
// 加入收藏
let insertCollection =function(value){
    let _sql ="insert into Books_Collection(UserId,BookId,CollectionFlag) values(?,?,?);"
    return query(_sql,value);
}
// 更新收藏
let updateCollection =function(value){
    let _sql ="update Books_Collection c set c.CollectionFlag=? where c.Id=?"
    return query(_sql,value);
}
// 收藏到购物车
let insertShopcarts =function(value){
    let _sql ="insert into Shopcarts(BookId,UserId,Quantity,TotalPrice) values(?,?,?,?);"
    return query(_sql,value);
}
// 编辑购物车
let updateShopcarts =function(value){
    let _sql ="update Shopcarts s set s.BookId=?,s.UserId=?,s.Quantity=?,s.TotalPrice=? where s.Id=?"
    return query(_sql,value);
}
// 编辑购物车数量
let updateShopcartsQuantity =function(value){
    let _sql ="update Shopcarts s set s.Quantity=?,s.TotalPrice=? where s.Id=?"
    return query(_sql,value);
}
// 删除购物车
let deleteShopcarts =function(id){
    let _sql =`delete from Shopcarts where Id=${id}`
    return query(_sql);
}
let deleteShopcartsByUserId =function(UserId){
    let _sql =`delete from Shopcarts where UserId=${UserId}`
    return query(_sql);
}
// 查询所有购物车
let selectShopcarts =function(userId){
    let _sql =`select s.Id as cartId,b.Id as BookId,b.Name,b.BookPhoto,b.Price,b.Describe,s.Quantity,s.TotalPrice from Shopcarts s left join Books b on s.BookId=b.Id where s.UserId=${userId}`
    return query(_sql);
}
let selectAllShopcarts =function(globalName,pageNo,pageSize){
    let _sql =`select s.Id,u.Username,b.Name as BookName,b.BookPhoto,s.Quantity from Shopcarts s 
    left join Users u on s.UserId=u.Id left join Books b on s.BookId=b.Id  
    where u.Username like '%${globalName}%' or b.Price like '%${globalName}%' or b.Name like '%${globalName}%'
    limit ${pageNo},${pageSize}`
    return query(_sql);
}
let selectAllShopcartsLength =function(globalName){
    let _sql =`select count(1) as count from Shopcarts s left join Users u on s.UserId=u.Id left join Books b on s.BookId=b.Id  
    where u.Username like '%${globalName}%' or b.Price like '%${globalName}%' or b.Name like '%${globalName}%'`
    return query(_sql);
}
let getShopcartsTotalPrice=function(userId){
    let _sql=`select sum(b.Price *s .Quantity) as TotalPrice from Shopcarts s left join Books b on s.BookId=b.Id where s.UserId=${userId}`
    return query(_sql);
}
// 新增支付
let insertAliPay =function(value){
    let _sql =`insert into Books_Alipay(UserId,BookId,UserAddressId,Seller_Id,Out_Trade_No,Trade_No,Quantity,Total_Amount) values ${value}`
    return query(_sql);
}
//暴露所有函数接口
module.exports = {
    query,
    // createTable,
    // 用户
    insertUser,
    selectUser,
    findUserByName,
    findUserById,
    updateUser,
    selectUserInfo,
    selectUserInfoLength,
    insertUserInfo,
    updateUserInfo,
    updateUserAdmin,
    updateUserInfoNoAvatar,
    updateUserImg,
    deleteUserInfo,
    // 收藏商品
    selectCollectionGoods,
    // 地址
    selectAllUserAddress,
    selectAllUserAddressLength,
    selectUserAddress,
    deleteUserAddress,
    updateUserAddress,
    insertUserAddress,
    selectUserDefaultAddress,
    updateUserDefaultAddress,
    // 查询图书信息  类型
    selectBookType,
    updateBookCollectionNum,
    updateBookSaleNum,
    selectBookById,
    insertBookInfo,
    updateBookInfo,
    updateBookInfoNoPhoto,
    deleteBookInfo,
    insertBookType,
    selectBooksByTypeId,
    // 轮播图
    findAllCarousel,
    selectCarouselInfo,
    selectCarouselInfoLength,
    findCarouselById,
    insertCarouselInfo,
    updateCarouselInfo,
    deleteCarouselInfo,
    // 年月日排行
    selectYearRank,
    selectMonthRank,
    selectWeekRank,
    // 寻找热门和会员图书
    getGoodList,
    getGoodListLength,
    // 评论
    insertComment,
    selectCommentByBookId,
    selectCommentInfo,
    selectCommentInfoLength,
    deleteCommentInfo,
    // 收藏
    selectCollection,
    insertCollection,
    updateCollection,
    // 购物车
    isAddShopcart,
    findMaxQuantity,
    updateShopcartsQuantity,
    updateShopcarts,
    insertShopcarts,
    selectShopcarts,
    deleteShopcarts,
    deleteShopcartsByUserId,
    getShopcartsTotalPrice,
    selectAllShopcarts,
    selectAllShopcartsLength,
    // 搜索
    selectBooksPageByTypeId,
    selectBooksCountByTypeId,
    // admin
    selectBookList,
    selectBookListLength,
    // 支付
    insertAliPay,
    // 历史订单
    selectOrderHistoryByUserId,
    selectAllOrderHistory,
    selectAllOrderHistoryLength
}
