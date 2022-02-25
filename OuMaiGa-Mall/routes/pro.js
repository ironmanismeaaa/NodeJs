/*
 * @Description: 
 * @Version: 2.0
 * @Author: evermore
 * @Date: 2021-12-09 19:30:35
 * @LastEditTime: 2021-12-16 20:59:57
 */
const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
let router=express.Router();

router.get("/productdetail/:sid",(req,res)=>{
	var $sid=req.params.sid;
	// console.log($sid);
	var sql="select * from shoes where sid=?";
	pool.query(sql,[$sid],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});

router.get("/related/:sid",(req,res)=>{
	var $sid=req.params.sid;
	var sql="select * from shoes where sid!=? and type=(select type from shoes where sid=?);";
	pool.query(sql,[$sid,$sid],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
router.get("/Allwish/:name",(req,res)=>{
	var $name=req.params.name;
	var sql="select * from shoes,user,collection where collection.uid=user.uid and shoes.sid=collection.sid and user.uname=?";
	pool.query(sql,[$name],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
router.delete("/deletewish/:sid&:uname",(req,res)=>{
	var $sid=req.params.sid;
	var $uname=req.params.uname;
	var sql=" delete from collection where sid=? and uid=(select uid from user where uname=?);";
	pool.query(sql,[$sid,$uname],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){//受影响行数大于0
			res.send("1");
		}else{
			res.send("0");
		}
	});
});

router.get("/addwish/:sid&:uname",(req,res)=>{
	
	var $sid=req.params.sid;
	var $uname=req.params.uname;
	console.log($sid+$uname);
	var sql="insert into collection set sid=?,uid=(select uid from user where uname=?)";
		pool.query(sql,[$sid,$uname],(err,result)=>{
			if(err){
				res.send("0");
				return;
				// throw err;
			}
			console.log("save!");
			res.send("1");
		});
});


router.get("/wishstate/:sid&:uname", (req, res) => {
	var $sid = req.params.sid;
	var $uname = req.params.uname;
	var sql = "select * from collection where sid=? and uid=(select uid from user where uname=?)";
	pool.query(sql, [$sid, $uname], (err, result) => {
		if (err) throw err;
		if (result.length > 0) {
			res.send("1");
		} else {
			res.send("0");
		}
	});
});


module.exports=router;