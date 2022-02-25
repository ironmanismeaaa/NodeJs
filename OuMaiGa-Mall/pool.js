/*
 * @Description: 
 * @Version: 2.0
 * @Author: evermore
 * @Date: 2021-12-09 10:58:45
 * @LastEditTime: 2021-12-28 23:05:42
 */
const mysql=require('mysql');
//创建连接池对象
let pool=mysql.createPool({
	host:'127.0.0.1',
	port:'3306',
	user:'root',
	password:'',
	database:'shoes',
	connectionLimit:10
});
// 导出连接池对象
module.exports=pool;