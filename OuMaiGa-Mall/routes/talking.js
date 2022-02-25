const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
let router=express.Router();

router.get('/write/:content',(req,res)=>{
	// console.log(req);
	var ct=req.params.content;
	var tct=JSON.parse(ct);
	var content=tct.content;
	var name=tct.uname;
	pool.query('select * from record where uname=?',[name],(err,result)=>{
		if(err){
			throw err;
		}
		if(result.length==0){
			pool.query('insert into record set ?',[tct],(err1,result1)=>{
				if(err){
					throw err;
				}
			});
		}
		else{
			pool.query('select content from record where uname=?',[name],(err2,result2)=>{
				if(err2){
					throw err2;
				}
				// console.log(result2[0].content);
				var newcontent=result2[0].content+content;
				// console.log(newcontent);
				pool.query('update record set content=? where uname=?',[newcontent,name],(err4,result4)=>{
					if(err4){
						throw err4;
					}
				});
			})
		}
	});
});

router.get('/read/:uname',(req,res)=>{
	var uname=req.params.uname;
	pool.query('select content from record where uname=?',[uname],(err,result)=>{
		if(err){
			throw err;
		}
		res.send(result);
	})
});

router.get('/getperson',(req,res)=>{
	pool.query('select uname from record',(err,result)=>{
		if(err){
			throw err;
		}
		res.send(result);
	});
});

module.exports=router;