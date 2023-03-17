---
title: Toys
date: 2021-11-11
tags:
  - FrontEnd
categories:
  - Toy
---

> 一些纯前端的小玩意

## Cloud Climbing

> 模仿造梦三开头的网页小游戏

### 碰撞检测

~~~js
// node1为云，node2为人
function crash(node1, node2){
    var l1 = node1.offsetLeft;
    var r1 = node1.offsetLeft + node1.offsetWidth;
    var t1 = node1.offsetTop;            
    var b1 = node1.offsetTop + node1.offsetHeight;

    var l2 = node2.offsetLeft;
    var r2 = node2.offsetLeft + node2.offsetWidth;
    var t2 = node2.offsetTop;
    var b2 = node2.offsetTop + 100;

    console.log("云：" + l1 + "," + r1 + "," + t1 + "," + b1);
    console.log("人：" + l2 + "," + r2 + "," + t2 + "," + b2)
    if (l2 > r1 || r2 < l1 || t2 > b1 || b2 < t1) {
        return false;
    }
    return true;
}
~~~

### 渐变色背景

~~~css
background-color: #0093E9;
background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
~~~

### 超出隐藏

~~~css
overflow: hidden;
~~~

将超出游戏窗口部分 hidden

```css
#app{
    border: 2px solid black;
    height: 700px;
    width: 500px;
    position: absolute;
    right: 35%;
    top: 40px;
    background-color: #0093E9;
    background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    overflow: hidden;
}
```

### 人物移动

- 根据鼠标位置和人物位置移动人物
- 根据鼠标人物位置翻转图片，达到转身效果

~~~js
// 控制人物移动以及动画
$(document).ready(function(){
    $("#app").mousemove(function(e){
        if(e.pageX >= 560 && e.pageX <= 1100 && e.pageY >= 40 && e.pageY <=740){
            var loc = wukong.offsetLeft+642;
            if(e.pageX > loc && loc <= 1020 ){
                $("#img").attr("src", "img/C-R.png");
                wukong.style.left = wukong.offsetLeft+9+"px";
            } else if(e.pageX < loc && loc >= 595){
                $("#img").attr("src", "img/R-C.png");
                wukong.style.left = wukong.offsetLeft-9+"px";
            }
        }
    })                    
})
~~~

### 云朵生成

div 画云

~~~css
.cloud{
    background-color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%; 
    background-color: #fff; 
    box-shadow: #fff 65px -15px 0 -5px,#fff 25px -25px, #fff 30px 10px,#fff 60px 15px 0 -10px,#fff 85px 5px 0 -5px; 
    position: absolute;
    top: 430px;
    left: 185px;
}
~~~

用 js 设置 css

```javascript
cloud.setAttribute("class", "cloud");
cloud.style.cssText = "background-color: white;\
width: 50px; height: 50px;\
border-radius: 50%;\
background-color: #fff;\
box-shadow: #fff 65px -15px 0 -5px,#fff 25px -25px, #fff 30px 10px,#fff 60px 15px 0 -10px,#fff 85px 5px 0 -5px;\
position: absolute;";
cloud.style.top = -5 + "px";
cloud.style.left = rand(0, 400) + "px";
```

随机数生成：用于随机生成云朵位置

~~~js
//随机生成n~m的随机数
//原random函数含头不含尾
function rand(n, m) {
    return n+parseInt(Math.random() * (m-n+1));
}
~~~

随机生成云朵

```javascript
function createCloud(n){
	console.log(n);
	for(var i = 0; i < n; i = i+1){
		var cloud = document.createElement("div");
		cloud.setAttribute("class", "cloud");
		cloud.style.cssText = "background-color: white;\
                              width: 50px; height: 50px;\
                              border-radius: 50%;\
                              background-color: #fff;\
                              box-shadow: #fff 65px -15px 0 -5px,#fff 25px -25px, #fff 30px 10px,#fff 60px 15px 0 -10px,#fff 85px 5px 0 -5px;\
                              position: absolute;";
        cloud.style.top = -5 + "px";
        cloud.style.left = rand(0, 400) + "px";
        box.appendChild(cloud);
        console.log("wdnmd");
     }
}
```

### 计时器

