/*
MySQL Data Transfer
Source Host: ownerworld.tpddns.cn
Source Database: IAT
Target Host: ownerworld.tpddns.cn
Target Database: IAT
Date: 2019/1/28 11:41:31
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `add_time` timestamp NULL DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for sample
-- ----------------------------
DROP TABLE IF EXISTS `sample`;
CREATE TABLE `sample` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) DEFAULT NULL,
  `path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `param_type` smallint(6) DEFAULT NULL,
  `params` mediumtext COLLATE utf8mb4_unicode_ci,
  `asserts_type` smallint(6) DEFAULT NULL,
  `asserts_data` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extract_type` smallint(6) DEFAULT NULL,
  `extract_key_name` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extract_data` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `add_time` timestamp NULL DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL,
  `task_type` smallint(6) DEFAULT NULL,
  `run_time` varchar(255) DEFAULT NULL,
  `task_desc` varchar(1000) DEFAULT NULL,
  `domain` varchar(500) DEFAULT NULL,
  `headers` mediumtext,
  `proxy` varchar(500) DEFAULT NULL,
  `params` mediumtext,
  `case` mediumtext,
  `add_time` timestamp NULL DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `status` smallint(6) DEFAULT NULL,
  `result` mediumtext,
  `project_id` int(11) DEFAULT NULL,
  `daily_result` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for task_pressure
-- ----------------------------
DROP TABLE IF EXISTS `task_pressure`;
CREATE TABLE `task_pressure` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_id` bigint unsigned NOT NULL,
  `rps` bigint unsigned NOT NULL,
  `time` bigint unsigned NOT NULL,
  `up` bigint unsigned NOT NULL,
  `ins_count` smallint NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `status` smallint(6) NOT NULL,
  `gmt_create` datetime,
  `gmt_modified` datetime,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- ----------------------------
-- Table structure for task_count
-- ----------------------------
DROP TABLE IF EXISTS `task_count`;
CREATE TABLE `task_count` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_total` int(11) DEFAULT NULL,
  `sucess` int(11) DEFAULT NULL,
  `fail` int(11) DEFAULT NULL,
  `add_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for tree
-- ----------------------------
DROP TABLE IF EXISTS `tree`;
CREATE TABLE `tree` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` smallint(6) DEFAULT NULL,
  `add_time` timestamp NULL DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `index_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(40) DEFAULT NULL,
  `hash_password` varchar(80) DEFAULT NULL,
  `salt` varchar(80) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `account_type` int(10) unsigned zerofill DEFAULT NULL,
  `szwego_url` varchar(255) DEFAULT NULL,
  `szwego_token` varchar(500) DEFAULT NULL,
  `get_status` smallint(5) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;