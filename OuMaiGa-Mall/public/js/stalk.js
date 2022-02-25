
window.onbeforeunload = function()
{
	var n = window.event.screenX - window.screenLeft;
	var b = n > document.documentElement.scrollWidth-20;
	if(b && window.event.clientY < 0 || window.event.altKey)
	{
		// alert("是关闭而非刷新");
		// window.open(this.location); 
		//return false;
		//window.event.returnValue = ""; 
		clearInterval(timer);
	}
}

window.onload=function(){
	// var name=localStorage.getItem("name");
	// if(name==null){
	// 	alert("请先登录!");
	// 	window.location.href="http:127.0.0.1:8080/login.html";
	// }
	document.getElementById("sheadimg").style.setProperty('background-image','url(../img/express/st.png)');
	
	document.getElementById("sheadname").innerHTML='商家';
	getlist();
	// document.getElementById("uli").style.setProperty('background-image','url(../img/express/ut.png)');
	// console.log(uname);
	
	
}

function getlist(){
	// 1.获取异步对象
	var xhr=new XMLHttpRequest();
	// 4.创建监听 接收响应信息
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4 && xhr.status==200){
			var result=xhr.responseText;
			result=result.substring(1,result.length-1);
			var sigres=result.split(",");
			var str="";
			uname=JSON.parse(sigres[0]).uname;
			for(var i=0;i<sigres.length;i++){
				var sigresu=JSON.parse(sigres[i]);
				str+='<div onclick="nowtalk(this)" class="person"  onmouseover=\'style="background-color: white;"\' onmouseout=\'style="background-color: #f4f4f4;"\'>'+
				'<div class="list_tk1">'+
						'</div>'+
						'<div class="list_name">'+
							'<span style="font-weight: 550;">'+sigresu.uname+'</span>'+
						'</div>'+
						'</div>';
			}
			getrec(uname);
			document.getElementById("ldlist").innerHTML=str;
			document.getElementById("nowobj").innerHTML=uname;
		}
	}
	// 2.创建请求
	xhr.open("get",`/pro/getperson`,true);
	// 3.发送请求
	xhr.send();
}

var timer;
var ct=0;
function nowtalk(obj){
	var name=obj.innerText;
	console.log(obj.innerText);
	document.getElementById("nowobj").innerHTML=name;
	getrec(name);
	if(ct=1){
		clearInterval(timer);
	}
	
	timer=setInterval(function(){
		getrec(name);
	},3000);
	ct=1;
}

function getrec(name){
	var uu='<div class="user-group">'+
			' <div class="user-msg">'+
					   '<span class="user-reply">';
	var ud='</span>'+
					   '<i class="triangle-user"></i>'+
				 '</div>'+
				  '<img class="user-img" src="/img/express/st.png"/>'+
			'</div>';
	var su='<div class="admin-group">'+
				  '<img class="admin-img" src="/img/express/ut.png"/>'+
				  '<div class="admin-msg">'+
					   '<i class="triangle-admin"></i>'+
					   '<span class="admin-reply">';
	var sd='</span>'+
				  '</div>'+
			'</div>';
	// 1.获取异步对象
	var xhr=new XMLHttpRequest();
	// 4.创建监听 接收响应信息
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4 && xhr.status==200){
			var result=xhr.responseText;
			// console.log(result);
			if(result.length==2){
				return;
			}
			var ct=JSON.parse(result.substring(1,result.length-1)).content;
			var sigct=ct.split(";");
			// console.log(sigct);
			var re="";
			for(var i=0;i<sigct.length-1;i++){
				var tc=sigct[i].split(":");
				if(tc[0]=='u'){
					re+=su+tc[1]+sd;
				}
				if(tc[0]=='s'){
					re+=uu+tc[1]+ud;
				}
			}
			document.getElementById("rec").innerHTML=re;
			document.getElementById("rec").scrollTop=document.getElementById("rec").scrollHeight;
		}
	}
	// 2.创建请求
	xhr.open("get",`/pro/read/${name}`,true);
	// 3.发送请求
	xhr.send();
}

function submit(){
	var txt=document.getElementById("txt");
	var news=txt.value.trim();
	if(news.length==0){
		return;
	}
	var str=document.getElementById("rec").innerHTML;
	str+='<div class="user-group">'+
			' <div class="user-msg">'+
					   '<span class="user-reply">'+news+'</span>'+
					   '<i class="triangle-user"></i>'+
				 '</div>'+
				  '<img class="user-img" src="/img/express/ut.png"/>'+
			'</div>';
	// console.log(str);
	document.getElementById("rec").innerHTML=str;
	document.getElementById("rec").scrollTop=document.getElementById("rec").scrollHeight;
	document.getElementById("txt").value="";
	var nnews={content:"s:"+news+";",uname:document.getElementById("nowobj").innerHTML};
	// var name='aa';
	// 1.获取异步对象
	var xhr=new XMLHttpRequest();
	// 4.创建监听 接收响应信息
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4 && xhr.status==200){
			var result=xhr.responseText;
		}
	}
	// 2.创建请求
	xhr.open("get",`/pro/write/${JSON.stringify(nnews)}`,true);
	// 3.发送请求
	xhr.send();
}