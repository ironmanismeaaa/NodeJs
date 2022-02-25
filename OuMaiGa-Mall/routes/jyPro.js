const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
let router=express.Router();

router.post("/comment",(req,res)=>{
	
	// 1.1获取post请求数据
	let obj=req.body;
	console.log(obj);
	var uname = obj.uname;
	var sid = obj.sid;
	var star = parseInt(obj.star);
	var c = obj.c;
	// 1.3 插入数据 创建连接池pool.js文件(所有的路由器文件都可以使用)，上面引入
	pool.query('INSERT INTO comment VALUES (?, ?, (SELECT uid FROM user WHERE uname=?), ?)',[c,sid,uname,star],(err,result)=>{
		// if(err) throw err;
		if(err){
			console.log(err);
			res.send("0");
			return;
		}
		res.send("1");
	});
});

router.get("/showComm/:sid",(req,res)=>{
	// 1.1获取post请求数据
	let sid=req.params.sid;
	// 1.3 插入数据 创建连接池pool.js文件(所有的路由器文件都可以使用)，上面引入
	pool.query('SELECT stars,uname,content FROM comment,user WHERE comment.uid=user.uid AND sid=?',sid,(err,result)=>{
		// if(err) throw err;
		if(err){
			console.log(err);
			res.send("0");
			return;
		}
		res.send(result);
	});
});

router.get("/showOrder",(req,res)=>{
	var sql="SELECT sname,imgurl,rname,rphone,raddress FROM shoes,orders,receiver,orderitem ";
	sql+="WHERE receiver.rid=orders.rid AND orderitem.sid=shoes.sid AND orders.orderID=orderitem.orderID AND paystate=1";
	pool.query(sql,(err,result)=>{
		// if(err) throw err;
		if(err){
			console.log(err);
			res.send("0");
			return;
		}
		res.send(result);
	});
});

router.get("/changeState",(req,res)=>{
	var sql="UPDATE orders SET paystate = 2 WHERE paystate = 1";
	pool.query(sql,(err,result)=>{
		// if(err) throw err;
		if(err){
			console.log(err);
			res.send("0");
			return;
		}
		res.send("1");
	});
});

module.exports=router;