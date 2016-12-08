/***************** 1、歌曲列表的渲染 *********************/
var musicList = document.getElementById("musicList");
var song = musicList.getElementsByTagName("ul")[0];
var str = "";
function initData(){
	for(var i = 0;i < data.length;i++){
		str += '<li><i></i>' + data[i].song + ' - ' + data[i].singer + '</li>';
	}
	song.innerHTML = str;
}
initData();
/****************** 2、歌曲点击事件操作 *******************/
var lis = song.getElementsByTagName("li");
console.log(lis);
var needle = document.getElementById("needle");//指针的获取
var playing = document.getElementsByClassName("playing")[0];//唱片的旋转
var pic = document.getElementById("pic");

/****************** 3、歌曲操作按钮的获取 *****************/
var prev = document.getElementsByClassName("prev")[0];
var next = document.getElementsByClassName("next")[0];
var play = document.getElementsByClassName("play")[0];
play.flag = false;//默认为暂停状态

/****************** 4、时间的设置 *************************/
var start = document.getElementById("start");
var end = document.getElementById("end");

/****************** 5、滚动条的设置 ***********************/
var overall = document.getElementById("overall");
var progressing = document.getElementById("progressing");
var dot = document.getElementById("dot");
var progressWidth = overall.clientWidth;

var audio = document.getElementById("audio");
var music;//存储当前播放的歌曲信息
var timer = null;//定时器的设置
for(var i = 0;i < lis.length;i++){
	(function(n){
		lis[n].onclick = function(){
			audio.currentTime = 0;
			/* 2-1、清除样式 */
			clearStyle(this);
			 /* 2-2、获取歌曲数据 */
			for(var i = 0;i < data.length;i++){
				if(data[i].id == n+1){
					music = data[i];
				}
			}
			audio.num = music.id;
			audio.src = music.src;
			audio.play();
			/* 2-3、唱片转动 */
			diskRunning();
        	pic.src = music.img;
        	/* 2-4、播放暂停按钮的切换*/
        	changeStatus(true);
        	/* 2-5、时间的设置*/
        	timer = setInterval(setTimer,1000);
        	/* 2-6、歌词显示 */
        	getLyric();
		}
	})(i);
}
/******************* 6、自动播放下一首歌曲 ************/
audio.onended = function(){
	console.log(audio.currentTime);
	// audio.currentTime = 0;
	audio.num++;
	if(audio.num > data.length){
		audio.num = 1;
	}
	audio.currentTime = 0;
	/* 6-1、数据设置 */
	setData();
	/* 6-2、清除样式 */
	clearStyle(lis[audio.num-1]);
	changeStatus(true);
	console.log(audio.currentTime);
	audio.play();
	/* 6-3、歌词显示 */
	getLyric();
}
/******************* 7、上下曲切换 ***********************/
prev.onclick = function(){//切换上一首
	// audio.currentTime = 0;
	audio.num--;
	if(audio.num <= 0){
		audio.num = data.length;
	}
	/* 7-1-1、数据设置 */
	setData();	
	/* 7-1-2、清除样式 */
	clearStyle(lis[audio.num-1]);
	changeStatus(true);
	audio.play();
	/* 7-2-3、歌词显示 */
	console.log(data[audio.num-1]);
	getLyric();
}
next.onclick = function(){//切换下一首
	console.log(audio.currentTime);
	// audio.currentTime = 0;
	audio.num++;
	if(audio.num > data.length){
		audio.num = 1;
	}
	/* 7-2-1、数据设置 */
	setData();
	/* 7-2-2、清除样式 */
	clearStyle(lis[audio.num-1]);
	changeStatus(true);
	audio.play();
	/* 7-2-3、歌词显示 */
	getLyric();
}
/******************* 8、暂停和播放的切换 ********************/
play.onclick = function(){
	if(audio.src == ""){
		alert("请点击要播放的歌曲");
		return;
	}
	if(audio.paused){
		audio.play();
		diskRunning();
    	changeStatus(true);
        timer = setInterval(setTimer,1000);
   	}else{
		audio.pause();
		diskPause();
    	// changeStatus(false);
    	play.flag = status;//设置为播放状态
    	play.style.background = "url(img/play.png) no-repeat center";
    	clearInterval(timer);
	}
	// getLyric(data);
}
/******************* 9、歌词显示 **********************/
function getLyric(){
	// clearInterval(timer);
	var blur = document.getElementById("blur");//模糊度
	var lyrics = music.lyric;//获取歌词数据
	var lyricUl = document.getElementById("wrap").getElementsByTagName("ul")[0];//获取存放歌词的标签
	var lyricDiv = document.getElementById("wrap").getElementsByTagName("div")[0]
	var lyricArr = lyrics.split("[");//拆分歌词数据
	var strLyric = "";//用于拼接歌词
	var dataArr = [];
	blur.style.backgroundImage = "url(" + music.bigimg + ")";
	/* 9-1、歌词渲染 */
	for(var i = 0;i < lyricArr.length;i++){
		var arr = lyricArr[i].split("]");
		var time = arr[0].split(":");//分钟和秒的获取
		var sTime = parseFloat(parseFloat(time[0] * 60) + parseFloat(time[1]*1)).toFixed(1);//转换时间：秒数(不能直接使用time[1]加，这是字符串格式，需要先转换为number类型在进行计算)
		var singleLyric = arr[1];//单句歌词
		if(singleLyric){
			strLyric += "<li>" + singleLyric + "</li>";
		}
		dataArr.push({time:sTime,song:singleLyric});
	}
	lyricUl.innerHTML = strLyric;
	/* 9-2、歌词根据时间显示，当前一句为高亮 */
	var songs = lyricUl.getElementsByTagName("li");
	var timer = setInterval(function(){
		// clearInterval(timer);
		var current = parseFloat(audio.currentTime).toFixed(1);
		for(var i = 0;i < dataArr.length;i++){
			lyricUl.style.display = "block";
			if(Math.round(current) == Math.round(dataArr[i].time)){

				for(var j = 0;j < songs.length;j++){
					songs[j].className = "";
				}
				songs[i-1].className = "active";
				lyricUl.style.transition = "all 0.5s ease-in";
				lyricUl.style.top = 210 + (-30 * i) + "px";
			}
		}
	},10);
}
/******************* 10、频谱图 *********************/
var spectrum = document.getElementById("spectrum");
var can = document.getElementById("can");
var cont = can.getContext("2d");
can.width = 699;
can.height = 455;
/* 10-1、获取audioContext对象 */
window.AudioContext = window.AudioContext||
					  window.webkitAudioContext||
					  window.mozAudioContext;
