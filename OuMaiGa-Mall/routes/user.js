/*
 * @Author: your name
 * @Date: 2021-12-11 15:54:31
 * @LastEditTime: 2021-12-13 21:59:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Intermediate_project\routes\user.js
 */

const express=require('express');
const pool=require('../pool.js');
let router=express.Router();

//用户注册
router.post('/register',(req,res)=>{
	// 1.1获取post请求数据
	let obj=req.body;
	
	// 1.2验证数据是否为空,如果空返回响应信息
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		return;
	}
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}
	if(!obj.usex){
		res.send({code:403,msg:'sex required'});
		return;
	}
	if(!obj.uphone){
		res.send({code:404,msg:'phone required'});
		return;
	}
    if(!obj.uaddress){
		res.send({code:404,msg:'address required'});
		return;
	}
	// 1.3 插入数据 创建连接池pool.js文件(所有的路由器文件都可以使用)，上面引入
	pool.query('INSERT INTO user SET ?',[obj],(err,result)=>{
		// if(err) throw err;
		if(err){

			res.send({code:500,msg:'server error'});
			return;
		}
		if(result.affectedRows>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
	// res.send('注册成功');
});

// 根据uname查询用户 reg
router.get("/queryUser/:uname",(req,res)=>{
	var $uname=req.params.uname;
	var sql="select * from user where uname=?";
	pool.query(sql,[$uname],(err,result)=>{
		if(err) {
            throw err;
        }
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});

//登录接口
router.post('/login',(req,res)=>{
	// 2.1获取post请求数据
	let obj=req.body;
	console.log(obj);
	// 2.2验证数据是否为空,如果空返回响应信息
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		return;
	}
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}//测试为空返回的信息
	// 2.3 执行sql语句
	pool.query('SELECT * FROM user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],(err,result)=>{
		if(err) throw err;console.log(result);
		// if(err){
		// 	res.send({code:500,msg:'server error'});
		// 	return;
		// }
		if(result.length>0){//返回数组长度大于0成功
			res.send("1");
		}else{
			res.send("0");//用户名或密码错误
		}
	});
	// res.send('登录成功');
});

// 4. 根据用户名返回用户个人信息接口
router.get("/returndetail/:uname",(req,res)=>{
	var $uname=req.params.uname;
	var sql="select * from user where uname=?";
	pool.query(sql,[$uname],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send(result);
		}else{
			res.send("0");
		}
	});
});

//更新用户信息 	
router.post('/updata',(req,res)=>{
	// 4.1获取数据
	let obj=req.body;
	console.log(obj);
	// 4.2验证数据是否为空,如果空返回响应信息
	let i=400;//让状态码循环从第一个401开始 
	for(let key in obj){//key是属性名 obj[key]是属性值
		// console.log(key);
		i++;
		if(!obj[key]){
			res.send({code:i,msg:key+'required'});//拼接key 知道哪个属性名是空的
			return;
		}//测试为空返回的信息
	}
	// 4.3 执行sql语句
	pool.query('UPDATE user SET ? WHERE uid=?',[obj,obj.uid],(err,result)=>{
		if(err) throw err;
		if(err){
			console.log(err);
			return;
		}
		if(result.affectedRows>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
	// res.send('修改成功');
});


module.exports=router;