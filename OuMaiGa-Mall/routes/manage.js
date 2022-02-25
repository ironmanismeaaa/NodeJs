/*
 * @Description: 
 * @Version: 2.0
 * @Author: evermore
 * @Date: 2021-12-12 10:52:23
 * @LastEditTime: 2021-12-13 00:09:10
 */
const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
let router=express.Router();

router.get("/allshoes",(req,res)=>{
	var sql="select * from shoes";
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
router.get("/getType",(req,res)=>{
	var sql="select type,count(*) as num from shoes group by(type);";
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
router.get("/searchsentence/:searchs",(req,res)=>{
	var $searchs=req.params.searchs;
	var $searchs="%"+$searchs+"%";
	// console.log($searchs);
	var sql="select * from shoes where sname like ?";
	pool.query(sql,[$searchs],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
router.get("/searchShoesInType/:type",(req,res)=>{
	var $type=req.params.type;
	console.log($type);
	var sql="select * from shoes where type=?";
	pool.query(sql,[$type],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
router.put("/save",(req,res)=>{
	var $sid=req.body.sid;
	var $sname=req.body.sname;
	var $price=req.body.price;
	var $type=req.body.type;
	var $imgurl=req.body.imgurl;
	var $description=req.body.description;
	var sql="update shoes set sname=?,price=?,imgurl=?,description=?,type=? where sid=?";
		pool.query(sql,[$sname,$price,$imgurl,$description,$type,$sid],(err,result)=>{
			if(err){
				res.send("0");
				throw err;
			}
			console.log("save!");
			res.send("1");
		});
});
router.post("/Newsave",(req,res)=>{
	var $sid=req.body.sid;
	var $sname=req.body.sname;
	var $price=req.body.price;
	var $type=req.body.type;
	var $imgurl=req.body.imgurl;
	var $description=req.body.description;
	var sql="insert into shoes set sname=?,price=?,imgurl=?,description=?,type=?,soldnum=?";
		pool.query(sql,[$sname,$price,$imgurl,$description,$type,0],(err,result)=>{
			if(err) throw err;
		if(result.affectedRows>0){
			res.send("1");
		}else{
			res.send("0");
		}
		});
});
router.delete("/deleteShoes/:sid",(req,res)=>{
	var $sid=req.params.sid;
	var sql="delete from shoes where sid=?";
	pool.query(sql,[$sid],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){//受影响行数大于0
			res.send("1");
		}else{
			res.send("0");
		}
	});
});

module.exports=router;