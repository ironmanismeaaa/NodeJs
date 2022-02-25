const { json } = require('express');
const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
let router=express.Router();

router.get('/checkout/:sid',(req,res)=>{
	var asid=req.params.sid;
	console.log(asid);
	console.log(asid.length);
	var sql="("+asid+")";
	sql="select sid,sname,price,imgurl from shoes where sid in"+sql;
	console.log(sql);
	pool.query(sql,(err,result)=>{
		if(err){
			throw err;
		}
		res.send(result);
	});
});

router.get('/fill/:uname',(req,res)=>{
	var name=req.params.uname;
	var sql='select * from user where uname="'+name+'"';
	pool.query(sql,(err,result)=>{
		if(err){
			throw err;
		}
		res.send(result);
	});
});

router.put('/createorder',(req,res)=>{
	// console.log(req);
	var nname=req.body.nname;
	var rname=req.body.uname;
	var rcity=req.body.ucity;
	var rcode=req.body.ucode;
	var radd=req.body.uadd;
	var rphone=req.body.uphone;
	var total=req.body.total;
	var sn=req.body.sn;
	console.log(nname);
	function cleancart(uid){
		pool.query('delete from cart where uid=?',[uid],(err,result)=>{
			if(err){
				throw err;
			}
		});
	}
	
	function wrt(){
		pool.query('select rid from receiver',(err6,result6)=>{
			if(err6){
				throw err6;
			}
			var rid=result6[0]['rid'];			
			pool.query('select uid from user where uname=?',[nname],(err7,result7)=>{
				if(err7){
					throw err7;
				}
				var uid=result7[0]['uid'];
				console.log(uid+"aaa")
				cleancart(uid);
				pool.query('insert into orders(money,paystate,rid,uid) value(?,?,?,?)',[total,1,rid,uid],(err2,result2)=>{
					if(err2){
						throw err2;
					}
					pool.query('select max(orderID) from orders',(err4,result4)=>{
						if(err4){
							throw err4;
						}
						// console.log("nnn"+sn);
						var id=result4[0]['max(orderID)'];
						var sid=sn.sid;
						var num=sn.num;
						var size=sn.size;
						for(var i=0;i<sid.length;i++){
							pool.query('insert into orderitem(orderID,sid,buynum,size) value(?,?,?,?)',[id,parseInt(sid[i]),num[i],size[i]],(err3,result3)=>{
								if(err3){
									throw err3;
								}
								
							})
						}
					})
					
				})
			})
			
		})
	}
	sn=JSON.parse(sn);
	pool.query("select * from receiver where rname=?",[rname],(err,result)=>{
		if(err){
			throw err;
		}
		if(result.length==0){
			pool.query('insert into receiver(rname,rcity,rphone,rcode,raddress) value(?,?,?,?,?)',[rname,rcity,rphone,rcode,radd],(err1,result1)=>{
				if(err1){
					throw err1;
				}
				wrt();
			})
		}
		else{
			wrt();
		}
	})
});

router.get("/getuid/:uname",(req,res)=>{
	var $uname=req.params.uname;
	var sql="select * from user where uname=?";
	pool.query(sql,[$uname],(err,result)=>{
		if(err) {
            throw err;
        }
		console.log(result[0].uid);
		res.send(result);
	});
});

router.get("/showOrder/:uname",(req,res)=>{
	var name=req.params.uname;
	console.log(name);
	var sql='SELECT orders.orderID,sname,imgurl,rname,rphone,raddress,buynum,paystate,shoes.sid FROM user,shoes,orders,receiver,orderitem ';
	sql+='WHERE user.uname="'+name+'" and user.uid=orders.uid and receiver.rid=orders.rid AND orderitem.sid=shoes.sid AND orders.orderID=orderitem.orderID';
	pool.query(sql,(err,result)=>{
		if(err){
			res.send("0");
			throw err;
		}
		res.send(result);
	});
});

router.get("/changeState/:orderID",(req,res)=>{
	var sql="UPDATE orders SET paystate = 4 WHERE orderID="+req.params.orderID;
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