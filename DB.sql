-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: rapphim
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dichvu`
--

DROP TABLE IF EXISTS `dichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dichvu` (
  `iddichvu` int(11) NOT NULL AUTO_INCREMENT,
  `tendichvu` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `gia` int(11) DEFAULT NULL,
  `tinhtrang` int(11) DEFAULT NULL,
  PRIMARY KEY (`iddichvu`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dichvu`
--

LOCK TABLES `dichvu` WRITE;
/*!40000 ALTER TABLE `dichvu` DISABLE KEYS */;
INSERT INTO `dichvu` VALUES (1,'Bắp lớn',60000,1),(2,'Bắp nhỏ',30000,1),(3,'Nước(PEPSI/COCA/7UP)',20000,1),(4,'Combo 1: 1 bắp lớn + 1 Nước',65000,1),(5,'Combo 2: 1 bắp nhỏ+ 1 nước',45000,1),(6,'Trà sữa',30000,1),(7,'Snack',20000,0),(8,'Bánh trán trộn',15000,0),(9,'Kẹo ngọt',10000,0),(10,'Bắp siêu to',100000,0),(11,'TEST DỊCH VỤ',111,1),(12,'TKPM',15000,1),(13,'bánh trung thu',50000,1),(14,'Combo snack+ pepsi',30000,1);
/*!40000 ALTER TABLE `dichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khuvuc`
--

DROP TABLE IF EXISTS `khuvuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khuvuc` (
  `idkhuvuc` int(11) NOT NULL AUTO_INCREMENT,
  `tenkhuvuc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`idkhuvuc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khuvuc`
--

LOCK TABLES `khuvuc` WRITE;
/*!40000 ALTER TABLE `khuvuc` DISABLE KEYS */;
INSERT INTO `khuvuc` VALUES (1,'TP.Hồ Chí Minh'),(2,'Hà Nội'),(3,'Cần Thơ'),(4,'Đà Nẵng');
/*!40000 ALTER TABLE `khuvuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichchieuphim`
--

DROP TABLE IF EXISTS `lichchieuphim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichchieuphim` (
  `idlichchieuphim` int(11) NOT NULL AUTO_INCREMENT,
  `idphim` int(11) DEFAULT NULL,
  `idphongchieu` int(11) DEFAULT NULL,
  `ngaychieu` varchar(45) DEFAULT NULL,
  `giochieu` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idlichchieuphim`),
  KEY `FK_LichChieuPhim_PhongChieu_idx` (`idphongchieu`),
  KEY `FK_LichChieuPhim_Phim` (`idphim`),
  CONSTRAINT `FK_LichChieuPhim_Phim` FOREIGN KEY (`idphim`) REFERENCES `phim` (`idphim`),
  CONSTRAINT `FK_LichChieuPhim_PhongChieu` FOREIGN KEY (`idphongchieu`) REFERENCES `phongchieu` (`idphongchieu`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichchieuphim`
--

LOCK TABLES `lichchieuphim` WRITE;
/*!40000 ALTER TABLE `lichchieuphim` DISABLE KEYS */;
INSERT INTO `lichchieuphim` VALUES (2,1,2,'2020-08-21','20:10'),(3,1,2,'2020-08-20','19:10'),(4,1,2,'2020-08-20','17:10'),(7,3,2,'2020-08-20','15:09'),(11,13,4,'2020-08-26','01:30'),(12,15,4,'2020-08-30','02:40'),(13,14,2,'2020-09-02','07:41'),(23,12,1,'2020-08-27','20:30');
/*!40000 ALTER TABLE `lichchieuphim` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichsu_dichvu`
--

DROP TABLE IF EXISTS `lichsu_dichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichsu_dichvu` (
  `idlichsu` int(11) NOT NULL,
  `iddichvu` int(11) NOT NULL,
  `soluong` int(11) DEFAULT NULL,
  PRIMARY KEY (`idlichsu`,`iddichvu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichsu_dichvu`
--

LOCK TABLES `lichsu_dichvu` WRITE;
/*!40000 ALTER TABLE `lichsu_dichvu` DISABLE KEYS */;
INSERT INTO `lichsu_dichvu` VALUES (2,1,1),(3,1,1),(4,1,1),(7,1,1),(8,7,1),(13,1,1),(15,3,1),(17,1,1),(18,1,1),(18,3,1),(19,1,1),(20,2,1),(21,1,1),(22,1,1),(23,1,1),(24,1,1);
/*!40000 ALTER TABLE `lichsu_dichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichsu_ve`
--

DROP TABLE IF EXISTS `lichsu_ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichsu_ve` (
  `idlichsu` int(11) NOT NULL,
  `idve` int(11) NOT NULL,
  `soluong` int(11) DEFAULT NULL,
  PRIMARY KEY (`idlichsu`,`idve`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichsu_ve`
--

LOCK TABLES `lichsu_ve` WRITE;
/*!40000 ALTER TABLE `lichsu_ve` DISABLE KEYS */;
INSERT INTO `lichsu_ve` VALUES (2,1,1),(2,2,1),(3,1,1),(4,1,1),(5,1,1),(6,2,1),(7,2,1),(8,1,1),(9,1,1),(10,1,1),(11,1,1),(12,1,1),(13,1,1),(14,1,1),(15,1,1),(16,1,1),(17,1,1),(18,1,1),(19,1,1),(20,1,1),(21,1,1),(22,1,1),(22,2,1),(23,1,1),(24,1,1),(24,2,1);
/*!40000 ALTER TABLE `lichsu_ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichsudatve`
--

DROP TABLE IF EXISTS `lichsudatve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichsudatve` (
  `idlichsudatve` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idkhachhang` int(11) DEFAULT NULL,
  `tongtien` int(11) DEFAULT NULL,
  `ngaydatve` varchar(45) DEFAULT NULL,
  `tinhtrang` int(11) DEFAULT '0',
  `idlichchieuphim` int(11) DEFAULT NULL,
  `vitrighe` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idlichsudatve`),
  KEY `idlichsudatve` (`idlichsudatve`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichsudatve`
--

LOCK TABLES `lichsudatve` WRITE;
/*!40000 ALTER TABLE `lichsudatve` DISABLE KEYS */;
INSERT INTO `lichsudatve` VALUES (2,6,180000,'2020-07-06',1,1,'A6,B7'),(3,9,130000,'2020-07-06',0,1,'A7'),(4,6,130000,'2020-07-12',1,2,'A6'),(5,6,70000,'2020-07-31',1,3,'A6'),(6,6,50000,'2020-07-31',1,3,'A7'),(7,6,100000,'2020-07-31',1,7,'A7'),(8,2,80111,'2020-08-16',1,2,'B4'),(9,6,70000,'2020-08-17',0,3,'J7'),(10,6,70000,'2020-08-17',0,2,'A7'),(11,6,70000,'2020-08-17',0,2,'B6'),(12,6,70000,'2020-08-17',0,4,'A7'),(13,2,130000,'2020-08-19',1,2,'E6'),(14,2,80000,'2020-08-19',1,4,'B6'),(15,6,100000,'2020-08-21',1,12,'A1'),(16,6,80000,'2020-08-21',0,11,'A6'),(17,6,130000,'2020-08-21',0,11,'A7'),(18,2,150000,'2020-08-23',0,11,'A8'),(19,6,130000,'2020-08-23',0,11,'A1'),(20,13,110000,'2020-08-23',0,11,'A2'),(21,6,130000,'2020-08-23',0,11,'E5'),(22,6,170000,'2020-08-24',0,11,'A4,A5'),(23,13,120000,'2020-08-24',0,11,'A9'),(24,6,170000,'2020-08-24',0,12,'A6,A7');
/*!40000 ALTER TABLE `lichsudatve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loaitaikhoan`
--

DROP TABLE IF EXISTS `loaitaikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loaitaikhoan` (
  `idloaitaikhoan` int(11) NOT NULL AUTO_INCREMENT,
  `tenloaitaikhoan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idloaitaikhoan`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loaitaikhoan`
--

LOCK TABLES `loaitaikhoan` WRITE;
/*!40000 ALTER TABLE `loaitaikhoan` DISABLE KEYS */;
INSERT INTO `loaitaikhoan` VALUES (1,'User'),(2,'Nhân viên'),(3,'Quản lý');
/*!40000 ALTER TABLE `loaitaikhoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phanhoi`
--

DROP TABLE IF EXISTS `phanhoi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phanhoi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `noidungphanhoi` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `noidunghoidap` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `manguoigoi` int(11) DEFAULT NULL,
  `manguoiphanhoi` int(11) DEFAULT NULL,
  `thoigianphanhoi` text,
  `thoigianhoidap` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phanhoi`
--

LOCK TABLES `phanhoi` WRITE;
/*!40000 ALTER TABLE `phanhoi` DISABLE KEYS */;
INSERT INTO `phanhoi` VALUES (1,'asd',' ok!!                  \r\n                ',6,5,'19/8/2020 - 14:50:51','19/8/2020 - 14:50:51'),(3,'Test phản hồi                    ','TKPM!!!                   \r\n                ',6,5,'19/8/2020 - 14:50:51','23/8/2020 - 20:37:2'),(4,'Phản hồi chất lượng rạp!!!                    ','rạp sẽ cải thiện!!!                   \r\n                ',6,5,'19/8/2020 - 14:50:51',NULL),(5,'nâng cao dịch vụ','ok!!                   \r\n                ',6,5,'19/8/2020 - 14:50:51','24/8/2020 - 20:16:46'),(6,'ánh sáng',NULL,6,NULL,'19/8/2020 - 14:50:51',NULL),(9,'quảng cáo nhiều',' ok!!                  \r\n                ',6,5,'19/8/2020 - 2:34:25','19/8/2020 - 2:40:3'),(10,'rạp dơ','     HI!!\r\n              \r\n                ',2,5,'19/8/2020 - 14:20:27','19/8/2020 - 14:58:49'),(11,'good','thanks',2,5,'19/8/2020 - 14:21:24','19/8/2020 - 14:59:15'),(12,'Cải thiện ánh sáng','rạp sẽ cải thiện                   \r\n                ',6,5,'23/8/2020 - 20:3:11','24/8/2020 - 19:33:5'),(13,'HELLO ADMIN','HI!!                   \r\n                ',19,5,'23/8/2020 - 20:15:45','23/8/2020 - 21:16:49'),(14,'TEST PHẢN HỒI',NULL,6,NULL,'23/8/2020 - 21:8:38',NULL),(15,'TEST phản hồi!!',NULL,6,NULL,'24/8/2020 - 19:26:11',NULL),(16,'Good evening!',NULL,6,NULL,'24/8/2020 - 20:10:50',NULL);
/*!40000 ALTER TABLE `phanhoi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phim`
--

DROP TABLE IF EXISTS `phim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phim` (
  `idphim` int(11) NOT NULL AUTO_INCREMENT,
  `tenphim` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ngayphathanh` varchar(45) DEFAULT NULL,
  `daodien` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `dienvien` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `tomtat` text,
  `thoiluong` int(11) DEFAULT NULL,
  `diemdanhgia` float DEFAULT NULL,
  `hinhanh` text,
  `tinhtrang` int(11) DEFAULT NULL,
  `khoichieu` varchar(45) DEFAULT NULL,
  `linktrailer` text,
  PRIMARY KEY (`idphim`),
  UNIQUE KEY `idphim_UNIQUE` (`idphim`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phim`
--

LOCK TABLES `phim` WRITE;
/*!40000 ALTER TABLE `phim` DISABLE KEYS */;
INSERT INTO `phim` VALUES (1,'HARRY POTTER VÀ HÒN ĐÁ PHÙ THỦY P1','2001-04-16','Chris Columbus','Richard Harris,Maggie Smith','Harry Potter và Hòn Đá Phù Thủy là bộ phim đầu tiên trong series phim “Harry Potter” được xây dựng dựa trên tiểu thuyết của nhà văn J.K.Rowling. Nhân vật chính của phim, Harry Potter - một cậu bé 11 tuổi sau khi mồ côi cha mẹ đã bị gửi đến nhà dì dượng của mình, gia đình Dursley. Tuy nhiên, cậu bé bị ngược đãi và không hề biết về thân phận thực sự của mình.\r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        ',150,7.6,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1597774765/projectmovies/2020-08-18T18:19:20.124Z.jpg',0,'2020-01-02','https://www.youtube.com/embed/22TqbWaGYE'),(2,'HARRY POTTER VÀ TÊN TÙ NHÂN NGỤC AZKABAN','2001-05-31','Alfonson Cuaron','Daniel Radcliffe,Richard Harris,Maggie Smith','Harry Potter may mắn sống sót đến tuổi 13, sau nhiều cuộc tấn công của Chúa tể hắc ám. Nhưng hy vọng có một học kỳ yên ổn với Quidditch của cậu đã tiêu tan thành mây khói khi một kẻ điên cuồng giết người hàng loạt vừa thoát khỏi nhà tù Azkaban, với sự lùng sục của những cai tù là giám ngục.\r\n                        \r\n                        \r\n                        \r\n                        ',100,7.9,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1597774799/projectmovies/2020-08-18T18:19:54.191Z.jpg',0,'2020-07-08','https://www.youtube.com/embed/lAxgztbYDbs'),(3,'SỞ THÚ THOÁT Ế','2019-02-14','Son Jae-Gon','Park Young-Gyu','Một luật sự tập sự tên Tae-soo (Ahn Jae-hong) được công ty giao nhiệm vụ tiếp quản việc kinh doanh của vườn thú khi gần như tất cả các con thú đã bị bán đi. Một ý tưởng táo bạo đã được đưa ra để cứu vườn thú “thoát ế”: Các nhân viên phải mặc các bộ đồ thú và diễn như những con thú “thứ thiệt”. Mọi chuyện bất ngờ vượt khỏi tầm kiểm soát khi sở thú đột nhiên trở thành hiện tượng trên mạng xã hội. Các nhân viên phải làm gì nếu mọi chuyện vỡ lở?\r\n                        ',117,7,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1597774823/projectmovies/2020-08-18T18:20:18.453Z.jpg',0,'2020-02-14','https://www.youtube.com/embed/gklE-E0uB84'),(4,'CUỘC PHIÊU LƯU CỦA SCOOBY-DOO','2019-04-15','Tony Ceevone','Wll Forte','Scooby-Doo và the Mystery Inc. hợp sức giải cứu thế giới khỏi tên ác nhân Dick Dastardly.\r\n                        ',100,8,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1597774837/projectmovies/2020-08-18T18:20:32.306Z.jpg',1,'2020-08-15','https://www.youtube.com/embed/B8O7FS0R3bY'),(5,'BẦU TRỜI XANH TRONG MẮT EM','2019-10-11','Tatsuyyuki Nagai','Riho Yoshioka,Ryo Yoshizawa','13 năm trước, cha mẹ của Akane và Aoi không may qua đời vì tai nạn giao thông. Sự ra đi đột ngột của hai người khiến Akane phải gác lại ước mơ lên Tokyo lập nghiệp cùng bạn trai Shinno để chăm lo cho em gái Aoi. 13 năm sau, Aoi bỗng nhiên gặp được Shinno của 13 năm trước, một chàng trai đầy nhiệt huyết tuổi trẻ, tồn tại song song cùng với Shinno của hiện tại - một nhạc sĩ giỏi nhưng nay đã mất lửa và vô cùng lạnh lùng.\r\n                        ',112,7,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1597774851/projectmovies/2020-08-18T18:20:46.556Z.jpg',0,'2020-04-02','https://www.youtube.com/embed/stkFDN9z964'),(6,'PHI CÔNG SIÊU ĐẲNG MAVERICK','2020-06-16','Joseph Kosinski','Tom Cruise,ValKilmer','Bộ phim xoay quanh những cuộc chiến đấu gay cấn trên bầu trời cao của chàng phi công tài ba Maverick. Tuy nhiên, người hùng nay còn phải đối mặt với những chiếc máy bay không người lái được điều khiển từ xa\r\n                        ',100,8,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1597774865/projectmovies/2020-08-18T18:21:00.600Z.jpg',1,'2020-06-26','https://www.youtube.com/embed/44CEx3MevyI'),(7,'SÓI 100%','2020-06-26','Alexs Staderman','Rupert Degas,Sarah Harper','Phim là câu chuyện kể về Freddy Lupin - người thừa kế một gia đình sói quý tộc. Vào sinh nhật lần thứ 13 của mình, Freddy phải thực hiện nghi lễ trưởng thành và biến hình thành sói trước sự chứng kiến của các thành viên trong gia tộc. Thế nhưng, cậu lại biến thành một chú chó lông xù (Poodle). Trong lúc tuyệt vọng và nghĩ rằng cuộc đời đã chấm hết, Freddy bắt đầu một cuộc phiêu lưu mới đầy thú vị và vui nhộn; nhưng bất ngờ khám phá ra sự thật về cái chết bí ẩn của cha mình, rồi biết được một thợ săn người sói đang lên kế hoạch tiêu diệt tất cả gia đình và bạn bè cậu. Với vẻ ngoài nhỏ bé của một chú cún, liệu Freddy có ngăn chặn được âm mưu độc ác và chứng minh mình là sói 100%?\r\n                        \r\n                        ',85,5.7,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1597781852/projectmovies/2020-08-18T20:17:27.374Z.jpg',1,'2020-06-26','https://www.youtube.com/embed/-z8YSPu7nag'),(8,'MẸ QUỶ','2020-06-19','Brett Pierce, Drew T. Pierce','John-Paul Howard, Piper Curda, Jamison Jones,…','The Wretched kể về câu chuyện của Ben – một thiếu niên đang cố gắng vượt qua nỗi mất mát sau cuộc ly dị của bố mẹ mình. Trong kỳ nghỉ hè cùng bố, Ben chạm trán với một mụ phù thủy chuyên bắt cóc trẻ con, hiện đang rình rập gia đình cậu bằng vẻ ngoài của một cô hàng xóm hiền lành. Là người duy nhất nhận ra sự bất thường từ người phụ nữ ấy, làm thế nào để Ben có thể tìm ra cách chống lại quỷ dữ?\r\n                        ',95,7,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1597775001/projectmovies/2020-08-18T18:23:16.317Z.jpg',0,'2020-06-26','https://www.youtube.com/embed/vOC66B0w3-I'),(9,'TRẬN CHIẾN MIDWAY','2020-05-29','Roland Emmerich','Ed Skrein, Patrick Wilson, Woody Harrelson, Nick Jonas, Mandy Moore','Vào ngày 7 tháng 12 năm 1941, quân đội Nhật Bản đã tiến hành một cuộc tấn công tàn khốc vào Trân Châu Cảng, căn cứ hải quân của Hoa Kỳ ở Hawaii. Sáu tháng sau, Trận Midway bắt đầu vào ngày 4 tháng 6 năm 1942, khi hải quân Nhật Bản một lần nữa lên kế hoạch tấn công các tàu Mỹ ở Thái Bình Dương. Trong ba ngày tiếp theo, Hải quân Hoa Kỳ và một đội phi công dũng cảm đã quyết chiến với kẻ thù trong một trong những trận chiến quan trọng và mang tính quyết định của Thế chiến II.\r\n                        ',137,6.7,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1597775016/projectmovies/2020-08-18T18:23:31.718Z.jpg',0,'2020-05-29','https://www.youtube.com/embed/5MioY8Ju_Qc'),(10,'ĐÊM SỐNG CÒN','2020-08-05','Matt Eskandari','Bruce Willis, Chad Michael','  Đêm sống còn Những tên cướp đang bị thương và chạy trốn khỏi sự săn lùng của cảnh sát. Để tránh bị bắt, chúng không vào bệnh viện mà chọn cách theo chân một bác sĩ về nhà riêng để ép buộc bác sĩ đó chữa trị cho chúng. Sau khi đột nhập vào nhà, chúng đã bắt trói và uy hiếp cả gia đình.                      ',90,4.6,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1598028416/projectmovies/2020-08-21T16:46:51.870Z.jpg',0,'2020-08-22','https://www.youtube.com/embed/JzKNLg8aykU'),(11,'BÀ HOÀNG NÓI DỐI','2020-07-27','Paulo Cursino ',' Dong-Joo Jang, Han-chul Jo, Mu-Yeol Kim','  Bộ phim xoay quanh câu chuyện của nữ nghị sĩ Joo Sang Sook với khả năng nói dối “như cơm bữa”, nhờ đó bà gặt hái được rất nhiều thành công trong sự nghiệp chính trị. Đột nhiên một ngày nọ, bà Joo không thể nói dối được nữa. Sự việc trở nên hết sức nguy cấp khi ngày tranh cử đã gần kề, liệu Joo Sang Sook có thành công đắc cử lần thứ tư hay không khi mọi lời bà nói ra đều là sự thật nghiệt ngã?                      \r\n                        \r\n                        ',111,6.3,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1598029511/projectmovies/2020-08-21T17:05:06.925Z.jpg',0,'2020-08-29','https://www.youtube.com/embed/aymbgKEK0Ew'),(12,'CUỘC GIẢI CỨU HANG THAM LUANG','2020-08-03','Tom Waller','Jim Warny, Ekawat Niratvorapanya, James Edward Holley',' Chiến dịch phi thường giải cứu đội bóng nhí Thái Lan Lợn Hoang chấn động cả Thế giới mùa hè năm 2018. 18 thợ lặn nòng cốt đã vượt qua hành trình tử thần hơn 10km để làm nên kỳ tích - cứu sống 12 cầu thủ nhí sau 10 ngày mắc kẹt trong bóng tối, không thức ăn, không nước sạch.                       \r\n                        \r\n                        \r\n                        ',104,5.8,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1598029790/projectmovies/2020-08-21T17:09:45.582Z.jpg',0,'2020-08-12','https://www.youtube.com/embed/4uSYenBQ_AQ'),(13,'BÁN ĐẢO PENISULA','2020-07-01',' Sang-ho Yeon','Dong-Won Gang, Jung-hyun Lee, Re Lee ','  Bán Đảo Peninsula có bối cảnh khoảng 4 năm sau Train to Busan. Toàn bộ bán đảo Triều Tiên trở thành vùng đất hoang tàn và bị zombie xâm chiếm. Tuy nhiên, vẫn có một nhóm người bị mắc kẹt, họ phải chiến đấu để sinh tồn và chờ ngày được giải cứu.                      \r\n                        ',120,6,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1598030466/projectmovies/2020-08-21T17:21:01.545Z.jpg',0,'2020-08-07','https://www.youtube.com/embed/J8riYadR3Nk'),(14,'DINH THỰ OAN ỨC','2020-06-29',' Eric Bress','Brenton Thwaites, Theo Rossi, Kyle Gallner',' Năm người lính Mỹ được giao nhiệm vụ canh giữ một dinh thự tại Pháp trong những năm cuối Thế chiến II. Họ rơi vào tình trạng hoảng loạn khi gặp phải một kẻ thù còn đáng sợ hơn rất nhiều những gì họ từng trải qua trên chiến trường.                       \r\n                        ',90,5.4,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1598030641/projectmovies/2020-08-21T17:23:56.963Z.jpg',0,'2020-07-17','https://www.youtube.com/embed/5DKD1amDjDg'),(15,'ĐỨA CON CỦA THỜI TIẾT','2019-01-02',' Makoto Shinkai','Kotaro Daigo, Nana Mori, Shun Oguri',' Đứa Con Của Thời Tiết xoay quanh hai nhân vật: Hodaka và Hina. Hodaka là cậu thiếu niên sống trên một hòn đảo nhỏ, đã rời khỏi quê hương để đến Tokyo sầm uất. Tại đây, cậu quen biết với Hina - một cô gái kì lạ có năng lực thanh lọc bầu trời mỗi khi  cầu nguyện. Cô có khả năng chặn đứng cơn mưa và xua tan mây đen theo ý muốn.                       \r\n                        \r\n                        ',120,8.1,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1598031796/projectmovies/2020-08-21T17:43:11.753Z.jpg',0,'2020-06-29','https://www.youtube.com/embed/Q6iK6DjV_iE'),(16,'KẺ XÂM NHẬP','2020-06-26',' Sohn Won-Pyung',' Mu-Yeol Kim, Ji-Hyo Song','  Cứ ngỡ, gia đình Seo Jin sẽ lại hạnh phúc như xưa khi Yoo Jin – đứa em gái mất tích 25 năm bất ngờ trở về. Thế nhưng, Seo Jin dần nhận thấy người phụ nữ không mời mà đến này có chút bất thường. Nghi ngờ cô ta mạo danh em mình, anh quyết định lên kế hoạch nhằm bóc trần bộ mặt của kẻ xâm nhập.                      ',102,6.2,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1598032787/projectmovies/2020-08-21T17:59:43.113Z.jpg',0,'2020-08-13','https://www.youtube.com/embed/MEx9K90bP_w'),(17,'MINIONS: SỰ TRỖI DẬY CỦA GRU','2020-07-01','Kyle Balda, Brad Ableson',' Steve Carell, Lucy Lawless, Jean-Claude Van Damme',' Đến ác nhân cũng có những nỗi đau khôn nguôi...                       ',120,8,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1598033195/projectmovies/2020-08-21T18:06:30.105Z.jpg',0,'2021-07-02','https://www.youtube.com/embed/54yAKyNkK7w'),(18,'VƯƠNG QUỐC LOÀI KHỈ','2014-12-29',' Mark Linfield, Alastair Fothergill ','Tina Fey','  Bộ phim tài liệu về tự nhiên theo chân một con khỉ vừa mới được chào đời tên Kip và Maya mẹ nó cùng cuộc đấu tranh sinh tồn trong một xã hội khắc nghiệt của loài khỉ. Bầy khỉ chọn một ngôi đền cổ xưa làm chỗ trú và chúng luôn di chuyển, náo động trong khu rừng già vùng Nam Á. Bộ phim rất hay, hài hước, dí dỏm và như một cuốn phim có kết thúc có hậu. Hai mẹ con xuất thân ở tầng lớp dưới đáy xã hội (loài khỉ). Trải bao biến cố, thăng trầm, tủi nhục và cả những trận chiến kinh hồn, nó đã có được chỗ đứng vững chắc, được xếp vào tầng lớp quí tộc khỉ.                      ',90,7.3,'http://res.cloudinary.com/my-project-tkpm/image/upload/v1598033604/projectmovies/2020-08-21T18:13:20.110Z.jpg',0,'2020-04-17','https://www.youtube.com/embed/Qwh6_bMcGl4');
/*!40000 ALTER TABLE `phim` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phim_theloai`
--

DROP TABLE IF EXISTS `phim_theloai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phim_theloai` (
  `idphim` int(11) NOT NULL,
  `idtheloai` int(11) NOT NULL,
  PRIMARY KEY (`idphim`,`idtheloai`),
  KEY `idtheloai_idx` (`idtheloai`),
  CONSTRAINT `FK_Phim-TheLoai-TheLoai` FOREIGN KEY (`idtheloai`) REFERENCES `theloai` (`idtheloai`),
  CONSTRAINT `FK_Phim-TheLoai_Phim` FOREIGN KEY (`idphim`) REFERENCES `phim` (`idphim`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phim_theloai`
--

LOCK TABLES `phim_theloai` WRITE;
/*!40000 ALTER TABLE `phim_theloai` DISABLE KEYS */;
INSERT INTO `phim_theloai` VALUES (1,1),(2,1),(5,1),(10,1),(13,1),(18,1),(1,2),(2,2),(3,2),(4,2),(7,2),(11,2),(17,2),(1,3),(8,3),(14,3),(3,4),(5,4),(4,5),(15,5),(17,5),(6,6),(7,6),(9,6),(12,6),(14,6),(16,6),(18,6),(12,8),(13,8),(15,8),(9,9),(12,9),(13,9),(14,9),(16,9);
/*!40000 ALTER TABLE `phim_theloai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phongchieu`
--

DROP TABLE IF EXISTS `phongchieu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phongchieu` (
  `idphongchieu` int(11) NOT NULL AUTO_INCREMENT,
  `tenphongchieu` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `soluongghe` int(11) DEFAULT NULL,
  `idrap` int(11) DEFAULT NULL,
  `tinhtrang` int(11) DEFAULT '1',
  PRIMARY KEY (`idphongchieu`),
  KEY `FK_PhongChieu_Rap_idx` (`idrap`),
  CONSTRAINT `FK_PhongChieu_Rap` FOREIGN KEY (`idrap`) REFERENCES `rapphim` (`idrap`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phongchieu`
--

LOCK TABLES `phongchieu` WRITE;
/*!40000 ALTER TABLE `phongchieu` DISABLE KEYS */;
INSERT INTO `phongchieu` VALUES (1,'PC1',120,1,0),(2,'PC2',121,1,1),(3,'PC2',120,2,1),(4,'PC4',120,4,1),(5,'PC2',80,5,1),(6,'PC1',111,5,1),(7,'PC4',50,1,0),(8,'PC4',111,3,0),(9,'PC4',111,5,0),(10,'PC2',60,4,0),(11,'PC2',111,3,0),(12,'PC4',50,3,1);
/*!40000 ALTER TABLE `phongchieu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rapphim`
--

DROP TABLE IF EXISTS `rapphim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rapphim` (
  `idrap` int(11) NOT NULL AUTO_INCREMENT,
  `tenrap` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `diachi` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `hostline` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `idkhuvuc` int(11) DEFAULT NULL,
  PRIMARY KEY (`idrap`),
  KEY `FK_RapPhim_KhuVuc_idx` (`idkhuvuc`),
  CONSTRAINT `FK_RapPhim_KhuVuc` FOREIGN KEY (`idkhuvuc`) REFERENCES `khuvuc` (`idkhuvuc`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rapphim`
--

LOCK TABLES `rapphim` WRITE;
/*!40000 ALTER TABLE `rapphim` DISABLE KEYS */;
INSERT INTO `rapphim` VALUES (1,'Rạp Q9','Quận 9,HCM','1111',1),(2,'Rạp Q.Tân Bình','Quận Tân Bình','2222',1),(3,'Rạp Q1','Quận 1','3333',1),(4,'Rạp Hoàn Kiếm','Hoàn Kiếm','4444',2),(5,'Rạp Ba Đình','Ba Đình','5555',2);
/*!40000 ALTER TABLE `rapphim` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('UQIYdFe1DV43Tb28-MRtFd3y5VdcR7yw',1598366730,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isLogged\":false}'),('fYUearNvviFIE0P8fG9lxrqJo0Ta83Em',1598362037,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isLogged\":false}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sukien`
--

DROP TABLE IF EXISTS `sukien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sukien` (
  `idsukien` int(11) NOT NULL AUTO_INCREMENT,
  `tensukien` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `noidung` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ngaybatdau` varchar(225) DEFAULT NULL,
  `ngayketthuc` varchar(225) DEFAULT NULL,
  `hinhanh` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  PRIMARY KEY (`idsukien`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sukien`
--

LOCK TABLES `sukien` WRITE;
/*!40000 ALTER TABLE `sukien` DISABLE KEYS */;
INSERT INTO `sukien` VALUES (1,'MANG HƯƠNG VỊ NGỌT NGÀO VÀO RẠP PHIM','Lần đầu tiên tại Cinestar Cinema đem hương vị trà sữa tuyệt vời vào Rạp Phim.Vị ngọt,béo của trà sữa sẽ mang đến trải nghiệm tuyệt với cho bạn thưởng thức phim\r\n                        ','2020-06-11','2020-08-30','http://res.cloudinary.com/my-project-tkpm/image/upload/v1597770432/projectmovies/2020-08-18T17:07:07.401Z.jpg'),(2,'ĐĂNG KÝ NGAY-NHẬN QUÀ LIỀN TAY','Đăng ký thành viên để nhanh chóng nhận nhiều ưu đãi hấp dẫn//\r\n                        \r\n                        ','2020-07-05','2020-08-20','http://res.cloudinary.com/my-project-tkpm/image/upload/v1597770485/projectmovies/2020-08-18T17:08:00.471Z.jpg'),(3,'QUỐC TẾ 1/6','Quốc tế thiếu thi 1/6\r\n                        \r\n                        \r\n                        \r\n                        ','2020-07-09','2020-09-06','http://res.cloudinary.com/my-project-tkpm/image/upload/v1597770675/projectmovies/2020-08-18T17:11:10.408Z.jpg'),(4,'THÀNH LẬP','Khuyến mãi hấp dẫn nhân ngày thành lập                        \r\n                        \r\n                        \r\n                        ','2020-08-10','2020-09-06','http://res.cloudinary.com/my-project-tkpm/image/upload/v1597770505/projectmovies/2020-08-18T17:08:20.140Z.png'),(5,'GIẬT QUÀ CUỐI THÁNG 8','Ring quà về ngay và luôn!!\r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        \r\n                        ','2020-08-17','2020-09-04','https://res.cloudinary.com/my-project-tkpm/image/upload/v1597770485/projectmovies/2020-08-18T17:08:00.471Z.jpg'),(6,'TRUNG THU',' Trải nghiệm khoảnh khắc trung thu qua những bộ phim hấp dẫn                       ','2020-08-19','2020-08-21','http://res.cloudinary.com/my-project-tkpm/image/upload/v1597770801/projectmovies/2020-08-18T17:13:16.269Z.jpg'),(7,'SUMMER 2020',' Trải nghiệm những giây phút thư giãn hè 2020                       \r\n                        ','2020-08-21','2020-09-26','http://res.cloudinary.com/my-project-tkpm/image/upload/v1598034631/projectmovies/2020-08-21T18:30:26.064Z.png'),(8,'TEST SỰ KIỆN','Tri ân khách hàng                       \r\n                        ','2020-08-23','2020-08-25','http://res.cloudinary.com/my-project-tkpm/image/upload/v1598189720/projectmovies/2020-08-23T13:35:15.812Z.png'),(9,'Tri ân KH mùa hè',' Tri ân!!!                       ','2020-08-23','2020-09-06','http://res.cloudinary.com/my-project-tkpm/image/upload/v1598192113/projectmovies/2020-08-23T14:15:07.722Z.png'),(11,'vui trung thu','   Vui trung thu, thỏa sức trải nghiệm !                     ','2020-08-24','2020-09-06','http://res.cloudinary.com/my-project-tkpm/image/upload/v1598274887/projectmovies/2020-08-24T13:14:43.627Z.jpg');
/*!40000 ALTER TABLE `sukien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taikhoan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `ten` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `matkhau` varchar(255) DEFAULT NULL,
  `ngaysinh` varchar(255) DEFAULT NULL,
  `quyenhan` int(11) DEFAULT NULL,
  `gioitinh` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `diemcong` int(11) DEFAULT '0',
  `diachi` varchar(255) DEFAULT NULL,
  `sodienthoai` varchar(45) DEFAULT NULL,
  `loaitk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_TaiKhoan_LoaiTaiKhoan_idx` (`quyenhan`),
  CONSTRAINT `FK_TaiKhoan_LoaiTaiKhoan` FOREIGN KEY (`quyenhan`) REFERENCES `loaitaikhoan` (`idloaitaikhoan`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES (1,'vipula@qualee.com','ASD','$2a$10$5Rd8mMkPHa9Z/EXoGAfRmeMIyZ4WrwNRYUUBBL6x1Nhu.whiXK9Qy$2a$10$5Rd8mMkPHa9Z/EXoGAfRme','2013-06-20',1,'1',0,NULL,'1111',NULL),(2,'dreamleage2000@gmail.com','Bean11','$2a$10$/dBYA9maaWzUhavKCBYUNu7h22yrOLh5mYm7nVQBfibj9ukpAK5vG$2a$10$/dBYA9maaWzUhavKCBYUNu','2014-06-20',1,'0',1,'Nguyễn Văn Cừ','2222',1),(3,'lmh0912190+qualee2@gmail.com','VSTest21','$2a$10$8pqCkEjhZLneoAjB3WC6LuO6lyNUonkO2T308KED2SrX.O8dEnZsi$2a$10$8pqCkEjhZLneoAjB3WC6Lu','2010-06-20',1,'0',0,NULL,'3333',NULL),(4,'honey_moon0907@yahoo.com','Sad','$2a$10$2SU.ighSiAC96CPRVEMahuWR3Ktx3LDoUg83yOObopcNmm07oVjda$2a$10$2SU.ighSiAC96CPRVEMahu','2013-06-20',1,'1',0,NULL,'4444',NULL),(5,'mitch@vinova.sg','Micheal','$2a$10$8hwsYO3p9Vkle0xrpePigOFelECwfcib10nW2S8aN.h2vLcaSenL.$2a$10$8hwsYO3p9Vkle0xrpePigO','2013-06-06',2,'1',0,'Nguyen Van Cu','5555',NULL),(6,'dreamleage1999@gmail.com','David','$2a$10$1MsBZ2fRFcjF7OvQna38fuTidPizXadyabi.1in8BB5.9X7I5ZPOe$2a$10$1MsBZ2fRFcjF7OvQna38fu','1999-05-16',1,'1',2,'Đồng Tháp','6666',1),(9,'dreamleage2001@gmail.com','Nguyen Van b','$2a$10$xauCfUa6OEkr2fr/qU6ABuEN5tvH8icWyJmTajAk/Pw7Dy/7l9Syy$2a$10$xauCfUa6OEkr2fr/qU6ABu','2000-06-15',1,'0',2,'aaa','7777',1),(10,'dreamleage2005@gmail.com','Admin','$2a$10$LxgDtgwhk5YUwKToqYYwV.vfHjKcVLGv4ovpTbMeGbgQVu0AAMFtS$2a$10$LxgDtgwhk5YUwKToqYYwV.','2020-07-23',3,'1',0,'Hồ Chí Minh',NULL,NULL),(12,'ngoccuc123@gmail.com','ngoc cuc Doan','','2020-08-14',1,'1',0,'Đồng Tháp','',1),(13,'1291140304553547','Hà Duy Tân','','1999-05-16',1,'1',2,'Đồng Tháp','',2),(15,'dreamleage2004@gmail.com','Nguyễn Văn A','$2a$10$2h4RCDzEFz9w79pZlT6owOac8hxCqLnGDi/Hu0..QS.F/4CzqtnQG$2a$10$2h4RCDzEFz9w79pZlT6owO','1999-06-02',1,'1',0,'Hồ Chí Minh',NULL,NULL),(16,'dreamleage2010@gmail.com','David Nguyễn','$2a$10$TuaXDMbbuoykgKszEwbzLuWyVXL6hvbCuKzG9XFVqhW.j8B/693Ta$2a$10$TuaXDMbbuoykgKszEwbzLu','1999-01-27',1,'1',0,'Hồ Chí Minh',NULL,NULL),(17,'dreamleage1998@gmail.com','Nguyen Van ','$2a$10$fwzbmg1CwaTxD021CVrolO3tCYq621iH48Lg9OoN0cF.KepTgOnDS$2a$10$fwzbmg1CwaTxD021CVrolO','1999-08-04',1,'1',0,'Hồ Chí Minh',NULL,NULL),(18,'dreamleage1997@gmail.com','David11','$2a$10$oDLmPjc2kt9cyruZScpy5ehitqTRh9OWfOZzvi8LAfWC5UHcOdNFC$2a$10$oDLmPjc2kt9cyruZScpy5e','1999-02-03',1,'1',0,'Nguyen Van Cu',NULL,NULL),(19,'dreamleage@gmail.com','TKPM','$2a$10$VyVwiYcPMgoQSOG/LZNxie3VPiQcmE6sh24nRoa/V276xGmxUT3/C$2a$10$VyVwiYcPMgoQSOG/LZNxie','1998-12-29',1,'1',0,'Nguyễn Văn Cừ',NULL,NULL);
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theloai`
--

DROP TABLE IF EXISTS `theloai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theloai` (
  `idtheloai` int(11) NOT NULL AUTO_INCREMENT,
  `tentheloai` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`idtheloai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theloai`
--

LOCK TABLES `theloai` WRITE;
/*!40000 ALTER TABLE `theloai` DISABLE KEYS */;
INSERT INTO `theloai` VALUES (1,'Phim viễn tưởng'),(2,'Phim hài hước'),(3,'Phim kinh dị'),(4,'Phim tình cảm'),(5,'Phim hoạt hình'),(6,'Phim hành động'),(7,'Phim cổ trang'),(8,'Phim tâm lý'),(9,'Phim phiêu lưu');
/*!40000 ALTER TABLE `theloai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ve`
--

DROP TABLE IF EXISTS `ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ve` (
  `idve` int(11) NOT NULL AUTO_INCREMENT,
  `tenve` varchar(225) DEFAULT NULL,
  `giave` int(11) DEFAULT NULL,
  `tinhtrang` int(11) DEFAULT '1',
  PRIMARY KEY (`idve`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ve`
--

LOCK TABLES `ve` WRITE;
/*!40000 ALTER TABLE `ve` DISABLE KEYS */;
INSERT INTO `ve` VALUES (1,'Vé người lớn',70000,1),(2,'Vé trẻ em',50000,1),(3,'Vé couple',200000,1),(4,'Vé 3D',200000,1),(5,'Vé test',50000,0),(6,'VÉ super',50000,0),(7,'Combo ghế gia đình',300000,1),(8,'Vé tri ân',50000,1);
/*!40000 ALTER TABLE `ve` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-24 21:48:55
