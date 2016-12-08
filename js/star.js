window.onload = function(){
	/* 1、设置画布的宽高值 */
	var w = document.documentElement.clientWidth || document.body.clientWidth;
	var h = document.documentElement.clientHeight || document.body.clientHeight;
	var canvas = document.getElementById("canvas");
	var ctxt = canvas.getContext("2d");
	var count = 200;//绘制的星星的个数
	var stars = [];//存储星星对象
	var deltaTime;//绘制帧动画时的时间间隔值
	var lastTime;//上一次出现的时间
	var starImg = new Image();//创建一个图片对象
	
	/* 2、绘制画布 */
	function drawCanvas(){
		var linear = ctxt.createLinearGradient(0,0,0,h);//线性绘制
		linear.addColorStop(0.7,"#11111e");//设置渐变颜色
		linear.addColorStop(1,"#0F1673");//设置渐变颜色
		ctxt.fillStyle = linear;//设置画布的填充样式
		ctxt.fillRect(0,0,w,h);//绘制画布
	}
	/* 2、绘制星星 */
	var Star = function(){
		this.x;//star的起始坐标x
		this.y;//star的起始坐标y
		this.startX;//开始绘制的星星的位置
		this.timer;//时间
	}
	/* 3、初始化，设置星星的坐标值*/
	Star.prototype.init = function(){
		/* 随机设置星的位置 */
		this.x = Math.random() * w;
		this.y = Math.random() * h;

		this.startX = Math.floor(Math.random() * 7);//随机设置星星的开始帧
		this.timer = 0;
	}
	/* 4、设置星星闪烁效果 */
	Star.prototype.twinkle = function(){
		this.timer += deltaTime;//
		if(this.timer > 50){
			this.startX += 1;
			if(this.startX%7 == 0){
				this.startX = 0;
			}
			this.timer = 0;
		}
	}
	/* 4、绘制星星图片 */
	Star.prototype.draw = function(){
		ctxt.save();
		/*drawImage(要使用的图像，开始坐标值X，开始坐标值Y，图像的宽度，图像的高度，画布上图像的X，画布上图像的Y，要使用的图像宽，要使用的图像的高)*/
		ctxt.drawImage(starImg,this.startX * 7,0,7,7,this.x,this.y,7,7);
		ctxt.restore();
	}
	function drawStars(){
		for(var i = 0;i < count;i++){
			stars[i].draw();
			stars[i].twinkle();
		}
	}
	// drawCanvas();
	/* 重复绘制 */
	function repeat(){
		window.requestAnimFrame(repeat);
		var now = Date.now();
		deltaTime = now-lastTime;
		lastTime = now;
		// console.log(deltaTime +":"+lastTime);
		drawCanvas();
		drawStars();
	}
	/* 画布初始化 */
	function init(){
		canvas.width = w;
		canvas.height = h;
		starImg.src = "img/star.png";
		for(var i = 0;i < count;i++){
			var obj = new Star();
			stars.push(obj);
			stars[i].init();
		}
		lastTime=Date.now();
		repeat();
	}
	init();
}