~~~js
var timer;
// 开始游戏
$("#begin").click(function(){
    clearInterval(timer);
    timer = setInterval(function(){})//在此处作动作
}
~~~

一次游戏即为一次无延迟的计时行为

```javascript
var timer;
// 开始游戏
$("#begin").click(function(){
        if(!isRunning){
            wukong.style.top = wukong.offsetTop-300 + "px";
        }
        isRunning = true;
        timer = setInterval(function(){
                
            var left = wukong.offsetLeft
            var top = wukong.offsetTop;
            if(top > 720){
                alert("你的高度：" + grade + "km");
                location.reload();
                isRunning = false;  
                clearInterval(timer);                 
            }

            wukong.style.top = top+speed + "px";
            var clouds = $(".cloud");
            if(clouds.length == 1){ createCloud(rand(1, 1)); }

               
            for(var i = 0; i < clouds.length; i++){
                clouds[i].style.top = clouds[i].offsetTop+1 + "px";
                if(crash(clouds[i], wukong)){
                    box.removeChild(clouds[i]);
                    jump();
                    grade = grade+12;
                    $("#tips h1[name=grade]").text(grade);
                    createCloud(rand(0, 1));
                }
                if(clouds[i].top > 720){
                    box.removeChild(clouds[i]);
                }
            }   
    	});            
});
```

## Clock

html 和 css 用的这个模板：[html up5](https://html5up.net/dimension)

通过时间戳和计时器动态显示当前经过时间

```javascript
// 当前轮次排名
let name = ["熊爹", "戴狗", "刘狗", "彭奇", "末狗", "俊逼"]
// 开始时间戳，0表示未参加，-1表示已退赛
var start = [ 1667320140631, 1667320940895, 1667492603114, 1668342367128, 0, 0 ];
// 记录当前轮次已退赛的成绩，将变成下一轮的 round
let reco = [ "", "", "", "", "", "" ];

// 历史最佳排名
let best_name = ["末末", "彭奇", "俊俊", "熊爹", "戴某", "刘帅"];
let best = [ "10 天 4 小时 0 分钟 0 秒", "10 天 0 小时 0 分钟 0 秒", "9 天 7 小时 0 分钟 0 秒", "尚无记录", "尚无记录", "尚无记录" ];
				
// 第 i 轮排名
let round1_name = ["末狗", "彭奇", "俊逼", "熊爹", "戴畜", "刘狗"];
let round1 = [ "10 天 4 小时 0 分钟 0 秒", "10 天 0 小时 0 分钟 0 秒", "9 天 7 小时 0 分钟 0 秒", "未参战", "未参战", "未参战" ];
				
function init(){
	for(let i = 0; i < start.length; i++){
						
		// 历史最佳名字和成绩
		document.getElementById("best"+i).innerHTML = best_name[i];
		document.getElementById("history"+i).innerHTML = best[i];

		// 第一轮名字和成绩
		document.getElementById("past1"+i).innerHTML = round1_name[i];
		document.getElementById("round1"+i).innerHTML = round1[i];

		// 当前轮次名字
		document.getElementById("name"+i).innerHTML = name[i];
 		// 当前轮次成绩
 		// 若起始时间戳为0,未参赛
 		if(start[i] == 0){ document.getElementById("clock"+i).innerHTML = "未参赛"; }
 		// 若起始时间戳为-1，已退赛
 		else if(start[i] == -1){ document.getElementById("clock"+i).innerHTML = reco[i]; }
 		// 打印时间差
 		else { setInterval(function(){myTimer(start[i], i)}, 1000); }
 	}
}

init();



function getDiff(start) {
 	let cur = new Date().getTime();
 	diff = cur-start;
 	var days = parseInt(diff / (1000 * 60 * 60 * 24));
 	var hours = parseInt((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
 	var minutes = parseInt((diff % (1000 * 60 * 60)) / (1000 * 60));
 	var seconds = ((diff % (1000 * 60)) / 1000).toFixed(0);

 	if(days < 10) { days = "0" + days; }
 	if(hours < 10) { hours = "0" + hours; }
 	if(minutes < 10) { minutes = "0" + minutes; }
 	if(seconds < 10) { seconds = "0" + seconds; }

 	return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒";
}

function exit(){
 	console.log("hahaha");
 	let index = document.getElementById("inquire").value;
 	let s = start[index];
 	if(s == 0){
 		document.getElementById("end").value = "未参赛";
 		return;
 	}
 	if(s == -1){
 		document.getElementById("end").value = "打了已经";
 		return;
 	}
 	let during = getDiff(s);
	document.getElementById("end").value = during;
}
				

function join(){
 	var time = document.getElementById("start");
 	time.value = new Date().getTime();
}


function myTimer(s, num){
 	diff = getDiff(s);
 	document.getElementById("clock" + num).innerHTML = diff;
}
```

