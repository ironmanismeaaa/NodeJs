/*
 * @Description: 
 * @Version: 2.0
 * @Author: evermore
 * @Date: 2021-12-09 19:29:09
 * @LastEditTime: 2021-12-09 19:31:34
 */
const express=require('express');
const path=require('path');
const bodyParser=require('body-Parser');
const proRouter=require('./routes/pro.js');
const hzwRouter=require('./routes/hzwPro.js');
const checkoutrouter=require('./routes/checkout.js');
const manageRouter=require('./routes/manage.js');
const userRouter=require('./routes/user.js');
const jyRouter=require('./routes/jyPro.js');
const talkingRouter=require('./routes/talking.js')
let app=express();	
app.listen(8080);

app.use(express.static('ajax'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
	extended:false  //将post数据解析为对象
}));

app.use('/pro',proRouter);
app.use('/pro',checkoutrouter);
app.use('/hzwPro',hzwRouter);
app.use('/manage',manageRouter);
app.use('/user',userRouter);
app.use('/jyPro',jyRouter);
app.use('/pro',talkingRouter);