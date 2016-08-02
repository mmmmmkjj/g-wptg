$(document).on("touchstart",function(e) {
	e.preventDefault();
});
$("input").on("touchstart",function() {
	$(this).focus();
});
//首页三个说明
$(".info_btn").on("touchstart",function(e) {
	var index = $(this).index()-2;
	$(".page_wrap").eq(index).css("display","block");
});
$(".close_info_page").on("touchstart",function() {
	$(this).parents(".page_wrap").css("display","none");
});
//开始
$(".start").on("touchstart",function() {
	$(".face").fadeOut(1000);
	$(".round1").fadeIn(1000);
});
//分数
var score = 0;
//第一关
var touchNumber = 0;
var round2_arr = [];
$(".choice_ul>li").on("touchstart",function() {
	$(".ancer_div").eq(touchNumber).html($(this).html());
	touchNumber ++;
//	console.log(touchNumber);
	round2_arr.push($(this).html());
	if(touchNumber >= 4) {
		setTimeout(function() {
			$(".round1").fadeOut(1000);
			$(".round2").fadeIn(1000);
			if(round2_arr.join("") == "王牌特工") {
				score ++;
			}
			console.log(score);
		},500);
	};
});
//第二关
$(".round2>div").on("touchstart",function() {
	if($(this).index() == 0) {
		score ++;
	}
	$(".round2").fadeOut(1000);
	$(".round3").fadeIn(1000);
	console.log(score);
});
//第三关
$(".round3_start>div").on("touchstart",function() {
	$(this).fadeOut();
	$(this).next().fadeIn();
	var puz = new puzzle({"img": "img/pt.jpg"});
	$(".round3_start>ul").animate({
		left: "-0.6rem"
	},3000,function() {
		$(".chart_warp").css({
			"background": "none"
		})
		$(".round3_start_wrap").fadeOut();
		round3_timer();
		puz.gameStart();
	});
});
//倒计时
var puzzle_timer = null;
function round3_timer() {
	var t = 30;
	puzzle_timer = setInterval(function() {
		t -= 0.01;
		if(t <= 0) {
			clearInterval(puzzle_timer);
			setTimeout(function() {
				$(".lose").fadeIn();
			},500);
		}
		t = t.toFixed(2);
		$(".round3_timer").html(t+'"');
	},10);
}
$(".lose1").on("touchstart",function() {
//	$(this).parent().fadeOut();
	location.reload();
});
$(".lose2").on("touchstart",function() {
	$(this).parent().fadeOut();
	$(".round3").fadeOut();
	$(".round4").fadeIn(1000);
	var f = new createFB(".round4");
});
//拼图对象
function puzzle(obj) {
	this.imgUrl = obj.img || "";
	this.imgArea = $(".round3 .round3_wrap .chart_warp");//图片显示区域
	this.rlevel = 3;//行列数
	this.clevel = 3
	this.imgWidth = this.imgArea.width();
	this.imgHeight = this.imgArea.height();
	this.cellWidth = this.imgWidth / this.clevel;
	this.cellHeight = this.imgHeight / this.rlevel;
	this.imgCells = "";//记录图片节点的变量
	//原图大小 581 * 581
	this.origSize = 581;
	this.scale = this.imgWidth / this.origSize;
	this.imgOrigArr = [];//正确排列
	this.imgRandArr = [];//打乱排列
	
	this.aniTime = 400;
	this.init();
	
}
puzzle.prototype.init = function() {
	this.imgSplit();
//	this.gameStart();
}
//切割图片
puzzle.prototype.imgSplit = function() {
	this.imgOrigArr = [];//清空正确排序数组
//	this.imgArea.html("");
	var cell = "";
	for(var i = 0;i < this.rlevel; i ++) {
		for(var j = 0;j < this.clevel; j ++) {
			this.imgOrigArr.push(i * this.clevel + j);
			cell = $("<li/>").css({
				"width": this.cellWidth-2,
				"height": this.cellHeight-2,
				"border": "1px solid #ccc",
				"background": "url(" + this.imgUrl + ")",
				"backgroundPosition": (-j) * this.cellWidth + "px " + (-i) * this.cellHeight + "px",
				"backgroundSize": this.origSize * this.scale + "px " + this.origSize * this.scale +"px",
				"left": j%this.rlevel * this.cellHeight + "px",
				"top": i % this.clevel * this.cellWidth + "px",
				"position": "absolute"
			});
			this.imgArea.append(cell);
		}
	}
			console.log(this.imgOrigArr)
	this.imgCells = $(".round3 .round3_wrap .chart_warp>li");//碎片节点
}
//随机碎片位置
puzzle.prototype.randomArr = function() {
	this.imgRandArr = [];//清空数组
	var order;//记录随机数，记录图片放在什么位置
	var len = this.imgOrigArr.length;
	for(var i = 0;i < len;i ++) {
		order = this.random(0,len);
		if(this.imgRandArr.length > 0) {
			while(jQuery.inArray(order,this.imgRandArr) > -1) {//去掉重复
				order = this.random(0,len);
			}
		}
		this.imgRandArr.push(order);
	}
	return;
}
puzzle.prototype.random = function(min,max) {
	return parseInt(Math.random() * (max - min)) + min;
}
puzzle.prototype.cellOrder = function(arr) {
	for(var i = 0;i < arr.length;i ++) {
		this.imgCells.eq(i).animate({
			"left": arr[i] % this.rlevel * this.cellWidth + "px",
			"top": Math.floor(arr[i]/this.clevel) * this.cellHeight + "px",
		},this.aniTime);
	}
}
//计算被拖动的碎片下标
puzzle.prototype.cellChangeIndex = function(x,y,orig) {
	if(x < 0 || x > this.imgWidth || y < 0 || y > this.imgHeight) {
		return orig;
	}
	var row = Math.floor(y / this.cellHeight),
		col = Math.floor(x / this.cellWidth),
		locations = row * this.clevel + col;
	var i = 0, len = this.imgRandArr.length;
	while((i < len) && (this.imgRandArr[i] != locations)) {
		i ++;
	}
	return i;
}
//放回原处
puzzle.prototype.cellReturn = function(index) {
	var row = Math.floor(this.imgRandArr[index] / this.clevel);
	var col = this.imgRandArr[index] % this.rlevel;
	this.imgCells.eq(index).animate({
		"top": row * this.cellHeight,
		"left": col * this.cellWidth
	},this.aniTime,function() {
		$(this).css("z-index", "10");
	});
}
//交换
puzzle.prototype.cellExchange = function(from, to) {
	var _this = this;
	var rowFrom = Math.floor(this.imgRandArr[from] / this.clevel),
		colFrom = this.imgRandArr[from] % this.clevel,
		rowTo = Math.floor(this.imgRandArr[to] / this.clevel),
		colTo = this.imgRandArr[to] % this.clevel;
	var temp = this.imgRandArr[from];
	console.log(rowFrom +"," + colFrom + "," + rowTo + "," + colTo)
	//被拖动碎片
	this.imgCells.eq(from).animate({
		"top": rowTo * this.cellHeight,
		"left": colTo * this.cellWidth
	},400,function() {
		$(this).css("z-index", "10");
	});
	console.log("form,to="+from + " ，" + to)
	//目标碎片
	this.imgCells.eq(to).animate({
		"top": rowFrom * this.cellHeight,
		"left": colFrom * this.cellWidth
	},this.aniTime,function() {
		console.log("change1")
		$(this).css("z-index", "10");
		//交换下标
		_this.imgRandArr[from] = _this.imgRandArr[to];
		_this.imgRandArr[to] = temp;
		if(_this.imgOrigArr.toString() == _this.imgRandArr.toString()) {
			_this.success();
		}
	});
}
//成功之后
puzzle.prototype.success = function() {
	$(".round3_success").fadeIn();
	clearInterval(puzzle_timer);
}
//开始游戏
puzzle.prototype.gameStart = function() {
	this.randomArr();
	this.cellOrder(this.imgRandArr);
	var _this = this;
	this.imgCells.bind("touchstart",function(ev) {
		var cellIndex_1 = $(this).index();
		var cell_mouse_x = ev.originalEvent.changedTouches[0].clientX - _this.imgCells.eq(cellIndex_1).offset().left;
		var cell_mouse_y = ev.originalEvent.changedTouches[0].clientY - _this.imgCells.eq(cellIndex_1).offset().top;
		$(document).bind("touchmove", function(e) {
			_this.imgCells.eq(cellIndex_1).css({
				"z-index": "40",
				"left": (e.originalEvent.changedTouches[0].clientX - cell_mouse_x - _this.imgArea.offset().left) + "px",
				"top": (e.originalEvent.changedTouches[0].clientY - cell_mouse_y - _this.imgArea.offset().top) + "px"
			});
		});
		$(document).bind("touchend",function(e) {
			$(document).unbind("touchmove").unbind("touchend");
			//目标碎片下标
			var cellIndex_2 = _this.cellChangeIndex((e.originalEvent.changedTouches[0].clientX - _this.imgArea.offset().left), (e.originalEvent.changedTouches[0].clientY - _this.imgArea.offset().top), cellIndex_1);
			
			//交换
			if(cellIndex_1 == cellIndex_2) {
				_this.cellReturn(cellIndex_1);
			}else {
				_this.cellExchange(cellIndex_1, cellIndex_2);
			}
		});
	});
}
//第四关
$(".round3_success>button").on("touchstart",function() {
	score ++;
	$(".round3").fadeOut(1000);
	$(".round4").fadeIn(1000);
	var f = new createFB(".round4");
});
//飞镖对象
var fb_sl = 3;
function createFB(par) {
	this.fb = $("<div/>").addClass("ball").appendTo(par);
	this.width = this.fb.width();
	this.height = this.fb.height();
	this.wHeight = this.fb.parent().height();
	this.wWidth = this.fb.parent().width();
	this.scale = 0.6;
	this.defaultPos = 0;
	this.disX = 0;										
	this.disY = 0;	
	this._x = 0;	
	this._y = 0;
	this.endX = 0;
	this.endY = 0;
	this.step = 3;
	this.timer = null;
	this.sum = 0;
	this.num = 0;
	this.deVx = this.calcVy(this.sum);
	this.vx = 0;
	this.vy = this.deVx;
	this.g = 1;
	this.maxPos = 0;
	this.distance = 0;
	this.gameState = true;
	
	this.isRebound7 = true;
	this.isRebound8 = true;
	this.record = 0;	
	
	this.init();
}
createFB.prototype.createDIV = function() {
	$("<div/>").addClass("ball").appendTo(".round4");
}
createFB.prototype.init = function() {
	this.initPosition();
	var _this = this;
	this.fb.on("touchstart",function(ev) {
		_this.touchStrat(ev, _this);
	});
}
createFB.prototype.touchStrat = function(ev, _this) {
	if(!_this.gameState) {
		return false;
	}
	_this.fnReset();
	var x = ev.originalEvent.changedTouches[0].clientX, y = ev.originalEvent.changedTouches[0].clientY;
	_this.disX = x - _this.fb.position().left;
	_this.disY = y - _this.fb.position().top;
	_this.fb.css({
		"left": x - _this.width * 0.5,
		"top": y - _this.height * 0.6
	});
	$(document).on("touchmove", function(e) {
		_this.touchMove(e,_this)
	});
	$(document).on("touchend", function(e) {
		_this.touchEnd(e, _this);
	});
	fb_sl=fb_sl-1;
	if(fb_sl==2){
		$(".fb_3").css({"display":"none"});
	}
	if(fb_sl==1){
		$(".fb_2").css({"display":"none"});
	}
	if(fb_sl==0){
		$(".fb_1").css({"display":"none"});
	}
}
createFB.prototype.touchMove = function(e,_this) {
	var left = e.originalEvent.changedTouches[0].clientX - _this.disX,
		top = e.originalEvent.changedTouches[0].clientY - _this.disY;
	if(left < 0) {
		left = 0;
	}else if(left > _this.wWidth - _this.width) {
		left = _this.wWidth - _this.width
	}
	if(top < _this.wHeight * 0.65) {
		_this.fb.trigger("touchend");
		_this.fb.off();
		_this.fb.on('touchstart',function(ev){
			_this.touchStrat(ev,_this);
		});
		return false;
	}else if(top > _this.wHeight - _this.height* 0.6) {
		top = _this.wHeight - _this.height* 0.6;
	}
	_this.fb.css({
		"left": left,
		"top": top
	});
}
createFB.prototype.touchEnd = function(e, _this) {
	_this.fb.off();
	this.fb.on("touchstart", function(ev) {
		_this.touchStrat(ev, _this);
	});
	_this.defaultPos = _this.fb.position().top;
	_this._x = _this.fb.position().left;
	_this._y = _this.fb.position().top;
	_this.endX = _this.fb.position().left;
	_this.endY = _this.fb.position().top;
	this.update(_this);
	console.log(_this._x + "，" + _this._y + "," + _this.endX + "," + _this.endY)
}
createFB.prototype.update = function(_this) {
	var fs = this.wHeight * 0.8 - this.endY;
	if(this.endX < this.wWidth * 0.3 || this.endX > this.wWidth * 0.7 || fs > this.wHeight * 0.2) {
		console.log(1)
		this.updateInterval(_this,function() {
			if(!_this.maxPos && _this.vy + _this.g >=0) {
				_this.maxPos = _this.fb.position().top;
				_this.distance = (_this.defaultPos - _this.maxPos) * 0.15;
				_this.fb.css({
					"z-index": "1"
				});
				_this.fb.css({
					"-webkit-transition": "-webkit-transform 1.5s, opacity 0.6s",
					"-webkit-transform": "translateX(30px) scale(0.01)",
					"opacity": "0"
				});
				
				if(fb_sl == 0) {
					/**
					 * 	setTimeOut 
					 */
					if(score < 3) {
						_this.lose();
					}else {
						_this.success();
					}
					console.log("score="+score)
				}
				setTimeout(function(){
					clearInterval(_this.timer);
					_this.fb.css({'-webkit-transition':'0s','-webkit-transform': 'translateX(0px) scale(1)','opacity':'1','top':_this.wHeight-_this.wWidth*0.3,'left':'41%' });
				}, 1000);
			}
		});
	}else{
		console.log(2)
		this.updateInterval(_this,function(){
		});
		
		/**
		 * 	setTimeOut 
		 */
		if(score < 3) {
			_this.lose();
		}else {
			_this.success();
		}
		console.log("score="+score)
	}
}
createFB.prototype.updateInterval = function(_this,fn) {
	_this.fb.css({
		"-webkit-transform": "scale("+this.scale+") translateX("+ (1-this.scale) * this.width/2 + "px)",
		"-webkit-transition": "-webkit-transform 0.4s"
	});
	clearInterval(this.timer);
	this.timer = setInterval(function(_this) {
		_this._x += _this.vx;
		_this._y += _this.vy;
		_this.vy += _this.g;
		if(_this.vx && _this._y > _this.wHeight * 0.4) {
			_this.vx = 0;
		}
		fn();
		_this.fb.css({
			"left": _this._x,
			"top": _this._y
		});
		if(_this.isRebound7 && _this.vy < 0) {
			_this.isRebound7 = false;
		}else if(_this.isRebound8 && _this.vy >=0) {
			_this.isRebound8 = false;
			clearInterval(_this.timer);
			return false;
		}
	},1000/60,this);
}
createFB.prototype.initPosition = function() {
	this.fb.css({
		"top": this.wHeight - this.wWidth * 0.2
	});
}
createFB.prototype.lose = function(_this) {
	setTimeout(function() {
		$(".round4").fadeOut(500);
		$(".end").fadeIn(500);
	},700);
}
createFB.prototype.success = function() {
	$(".round4").fadeOut(500);
	$("._end").css({
		"background": "url(img/c1.jpg)",
		"backgroundSize": "100% 100%"
	});
	$("._end>.right").css({
		"background": "url(img/lz1.png) no-repeat",
		"backgroundSize": "100% 100%",
		"top": "42%",
		"left": "0.05rem"
	});
	$("._end").fadeIn(500);
}
createFB.prototype.calcVy = function(sum){
	if(this.sum>=this.wHeight*0.45){
		return -this.num;
	}else{
		this.num++;
		this.sum = sum;
		return this.calcVy(this.sum + this.num);
	}
};
createFB.prototype.fnReset = function() {
	this.defaultPos = 0;
	this.g = 1;											
	this.vx = 0;										
	this.vy = this.deVx;;										
	this.scale = 0.6;										
	this.isRebound7 = true;
	this.isRebound8 = true;
	this.maxPos = 0;
	this.distance = 0;
	this.record = 0;	
	clearInterval(this.timer);
	this.fb.css({'z-index': '2','-webkit-transition':'-webkit-transform 0.9s' });
}
$(".end>.end1,._end>._end1").on("touchstart",function() {
	location.reload();
});
$(".end>.end2,._end>._end2").on("touchstart",function() {
	$(".end").fadeOut(500);
	$(".face").css("display","block");
	$(".page1_tc3_wrap").css("display","block");
});
$(".end>.end3").on("touchstart",function() {
	$(".end").fadeOut(500);
	$("._end").css({
		"background": "url(img/c2.jpg)",
		"backgroundSize": "100% 100%"
	});
	$("._end>.right").css({
		"background": "url(img/lz3.png)",
		"backgroundSize": "100% 100%",
		"left": "0.08rem",
        "top": "38%"
	});
	$("._end").css("display","block");
});