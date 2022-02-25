/*
 * @Description: 
 * @Version: 2.0
 * @Author: evermore
 * @Date: 2021-12-09 19:30:35
 * @LastEditTime: 2021-12-16 21:54:02
 */
const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
let router=express.Router();

router.get("/getNew",(req,res)=>{
	var sql="select * from shoes order by sid desc limit 4;";
	pool.query(sql, (err,result)=>{
		if(err) {
            console.log(err);
            throw err;
        }
		res.send(result);
	});
});

router.get("/getShoes/:uname",(req,res)=>{
	var ress=new Array();
	var sql="select * from shoes limit 16;";
	pool.query(sql, (err,result)=>{
		if(err) {
            console.log(err);
            throw err;
        }
		pool.query('select sid from collection,user where user.uname="'+req.params.uname+'" and user.uid=collection.uid',(err1,result1)=>{
			if(err1){
				throw err1;
			}
			var arr=result;
			var arr1=result1;
			var res1=new Array();
			for(var i=0;i<arr1.length;i++){
				var sid=JSON.parse(JSON.stringify(arr1[i]));
				res1[i]=sid.sid;
			}
			for(var i=0;i<arr.length;i++){
				var sid=JSON.parse(JSON.stringify(arr[i])).sid;
				if(res1.indexOf(""+sid)!=-1){
					arr[i].ad=1;
					ress[i]=arr[i];
				}
				else{
					arr[i].ad=0;
					ress[i]=arr[i];
				}
			}
			res.send(ress);
		});
	});
});

router.get("/searchByType/:stype",(req,res)=>{
	var $stype=req.params.stype;
	var sql="select * from shoes where type=?";
	pool.query(sql,[$stype],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});

router.get("/search/:sname",(req,res)=>{
	var $sname=req.params.sname;
	//console.log($sname);
    $sname = "%" + $sname + "%";
	var sql="select * from shoes where sname like ?";
    console.log(sql);
	pool.query(sql,[$sname],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});

router.get("/showCart/:uname",(req,res)=>{
	var $uname=req.params.uname;
	//console.log($uid);
	var sql="select * from cart,shoes where uid=(select uid from user where uname=?) and cart.sid=shoes.sid";
	pool.query(sql,[$uname],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});

router.get("/deleteCart/:cid",(req,res)=>{
	var $cid=req.params.cid;
	console.log($cid);
	var sql="delete from cart where cartID=?";
	pool.query(sql,[$cid],(err,result)=>{
		if(err) {
            console.log(err);
            throw err;
        };
		res.send(result);
	});
});

router.get("/deleteOrder/:orderID",(req,res)=>{
	var $oid=req.params.orderID;
	console.log($oid);
	var sql="delete from orders where orderID=?";
	pool.query(sql,[$oid],(err,result)=>{
		if(err) {
            console.log(err);
            throw err;
        };
		res.send(result);
	});
});

router.post('/updateCart',(req,res)=>{
	// 1.1获取post请求数据
	let obj=req.body;
    var num = parseInt(obj.num);
    var cid = parseInt(obj.cid);
	// 1.3 插入数据 创建连接池pool.js文件(所有的路由器文件都可以使用)，上面引入
	pool.query('update cart set num=? where cartID=?',[num,cid],(err,result)=>{
		// if(err) throw err;
		if(err){
			console.log(err);
			return;
		}
		res.send("1");
	});
	// res.send('注册成功');
});

router.post('/addCart',(req,res)=>{
	// 1.1获取post请求数据
	let obj=req.body;
	console.log(obj.sid);//测试提交后服务器接到的数据 对象
    console.log(obj.uname);
    console.log(obj.num);
    console.log(obj.size);
	pool.query('select * from cart where sid=? and uid =(select uid from user where uname=?) and size =?;',[obj.sid,obj.uname,obj.size],(err,result)=>{
		// if(err) throw err;
		if(err){
			console.log(err);
			return;
		}
		if(result.length > 0){
			pool.query('update cart set num=num+? where sid=? and uid=(select uid from user where uname=?) and sid=?;',[obj.num,obj.sid,obj.uname,obj.sid],(err,res)=>{
                // if(err) throw err;
                if(err){
                    console.log(err);
                    return;
                }
                return 1;
            });
		}else{
			pool.query('insert into cart set uid=(select uid from user where uname=?),sid=?,num=?,size=?;',[obj.uname,obj.sid,obj.num,obj.size],(err,res)=>{
                // if(err) throw err;
                if(err){
                    console.log(err);
                    return;
                }
                return 1;
            });
		}
	});
	// res.send('注册成功');
});



module.exports=router;