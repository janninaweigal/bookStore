/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : 127.0.0.1:3306
 Source Schema         : nodesql

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 14/02/2019 23:23:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _mysql_session_store
-- ----------------------------
DROP TABLE IF EXISTS `_mysql_session_store`;
CREATE TABLE `_mysql_session_store`  (
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `expires` bigint(20) DEFAULT NULL,
  `data` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of _mysql_session_store
-- ----------------------------
INSERT INTO `_mysql_session_store` VALUES ('USER_SID:4FMGSqsn6kzMsqLwiem2NIbG2hqVW_g-', 1549724805086, '{\"id\":21,\"username\":\"w123456\",\"avatar\":\"/images/default.jpg\",\"email\":\"123@qq.com\",\"IsAdmin\":1,\"shopcart\":[{\"BookId\":\"22\",\"Quantity\":\"1\"}]}');
INSERT INTO `_mysql_session_store` VALUES ('USER_SID:kdhM7AtxeyE-aJwjZZoLgE4HUKjhanLE', 1549724520216, '{\"id\":21,\"username\":\"w123456\",\"avatar\":\"/images/default.jpg\",\"email\":\"123@qq.com\",\"IsAdmin\":1}');
INSERT INTO `_mysql_session_store` VALUES ('USER_SID:o0p2AxhUx4rUZeps1E6PSHoh4LwkrE9h', 1550147311709, '{\"id\":21,\"username\":\"w123456\",\"avatar\":\"/images/default.jpg\",\"email\":\"123@qq.com\",\"IsAdmin\":1,\"collectionId\":3,\"shopcart\":[{\"BookId\":\"2\",\"Quantity\":\"1\"}]}');

-- ----------------------------
-- Table structure for books
-- ----------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `BookTypeId` int(11) DEFAULT NULL COMMENT '图书类型',
  `Author` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '作者',
  `Name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '商品的名称',
  `BookPhoto` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '商品的图片',
  `Price` decimal(10, 0) NOT NULL COMMENT '单价',
  `Quantity` int(11) NOT NULL COMMENT '数量',
  `Describe` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '暂无描述' COMMENT '商品描述',
  `Rank` int(11) DEFAULT NULL COMMENT '排行',
  `Isbn` int(11) DEFAULT NULL COMMENT '国际标准书号',
  `PublishTime` datetime(0) DEFAULT CURRENT_TIMESTAMP COMMENT '出版时间',
  `PublishCompany` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '人民出版社' COMMENT '出版社',
  `SaleNum` int(11) DEFAULT 0 COMMENT '销售数量',
  `CollectionNum` int(11) DEFAULT 0 COMMENT '用户收藏数量',
  `IsToCart` int(1) UNSIGNED ZEROFILL DEFAULT 0 COMMENT '是否加入购物车',
  `IsMember` int(1) DEFAULT 0 COMMENT '是否会员书',
  `IsHot` int(1) DEFAULT 0 COMMENT '是否热门书',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 111 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of books
-- ----------------------------
INSERT INTO `books` VALUES (2, 1, 'bingo96', '蔡康永的情商课：为你自己活一次（印章版）', 'http://img3m1.ddimg.cn/94/5/25578031-1_l_5.jpg', 31, 94, '暂无描述', 117, 1435653450, '2019-08-01 05:53:51', '人民出版社', 100, 83, 0, 1, 0);
INSERT INTO `books` VALUES (3, 2, 'bingo60', '大侦探福尔摩斯1-35册（合辑）', 'http://img3m7.ddimg.cn/4/8/25294207-1_l_6.jpg', 588, 86, '暂无描述', 25, 1318836604, '2019-08-16 22:54:46', '人民出版社', 86, 90, 0, 1, 0);
INSERT INTO `books` VALUES (5, 2, 'bingo120', '故宫里的大怪兽（9册套装）', 'http://img3m8.ddimg.cn/17/23/25250858-1_l_3.jpg', 180, 109, '暂无描述', 111, 1479603729, '2019-02-27 10:14:53', '人民出版社', 28, 1, 0, 1, 0);
INSERT INTO `books` VALUES (6, 3, 'bingo84', '小熊很忙系列（套装全16册）', 'http://img3m1.ddimg.cn/89/28/25304291-1_l_15.jpg', 496, 88, '暂无描述', 36, 1536350567, '2019-10-09 03:35:37', '人民出版社', 83, 35, 0, 1, 0);
INSERT INTO `books` VALUES (7, 1, 'bingo59', '过剩之地：美式富足与贫困悖论', 'http://img3m6.ddimg.cn/76/11/25859866-1_l_2.jpg', 62, 65, '暂无描述', 84, 1242941681, '2019-05-01 22:40:33', '人民出版社', 28, 73, 0, 1, 0);
INSERT INTO `books` VALUES (8, 2, 'bingo41', '你好！数学套装珍藏版（套装30本）', 'http://img3m4.ddimg.cn/69/33/22732944-1_l_1.jpg', 202, 83, '暂无描述', 74, 1605656736, '2019-09-26 10:22:34', '人民出版社', 94, 57, 0, 0, 1);
INSERT INTO `books` VALUES (9, 3, 'bingo31', '蒲公英·英语拼读王（全12册+9CD＋6DVD光盘）', 'http://img3m4.ddimg.cn/11/30/25280354-1_l_8.jpg', 254, 98, '暂无描述', 115, 1299458667, '2018-09-01 19:03:46', '人民出版社', 80, 64, 0, 0, 1);
INSERT INTO `books` VALUES (10, 4, 'bingo29', '我喜欢生命本来的样子(周国平经典散文作品集)', 'http://img3m0.ddimg.cn/28/30/24198400-1_l_4.jpg', 44, 51, '暂无描述', 114, 1680323157, '2019-09-09 07:38:17', '人民出版社', 17, 47, 0, 0, 1);
INSERT INTO `books` VALUES (11, 1, 'bingo50', '高效能养育（百万粉丝公号“暖暖妈爱分享”创始人赵君潇全新家教作品）', 'http://img3m6.ddimg.cn/86/4/25572776-1_l_5.jpg', 33, 52, '暂无描述', 104, 1503239816, '2018-06-16 08:54:36', '人民出版社', 46, 42, 0, 0, 1);
INSERT INTO `books` VALUES (12, 2, 'bingo46', '天气', 'http://img3m8.ddimg.cn/33/4/25178208-1_l_8.jpg', 76, 59, '暂无描述', 57, 1475229637, '2019-04-23 01:38:09', '人民出版社', 76, 71, 0, 0, 1);
INSERT INTO `books` VALUES (13, 3, 'bingo78', '猫头鹰王国套装（共15册）', 'http://img3m4.ddimg.cn/91/5/22923244-1_l_7.jpg', 275, 89, '暂无描述', 94, 1866428770, '2019-10-20 02:10:38', '人民出版社', 43, 26, 0, 0, 1);
INSERT INTO `books` VALUES (14, 4, 'bingo13', '天长地久：给美君的信（龙应台2018全新力作）', 'http://img3m9.ddimg.cn/35/0/25311959-1_l_5.jpg', 58, 74, '暂无描述', 59, 1906454970, '2019-09-18 23:58:59', '人民出版社', 85, 15, 0, 0, 1);
INSERT INTO `books` VALUES (15, 5, 'bingo70', '漫长的告别（怪不得村上春树读了12遍！每每陷入困境，村上春树便打开《漫长的告别》！全新精装插图珍藏版！）（读客经典文库）', 'http://img3m9.ddimg.cn/41/14/25336319-1_l_6.jpg', 58, 57, '暂无描述', 12, 1932988567, '2019-01-08 06:22:05', '人民出版社', 95, 99, 0, 0, 1);
INSERT INTO `books` VALUES (16, 1, 'bingo70', '挚野2', 'http://img3m5.ddimg.cn/63/23/26193285-1_l_7.jpg', 39, 84, '暂无描述', 1, 1945577955, '2019-04-04 20:47:27', '人民出版社', 19, 46, 0, 0, 1);
INSERT INTO `books` VALUES (17, 2, 'bingo20', '舒克贝塔传（全10册）', 'http://img3m2.ddimg.cn/9/26/25125912-1_l_1.jpg', 159, 58, '暂无描述', 89, 1928924106, '2019-11-25 21:45:08', '人民出版社', 9, 34, 0, 0, 1);
INSERT INTO `books` VALUES (18, 3, 'bingo8', '中国传统节日故事 图画书', 'http://img3m8.ddimg.cn/5/34/25246688-1_l_12.jpg', 129, 60, '暂无描述', 80, 1807886697, '2019-05-12 22:31:44', '人民出版社', 89, 30, 0, 1, 0);
INSERT INTO `books` VALUES (19, 4, 'bingo101', '苏东坡传（林语堂精装2018版）（1-9年级必读书单）', 'http://img3m8.ddimg.cn/40/0/25211578-1_l_3.jpg', 26, 75, '暂无描述', 12, 1252661194, '2019-01-09 19:40:57', '人民出版社', 13, 46, 0, 1, 0);
INSERT INTO `books` VALUES (20, 5, 'bingo119', '偷影子的人（2018新版）', 'http://img3m7.ddimg.cn/70/27/25247347-1_l_3.jpg', 35, 73, '暂无描述', 61, 1839645912, '2019-10-28 15:14:12', '人民出版社', 2, 42, 0, 1, 0);
INSERT INTO `books` VALUES (21, 6, 'bingo54', '我这么自律，就是为了不平庸至死', 'http://img3m4.ddimg.cn/48/33/25259304-1_l_2.jpg', 31, 92, '暂无描述', 29, 1440246008, '2019-04-02 06:05:41', '人民出版社', 71, 69, 0, 1, 0);
INSERT INTO `books` VALUES (22, 1, 'bingo31', '经典译林：麦田里的守望者（精装）', 'http://img3m6.ddimg.cn/23/36/23644886-1_l_2.jpg', 14, 119, '暂无描述', 79, 1682292335, '2018-02-22 08:16:21', '人民出版社', 43, 17, 0, 1, 0);
INSERT INTO `books` VALUES (23, 2, 'bingo111', '0-3岁亲子游戏纸板书（全5册）', 'http://img3m4.ddimg.cn/36/34/25325424-1_l_10.jpg', 176, 57, '暂无描述', 69, 1090723679, '2019-01-01 23:51:23', '人民出版社', 3, 78, 0, 1, 0);
INSERT INTO `books` VALUES (24, 3, 'bingo103', '注音版 我和小姐姐克拉拉（共8册）我和小姐姐/小姐姐和我/爸爸妈妈和我们/托尼叔叔/小狗嗅嗅/小猫卡斯梅/鹦鹉皮卜/小马巴迪', 'http://img3m4.ddimg.cn/10/12/25311934-1_l_1.jpg', 113, 94, '暂无描述', 109, 1406741425, '2019-05-17 20:29:52', '人民出版社', 86, 37, 0, 1, 0);
INSERT INTO `books` VALUES (25, 4, 'bingo63', '且以优雅过一生：杨绛传（杨绛传记的标杆之作）', 'http://img3m7.ddimg.cn/85/25/24026197-1_l_16.jpg', 29, 104, '暂无描述', 98, 1761536117, '2019-11-26 21:37:28', '人民出版社', 16, 50, 0, 0, 0);
INSERT INTO `books` VALUES (26, 5, 'bingo3', '摆渡人（如果命运是一条孤独的河流，谁会是你灵魂的摆渡人？）', 'http://img3m7.ddimg.cn/86/32/23694647-1_l_8.jpg', 25, 119, '暂无描述', 42, 1587456339, '2019-06-27 09:53:24', '人民出版社', 24, 40, 0, 0, 0);
INSERT INTO `books` VALUES (27, 6, 'bingo65', '常与同好争高下，不与傻瓜论短长（老杨的猫头鹰2018年最新作品，醒脑之书系列之四）', 'http://img3m8.ddimg.cn/53/21/25349498-1_l_10.jpg', 27, 92, '暂无描述', 35, 1652673375, '2019-04-10 18:48:43', '人民出版社', 72, 47, 0, 0, 0);
INSERT INTO `books` VALUES (28, 7, 'bingo76', '乌合之众 : 大众心理研究', 'http://img3m9.ddimg.cn/25/29/25246609-1_l_1.jpg', 20, 52, '暂无描述', 47, 1500997887, '2019-03-26 22:52:37', '人民出版社', 85, 13, 0, 0, 0);
INSERT INTO `books` VALUES (29, 1, 'bingo65', '汉字魔方', 'http://img3m6.ddimg.cn/47/18/25317416-1_l_3.jpg', 149, 77, '暂无描述', 10, 1546969344, '2019-06-17 10:22:34', '人民出版社', 7, 26, 0, 0, 0);
INSERT INTO `books` VALUES (30, 2, 'bingo98', '植物大战僵尸2成语漫画：妙语连珠 出口成章（全24册）', 'http://img3m9.ddimg.cn/70/30/25237249-1_l_6.jpg', 565, 108, '暂无描述', 29, 1231853090, '2019-09-25 05:27:36', '人民出版社', 83, 91, 0, 0, 0);
INSERT INTO `books` VALUES (31, 3, 'bingo54', '吴姐姐讲历史故事(精美盒装，青少版，全15册）', 'http://img3m0.ddimg.cn/47/20/22937060-1_l_1.jpg', 352, 116, '暂无描述', 113, 1518357450, '2019-08-11 01:03:04', '人民出版社', 90, 72, 0, 0, 0);
INSERT INTO `books` VALUES (32, 4, 'bingo95', '树犹如此（白先勇亲定选本，精装珍藏版）', 'http://img3m4.ddimg.cn/34/30/25808344-1_l_4.jpg', 48, 67, '暂无描述', 119, 1896228008, '2019-03-26 22:52:37', '人民出版社', 100, 87, 0, 0, 0);
INSERT INTO `books` VALUES (33, 5, 'bingo74', '大江大河四部曲（史诗级电视剧《大江大河》原著小说，王凯、杨烁、董子健主演。一部描写改革开放的奇书，豆瓣9.2高分。）', 'http://img3m0.ddimg.cn/38/10/25288400-1_l_3.jpg', 272, 80, '暂无描述', 17, 1926067721, '2019-06-11 11:15:49', '人民出版社', 26, 16, 0, 0, 0);
INSERT INTO `books` VALUES (34, 6, 'bingo85', '成功的聪明人太多了，我必须为笨蛋争口气！', 'http://img3m0.ddimg.cn/26/12/25578260-1_l_2.jpg', 41, 77, '暂无描述', 85, 1941654613, '2019-05-11 20:58:23', '人民出版社', 32, 22, 0, 0, 0);
INSERT INTO `books` VALUES (35, 7, 'bingo83', '成为母亲', 'http://img3m5.ddimg.cn/75/10/25859865-1_l_3.jpg', 44, 98, '暂无描述', 15, 1930069929, '2019-01-25 10:24:47', '人民出版社', 80, 61, 0, 0, 0);
INSERT INTO `books` VALUES (36, 8, 'bingo38', '态度  吴军新书', 'http://img3m9.ddimg.cn/94/30/25479229-1_l_3.jpg', 43, 66, '暂无描述', 59, 1825385839, '2019-09-06 22:59:09', '人民出版社', 101, 38, 0, 0, 0);
INSERT INTO `books` VALUES (37, 1, 'bingo59', '千万不要玩穿越系列（48册）', 'http://img3m5.ddimg.cn/36/30/25335225-1_l_6.jpg', 663, 57, '暂无描述', 10, 1336719437, '2019-10-13 20:54:03', '人民出版社', 64, 7, 0, 0, 0);
INSERT INTO `books` VALUES (38, 2, 'bingo64', '成语故事（全20册）（绘本版）', 'http://img3m8.ddimg.cn/32/22/25315718-1_l_9.jpg', 202, 107, '暂无描述', 114, 1207439699, '2019-06-07 18:06:13', '人民出版社', 15, 20, 0, 0, 0);
INSERT INTO `books` VALUES (39, 3, 'bingo19', '汉声中国童话（全12册）（精美礼盒装，享誉世界的经典童话  代代相传的文化瑰宝）', 'http://img3m7.ddimg.cn/20/14/25210667-1_l_3.jpg', 788, 104, '暂无描述', 57, 1027040217, '2019-09-02 01:55:37', '人民出版社', 86, 79, 0, 0, 0);
INSERT INTO `books` VALUES (40, 4, 'bingo23', '成龙：还没长大就老了（修订版）第89届奥斯卡终身成就奖成龙传记', 'http://img3m1.ddimg.cn/9/17/24185511-1_l_8.jpg', 42, 78, '暂无描述', 64, 1512882018, '2019-04-22 22:16:31', '人民出版社', 83, 31, 0, 0, 0);
INSERT INTO `books` VALUES (41, 5, 'bingo58', '金庸作品集(朗声旧版)金庸全集（全集共36册）（预售商品，不确定到货时间，介意者慎拍）', 'http://img3m9.ddimg.cn/80/17/23278049-1_l_7.jpg', 677, 98, '暂无描述', 30, 1483289469, '2019-10-14 23:31:37', '人民出版社', 53, 20, 0, 0, 0);
INSERT INTO `books` VALUES (42, 6, 'bingo99', '不抱怨，把握人生的分寸感（徐峥、杨幂、黄晓明、姚晨、佟丽娅、迪丽热巴等明星鼎力推荐！）', 'http://img3m6.ddimg.cn/72/13/25583256-1_l_3.jpg', 29, 65, '暂无描述', 75, 1877801325, '2019-06-19 20:09:15', '人民出版社', 17, 7, 0, 0, 0);
INSERT INTO `books` VALUES (43, 7, 'bingo83', '上古汉语语法纲要（上古汉语研究丛书）', 'http://img3m4.ddimg.cn/37/14/25582924-1_l_3.jpg', 68, 53, '暂无描述', 45, 1939138243, '2019-10-03 05:44:06', '人民出版社', 26, 73, 0, 0, 0);
INSERT INTO `books` VALUES (44, 8, 'bingo115', '智能商业  曾鸣新书   马云作序推荐', 'http://img3m7.ddimg.cn/41/35/25478087-1_l_3.jpg', 48, 92, '暂无描述', 118, 1062287273, '2019-03-21 03:14:52', '人民出版社', 78, 41, 0, 0, 0);
INSERT INTO `books` VALUES (45, 9, 'bingo88', '小小兴趣班里的大智慧 : 耶鲁奶爸教育访谈实录', 'http://img3m1.ddimg.cn/93/6/25574961-1_l_10.jpg', 32, 108, '暂无描述', 96, 1494021667, '2019-09-24 04:16:51', '人民出版社', 9, 88, 0, 0, 0);
INSERT INTO `books` VALUES (46, 1, 'bingo91', '成长吧，少年！（共十六册）', 'http://img3m1.ddimg.cn/9/15/25349751-1_l_2.jpg', 254, 74, '暂无描述', 4, 1283246545, '2019-01-01 01:24:53', '人民出版社', 11, 11, 0, 0, 0);
INSERT INTO `books` VALUES (47, 2, 'bingo74', '纸片人斯坦利大冒险', 'http://img3m2.ddimg.cn/65/34/25478012-1_l_6.jpg', 113, 67, '暂无描述', 91, 1934167758, '2019-04-24 08:01:09', '人民出版社', 30, 95, 0, 0, 0);
INSERT INTO `books` VALUES (48, 3, 'bingo96', '林汉达中国历史故事集（珍藏版）', 'http://img3m9.ddimg.cn/79/36/25177759-1_l_2.jpg', 51, 62, '暂无描述', 82, 1821099183, '2019-09-01 23:51:20', '人民出版社', 14, 38, 0, 0, 0);
INSERT INTO `books` VALUES (49, 4, 'bingo18', '周迅 : 自在人间', 'http://img3m4.ddimg.cn/32/0/25858634-1_l_2.jpg', 63, 62, '暂无描述', 15, 1302992670, '2019-02-14 04:19:08', '人民出版社', 80, 6, 0, 0, 0);
INSERT INTO `books` VALUES (50, 5, 'bingo41', '罗生门', 'http://img3m4.ddimg.cn/14/2/25190564-1_l_2.jpg', 26, 75, '暂无描述', 72, 1051665834, '2019-09-03 07:15:21', '人民出版社', 54, 17, 0, 0, 0);
INSERT INTO `books` VALUES (51, 6, 'bingo32', '愿你迷路到我身旁', 'http://img3m0.ddimg.cn/83/33/25073120-1_l_6.jpg', 33, 67, '暂无描述', 73, 1349351191, '2019-01-27 19:09:19', '人民出版社', 30, 66, 0, 0, 0);
INSERT INTO `books` VALUES (52, 7, 'bingo36', '郦波评说曾国藩家训精华（郦波老师钤印珍藏版）', 'http://img3m9.ddimg.cn/87/12/25578519-1_l_2.jpg', 78, 63, '暂无描述', 30, 1591758485, '2019-02-21 08:18:35', '人民出版社', 87, 75, 0, 0, 0);
INSERT INTO `books` VALUES (53, 8, 'bingo83', '爆款写作课：打造爆文的3个黄金法则（引爆新媒体写作圈的写作秘诀）', 'http://img3m8.ddimg.cn/67/27/25581568-1_l_6.jpg', 38, 61, '暂无描述', 49, 1910738880, '2019-01-13 03:07:19', '人民出版社', 44, 76, 0, 0, 0);
INSERT INTO `books` VALUES (54, 9, 'bingo65', '如何说孩子才会听 怎么听孩子才肯说（全新修订版）', 'http://img3m2.ddimg.cn/17/7/24044642-1_l_16.jpg', 26, 67, '暂无描述', 34, 1778418976, '2019-03-08 14:05:39', '人民出版社', 57, 54, 0, 0, 0);
INSERT INTO `books` VALUES (55, 10, 'bingo75', '初级会计职称考试教材2019教材 2019年初级会计专业技术资格考试经济法基础 官方全套', 'http://img3m6.ddimg.cn/49/26/25546306-1_l_4.jpg', 36, 104, '暂无描述', 24, 1159878270, '2019-01-08 20:54:02', '人民出版社', 51, 40, 0, 0, 0);
INSERT INTO `books` VALUES (56, 2, 'bingo62', '面包超人图画书系列（套装12册）', 'http://img3m4.ddimg.cn/43/10/25352854-1_l_11.jpg', 153, 57, '暂无描述', 17, 1464134453, '2019-06-02 23:40:26', '人民出版社', 85, 38, 0, 0, 0);
INSERT INTO `books` VALUES (57, 3, 'bingo85', '一玩再玩·宝宝好习惯玩具书（套装共4册）', 'http://img3m8.ddimg.cn/11/1/25084928-1_l_4.jpg', 113, 66, '暂无描述', 11, 1841037488, '2019-02-14 21:09:58', '人民出版社', 67, 68, 0, 0, 0);
INSERT INTO `books` VALUES (58, 4, 'bingo119', '毛泽东传（最新插图全译本，迪克·威尔逊代表作）', 'http://img3m4.ddimg.cn/95/35/21128774-1_l_4.jpg', 36, 110, '暂无描述', 4, 1812784108, '2019-01-01 12:23:22', '人民出版社', 83, 27, 0, 0, 0);
INSERT INTO `books` VALUES (59, 5, 'bingo97', '外婆的道歉信（马思纯领读书目，人民日报、央视推荐。年度口碑爆棚的温情小说，上市6个月销量突破50万。随书附赠一封神秘道歉信）', 'http://img3m1.ddimg.cn/77/0/25072421-1_l_11.jpg', 24, 90, '暂无描述', 108, 1540808109, '2019-09-13 03:11:34', '人民出版社', 9, 29, 0, 0, 0);
INSERT INTO `books` VALUES (60, 6, 'bingo7', '学习力：颠覆职场学习的高效方法', 'http://img3m2.ddimg.cn/87/14/25480212-1_l_2.jpg', 51, 68, '暂无描述', 46, 1265688252, '2019-04-22 22:22:04', '人民出版社', 97, 66, 0, 0, 0);
INSERT INTO `books` VALUES (61, 7, 'bingo105', '历史的温度（套装3册）', 'http://img3m3.ddimg.cn/58/16/25859353-1_l_3.jpg', 107, 94, '暂无描述', 27, 1706016963, '2019-03-25 16:48:57', '人民出版社', 57, 39, 0, 0, 0);
INSERT INTO `books` VALUES (62, 8, 'bingo22', '深度思考：不断逼近问题的本质', 'http://img3m2.ddimg.cn/44/17/25336322-1_l_6684.jpg', 40, 74, '暂无描述', 117, 1733020090, '2019-05-04 09:28:15', '人民出版社', 94, 96, 0, 0, 0);
INSERT INTO `books` VALUES (63, 9, 'bingo37', '养育女孩', 'http://img3m0.ddimg.cn/36/23/23457690-1_l_1.jpg', 29, 109, '暂无描述', 21, 1547049593, '2019-10-12 12:18:58', '人民出版社', 96, 63, 0, 0, 0);
INSERT INTO `books` VALUES (64, 10, 'bingo118', '四大名著全套  锁线精装 青少年版 中小学生版 原著正版白话文儿童少儿版三国演义西游记红楼梦水浒传中小学生五六年级非注音版文学书', 'http://img3m1.ddimg.cn/64/11/25097851-1_l_9.jpg', 70, 61, '暂无描述', 116, 1536187724, '2019-12-01 05:55:58', '人民出版社', 96, 23, 0, 0, 0);
INSERT INTO `books` VALUES (65, 11, 'bingo119', '天谴者 法医秦明系列全新力作', 'http://img3m3.ddimg.cn/39/14/1901100603-1_l_1.jpg', 22, 71, '暂无描述', 38, 1039789871, '2019-02-17 16:32:42', '人民出版社', 90, 29, 0, 0, 0);
INSERT INTO `books` VALUES (66, 3, 'bingo1', 'DK万物透视图解百科（2018年新版）', 'http://img3m9.ddimg.cn/60/33/25288719-1_l_6.jpg', 143, 120, '暂无描述', 78, 1590386216, '2019-12-15 18:21:22', '人民出版社', 63, 74, 0, 0, 0);
INSERT INTO `books` VALUES (67, 4, 'bingo5', '活着为了讲述（《百年孤独》作者马尔克斯唯一自传 ）', 'http://img3m9.ddimg.cn/21/11/23938419-1_l_11.jpg', 50, 54, '暂无描述', 38, 1832561498, '2019-11-02 19:51:49', '人民出版社', 42, 82, 0, 0, 0);
INSERT INTO `books` VALUES (68, 5, 'bingo21', '格雷巴旅馆（作者被判终身监禁，此刻故事正在发生……引发全球关注的监狱文学超现实主义力作，媲美《肖申克的救赎》《冰血暴》的奇绝构思。）', 'http://img3m4.ddimg.cn/96/34/25344294-1_l_5.jpg', 35, 75, '暂无描述', 76, 1391648869, '2019-07-12 07:13:15', '人民出版社', 20, 87, 0, 0, 0);
INSERT INTO `books` VALUES (69, 6, 'bingo92', '你不完美的样子也很好 破耳兔', 'http://img3m2.ddimg.cn/1/8/25584472-1_l_2.jpg', 26, 92, '暂无描述', 22, 1460559885, '2019-07-27 05:05:48', '人民出版社', 77, 86, 0, 0, 0);
INSERT INTO `books` VALUES (70, 7, 'bingo37', '叫魂：1768年中国妖术大恐慌（最新版本）', 'http://img3m1.ddimg.cn/63/15/25582851-1_l_1.jpg', 28, 116, '暂无描述', 5, 1127852849, '2018-10-18 17:44:30', '人民出版社', 20, 70, 0, 0, 0);
INSERT INTO `books` VALUES (71, 8, 'bingo26', '认识经济', 'http://img3m6.ddimg.cn/49/28/25480966-1_l_2.jpg', 171, 113, '暂无描述', 78, 1257584623, '2019-04-01 04:47:26', '人民出版社', 73, 90, 0, 0, 0);
INSERT INTO `books` VALUES (72, 9, 'bingo20', '好妈妈胜过好老师（700万册纪念版）', 'http://img3m9.ddimg.cn/37/23/25124059-1_l_7.jpg', 45, 96, '暂无描述', 15, 1904364598, '2019-11-25 19:25:42', '人民出版社', 100, 36, 0, 0, 0);
INSERT INTO `books` VALUES (73, 10, 'bingo22', '东奥初级会计2019 轻松过关1 2019年应试指导及全真模拟测试初级会计实务 东奥会计初级职称教材2019', 'http://img3m9.ddimg.cn/49/32/25537099-1_l_9.jpg', 38, 92, '暂无描述', 81, 1749069151, '2019-03-03 18:27:02', '人民出版社', 79, 10, 0, 0, 0);
INSERT INTO `books` VALUES (74, 11, 'bingo47', '大江大河四部曲', 'http://img3m6.ddimg.cn/7/8/1901075326-1_l_4.jpg', 29, 50, '暂无描述', 120, 1032251988, '2019-10-21 10:56:22', '人民出版社', 94, 41, 0, 0, 0);
INSERT INTO `books` VALUES (75, 4, 'bingo50', '书法没有秘密', 'http://img3m4.ddimg.cn/74/36/25197554-1_l_3.jpg', 79, 66, '暂无描述', 114, 1914052523, '2019-01-01 02:19:20', '人民出版社', 31, 77, 0, 0, 0);
INSERT INTO `books` VALUES (76, 5, 'bingo107', '狼图腾(修订版)（一部描绘、研究蒙古草原狼的“旷世奇书”）（1-9年级必读书单）', 'http://img3m2.ddimg.cn/48/24/23597292-1_l_1.jpg', 34, 62, '暂无描述', 92, 1473506678, '2019-01-15 11:46:27', '人民出版社', 76, 59, 0, 0, 0);
INSERT INTO `books` VALUES (77, 6, 'bingo27', '活好 我这样活到105岁', 'http://img3m7.ddimg.cn/52/16/25480177-1_l_8.jpg', 32, 61, '暂无描述', 118, 1625375855, '2018-01-05 12:03:45', '人民出版社', 83, 65, 0, 0, 0);
INSERT INTO `books` VALUES (78, 7, 'bingo51', '剧变 英国工业革命', 'http://img3m2.ddimg.cn/88/28/25579312-1_l_3.jpg', 54, 68, '暂无描述', 74, 1706359268, '2019-08-22 02:04:05', '人民出版社', 86, 45, 0, 0, 0);
INSERT INTO `books` VALUES (79, 8, 'bingo56', 'AI·未来（李开复博士深度解析人工智能未来十年大趋势）', 'http://img3m6.ddimg.cn/0/20/25324596-1_l_1.jpg', 40, 110, '暂无描述', 13, 1655668807, '2018-03-18 16:32:37', '人民出版社', 78, 28, 0, 0, 0);
INSERT INTO `books` VALUES (80, 9, 'bingo5', '教养在生活的细节里：洪兰 蔡颖卿 爱与智慧的对谈', 'http://img3m8.ddimg.cn/6/23/25063638-1_l_2.jpg', 32, 83, '暂无描述', 82, 1159266261, '2019-06-17 13:51:40', '人民出版社', 34, 6, 0, 0, 0);
INSERT INTO `books` VALUES (81, 10, 'bingo96', '小学生必背古诗词75+80首 近11万多读者好评', 'http://img3m8.ddimg.cn/74/0/23435948-1_l_10.jpg', 26, 105, '暂无描述', 13, 1829324918, '2019-10-23 19:31:12', '人民出版社', 33, 47, 0, 0, 0);
INSERT INTO `books` VALUES (82, 11, 'bingo103', '中国最美古诗词：你应该熟读的中国古诗+你应该熟读的中国古词+你应该熟读的中国古文(套装共3册)', 'http://img3m2.ddimg.cn/86/9/1901092532-1_l_1.jpg', 50, 86, '暂无描述', 56, 1668825835, '2019-06-18 18:58:33', '人民出版社', 63, 12, 0, 0, 0);
INSERT INTO `books` VALUES (83, 5, 'bingo109', '暗算（第七届茅盾文学奖得主 人民文学出版社）', 'http://img3m7.ddimg.cn/94/6/23354887-1_l_6.jpg', 19, 66, '暂无描述', 2, 1856154451, '2019-01-01 21:58:15', '人民出版社', 13, 21, 0, 0, 0);
INSERT INTO `books` VALUES (84, 6, 'bingo114', '沟通的艺术：看入人里，看出人外 （插图修订第14版·简明版）', 'http://img3m0.ddimg.cn/76/0/25259530-1_l_3.jpg', 40, 93, '暂无描述', 83, 1274294782, '2019-04-20 14:48:21', '人民出版社', 76, 68, 0, 0, 0);
INSERT INTO `books` VALUES (85, 7, 'bingo1', '帝国突围-----摇晃中的光绪二十四年', 'http://img3m4.ddimg.cn/17/32/26246204-1_l_3.jpg', 50, 74, '暂无描述', 45, 1803010587, '2019-04-11 23:52:25', '人民出版社', 40, 76, 0, 0, 0);
INSERT INTO `books` VALUES (86, 8, 'bingo26', '蓝海战略2：蓝海转型（全球现象级的商业思想与行动指南，告诉你如何在沸腾的红海中开辟蓝海，今天每一个做企业的人都该读一读。）', 'http://img3m7.ddimg.cn/89/9/25346267-1_l_3.jpg', 76, 112, '暂无描述', 98, 1192168617, '2019-06-27 11:25:42', '人民出版社', 73, 72, 0, 0, 0);
INSERT INTO `books` VALUES (87, 9, 'bingo4', '小家，越住越大(2016年度大众喜爱的50种图书，2018年第四届当当影响力作家榜新锐作家)', 'http://img3m1.ddimg.cn/80/26/23951051-1_l_12.jpg', 33, 75, '暂无描述', 114, 1551811360, '2019-04-10 19:55:16', '人民出版社', 43, 31, 0, 0, 0);
INSERT INTO `books` VALUES (88, 10, 'bingo63', '新概念英语1 英语初阶  新概念1', 'http://img3m5.ddimg.cn/43/32/20264155-1_l_2.jpg', 22, 61, '暂无描述', 36, 1182550979, '2019-07-23 11:57:22', '人民出版社', 97, 41, 0, 0, 0);
INSERT INTO `books` VALUES (89, 11, 'bingo62', '深度社交：如何“深耕”人际关系的交际艺术(管理自己的人脉，拒绝社交恐惧症，和任何人都聊得来)', 'http://img3m8.ddimg.cn/15/16/1901104638-1_l_1.jpg', 12, 102, '暂无描述', 76, 1257320845, '2019-12-17 03:51:55', '人民出版社', 51, 10, 0, 0, 0);
INSERT INTO `books` VALUES (90, 6, 'bingo1', '妖怪小旅馆（当当限量签名版）', 'http://img3m4.ddimg.cn/80/35/25858484-1_l_1.jpg', 31, 65, '暂无描述', 34, 1738951318, '2019-01-10 16:21:42', '人民出版社', 66, 28, 0, 0, 0);
INSERT INTO `books` VALUES (91, 7, 'bingo57', '潜规则：中国历史中的真实游戏（修订版）', 'http://img3m9.ddimg.cn/29/32/25579649-1_l_1.jpg', 33, 113, '暂无描述', 60, 1922794085, '2019-06-05 10:37:52', '人民出版社', 76, 10, 0, 0, 0);
INSERT INTO `books` VALUES (92, 8, 'bingo42', '大局观：真实世界中的经济学思维', 'http://img3m6.ddimg.cn/26/22/25808336-1_l_2.jpg', 39, 104, '暂无描述', 80, 1397116502, '2019-07-26 22:06:36', '人民出版社', 81, 64, 0, 0, 0);
INSERT INTO `books` VALUES (93, 9, 'bingo39', '幼小衔接 欢迎来到一年级：幼小衔接家长手册（2017年度大众喜爱的50种图书奖）', 'http://img3m2.ddimg.cn/36/15/25089012-1_l_6.jpg', 39, 62, '暂无描述', 96, 1217200287, '2019-09-21 11:15:47', '人民出版社', 76, 90, 0, 0, 0);
INSERT INTO `books` VALUES (94, 10, 'bingo69', '笠翁对韵 中华经典儿童启蒙  注音+注释+典故 每日诵读十分钟 打好国学基本功', 'http://img3m7.ddimg.cn/46/22/23630257-1_l_14.jpg', 16, 92, '暂无描述', 3, 1894651959, '2019-03-16 05:16:48', '人民出版社', 34, 53, 0, 0, 0);
INSERT INTO `books` VALUES (95, 11, 'bingo109', '景恒街 笛安长篇转型力作', 'http://img3m4.ddimg.cn/34/8/1901103964-1_l_3.jpg', 12, 81, '暂无描述', 84, 1821658963, '2019-03-16 06:25:25', '人民出版社', 41, 94, 0, 0, 0);
INSERT INTO `books` VALUES (96, 7, 'bingo96', '掌故（第四集·精装）', 'http://img3m7.ddimg.cn/49/1/25546207-1_l_1.jpg', 38, 82, '暂无描述', 51, 1424338971, '2019-11-01 13:40:43', '人民出版社', 3, 11, 0, 0, 0);
INSERT INTO `books` VALUES (97, 8, 'bingo34', '后谷歌时代:大数据的没落及区块链经济的崛起(精装本)', 'http://img3m4.ddimg.cn/18/23/25338474-1_l_2.jpg', 54, 115, '暂无描述', 1, 1656717995, '2019-01-01 09:23:46', '人民出版社', 92, 73, 0, 0, 0);
INSERT INTO `books` VALUES (98, 9, 'bingo1', '《崔玉涛图解家庭育儿（最新升级版）》（套装全10册）[精选套装]', 'http://img3m9.ddimg.cn/19/22/24187699-1_l_6.jpg', 188, 68, '暂无描述', 91, 1010573092, '2019-09-04 14:30:45', '人民出版社', 48, 28, 0, 0, 0);
INSERT INTO `books` VALUES (99, 10, 'bingo21', '未来教育2019年3月全国计算机等级考试二级MS Office上机考试题库+模拟考场计算机2级高级应用真考题库（套装共2册）', 'http://img3m3.ddimg.cn/43/5/25344043-1_l_2.jpg', 70, 87, '暂无描述', 92, 1082711510, '2019-04-07 08:49:11', '人民出版社', 62, 24, 0, 0, 0);
INSERT INTO `books` VALUES (100, 11, 'bingo101', '性格中的蜜与毒：哈佛心理导师的性格自修课', 'http://img3m3.ddimg.cn/88/11/1901103523-1_l_1.jpg', 15, 112, '暂无描述', 67, 1381838304, '2019-06-18 18:03:53', '人民出版社', 68, 32, 0, 0, 0);
INSERT INTO `books` VALUES (101, 8, 'bingo83', '说服 (影响力作者新作)', 'http://img3m1.ddimg.cn/18/21/25583301-1_l_3.jpg', 36, 107, '暂无描述', 60, 1661057021, '2019-05-01 04:35:30', '人民出版社', 50, 91, 0, 1, 0);
INSERT INTO `books` VALUES (102, 9, 'bingo112', '你就是孩子最好的玩具', 'http://img3m0.ddimg.cn/58/29/22463950-1_l_2.jpg', 24, 79, '暂无描述', 97, 1159770223, '2019-09-06 17:01:54', '人民出版社', 44, 55, 0, 1, 0);
INSERT INTO `books` VALUES (103, 10, 'bingo72', '牛津高阶英汉双解词典（第9版）', 'http://img3m8.ddimg.cn/72/29/25294968-1_l_2.jpg', 143, 94, '暂无描述', 66, 1815680085, '2019-06-21 06:58:10', '人民出版社', 72, 101, 0, 1, 0);
INSERT INTO `books` VALUES (104, 11, 'bingo20', '如何想到又做到：带来持久改变的7种武器', 'http://img3m1.ddimg.cn/75/35/1901092521-1_l_3.jpg', 29, 113, '暂无描述', 38, 1599089783, '2019-11-24 13:18:49', '人民出版社', 25, 36, 0, 1, 0);
INSERT INTO `books` VALUES (105, 9, 'bingo6', '怀孕一天一页（第二版）（汉竹）', 'http://img3m3.ddimg.cn/3/4/25168773-1_l_1.jpg', 40, 92, '暂无描述', 110, 1548408693, '2019-03-14 20:47:23', '人民出版社', 10, 81, 0, 1, 0);
INSERT INTO `books` VALUES (106, 10, 'bingo88', '唐诗三百首 小学生 成长必读 绘本 注音版', 'http://img3m4.ddimg.cn/35/14/23993774-1_l_6.jpg', 26, 71, '暂无描述', 77, 1944774148, '2019-07-19 14:54:50', '人民出版社', 74, 93, 0, 1, 0);
INSERT INTO `books` VALUES (107, 11, 'bingo63', '重新理解创业 ：一个创业者的途中思考', 'http://img3m9.ddimg.cn/72/9/1901100339-1_l_1.jpg', 26, 102, '暂无描述', 54, 1078644686, '2018-12-24 17:07:22', '人民出版社', 37, 20, 0, 1, 0);
INSERT INTO `books` VALUES (108, 10, 'bingo49', '手把手教孩子·看图写话（一年级）超20000多名读者热评！', 'http://img3m5.ddimg.cn/8/24/23612795-1_l_1.jpg', 27, 104, '暂无描述', 37, 1558901022, '2018-12-14 21:01:23', '人民出版社', 64, 22, 0, 1, 0);
INSERT INTO `books` VALUES (109, 11, 'bingo54', '文明的故事(套装全11卷)', 'http://img3m9.ddimg.cn/27/25/1901103759-1_l_1.jpg', 119, 96, '暂无描述', 22, 1558571080, '2019-10-01 15:05:30', '人民出版社', 6, 50, 0, 1, 0);
INSERT INTO `books` VALUES (110, 11, 'bingo6', '为何你总是会受伤', 'http://img3m2.ddimg.cn/58/6/1901103592-1_l_3.jpg', 12, 117, '暂无描述', 1, 1116152366, '2019-03-21 22:30:38', '人民出版社', 41, 84, 0, 1, 0);

-- ----------------------------
-- Table structure for books_alipay
-- ----------------------------
DROP TABLE IF EXISTS `books_alipay`;
CREATE TABLE `books_alipay`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL COMMENT '用户Id',
  `BookId` int(11) NOT NULL COMMENT '图书Id',
  `UserAddressId` int(11) NOT NULL COMMENT '用户地址Id',
  `Seller_Id` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '支付宝唯一用户号',
  `Out_Trade_No` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '商品订单号',
  `Trade_No` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '交易流水号',
  `ShopcartsArray` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '[]' COMMENT '购物车的所有索引（1，2，3，4）',
  `Quantity` int(1) NOT NULL COMMENT '买了多少（数量）',
  `Total_Amount` decimal(9, 2) NOT NULL COMMENT '支付的总额',
  `CreateTime` datetime(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of books_alipay
-- ----------------------------
INSERT INTO `books_alipay` VALUES (19, 19, 22, 12, '2088102177090584', '1549633157322', '2019020822001440200500680695', '[]', 1, 47.00, '2019-02-08 21:43:30');
INSERT INTO `books_alipay` VALUES (20, 19, 11, 12, '2088102177090584', '1549633157322', '2019020822001440200500680695', '[]', 1, 47.00, '2019-02-08 21:43:30');
INSERT INTO `books_alipay` VALUES (21, 21, 2, 13, '2088102177090584', '1550060911704', '2019021322001440200500682262', '[]', 1, 31.00, '2019-02-13 20:31:56');
INSERT INTO `books_alipay` VALUES (22, 21, 2, 13, '2088102177090584', '1550060911704', '2019021322001440200500682262', '[]', 1, 31.00, '2019-02-13 20:32:45');
INSERT INTO `books_alipay` VALUES (23, 21, 2, 13, '2088102177090584', '1550060911704', '2019021322001440200500682262', '[]', 1, 31.00, '2019-02-13 20:33:51');

-- ----------------------------
-- Table structure for books_collection
-- ----------------------------
DROP TABLE IF EXISTS `books_collection`;
CREATE TABLE `books_collection`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `UserId` int(11) DEFAULT NULL COMMENT '用户Id',
  `BookId` int(11) DEFAULT NULL COMMENT '图书Id',
  `CollectionFlag` int(11) DEFAULT 0 COMMENT '是否收藏',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of books_collection
-- ----------------------------
INSERT INTO `books_collection` VALUES (3, 21, 2, 0);

-- ----------------------------
-- Table structure for books_comments
-- ----------------------------
DROP TABLE IF EXISTS `books_comments`;
CREATE TABLE `books_comments`  (
  `Id` int(200) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL COMMENT '用户id',
  `BookId` int(11) DEFAULT NULL COMMENT '评论的图书id',
  `Content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论的内容',
  `CreateTime` datetime(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateTime` datetime(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of books_comments
-- ----------------------------
INSERT INTO `books_comments` VALUES (16, 19, 8, '非常好', '2019-02-08 17:05:24', '2019-02-08 17:05:24');
INSERT INTO `books_comments` VALUES (17, 19, 8, '4444', '2019-02-08 17:05:57', '2019-02-08 17:05:57');
INSERT INTO `books_comments` VALUES (18, 19, 8, '789', '2019-02-08 17:06:51', '2019-02-08 17:06:51');
INSERT INTO `books_comments` VALUES (19, 19, 8, '5555', '2019-02-08 17:08:03', '2019-02-08 17:08:03');
INSERT INTO `books_comments` VALUES (20, 19, 8, '666', '2019-02-08 17:08:51', '2019-02-08 17:08:51');

-- ----------------------------
-- Table structure for books_type
-- ----------------------------
DROP TABLE IF EXISTS `books_type`;
CREATE TABLE `books_type`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of books_type
-- ----------------------------
INSERT INTO `books_type` VALUES (1, '主打');
INSERT INTO `books_type` VALUES (2, '童书1');
INSERT INTO `books_type` VALUES (3, '童书2');
INSERT INTO `books_type` VALUES (4, '文艺');
INSERT INTO `books_type` VALUES (5, '小说');
INSERT INTO `books_type` VALUES (6, '青春励志');
INSERT INTO `books_type` VALUES (7, '社科');
INSERT INTO `books_type` VALUES (8, '经管');
INSERT INTO `books_type` VALUES (9, '生活');
INSERT INTO `books_type` VALUES (10, '教育');
INSERT INTO `books_type` VALUES (11, '电子书');

-- ----------------------------
-- Table structure for carousel
-- ----------------------------
DROP TABLE IF EXISTS `carousel`;
CREATE TABLE `carousel`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT '轮播图主键Id',
  `Title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '标题',
  `Describe` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '描述',
  `Picture` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '图片',
  `CreateTime` datetime(0) DEFAULT CURRENT_TIMESTAMP,
  `UpdateTime` datetime(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of carousel
-- ----------------------------
INSERT INTO `carousel` VALUES (1, '30万图书每满100减50', '30万图书每满100减50', 'http://img62.ddimg.cn/upload_img/00087/geq/750x315_lyx_1218-1545638663.jpg', '2019-01-24 21:40:00', '2019-01-24 21:40:00');
INSERT INTO `carousel` VALUES (2, '新书速递', '新书速递', 'http://img62.ddimg.cn/upload_img/00570/tongshu/750x315_lyx_1130-1543806314.jpg', '2019-01-24 21:40:00', '2019-01-24 21:40:00');
INSERT INTO `carousel` VALUES (3, '文艺 100-50', '文艺 100-50', 'http://img61.ddimg.cn/upload_img/00778/a/750x315_wenyi-1545642462.jpg', '2019-01-24 21:40:00', '2019-01-24 21:40:00');
INSERT INTO `carousel` VALUES (4, '你好，这是我们的名片', '你好，这是我们的名片', 'http://img53.ddimg.cn/9003960098707403.jpg', '2019-01-24 21:40:00', '2019-01-24 21:40:00');

-- ----------------------------
-- Table structure for shopcarts
-- ----------------------------
DROP TABLE IF EXISTS `shopcarts`;
CREATE TABLE `shopcarts`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) DEFAULT NULL COMMENT '用户Id',
  `BookId` int(11) DEFAULT NULL COMMENT '图书Id',
  `Quantity` int(11) DEFAULT NULL COMMENT '最后的图书数量',
  `TotalPrice` decimal(10, 2) DEFAULT NULL COMMENT '最后的图书总价',
  `CreateTime` datetime(0) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UpdateTime` datetime(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `Id` int(200) NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `Password` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '8b430f20f8641d94f71fdda086d02660' COMMENT '密码',
  `Avatar` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '/images/default.jpg' COMMENT '用户图像',
  `Email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '用户邮箱',
  `IsAdmin` int(1) DEFAULT 0 COMMENT '是否为管理员',
  `CreateTime` datetime(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `UpdateTime` datetime(0) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (20, 'admin', '7475f7d25c0d727c81002899b57e3702', '/images/default.jpg', '111@qqq.com', 1, '2019-02-08 22:26:14', NULL);
INSERT INTO `users` VALUES (21, 'w123456', '8b430f20f8641d94f71fdda086d02660', '/images/default.jpg', '123@qq.com', 1, '2019-02-08 22:54:26', NULL);

-- ----------------------------
-- Table structure for users_address
-- ----------------------------
DROP TABLE IF EXISTS `users_address`;
CREATE TABLE `users_address`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL COMMENT '用户表的Id',
  `Name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '姓名',
  `Phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '电话',
  `Address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '地址',
  `IsDefault` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '0' COMMENT '是否默认的收获地址',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users_address
-- ----------------------------
INSERT INTO `users_address` VALUES (13, 21, 'tjise.gaobaiwu.top', '555', '123', '1');

SET FOREIGN_KEY_CHECKS = 1;
