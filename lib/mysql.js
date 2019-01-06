

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
var Users = `create table if not exists Users(
    Id INT(11) NOT NULL AUTO_INCREMENT,
    UserName VARCHAR(100) NOT NULL COMMENT '用户名',
    Password VARCHAR(40) NOT NULL COMMENT '密码',
    Avator VARCHAR(100) DEFAULT 'default.jpg' COMMENT '用户头像',
    CreateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  COMMENT '创建时间',
    UpdateTime TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP  COMMENT '更新时间',
    PRIMARY KEY (Id)
);`
// 地址表
var Address = `CREATE TABLE if not exists Users_Address(
    Id INT(11) NOT NULL AUTO_INCREMENT,
    UserId INT(11) NOT NULL COMMENT '用户表的Id',
    Address VARCHAR(255) DEFAULT NULL COMMENT '地址',
    IsDefault VARCHAR(255) DEFAULT NULL COMMENT '是否默认的收获地址',
    PRIMARY KEY (Id)
);`
// 图书表
var Books = `CREATE TABLE if not exists Books(
    Id INT(11) NOT NULL AUTO_INCREMENT,
    UserId INT(11) NOT NULL COMMENT '用户表的Id',
    IsMember VARCHAR(255) DEFAULT NULL COMMENT '是否会员的书',
    PRIMARY KEY (Id)
);`

let createTable = function(sql){
    return query(sql, []);
}

//建表
createTable(Users);
createTable(Address);
createTable(Books);

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
    let _sql = `select Id,Username,Avatar from Users where Username='${username}'`
    return query(_sql);
}
// 更新用户信息
let updateUser = function(value){
    let _sql = "update Users set UserName=? where Id=?"
    return query(_sql,value);
}
// 查询所有图书类型的id
let selectBookType = function(){
    let _sql = "select Id,Name from Books_Type"
    return query(_sql);
}
// 通过Id查图书信息
let selectBookById = function(Id){
    let _sql = `select b.Id,bt.Name,b.Name as BookName,b.Isbn,b.Author,b.BookPhoto,b.Price,b.Quantity,b.Describe,DATE_FORMAT(b.PublishTime,'%Y年%m月%d日') as PublishTime,b.PublishCompany,b.IsToCart,b.IsMember,b.IsHot from Books b left join Books_Type bt on bt.Id=b.BookTypeId where b.Id=${Id}`
    return query(_sql);
}
// 通过TypeId查所有图书信息
let selectBooksByTypeId = function(BookTypeId){
    let _sql = `select b.Id,bt.Name,b.Name as BookName,b.BookPhoto,b.Price,b.Quantity,b.Describe,DATE_FORMAT(b.PublishTime,'%Y年%m月%d日') as PublishTime,b.PublishCompany,b.IsToCart from Books b left join Books_Type bt on bt.Id=b.BookTypeId where b.BookTypeId=${BookTypeId}`
    return query(_sql);
}
// 搜索分页
let selectBooksPageByTypeId = function(BookTypeId,pageNo,pageSize,searchName){
    let _sql = "select bt.Name,bt.Id as TypeId,b.Id as BookId,b.Name as BookName,b.BookPhoto,b.Price,b.Quantity,b.Describe,DATE_FORMAT(b.PublishTime,'%Y年%m月%d日') as PublishTime,b.PublishCompany,b.IsToCart from Books b left join Books_Type bt on bt.Id=b.BookTypeId where "
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
    let _sql ="select b.Id,b.Name as BookName,b.BookPhoto,b.Price,b.Quantity,b.Describe,DATE_FORMAT(b.PublishTime,'%Y年%m月%d日') as PublishTime,b.PublishCompany from Books b where 1=1 "
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
// 是否已经加入购物车
let isAddShopcart =function(value){
    let _sql ="select Id from Shopcarts s where s.BookId=? and s.UserId=?;"
    return query(_sql,value);
}
// 收藏到购物车
let insertShopcarts =function(value){
    let _sql ="insert into Shopcarts(BookId,UserId,Quantity,TotalPrice) values(?,?,?,?);"
    return query(_sql,value);
}
let updateShopcarts =function(value){
    let _sql ="update Shopcarts set BookId=?,UserId=?,Quantity=?,TotalPrice=? where Id=?"
    return query(_sql,value);
}
// 查询所有购物车
let selectShopcarts =function(userId){
    let _sql =`select b.Name,b.BookPhoto,b.Price,b.Describe,s.Quantity,s.TotalPrice from Shopcarts s left join Books b on s.BookId=b.Id where s.UserId=${userId}`
    return query(_sql);
}
let getShopcartsTotalPrice=function(userId){
    let _sql=`select sum(b.Price *s .Quantity) as TotalPrice from Shopcarts s left join Books b on s.BookId=b.Id where s.UserId=${userId}`
    return query(_sql);
}
//暴露所有函数接口
module.exports = {
    query,
    createTable,
    // 用户
    insertUser,
    selectUser,
    findUserByName,
    updateUser,
    // 查询图书信息
    selectBookType,
    selectBookById,
    selectBooksByTypeId,
    // 轮播图
    findAllCarousel,
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
    // 购物车
    isAddShopcart,
    updateShopcarts,
    insertShopcarts,
    selectShopcarts,
    getShopcartsTotalPrice,
    // 搜索
    selectBooksPageByTypeId,
    selectBooksCountByTypeId
}