/* 10-2、获取动画帧的兼容性写法 */			
window.requestAnimationFrame =  window.requestAnimationFrame ||
								window.webkitRequestAnimationFrame || 
								window.mozRequestAnimationFrame || 
								window.msRequestAnimationFrame;
var ac = new AudioContext();//获取音频对象
var analyser = ac.createAnalyser();//解析音频
var gainNode = ac.createGain();//音量控制
function analyserMusic(audio,ctxt,can){	
	var source = ac.createMediaElementSource(audio);//获取音频解析源
	source.connect(analyser);//创建音频连接点
	analyser.connect(gainNode);
	gainNode.connect(ac.destination);//连接音频扬声器
	
	var data = new Uint8Array(analyser.frequencyBinCount);
	var gradient = ctxt.createLinearGradient(0,0,0,700);
	gradient.addColorStop(1, "rgb(0, 0, 255)");
	gradient.addColorStop(0.7, "greenyellow");	
	gradient.addColorStop(0.05, "#faa");
	(function(){
		var arg = arguments;
		requestAnimationFrame(function(){//帧动画解析
			analyser.getByteFrequencyData(data);//将分析得到的数据添加到data中
			ctxt.clearRect(0, 0, 700, 455);
			var w = can.width/70;
			for(var i = 0;i < 512;i++){
				var h = data[i]/256 * can.height;
				ctxt.fillStyle = gradient;		
				ctxt.fillRect(w * i,350 - data[i],w * 0.5,data[i]);	
				ctxt.fillRect(w * i,350 - data[i] - w * 3,w * 0.5,w * 0.5);		
			}
			arg.callee();
		})
	})();
}
analyserMusic(audio,cont,can);
/******************* 11、歌曲展示样式切换 ********************/
var main = document.getElementById("main");
var changeBtn = document.getElementById("changeBtn");
main.onmouseover = function(){
	changeBtn.style.display = "block"; 
}
main.onmouseout = function(){
	changeBtn.style.display = "none";
}
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var musicDivs = document.getElementsByClassName("music");
var musicNum = 0;
nextBtn.onclick = function(){
	musicNum++;
	if(musicNum >= musicDivs.length){
		musicNum = 0;
	}
	for(var i = 0;i < musicDivs.length;i++){
		musicDivs[i].style.display = "none";
	}
	musicDivs[musicNum].style.display = "block";
}
prevBtn.onclick = function(){
	musicNum--;
	if(musicNum < 0){
		musicNum = musicDivs.length - 1;
	}
	for(var i = 0;i < musicDivs.length;i++){
		musicDivs[i].style.display = "none";
	}
	musicDivs[musicNum].style.display = "block";
}
/******************* 12、歌曲音量的控制 ********************/
/* 思路：需要求出百分比 */
var soundBar = document.getElementById("sound-bar");
var soundAll = document.getElementById("sound-all");//滚动条的总长度
var soundCur = document.getElementById("sound-cur");//滚动条的当前长度
var soundBtn = document.getElementById("sound-btn");//滚动条按钮
var pWidth = soundAll.getBoundingClientRect().width;//滚动条的总长度
var curWidth = soundCur.getBoundingClientRect().width;//当前宽度
var btnLeft = soundBtn.getBoundingClientRect().left - soundBar.getBoundingClientRect().left;
console.log(soundBar.getBoundingClientRect().left);
console.log(soundBtn.getBoundingClientRect().left);
soundBtn.onmousedown = function(e){
	var e = e || window.event;
	var startX = e.clientX;
	curWidth = soundCur.getBoundingClientRect().width;
	// btnLeft = soundBtn.offestLeft;
	btnLeft = soundBtn.getBoundingClientRect().left - soundBar.getBoundingClientRect().left;
	console.log(btnLeft);
	document.onmousemove = function(e){
		var e = e || window.event;
		var moveX = e.clientX - startX;
		// var scale = (curWidth + moveX)/pWidth;
		var wid = curWidth + moveX;
		if(wid > pWidth){
			wid = pWidth;
		}
		if(wid <= 0){}
		soundCur.style.width = wid + "px";
		soundBtn.style.left = btnLeft + moveX + "px";
	}
	document.onmouseup = function(e){
		var e = e || window.event;
		var endX = e.clientX;
		var percent = (endX - startX + curWidth)/pWidth;
		changeVol(percent);
		document.onmousemove = document.onmouseup = null;
	}
}
changeVol(curWidth/pWidth);
/******************* 改变音量函数 ********************/
function changeVol(percent){
	gainNode.gain.value = percent * percent;
}
/******************* 设置数据函数 *********************/
function setData(){
	for(var i = 0;i < data.length;i++){
		if(audio.num == data[i].id){
			music = data[i];
		}
		audio.src = music.src;
		pic.src = music.img;
	}	
}
/******************* 清除样式函数 *********************/
function clearStyle(obj){
	for(var  i = 0;i < lis.length;i++){
		lis[i].className = "";
	}
	obj.className = "active";
}
/************** 切换按钮播放暂停状态函数 **************/
function changeStatus(status){
	play.flag = status;//设置为播放状态
    play.style.background = "url(img/pause.png) no-repeat center";
}
/******************* 唱片转动函数 *********************/
function diskPause(){//暂停
	needle.className = "";
	playing.style.animationPlayState="paused";
	playing.style.WebkitAnimationPlayState="paused";
}
function diskRunning(){//旋转
	needle.className = "active";
	playing.style.animationPlayState="running";
	playing.style.WebkitAnimationPlayState="running";
}
/******************* 定时器函数 ***********************/
function setTimer(){
	var curTime = toTime(audio,"currentTime");
	var durTime = toTime(audio,"duration");
	var scale = (audio.currentTime)/(audio.duration);
	start.innerHTML = curTime;
	end.innerHTML = durTime;
	/* 滚动条设置 */
	progressing.style.width = progressWidth * scale + "px";
	dot.style.left = progressWidth * scale + 10 + "px";
}
/******************* 时间转化函数 *********************/
function toTime(obj,attr){
	var t = obj[attr];
	var m = parseInt(t%3600/60);
	var s = parseInt(t%60);
	return toDouble(m) + ":" + toDouble(s);
}
/******************* 单变双函数 ***********************/
function toDouble(n){
	return n>9?n:"0"+n;
}
